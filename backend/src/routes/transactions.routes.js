// Direct-payment transaction routes.
// Paystack splits each payment at the moment of payment: the seller's share goes to
// the seller's bank account and ADY's commission goes to ADY's account.
// ADY does not hold buyer money. Statuses:
//   PENDING -> PAID -> COMPLETED
//                   -> DISPUTED -> REFUNDED | COMPLETED
const express = require("express");
const prisma = require("../prismaClient");
const { requireAuth, requireVerified } = require("../middleware/auth");
const paystack = require("../services/paystack");

const router = express.Router();

// Fee model: buyer pays 3% on top of the price, seller pays 2% out of the price.
const BUYER_FEE_PERCENT = Number(process.env.BUYER_FEE_PERCENT || 3);
const SELLER_FEE_PERCENT = Number(process.env.SELLER_FEE_PERCENT || 2);

// Launch limits for the Pay button, in naira. Change with env vars, no code edit needed.
const PAY_MIN_NAIRA = Number(process.env.PAY_MIN_NAIRA || 5000);
const PAY_MAX_NAIRA = Number(process.env.PAY_MAX_NAIRA || 20000);

const REPORT_WINDOW_HOURS = Number(process.env.REPORT_WINDOW_HOURS || 48);
const REPAY_DAYS = Number(process.env.REPAY_DAYS || 3);

const RESERVED_TEST_TLDS = [".test", ".example", ".invalid", ".localhost"];
function paystackSafeEmail(email) {
  const lower = email.toLowerCase();
  for (const tld of RESERVED_TEST_TLDS) {
    if (lower.endsWith(tld)) {
      return email.slice(0, -tld.length) + ".ady-testaccount.com";
    }
  }
  return email;
}

router.post("/", requireAuth, requireVerified, async (req, res) => {
  try {
    const { listingId, inspectionAccepted } = req.body;
    if (!listingId) {
      return res.status(400).json({ error: "listingId is required" });
    }
    if (inspectionAccepted !== true) {
      return res.status(400).json({
        error: "Please inspect the item in person and tick the box to confirm you accept its condition before you pay.",
      });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (listing.status !== "ACTIVE") {
      return res.status(400).json({ error: "This listing is not available for purchase" });
    }
    if (listing.quantity < 1) {
      return res.status(400).json({ error: "This item is sold out." });
    }
    if (listing.seller.id === req.user.id) {
      return res.status(400).json({ error: "You cannot buy your own listing" });
    }
    if (!listing.seller.paystackSubaccountCode) {
      return res.status(400).json({
        error: "This seller has not connected a bank account yet, so payment through the app is not available for this item.",
      });
    }
    if (listing.price < PAY_MIN_NAIRA || listing.price > PAY_MAX_NAIRA) {
      return res.status(400).json({
        error: `Payment through the app works for items from ₦${PAY_MIN_NAIRA.toLocaleString("en-NG")} to ₦${PAY_MAX_NAIRA.toLocaleString("en-NG")}.`,
      });
    }

    const itemAmountKobo = Math.round(listing.price * 100);
    const buyerFeeKobo = Math.round(itemAmountKobo * (BUYER_FEE_PERCENT / 100));
    const sellerFeeKobo = Math.round(itemAmountKobo * (SELLER_FEE_PERCENT / 100));
    const platformFeeKobo = buyerFeeKobo + sellerFeeKobo; // ADY's total commission
    const totalAmountKobo = itemAmountKobo + buyerFeeKobo; // what the buyer pays

    const transaction = await prisma.transaction.create({
      data: {
        listingId: listing.id,
        buyerId: req.user.id,
        sellerId: listing.seller.id,
        itemAmount: itemAmountKobo,
        platformFee: platformFeeKobo,
        totalAmount: totalAmountKobo,
        status: "PENDING",
        inspectionAcceptedAt: new Date(),
      },
    });

    const buyer = await prisma.user.findUnique({ where: { id: req.user.id } });

    const initResult = await paystack.initializeTransaction({
      email: paystackSafeEmail(buyer.email),
      amountKobo: totalAmountKobo,
      reference: transaction.id,
      subaccountCode: listing.seller.paystackSubaccountCode,
      platformFeeKobo,
      callbackUrl: `${process.env.FRONTEND_URL}/transactions/${transaction.id}/callback`,
    });

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { providerReference: transaction.id },
    });

    return res.json({
      transaction,
      authorizationUrl: initResult.data.authorization_url,
    });
  } catch (err) {
    console.error("create transaction error:", err);
    return res.status(500).json({ error: "Failed to initiate payment" });
  }
});

router.get("/mine/:listingId", requireAuth, async (req, res) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      listingId: req.params.listingId,
      OR: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ transaction });
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: { listing: true },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    if (transaction.buyerId !== req.user.id && transaction.sellerId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to view this transaction" });
    }
    return res.json(transaction);
  } catch (err) {
    console.error("get transaction error:", err);
    return res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

router.post("/:id/confirm-received", requireAuth, async (req, res) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    if (transaction.buyerId !== req.user.id) {
      return res.status(403).json({ error: "Only the buyer can confirm receipt" });
    }
    if (transaction.status !== "PAID") {
      return res.status(400).json({ error: `Cannot confirm. This sale is ${transaction.status}.` });
    }

    await releaseTransactionFunds(transaction.id);

    return res.json({ message: "Thanks. The sale is confirmed." });
  } catch (err) {
    console.error("confirm-received error:", err);
    return res.status(500).json({ error: "Failed to confirm receipt" });
  }
});

router.post("/:id/dispute", requireAuth, async (req, res) => {
  try {
    const { reason, details } = req.body;
    if (!reason) {
      return res.status(400).json({ error: "reason is required" });
    }
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    if (transaction.buyerId !== req.user.id) {
      return res.status(403).json({ error: "Only the buyer can report a problem" });
    }
    if (transaction.status !== "PAID") {
      return res.status(400).json({ error: `Cannot report a problem. This sale is ${transaction.status}.` });
    }
    const windowMs = REPORT_WINDOW_HOURS * 60 * 60 * 1000;
    if (!transaction.paidAt || Date.now() - new Date(transaction.paidAt).getTime() > windowMs) {
      return res.status(400).json({
        error: `The ${REPORT_WINDOW_HOURS} hour window to report a problem has passed, so this sale is final.`,
      });
    }

    const dispute = await prisma.dispute.create({
      data: {
        listingId: transaction.listingId,
        reason,
        details,
        buyerId: transaction.buyerId,
        sellerId: transaction.sellerId,
      },
    });

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "DISPUTED", disputeId: dispute.id },
    });

    return res.json({ message: "Problem reported. Our team will review both sides and decide within 5 working days.", dispute });
  } catch (err) {
    console.error("dispute transaction error:", err);
    return res.status(500).json({ error: "Failed to report the problem" });
  }
});

// The sale is final: either the buyer confirmed, or an admin decided for the seller.
// No money moves here, because Paystack already paid the seller at payment time.
async function releaseTransactionFunds(transactionId) {
  const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!transaction) throw new Error("Transaction not found");
  if (!["PAID", "DISPUTED"].includes(transaction.status)) {
    throw new Error(`Cannot complete. This sale is ${transaction.status}.`);
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "COMPLETED", releasedAt: new Date() },
  });
}

// The admin decided for the buyer. ADY refunds the buyer from its Paystack balance,
// then the seller owes the amount back to ADY within REPAY_DAYS.
async function refundTransactionToBuyer(transactionId) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction) throw new Error("Transaction not found");
  if (!["PAID", "DISPUTED"].includes(transaction.status)) {
    throw new Error(`Cannot refund. This sale is ${transaction.status}.`);
  }
  if (!transaction.providerReference) {
    throw new Error("This transaction has no payment reference to refund");
  }

  await paystack.refundTransaction(transaction.providerReference, transaction.totalAmount);

  const dueAt = new Date(Date.now() + REPAY_DAYS * 24 * 60 * 60 * 1000);
  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "REFUNDED", refundedAt: new Date(), sellerRepayDueAt: dueAt },
  });

  // The buyer got the money back, so the unit goes back on sale.
  // A listing the seller marked sold by hand stays sold: only a sold-out listing reopens.
  const listing = await prisma.listing.findUnique({ where: { id: transaction.listingId } });
  if (listing) {
    const soldOut = listing.quantity <= 0 && listing.status === "SOLD";
    await prisma.listing.update({
      where: { id: listing.id },
      data: { quantity: { increment: 1 }, ...(soldOut ? { status: "ACTIVE" } : {}) },
    });
  }
}

module.exports = router;
module.exports.releaseTransactionFunds = releaseTransactionFunds;
module.exports.refundTransactionToBuyer = refundTransactionToBuyer;

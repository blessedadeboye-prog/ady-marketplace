import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { api } from "../api/client";
import { resolveUploadUrl } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { formatNaira, CONDITION_LABEL } from "../components/ListingCard";
import Badges from "../components/Badges";
import CopyButton from "../components/CopyButton";

const REPORT_REASONS = [
  "Suspected scam",
  "Fake item",
  "Stolen property",
  "Wrong description",
  "Counterfeit",
  "Offensive content",
  "Seller requesting payment outside platform",
  "Other",
];

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportStatus, setReportStatus] = useState("");

  const [showReview, setShowReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ itemMatched: true, communication: 5, experience: 5, comment: "" });
  const [reviewStatus, setReviewStatus] = useState("");

  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDetails, setDisputeDetails] = useState("");
  const [disputeStatus, setDisputeStatus] = useState("");

  const [transaction, setTransaction] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [payingNow, setPayingNow] = useState(false);
  const [inspectionTick, setInspectionTick] = useState(false);

  useEffect(() => {
    api.getListing(id).then((d) => setListing(d.listing)).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (user) {
      api.getMyTransactionForListing(id).then((d) => setTransaction(d.transaction)).catch(() => {});
    }
  }, [id, user]);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!user) return navigate("/login", { state: { from: `/listing/${id}` } });
    setMessageStatus("");
    try {
      await api.sendMessage({ listingId: id, content: messageText });
      setMessageText("");
      setMessageStatus("Message sent! Check Messages to continue the conversation.");
    } catch (err) {
      setMessageStatus(err.message);
    }
  }

  async function handleReport(e) {
    e.preventDefault();
    if (!user) return navigate("/login", { state: { from: `/listing/${id}` } });
    try {
      await api.fileReport({ listingId: id, reason: reportReason });
      setReportStatus("Report submitted. Our team will review this listing.");
      setShowReport(false);
    } catch (err) {
      setReportStatus(err.message);
    }
  }

  async function handleReview(e) {
    e.preventDefault();
    try {
      await api.createReview({ listingId: id, ...reviewForm });
      setReviewStatus("Thanks — your review has been submitted.");
      setShowReview(false);
    } catch (err) {
      setReviewStatus(err.message);
    }
  }

  async function handleDispute(e) {
    e.preventDefault();
    try {
      await api.openDispute({ listingId: id, reason: disputeReason, details: disputeDetails });
      setDisputeStatus("Dispute opened. An admin will review the transaction and get back to you.");
      setShowDispute(false);
    } catch (err) {
      setDisputeStatus(err.message);
    }
  }

  async function handleBuyNow() {
    if (!user) return navigate("/login", { state: { from: `/listing/${id}` } });
    setPaymentStatus("");
    setPayingNow(true);
    try {
      const data = await api.createTransaction(id, inspectionTick);
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setPaymentStatus(err.message);
      setPayingNow(false);
    }
  }

  async function handleConfirmReceived() {
    setPaymentStatus("");
    try {
      await api.confirmTransactionReceived(transaction.id);
      setTransaction({ ...transaction, status: "COMPLETED" });
      setPaymentStatus("Thanks for confirming. Don't forget to leave a review!");
    } catch (err) {
      setPaymentStatus(err.message);
    }
  }

  async function handleDisputePayment(reason) {
    setPaymentStatus("");
    try {
      await api.disputeTransaction(transaction.id, reason, "Raised from the listing page.");
      setTransaction({ ...transaction, status: "DISPUTED" });
      setPaymentStatus("Problem reported. Our team will review both sides and decide within 5 working days.");
    } catch (err) {
      setPaymentStatus(err.message);
    }
  }

  if (error) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm text-red-600">{error}</div>;
  if (!listing) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm text-ink-500">Loading...</div>;

  const isOwner = user?.id === listing.seller.id;
  const canReviewOrDispute = user && !isOwner && listing.status === "SOLD";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-ink-100 mb-3 relative">
          {listing.images[activeImage] ? (
            <img src={resolveUploadUrl(listing.images[activeImage].url)} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-300">No photo</div>
          )}
          {listing.itemVerified && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              <CheckCircle2 size={14} /> Item Inspected
            </span>
          )}
        </div>
        {listing.images.length > 1 && (
          <div className="flex gap-2">
            {listing.images.map((img, i) => (
              <button key={img.id} onClick={() => setActiveImage(i)} className={`w-14 h-14 rounded-md overflow-hidden border-2 ${i === activeImage ? "border-brand-500" : "border-transparent"}`}>
                <img src={resolveUploadUrl(img.url)} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            {listing.status !== "ACTIVE" && (
              <span className="inline-block mb-2 text-xs px-2 py-1 rounded-full bg-ink-100 text-ink-500 font-medium">{listing.status.replace("_", " ")}</span>
            )}
            <h1 className="text-2xl font-semibold">{listing.title}</h1>
          </div>
          <CopyButton text={`${window.location.origin}/listing/${id}`} label="Copy link" />
        </div>
        <p className="text-2xl text-brand-600 font-semibold mt-2">{formatNaira(listing.price)}</p>
        <p className="text-sm text-ink-500 mt-1">{CONDITION_LABEL[listing.condition]} · {listing.location} · {listing.category?.name}</p>

        <p className="mt-4 text-sm whitespace-pre-line">{listing.description}</p>

        <div className="mt-6 border-t border-ink-300/40 pt-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-ink-100 overflow-hidden shrink-0">
            {listing.seller.avatarUrl && <img src={resolveUploadUrl(listing.seller.avatarUrl)} className="w-full h-full object-cover" />}
          </div>
          <div>
            <Link to={`/profile?user=${listing.seller.id}`} className="text-sm font-medium hover:underline">{listing.seller.name}</Link>
            {listing.seller.ratingCount > 0 && (
              <p className="text-xs text-ink-500">{listing.seller.rating.toFixed(1)}★ ({listing.seller.ratingCount} reviews)</p>
            )}
            <div className="mt-1"><Badges badges={listing.seller.badges} /></div>
          </div>
        </div>

        {!isOwner && listing.status === "ACTIVE" && !transaction && listing.canPay && (
          <div className="mt-4 border border-brand-200 bg-brand-50 rounded-md p-3">
            <p className="text-sm font-medium mb-1">Inspect first, then pay in the app</p>
            <p className="text-xs text-ink-500 mb-2">
              Meet the seller in a public spot and check the item. Pay only when you are happy with it.
              You pay {formatNaira(Math.round(listing.price * 1.03))}, which is the price plus a 3% fee.
              Payment goes straight to the seller's bank account.
            </p>
            <label className="flex items-start gap-2 text-xs mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inspectionTick}
                onChange={(e) => setInspectionTick(e.target.checked)}
                className="mt-0.5"
              />
              <span>I inspected this item and accept its condition.</span>
            </label>
            <button
              onClick={handleBuyNow}
              disabled={payingNow || !inspectionTick}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-md py-2 text-sm font-medium disabled:opacity-60"
            >
              {payingNow ? "Redirecting to payment..." : `Pay ${formatNaira(Math.round(listing.price * 1.03))}`}
            </button>
          </div>
        )}

        {!isOwner && listing.status === "ACTIVE" && !transaction && !listing.canPay && (
          <p className="mt-4 text-xs text-ink-500">
            Payment in the app works for items from {formatNaira(listing.payLimits?.min ?? 5000)} to {formatNaira(listing.payLimits?.max ?? 20000)}
            {" "}from sellers who connected a bank account. Otherwise, meet in person and follow the Safety Tips.
          </p>
        )}

        {transaction && transaction.status === "PENDING" && (
          <p className="mt-4 text-sm text-ink-500">Payment started. Complete checkout to finish this purchase.</p>
        )}

        {transaction && transaction.status === "PAID" && transaction.buyerId === user?.id && (
          <div className="mt-4 border border-ink-300/40 rounded-md p-3 space-y-2">
            <p className="text-sm font-medium">You paid ₦{(transaction.totalAmount / 100).toLocaleString("en-NG")}. Confirm once the seller hands over the item.</p>
            <p className="text-xs text-ink-500">You have 48 hours after payment to report a problem. After that, the sale is final.</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleConfirmReceived} className="text-xs bg-green-600 text-white rounded-md px-3 py-1.5">Confirm received</button>
              <button onClick={() => handleDisputePayment("Seller did not hand over the item")} className="text-xs border border-red-200 text-red-600 rounded-md px-3 py-1.5">Seller did not hand over the item</button>
              <button onClick={() => handleDisputePayment("Different item from the one I inspected")} className="text-xs border border-red-200 text-red-600 rounded-md px-3 py-1.5">Different item from the one I inspected</button>
            </div>
          </div>
        )}

        {transaction && transaction.status === "PAID" && transaction.sellerId === user?.id && (
          <p className="mt-4 text-sm text-green-700">Payment received. Hand over the item to the buyer.</p>
        )}

        {transaction && transaction.status === "COMPLETED" && (
          <p className="mt-4 text-sm text-green-700">✓ Sale confirmed.</p>
        )}

        {transaction && transaction.status === "DISPUTED" && (
          <p className="mt-4 text-sm text-yellow-700">Problem reported. Our team is reviewing this sale.</p>
        )}

        {transaction && transaction.status === "REFUNDED" && (
          <p className="mt-4 text-sm text-yellow-700">This sale was refunded to the buyer.</p>
        )}

        {paymentStatus && <p className="text-xs text-ink-500 mt-2">{paymentStatus}</p>}

        {!isOwner && (
          <form onSubmit={handleSendMessage} className="mt-4 space-y-2">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Ask ${listing.seller.name.split(" ")[0]} about this item...`}
              rows={2}
              required
              className="w-full border border-ink-300/50 rounded-md px-3 py-2 text-sm"
            />
            <button className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-md py-2.5 text-sm font-medium">
              Message seller
            </button>
            {messageStatus && <p className="text-sm text-ink-500">{messageStatus}</p>}
            <p className="text-xs text-ink-500">Keep payment and important details on ADY Marketplace — we can't help resolve a problem that happened entirely over WhatsApp.</p>
          </form>
        )}

        {canReviewOrDispute && (
          <div className="mt-4 border border-ink-300/40 rounded-md p-3 space-y-3">
            <p className="text-sm font-medium">Received this item?</p>
            {!showReview ? (
              <button onClick={() => setShowReview(true)} className="text-xs bg-brand-500 text-white rounded-md px-3 py-1.5">Leave a review</button>
            ) : (
              <form onSubmit={handleReview} className="text-sm space-y-2">
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={reviewForm.itemMatched} onChange={(e) => setReviewForm({ ...reviewForm, itemMatched: e.target.checked })} />
                  Item matched the listing description
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs">Communication (1-5)
                    <input type="number" min={1} max={5} value={reviewForm.communication} onChange={(e) => setReviewForm({ ...reviewForm, communication: e.target.value })} className="w-full border border-ink-300/50 rounded-md px-2 py-1 text-sm" />
                  </label>
                  <label className="text-xs">Experience (1-5)
                    <input type="number" min={1} max={5} value={reviewForm.experience} onChange={(e) => setReviewForm({ ...reviewForm, experience: e.target.value })} className="w-full border border-ink-300/50 rounded-md px-2 py-1 text-sm" />
                  </label>
                </div>
                <textarea placeholder="Optional comment" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={2} className="w-full border border-ink-300/50 rounded-md px-2 py-1.5 text-sm" />
                <div className="flex gap-2">
                  <button className="text-xs bg-brand-500 text-white rounded-md px-3 py-1.5">Submit review</button>
                  <button type="button" onClick={() => setShowReview(false)} className="text-xs border border-ink-300 rounded-md px-3 py-1.5">Cancel</button>
                </div>
              </form>
            )}

            {!showDispute ? (
              <button onClick={() => setShowDispute(true)} className="text-xs text-red-600 hover:underline block">Something went wrong — open a dispute</button>
            ) : (
              <form onSubmit={handleDispute} className="text-sm space-y-2 border-t border-ink-300/40 pt-2">
                <select required value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} className="w-full border border-ink-300/50 rounded-md px-2 py-1.5 text-sm">
                  <option value="">What went wrong?</option>
                  <option value="Item doesn't match description">Item doesn't match description</option>
                  <option value="Item never received">Item never received</option>
                  <option value="Item damaged or not working">Item damaged or not working</option>
                  <option value="Other">Other</option>
                </select>
                <textarea required placeholder="Describe what happened" value={disputeDetails} onChange={(e) => setDisputeDetails(e.target.value)} rows={2} className="w-full border border-ink-300/50 rounded-md px-2 py-1.5 text-sm" />
                <div className="flex gap-2">
                  <button className="text-xs bg-red-600 text-white rounded-md px-3 py-1.5">Open dispute</button>
                  <button type="button" onClick={() => setShowDispute(false)} className="text-xs border border-ink-300 rounded-md px-3 py-1.5">Cancel</button>
                </div>
              </form>
            )}

            {reviewStatus && <p className="text-xs text-ink-500">{reviewStatus}</p>}
            {disputeStatus && <p className="text-xs text-ink-500">{disputeStatus}</p>}
          </div>
        )}

        {!isOwner && (
          <div className="mt-4">
            {!showReport ? (
              <button onClick={() => setShowReport(true)} className="text-xs text-ink-500 hover:underline">Report this listing</button>
            ) : (
              <form onSubmit={handleReport} className="text-sm space-y-2 border border-ink-300/40 rounded-md p-3">
                <select required value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full border border-ink-300/50 rounded-md px-2 py-1.5 text-sm">
                  <option value="">Select a reason...</option>
                  {REPORT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="flex gap-2">
                  <button className="text-xs bg-red-600 text-white rounded-md px-3 py-1.5">Submit report</button>
                  <button type="button" onClick={() => setShowReport(false)} className="text-xs border border-ink-300 rounded-md px-3 py-1.5">Cancel</button>
                </div>
              </form>
            )}
            {reportStatus && <p className="text-xs text-ink-500 mt-2">{reportStatus}</p>}
          </div>
        )}

        {isOwner && (
          <Link to="/my-listings" className="mt-6 inline-block text-sm text-brand-600 underline">Manage this listing</Link>
        )}
      </div>
    </div>
  );
}
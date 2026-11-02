-- Direct-payment model: record when payment landed, inspection tick, and refund repayment dates.
ALTER TABLE "Transaction" ADD COLUMN "paidAt" TIMESTAMP(3);
ALTER TABLE "Transaction" ADD COLUMN "inspectionAcceptedAt" TIMESTAMP(3);
ALTER TABLE "Transaction" ADD COLUMN "sellerRepayDueAt" TIMESTAMP(3);
ALTER TABLE "Transaction" ADD COLUMN "sellerRepaidAt" TIMESTAMP(3);
ALTER TABLE "Listing" ADD COLUMN "refundRepaymentAcceptedAt" TIMESTAMP(3);

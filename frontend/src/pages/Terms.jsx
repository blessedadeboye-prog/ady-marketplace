import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-sm space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Terms of Service</h1>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Who runs ADY Marketplace</h2>
        <p>ADY Marketplace is run by ADYMARKETPLACECO VENTURES, a registered business name (Business Name
        No. 9887584), 21, 21 Asikpo Street off Atiku Abubakar, Akwa Ibom, Nigeria. Contact:
        <a href="mailto:contact@adymarketplace.com" className="text-brand-600 underline"> contact@adymarketplace.com</a>.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Who can use ADY Marketplace</h2>
        <p>You must be a genuine AKSU student (or otherwise approved by an admin) to register. Providing a
        false matric number, a fake portal screenshot, or impersonating another student is grounds for
        immediate account removal.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Listings</h2>
        <p>You're responsible for the accuracy of what you list. Condition, photos, and description must
        genuinely reflect the item. Prohibited items include anything illegal, stolen, counterfeit, or
        unsafe.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Payments</h2>
        <p>Payment in the app runs through Paystack and goes straight to the seller's bank account. ADY
        Marketplace does not hold buyer money and is not a bank. The buyer pays 3% on top of the price and
        the seller pays 2% out of the price. Payment in the app is open for items from ₦5,000 to ₦20,000 from
        sellers who connected a bank account. Read the <Link to="/payments" className="text-brand-600 underline">Payments and Fees</Link> page
        for details.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Inspect before you pay</h2>
        <p>Buyers meet the seller, inspect the item, and tick a box in the app to confirm they accept its
        condition before they pay. The sale is final after the inspection, apart from the cases in the
        <Link to="/refunds" className="text-brand-600 underline"> Refund and Cancellation</Link> page.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Refunds, disputes and penalties</h2>
        <p>A buyer has 48 hours after payment to report a problem. A refund applies when the seller took
        payment and did not hand over the item, or handed over a different item from the one inspected. Our
        team reviews both sides and decides within 5 working days. When a dispute goes to the buyer, we
        refund the buyer and the seller owes the amount to ADYMARKETPLACECO VENTURES. A seller who does not
        repay within 3 days loses the right to post until the money is repaid.</p>
        <p className="mt-2">A buyer who files a false claim gets a warning, and a second false claim leads to
        suspension. Deals that move outside the app get no protection, and repeat cases lead to suspension.
        Our decision on a dispute is final within the platform, and this does not affect any other legal
        rights you have.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Account removal</h2>
        <p>We suspend or remove accounts that violate these terms or our Community Guidelines, including
        for fraud, harassment, or repeated unresolved disputes.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Limitation of liability</h2>
        <p>ADY Marketplace connects buyers and sellers and is not a party to the sale of goods. We verify
        students and flag risk as best we know how, but we cannot guarantee every transaction goes
        smoothly.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Contact</h2>
        <p>Questions about these terms, or need to escalate something beyond the in-app process? Email
        <a href="mailto:contact@adymarketplace.com" className="text-brand-600 underline"> contact@adymarketplace.com</a>.</p>
      </section>

      <p className="text-ink-500 text-xs mt-8">Last updated: 31 October 2026.</p>
    </div>
  );
}

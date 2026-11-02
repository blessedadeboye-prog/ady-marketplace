import React from "react";
import { Link } from "react-router-dom";

export default function Refunds() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-sm space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Refund and Cancellation</h1>
      <p>ADY Marketplace is run by ADYMARKETPLACECO VENTURES, Business Name No. 9887584, 21, 21 Asikpo
      Street off Atiku Abubakar, Akwa Ibom, Nigeria. Contact:
      <a href="mailto:contact@adymarketplace.com" className="text-brand-600 underline"> contact@adymarketplace.com</a>.</p>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Inspect first</h2>
        <p>Meet the seller, inspect the item, and pay in the app only when you accept its condition. You tick a
        box in the app to confirm this, and we save the date and time. A fault you could see at the meeting is
        not a reason for a refund.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">When you get a refund</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>The seller took your payment and did not hand over the item.</li>
          <li>The seller handed over a different item from the one you inspected.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">How to ask</h2>
        <p>Report the problem in the app within 48 hours after payment. Add photos or screenshots. Our team
        reads both sides and decides within 5 working days. After 48 hours, or after you tap Confirm received,
        the sale is final.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">If you win</h2>
        <p>We refund the full amount you paid, including your 3% fee, to your original payment method. Your bank
        sets the timing, often 5 to 10 working days.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">If the seller wins</h2>
        <p>No refund is paid and the sale stands.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">For sellers</h2>
        <p>When you list an item, you tick a box agreeing to repay the buyer's refund within 3 days if a
        dispute goes the buyer's way. Until you repay, the amount is owed to ADYMARKETPLACECO VENTURES and you
        lose the right to post new listings.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Penalties</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>A false claim gets a warning. A second false claim leads to suspension.</li>
          <li>A buyer who confirmed receipt cannot open a claim on the same item afterward.</li>
          <li>Deals that move outside the app get no protection. Repeat cases lead to suspension.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Cancellations</h2>
        <p>Before you pay, you are free to walk away at no cost. After you pay, the refund rules above apply.
        See also <Link to="/payments" className="text-brand-600 underline">Payments and Fees</Link>.</p>
      </section>

      <p className="text-ink-500 text-xs mt-8">Last updated: 31 October 2026.</p>
    </div>
  );
}

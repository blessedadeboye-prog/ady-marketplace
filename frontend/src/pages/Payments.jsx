import React from "react";
import { Link } from "react-router-dom";

export default function Payments() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-sm space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Payments and Fees</h1>
      <p>ADY Marketplace is run by ADYMARKETPLACECO VENTURES, Business Name No. 9887584, 21, 21 Asikpo
      Street off Atiku Abubakar, Akwa Ibom, Nigeria.</p>

      <section>
        <h2 className="font-semibold mt-4 mb-1">How payment works</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Payment runs through Paystack, using card, bank transfer and the other methods Paystack offers.</li>
          <li>Your money goes straight to the seller's bank account. ADY does not hold your funds.</li>
          <li>Meet the seller, inspect the item, then pay in the app.</li>
          <li>The seller hands over the item once the app shows your payment as confirmed.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Fees</h2>
        <p>The buyer pays 3% on top of the price. The seller pays 2% out of the price. We pay Paystack's own
        charges.</p>
        <p className="mt-2">Example: an item listed at ₦20,000. The buyer pays ₦20,600. The seller receives
        ₦19,600. ADY earns ₦1,000.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Limits</h2>
        <p>Payment in the app works for items from ₦5,000 to ₦20,000. For anything higher, meet in person and
        follow the Safety Tips. A seller must connect a bank account before buyers see the Pay button.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Problems</h2>
        <p>You have 48 hours after payment to report a problem. See the
        <Link to="/refunds" className="text-brand-600 underline"> Refund and Cancellation</Link> page for when a
        refund applies.</p>
      </section>

      <p className="text-ink-500 text-xs mt-8">Last updated: 31 October 2026.</p>
    </div>
  );
}

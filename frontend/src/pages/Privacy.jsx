import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-sm space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Privacy Policy</h1>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Who is responsible for your data</h2>
        <p>ADYMARKETPLACECO VENTURES (Business Name No. 9887584), 21, 21 Asikpo Street off Atiku Abubakar,
        Akwa Ibom, Nigeria, runs ADY Marketplace and decides how your data is used. Contact:
        <a href="mailto:contact@adymarketplace.com" className="text-brand-600 underline"> contact@adymarketplace.com</a>.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">What we collect</h2>
        <p>To verify you are a real AKSU student and keep the marketplace safe, we collect your name, email,
        phone number, department, faculty, matric number, and a screenshot of your AKSU student portal
        dashboard. When you list an item, we collect photos and a description. We also record a device
        identifier, which helps us spot one person running several accounts. When you pay or get paid
        through the platform, our payment provider, Paystack, processes your card or bank details. We never
        see or store your full card number. When a seller connects a bank account, the details go to
        Paystack. We keep only a payout reference, not your account number.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">What we don't show publicly</h2>
        <p>Your matric number and portal screenshot are visible only to admins and are used solely to verify
        your account. Your email and phone number are never shown on your public profile.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Why we collect this data</h2>
        <p>Verification data reduces fraud and impersonation. Transaction data, meaning messages, payments
        and disputes, exists so we are able to resolve problems between buyers and sellers if something
        goes wrong.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Your rights</h2>
        <p>You have the right to request a copy of your data, correct inaccurate information, or delete your
        account at any time from your Profile page. Deleting your account removes your personal details.
        Some transaction records stay in anonymized form where dispute resolution or legal recordkeeping
        requires. For any data request or question, email
        <a href="mailto:contact@adymarketplace.com" className="text-brand-600 underline"> contact@adymarketplace.com</a>.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Who we share data with</h2>
        <p>We share data only with the services we use to run the marketplace: Paystack for payment
        processing, our SMS provider for phone verification codes once switched on, Cloudinary for storing
        the photos and screenshots you upload, and Render for hosting. We do not sell your data to
        advertisers or third parties.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">How long we keep your data</h2>
        <p>We keep your account data while your account is open. When you delete your account, we remove your
        personal details and keep transaction and dispute records in anonymized form, so we are able to
        resolve past disputes and meet legal record keeping duties.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">If something goes wrong</h2>
        <p>If a breach of personal data puts you at risk, we tell you and the Nigeria Data Protection
        Commission within 72 hours of learning about it.</p>
      </section>

      <section>
        <h2 className="font-semibold mt-4 mb-1">Complaints</h2>
        <p>Write to us first at contact@adymarketplace.com and we will respond. You also have the right to
        complain to the Nigeria Data Protection Commission (ndpc.gov.ng).</p>
      </section>

      <p className="text-ink-500 text-xs mt-8">Last updated: 2 November 2026</p>
    </div>
  );
}
import type { Metadata } from "next";
import ContentPageLayout from "@/components/ui/ContentPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service — QuickHire",
  description: "Read QuickHire's terms of service.",
};

export default function TermsPage() {
  return (
    <ContentPageLayout
      title="Terms of Service"
      subtitle="Please read these terms carefully before using QuickHire."
      lastUpdated="March 1, 2026"
    >
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">1. Acceptance of Terms</h2>
        <p>By accessing or using QuickHire, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our platform.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">2. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials. Currently, account registration is invite-only. Unauthorised use of another user's account is strictly prohibited.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">3. Job Listings</h2>
        <p>Employers agree to post only genuine, lawful job opportunities. QuickHire reserves the right to remove any listing that violates these terms or applicable law without prior notice.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">4. Intellectual Property</h2>
        <p>All content on QuickHire, including logos, design, and text, is the intellectual property of QuickHire or its licensors and is protected by applicable copyright and trademark laws.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">5. Limitation of Liability</h2>
        <p>QuickHire is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">6. Changes to Terms</h2>
        <p>We may update these terms from time to time. Continued use of QuickHire after changes constitutes acceptance of the revised terms.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">7. Contact</h2>
        <p>Questions about these terms? Reach us at <a href="/contact" className="text-brand-indigo hover:underline">our contact page</a>.</p>
      </section>
    </ContentPageLayout>
  );
}

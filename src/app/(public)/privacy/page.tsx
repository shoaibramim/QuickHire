import type { Metadata } from "next";
import ContentPageLayout from "@/components/ui/ContentPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — QuickHire",
  description: "Read QuickHire's privacy policy.",
};

export default function PrivacyPage() {
  return (
    <ContentPageLayout
      title="Privacy Policy"
      subtitle="We take your privacy seriously. Here's what we collect and why."
      lastUpdated="March 1, 2026"
    >
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">1. Information We Collect</h2>
        <p>We collect information you provide when creating an account (name, email), applying for jobs, and interacting with the platform. We also collect usage data such as pages visited and search queries.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">2. How We Use Your Information</h2>
        <p>Your information is used to operate and improve QuickHire, match job seekers with relevant opportunities, send important notifications, and comply with legal obligations.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">3. Data Sharing</h2>
        <p>We do not sell your personal data. We may share data with employers when you apply for a job, and with service providers who help us operate QuickHire under strict confidentiality agreements.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">4. Cookies</h2>
        <p>QuickHire uses cookies to remember your preferences, maintain session state (JWT), and gather analytics. You can manage cookie settings in your browser.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">5. Data Retention</h2>
        <p>We retain your data as long as your account is active or as required by law. You may request deletion of your data by contacting us.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. Contact us at <a href="/contact" className="text-brand-indigo hover:underline">our contact page</a> to exercise these rights.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-heading-dark mb-2">7. Security</h2>
        <p>We use industry-standard security measures including HTTPS, hashed passwords, and JWT tokens to protect your data.</p>
      </section>
    </ContentPageLayout>
  );
}

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | AR Book Sellers",
  description: "Learn how AR Book Sellers protects and manages your personal data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900">
      <Header />
      <main className="flex-grow bg-[#fcfcfc] dark:bg-zinc-950 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-islamic-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-islamic-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground font-medium">Last Updated: April 14, 2024</p>
          </div>

          {/* Policy Content */}
          <div className="bg-white dark:bg-zinc-900 border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5 prose prose-zinc dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">1. Introduction</h2>
              <p>
                At <strong>AR Book Sellers</strong>, we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website and purchase our products.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">2. Information We Collect</h2>
              <p>When you use our platform, we may collect the following information:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Personal Details:</strong> Name, email address, phone number, and shipping address.</li>
                <li><strong>Order Information:</strong> Records of the products you have purchased and your transaction history.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and device information used to access the site.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">3. How We Use Your Information</h2>
              <p>We use your data for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To process and deliver your orders efficiently.</li>
                <li>To communicate with you regarding your account, order status, and customer support.</li>
                <li>To send you newsletter updates (only if you have voluntarily subscribed).</li>
                <li>To improve our website functionality and user experience.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">4. Third-Party Sharing</h2>
              <p>
                We do not sell your personal data to third parties. However, we do share necessary information with trusted service providers to run our operations, such as:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Logistics Partners:</strong> Courier services (e.g., Leopards, TCS) for delivery within Pakistan.</li>
                <li><strong>Email Services:</strong> To send automated receipts and newsletter updates.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data from unauthorized access. This includes encrypted database storage and secure server configurations. While we strive to protect your info, please remember that no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">6. Your Rights</h2>
              <p>
                You have the right to request access to the personal data we hold about you or ask for its deletion. If you wish to unsubscribe from our newsletter, you can do so at any time via the link provided in any of our emails or by contacting us directly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">7. Contact Us</h2>
              <p>
                If you have any questions regarding this Privacy Policy, feel free to reach out to us:
              </p>
              <p className="font-bold">
                Email: contact@arbooksellers.com<br />
                Phone: +92-300-8016812<br />
                Address: 17-Aziz Market, Urdu Bazar, Lahore, Pakistan
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

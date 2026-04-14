import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Gavel } from "lucide-react";

export const metadata = {
  title: "Terms of Service | AR Book Sellers",
  description: "Standard terms and conditions for shopping at AR Book Sellers.",
};

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900">
      <Header />
      <main className="flex-grow bg-[#fcfcfc] dark:bg-zinc-950 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Gavel className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground font-medium">Standard Terms and Conditions for AR Book Sellers</p>
          </div>

          {/* Terms Content */}
          <div className="bg-white dark:bg-zinc-900 border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5 prose prose-zinc dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the AR Book Sellers website, you agree to comply with and be bound by the following terms and conditions. If you do not agree with any part of these terms, please do not use our platform.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">2. Eligibility</h2>
              <p>
                Our services are intended for individuals who can form legally binding contracts. If you are under 18, you may use this website only with the involvement and permission of a parent or guardian.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">3. Pricing & Availability</h2>
              <p>
                All prices are listed in Pakistani Rupees (PKR) and are subject to change without prior notice. While we strive for accuracy, errors in pricing or book descriptions may occasionally occur. In such cases, we reserve the right to cancel any orders placed for incorrectly priced items.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">4. Orders & Payment</h2>
              <p>
                We currently support <strong>Cash on Delivery (COD)</strong> for orders across Pakistan. By placing an order, you commit to receiving and paying for the delivery. Repeated refusals of genuine orders may lead to a permanent ban of your account/address from our platform.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">5. Shipping & Delivery</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Lahore: 1–3 business days.</li>
                <li>Other Cities: 3–5 business days.</li>
              </ul>
              <p>
                Delivery times are estimates and may be delayed due to factors beyond our control (e.g., weather, courier strikes).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">6. Returns & Refunds</h2>
              <p>
                We offer a <strong>7-day return policy</strong> for items that are damaged, misprinted, or incorrect upon arrival. To be eligible for a return, the item must be in its original condition and packaging. Please contact our support team with your order ID to initiate a return.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">7. Intellectual Property</h2>
              <p>
                All content on this website, including logos, graphics, and product descriptions, is the property of AR Book Sellers and is protected by copyright laws. You may not reproduce or use any of our assets without explicit written permission.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">8. Governing Law</h2>
              <p>
                These terms shall be governed by and interpreted in accordance with the laws of the Islamic Republic of Pakistan.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">9. Contact Information</h2>
              <p>
                For any legal inquiries or clarifications regarding these terms, please contact:
              </p>
              <p className="font-bold underline">
                contact@arbooksellers.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

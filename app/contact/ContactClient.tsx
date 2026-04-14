"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Shield,
  Globe,
  Zap
} from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim() || form.message.trim().length < 5) {
      newErrors.message = "Message must be at least 5 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
      return;
    }
    try {
      setSubmitting(true);
      setSuccess(null);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit");
      }
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      });
      setSuccess(
        "Thank you for contacting us! We will get back to you within 24 hours.",
      );
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-islamic-green-100 selection:text-islamic-green-900 overflow-hidden">
      <Header />
      <main className="flex-grow bg-background text-foreground">
        {/* Hero section */}
        <section className="relative pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 px-4 border-b border-border/50">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-islamic-green-500/5 dark:bg-islamic-green-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="max-w-3xl mb-12 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
                Get in <span className="text-islamic-green-600 dark:text-islamic-green-500">Touch</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Have a question about an order, need a specific book, or just want to say hello? We&apos;re happy to help.
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
              {/* Contact info sidebar */}
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: "Address", value: "17 Aziz Market, Urdu Bazar, Lahore" },
                    { icon: Phone, label: "Phone", value: "+92 300 8016812" },
                    { icon: Mail, label: "Email", value: "contact@arbooksellers.com" }
                  ].map((item, i) => (
                    <div key={i} className="group p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-border/40 dark:border-zinc-700/50 hover:border-islamic-green-500/30 transition-all duration-300 hover:shadow-md">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shrink-0 border border-border/50 dark:border-zinc-700 group-hover:bg-islamic-green-600 group-hover:text-white group-hover:border-islamic-green-600 transition-all duration-300">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-0.5">{item.label}</p>
                          <p className="text-sm font-semibold text-foreground leading-tight">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call card */}
                <div className="p-6 bg-islamic-green-600 rounded-2xl text-white shadow-lg">
                  <h3 className="text-lg font-bold mb-2">Need urgent help?</h3>
                  <p className="text-islamic-green-50 text-sm mb-5 leading-relaxed">Call us during working hours for urgent order issues.</p>
                  <a href="tel:+923008016812" className="block">
                    <Button className="w-full h-11 bg-white text-islamic-green-600 hover:bg-islamic-green-50 rounded-xl font-bold text-sm shadow transition-all">
                      Call Now
                    </Button>
                  </a>
                </div>
              </div>

              {/* Contact form */}
              <div className="lg:col-span-3">
                <Card className="bg-white dark:bg-zinc-900 border border-border/50 dark:border-zinc-700/50 shadow-xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8 lg:p-10">
                    {success ? (
                      <div className="text-center py-8 space-y-5 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-islamic-green-100 dark:bg-islamic-green-500/20 text-islamic-green-600 rounded-2xl flex items-center justify-center mx-auto">
                          <CheckCircle className="w-10 h-10" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h2>
                          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                            {success}
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setSuccess(null)}
                            className="h-11 px-6 rounded-xl font-semibold text-sm border-border/50 hover:bg-foreground hover:text-background transition-all"
                          >
                            Send Another Message
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-foreground/80">Your Name</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Full name"
                              value={form.name}
                              onChange={handleChange}
                              className={`h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all px-4 text-sm ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="you@example.com"
                              value={form.email}
                              onChange={handleChange}
                              className={`h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all px-4 text-sm ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-foreground/80">Phone <span className="text-muted-foreground font-normal">(optional)</span></Label>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="+92 3XX XXXXXXX"
                              value={form.phone}
                              onChange={handleChange}
                              className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all px-4 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject" className="text-sm font-medium text-foreground/80">Subject</Label>
                            <Input
                              id="subject"
                              name="subject"
                              placeholder="What's this about?"
                              value={form.subject}
                              onChange={handleChange}
                              className={`h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all px-4 text-sm ${errors.subject ? 'border-red-500' : ''}`}
                            />
                            {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-sm font-medium text-foreground/80">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Type your message here..."
                            rows={5}
                            value={form.message}
                            onChange={handleChange}
                            className={`rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-border/50 focus:border-islamic-green-500 transition-all p-4 text-sm resize-none ${errors.message ? 'border-red-500' : ''}`}
                          />
                          {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                        </div>

                        <Button 
                          type="submit" 
                          disabled={submitting}
                          className="w-full h-12 bg-islamic-green-600 hover:bg-islamic-green-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all group"
                        >
                          {submitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              <span>Sending...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>Send Message</span>
                              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why shop with us */}
        <section className="py-16 sm:py-20 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">Why Shop With Us?</h2>
              <p className="text-sm text-muted-foreground">What makes us different</p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: Globe, label: "Authentic Books", desc: "A carefully chosen collection of genuine Islamic books in many languages." },
                { icon: Zap, label: "Quick Shipping", desc: "1–3 days in Lahore, 3–5 days across Pakistan with tracking." },
                { icon: Shield, label: "Safe & Trustworthy", desc: "Easy payment options and 7-day returns for a worry-free experience." }
              ].map((item, i) => (
                <Card key={i} className="bg-white dark:bg-zinc-800/80 border border-border/40 dark:border-zinc-700/50 shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-islamic-green-600/10 dark:bg-islamic-green-600/15 rounded-xl flex items-center justify-center mx-auto mb-4 border border-islamic-green-600/20">
                    <item.icon className="w-5 h-5 text-islamic-green-600" />
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-1.5">{item.label}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-extrabold text-foreground mb-8 tracking-tight text-center">Common Questions</h2>
            <div className="space-y-4">
              {[
                { q: "What payment methods do you accept?", a: "We accept bank transfers, cash on delivery, JazzCash, EasyPaisa, and credit or debit cards." },
                { q: "How long does delivery take?", a: "1–3 days in Lahore, 3–5 days outside Lahore. We provide tracking for all orders." },
                { q: "What is your return policy?", a: "7 days return for books in original condition. Contact our team for help." }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl border border-border/40 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                  <h4 className="font-semibold text-foreground mb-1.5 text-sm">{item.q}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

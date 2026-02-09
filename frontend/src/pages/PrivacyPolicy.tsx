import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Database, Lock, Mail, Cookie, Users, FileText } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Personal Information",
        text: "When you create an account or make a purchase, we collect your name, email address, shipping address, billing address, phone number, and payment information.",
      },
      {
        subtitle: "Automatically Collected Information",
        text: "We automatically collect certain information when you visit our website, including your IP address, browser type, device information, and browsing behavior through cookies and similar technologies.",
      },
      {
        subtitle: "Order Information",
        text: "We collect information about your purchases, including items ordered, order history, and transaction details.",
      },
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Order Processing",
        text: "We use your information to process and fulfill orders, communicate about your orders, and provide customer support.",
      },
      {
        subtitle: "Personalization",
        text: "We use your browsing and purchase history to personalize your shopping experience, recommend products, and show relevant content.",
      },
      {
        subtitle: "Marketing",
        text: "With your consent, we may send promotional emails about new products, special offers, and other marketing communications. You can opt out at any time.",
      },
      {
        subtitle: "Analytics",
        text: "We use analytics tools to understand how visitors use our website, helping us improve our services and user experience.",
      },
    ],
  },
  {
    icon: Users,
    title: "Information Sharing",
    content: [
      {
        subtitle: "Service Providers",
        text: "We share information with trusted third parties who help us operate our business, including payment processors, shipping carriers, and email service providers.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose information when required by law or to protect our rights, property, or safety, or that of our customers and others.",
      },
      {
        subtitle: "Business Transfers",
        text: "In the event of a merger, acquisition, or sale of assets, customer information may be transferred to the acquiring entity.",
      },
    ],
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content: [
      {
        subtitle: "Essential Cookies",
        text: "These cookies are necessary for the website to function properly, including shopping cart functionality and secure checkout.",
      },
      {
        subtitle: "Analytics Cookies",
        text: "We use cookies to collect information about how you use our website, helping us improve our services.",
      },
      {
        subtitle: "Marketing Cookies",
        text: "These cookies track your browsing habits to deliver personalized advertisements across different platforms.",
      },
      {
        subtitle: "Managing Cookies",
        text: "You can control cookies through your browser settings. Note that disabling certain cookies may affect website functionality.",
      },
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      {
        subtitle: "Encryption",
        text: "All payment information is encrypted using SSL technology. We never store your complete credit card details on our servers.",
      },
      {
        subtitle: "Access Controls",
        text: "We implement strict access controls to ensure only authorized personnel can access customer data.",
      },
      {
        subtitle: "Regular Audits",
        text: "We conduct regular security audits and vulnerability assessments to protect against unauthorized access.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Your Rights",
    content: [
      {
        subtitle: "Access & Correction",
        text: "You have the right to access, correct, or update your personal information at any time through your account settings.",
      },
      {
        subtitle: "Deletion",
        text: "You can request deletion of your personal data, subject to legal retention requirements.",
      },
      {
        subtitle: "Data Portability",
        text: "You can request a copy of your personal data in a commonly used, machine-readable format.",
      },
      {
        subtitle: "Opt-Out",
        text: "You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or updating your preferences.",
      },
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 10, 2026
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                FootWear ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this policy carefully. If you disagree with its terms, please do not access the site.
              </p>
            </CardContent>
          </Card>

          {/* Sections */}
          {sections.map((section, idx) => (
            <Card key={idx} className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.content.map((item, itemIdx) => (
                  <div key={itemIdx}>
                    <h4 className="font-semibold text-foreground mb-2">{item.subtitle}</h4>
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Contact */}
          <Card className="shadow-medium bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Questions About This Policy?
                  </h3>
                  <p className="text-muted-foreground">
                    Contact us at <a href="mailto:privacy@footwear.com" className="text-primary hover:underline">privacy@footwear.com</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

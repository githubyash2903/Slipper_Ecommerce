import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, ShoppingBag, CreditCard, Package, AlertTriangle, Gavel, Mail } from "lucide-react";

const sections = [
  {
    icon: Scale,
    title: "1. Acceptance of Terms",
    content: `By accessing or using the FootWear website and services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not access or use our services.

We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the website following any changes indicates your acceptance of the new terms.`,
  },
  {
    icon: ShoppingBag,
    title: "2. Products & Ordering",
    content: `All products are subject to availability. We reserve the right to discontinue any product at any time and to limit quantities. Product descriptions and images are provided for informational purposes and may vary slightly from actual products.

Prices are subject to change without notice. We make every effort to ensure accuracy but reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.

An order is not binding until we send you an order confirmation email. We reserve the right to refuse or cancel any order for reasons including product availability, errors in pricing or product information, or suspected fraudulent activity.`,
  },
  {
    icon: CreditCard,
    title: "3. Payment Terms",
    content: `We accept major credit cards, PayPal, Apple Pay, Google Pay, and other payment methods as indicated at checkout. Payment is due at the time of purchase.

You represent and warrant that you have the legal right to use any payment method you provide. All payment information is encrypted and securely processed through our third-party payment processors.

If your payment method is declined, we will attempt to contact you to resolve the issue. Orders will not be shipped until full payment is received.`,
  },
  {
    icon: Package,
    title: "4. Shipping & Delivery",
    content: `Shipping times and costs vary based on destination and shipping method selected. Estimated delivery times are not guaranteed and may be affected by factors beyond our control.

Risk of loss and title for items purchased pass to you upon delivery to the carrier. We are not responsible for delays caused by shipping carriers, customs, weather, or other factors outside our control.

For international orders, you are responsible for all customs duties, taxes, and import fees. These charges are not included in our shipping costs.`,
  },
  {
    icon: AlertTriangle,
    title: "5. Returns & Refunds",
    content: `Please refer to our Returns & Exchanges Policy for detailed information about returns, exchanges, and refunds.

Items must be returned within 30 days of delivery in unworn condition with all original tags attached. We reserve the right to refuse returns that do not meet our return policy requirements.

Refunds are processed to the original payment method within 5-7 business days after receipt and inspection of returned items.`,
  },
  {
    icon: FileText,
    title: "6. Intellectual Property",
    content: `All content on this website, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of FootWear or its content suppliers and is protected by copyright and other intellectual property laws.

You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any content from our website without our prior written consent.

The FootWear name, logo, and all related marks are trademarks of FootWear. You may not use these marks without our prior written permission.`,
  },
  {
    icon: AlertTriangle,
    title: "7. Limitation of Liability",
    content: `To the fullest extent permitted by law, FootWear shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or other intangible losses.

Our total liability for any claims arising from your use of our website or products shall not exceed the amount you paid for the products in question.

We make no warranties, express or implied, regarding the accuracy, reliability, or completeness of any content on our website.`,
  },
  {
    icon: Gavel,
    title: "8. Governing Law",
    content: `These Terms of Service shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.

Any disputes arising from these terms or your use of our website shall be resolved exclusively in the state or federal courts located in New York County, New York.

If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
];

export default function Terms() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our website or making a purchase.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Effective Date: January 10, 2026
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to FootWear. These Terms of Service ("Terms") govern your access to and use of our website, products, and services. By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy.
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
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
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
                    Questions About These Terms?
                  </h3>
                  <p className="text-muted-foreground">
                    Contact us at <a href="mailto:legal@footwear.com" className="text-primary hover:underline">legal@footwear.com</a>
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

import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, Truck, RotateCcw, CreditCard, Ruler, Package, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqCategories = [
  {
    title: "Orders & Shipping",
    icon: Truck,
    faqs: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business day delivery. International orders may take 10-14 business days depending on the destination.",
      },
      {
        question: "How can I track my order?",
        answer: "Once your order ships, you'll receive an email with a tracking number. You can use this number to track your package on our website or the carrier's site.",
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes! We offer free standard shipping on all orders over $100. Express shipping is available at an additional cost.",
      },
      {
        question: "Can I change my shipping address after placing an order?",
        answer: "You can modify your shipping address within 2 hours of placing your order. After that, please contact our customer support team for assistance.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    icon: RotateCcw,
    faqs: [
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for unworn items in original packaging. Items must be in new condition with all tags attached.",
      },
      {
        question: "How do I initiate a return?",
        answer: "Log into your account, go to 'Order History', select the item you want to return, and follow the prompts. You'll receive a prepaid shipping label via email.",
      },
      {
        question: "How long does it take to process a refund?",
        answer: "Once we receive your return, refunds are processed within 5-7 business days. The refund will appear on your original payment method.",
      },
      {
        question: "Can I exchange an item for a different size?",
        answer: "Yes! We offer free exchanges for different sizes. Simply initiate an exchange through your account and we'll ship the new size as soon as we receive the original.",
      },
    ],
  },
  {
    title: "Payment & Pricing",
    icon: CreditCard,
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay.",
      },
      {
        question: "Is my payment information secure?",
        answer: "Absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your full credit card details.",
      },
      {
        question: "Do you offer payment plans?",
        answer: "Yes, we offer buy now, pay later options through Klarna and Afterpay. You can split your purchase into 4 interest-free payments.",
      },
      {
        question: "Are prices displayed in my local currency?",
        answer: "Currently, all prices are displayed in USD. For international orders, your bank will convert the charge to your local currency.",
      },
    ],
  },
  {
    title: "Sizing & Fit",
    icon: Ruler,
    faqs: [
      {
        question: "How do I find my shoe size?",
        answer: "Check our Size Guide page for detailed measuring instructions. We recommend measuring your feet at the end of the day when they're slightly larger.",
      },
      {
        question: "Do your shoes run true to size?",
        answer: "Most of our shoes run true to size. However, some styles may run slightly larger or smaller. Check the product description for specific sizing notes.",
      },
      {
        question: "What if my shoes don't fit?",
        answer: "We offer free exchanges for different sizes within 30 days. If you're between sizes, we generally recommend sizing up for comfort.",
      },
      {
        question: "Do you offer wide width options?",
        answer: "Yes! Many of our styles are available in wide (W) and extra-wide (XW) widths. Look for the width options on the product page.",
      },
    ],
  },
  {
    title: "Products & Care",
    icon: Package,
    faqs: [
      {
        question: "How should I care for my shoes?",
        answer: "Care instructions vary by material. Leather shoes should be cleaned and conditioned regularly. Canvas can be spot cleaned. Check the product page for specific care instructions.",
      },
      {
        question: "Are your shoes made with sustainable materials?",
        answer: "We're committed to sustainability. Many of our products use recycled materials, and we're continuously expanding our eco-friendly line.",
      },
      {
        question: "Can I repair my shoes under warranty?",
        answer: "We offer a 1-year warranty against manufacturing defects. If you experience issues with quality or craftsmanship, contact our support team.",
      },
      {
        question: "Do you restock sold-out items?",
        answer: "Popular items are typically restocked. You can sign up for restock notifications on the product page. Some limited edition items may not be restocked.",
      },
    ],
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.faqs.length > 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredCategories.map((category, idx) => (
            <Card key={idx} className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIdx) => (
                    <AccordionItem key={faqIdx} value={`${idx}-${faqIdx}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Need Help */}
        <Card className="max-w-4xl mx-auto mt-12 shadow-medium bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Still have questions?
                </h3>
                <p className="text-muted-foreground">
                  Our support team is here to help you.
                </p>
              </div>
            </div>
            <Link to="/contact">
              <Button className="gradient-accent">
                Contact Support
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

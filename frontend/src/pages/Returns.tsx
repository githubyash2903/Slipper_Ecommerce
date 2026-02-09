import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle, XCircle, Package, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const returnSteps = [
  {
    step: 1,
    title: "Initiate Return",
    description: "Log into your account, go to Order History, and select 'Return Item' for the product you wish to return.",
  },
  {
    step: 2,
    title: "Print Label",
    description: "Download and print your prepaid return shipping label. Attach it to your package securely.",
  },
  {
    step: 3,
    title: "Pack & Ship",
    description: "Pack items in original packaging with all tags attached. Drop off at any authorized shipping location.",
  },
  {
    step: 4,
    title: "Receive Refund",
    description: "Once we receive and inspect your return, your refund will be processed within 5-7 business days.",
  },
];

const eligibleItems = [
  "Unworn shoes in original condition",
  "Items with all original tags attached",
  "Products in original packaging",
  "Items returned within 30 days of delivery",
  "Accessories in unused condition",
];

const ineligibleItems = [
  "Worn or damaged items",
  "Items without original tags",
  "Products returned after 30 days",
  "Final sale or clearance items",
  "Customized or personalized products",
  "Items damaged by customer misuse",
];

export default function Returns() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
            <RotateCcw className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Not the perfect fit? No worries! We make returns and exchanges easy and hassle-free.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {/* 30-Day Policy Banner */}
          <Card className="shadow-medium bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    30-Day Easy Returns
                  </h3>
                  <p className="text-muted-foreground">
                    Changed your mind? Return unworn items within 30 days for a full refund.
                  </p>
                </div>
              </div>
              <Link to="/auth">
                <Button className="gradient-accent">
                  Start a Return
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                How to Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                {returnSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                        {step.step}
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                    {idx < returnSteps.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-[2px] bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {eligibleItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-destructive">
                  <XCircle className="h-5 w-5" />
                  Not Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {ineligibleItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Exchange Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                Exchanges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Need a different size or color? We offer <strong className="text-foreground">free exchanges</strong> on all eligible items.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-semibold text-foreground mb-2">Same Item, Different Size</h4>
                  <p className="text-muted-foreground text-sm">
                    Select "Exchange" when initiating your return. We'll ship the new size as soon as we receive your original order.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-semibold text-foreground mb-2">Different Item</h4>
                  <p className="text-muted-foreground text-sm">
                    For a different style or color, please process a return for a refund and place a new order for the desired item.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Refund Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>
                  <strong className="text-foreground">Processing Time:</strong> Refunds are processed within 5-7 business days after we receive and inspect your return.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>
                  <strong className="text-foreground">Refund Method:</strong> Refunds are issued to the original payment method. Bank processing may take an additional 3-5 business days.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p>
                  <strong className="text-foreground">Shipping Costs:</strong> Original shipping charges are non-refundable. Return shipping is free for exchanges but not for refunds.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <Card className="shadow-medium bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Need Help with Your Return?
                </h3>
                <p className="text-muted-foreground">
                  Our customer support team is here to assist you with any questions.
                </p>
              </div>
              <Link to="/contact">
                <Button className="gradient-accent">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

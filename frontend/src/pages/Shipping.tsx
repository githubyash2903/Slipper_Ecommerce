import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Package, Globe, Clock, CheckCircle, MapPin } from "lucide-react";

const shippingMethods = [
  {
    method: "Standard Shipping",
    domestic: "5-7 business days",
    international: "10-14 business days",
    price: "₹5.99 (Free over ₹100)",
  },
  {
    method: "Express Shipping",
    domestic: "2-3 business days",
    international: "5-7 business days",
    price: "₹14.99",
  },
  {
    method: "Next Day Delivery",
    domestic: "1 business day",
    international: "Not available",
    price: "₹24.99",
  },
];

const internationalZones = [
  { zone: "Zone 1", countries: "Canada, Mexico", time: "7-10 days", cost: "₹14.99" },
  { zone: "Zone 2", countries: "UK, Europe", time: "10-14 days", cost: "₹19.99" },
  { zone: "Zone 3", countries: "Australia, Japan, South Korea", time: "12-16 days", cost: "₹24.99" },
  { zone: "Zone 4", countries: "Rest of World", time: "14-21 days", cost: "₹29.99" },
];

export default function Shipping() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Shipping & Delivery
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fast, reliable shipping to get your new footwear to you as quickly as possible.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {/* Free Shipping Banner */}
          <Card className="shadow-medium bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Free Shipping on Orders Over ₹100
                  </h3>
                  <p className="text-muted-foreground">
                    Enjoy complimentary standard shipping on all qualifying orders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Methods */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                Shipping Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipping Method</TableHead>
                    <TableHead>Domestic (USA)</TableHead>
                    <TableHead>International</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shippingMethods.map((method, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{method.method}</TableCell>
                      <TableCell>{method.domestic}</TableCell>
                      <TableCell>{method.international}</TableCell>
                      <TableCell className="text-primary font-semibold">{method.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* International Shipping */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                International Shipping Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone</TableHead>
                    <TableHead>Countries/Regions</TableHead>
                    <TableHead>Delivery Time</TableHead>
                    <TableHead>Standard Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {internationalZones.map((zone, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{zone.zone}</TableCell>
                      <TableCell>{zone.countries}</TableCell>
                      <TableCell>{zone.time}</TableCell>
                      <TableCell className="text-primary font-semibold">{zone.cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Shipping Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-soft hover-lift">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Processing Time</h3>
                <p className="text-muted-foreground text-sm">
                  Orders placed before 2 PM EST are processed the same day. Weekend orders are processed on Monday.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover-lift">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Order Tracking</h3>
                <p className="text-muted-foreground text-sm">
                  Track your order in real-time. You'll receive a tracking number via email once your order ships.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover-lift">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Packaging</h3>
                <p className="text-muted-foreground text-sm">
                  All orders are carefully packaged in eco-friendly materials to ensure your shoes arrive in perfect condition.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Customs & Duties:</strong> International orders may be subject to customs duties and taxes. These fees are the responsibility of the recipient and are not included in our shipping charges.
              </p>
              <p>
                <strong className="text-foreground">P.O. Boxes:</strong> We ship to P.O. boxes via USPS. Express shipping is not available for P.O. box addresses.
              </p>
              <p>
                <strong className="text-foreground">Address Accuracy:</strong> Please ensure your shipping address is correct. We are not responsible for packages delivered to incorrect addresses provided by the customer.
              </p>
              <p>
                <strong className="text-foreground">Signature Required:</strong> Orders over ₹200 require a signature upon delivery for security purposes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}


import { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import {
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle
} from "@/components/ui/card";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState<string>("payments");
  const { toast } = useToast();
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
  
  // Demo data for payments
  const paymentHistory = [
    { id: 1, user: "john.doe@example.com", amount: 29.99, date: "2023-05-15", status: "completed" },
    { id: 2, user: "jane.smith@example.com", amount: 49.99, date: "2023-05-14", status: "completed" },
    { id: 3, user: "alice.johnson@example.com", amount: 19.99, date: "2023-05-12", status: "failed" },
  ];

  function handleNewPaymentClick() {
    setShowPaymentDialog(true);
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payments">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Payment History</h2>
            <Button onClick={handleNewPaymentClick}>Record New Payment</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$99.97</div>
                <CardDescription>+0% from last month</CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <CardDescription>+0% from last month</CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <CardDescription>+0% from last month</CardDescription>
              </CardContent>
            </Card>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.user}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast({
                          title: "View Payment",
                          description: `Viewing payment #${payment.id}`,
                        })}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="plans">
          <h2 className="text-2xl font-semibold mb-6">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SubscriptionPlanCard 
              title="Basic Plan"
              price={19.99}
              features={[
                "Access to basic features",
                "Limited quiz attempts",
                "Standard support"
              ]}
            />
            
            <SubscriptionPlanCard 
              title="Pro Plan"
              price={29.99}
              features={[
                "Full access to all features",
                "Unlimited quiz attempts",
                "Priority support",
                "Downloadable resources"
              ]}
              recommended
            />
            
            <SubscriptionPlanCard 
              title="Enterprise"
              price={49.99}
              features={[
                "All Pro features",
                "Custom branding",
                "Team management",
                "API access",
                "24/7 dedicated support"
              ]}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <h2 className="text-2xl font-semibold mb-6">Payment Settings</h2>
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway</CardTitle>
              <CardDescription>Configure your payment processor settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Connect your payment gateway to start accepting payments from users.
                You need to provide API keys from your payment processor.
              </p>
              <Button onClick={() => toast({
                title: "Coming Soon",
                description: "Payment gateway integration will be available soon.",
              })}>
                Configure Gateway
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
            <DialogDescription>
              This feature will allow you to manually record payments.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Payment recording functionality will be implemented soon.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({
                title: "Feature Coming Soon",
                description: "Payment recording will be available in a future update.",
              });
              setShowPaymentDialog(false);
            }}>
              Save Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface SubscriptionPlanCardProps {
  title: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

function SubscriptionPlanCard({ title, price, features, recommended }: SubscriptionPlanCardProps) {
  return (
    <Card className={`relative ${recommended ? 'border-primary' : ''}`}>
      {recommended && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs rounded-bl-md rounded-tr-md font-medium">
          Recommended
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold">${price}</span> / month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <Button className="w-full mt-6">Edit Plan</Button>
      </CardContent>
    </Card>
  );
}

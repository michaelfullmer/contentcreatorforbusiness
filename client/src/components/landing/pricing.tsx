import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PricingPlan } from "@shared/schema";

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  metadata: Record<string, string>;
  prices: {
    id: string;
    unit_amount: number;
    currency: string;
    recurring: { interval: string } | null;
  }[];
}

const fallbackPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for trying out our tools",
    features: [
      "10 AI generations per month",
      "Basic templates",
      "Basic analytics",
      "Community support"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 29.99,
    period: "month",
    description: "For growing small businesses",
    features: [
      "100 AI generations per month",
      "All templates",
      "Advanced analytics",
      "Priority support",
      "Brand profile",
      "Content calendar"
    ],
    isPopular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49.99,
    period: "month",
    description: "For teams and agencies",
    features: [
      "Unlimited AI generations",
      "All templates",
      "Custom branding",
      "Priority support",
      "Up to 5 team members"
    ]
  },
  {
    id: "enterprise_plus",
    name: "Enterprise Plus",
    price: 99,
    period: "month",
    description: "For large teams & agencies",
    features: [
      "Everything in Enterprise",
      "Full API access",
      "White-label solution",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee"
    ]
  }
];

export function Pricing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const { data: stripeProducts } = useQuery<{ data: StripeProduct[] }>({
    queryKey: ['/api/stripe/products'],
  });

  const handleSubscribe = async (priceId: string) => {
    setLoadingPriceId(priceId);
    try {
      const response = await apiRequest('POST', '/api/stripe/checkout', { priceId });
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingPriceId(null);
    }
  };

  const plans = fallbackPlans.map(plan => {
    if (plan.id === 'free') return { ...plan, stripePrice: null };
    
    const stripeProduct = stripeProducts?.data?.find(p => 
      p.name.toLowerCase().includes(plan.id) || 
      p.metadata?.tier === plan.id
    );
    
    const stripePrice = stripeProduct?.prices?.[0];
    
    return {
      ...plan,
      price: stripePrice ? stripePrice.unit_amount / 100 : plan.price,
      stripePrice: stripePrice?.id || null,
    };
  });

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Simple, transparent{" "}
            <span className="text-primary">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and upgrade as you grow. No hidden fees, cancel anytime.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${plan.isPopular ? "border-primary shadow-lg" : ""}`}
              data-testid={`card-pricing-${plan.id}`}
            >
              {plan.isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-2 pt-8">
                <h3 className="font-heading text-xl font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.isPopular ? "default" : "outline"}
                  onClick={() => {
                    if (plan.stripePrice) {
                      handleSubscribe(plan.stripePrice);
                    } else {
                      setLocation("/dashboard");
                    }
                  }}
                  disabled={!!loadingPriceId && loadingPriceId === plan.stripePrice}
                  data-testid={`button-pricing-${plan.id}`}
                >
                  {loadingPriceId === plan.stripePrice ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : plan.price === 0 ? (
                    "Get Started"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

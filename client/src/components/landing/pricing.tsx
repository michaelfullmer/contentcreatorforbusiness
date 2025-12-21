import { useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { PricingPlan } from "@shared/schema";

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for trying out our tools",
    features: [
      "10 AI generations per month",
      "3 templates",
      "Basic analytics",
      "Community support"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "For growing small businesses",
    features: [
      "Unlimited AI generations",
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
    price: 99,
    period: "month",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "API access",
      "Custom templates",
      "Dedicated account manager",
      "White-label options"
    ]
  }
];

export function Pricing() {
  const [, setLocation] = useLocation();

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
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                  onClick={() => setLocation("/dashboard")}
                  data-testid={`button-pricing-${plan.id}`}
                >
                  {plan.price === 0 ? "Get Started" : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Check, CircleDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

type PlanFeature = {
  text: string;
  included: boolean;
};

type PricingPlan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  popular?: boolean;
};

const plans: PricingPlan[] = [
  {
    name: 'Creator Plan',
    price: '$10',
    period: 'month',
    description: 'Perfect for individual creators and professionals',
    features: [
      { text: '10 documents per month', included: true },
      { text: 'AI Contract Assistant', included: true },
      { text: 'Custom Signature Canvas', included: true },
      { text: 'Post-Quantum Cryptographic Signing', included: true },
      { text: 'Email Delivery of Signed Documents', included: true },
    ],
    buttonText: 'Subscribe Now',
  },
  {
    name: 'Pro Plan',
    price: '$49',
    period: 'month',
    description: 'Ideal for small teams and growing businesses',
    features: [
      { text: '100 documents per month', included: true },
      { text: 'Everything in Creator Plan', included: true },
      { text: 'Voice Interaction with Documents', included: true },
      { text: 'Guest Signing Links (Kyber encrypted)', included: true },
    ],
    buttonText: 'Subscribe Now',
    popular: true,
  },
  {
    name: 'Premium Plan',
    price: '$149',
    period: 'month',
    description: 'For businesses with high-volume needs',
    features: [
      { text: '250 documents per month', included: true },
      { text: 'Everything in Pro Plan', included: true },
      { text: 'Priority Email Support', included: true },
    ],
    buttonText: 'Subscribe Now',
  },
  {
    name: 'Pay As You Go',
    price: '$3',
    period: 'document',
    description: 'For occasional signing needs',
    features: [
      { text: 'No subscription needed', included: true },
      { text: 'AI Document Assistant', included: true },
      { text: 'Secure Upload + Signing', included: true },
      { text: 'Email Delivery after signing', included: true },
    ],
    buttonText: 'Pay Per Document',
  },
];

export function Pricing() {
  return (
    <section className="section-padding bg-secondary-50" id="pricing">
      <div className="max-container px-2 sm:px-6 text-center">
        <h2 className="heading-2 mb-4">Simple, Honest Pricing</h2>
        <p className="body-text mb-8 md:mb-12 max-w-2xl mx-auto">
          Whether you need to sign once or hundreds of times, we've got a plan for you.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={cn(
                "relative flex flex-col h-full transition-all duration-200 hover:shadow-lg",
                plan.popular && "border-primary shadow-md md:scale-105"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-0 pt-6">
                <div className="flex items-center justify-center mb-4">
                  <CircleDollarSign className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-tertiary">/{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-tertiary">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3 mt-4 md:mt-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-left">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-2 pb-6">
                <Button 
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Lite',
    price: '49K',
    period: '/month',
    features: [
      '5 kg / month',
      'Wash & Fold only',
      '3-day turnaround',
      'Standard packaging',
    ],
    popular: false,
  },
  {
    name: 'Max',
    price: '129K',
    period: '/month',
    features: [
      '15 kg / month',
      'All services included',
      '24h turnaround',
      'Premium packaging',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Iron',
    price: '79K',
    period: '/month',
    features: [
      '20 pieces / month',
      'Ironing only',
      'Same-day delivery',
      'Hanger packaging',
    ],
    popular: false,
  },
  {
    name: 'Iron & Wash',
    price: '159K',
    period: '/month',
    features: [
      '20 kg / month',
      'Wash, Iron & Fold',
      '24h turnaround',
      'Premium packaging',
      'Free pickup',
    ],
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Pricing Plans
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
            Choose Your Plan
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Flexible plans for every laundry need. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col p-6 rounded-2xl border bg-card transition-all duration-300',
                plan.popular
                  ? 'border-primary shadow-xl shadow-primary/10 scale-[1.02]'
                  : 'border-border hover:border-primary/30 hover:shadow-md',
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold text-card-foreground mb-1">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-primary">
                  Rp {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-card-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

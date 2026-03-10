import {
  CalendarCheck,
  Truck,
  WashingMachine,
  PackageCheck,
} from 'lucide-react';

const steps = [
  {
    icon: CalendarCheck,
    title: 'Book',
    desc: 'Schedule a pickup from your phone in seconds.',
    step: 1,
  },
  {
    icon: Truck,
    title: 'Collect',
    desc: 'Our driver picks up your laundry at your door.',
    step: 2,
  },
  {
    icon: WashingMachine,
    title: 'Process',
    desc: 'Expert cleaning with premium detergents.',
    step: 3,
  },
  {
    icon: PackageCheck,
    title: 'Deliver',
    desc: 'Fresh clothes delivered back to you.',
    step: 4,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Simple Process
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.title} className="text-center relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary/20" />
              )}
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <s.icon className="h-7 w-7 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

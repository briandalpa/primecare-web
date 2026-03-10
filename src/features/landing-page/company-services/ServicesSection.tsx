import { Shirt, Wind, Sparkles, Baby } from 'lucide-react';

const services = [
  {
    icon: Shirt,
    title: 'Wash & Fold',
    desc: 'Everyday laundry washed, dried, and neatly folded.',
  },
  {
    icon: Sparkles,
    title: 'Dry Cleaning',
    desc: 'Premium care for delicate and formal garments.',
  },
  {
    icon: Wind,
    title: 'Ironing',
    desc: 'Crisp, wrinkle-free clothes ready to wear.',
  },
  {
    icon: Baby,
    title: 'Baby Items',
    desc: 'Gentle, hypoallergenic cleaning for baby clothes.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Our Services
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
            What We Provide
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            From everyday laundry to specialty cleaning, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mx-auto">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <s.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-1">
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

import { Clock, Shield, Truck, Leaf } from 'lucide-react';

const features = [
  { icon: Clock, label: '24h Turnaround', desc: 'Fast service guaranteed' },
  { icon: Shield, label: 'Fabric Safe', desc: 'Gentle on all materials' },
  { icon: Truck, label: 'Free Pickup', desc: 'We come to you' },
  { icon: Leaf, label: 'Eco Friendly', desc: 'Green cleaning solutions' },
];

export default function FeaturesStrip() {
  return (
    <section className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center text-center md:flex-row md:text-left gap-3 p-4 rounded-xl border border-border"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {f.label}
                </p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

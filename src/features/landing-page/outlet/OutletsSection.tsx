import { MapPin, Clock, Phone } from 'lucide-react';

const outlets = [
  {
    name: 'PrimeCare Central',
    address: 'Jl. Sudirman No. 45, Jakarta Pusat',
    hours: '07:00 - 21:00',
    phone: '+62 21 555 0101',
  },
  {
    name: 'PrimeCare South',
    address: 'Jl. Fatmawati No. 12, Jakarta Selatan',
    hours: '07:00 - 21:00',
    phone: '+62 21 555 0102',
  },
  {
    name: 'PrimeCare West',
    address: 'Jl. Puri Indah No. 88, Jakarta Barat',
    hours: '08:00 - 20:00',
    phone: '+62 21 555 0103',
  },
];

export default function OutletsSection() {
  return (
    <section id="outlets" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Our Locations
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
            Find an Outlet Near You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {outlets.map((o) => (
            <div
              key={o.name}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all"
            >
              <h3 className="text-base font-bold text-card-foreground mb-3">
                {o.name}
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {o.address}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {o.hours}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {o.phone}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Mail, Instagram, Facebook, Twitter, Bubbles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from './ui/input';

export default function Footer() {
  return (
    <footer className="bg-primary-dark py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Bubbles className="text-primary-foreground" />
              <span className="text-lg font-bold text-primary-foreground font-heading">
                PrimeCare
              </span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Professional laundry service that gives you more time for what
              matters most.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary-foreground mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              {['Wash & Fold', 'Dry Cleaning', 'Ironing', 'Baby Items'].map(
                (s) => (
                  <li key={s}>
                    <a
                      href="#services"
                      className="text-sm text-primary-foreground/50 hover:text-primary transition-colors"
                    >
                      {s}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Contact', 'Privacy Policy'].map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-sm text-primary-foreground/50 hover:text-primary transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary-foreground mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-primary-foreground/50 mb-3">
              Get tips and exclusive offers.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 text-sm"
              />
              <Button size="icon" className="shrink-0">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/40">
            © 2026 PrimeCare Laundry. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-primary-foreground/40 hover:text-primary transition-colors"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

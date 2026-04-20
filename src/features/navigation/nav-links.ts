import type { LucideIcon } from 'lucide-react';
import { Shirt, Tag, ListOrdered, MapPin, HelpCircle } from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navLinks: NavLink[] = [
  { label: 'Services', href: '#services', icon: Shirt },
  { label: 'Pricing', href: '#pricing', icon: Tag },
  { label: 'How It Works', href: '#how-it-works', icon: ListOrdered },
  { label: 'Outlets', href: '#outlets', icon: MapPin },
  { label: 'FAQ', href: '#faq', icon: HelpCircle },
];

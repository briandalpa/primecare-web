import type React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  cardClassName?: string;
}

export function AuthLayout({ children, cardClassName }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-foreground px-4 py-12">
      <Card className={cn('w-full max-w-md', cardClassName)}>
        {children}
      </Card>
    </div>
  );
}

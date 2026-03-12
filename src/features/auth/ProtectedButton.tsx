import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import React from 'react';

type Props = React.ComponentProps<typeof Button>;

const ProtectedButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, disabled, ...props }, ref) => {
    const { data: session } = useSession();
    const isAuthenticated = !!session?.user;
    const emailVerified = session?.user?.emailVerified ?? false;
    const isBlocked = isAuthenticated && !emailVerified;

    if (isBlocked) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="inline-flex">
              <Button ref={ref} {...props} disabled>
                {children}
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Verify your email to continue</TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Button ref={ref} disabled={disabled} {...props}>
        {children}
      </Button>
    );
  },
);
ProtectedButton.displayName = 'ProtectedButton';

export default ProtectedButton;

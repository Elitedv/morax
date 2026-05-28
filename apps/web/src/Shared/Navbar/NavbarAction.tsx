import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavbarActionProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'ghost';
}

export const NavbarAction = ({
  href,
  children,
  className,
  variant = 'default',
}: NavbarActionProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'text-[13px] font-medium transition-all duration-200 uppercase tracking-wide',
        variant === 'success' &&
          'text-[#00c853] hover:text-[#00e676] drop-shadow-[0_0_8px_rgba(0,200,83,0.15)]',
        variant === 'default' && 'text-white hover:text-zinc-200',
        variant === 'ghost' && 'text-zinc-500 hover:text-zinc-300',
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default NavbarAction;

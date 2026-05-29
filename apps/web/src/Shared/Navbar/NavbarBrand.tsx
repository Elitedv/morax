import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavbarBrandProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export const NavbarBrand = ({
  href = '/',
  children,
  className,
}: NavbarBrandProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'text-[15px] tracking-wide text-white transition-opacity duration-200 hover:opacity-80 flex items-center gap-2',
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default NavbarBrand;

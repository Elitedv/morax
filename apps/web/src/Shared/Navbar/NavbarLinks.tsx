import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface NavbarLinkItem {
  label: string;
  href: string;
  active?: boolean;
}

interface NavbarLinksProps {
  items: NavbarLinkItem[];
  className?: string;
}

export const NavbarLinks = ({ items, className }: NavbarLinksProps) => {
  return (
    <nav className={cn('flex items-center gap-6 md:gap-8', className)}>
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            'text-[13px] text-zinc-500 hover:text-zinc-200 transition-colors duration-200 font-medium uppercase tracking-wide',
            item.active && 'text-zinc-100',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavbarLinks;

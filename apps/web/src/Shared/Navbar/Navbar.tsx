import React from 'react';
import { cn } from '@/lib/utils';
import NavbarBrand from './NavbarBrand';
import NavbarLinks from './NavbarLinks';
import NavbarAction from './NavbarAction';
import { NavbarSubBar, NavbarSubBarItem } from './NavbarSubBar';

interface NavbarWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const NavbarWraper = ({ children, className }: NavbarWrapperProps) => {
  return (
    <header className={cn('w-full bg-black flex flex-col z-50', className)}>
      {children}
    </header>
  );
};

interface NavbarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const NavbarHeader = ({ children, className }: NavbarHeaderProps) => {
  return (
    <div
      className={cn(
        'w-full max-w-[1800px] mx-auto px-6 md:px-20 py-4.5 flex items-center justify-between',
        className,
      )}
    >
      {children}
    </div>
  );
};

// Bind sub-components for compound component composition
NavbarWraper.Header = NavbarHeader;
NavbarWraper.Brand = NavbarBrand;
NavbarWraper.Links = NavbarLinks;
NavbarWraper.Action = NavbarAction;
NavbarWraper.SubBar = NavbarSubBar;
NavbarWraper.SubBarItem = NavbarSubBarItem;

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  navItems: NavItem[];
}

const Navbar = ({ navItems }: NavbarProps) => {
  return (
    <NavbarWraper>
      <NavbarWraper.Header>
        <NavbarWraper.Brand href="/">Morax</NavbarWraper.Brand>
        <div className="flex items-center gap-14">
          <NavbarWraper.Links items={navItems} />
          <NavbarWraper.Action
            href="https://www.npmjs.com/package/create-morax"
            variant="success"
          >
            download now
          </NavbarWraper.Action>
        </div>
      </NavbarWraper.Header>

      <NavbarWraper.SubBar>
        <NavbarWraper.SubBarItem colIndex={1} align="left">
          PNPM Workspaces
        </NavbarWraper.SubBarItem>
        <NavbarWraper.SubBarItem colIndex={8} align="right" status={true}>
          Current v1.0.4
        </NavbarWraper.SubBarItem>
      </NavbarWraper.SubBar>
    </NavbarWraper>
  );
};

export default Navbar;

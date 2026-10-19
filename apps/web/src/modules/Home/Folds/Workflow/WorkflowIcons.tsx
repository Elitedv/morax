'use client';

import React from 'react';
import { motion } from 'motion/react';

// Custom 8-blade turbine logo inspired by the mockup
export const TurbineSpinner = ({
  className = '',
  active = false,
}: {
  className?: string;
  active?: boolean;
}) => {
  // 8 blades rotated around the center (50, 50)
  const bladeRotations = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer subtle glow */}
      {active && (
        <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl animate-pulse" />
      )}

      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: active ? 10 : 25,
          ease: 'linear',
        }}
      >
        <defs>
          <linearGradient
            id="turbineGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="zincGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e4e4e7" />
            <stop offset="100%" stopColor="#71717a" />
          </linearGradient>
        </defs>

        {/* Render the 8 turbine blades */}
        {bladeRotations.map((rotation, i) => (
          <g key={rotation} transform={`rotate(${rotation} 50 50)`}>
            <path
              // Curved aerodynamic wedge shape
              d="M50 15 C58 15 65 22 63 32 C61 38 53 40 48 37 C44 33 45 20 50 15 Z"
              fill={
                active && i % 3 === 0
                  ? 'url(#turbineGradient)'
                  : 'url(#zincGradient)'
              }
              opacity={active ? (i % 3 === 0 ? 1 : 0.6) : 0.4}
              className="transition-all duration-500"
            />
          </g>
        ))}

        {/* Center hollow hub */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="#09090b"
          stroke="#27272a"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="50"
          r="4"
          fill={active ? '#f97316' : '#27272a'}
          className="transition-colors duration-500"
        />
      </motion.svg>
    </div>
  );
};

// 1. Next.js App Scaffold Icon
export const NextjsIcon = ({ active = false }: { active?: boolean }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={active ? '#f97316' : '#52525b'}
        strokeWidth="1.5"
        className="transition-colors duration-300"
      />
      <path
        d="M17 17.5L9.5 8.5V15.5"
        stroke={active ? '#ffffff' : '#a1a1aa'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-300"
      />
      <path
        d="M14.5 8.5H15.5V15.5"
        stroke={active ? '#f97316' : '#a1a1aa'}
        strokeWidth="1.5"
        strokeLinecap="round"
        className="transition-colors duration-300"
      />
    </svg>
  );
};

// 2. React Icon (Atom model)
export const ReactIcon = ({ active = false }: { active?: boolean }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="3"
        stroke={active ? '#f97316' : '#52525b'}
        strokeWidth="1.5"
        transform="rotate(30 12 12)"
        className="transition-colors duration-300"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="3"
        stroke={active ? '#f97316' : '#52525b'}
        strokeWidth="1.5"
        transform="rotate(90 12 12)"
        className="transition-colors duration-300"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="3"
        stroke={active ? '#f97316' : '#52525b'}
        strokeWidth="1.5"
        transform="rotate(150 12 12)"
        className="transition-colors duration-300"
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        fill={active ? '#f97316' : '#a1a1aa'}
        className="transition-colors duration-300"
      />
    </svg>
  );
};

// 3. Express Icon (Backend layers / server)
export const ExpressIcon = ({ active = false }: { active?: boolean }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="6"
        rx="1"
        stroke={active ? '#f97316' : '#52525b'}
        strokeWidth="1.5"
        className="transition-colors duration-300"
      />
      <rect
        x="3"
        y="14"
        width="18"
        height="6"
        rx="1"
        stroke={active ? '#f97316' : '#52525b'}
        strokeWidth="1.5"
        className="transition-colors duration-300"
      />
      <circle
        cx="7"
        cy="7"
        r="1"
        fill={active ? '#f97316' : '#a1a1aa'}
        className="transition-colors duration-300"
      />
      <circle
        cx="10"
        cy="7"
        r="1"
        fill={active ? '#f97316' : '#a1a1aa'}
        className="transition-colors duration-300"
      />
      <circle
        cx="7"
        cy="17"
        r="1"
        fill={active ? '#f97316' : '#a1a1aa'}
        className="transition-colors duration-300"
      />
      <circle
        cx="10"
        cy="17"
        r="1"
        fill={active ? '#f97316' : '#a1a1aa'}
        className="transition-colors duration-300"
      />
      <path
        d="M14 7H17M14 17H17"
        stroke={active ? '#ffffff' : '#71717a'}
        strokeWidth="1.5"
        strokeLinecap="round"
        className="transition-colors duration-300"
      />
    </svg>
  );
};

// 4. ESLint Icon (Shield check)
export const ESLintIcon = ({ active = false }: { active?: boolean }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 12 4 18 12 22Z"
        stroke={active ? '#f97316' : '#52525b'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-300"
      />
      <path
        d="M9 11L11 13L15 9"
        stroke={active ? '#ffffff' : '#a1a1aa'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-300"
      />
    </svg>
  );
};

// 5. Prettier Icon (Brush / Sparkles)
export const PrettierIcon = ({ active = false }: { active?: boolean }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z"
        stroke={active ? '#f97316' : '#52525b'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="transition-colors duration-300"
      />
      <path
        d="M5 3L6 5M3 5L5 6M19 19L20 21M21 19L19 20"
        stroke={active ? '#f97316' : '#71717a'}
        strokeWidth="1"
        strokeLinecap="round"
        className="transition-colors duration-300"
      />
    </svg>
  );
};

// 6. Husky Icon (Dog / Guard)
export const HuskyIcon = ({ active = false }: { active?: boolean }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <rect
        x="3"
        y="11"
        width="18"
        height="10"
        rx="2"
        stroke={active ? '#f97316' : '#52525b'}
        strokeWidth="1.5"
        className="transition-colors duration-300"
      />
      <path
        d="M12 2C8.5 2 6 5 6 9V11H18V9C18 5 15.5 2 12 2Z"
        stroke={active ? '#f97316' : '#52525b'}
        strokeWidth="1.5"
        strokeLinecap="round"
        className="transition-colors duration-300"
      />
      <circle
        cx="12"
        cy="16"
        r="1.5"
        fill={active ? '#f97316' : '#a1a1aa'}
        className="transition-colors duration-300"
      />
    </svg>
  );
};

// Gear Icon for Config Engine Node
export const GearIcon = ({
  className = '',
  active = false,
}: {
  className?: string;
  active?: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`w-6 h-6 ${className}`}
    >
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        stroke={active ? '#f97316' : '#71717a'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-500"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke={active ? '#f97316' : '#71717a'}
        strokeWidth="1.5"
        className="transition-colors duration-500"
      />
    </svg>
  );
};

// Layers Icon for Scaffolding Core Node
export const LayersIcon = ({
  className = '',
  active = false,
}: {
  className?: string;
  active?: boolean;
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`w-6 h-6 ${className}`}
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke={active ? '#f97316' : '#71717a'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="transition-colors duration-500"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke={active ? '#f97316' : '#71717a'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-500"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke={active ? '#f97316' : '#71717a'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-500"
      />
    </svg>
  );
};

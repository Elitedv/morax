const WorkspaceConfigWireframe = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-40 h-40 text-orange-500/35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Isometric Cube Outline */}
      <path
        d="M100 25 L170 65 L170 135 L100 175 L30 135 L30 65 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* Front Corner lines */}
      <path
        d="M100 25 L100 175 M30 65 L100 105 M170 65 L100 105"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
      {/* Inner offset plane */}
      <path
        d="M100 50 L145 76 L145 120 L100 145 L55 120 L55 76 Z"
        stroke="currentColor"
        strokeWidth="0.6"
        className="opacity-40"
      />
      <circle
        cx="100"
        cy="105"
        r="40"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="5 5"
      />
    </svg>
  );
};

// 2. Concentric Target & Radar Backdrop for Scaffolding Engine
const ScaffoldingEngineWireframe = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-40 h-40 text-orange-500/35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Radar rings */}
      <circle
        cx="100"
        cy="100"
        r="75"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="4 4"
      />
      <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="1" />
      <circle
        cx="100"
        cy="100"
        r="30"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />
      {/* Crosshairs with ticks */}
      <line
        x1="20"
        y1="100"
        x2="180"
        y2="100"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <line
        x1="100"
        y1="20"
        x2="100"
        y2="180"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      {/* Angled scanner sweep */}
      <line
        x1="100"
        y1="100"
        x2="153"
        y2="47"
        stroke="currentColor"
        strokeWidth="1.2"
        className="opacity-80"
      />
      <path
        d="M100 100 L140 60 A 55 55 0 0 0 100 45 Z"
        fill="currentColor"
        className="opacity-5"
      />
    </svg>
  );
};

// 3. Lightning Rails & Tech Grid Backdrop for Turborepo
const TurborepoWireframe = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-40 h-40 text-orange-500/35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Horizontal grid lines */}
      <line
        x1="20"
        y1="50"
        x2="180"
        y2="50"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />
      <line
        x1="20"
        y1="100"
        x2="180"
        y2="100"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <line
        x1="20"
        y1="150"
        x2="180"
        y2="150"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />
      {/* Perspective rail tracks */}
      <line
        x1="30"
        y1="180"
        x2="80"
        y2="20"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="170"
        y1="180"
        x2="120"
        y2="20"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="100"
        y1="180"
        x2="100"
        y2="20"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="4 4"
      />
      {/* Moving data packets */}
      <circle cx="65" cy="80" r="3.5" fill="currentColor" />
      <circle cx="135" cy="80" r="3.5" fill="currentColor" />
      <circle cx="100" cy="140" r="2.5" fill="currentColor" />
    </svg>
  );
};

// 4. Concentric Hexagons Backdrop for Shared UI components
const SharedUiWireframe = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-40 h-40 text-orange-500/35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Hexagon */}
      <path
        d="M100 20 L169 60 L169 140 L100 180 L31 140 L31 60 Z"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="3 3"
      />
      {/* Middle Hexagon */}
      <path
        d="M100 40 L152 70 L152 130 L100 160 L48 130 L48 70 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Inner Hexagon */}
      <path
        d="M100 65 L130 82 L130 118 L100 135 L70 118 L70 82 Z"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />
      {/* Radial links */}
      <line
        x1="100"
        y1="20"
        x2="100"
        y2="65"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <line
        x1="169"
        y1="60"
        x2="130"
        y2="82"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <line
        x1="169"
        y1="140"
        x2="130"
        y2="118"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <line
        x1="100"
        y1="180"
        x2="100"
        y2="135"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <line
        x1="31"
        y1="140"
        x2="70"
        y2="118"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <line
        x1="31"
        y1="60"
        x2="70"
        y2="82"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
};

// 5. Connective Network Node Backdrop for DB Schema
const DatabaseWireframe = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-40 h-40 text-orange-500/35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mesh nodes */}
      <circle
        cx="40"
        cy="60"
        r="5"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx="160"
        cy="50"
        r="4"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx="100"
        cy="150"
        r="6"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <circle
        cx="140"
        cy="120"
        r="5"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        fillOpacity="0.2"
      />
      <circle
        cx="60"
        cy="130"
        r="3.5"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <circle
        cx="100"
        cy="50"
        r="3"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Node connecting web */}
      <line
        x1="40"
        y1="60"
        x2="100"
        y2="50"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="3 3"
      />
      <line
        x1="100"
        y1="50"
        x2="160"
        y2="50"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="3 3"
      />
      <line
        x1="40"
        y1="60"
        x2="60"
        y2="130"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <line
        x1="60"
        y1="130"
        x2="100"
        y2="150"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <line
        x1="100"
        y1="150"
        x2="140"
        y2="120"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <line
        x1="140"
        y1="120"
        x2="160"
        y2="50"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      {/* Central linking lines */}
      <line
        x1="100"
        y1="100"
        x2="40"
        y2="60"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <line
        x1="100"
        y1="100"
        x2="160"
        y2="50"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="150"
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </svg>
  );
};

// 6. Compass Starburst Backdrop for Symlinks
const SymlinkWireframe = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-40 h-40 text-orange-500/35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Nested compass rings */}
      <circle
        cx="100"
        cy="100"
        r="70"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <circle
        cx="100"
        cy="100"
        r="60"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeDasharray="3 3"
      />
      <circle
        cx="100"
        cy="100"
        r="25"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      {/* 8-pointed star lines */}
      <line
        x1="100"
        y1="15"
        x2="100"
        y2="185"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <line
        x1="15"
        y1="100"
        x2="185"
        y2="100"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <line
        x1="40"
        y1="40"
        x2="160"
        y2="160"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="4 4"
      />
      <line
        x1="40"
        y1="160"
        x2="160"
        y2="40"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="4 4"
      />
      {/* Corner indicators */}
      <path d="M100 22 L105 32 L95 32 Z" fill="currentColor" />
      <path d="M100 178 L105 168 L95 168 Z" fill="currentColor" />
      <path d="M22 100 L32 105 L32 95 Z" fill="currentColor" />
      <path d="M178 100 L168 105 L168 95 Z" fill="currentColor" />
    </svg>
  );
};

export {
  WorkspaceConfigWireframe,
  ScaffoldingEngineWireframe,
  DatabaseWireframe,
  SymlinkWireframe,
  TurborepoWireframe,
  SharedUiWireframe,
};

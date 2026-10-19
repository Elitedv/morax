'use client';

import React from 'react';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const AI_SKILLS_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'skills-cli', label: 'skills.sh Integration' },
  { id: 'rules-migration', label: 'Automatic Rules Migration' },
  { id: 'supported-agents', label: 'Supported AI Editors' },
  { id: 'structure', label: 'Recommended .agents Layout' },
];

export const AiSkillsContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          AI Agent Skills & Rules (`.agents`)
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Morax is built from the ground up to be first-class agent-ready. When
          bootstrapping your project, Morax integrates with{' '}
          <strong className="text-white">skills.sh</strong> to equip AI
          assistants with deep contextual awareness of your workspace rules,
          architectural patterns, and coding conventions.
        </p>
      </section>

      {/* Skills CLI Integration */}
      <section
        id="skills-cli"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Interactive Skills Integration
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          During initialization, the wizard prompts you to install curated
          community skills. It runs the skills CLI seamlessly:
        </p>

        <DocsCodeBlock
          code={`✔ Install AI Agent Skills (skills.sh)? (Y/n)
✔ Launching interactive skills CLI...
✔ Installing agent skills from repository...
✔ Configured AI rules: Moved rules to .agents/rules`}
          language="text"
          title="CLI Output"
        />
      </section>

      {/* Rules Migration */}
      <section
        id="rules-migration"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Automatic Rules Migration Engine
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Some tools create nested rule folders like{' '}
          <code className="text-zinc-300 font-mono">.agent/skills/rules</code>{' '}
          or isolated claude configurations. Morax automatically scans for
          rules, flattens them into the standard{' '}
          <code className="text-orange-400 font-mono text-xs">
            .agents/rules
          </code>{' '}
          directory, and cleans up redundant directories.
        </p>
      </section>

      {/* Supported Editors */}
      <section
        id="supported-agents"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Supported AI Agents & IDEs
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Rules placed in{' '}
          <code className="text-orange-400 font-mono text-xs">
            .agents/rules
          </code>{' '}
          are natively recognized by modern agentic tools:
        </p>

        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400 font-mono">
          <li>
            <strong className="text-white font-sans">
              Google Antigravity:
            </strong>{' '}
            Discovers workspace skills and rules under{' '}
            <code className="text-orange-400">.agents/</code>
          </li>
          <li>
            <strong className="text-white font-sans">Cursor:</strong> Reads
            prompt guidelines and rule definitions
          </li>
          <li>
            <strong className="text-white font-sans">Claude Code:</strong>{' '}
            Contextual instructions and monorepo command references
          </li>
          <li>
            <strong className="text-white font-sans">GitHub Copilot:</strong>{' '}
            Workspace instruction files
          </li>
        </ul>
      </section>

      {/* Layout */}
      <section
        id="structure"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Recommended Layout
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Here is how your AI configuration is organized in the root workspace:
        </p>

        <DocsCodeBlock
          code={`.agents/
├── rules/
│   ├── monorepo.md         # PNPM workspace conventions & filter rules
│   ├── typescript.md       # Strict typing guidelines
│   └── database.md         # Drizzle schema migration policies
└── skills/
    ├── component-generator/ # Skill instructions
    └── db-migrator/         # Skill instructions`}
          language="text"
          title=".agents Layout"
        />
      </section>
    </div>
  );
};

export default AiSkillsContent;

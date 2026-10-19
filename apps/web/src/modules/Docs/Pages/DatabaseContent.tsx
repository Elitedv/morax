'use client';
import DocsCodeBlock from '../components/DocsCodeBlock';

export const DATABASE_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'schema-definition', label: 'Schema Definitions' },
  { id: 'db-client', label: 'Pooled DB Client' },
  { id: 'migrations', label: 'Migrations & Studio' },
  { id: 'multi-app-access', label: 'Multi-App Access' },
];

export const DatabaseContent = () => {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <section id="overview" className="space-y-4">
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Database Package (`@repo/db`)
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Morax centralizes database models and connections into{' '}
          <code className="text-orange-400 font-mono text-xs bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
            packages/db
          </code>{' '}
          powered by <strong className="text-white">Drizzle ORM</strong>. This
          allows both your server backend and Next.js server actions to share
          the exact same database schema and types.
        </p>
      </section>

      {/* Schema Definitions */}
      <section
        id="schema-definition"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Schema Definitions
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Schemas are defined with full TypeScript inference:
        </p>

        <DocsCodeBlock
          code={`// packages/db/src/schema/users.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;`}
          language="typescript"
          title="packages/db/src/schema/users.ts"
        />
      </section>

      {/* Pooled DB Client */}
      <section
        id="db-client"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Pooled Database Client
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          A singleton connection client is exported from the package index:
        </p>

        <DocsCodeBlock
          code={`// packages/db/src/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from '@repo/env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export * from './schema';`}
          language="typescript"
          title="packages/db/src/index.ts"
        />
      </section>

      {/* Migrations & Studio */}
      <section
        id="migrations"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Migrations & Drizzle Studio
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Run migrations or launch the visual database GUI directly from the
          root workspace:
        </p>

        <DocsCodeBlock
          code={`# Generate migration files
pnpm --filter @repo/db generate

# Push schema directly in development
pnpm --filter @repo/db push

# Open Drizzle Studio in browser
pnpm --filter @repo/db studio`}
          language="bash"
          title="Database Commands"
        />
      </section>

      {/* Multi-App Access */}
      <section
        id="multi-app-access"
        className="space-y-4 pt-4 border-t border-zinc-900/80"
      >
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Multi-App Access
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Both <code className="text-zinc-300 font-mono">apps/server</code> and{' '}
          <code className="text-zinc-300 font-mono">apps/web</code> can query
          the database with zero duplication of models:
        </p>

        <DocsCodeBlock
          code={`import { db, users } from '@repo/db';

const allUsers = await db.select().from(users);`}
          language="typescript"
          title="Unified Query"
        />
      </section>
    </div>
  );
};

export default DatabaseContent;

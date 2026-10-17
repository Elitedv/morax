import { select } from '@clack/prompts';
import handleCancel from '../../../utils/isCancel.js';
import { promptDrizzle, runDrizzleSetup } from './drizzle.js';
import type { DbDialect, DbSelection, OrmType } from '../../../types/index.js';

export type { OrmType, DbSelection };

export async function promptDatabase(): Promise<DbSelection> {
  const ormChoice = await select({
    message: 'Which ORM would you like to configure in packages/db?',
    options: [
      {
        value: 'drizzle',
        label: 'Drizzle ORM',
        hint: 'Lightweight, SQL-like TypeScript ORM (PostgreSQL, SQLite)',
      },
      {
        value: 'none',
        label: 'None',
        hint: 'Skip database package setup',
      },
    ],
    initialValue: 'drizzle',
  });

  handleCancel(ormChoice);

  if (ormChoice === 'drizzle') {
    const config = await promptDrizzle();
    return {
      orm: 'drizzle',
      dialect: config.dialect,
      postgresProvider: config.postgresProvider,
      neonMode: config.neonMode,
    };
  }

  return { orm: 'none' };
}

export async function runDatabaseSetup(
  projectPath: string,
  selection: DbSelection,
  linter: string = 'none',
) {
  if (selection.orm === 'drizzle' && selection.dialect) {
    await runDrizzleSetup(
      projectPath,
      selection.dialect,
      linter,
      selection.postgresProvider,
      selection.neonMode,
    );
  }
}

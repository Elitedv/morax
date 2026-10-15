import { select } from '@clack/prompts';
import handleCancel from '../utils/isCancel.js';
import { promptDrizzle, runDrizzleSetup } from './drizzle.js';
import { promptPrisma, runPrismaSetup } from './prisma.js';

export type OrmType = 'drizzle' | 'prisma' | 'none';

export interface DbSelection {
  orm: OrmType;
  dialect?: string;
}

export async function promptDatabase(): Promise<DbSelection> {
  const ormChoice = await select({
    message: 'Which ORM would you like to configure in packages/db?',
    options: [
      {
        value: 'drizzle',
        label: 'Drizzle ORM',
        hint: 'Lightweight, SQL-like TypeScript ORM',
      },
      {
        value: 'prisma',
        label: 'Prisma ORM (v8)',
        hint: 'Full-featured type-safe ORM & database toolkit',
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
    const dialect = await promptDrizzle();
    return { orm: 'drizzle', dialect };
  }

  if (ormChoice === 'prisma') {
    const dialect = await promptPrisma();
    return { orm: 'prisma', dialect };
  }

  return { orm: 'none' };
}

export async function runDatabaseSetup(
  projectPath: string,
  selection: DbSelection,
  linter: string = 'none',
) {
  if (selection.orm === 'drizzle' && selection.dialect) {
    await runDrizzleSetup(projectPath, selection.dialect, linter);
  } else if (selection.orm === 'prisma' && selection.dialect) {
    await runPrismaSetup(
      projectPath,
      selection.dialect as 'postgresql' | 'mongodb',
      linter,
    );
  }
}

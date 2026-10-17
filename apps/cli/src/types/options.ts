export type LinterType = 'biome' | 'oxlint' | 'none';
export type FormatterType = 'prettier' | 'biome' | 'none';
export type GitHookType = 'lefthook' | 'husky' | 'none';
export type OrmType = 'drizzle' | 'none';
export type ServerFramework = 'express' | 'hono' | 'none';
export type ServerRuntime = 'node' | 'bun';
export type ServerDeploymentTarget = 'docker' | 'vercel' | 'none';
export type DbDialect = 'postgresql' | 'sqlite';
export type PostgresProvider = 'docker' | 'neon';
export type NeonConnectionMode = 'serverless' | 'pool';

export interface DbSelection {
  orm: OrmType;
  dialect?: DbDialect;
  postgresProvider?: PostgresProvider;
  neonMode?: NeonConnectionMode;
}

export interface WorkspaceAnswers {
  name: string;
  projectPath: string;
  gitInitialized: boolean;
  selectedApps: ('web' | 'server')[];
  serverRuntime?: ServerRuntime;
  db: DbSelection;
  setupRedis: boolean;
  linter: LinterType;
  formatter: FormatterType;
  gitHook: GitHookType;
  includeTypescript: boolean;
}

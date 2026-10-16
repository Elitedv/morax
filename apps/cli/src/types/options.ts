export type LinterType = 'biome' | 'oxlint' | 'none';
export type FormatterType = 'prettier' | 'biome' | 'none';
export type GitHookType = 'lefthook' | 'husky' | 'none';
export type OrmType = 'drizzle' | 'none';
export type ServerRuntime = 'node' | 'bun';

export interface DbSelection {
  orm: OrmType;
  dialect?: string;
}

export interface WorkspaceAnswers {
  name: string;
  projectPath: string;
  gitInitialized: boolean;
  selectedApps: ('web' | 'server')[];
  serverRuntime?: ServerRuntime;
  db: DbSelection;
  linter: LinterType;
  formatter: FormatterType;
  gitHook: GitHookType;
  includeTypescript: boolean;
}

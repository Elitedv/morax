export interface EnvSetupOptions {
  projectPath: string;
  hasDb: boolean;
  dbDialect?: 'postgresql' | 'sqlite';
  hasRedis: boolean;
  hasServer: boolean;
  webFramework: 'nextjs' | 'react' | 'skip';
}

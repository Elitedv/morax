import type { PostgresProvider, WebFramework } from '../../../types/index.js';

export interface EnvSetupOptions {
  projectPath: string;
  hasDb: boolean;
  dbDialect?: 'postgresql' | 'sqlite';
  postgresProvider?: PostgresProvider;
  hasDocker?: boolean;
  hasRedis: boolean;
  hasServer: boolean;
  webFramework: WebFramework;
}

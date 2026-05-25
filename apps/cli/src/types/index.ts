export interface WorkspaceConfig {
  name: string;
  directories: ('apps' | 'packages')[];
  gitInit: boolean;
  setupHusky: boolean;
}

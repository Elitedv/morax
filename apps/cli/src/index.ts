import pc from 'picocolors';
import { runWorkspaceScaffolder } from './core/runner.js';

async function main() {
  await runWorkspaceScaffolder();
}

main().catch((err) => {
  console.error(pc.red('Fatal Error during execution:'), err);
  process.exit(1);
});

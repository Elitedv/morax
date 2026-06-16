import pc from 'picocolors';
import { runWorkspaceScaffolder } from './core/runner.js';

async function main() {
  const isReactOnly =
    process.argv.includes('--react') || process.argv.includes('-r');
  const isNextOnly =
    process.argv.includes('--nextjs') ||
    process.argv.includes('--next') ||
    process.argv.includes('-n');
  await runWorkspaceScaffolder({ react: isReactOnly, next: isNextOnly });
}

main().catch((err) => {
  console.error(pc.red('Fatal Error during execution:'), err);
  process.exit(1);
});

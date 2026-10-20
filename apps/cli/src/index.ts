// Suppress Node.js runtime deprecation warnings (e.g. DEP0190)
process.env.NODE_OPTIONS =
  `${process.env.NODE_OPTIONS || ''} --no-deprecation`.trim();
process.env.NODE_NO_WARNINGS = '1';

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

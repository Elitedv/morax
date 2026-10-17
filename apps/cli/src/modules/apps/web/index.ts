import { select } from '@clack/prompts';
import handleCancel from '../../../utils/isCancel.js';
import { runShadcnSetup } from './shadcn.js';
import { setupNextjs } from './nextjs.js';
import { setupReact } from './react.js';

export async function addWeb(projectPath: string) {
  const framework = await select({
    message:
      'Which frontend website setup would you like to include in apps/web?',
    options: [
      {
        value: 'nextjs',
        label: 'Next.js',
        hint: 'App Router',
      },
      {
        value: 'react',
        label: 'React (Vite)',
        hint: 'Vite',
      },
      {
        value: 'skip',
        label: 'None',
        hint: 'Skip',
      },
    ],
    initialValue: 'nextjs',
  });

  handleCancel(framework);

  if (framework === 'nextjs') {
    await setupNextjs(projectPath);
    // Prompt and execute shadcn UI setup in next.js app
    await runShadcnSetup(projectPath);
  } else if (framework === 'react') {
    await setupReact(projectPath);
  }

  return framework as 'nextjs' | 'react' | 'skip';
}

export { setupNextjs } from './nextjs.js';
export { setupReact } from './react.js';
export { runShadcnSetup, setupShadcn, promptShadcn } from './shadcn.js';

import { select } from '@clack/prompts';
import handleCancel from '../utils/isCancel.js';
import { runShadcnSetup } from '../tasks/shadcn.js';
import { setupNextjs } from '../tasks/nextjs.js';
import { setupReact } from '../tasks/react.js';

export default async function addweb(projectPath: string) {
  const framework = await select({
    message:
      'Which frontend website setup would you like to include in apps/web?',
    options: [
      {
        value: 'nextjs',
        label: 'Next.js',
        hint: 'The React Framework for the Web',
      },
      {
        value: 'react',
        label: 'React (Vite)',
        hint: 'Vite React Starter Template',
      },
      {
        value: 'skip',
        label: 'Skip',
        hint: 'Skip setting up a frontend website',
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
}

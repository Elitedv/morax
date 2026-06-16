import { text } from '@clack/prompts';
import handleCancel from '../utils/isCancel.js';

export async function promptWorkspaceName(isMonorepo = true): Promise<string> {
  const nameInput = await text({
    message: isMonorepo
      ? 'What is the name of your new monorepo workspace?'
      : 'What is the name of your new project?',
    placeholder: isMonorepo ? 'morax-workspace' : 'my-app',
    validate(value) {
      if (value && value.includes(' '))
        return isMonorepo
          ? 'Workspace name cannot contain spaces!'
          : 'Project name cannot contain spaces!';
    },
  });

  handleCancel(nameInput);

  // Fallback to defaults if left blank
  return (
    String(nameInput).trim() || (isMonorepo ? 'morax-workspace' : 'my-app')
  );
}

import { text } from '@clack/prompts';
import handleCancel from '../utils/isCancel.js';

export async function promptWorkspaceName(): Promise<string> {
  const nameInput = await text({
    message: 'What is the name of your new monorepo workspace?',
    placeholder: 'morax-workspace',
    validate(value) {
      if (value && value.includes(' '))
        return 'Workspace name cannot contain spaces!';
    },
  });

  handleCancel(nameInput);

  // Fallback to morax-workspace if left blank
  return String(nameInput).trim() || 'morax-workspace';
}

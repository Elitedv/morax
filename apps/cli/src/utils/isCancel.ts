import { isCancel, cancel } from '@clack/prompts';
import pc from 'picocolors';

export default function handleCancel(input: any) {
  if (isCancel(input)) {
    cancel(pc.red('✖ Morax cancelled.'));
    process.exit(0);
  }
}

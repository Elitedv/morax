import { multiselect, select, spinner } from '@clack/prompts';
import pc from 'picocolors';
import handleCancel from '../../utils/isCancel.js';
import { setupProjectDocs, type ProjectDocsOptions } from './docs.js';
import { setupAgentDocs, type AgentDocsOptions } from './agents.js';
import { setupLicense, type LicenseType } from './license.js';
import { setupDockerScripts } from './scripts.js';

export interface WorkspaceExtrasOptions
  extends ProjectDocsOptions, AgentDocsOptions {
  author?: string;
}

export async function promptAndSetupExtras(
  projectPath: string,
  options: WorkspaceExtrasOptions,
): Promise<{ hasScripts: boolean; choices: string[] }> {
  const extraOptions = [
    {
      value: 'docs',
      label: 'Documentation (/docs)',
      hint: 'Architecture & guides',
    },
    {
      value: 'agents',
      label: 'AI Agent Rules (CLAUDE.md & AGENTS.md)',
      hint: 'Rules for AI coding assistants',
    },
    {
      value: 'license',
      label: 'License (LICENSE)',
      hint: 'Open source license file',
    },
  ];

  if (options.hasDocker) {
    extraOptions.push({
      value: 'scripts',
      label: 'Docker Scripts (scripts/)',
      hint: 'Helper scripts for Docker',
    });
  }

  const selectedExtras = await multiselect({
    message: 'Select additional documentation & project files:',
    options: extraOptions,
    initialValues: ['docs'],
    required: false,
  });

  handleCancel(selectedExtras);
  const choices = selectedExtras as string[];
  const hasScripts = choices.includes('scripts');

  let selectedLicense: LicenseType | 'none' = 'none';
  if (choices.includes('license')) {
    const licenseChoice = await select({
      message: 'Choose an open source license:',
      options: [
        {
          value: 'MIT',
          label: 'MIT',
          hint: 'Permissive (Recommended)',
        },
        {
          value: 'Apache-2.0',
          label: 'Apache 2.0',
          hint: 'Permissive with patent grant',
        },
        {
          value: 'GPL-3.0',
          label: 'GPL v3',
          hint: 'Strong copyleft',
        },
        {
          value: 'BSD-3-Clause',
          label: 'BSD 3-Clause',
          hint: 'Permissive with attribution',
        },
        {
          value: 'Unlicense',
          label: 'Unlicense',
          hint: 'Public domain dedication',
        },
      ],
      initialValue: 'MIT',
    });

    handleCancel(licenseChoice);
    selectedLicense = licenseChoice as LicenseType;
  }

  const s = spinner();
  s.start('Generating documentation and repository files...');

  try {
    if (hasScripts) {
      await setupDockerScripts(projectPath, options.dockerServices);
    }

    if (choices.includes('docs')) {
      await setupProjectDocs(projectPath, {
        ...options,
        hasDockerScripts: hasScripts,
      });
    }

    if (choices.includes('agents')) {
      await setupAgentDocs(projectPath, {
        ...options,
        hasDockerScripts: hasScripts,
      });
    }

    if (choices.includes('license') && selectedLicense !== 'none') {
      await setupLicense(
        projectPath,
        selectedLicense,
        options.author || options.projectName,
      );
    }

    s.stop(
      pc.green(
        '✔ Success: Additional project documentation and files generated',
      ),
    );
  } catch {
    s.stop(
      pc.yellow('⚠ Warning: Failed to generate some extra documentation files'),
    );
  }

  return { hasScripts, choices };
}

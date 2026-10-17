import { multiselect, spinner } from '@clack/prompts';
import pc from 'picocolors';
import fsPromises from 'fs/promises';
import path from 'path';
import handleCancel from '../../utils/isCancel.js';
import { runCommand } from '../../utils/exec.js';

export interface CuratedSkill {
  id: string;
  name: string;
  repo: string;
  description: string;
  hint: string;
}

export const CURATED_SKILLS: CuratedSkill[] = [
  {
    id: 'modular-nextjs-dynamic',
    name: 'Modular Next.js (Dynamic)',
    repo: 'AshutoshDM1/skills',
    description: 'Dynamic modular architecture for Next.js webapps',
    hint: 'SaaS, dashboards & portals',
  },
  {
    id: 'modular-nextjs-lean',
    name: 'Modular Next.js (Lean)',
    repo: 'AshutoshDM1/skills',
    description: 'Lean modular architecture for Next.js landing pages',
    hint: 'Landing pages & marketing sites',
  },
];

export async function promptSkills(): Promise<string[]> {
  const result = await multiselect({
    message: 'Install curated AI Agent Skills (skills.sh)?',
    options: CURATED_SKILLS.map((skill) => ({
      value: skill.id,
      label: skill.name,
      hint: skill.hint,
    })),
    initialValues: [],
    required: false,
  });

  handleCancel(result);
  return result as string[];
}

export async function installSkills(
  projectPath: string,
  selectedSkillIds: string[],
) {
  if (selectedSkillIds.length === 0) {
    return;
  }

  const s = spinner();
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

  for (const skillId of selectedSkillIds) {
    const skill = CURATED_SKILLS.find((item) => item.id === skillId);
    if (!skill) continue;

    s.start(`Installing skill: ${pc.cyan(skill.name)} via skills.sh...`);
    try {
      const command = `${npxCmd} -y skills add ${skill.repo} --skill ${skill.id} -y`;
      await runCommand(command, { cwd: projectPath, silent: true });
      s.stop(pc.green(`✔ Installed ${skill.name} successfully`));
    } catch (error: any) {
      s.stop(
        pc.yellow(
          `⚠ Warning: Failed to install ${skill.name} (${error.message || 'skills CLI error'})`,
        ),
      );
    }
  }

  // 1. Remove unwanted .claude folder created by skills.sh CLI
  const claudeDir = path.join(projectPath, '.claude');
  try {
    await fsPromises.rm(claudeDir, { recursive: true, force: true });
  } catch {}

  // 2. Ensure .agents/ is present in root .gitignore
  const gitignorePath = path.join(projectPath, '.gitignore');
  try {
    let gitignoreContent = '';
    try {
      gitignoreContent = await fsPromises.readFile(gitignorePath, 'utf8');
    } catch {
      gitignoreContent = '';
    }

    if (!gitignoreContent.includes('.agents')) {
      const entry = gitignoreContent
        ? '\n# AI Agent Skills & Tooling\n.agents/\n.agent/\n'
        : '# AI Agent Skills & Tooling\n.agents/\n.agent/\n';
      await fsPromises.appendFile(gitignorePath, entry, 'utf8');
    }
  } catch {}
}

export async function promptAndInstallSkills(projectPath: string) {
  const selectedSkills = await promptSkills();
  if (selectedSkills.length > 0) {
    await installSkills(projectPath, selectedSkills);
  }
}

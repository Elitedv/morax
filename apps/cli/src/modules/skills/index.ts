import { confirm } from '@clack/prompts';
import pc from 'picocolors';
import fsPromises from 'fs/promises';
import path from 'path';
import handleCancel from '../../utils/isCancel.js';
import { runInteractiveCommand } from '../../utils/exec.js';

export async function promptSkills(): Promise<boolean> {
  const result = await confirm({
    message: 'Install AI Agent Skills (skills.sh)?',
    initialValue: true,
  });

  handleCancel(result);
  return result as boolean;
}

/**
 * Checks if rules exist in .agent/skills/rules or .agents/skills/rules
 * and moves them to root /.agents/rules so AI agents can properly discover and configure them.
 */
export async function moveRulesToAgentRoot(projectPath: string) {
  const targetRulesDir = path.join(projectPath, '.agents', 'rules');
  const sourceCandidates = [
    path.join(projectPath, '.agents', 'skills', 'rules'),
    path.join(projectPath, '.agent', 'skills', 'rules'),
    path.join(projectPath, '.agent', 'rules'),
  ];

  let moved = false;

  for (const sourceDir of sourceCandidates) {
    try {
      await fsPromises.access(sourceDir);
    } catch {
      continue;
    }

    await fsPromises.mkdir(targetRulesDir, { recursive: true });

    try {
      const entries = await fsPromises.readdir(sourceDir);
      for (const entry of entries) {
        const srcPath = path.join(sourceDir, entry);
        const destPath = path.join(targetRulesDir, entry);
        await fsPromises.cp(srcPath, destPath, {
          recursive: true,
          force: true,
        });
      }

      await fsPromises.rm(sourceDir, { recursive: true, force: true });
      moved = true;
    } catch (err: any) {
      console.log(
        pc.yellow(
          `⚠ Warning: Could not move rules from ${sourceDir} (${err.message})\n`,
        ),
      );
    }
  }

  // If .agent directory was left behind and is empty (or has empty skills folder), clean it up
  const agentDir = path.join(projectPath, '.agent');
  try {
    const remaining = await fsPromises.readdir(agentDir);
    if (remaining.length === 0) {
      await fsPromises.rm(agentDir, { recursive: true, force: true });
    } else if (remaining.length === 1 && remaining[0] === 'skills') {
      const skillsRemaining = await fsPromises.readdir(
        path.join(agentDir, 'skills'),
      );
      if (skillsRemaining.length === 0) {
        await fsPromises.rm(agentDir, { recursive: true, force: true });
      }
    }
  } catch {}

  if (moved) {
    console.log(
      pc.green(`✔ Configured AI rules: Moved rules to .agents/rules\n`),
    );
  }
}

export async function installSkills(projectPath: string) {
  console.log(pc.cyan('\nLaunching interactive skills CLI (skills.sh)...\n'));

  try {
    await runInteractiveCommand(
      'pnpm',
      ['dlx', 'skills', 'add', 'AshutoshDM1/skills'],
      projectPath,
    );
    console.log(pc.green('\n✔ Skills installation completed\n'));
  } catch (error: any) {
    console.log(
      pc.yellow(
        `\n⚠ Note: Skills installation ended (${error.message || 'CLI exited'})\n`,
      ),
    );
  }

  // Move rules from .agent/skills/rules to root /.agent/rules for AI configuration
  await moveRulesToAgentRoot(projectPath);

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
  const shouldInstall = await promptSkills();
  if (shouldInstall) {
    await installSkills(projectPath);
  }
}

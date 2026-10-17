import { spinner } from '@clack/prompts';
import pc from 'picocolors';
import fsPromises from 'fs/promises';
import path from 'path';

export interface DockerSetupOptions {
  projectName: string;
  postgres?: boolean;
  redis?: boolean;
}

export async function setupDocker(
  projectPath: string,
  options: DockerSetupOptions,
) {
  if (!options.postgres && !options.redis) {
    return;
  }

  const s = spinner();
  s.start('Configuring root Docker infrastructure in docker/...');

  try {
    const dockerDir = path.join(projectPath, 'docker');
    await fsPromises.mkdir(dockerDir, { recursive: true });

    const safeName = options.projectName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const services: string[] = [];
    const volumes: string[] = [];

    if (options.postgres) {
      services.push(
        [
          '  postgres:',
          '    image: postgres:17-alpine',
          `    container_name: ${safeName}_postgres`,
          '    restart: unless-stopped',
          '    profiles:',
          '      - postgres',
          '      - infra',
          '    env_file:',
          '      - ../.env',
          '    ports:',
          "      - '${POSTGRES_PORT:?POSTGRES_PORT is required}:5432'",
          '    volumes:',
          '      - postgres_data:/var/lib/postgresql/data',
          '    healthcheck:',
          "      test: ['CMD-SHELL', 'pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB']",
          '      interval: 5s',
          '      timeout: 5s',
          '      retries: 5',
        ].join('\n'),
      );
      volumes.push('  postgres_data:');
    }

    if (options.redis) {
      services.push(
        [
          '  redis:',
          '    image: redis:7-alpine',
          `    container_name: ${safeName}_redis`,
          '    restart: unless-stopped',
          '    profiles:',
          '      - redis',
          '      - infra',
          '    env_file:',
          '      - ../.env',
          '    ports:',
          "      - '${REDIS_PORT:?REDIS_PORT is required}:6379'",
          '    volumes:',
          '      - redis_data:/data',
          '    healthcheck:',
          "      test: ['CMD', 'redis-cli', 'ping']",
          '      interval: 5s',
          '      timeout: 5s',
          '      retries: 5',
        ].join('\n'),
      );
      volumes.push('  redis_data:');
    }

    const composeContent = [
      'services:',
      services.join('\n\n'),
      '',
      'volumes:',
      volumes.join('\n'),
      '',
    ].join('\n');

    await fsPromises.writeFile(
      path.join(dockerDir, 'docker-compose.yml'),
      composeContent,
      'utf8',
    );

    // Add docker scripts to root package.json
    const rootPkgPath = path.join(projectPath, 'package.json');
    try {
      const raw = await fsPromises.readFile(rootPkgPath, 'utf8');
      const pkg = JSON.parse(raw);
      pkg.scripts = pkg.scripts || {};
      pkg.scripts['docker:up'] =
        'docker compose -f docker/docker-compose.yml up -d';
      pkg.scripts['docker:down'] =
        'docker compose -f docker/docker-compose.yml down';
      if (options.postgres) {
        pkg.scripts['docker:db'] =
          'docker compose -f docker/docker-compose.yml --profile postgres up -d';
      }
      if (options.redis) {
        pkg.scripts['docker:redis'] =
          'docker compose -f docker/docker-compose.yml --profile redis up -d';
      }
      await fsPromises.writeFile(
        rootPkgPath,
        JSON.stringify(pkg, null, 2),
        'utf8',
      );
    } catch {}

    const configuredList = [
      options.postgres ? 'PostgreSQL' : null,
      options.redis ? 'Redis' : null,
    ]
      .filter(Boolean)
      .join(', ');

    s.stop(
      pc.green(
        `✔ Success: Docker infrastructure configured in docker/ (${configuredList})`,
      ),
    );
  } catch (err: any) {
    s.stop(pc.red('✖ Failed: Docker configuration failed'));
    console.error(pc.red(`\nError details: ${err.message || err}`));
  }
}

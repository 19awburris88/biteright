/**
 * Applies Prisma migrations on deploy.
 *
 * If the database was originally created without migration history (e.g. `prisma db push`),
 * `migrate deploy` refuses with P3005. In that case we mark the migrations that predate this
 * script as already applied (the live schema already matches them) and try again.
 */
import { execSync } from 'child_process';

const SCHEMA = '--schema=backend/prisma/schema.prisma';
const BASELINE = [
  '20250502201311_init',
  '20250503160341_add_restaurant_imageurl',
  '20250503160657_add_cuisine_to_restaurant',
];

const run = (cmd) => execSync(`npx prisma ${cmd} ${SCHEMA}`, { stdio: 'pipe', encoding: 'utf8' });

try {
  process.stdout.write(run('migrate deploy'));
} catch (err) {
  const output = `${err.stdout || ''}${err.stderr || ''}`;
  if (!output.includes('P3005')) {
    console.error(output);
    process.exit(1);
  }
  console.log('[migrate] Existing schema without migration history — baselining legacy migrations.');
  for (const name of BASELINE) run(`migrate resolve --applied ${name}`);
  process.stdout.write(run('migrate deploy'));
}

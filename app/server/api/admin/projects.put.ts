import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
    const dbPath = path.join(process.cwd(), 'server', 'db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  db.projects = body.projects;

  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return { success: true };
});

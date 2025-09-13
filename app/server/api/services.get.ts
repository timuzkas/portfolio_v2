import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async () => {
    const dbPath = path.join(process.cwd(), 'app', 'server', 'db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
  return db.services;
});

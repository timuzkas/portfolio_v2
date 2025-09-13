import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const ServiceSchema = z.object({
  name: z.string(),
  url: z.string(),
  icon: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validation = ServiceSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: validation.error.errors,
    });
  }

  const { name, url, icon } = validation.data;

  const dbPath = path.join(process.cwd(), 'server', 'db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  const newService = {
    id: db.services.length > 0 ? Math.max(...db.services.map((s: any) => s.id)) + 1 : 1,
    name,
    url,
    icon,
  };

  db.services.push(newService);

  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return newService;
});
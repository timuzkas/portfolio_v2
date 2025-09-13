
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

const ServiceSchema = z.object({
  name: z.string(),
  url: z.string(),
  icon: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const serviceId = getRouterParam(event, 'id');
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

  const dbPath = path.join(process.cwd(), 'app', 'server', 'db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  const serviceIndex = db.services.findIndex((s: any) => s.id === parseInt(serviceId as string));

  if (serviceIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Service not found',
    });
  }

  const updatedService = {
    ...db.services[serviceIndex],
    name,
    url,
    icon,
  };

  db.services[serviceIndex] = updatedService;

  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return updatedService;
});

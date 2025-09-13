import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
  const serviceId = getRouterParam(event, 'id');

  const dbPath = path.join(process.cwd(), 'server', 'db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  const serviceIndex = db.services.findIndex((s: any) => s.id === parseInt(serviceId as string));

  if (serviceIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Service not found',
    });
  }

  db.services.splice(serviceIndex, 1);

  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return { success: true, message: `Service with id ${serviceId} deleted.` };
});
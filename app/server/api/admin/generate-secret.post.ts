import { authenticator } from 'otplib';
import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async () => {
  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri('admin', 'PortfolioV2', secret);

  const envPath = path.join(process.cwd(), '.env');
  let envContent = await fs.readFile(envPath, 'utf-8');

  if (envContent.includes('TOTP_SECRET')) {
    envContent = envContent.replace(/TOTP_SECRET=.*/, `TOTP_SECRET=${secret}`);
  } else {
    envContent += `
TOTP_SECRET=${secret}`;
  }

  await fs.writeFile(envPath, envContent);

  return { secret, otpauthUrl };
});

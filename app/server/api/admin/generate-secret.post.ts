import { authenticator } from 'otplib';
import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async () => {
  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri('admin', 'PortfolioV2', secret);

  const dbPath = path.join(process.cwd(), 'app/server/db.json');

  try {
    await fs.access(dbPath);
    // db.json file exists, modify it
    const dbContent = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(dbContent);
    db.totp_secret = secret;
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    console.log('TOTP_SECRET updated in db.json file.');
  } catch (error) {
    // db.json file does not exist or is invalid, fallback to .env logic
    const envPath = path.join(process.cwd(), '.env');
    try {
      await fs.access(envPath);
      // .env file exists, modify it
      let envContent = await fs.readFile(envPath, 'utf-8');

      if (envContent.includes('TOTP_SECRET')) {
        envContent = envContent.replace(/TOTP_SECRET=.*/, `TOTP_SECRET=${secret}`);
      } else {
        envContent += `
TOTP_SECRET=${secret}`;
      }

      await fs.writeFile(envPath, envContent);
      console.log('TOTP_SECRET updated in .env file.');
    } catch (envError) {
      // .env file does not exist, output to console
      console.log('No db.json or .env file found. Please set TOTP_SECRET manually.');
      console.log(`Generated TOTP Secret: ${secret}`);
      console.log(`OTP Auth URL: ${otpauthUrl}`);
    }
  }

  return { secret, otpauthUrl };
});

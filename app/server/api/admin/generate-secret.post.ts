import { authenticator } from 'otplib';
import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async () => {
  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri('admin', 'PortfolioV2', secret);

  const envPath = path.join(process.cwd(), '.env');

  try {
    await fs.access(envPath);
    // .env file exists, modify it
    let envContent = await fs.readFile(envPath, 'utf-8');

    if (envContent.includes('TOTP_SECRET')) {
      envContent = envContent.replace(/TOTP_SECRET=.*/, `TOTP_SECRET=${secret}`);
    } else {
      envContent += `\nTOTP_SECRET=${secret}`;
    }

    await fs.writeFile(envPath, envContent);
    console.log('TOTP_SECRET updated in .env file.');
  } catch (error) {
    // .env file does not exist, output to console
    console.log('No .env file found. Please set TOTP_SECRET manually.');
    console.log(`Generated TOTP Secret: ${secret}`);
    console.log(`OTP Auth URL: ${otpauthUrl}`);
  }

  return { secret, otpauthUrl };
});

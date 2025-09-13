import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = body?.token;

  const dbPath = path.join(process.cwd(), 'app/server/db.json');
  let secret: string | undefined;

  try {
    const dbContent = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(dbContent);
    secret = db.totp_secret;
  } catch (error) {
    console.error('Error reading db.json for TOTP_SECRET:', error);
  }

  if (!secret) {
    console.error('TOTP_SECRET is not set in db.json or db.json could not be read.');
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }

  if (!token) {
    return { success: false, message: 'Invalid OTP' };
  }

  const isValid = authenticator.check(token, secret);

  if (isValid) {
    const jwtToken = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    setCookie(event, 'auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });
    return { success: true };
  } else {
    return { success: false, message: 'Invalid OTP' };
  }
});

import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = body?.token;
  const secret = process.env.TOTP_SECRET;

  if (!secret) {
    console.error('TOTP_SECRET is not set in environment variables.');
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

import { verifyToken } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const isApiAdminRoute = url.pathname.startsWith('/api/admin');
  const isControlPageRoute = url.pathname === '/control';

  if (isApiAdminRoute || isControlPageRoute) {
    // Allow access to generate-secret if no secret is set
    if (url.pathname === '/api/admin/generate-secret' && !process.env.TOTP_SECRET) {
      return;
    }

    const token = getCookie(event, 'auth_token');
    const user = token ? verifyToken(token) : null;

    if (!user) {
      if (isApiAdminRoute) {
        // For API routes, throw an error
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized',
        });
      } else {
        // For page routes, redirect
        await sendRedirect(event, '/noauth');
        return;
      }
    }
    event.context.user = user;
  }
});

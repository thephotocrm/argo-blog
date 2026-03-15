import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect /admin routes (not /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = context.cookies.get('admin_session');

    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return context.redirect('/admin/login');
    }
  }

  return next();
});

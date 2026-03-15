import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const password = formData.get('password')?.toString();

  const adminPassword = import.meta.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return new Response('Server misconfigured: ADMIN_PASSWORD not set', { status: 500 });
  }

  if (password === adminPassword) {
    cookies.set('admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return redirect('/admin', 302);
  }

  return redirect('/admin/login?error=invalid', 302);
};

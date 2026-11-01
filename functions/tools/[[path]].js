// The case-page generator in /tools is kept in the repo but must not be served.
// Answer every /tools/* request with the site's 404 page and a real 404 status.
export async function onRequest({ request, env }) {
  const page = await env.ASSETS.fetch(new URL('/404', request.url));
  return new Response(page.body, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }
  });
}

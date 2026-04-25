import { getData, renderHomePage } from './_lib.js';

export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const category = url.searchParams.get('cat') || 'all';
  const data = await getData(env);
  return new Response(renderHomePage(data, category), {
    headers: { "Content-Type": "text/html;charset=UTF-8" }
  });
}

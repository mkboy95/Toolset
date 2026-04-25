import { getData, renderProductPage } from '../_lib.js';

export async function onRequestGet({ env, params }) {
  const data = await getData(env);
  const html = renderProductPage(data, params.id);
  if (!html) {
    return new Response("Product Not Found", { status: 404 });
  }
  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" }
  });
}

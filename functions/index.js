import { getData, renderHomePage } from './_lib.js';

export async function onRequestGet({ env }) {
  const data = await getData(env);
  return new Response(renderHomePage(data.products), {
    headers: { "Content-Type": "text/html;charset=UTF-8" }
  });
}

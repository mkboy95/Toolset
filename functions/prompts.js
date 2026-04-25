import { getData, renderPromptsPage } from '../_lib.js';

export async function onRequestGet({ env }) {
  const data = await getData(env);
  return new Response(renderPromptsPage(data.prompts), {
    headers: { "Content-Type": "text/html;charset=UTF-8" }
  });
}

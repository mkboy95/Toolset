import { getData } from './_lib.js';

export async function onRequestGet({ env, params }) {
  const slug = params.slug;
  const data = await getData(env);
  const product = data.products.find(p => p.id === slug);

  if (!product) {
    return new Response("Not Found", { status: 404 });
  }

  if (product.toolType === 'local' && product.link) {
    return Response.redirect(product.link, 302);
  }

  if (product.link && product.link.startsWith("http")) {
    return Response.redirect(product.link, 302);
  }

  return Response.redirect(`/product/${slug}`, 302);
}

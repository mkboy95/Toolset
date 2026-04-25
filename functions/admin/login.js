import { getData, renderAdminUI } from '../_lib.js';

export async function onRequestPost({ env, request }) {
  const formData = await request.formData();
  const password = formData.get("password");

  if (password !== env.ADMIN_PASS) {
    return new Response("❌ 密码错误 <a href='/admin'>返回</a>", {
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  }

  const data = await getData(env);
  return new Response(renderAdminUI(JSON.stringify(data), password), {
    headers: { "Content-Type": "text/html;charset=UTF-8" }
  });
}

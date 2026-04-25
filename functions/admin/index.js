import { getData, saveData, renderAdminUI } from '../_lib.js';

export async function onRequestGet() {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head><title>Admin Login</title><meta name="viewport" content="width=device-width"><script src="https://cdn.tailwindcss.com"></script></head>
    <body class="bg-gray-100 h-screen flex items-center justify-center">
        <form method="POST" action="/admin/login" class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
            <h2 class="text-xl font-bold mb-4 text-center">🔐 后台登录</h2>
            <input type="password" name="password" placeholder="输入密码 (ADMIN_PASS)" class="w-full border p-3 rounded mb-4" required>
            <button class="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700">进入后台</button>
        </form>
    </body>
    </html>
  `, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
}

export async function onRequestPost({ env, request }) {
  const formData = await request.formData();
  if (formData.get("password") !== env.ADMIN_PASS) {
    return new Response("Auth Failed", { status: 403 });
  }

  const jsonStr = formData.get("jsonData");
  try {
    await saveData(env, jsonStr);
    return new Response("保存成功");
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}

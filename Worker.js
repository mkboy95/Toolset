/**
 * ==========================================
 * Cloudflare Worker - 落地页 + 可视化后台
 * ==========================================
 */

// 默认数据（防止数据库为空时报错）
const DEFAULT_DATA = {
  products: [{
    id: "demo",
    name: "示例工具",
    desc: "这是一个示例，请去后台修改。",
    icon: "👋",
    detail: "详细介绍内容...",
    link: "#",
    cta: "按钮文字"
  }],
  prompts: [{
    title: "示例提示词",
    tags: ["测试"],
    content: "这是一个示例提示词。"
  }]
};

/**
 * HTML 模板生成器 (前端展示页)
 */
function getHTML(content, title = "我的工具箱", script = "") {
  return `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
      textarea::-webkit-scrollbar { width: 8px; }
      textarea::-webkit-scrollbar-track { background: #f1f1f1; }
      textarea::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    </style>
  </head>
  <body class="bg-slate-50 text-slate-800 flex flex-col min-h-screen">
    <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div class="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">🛠️ MyTools</a>
        <div class="flex gap-4 text-sm font-medium">
          <a href="/" class="text-slate-600 hover:text-blue-600">工具箱</a>
          <a href="/prompts" class="text-slate-600 hover:text-blue-600">提示词</a>
        </div>
      </div>
    </nav>
    <main class="flex-grow">${content}</main>
    <footer class="bg-white border-t border-slate-200 py-8 mt-12 text-center text-sm text-slate-500">
      <p>&copy; ${new Date().getFullYear()} My Tools Studio.</p>
    </footer>
    ${script}
  </body>
  </html>`;
}

// 渲染首页
function renderHomePage(products) {
  const cards = products.map(p => `
    <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-100 flex flex-col transition-all">
      <div class="text-4xl mb-4">${p.icon}</div>
      <h3 class="text-xl font-bold mb-2 text-slate-900">${p.name}</h3>
      <p class="text-slate-600 mb-6 flex-grow text-sm leading-relaxed">${p.desc}</p>
      <a href="/product/${p.id}" class="text-center bg-slate-50 text-blue-600 font-semibold py-2.5 rounded-lg hover:bg-blue-100 border border-slate-200 transition-colors">了解详情</a>
    </div>
  `).join('');
  return getHTML(`
    <div class="max-w-5xl mx-auto px-4 py-16">
      <div class="text-center mb-12"><h1 class="text-4xl font-extrabold text-slate-900">发现好用的效率工具</h1></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
    </div>
  `, "首页");
}

// 渲染详情页
function renderProductPage(products, id) {
  const product = products.find(p => p.id === id);
  if (!product) return new Response("Product Not Found", { status: 404 });
  return getHTML(`
    <div class="max-w-3xl mx-auto px-4 py-16">
      <a href="/" class="text-sm text-slate-500 hover:text-blue-600 mb-6 inline-block">&larr; 返回列表</a>
      <div class="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div class="flex items-center mb-6"><span class="text-6xl mr-6">${product.icon}</span><h1 class="text-3xl font-bold">${product.name}</h1></div>
        <div class="prose max-w-none text-slate-600 mb-8 whitespace-pre-line"><p class="text-lg text-slate-800 font-medium">${product.desc}</p><hr class="my-4 border-slate-100"><p>${product.detail}</p></div>
        <a href="${product.link}" target="_blank" class="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform hover:-translate-y-0.5">${product.cta}</a>
      </div>
    </div>
  `, `${product.name} - 详情`);
}

// 渲染提示词页
function renderPromptsPage(prompts) {
  const items = prompts.map((item, i) => `
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
        <div><h3 class="font-bold text-slate-800">${item.title}</h3><div class="flex gap-2 mt-2 flex-wrap">${item.tags.map(t=>`<span class="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">#${t}</span>`).join('')}</div></div>
        <button onclick="copyTo('p-${i}', this)" class="text-xs bg-white border border-slate-300 px-3 py-1 rounded hover:border-blue-500 hover:text-blue-600 transition-colors">复制</button>
      </div>
      <textarea id="p-${i}" class="w-full h-40 p-4 bg-slate-50 text-sm resize-none focus:outline-none font-mono text-slate-600" readonly>${item.content}</textarea>
    </div>
  `).join('');
  const script = `<script>
    function copyTo(id, btn) {
      const el = document.getElementById(id); el.select(); el.setSelectionRange(0,99999);
      navigator.clipboard.writeText(el.value).then(()=>{ let t=btn.innerHTML; btn.innerHTML='✅ 已复制'; setTimeout(()=>btn.innerHTML=t, 2000); });
    }
  </script>`;
  return getHTML(`<div class="max-w-5xl mx-auto px-4 py-12"><div class="mb-10"><h1 class="text-3xl font-bold text-slate-900">✨ 提示词收藏夹</h1></div><div class="grid md:grid-cols-2 gap-6">${items}</div></div>`, "提示词库", script);
}

/**
 * ==========================================
 * 新版：可视化后台管理页面
 * ==========================================
 */
function renderAdminUI(dataJson, password) {
  return `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>后台管理</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script> <style>
       .fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
       .fade-enter-from, .fade-leave-to { opacity: 0; }
    </style>
  </head>
  <body class="bg-gray-100 text-gray-800 min-h-screen p-4">
    <div id="app" class="max-w-5xl mx-auto">
      <header class="bg-white rounded-xl shadow-sm p-6 mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">⚙️ 内容管理系统</h1>
        <div class="flex gap-4">
            <a href="/" target="_blank" class="text-blue-600 hover:underline flex items-center gap-1">👀 预览网站</a>
        </div>
      </header>

      <div class="bg-white rounded-xl shadow-lg overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        
        <div class="w-full md:w-48 bg-gray-50 border-r border-gray-200 flex flex-row md:flex-col">
            <button @click="currentTab = 'products'" :class="{'bg-blue-50 text-blue-600 border-b-2 md:border-b-0 md:border-r-2 border-blue-600': currentTab === 'products'}" class="flex-1 md:flex-none p-4 text-left font-semibold hover:bg-gray-100 transition">📦 工具管理</button>
            <button @click="currentTab = 'prompts'" :class="{'bg-blue-50 text-blue-600 border-b-2 md:border-b-0 md:border-r-2 border-blue-600': currentTab === 'prompts'}" class="flex-1 md:flex-none p-4 text-left font-semibold hover:bg-gray-100 transition">💡 提示词管理</button>
        </div>

        <div class="flex-1 p-6 relative">
            
            <div class="absolute top-6 right-6 z-10">
                <button @click="saveData" :disabled="isSaving" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition flex items-center gap-2">
                    <span v-if="isSaving">💾 保存中...</span>
                    <span v-else>💾 保存更改</span>
                </button>
            </div>

            <div v-if="currentTab === 'products'">
                <h2 class="text-xl font-bold mb-6">工具列表 ({{ data.products.length }})</h2>
                <div class="grid gap-4">
                    <div v-for="(item, index) in data.products" :key="index" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50 flex justify-between items-center group">
                        <div class="flex items-center gap-4">
                            <span class="text-3xl">{{ item.icon }}</span>
                            <div>
                                <h3 class="font-bold">{{ item.name }}</h3>
                                <p class="text-xs text-gray-500 truncate w-64">{{ item.desc }}</p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button @click="editItem('product', index)" class="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded">编辑</button>
                            <button @click="deleteItem('products', index)" class="text-red-500 hover:bg-red-50 px-3 py-1 rounded">删除</button>
                        </div>
                    </div>
                </div>
                <button @click="addNew('product')" class="mt-6 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 font-bold transition">+ 添加新工具</button>
            </div>

            <div v-if="currentTab === 'prompts'">
                <h2 class="text-xl font-bold mb-6">提示词列表 ({{ data.prompts.length }})</h2>
                <div class="grid gap-4">
                     <div v-for="(item, index) in data.prompts" :key="index" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50 flex justify-between items-start">
                        <div>
                            <h3 class="font-bold text-gray-800">{{ item.title }}</h3>
                            <div class="flex gap-2 mt-1"><span v-for="tag in item.tags" class="text-xs bg-white border px-1 rounded">{{ tag }}</span></div>
                        </div>
                        <div class="flex gap-2">
                            <button @click="editItem('prompt', index)" class="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded">编辑</button>
                            <button @click="deleteItem('prompts', index)" class="text-red-500 hover:bg-red-50 px-3 py-1 rounded">删除</button>
                        </div>
                    </div>
                </div>
                <button @click="addNew('prompt')" class="mt-6 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 font-bold transition">+ 添加新提示词</button>
            </div>
        </div>
      </div>

      <div v-if="editingItem" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 class="text-xl font-bold mb-6 border-b pb-4">编辑内容</h3>
            
            <div v-if="editType === 'product'" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-sm font-bold text-gray-700">名称</label><input v-model="editingItem.name" class="w-full border p-2 rounded"></div>
                    <div><label class="block text-sm font-bold text-gray-700">ID (唯一标识)</label><input v-model="editingItem.id" class="w-full border p-2 rounded"></div>
                </div>
                <div><label class="block text-sm font-bold text-gray-700">图标 (Emoji或HTML)</label><input v-model="editingItem.icon" class="w-full border p-2 rounded"></div>
                <div><label class="block text-sm font-bold text-gray-700">简短描述</label><input v-model="editingItem.desc" class="w-full border p-2 rounded"></div>
                <div><label class="block text-sm font-bold text-gray-700">详情内容 (支持HTML)</label><textarea v-model="editingItem.detail" rows="5" class="w-full border p-2 rounded"></textarea></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-sm font-bold text-gray-700">链接 URL</label><input v-model="editingItem.link" class="w-full border p-2 rounded"></div>
                    <div><label class="block text-sm font-bold text-gray-700">按钮文字</label><input v-model="editingItem.cta" class="w-full border p-2 rounded"></div>
                </div>
            </div>

            <div v-if="editType === 'prompt'" class="space-y-4">
                <div><label class="block text-sm font-bold text-gray-700">标题</label><input v-model="editingItem.title" class="w-full border p-2 rounded"></div>
                <div><label class="block text-sm font-bold text-gray-700">标签 (逗号分隔)</label><input v-model="tagsInput" @input="updateTags" placeholder="例如: 写作, 办公" class="w-full border p-2 rounded"></div>
                <div><label class="block text-sm font-bold text-gray-700">提示词内容</label><textarea v-model="editingItem.content" rows="10" class="w-full border p-2 rounded font-mono text-sm bg-slate-50"></textarea></div>
            </div>

            <div class="mt-8 flex justify-end gap-4">
                <button @click="editingItem = null" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">取消</button>
                <button @click="confirmEdit" class="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">确定</button>
            </div>
        </div>
      </div>

    </div>

    <script>
      const { createApp } = Vue;
      const RAW_DATA = ${dataJson}; // 注入服务端数据
      const PASSWORD = "${password}";

      createApp({
        data() {
          return {
            data: RAW_DATA,
            currentTab: 'products',
            editingItem: null,
            editType: null, // 'product' or 'prompt'
            editIndex: -1,
            isSaving: false,
            tagsInput: ''
          }
        },
        methods: {
          addNew(type) {
            this.editType = type;
            this.editIndex = -1; // -1 表示新增
            if (type === 'product') {
                this.editingItem = { id: 'new-'+Date.now(), name: '新工具', icon: '✨', desc: '', detail: '', link: '#', cta: '访问' };
            } else {
                this.editingItem = { title: '新提示词', tags: [], content: '' };
                this.tagsInput = '';
            }
          },
          editItem(type, index) {
            this.editType = type;
            this.editIndex = index;
            // 深拷贝防止直接修改原数据
            const source = type === 'product' ? this.data.products : this.data.prompts;
            this.editingItem = JSON.parse(JSON.stringify(source[index]));
            
            if (type === 'prompt') {
                this.tagsInput = this.editingItem.tags.join(', ');
            }
          },
          updateTags() {
            // 处理逗号分隔的标签
            this.editingItem.tags = this.tagsInput.split(/[,，]/).map(t => t.trim()).filter(t => t);
          },
          confirmEdit() {
            if (this.editType === 'product') {
                if (this.editIndex === -1) this.data.products.push(this.editingItem);
                else this.data.products[this.editIndex] = this.editingItem;
            } else {
                if (this.editIndex === -1) this.data.prompts.push(this.editingItem);
                else this.data.prompts[this.editIndex] = this.editingItem;
            }
            this.editingItem = null;
          },
          deleteItem(collection, index) {
            if(confirm('确定要删除吗？')) {
                this.data[collection].splice(index, 1);
            }
          },
          async saveData() {
            this.isSaving = true;
            try {
                const formData = new FormData();
                formData.append('password', PASSWORD);
                formData.append('jsonData', JSON.stringify(this.data));
                
                const res = await fetch('/admin', { method: 'POST', body: formData });
                const text = await res.text();
                
                if (text.includes('成功')) alert('✅ 保存成功！');
                else alert('❌ 保存失败：' + text);
            } catch(e) {
                alert('网络错误');
            }
            this.isSaving = false;
          }
        }
      }).mount('#app');
    </script>
  </body>
  </html>
  `;
}

/**
 * ==========================================
 * 主程序入口
 * ==========================================
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 获取数据
    let data = DEFAULT_DATA;
    try {
      const storedData = await env.DB.get("site_data");
      if (storedData) data = JSON.parse(storedData);
    } catch (e) { console.log("Init Data"); }

    // [GET] /admin 渲染后台
    if (url.pathname === "/admin" && request.method === "GET") {
      // 这是一个极其简单的鉴权：通过 URL 参数 ?pass=你的密码 进入
      // 但为了安全和兼容旧逻辑，我们还是用原来的表单式验证，这里做个简单的登录页
      // 为了省事，我们这里直接渲染一个带密码输入的 HTML，输入正确后由 JS 渲染 Vue
      
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

    // [POST] /admin/login 验证密码并显示 Vue 后台
    if (url.pathname === "/admin/login" && request.method === "POST") {
        const formData = await request.formData();
        const password = formData.get("password");
        if (password === env.ADMIN_PASS) {
            // 密码正确，渲染 Vue 后台，并把密码传过去用于后续保存接口的验证
            return new Response(renderAdminUI(JSON.stringify(data), password), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
        } else {
            return new Response("❌ 密码错误 <a href='/admin'>返回</a>", { headers: { "Content-Type": "text/html;charset=UTF-8" } });
        }
    }

    // [POST] /admin 保存数据接口
    if (url.pathname === "/admin" && request.method === "POST") {
      const formData = await request.formData();
      if (formData.get("password") !== env.ADMIN_PASS) return new Response("Auth Failed", { status: 403 });
      
      const jsonStr = formData.get("jsonData");
      await env.DB.put("site_data", jsonStr);
      return new Response("保存成功");
    }

    // 前台路由
    if (url.pathname === "/") return new Response(renderHomePage(data.products), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    if (url.pathname === "/prompts") return new Response(renderPromptsPage(data.prompts), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    if (url.pathname.startsWith("/product/")) {
      const id = url.pathname.split("/")[2];
      const html = renderProductPage(data.products, id);
      return new Response(html, { status: html.includes("Not Found")?404:200, headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }

    return new Response("404 Not Found", { status: 404 });
  },
};

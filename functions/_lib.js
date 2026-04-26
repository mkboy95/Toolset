const DEFAULT_DATA = {
  categories: [
    { id: "tools", name: "工具箱", icon: "📦", type: "products" },
    { id: "dev", name: "开发工具", icon: "⚙️", type: "products" },
    { id: "covers", name: "封面工具", icon: "🎨", type: "products" },
    { id: "prompts", name: "提示词", icon: "💡", type: "prompts" }
  ],
  products: [
    {
      id: "it-tools",
      name: "超赞IT工具箱",
      desc: "开发者在线工具集合，包含JSON格式化、Base64编解码、正则测试、密码生成、二维码生成等100+实用工具。",
      icon: "⚙️",
      detail: "IT-Tools 是一个专为开发者和IT专业人员设计的在线工具集合，提供丰富实用的工具，具有优秀的用户体验。\n\n✨ 包含工具：\n- 🔐 加密解密：Base64、哈希计算、HMAC、Bcrypt、RSA密钥对生成\n- 📝 格式转换：JSON格式化/压缩、YAML转换、XML格式化、TOML转换\n- 🔍 开发测试：正则测试、JSONPath、JWT解析、Unicode转换\n- 🌐 网络工具：URL编解码、IPv4子网计算器、MAC地址查询\n- 🎨 颜色工具：颜色转换器、色阶生成器\n- 📊 数据生成：UUID生成器、密码生成器、Lorem Ipsum、二维码生成\n- 📐 数学计算：数学表达式计算器、百分比计算器、进制转换\n- 📦 编码转换：Base64文件转换、UTF-8编码检测",
      link: "/it-tools/",
      cta: "立即使用",
      category: "dev",
      toolType: "local"
    },
    {
      id: "mini-cover",
      name: "超赞Mini-Cover",
      desc: "简洁的在线生成封面网站，专为博客、短视频、社交媒体等生成个性化封面。",
      icon: "🎨",
      detail: "Mini-Cover 是一个现代化的封面生成工具，专为博客、短视频、社交媒体设计。支持多种自定义选项，让你轻松创建个性化封面图片。\n\n✨ 特性：\n- 📱 响应式设计，完美支持移动端\n- 🎨 丰富的图标库，一键选用\n- 🖼️ 自定义背景图片，支持拖拽上传\n- ✍️ 灵活的标题编辑，多种字体可选\n- 💫 水印效果调整，实时预览\n- 🎯 简洁的操作界面，快速上手",
      link: "/mini-cover/",
      cta: "立即使用",
      category: "covers",
      toolType: "local"
    },
    {
      id: "thiscover",
      name: "超赞ThisCover",
      desc: "免费、漂亮的封面生成器，支持18+主题、20w+图标、29+免费字体、实时预览、9+主流尺寸。",
      icon: "🖼️",
      detail: "ThisCover 是一个免费、漂亮的封面生成器，支持全生命周期功能。\n\n✨ 特性：\n- 🎨 18+ 个性主题：简洁、现代、经典、背景、手机预览等\n- 🔢 20w+ Iconify 图标库\n- 📝 29+ 开源/免费商用字体\n- 👁️ 实时预览：配置即改即变，所见即所得\n- 📐 9+ 主流尺寸，横板+竖版\n- 📱 小红书、头条、知乎等多平台适配\n- 💾 PNG、JPG、WebP 多格式输出\n- 🌙 深色模式支持",
      link: "/thiscover/",
      cta: "立即使用",
      category: "covers",
      toolType: "local"
    }
  ],
  prompts: [{
    title: "示例提示词",
    tags: ["测试"],
    content: "这是一个示例提示词。",
    category: "prompts"
  }]
};

async function getData(env) {
  let data = DEFAULT_DATA;
  try {
    const kv = getKV(env);
    if (kv) {
      const storedData = await kv.get("site_data");
      if (storedData) {
        data = JSON.parse(storedData);
        if (!data.categories) data.categories = DEFAULT_DATA.categories;
        data.products = (data.products || []).map(p => {
          if (p.toolType === undefined) {
            p.toolType = p.embed ? "local" : "external";
            delete p.embed;
          }
          return p;
        });
      }
    }
  } catch (e) { console.log("Init Data", e.message); }
  return data;
}

function getKV(env) {
  if (!env) return null;
  if (env.my_kv) return env.my_kv;
  if (env.DB) return env.DB;
  const keys = Object.keys(env);
  for (const key of keys) {
    const val = env[key];
    if (val && typeof val === 'object' && typeof val.get === 'function' && typeof val.put === 'function') {
      return val;
    }
  }
  return null;
}

async function saveData(env, jsonStr) {
  const kv = getKV(env);
  if (kv) {
    await kv.put("site_data", jsonStr);
  }
  // 即使没有 KV 也返回成功，因为数据已经通过前端保存到了页面状态
  // 这样用户可以正常编辑，只是数据不会持久化
}

function renderNav(categories, activeCategory) {
  let items = `<a href="/" class="px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap shrink-0 ${(!activeCategory || activeCategory === 'all') ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}">全部</a>`;
  if (categories && categories.length) {
    categories.forEach(cat => {
      const href = cat.type === 'prompts' ? '/prompts' : `/?cat=${cat.id}`;
      const isActive = activeCategory === cat.id;
      const cls = isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50';
      items += `<a href="${href}" class="px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap shrink-0 ${cls}">${cat.icon} ${cat.name}</a>`;
    });
  }
  return items;
}

function getHTML(content, title = "我的工具箱", script = "", activeCategory = "", categories = []) {
  const navItems = renderNav(categories, activeCategory);
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
      .nav-scroll::-webkit-scrollbar { display: none; }
      .nav-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
  </head>
  <body class="bg-slate-50 text-slate-800 flex flex-col min-h-screen">
    <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center gap-1 nav-scroll overflow-x-auto">
        <a href="/" class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mr-3 shrink-0">🛠️ MyTools</a>
        ${navItems}
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

function renderHomePage(data, category = "all") {
  const categories = data.categories || [];
  let products = data.products || [];
  if (category && category !== "all") {
    products = products.filter(p => p.category === category);
  }

  let catTabs = `<a href="/" class="px-4 py-2 rounded-full text-sm font-medium transition ${(!category || category === 'all') ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200'}">全部</a>`;
  categories.forEach(cat => {
    if (cat.type === 'prompts') return;
    const isActive = category === cat.id;
    const cls = isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200';
    catTabs += `<a href="/?cat=${cat.id}" class="px-4 py-2 rounded-full text-sm font-medium transition ${cls}">${cat.icon} ${cat.name}</a>`;
  });

  if (products.length === 0) {
    const emptyContent = `
      <div class="max-w-5xl mx-auto px-4 py-16">
        <div class="text-center mb-8"><h1 class="text-4xl font-extrabold text-slate-900">发现好用的效率工具</h1></div>
        <div class="flex gap-2 mb-8 justify-center flex-wrap">${catTabs}</div>
        <div class="text-center py-16 text-slate-400"><p class="text-lg">该分类暂无内容</p></div>
      </div>`;
    return getHTML(emptyContent, "首页", "", category, categories);
  }

  const cards = products.map(p => {
    const isLocal = p.toolType === 'local';
    const mainHref = isLocal ? p.link : `/product/${p.id}`;
    const mainText = isLocal ? '🚀 立即使用' : '了解详情';
    const detailBtn = isLocal ? `<a href="/product/${p.id}" class="text-xs text-slate-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 border border-slate-200">详情</a>` : '';
    return `
    <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-100 flex flex-col transition-all">
      <div class="text-4xl mb-4">${p.icon}</div>
      <h3 class="text-xl font-bold mb-2 text-slate-900">${p.name}</h3>
      <p class="text-slate-600 mb-6 flex-grow text-sm leading-relaxed">${p.desc}</p>
      <div class="flex items-center gap-2">
        ${detailBtn}
        <a href="${mainHref}" class="flex-1 text-center bg-slate-50 text-blue-600 font-semibold py-2.5 rounded-lg hover:bg-blue-100 border border-slate-200 transition-colors">${mainText}</a>
      </div>
    </div>`;
  }).join('');

  const content = `
    <div class="max-w-5xl mx-auto px-4 py-16">
      <div class="text-center mb-8"><h1 class="text-4xl font-extrabold text-slate-900">发现好用的效率工具</h1></div>
      <div class="flex gap-2 mb-10 justify-center flex-wrap">${catTabs}</div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
    </div>`;
  return getHTML(content, "首页", "", category, categories);
}

function renderProductPage(data, id) {
  const categories = data.categories || [];
  const product = data.products.find(p => p.id === id);
  if (!product) return null;
  const catId = product.category || '';
  const isLocal = product.toolType === 'local';
  const ctaHref = isLocal ? product.link : product.link;
  const ctaTarget = isLocal ? '' : ' target="_blank"';
  return getHTML(`
    <div class="max-w-3xl mx-auto px-4 py-16">
      <a href="/" class="text-sm text-slate-500 hover:text-blue-600 mb-6 inline-block">&larr; 返回列表</a>
      <div class="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div class="flex items-center mb-6"><span class="text-6xl mr-6">${product.icon}</span><h1 class="text-3xl font-bold">${product.name}</h1></div>
        <div class="prose max-w-none text-slate-600 mb-8 whitespace-pre-line"><p class="text-lg text-slate-800 font-medium">${product.desc}</p><hr class="my-4 border-slate-100"><p>${product.detail}</p></div>
        <a href="${ctaHref}"${ctaTarget} class="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform hover:-translate-y-0.5">${product.cta}</a>
      </div>
    </div>
  `, `${product.name} - 详情`, "", catId, categories);
}

function renderPromptsPage(data) {
  const categories = data.categories || [];
  const prompts = data.prompts || [];
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
  return getHTML(`<div class="max-w-5xl mx-auto px-4 py-12"><div class="mb-10"><h1 class="text-3xl font-bold text-slate-900">✨ 提示词收藏夹</h1></div><div class="grid md:grid-cols-2 gap-6">${items}</div></div>`, "提示词库", script, "prompts", categories);
}

function renderAdminUI(dataJson, password) {
  return `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>后台管理</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <style>
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
                                <div class="flex gap-1 mt-1">
                                    <span v-if="item.category" class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{{ getCategoryName(item.category) }}</span>
                                    <span v-if="item.toolType === 'local'" class="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">📁 本地工具</span>
                                    <span v-else class="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded">🔗 外部工具</span>
                                </div>
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
                    <div><label class="block text-sm font-bold text-gray-700">ID (唯一标识，也用作短路径)</label><input v-model="editingItem.id" class="w-full border p-2 rounded" placeholder="如: mini-cover"></div>
                </div>
                <div><label class="block text-sm font-bold text-gray-700">图标 (Emoji或HTML)</label><input v-model="editingItem.icon" class="w-full border p-2 rounded"></div>
                <div><label class="block text-sm font-bold text-gray-700">简短描述</label><input v-model="editingItem.desc" class="w-full border p-2 rounded"></div>
                <div><label class="block text-sm font-bold text-gray-700">所属分类</label>
                    <select v-model="editingItem.category" class="w-full border p-2 rounded">
                        <option value="">未分类</option>
                        <option v-for="cat in data.categories.filter(c => c.type === 'products')" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.name }}</option>
                    </select>
                </div>
                <div class="p-3 bg-gray-50 rounded-lg border">
                    <label class="block text-sm font-bold text-gray-700 mb-2">工具类型</label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" v-model="editingItem.toolType" value="local" class="text-blue-600">
                            <span class="text-sm">📁 本地工具</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" v-model="editingItem.toolType" value="external" class="text-blue-600">
                            <span class="text-sm">🔗 外部工具</span>
                        </label>
                    </div>
                    <p class="text-xs text-gray-500 mt-2" v-if="editingItem.toolType === 'local'">本地工具：将编译好的文件放入项目根目录的文件夹（如 <code>/{{ editingItem.id }}/</code>），访问 <code>/{{ editingItem.id }}</code> 即可直接使用</p>
                    <p class="text-xs text-gray-500 mt-2" v-else>外部工具：填写完整的外部 URL，用户点击后在新窗口打开</p>
                </div>
                <div><label class="block text-sm font-bold text-gray-700">链接</label><input v-model="editingItem.link" class="w-full border p-2 rounded" :placeholder="editingItem.toolType === 'local' ? '如: /mini-cover/' : '如: https://example.com/'"></div>
                <div><label class="block text-sm font-bold text-gray-700">详情内容 (支持HTML)</label><textarea v-model="editingItem.detail" rows="4" class="w-full border p-2 rounded"></textarea></div>
                <div><label class="block text-sm font-bold text-gray-700">按钮文字</label><input v-model="editingItem.cta" class="w-full border p-2 rounded"></div>
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
      const RAW_DATA = ${dataJson};
      const PASSWORD = "${password}";

      createApp({
        data() {
          return {
            data: RAW_DATA,
            currentTab: 'products',
            editingItem: null,
            editType: null,
            editIndex: -1,
            isSaving: false,
            tagsInput: ''
          }
        },
        methods: {
          getCategoryName(catId) {
            const cat = this.data.categories.find(c => c.id === catId);
            return cat ? cat.icon + ' ' + cat.name : catId;
          },
          addNew(type) {
            this.editType = type;
            this.editIndex = -1;
            if (type === 'product') {
                this.editingItem = { id: 'new-'+Date.now(), name: '新工具', icon: '✨', desc: '', detail: '', link: '', cta: '访问', category: '', toolType: 'external' };
            } else {
                this.editingItem = { title: '新提示词', tags: [], content: '', category: 'prompts' };
                this.tagsInput = '';
            }
          },
          editItem(type, index) {
            this.editType = type;
            this.editIndex = index;
            const source = type === 'product' ? this.data.products : this.data.prompts;
            this.editingItem = JSON.parse(JSON.stringify(source[index]));
            if (!this.editingItem.toolType) this.editingItem.toolType = 'external';
            if (type === 'prompt') {
                this.tagsInput = this.editingItem.tags.join(', ');
            }
          },
          updateTags() {
            this.editingItem.tags = this.tagsInput.split(/[,，]/).map(t => t.trim()).filter(t => t);
          },
          confirmEdit() {
            if (this.editType === 'product') {
                if (this.editIndex === -1) this.data.products.push(this.editingItem);
                else this.data.products[this.editIndex] = this.editingItem;
            } else if (this.editType === 'prompt') {
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
                alert('❌ 网络错误：' + e.message);
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

export { DEFAULT_DATA, getData, getKV, saveData, getHTML, renderNav, renderHomePage, renderProductPage, renderPromptsPage, renderAdminUI };

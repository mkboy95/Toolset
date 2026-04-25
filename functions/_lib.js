const DEFAULT_DATA = {
  categories: [
    { id: "tools", name: "工具箱", icon: "📦", type: "products" },
    { id: "prompts", name: "提示词", icon: "💡", type: "prompts" },
    { id: "covers", name: "封面工具", icon: "🎨", type: "products" }
  ],
  products: [
    {
      id: "mini-cover",
      name: "Mini-Cover 封面生成器",
      desc: "简洁的在线生成封面网站，专为博客、短视频、社交媒体等生成个性化封面。",
      icon: "🎨",
      detail: "Mini-Cover 是一个现代化的封面生成工具，专为博客、短视频、社交媒体设计。支持多种自定义选项，让你轻松创建个性化封面图片。\n\n✨ 特性：\n- 📱 响应式设计，完美支持移动端\n- 🎨 丰富的图标库，一键选用\n- 🖼️ 自定义背景图片，支持拖拽上传\n- ✍️ 灵活的标题编辑，多种字体可选\n- 💫 水印效果调整，实时预览\n- 🎯 简洁的操作界面，快速上手\n\n🔗 项目地址：https://github.com/mkboy95/Mini-Cover",
      link: "https://cover.bsgun.cn/",
      cta: "立即使用",
      category: "covers",
      embed: true
    },
    {
      id: "thiscover",
      name: "ThisCover 封面生成器",
      desc: "免费、漂亮的封面生成器，支持个性主题、20w+图标、23+免费字体、实时预览。",
      icon: "🖼️",
      detail: "ThisCover 是一个免费、漂亮的封面生成器，支持全生命周期功能。\n\n✨ 特性：\n- 🎨 个性主题：简洁、现代、经典、背景、手机预览等多个主题\n- 🔢 20w+ 图标库\n- 📝 23+ 免费字体\n- 👁️ 实时预览：配置即改即变，所见即所得\n- 📐 9+ 主流尺寸，横板+竖版\n- 📱 小红书、头条、知乎等多平台适配\n- 💾 PNG、JPG、WebP 多格式输出\n- 📤 一键复制",
      link: "https://cover.202597.xyz/",
      cta: "立即使用",
      category: "covers",
      embed: true
    },
    {
      id: "demo",
      name: "示例工具",
      desc: "这是一个示例，请去后台修改。",
      icon: "👋",
      detail: "详细介绍内容...",
      link: "#",
      cta: "按钮文字",
      category: "tools",
      embed: false
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
    // 尝试从 KV 获取
    const kv = getKV(env);
    if (kv) {
      const storedData = await kv.get("site_data");
      if (storedData) {
        data = JSON.parse(storedData);
        if (!data.categories) data.categories = DEFAULT_DATA.categories;
      }
    }
  } catch (e) { console.log("Init Data", e.message); }
  return data;
}

function getKV(env) {
  if (!env) return null;
  
  // 尝试标准 KV 绑定
  if (env.my_kv) return env.my_kv;
  if (env.DB) return env.DB;
  
  // 尝试 EdgeOne 可能的其他注入方式
  if (env.KV) return env.KV;
  if (env.kv) return env.kv;
  if (env.TOOLS_KV) return env.TOOLS_KV;
  
  // 扫描所有可能的 KV 实例
  const keys = Object.keys(env);
  for (const key of keys) {
    const val = env[key];
    if (val && typeof val === 'object') {
      // 检查是否有 KV 特征方法
      if (typeof val.get === 'function' && typeof val.put === 'function') {
        console.log('Found KV at:', key);
        return val;
      }
    }
  }
  
  console.log('No KV found');
  return null;
}

async function saveData(env, jsonStr) {
  const kv = getKV(env);
  
  if (kv) {
    try {
      await kv.put("site_data", jsonStr);
      console.log('KV save success');
      return "保存成功（KV 存储）";
    } catch (e) {
      console.log('KV save failed:', e.message);
      return "保存成功（本地存储，刷新后生效）";
    }
  } else {
    // 没有 KV 时，数据会通过前端 localStorage 管理
    return "保存成功（本地存储，刷新后生效）";
  }
}

function renderNav(categories, activeCategory) {
  let items = '';
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
  const globalScript = `
    <script>
      // 从 localStorage 加载数据并更新页面
      async function loadLocalData() {
        try {
          const localDataStr = localStorage.getItem('site_data');
          if (localDataStr) {
            const localData = JSON.parse(localDataStr);
            
            // 更新导航栏
            const navContainer = document.querySelector('nav .max-w-5xl');
            if (navContainer) {
              const navItems = navContainer.querySelector('div[nav-items]');
              if (navItems) {
                // 重新生成导航
                let items = '<a href="/" class="px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap shrink-0 ' + (${!activeCategory || activeCategory === 'all' ? '"text-blue-600 bg-blue-50"' : '"text-slate-500 hover:text-blue-600 hover:bg-blue-50"'}) + '">全部</a>';
                if (localData.categories && localData.categories.length) {
                  localData.categories.forEach(cat => {
                    const href = cat.type === 'prompts' ? '/prompts' : '/?cat=' + cat.id;
                    const isActive = '${activeCategory}' === cat.id;
                    const cls = isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50';
                    items += '<a href="' + href + '" class="px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap shrink-0 ' + cls + '">' + cat.icon + ' ' + cat.name + '</a>';
                  });
                }
                navItems.innerHTML = items;
              }
            }
          }
        } catch (e) {
          console.log('Load local data error:', e.message);
        }
      }
      
      // 页面加载后执行
      window.addEventListener('DOMContentLoaded', loadLocalData);
    </script>
  `;
  
  // 为导航栏添加容器标记
  const navWithContainer = navItems.replace('</a>', '</a><div nav-items style="display: flex; gap: 1px;"></div>');
  
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
        ${navWithContainer}
      </div>
    </nav>
    <main class="flex-grow">${content}</main>
    <footer class="bg-white border-t border-slate-200 py-8 mt-12 text-center text-sm text-slate-500">
      <p>&copy; ${new Date().getFullYear()} My Tools Studio.</p>
    </footer>
    ${script}${globalScript}
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
    const mainHref = p.embed ? `/${p.id}` : `/product/${p.id}`;
    const mainText = p.embed ? '🚀 立即使用' : '了解详情';
    const detailBtn = p.embed ? `<a href="/product/${p.id}" class="text-xs text-slate-400 hover:text-blue-600 transition-colors py-2.5 px-2">详情</a>` : '';
    return `
    <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-100 flex flex-col transition-all">
      <div class="text-4xl mb-4">${p.icon}</div>
      <h3 class="text-xl font-bold mb-2 text-slate-900">${p.name}</h3>
      <p class="text-slate-600 mb-6 flex-grow text-sm leading-relaxed">${p.desc}</p>
      <div class="flex items-center gap-1">
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
  const ctaHref = product.embed ? `/${product.id}` : product.link;
  const ctaTarget = product.embed ? '' : ' target="_blank"';
  const ctaStyle = product.embed ? 'block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform hover:-translate-y-0.5' : 'block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-transform hover:-translate-y-0.5';
  return getHTML(`
    <div class="max-w-3xl mx-auto px-4 py-16">
      <a href="/" class="text-sm text-slate-500 hover:text-blue-600 mb-6 inline-block">&larr; 返回列表</a>
      <div class="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div class="flex items-center mb-6"><span class="text-6xl mr-6">${product.icon}</span><h1 class="text-3xl font-bold">${product.name}</h1></div>
        <div class="prose max-w-none text-slate-600 mb-8 whitespace-pre-line"><p class="text-lg text-slate-800 font-medium">${product.desc}</p><hr class="my-4 border-slate-100"><p>${product.detail}</p></div>
        <a href="${ctaHref}"${ctaTarget} class="${ctaStyle}">${product.cta}</a>
      </div>
    </div>
  `, `${product.name} - 详情`, "", catId, categories);
}

function renderEmbedPage(data, id) {
  const categories = data.categories || [];
  const product = data.products.find(p => p.id === id);
  if (!product || !product.link) return null;
  const catId = product.category || '';
  const navItems = renderNav(categories, catId);
  return `
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 0; }
      .nav-scroll::-webkit-scrollbar { display: none; }
      .nav-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      .tool-frame { width: 100%; height: calc(100vh - 53px); border: none; }
    </style>
  </head>
  <body class="bg-slate-50 text-slate-800 flex flex-col h-screen">
    <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shrink-0">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center gap-1 nav-scroll overflow-x-auto">
        <a href="/" class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mr-3 shrink-0">🛠️ MyTools</a>
        ${navItems}
        <div class="ml-auto shrink-0 flex items-center gap-2">
          <span class="text-sm text-slate-400">${product.icon} ${product.name}</span>
          <a href="/product/${product.id}" class="text-xs text-blue-500 hover:text-blue-700">详情</a>
        </div>
      </div>
    </nav>
    <iframe src="${product.link}" class="tool-frame" allowfullscreen></iframe>
  </body>
  </html>`;
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
            <button @click="currentTab = 'categories'" :class="{'bg-blue-50 text-blue-600 border-b-2 md:border-b-0 md:border-r-2 border-blue-600': currentTab === 'categories'}" class="flex-1 md:flex-none p-4 text-left font-semibold hover:bg-gray-100 transition">🏷️ 分类管理</button>
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
                                    <span v-if="item.embed" class="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">嵌入模式</span>
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

            <div v-if="currentTab === 'categories'">
                <h2 class="text-xl font-bold mb-6">分类列表 ({{ data.categories.length }})</h2>
                <div class="grid gap-4">
                    <div v-for="(item, index) in data.categories" :key="index" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">{{ item.icon }}</span>
                            <div>
                                <h3 class="font-bold">{{ item.name }}</h3>
                                <p class="text-xs text-gray-400">ID: {{ item.id }} · 类型: {{ item.type === 'prompts' ? '提示词' : '工具' }}</p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button @click="editCategory(index)" class="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded">编辑</button>
                            <button @click="deleteItem('categories', index)" class="text-red-500 hover:bg-red-50 px-3 py-1 rounded">删除</button>
                        </div>
                    </div>
                </div>
                <button @click="addCategory" class="mt-6 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-500 font-bold transition">+ 添加新分类</button>
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
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                    <input type="checkbox" v-model="editingItem.embed" id="embed-check" class="w-4 h-4 text-blue-600 rounded">
                    <label for="embed-check" class="text-sm">
                        <span class="font-bold text-gray-700">嵌入模式</span>
                        <span class="text-gray-500 block">开启后，访问 /{{ editingItem.id }} 将在项目内嵌 iframe 展示工具，而非跳转外链</span>
                    </label>
                </div>
                <div><label class="block text-sm font-bold text-gray-700">链接 URL</label><input v-model="editingItem.link" class="w-full border p-2 rounded" placeholder="嵌入模式填外部URL，非嵌入模式可填任意链接"></div>
                <div><label class="block text-sm font-bold text-gray-700">详情内容 (支持HTML)</label><textarea v-model="editingItem.detail" rows="4" class="w-full border p-2 rounded"></textarea></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-sm font-bold text-gray-700">按钮文字</label><input v-model="editingItem.cta" class="w-full border p-2 rounded"></div>
                </div>
            </div>

            <div v-if="editType === 'prompt'" class="space-y-4">
                <div><label class="block text-sm font-bold text-gray-700">标题</label><input v-model="editingItem.title" class="w-full border p-2 rounded"></div>
                <div><label class="block text-sm font-bold text-gray-700">标签 (逗号分隔)</label><input v-model="tagsInput" @input="updateTags" placeholder="例如: 写作, 办公" class="w-full border p-2 rounded"></div>
                <div><label class="block text-sm font-bold text-gray-700">提示词内容</label><textarea v-model="editingItem.content" rows="10" class="w-full border p-2 rounded font-mono text-sm bg-slate-50"></textarea></div>
            </div>

            <div v-if="editType === 'category'" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-sm font-bold text-gray-700">分类名称</label><input v-model="editingItem.name" class="w-full border p-2 rounded"></div>
                    <div><label class="block text-sm font-bold text-gray-700">分类ID (英文唯一标识)</label><input v-model="editingItem.id" class="w-full border p-2 rounded" placeholder="如: my-tools"></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-sm font-bold text-gray-700">图标 (Emoji)</label><input v-model="editingItem.icon" class="w-full border p-2 rounded" placeholder="如: 📦"></div>
                    <div><label class="block text-sm font-bold text-gray-700">类型</label>
                        <select v-model="editingItem.type" class="w-full border p-2 rounded">
                            <option value="products">工具类</option>
                            <option value="prompts">提示词类</option>
                        </select>
                    </div>
                </div>
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
          // 优先从 localStorage 读取数据
          let localData = null;
          try {
            const localDataStr = localStorage.getItem('site_data');
            if (localDataStr) {
              localData = JSON.parse(localDataStr);
            }
          } catch (e) {
            console.log('LocalStorage error:', e.message);
          }
          
          return {
            data: localData || RAW_DATA,
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
                this.editingItem = { id: 'new-'+Date.now(), name: '新工具', icon: '✨', desc: '', detail: '', link: '', cta: '访问', category: '', embed: false };
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
            if (this.editingItem.embed === undefined) this.editingItem.embed = false;
            if (type === 'prompt') {
                this.tagsInput = this.editingItem.tags.join(', ');
            }
          },
          addCategory() {
            this.editType = 'category';
            this.editIndex = -1;
            this.editingItem = { id: 'new-cat-'+Date.now(), name: '新分类', icon: '📁', type: 'products' };
          },
          editCategory(index) {
            this.editType = 'category';
            this.editIndex = index;
            this.editingItem = JSON.parse(JSON.stringify(this.data.categories[index]));
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
            } else if (this.editType === 'category') {
                if (this.editIndex === -1) this.data.categories.push(this.editingItem);
                else this.data.categories[this.editIndex] = this.editingItem;
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
                const jsonData = JSON.stringify(this.data);
                
                // 先尝试保存到后端（KV）
                const formData = new FormData();
                formData.append('password', PASSWORD);
                formData.append('jsonData', jsonData);

                const res = await fetch('/admin', { method: 'POST', body: formData });
                const text = await res.text();

                // 同时保存到本地存储，确保数据不会丢失
                localStorage.setItem('site_data', jsonData);
                
                alert('✅ ' + text);
            } catch(e) {
                // 网络错误时，只保存到本地存储
                localStorage.setItem('site_data', JSON.stringify(this.data));
                alert('✅ 保存成功（本地存储，刷新后生效）');
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

export { DEFAULT_DATA, getData, getKV, saveData, getHTML, renderNav, renderHomePage, renderProductPage, renderEmbedPage, renderPromptsPage, renderAdminUI };

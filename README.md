# Toolset

一个开源的工具集项目，可免费部署在 Cloudflare Workers 或 EdgeOne Pages 平台。

## 功能特性

- **工具落地页**：展示工具卡片，支持详情页查看
- **提示词库**：管理和复制提示词，支持标签分类
- **可视化后台**：基于 Vue.js 的管理界面，支持添加/编辑/删除工具和提示词
- **KV 存储**：使用 EdgeOne KV 或 Cloudflare KV 持久化存储数据
- **响应式设计**：适配桌面和移动设备

## 技术栈

- **前端**：HTML5 + Tailwind CSS + Vue 3
- **后端**：EdgeOne Pages Functions / Cloudflare Workers
- **存储**：EdgeOne KV / Cloudflare KV

## 部署步骤

### 方法 1：部署到 EdgeOne Pages

1. **准备**：
   - GitHub 仓库：`https://github.com/mkboy95/Toolset.git`
   - EdgeOne 账号（腾讯云）

2. **创建 KV 命名空间**：
   - 登录 EdgeOne 控制台 → KV 存储 → 创建命名空间
   - 记录命名空间名称（后续需要绑定）

3. **创建 Pages 项目**：
   - 登录 EdgeOne 控制台 → Pages → 创建项目
   - 关联 GitHub 仓库 `mkboy95/Toolset`
   - 构建配置：默认即可（无需构建命令）

4. **绑定 KV**：
   - 进入项目设置 → 函数服务 → KV 存储绑定
   - 变量名：`my_kv`
   - 选择创建的 KV 命名空间

5. **配置环境变量**：
   - 进入项目设置 → 环境变量
   - 添加变量：`ADMIN_PASS`，值为你的后台密码

6. **部署**：
   - 推送代码到 `main` 分支，自动触发构建
   - 部署完成后，访问生成的 URL

### 方法 2：部署到 Cloudflare Workers

1. **使用原始 `Worker.js` 文件**：
   - 登录 Cloudflare 控制台 → Workers & Pages
   - 创建 Worker，粘贴 `Worker.js` 代码
   - 绑定 KV 命名空间（变量名：`DB`）
   - 添加环境变量 `ADMIN_PASS`

## 项目结构

```
Toolset/
├── LICENSE             # MIT 许可证
├── README.md           # 项目说明
├── Worker.js           # Cloudflare Workers 版本
├── edgeone.json        # EdgeOne Pages 配置
└── functions/          # EdgeOne Pages Functions
    ├── _lib.js         # 共享模块（HTML模板、渲染函数）
    ├── index.js        # 首页
    ├── prompts.js      # 提示词页
    ├── product/        # 工具详情页
    │   └── [id].js     # 动态路由
    └── admin/          # 后台管理
        ├── index.js    # 登录页 + 保存数据
        └── login.js    # 密码验证
```

## 访问方式

- **前台**：`https://your-domain.com/`
- **提示词页**：`https://your-domain.com/prompts`
- **工具详情**：`https://your-domain.com/product/{id}`
- **后台**：`https://your-domain.com/admin`（需要输入密码）

## 开发指南

### 本地调试（EdgeOne Pages）

```bash
# 安装 CLI
npm install -g edgeone

# 登录
edgeone login

# 关联项目
edgeone pages link

# 本地开发
edgeone pages dev
# 访问：http://localhost:8088
```

### 注意事项

- KV 变量名：EdgeOne Pages 使用 `my_kv`，Cloudflare Workers 使用 `DB`
- 环境变量：`ADMIN_PASS` 用于后台登录验证
- 首次访问：会自动创建默认数据（示例工具和提示词）

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

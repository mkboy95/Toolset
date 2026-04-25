# Toolset

<p align="center">
  <a href="https://github.com/mkboy95/Toolset" target="_blank">
    <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tool%20box%20logo%20with%20gear%20icon%20on%20blue%20background&image_size=square_hd" alt="Toolset Logo" width="120" height="120">
  </a>
</p>

<p align="center">
  <a href="https://github.com/mkboy95/Toolset/stargazers"><img src="https://img.shields.io/github/stars/mkboy95/Toolset?style=for-the-badge&color=yellow"></a>
  <a href="https://github.com/mkboy95/Toolset/network/members"><img src="https://img.shields.io/github/forks/mkboy95/Toolset?style=for-the-badge&color=green"></a>
  <a href="https://github.com/mkboy95/Toolset/issues"><img src="https://img.shields.io/github/issues/mkboy95/Toolset?style=for-the-badge&color=blue"></a>
  <a href="https://github.com/mkboy95/Toolset/blob/main/LICENSE"><img src="https://img.shields.io/github/license/mkboy95/Toolset?style=for-the-badge&color=purple"></a>
</p>

<p align="center">
  <strong>开源工具集管理系统</strong><br>
  可免费部署在 Cloudflare Workers 或 EdgeOne Pages 平台
</p>

## 🎯 功能特性

### 核心功能

- **工具落地页**：美观的卡片式展示，支持响应式布局
- **提示词库**：管理和复制提示词，支持标签分类
- **可视化后台**：基于 Vue 3 的管理界面，支持完整的 CRUD 操作
- **KV 存储**：使用 EdgeOne KV 或 Cloudflare KV 持久化存储数据
- **密码保护**：后台登录验证，确保数据安全

### 技术亮点

- **Serverless 架构**：无服务器部署，无需维护底层基础设施
- **边缘计算**：部署在全球边缘节点，响应速度快
- **零成本**：利用 Cloudflare 或 EdgeOne 的免费额度
- **易于扩展**：模块化设计，可轻松添加新功能

## 🛠️ 技术栈

### 前端
- **HTML5** + **CSS3**：语义化标记，响应式布局
- **Tailwind CSS**：实用优先的 CSS 框架，快速构建美观界面
- **Vue 3**：轻量级前端框架，用于后台管理界面
- **原生 JavaScript**：简洁高效的脚本逻辑

### 后端
- **EdgeOne Pages Functions**：腾讯云边缘函数，高性能执行环境
- **Cloudflare Workers**：Cloudflare 无服务器函数
- **KV 存储**：EdgeOne KV / Cloudflare KV，低延迟键值存储

### 外部依赖
- **Tailwind CSS**：CDN 引入，无需本地构建
- **Vue 3**：CDN 引入，用于后台管理界面

## 📦 部署指南

### 方法 1：部署到 EdgeOne Pages（推荐）

#### 1. 准备工作
- **GitHub 仓库**：`https://github.com/mkboy95/Toolset.git`
- **EdgeOne 账号**：腾讯云 EdgeOne 服务
- **KV 命名空间**：用于存储数据

#### 2. 创建 KV 命名空间
1. 登录 EdgeOne 控制台
2. 进入 **KV 存储** → **创建命名空间**
3. 记录命名空间名称（后续需要绑定）

#### 3. 创建 Pages 项目
1. 登录 EdgeOne 控制台
2. 进入 **Pages** → **创建项目**
3. **关联 GitHub 仓库**：选择 `mkboy95/Toolset`
4. **构建配置**：默认即可（无需构建命令）

#### 4. 绑定 KV 存储
1. 进入项目 **设置** → **函数服务** → **KV 存储绑定**
2. **变量名**：`my_kv`（必须与代码中一致）
3. **选择命名空间**：选择步骤 2 创建的 KV 命名空间

#### 5. 配置环境变量
1. 进入项目 **设置** → **环境变量**
2. **添加变量**：
   - 名称：`ADMIN_PASS`
   - 值：设置你的后台登录密码

#### 6. 部署与访问
1. 推送代码到 `main` 分支，自动触发构建
2. 部署完成后，访问生成的 URL
3. **后台地址**：`https://your-domain.com/admin`（输入密码登录）

### 方法 2：部署到 Cloudflare Workers

1. **登录 Cloudflare 控制台** → **Workers & Pages**
2. **创建 Worker**，粘贴 `Worker.js` 代码
3. **绑定 KV 命名空间**：变量名设置为 `DB`
4. **添加环境变量**：`ADMIN_PASS` 设为后台密码
5. **部署**并访问生成的 URL

## 📁 项目结构

```
Toolset/
├── LICENSE             # MIT 许可证
├── README.md           # 项目说明
├── Worker.js           # Cloudflare Workers 版本
├── edgeone.json        # EdgeOne Pages 配置
└── functions/          # EdgeOne Pages Functions
    ├── _lib.js         # 共享模块（HTML模板、渲染函数）
    ├── index.js        # 首页路由
    ├── prompts.js      # 提示词页路由
    ├── product/        # 工具详情页
    │   └── [id].js     # 动态路由
    └── admin/          # 后台管理
        ├── index.js    # 登录页 + 保存数据
        └── login.js    # 密码验证
```

## 🌐 访问方式

| 页面 | URL | 功能 |
|------|-----|------|
| 首页 | `https://your-domain.com/` | 工具卡片展示 |
| 提示词库 | `https://your-domain.com/prompts` | 提示词管理与复制 |
| 工具详情 | `https://your-domain.com/product/{id}` | 工具详细信息 |
| 后台管理 | `https://your-domain.com/admin` | 数据管理（需要密码） |

## 🚀 本地开发

### EdgeOne Pages 本地调试

```bash
# 安装 EdgeOne CLI
npm install -g edgeone

# 登录 EdgeOne 账号
edgeone login

# 关联项目（选择 Toolset）
edgeone pages link

# 启动本地开发服务器
edgeone pages dev

# 访问：http://localhost:8088
```

### 开发注意事项
- **KV 变量名**：EdgeOne Pages 使用 `my_kv`，Cloudflare Workers 使用 `DB`
- **环境变量**：`ADMIN_PASS` 用于后台登录验证
- **首次访问**：会自动创建默认数据（示例工具和提示词）
- **静态资源**：所有 CSS 和 JavaScript 均通过 CDN 引入，无需本地构建

## 🎨 界面预览

### 首页
![首页预览](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tool%20dashboard%20with%20cards%20grid%20layout%20on%20blue%20gradient%20background&image_size=landscape_16_9)

### 提示词库
![提示词库预览](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=prompt%20library%20interface%20with%20copy%20buttons%20and%20tags&image_size=landscape_16_9)

### 后台管理
![后台管理预览](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=admin%20dashboard%20with%20Vue%20interface%20for%20managing%20tools&image_size=landscape_16_9)

## ⚙️ 配置说明

### KV 存储结构
```json
{
  "site_data": {
    "products": [
      {
        "id": "unique-id",
        "name": "工具名称",
        "desc": "简短描述",
        "icon": "emoji或HTML",
        "detail": "详细介绍",
        "link": "工具链接",
        "cta": "按钮文字"
      }
    ],
    "prompts": [
      {
        "title": "提示词标题",
        "tags": ["标签1", "标签2"],
        "content": "提示词内容"
      }
    ]
  }
}
```

### 环境变量
| 变量名 | 类型 | 说明 | 必填 |
|--------|------|------|------|
| `ADMIN_PASS` | String | 后台登录密码 | ✅ |

## 🔧 常见问题

### Q: 部署后无法访问后台？
A: 检查 `ADMIN_PASS` 环境变量是否正确设置，后台地址为 `https://your-domain.com/admin`

### Q: 数据保存失败？
A: 检查 KV 命名空间是否正确绑定，变量名必须为 `my_kv`（EdgeOne Pages）或 `DB`（Cloudflare Workers）

### Q: 首次访问没有数据？
A: 系统会自动创建默认示例数据，包含一个示例工具和一个示例提示词

### Q: 如何修改默认数据？
A: 登录后台后，可直接编辑或删除默认数据

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 🌟 支持

如果这个项目对你有帮助，请给它一个 ⭐️ 吧！

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/mkboy95" target="_blank">Mkboy</a>
</p>

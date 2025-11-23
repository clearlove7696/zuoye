# 🚀 部署指南

本文档详细说明如何将创意作品展示平台部署到 Supabase 和 Netlify。

## 📋 部署清单

在开始之前，请确保你已完成以下准备：

- [ ] GitHub 账号
- [ ] Supabase 账号
- [ ] Netlify 账号
- [ ] 项目代码已推送到 GitHub

## 🗄️ 第一步：Supabase 配置

### 1.1 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 点击 "New Project"
5. 选择组织，点击 "New Project" 
6. 设置项目信息：
   - **Project Name**: `creative-showcase-platform`
   - **Database Password**: 设置强密码并记录
   - **Region**: 选择离你最近的区域
   - **Pricing Plan**: 选择 Free 计划

### 1.2 获取项目配置

项目创建完成后：

1. 进入项目仪表板
2. 点击左侧菜单的 "Settings" → "API"
3. 复制以下信息：
   ```
   Project URL: https://[your-project-id].supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 1.3 创建数据库表

1. 在项目仪表板，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制 `database/schema.sql` 文件中的所有 SQL 代码
4. 点击 "Run" 执行

验证表创建成功：
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

应该看到三个表：`categories`, `users`, `works`

### 1.4 配置行级安全策略 (RLS)

SQL 脚本已包含 RLS 策略，但你可以手动验证：

```sql
-- 检查 RLS 是否启用
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 🔧 第二步：项目配置

### 2.1 环境变量设置

在项目根目录创建 `.env` 文件：

```bash
# 复制模板
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Supabase 配置：

```env
# Supabase 配置
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.2 本地测试

安装依赖并启动本地开发：

```bash
npm install
npm run dev
```

访问 `http://localhost:3000` 检查应用是否正常运行。

## 🌐 第三步：Netlify 部署

### 3.1 连接 GitHub 仓库

1. 登录 [Netlify](https://netlify.com)
2. 点击 "Add new site" → "Import an existing project"
3. 选择 "GitHub"（如果首次使用需要授权）
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

### 3.2 环境变量配置

在部署配置页面添加环境变量：

1. 点击 "Advanced build settings" → "New variable"
2. 添加以下环境变量：

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | 你的 Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | 你的 Supabase 匿公钥 |

### 3.3 部署设置

Netlify 会自动检测并使用项目根目录的 `netlify.toml` 配置文件。

确保 `netlify.toml` 包含：

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3.4 开始部署

点击 "Deploy site" 开始部署。部署完成后，Netlify 会提供：

- **网站 URL**: `https://[random-name].netlify.app`
- **部署日志**: 可以查看构建过程

## ✅ 第四步：验证部署

### 4.1 检查网站功能

1. 访问你的 Netlify URL
2. 测试以下功能：
   - [ ] 首页加载正常
   - [ ] 分类筛选工作
   - [ ] 作品详情页正常显示
   - [ ] 个人中心页面可访问
   - [ ] 404 页面正常

### 4.2 检查数据库连接

1. 打开浏览器开发者工具
2. 查看 Network 标签
3. 确认 API 请求正常：
   - 向 Supabase 发送的请求
   - 返回状态码 200
   - 数据正确加载

### 4.3 测试响应式设计

在不同设备尺寸测试：
- 📱 手机 (< 768px)
- 📱 平板 (768px - 1024px) 
- 💻 桌面 (> 1024px)

## 🔄 第五步：持续部署

Netlify 已配置自动部署，每次推送到 `main` 分支时会自动重新部署。

### 手动触发部署

如需手动触发部署：

1. 在 Netlify 仪表板选择你的站点
2. 点击 "Deploys" → "Trigger deploy"
3. 选择 "Branch deploy" → 选择 `main` 分支

### 部署状态通知

1. 在 Netlify 仪表板点击 "Site overview" → "Site settings"
2. 在 "Build & deploy" 部分配置通知：
   - Email 通知
   - Slack 集成
   - Webhook 通知

## 🛠️ 故障排除

### 常见问题

#### 1. 构建失败
```bash
# 本地测试构建
npm run build

# 检查依赖
npm audit
```

#### 2. 环境变量错误
```bash
# 检查环境变量
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

#### 3. 数据库连接失败
- 检查 Supabase 项目 URL
- 验证 API 密钥正确性
- 确认 RLS 策略配置

#### 4. 页面路由错误
- 确认 `netlify.toml` 重定向配置
- 检查 React Router 配置
- 验证 base URL 设置

### 日志查看

1. **构建日志**: Netlify → Deploys → 选择部署 → View build log
2. **运行时日志**: 浏览器开发者工具 → Console
3. **Supabase 日志**: Supabase Dashboard → Logs

## 📊 性能优化

### Netlify 优化

1. 启用 Asset Optimization
2. 配置 CDN 缓存
3. 使用 Netlify Functions (如需要)

### Supabase 优化

1. 监控数据库性能
2. 优化 SQL 查询
3. 配置适当的索引

## 🎉 完成部署！

恭喜！你的创意作品展示平台已成功部署到：

- **前端**: Netlify (https://your-site.netlify.app)
- **数据库**: Supabase (https://your-project.supabase.co)
- **代码仓库**: GitHub

### 提交要求

按照作业要求，你需要提交：

1. **Netlify 部署地址**: `https://[your-name].netlify.app`
2. **Supabase 数据库表截图**: 包含三个数据表的截图

### 截图示例

在 Supabase Dashboard → Table Editor 中截图，显示：
- `categories` 表结构和数据
- `users` 表结构和数据  
- `works` 表结构和数据

确保截图包含你的项目标识，以证明是你自己的项目。

---

🎊 **部署完成！** 你现在拥有一个功能完整的创意作品展示平台。
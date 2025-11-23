# 🌐 Netlify 详细部署步骤指南

本指南将一步步带你完成创意作品展示平台在 Netlify 上的完整部署。

## 📋 部署前准备清单

在开始之前，请确保已完成：

- [ ] GitHub 账号并已创建仓库
- [ ] 项目代码已推送到 GitHub
- [ ] Supabase 项目已创建（参考 DEPLOYMENT.md）
- [ ] 本地项目运行正常

---

## 🚀 第一步：创建 Netlify 账号

### 1.1 注册 Netlify

1. 访问 [Netlify 官网](https://www.netlify.com)
2. 点击右上角 **"Sign up"**
3. 选择注册方式：
   - **推荐**：使用 **GitHub** 账号登录（便于集成）
   - 或使用 Email 注册

### 1.2 验证邮箱

如果使用邮箱注册，请：
1. 查收验证邮件
2. 点击验证链接
3. 完成邮箱验证

---

## 🔗 第二步：连接 GitHub 仓库

### 2.1 开始新站点部署

1. 登录 Netlify 后台
2. 点击 **"Add new site"** 按钮
3. 选择 **"Import an existing project"**

### 2.2 授权 GitHub

1. 在 **"Connect to Git provider"** 页面选择 **"GitHub"**
2. 如果首次使用，会跳转到 GitHub 授权页面：
   - 点击 **"Authorize Netlify"**
   - 选择授权范围（保持默认即可）
   - 点击 **"Authorize netlify"**

### 2.3 选择仓库

1. 在仓库列表中找到你的项目仓库
   - 如果仓库很多，可以使用搜索框搜索
2. 点击项目仓库右侧的 **"Import site"**

---

## ⚙️ 第三步：配置构建设置

### 3.1 基本构建配置

在 **"Build settings for this site"** 页面：

1. **Build command**（构建命令）：
   ```
   npm run build
   ```

2. **Publish directory**（发布目录）：
   ```
   dist
   ```

3. **Functions directory**（可选）：
   ```
   netlify/functions
   ```
   （如果不使用 Netlify Functions，可留空）

### 3.2 高级构建设置

1. 点击 **"Advanced build settings"**
2. **New variable** 添加以下环境变量：

| Variable | Value | 说明 |
|----------|-------|------|
| `NODE_VERSION` | `18` | Node.js 版本 |
| `NPM_VERSION` | `9` | npm 版本（可选） |

3. 点击 **"Save"** 保存设置

---

## 🔐 第四步：添加环境变量

### 4.1 获取 Supabase 配置

回到你的 Supabase 项目：

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 左侧菜单点击 **"Settings"** → **"API"**
4. 复制以下信息：
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4.2 在 Netlify 中设置环境变量

1. 回到 Netlify 部署配置页面
2. 在 **"Advanced build settings"** 中点击 **"New variable"**
3. 依次添加以下变量：

```
环境变量名: VITE_SUPABASE_URL
变量值: https://your-project-id.supabase.co

环境变量名: VITE_SUPABASE_ANON_KEY  
变量值: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. 确保勾选 **"Locked"**（保护敏感信息）

### 4.3 验证环境变量

添加完成后，环境变量列表应显示：

| Variable | Value | Status |
|----------|-------|--------|
| `NODE_VERSION` | `18` | ✓ |
| `VITE_SUPABASE_URL` | `https://...` | 🔒 |
| `VITE_SUPABASE_ANON_KEY` | `eyJhb...` | 🔒 |

---

## 🚀 第五步：开始部署

### 5.1 部署设置确认

检查所有配置：

- [x] 构建命令：`npm run build`
- [x] 发布目录：`dist`
- [x] Node.js 版本：`18`
- [x] Supabase 环境变量已设置

### 5.2 启动部署

1. 点击 **"Deploy site"** 按钮
2. 等待部署完成（通常需要 2-5 分钟）

### 5.3 监控部署过程

部署过程中你可以看到：
- 🔄 **依赖安装**: `npm ci`
- 📦 **代码构建**: `npm run build`
- 📤 **文件上传**: 将 dist 目录上传到 CDN
- ✅ **部署完成**: 网站上线

---

## 🌍 第六步：验证部署

### 6.1 访问网站

部署成功后，Netlify 会提供：
- **临时域名**: `https://amazing-tesla-123456.netlify.app`
- **部署ID**: 用于跟踪特定部署

### 6.2 功能测试

1. **基础功能测试**：
   - [ ] 首页正常加载
   - [ ] 导航菜单工作正常
   - [ ] 页面路由正确

2. **数据库连接测试**：
   - [ ] 作品列表正常显示
   - [ ] 分类筛选功能正常
   - [ ] 作品详情页显示正常

3. **响应式测试**：
   - [ ] 移动端适配正常
   - [ ] 平板端适配正常
   - [ ] 桌面端显示正常

### 6.3 调试问题

如果出现问题：

1. **查看构建日志**：
   - 进入 **"Deploys"** 标签
   - 点击失败的部署
   - 查看 **"Build log"**

2. **常见错误排查**：
   ```
   错误: VITE_SUPABASE_URL is not defined
   解决: 检查环境变量设置
   
   错误: Module not found
   解决: 检查 package.json 依赖
   
   错误: 404 on routes
   解决: 检查 netlify.toml 重定向配置
   ```

---

## 🎛️ 第七步：网站设置优化

### 7.1 自定义域名

1. 进入 **"Site overview"** → **"Domain settings"**
2. 点击 **"Add custom domain"**
3. 输入你的域名（如 `www.yourdomain.com`）
4. 按提示配置 DNS 记录

### 7.2 SSL 证书

1. 在域名设置中点击 **"Verify DNS configuration"**
2. Netlify 会自动申请和配置 SSL 证书
3. 等待证书颁发（通常几分钟到几小时）

### 7.3 性能优化

启用以下优化功能：

1. **Asset optimization**：
   - 在 **"Site settings"** → **"Build & deploy"**
   - 勾选 **"Asset optimization"**

2. **缓存策略**：
   ```toml
   # 在 netlify.toml 中添加
   [[headers]]
     for = "/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000"
   ```

---

## 🔄 第八步：持续部署配置

### 8.1 分支部署

1. 进入 **"Build & deploy"** → **"Continuous Deployment"**
2. 在 **"Deploy contexts"** 中配置：
   - **Production deploy**: `main` 分支
   - **Deploy previews**: 所有 Pull Request

### 8.2 部署钩子

1. **部署通知**：
   - 进入 **"Build & deploy"** → **"Build hooks"**
   - 创建 Webhook URL 用于集成其他服务

2. **GitHub Status Checks**：
   - Netlify 会自动在 GitHub PR 中显示部署状态

---

## 📊 第九步：监控和分析

### 9.1 网站分析

1. **Netlify Analytics**：
   - 进入 **"Analytics"** 标签
   - 查看访问量、页面浏览量等数据

2. **部署历史**：
   - **"Deploys"** 标签查看所有部署记录
   - 可以回滚到之前的部署版本

### 9.2 性能监控

1. **Lighthouse 集成**：
   - 在部署设置中启用 Lighthouse 分析
   - 获得性能、可访问性等评分

2. **错误监控**：
   - 查看访问日志中的错误信息
   - 设置错误通知

---

## 🆘 第十步：常见问题解决

### 10.1 构建失败

**问题**: `npm ERR! code ENOENT`
```
解决方案:
1. 检查 package.json 是否存在
2. 确认 package-lock.json 在仓库中
3. 重新触发部署
```

**问题**: `VITE_SUPABASE_URL is not defined`
```
解决方案:
1. 检查环境变量名称是否正确
2. 确认变量值中没有空格
3. 重新部署使环境变量生效
```

### 10.2 运行时错误

**问题**: 404 错误在子路由
```
解决方案:
1. 检查 netlify.toml 重定向配置
2. 确认 React Router 使用正确
3. 验证 BrowserRouter 配置
```

**问题**: API 请求失败
```
解决方案:
1. 检查 Supabase CORS 设置
2. 验证 API 密钥权限
3. 确认 RLS 策略配置
```

### 10.3 性能问题

**问题**: 首次加载慢
```
解决方案:
1. 启用代码分割
2. 优化图片资源
3. 启用 Netlify 压缩
4. 配置合适的缓存策略
```

---

## ✅ 部署完成清单

部署完成后，请确认以下所有项目：

- [x] 网站可以通过 Netlify URL 正常访问
- [x] 所有页面路由工作正常
- [x] Supabase 数据库连接正常
- [x] 作品数据可以正确加载
- [x] 响应式设计在不同设备上正常
- [x] 环境变量配置正确
- [x] SSL 证书已启用
- [x] 自定义域名配置（如需要）

---

## 📋 作业提交要求

根据作业要求，你需要提交：

### 1. Netlify 部署地址
```
格式: https://your-site-name.netlify.app
示例: https://creative-showcase-123.netlify.app
```

### 2. Supabase 数据库表截图
在 Supabase Dashboard 中截图：
1. **categories** 表截图
2. **users** 表截图  
3. **works** 表截图

截图应包含：
- 表结构（列名、数据类型）
- 示例数据（至少几条记录）
- Supabase 界面标识（证明是你的项目）

---

## 🎉 恭喜部署完成！

你已成功将创意作品展示平台部署到 Netlify！

📞 **需要帮助？**
- 查看 [Netlify 文档](https://docs.netlify.com)
- 联系技术支持
- 提交 GitHub Issues

🚀 **下一步建议：**
1. 配置自定义域名
2. 设置网站分析
3. 优化性能和SEO
4. 考虑添加更多功能

---

*最后更新：2024年*
*适用于 Netlify 最新版本*
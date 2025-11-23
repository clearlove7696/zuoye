# 🗄️ Supabase 详细配置步骤指南

本指南将一步步带你完成创意作品展示平台在 Supabase 上的完整配置。

## 📋 配置前准备清单

在开始之前，请确保已准备好：

- [ ] 有效的邮箱地址
- [ ] GitHub 账号（推荐使用 GitHub 登录）
- [ ] 项目代码已准备就绪

---

## 🚀 第一步：创建 Supabase 账号

### 1.1 注册 Supabase

1. 访问 [Supabase 官网](https://supabase.com)
2. 点击右上角 **"Start your project"** 按钮
3. 选择登录方式：

**推荐：使用 GitHub 登录**
- 点击 **"Continue with GitHub"**
- 在 GitHub 页面点击 **"Authorize supabase"**

**或使用邮箱注册**
- 输入邮箱地址
- 设置密码
- 验证邮箱

### 1.2 完成注册流程

1. **选择计划**：选择 **Free** 免费计划
2. **区域选择**：选择离你最近的区域（推荐：East US - North Virginia）
3. **公司信息**：个人使用可以填写 "Personal" 或 "Student"

---

## 🏗️ 第二步：创建 Supabase 项目

### 2.1 创建新项目

1. 登录后进入 Supabase Dashboard
2. 点击左侧菜单的 **"Projects"** 
3. 点击 **"+ New Project"** 按钮

### 2.2 配置项目信息

在 **"Create a new project"** 页面填写：

1. **Project Name**: `creative-showcase-platform`
   - 项目名称必须唯一
   - 如果已被占用，可以添加数字，如 `creative-showcase-123`

2. **Database Password**: 设置强密码
   ```
   推荐格式: Creative@2024#Showcase
   密码要求: 至少12位，包含大小写字母、数字、特殊字符
   ```
   🔒 **重要**: 请务必记录此密码，后面无法查看！

3. **Region**: 选择数据库区域
   - 推荐: **East US - North Virginia**（网速最快）
   - 或选择离你最近的区域

4. **Pricing Plan**: 选择 **Free** 免费计划

### 2.3 确认并创建

1. 仔细检查配置信息
2. 点击 **"Create new project"** 按钮
3. 等待项目创建（通常需要 1-2 分钟）

---

## 🔑 第三步：获取项目配置信息

### 3.1 查看项目信息

项目创建完成后：

1. 进入项目 Dashboard
2. 点击左侧菜单的 **"Settings"** → **"General"**
3. 在 **"Configuration"** 部分找到项目信息

### 3.2 复制 API 配置

1. 点击左侧菜单的 **"Settings"** → **"API"**
2. 在 **"Project Settings"** 部分复制以下信息：

```
📋 Project URL:
https://[your-project-id].supabase.co

📋 anon public key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24i...
```

### 3.3 保存配置信息

**方式一：保存到本地文件**
```bash
# 创建配置文件
touch supabase-config.txt

# 保存配置信息
echo "SUPABASE_URL=https://your-project-id.supabase.co" >> supabase-config.txt
echo "SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." >> supabase-config.txt
```

**方式二：截图保存**
1. 按下 `Win + Shift + S`（Windows）或 `Cmd + Shift + 4`（Mac）
2. 截取 API 配置区域
3. 保存到项目文件夹中

---

## 🗄️ 第四步：创建数据库表结构

### 4.1 打开 SQL Editor

1. 在 Supabase Dashboard 中
2. 点击左侧菜单的 **"SQL Editor"**
3. 点击 **"+ New query"** 按钮

### 4.2 执行建表 SQL

1. 复制 `database/schema.sql` 文件中的完整 SQL 代码
2. 粘贴到 SQL Editor 中
3. 点击 **"Run"** 按钮执行

**SQL 代码包含：**
- ✅ 创建 3 个数据表（categories, users, works）
- ✅ 设置主键和外键关系
- ✅ 创建索引提高查询性能
- ✅ 配置行级安全策略（RLS）
- ✅ 插入示例数据

### 4.3 验证表创建

在 SQL Editor 中执行以下验证代码：

```sql
-- 查看所有表
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 查看每个表的记录数
SELECT 
    'categories' as table_name, COUNT(*) as record_count 
FROM categories
UNION ALL
SELECT 
    'users' as table_name, COUNT(*) as record_count 
FROM users
UNION ALL
SELECT 
    'works' as table_name, COUNT(*) as record_count 
FROM works;
```

**预期结果：**
```
categories | 6  (6个分类)
users     | 3  (3个示例用户)
works     | 4  (4个示例作品)
```

---

## 🔐 第五步：配置行级安全策略

### 5.1 验证 RLS 状态

执行以下 SQL 检查 RLS 是否启用：

```sql
-- 检查表 RLS 状态
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

### 5.2 查看安全策略

执行 SQL 查看已配置的安全策略：

```sql
-- 查看所有 RLS 策略
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 5.3 测试匿名访问

使用匿名密钥测试 API 访问：

```bash
# 测试获取分类
curl -X GET "https://your-project-id.supabase.co/rest/v1/categories?select=*" \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY"

# 测试获取作品
curl -X GET "https://your-project-id.supabase.co/rest/v1/works?select=*" \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## 📊 第六步：验证数据库表结构

### 6.1 使用 Table Editor 查看

1. 点击左侧菜单的 **"Table Editor"**
2. 你应该能看到 3 个表：

**🗂️ categories 表**
- id (uuid)
- name (text) - 分类名称
- slug (text) - URL 友好名称
- description (text) - 分类描述
- icon (text) - 图标
- color (text) - 主题颜色

**👤 users 表**
- id (uuid)
- username (text) - 用户名
- email (text) - 邮箱
- full_name (text) - 姓名
- bio (text) - 个人简介
- avatar (text) - 头像URL
- skills (text[]) - 技能标签

**🎨 works 表**
- id (uuid)
- title (text) - 作品标题
- description (text) - 作品描述
- cover_image (text) - 封面图片
- category_id (uuid) - 分类ID
- user_id (uuid) - 作者ID
- tags (text[]) - 作品标签
- views (int) - 浏览次数
- likes (int) - 点赞次数

### 6.2 截图保存数据表

为作业提交，需要截图以下内容：

**截图 1: categories 表**
1. 在 Table Editor 中选择 categories 表
2. 调整显示所有列和数据
3. 确保包含 Supabase 标识
4. 按 `PrtScn` 截图

**截图 2: users 表**
1. 选择 users 表
2. 显示用户数据和列结构
3. 截图保存

**截图 3: works 表**
1. 选择 works 表
2. 显示作品数据和关联信息
3. 截图保存

---

## 🔄 第七步：测试数据库连接

### 7.1 配置本地环境

在你的项目根目录创建 `.env` 文件：

```bash
# 复制模板
cp .env.example .env

# 编辑 .env 文件
nano .env  # Linux/Mac
# 或
notepad .env  # Windows
```

填入你的 Supabase 配置：

```env
# Supabase 配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Netlify 配置（部署时自动设置）
NETLIFY_SITE_URL=http://localhost:3000
```

### 7.2 本地测试连接

启动项目并测试：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:3000`，测试：

- [x] 首页能正常加载
- [x] 作品列表显示示例数据
- [x] 分类筛选功能正常
- [x] 作品详情页正常

### 7.3 API 连接测试

在浏览器开发者工具中检查：

```javascript
// 在浏览器控制台测试
fetch('https://your-project-id.supabase.co/rest/v1/categories?select=*', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(response => response.json())
.then(data => console.log('Categories:', data))
.catch(error => console.error('Error:', error));
```

---

## 🛡️ 第八步：安全配置优化

### 8.1 API 密钥管理

理解不同密钥的用途：

**🔓 anon public key**（已在项目中使用）
- 匿名访问密钥
- 允许公开数据的读取操作
- 🔍 适用于：查看作品、分类、公开用户信息

**🔒 service_role key**（保密）
- 服务端密钥
- 拥有完全数据库权限
- ⚠️ 永远不要在前端使用！

### 8.2 RLS 策略优化

查看当前 RLS 策略：

```sql
-- 查看详细的 RLS 策略
SELECT 
    p.policyname,
    p.tablename,
    p.cmd,
    p.qual,
    p.with_check
FROM pg_policies p
JOIN pg_class c ON p.tablename = c.relname
WHERE c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY p.tablename, p.policyname;
```

### 8.3 数据库权限检查

```sql
-- 检查匿名用户权限
SELECT 
    schemaname, 
    tablename, 
    has_table_privilege('anon', tablename, 'SELECT') as can_select,
    has_table_privilege('anon', tablename, 'INSERT') as can_insert,
    has_table_privilege('anon', tablename, 'UPDATE') as can_update,
    has_table_privilege('anon', tablename, 'DELETE') as can_delete
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 📈 第九步：性能监控

### 9.1 查看数据库统计

1. 点击左侧菜单的 **"Database"** → **"Usage"**
2. 监控以下指标：
   - **Database size**（数据库大小）
   - **Row count**（记录数量）
   - **Bandwidth**（带宽使用）
   - **API requests**（API 请求数）

### 9.2 查询性能分析

在 SQL Editor 中分析慢查询：

```sql
-- 查看查询统计
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

---

## 🆘 第十步：常见问题解决

### 10.1 连接问题

**问题**: `TypeError: Failed to fetch`
```
解决方案:
1. 检查 Supabase URL 是否正确
2. 验证 anon key 是否有效
3. 确认 RLS 策略配置正确
4. 检查网络连接
```

**问题**: `42501: permission denied for table`
```
解决方案:
1. 检查 RLS 策略是否启用
2. 验证用户权限设置
3. 确认策略语法正确
```

### 10.2 数据问题

**问题**: 查询返回空数组
```
解决方案:
1. 检查表是否有数据
2. 验证 RLS 策略允许匿名访问
3. 确认查询语法正确
```

**问题**: 数据更新失败
```
解决方案:
1. 检查用户认证状态
2. 验证更新权限
3. 确认数据类型匹配
```

### 10.3 性能问题

**问题**: 查询速度慢
```sql
-- 添加索引
CREATE INDEX idx_works_created_at_desc ON works(created_at DESC);
CREATE INDEX idx_works_category_id ON works(category_id);
CREATE INDEX idx_works_user_id ON works(user_id);
```

---

## ✅ Supabase 配置完成清单

配置完成后，请确认以下所有项目：

### 📋 基础配置
- [x] Supabase 账号创建完成
- [x] 项目创建成功
- [x] API 配置信息已保存
- [x] 环境变量已配置

### 🗄️ 数据库配置
- [x] 3 个数据表创建成功
- [x] 示例数据插入完成
- [x] 外键关系配置正确
- [x] 索引创建完成

### 🔐 安全配置
- [x] RLS 策略已启用
- [x] 匿名访问权限配置
- [x] API 密钥已配置
- [x] 数据权限验证通过

### 📊 功能测试
- [x] 本地项目能正常连接
- [x] 数据查询功能正常
- [x] 前端显示数据正确
- [x] 错误处理机制有效

---

## 📸 截图要求（作业提交）

为满足作业要求，需要提供以下 3 张截图：

### 🖼️ 截图 1: categories 表
1. 进入 **Table Editor** → 选择 **categories** 表
2. 调整显示所有列和示例数据
3. 包含 Supabase 界面标识
4. 截图保存

### 🖼️ 截图 2: users 表  
1. 选择 **users** 表
2. 显示用户信息和列结构
3. 包含示例用户数据
4. 截图保存

### 🖼️ 截图 3: works 表
1. 选择 **works** 表
2. 显示作品详情和关联数据
3. 包含示例作品信息
4. 截图保存

**截图要求**：
- 清晰显示表结构（列名、数据类型）
- 包含示例数据（至少几条记录）
- 显示 Supabase 界面标识（证明是你的项目）
- 图像清晰可读

---

## 🎉 Supabase 配置完成！

恭喜！你已经成功完成 Supabase 的完整配置：

✅ **账号和项目创建** - 完成  
✅ **数据库表结构** - 完成  
✅ **安全策略配置** - 完成  
✅ **API 连接测试** - 完成  

你的创意作品展示平台现在已经具备了：
- 🗄️ 完整的数据存储
- 🔒 安全的访问控制
- ⚡ 高效的查询性能
- 🔄 实时数据同步

## 📞 需要帮助？

- 📚 [Supabase 官方文档](https://supabase.com/docs)
- 🎥 [Supabase 视频教程](https://www.youtube.com/c/Supabase)
- 💬 [Supabase Discord 社区](https://discord.supabase.com)

---

*最后更新：2024年*
*适用于 Supabase 最新版本*
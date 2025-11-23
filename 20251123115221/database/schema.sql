-- 创意作品展示平台数据库结构
-- 执行顺序：在 Supabase SQL Editor 中按顺序执行以下 SQL 语句

-- 1. 创建分类表 (categories)
CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7), -- 十六进制颜色值，如 #3B82F6
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建用户表 (users)
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL, -- 实际项目中应该使用更安全的密码处理
  full_name VARCHAR(100),
  bio TEXT,
  avatar TEXT, -- 头像 URL
  website TEXT,
  location VARCHAR(100),
  social_links JSONB, -- 社交媒体链接
  skills TEXT[], -- 技能标签数组
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建作品表 (works)
CREATE TABLE works (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT NOT NULL, -- 封面图片 URL
  images TEXT[], -- 作品图片数组
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tags TEXT[], -- 标签数组
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE, -- 是否为精选作品
  status VARCHAR(20) DEFAULT 'published', -- published, draft, archived
  project_url TEXT, -- 项目链接
  source_code_url TEXT, -- 源码链接
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建索引以提高查询性能
CREATE INDEX idx_works_category_id ON works(category_id);
CREATE INDEX idx_works_user_id ON works(user_id);
CREATE INDEX idx_works_created_at ON works(created_at DESC);
CREATE INDEX idx_works_featured ON works(featured);
CREATE INDEX idx_works_status ON works(status);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- 5. 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 为所有表创建更新时间触发器
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. 插入示例数据
-- 插入分类数据
INSERT INTO categories (name, slug, description, icon, color) VALUES
('网页设计', 'web-design', '响应式网页设计、UI/UX 设计作品', 'web', '#3B82F6'),
('移动应用', 'mobile-app', 'iOS、Android 移动应用界面设计', 'mobile', '#10B981'),
('品牌设计', 'branding', 'Logo、VI、品牌视觉识别系统', 'brand', '#F59E0B'),
('插画艺术', 'illustration', '数字插画、手绘作品', 'art', '#EF4444'),
('3D 设计', '3d-design', '3D 建模、渲染、动画作品', '3d', '#8B5CF6'),
('摄影作品', 'photography', '商业摄影、艺术摄影作品', 'photo', '#EC4899');

-- 插入示例用户数据
INSERT INTO users (username, email, password_hash, full_name, bio, avatar, location, skills) VALUES
('designer001', 'designer001@example.com', 'hashed_password_1', '张小明', '资深 UI/UX 设计师，专注于网页和移动应用设计', 'https://picsum.photos/seed/user1/200/200.jpg', '北京', ARRAY['UI设计', 'UX设计', 'Figma', 'Sketch']),
('artist002', 'artist002@example.com', 'hashed_password_2', '李艺术', '自由插画师，擅长数字插画和角色设计', 'https://picsum.photos/seed/user2/200/200.jpg', '上海', ARRAY['插画', '数字绘画', '角色设计', 'Procreate']),
('developer003', 'developer003@example.com', 'hashed_password_3', '王程序', '全栈开发者，热爱创意编程和交互设计', 'https://picsum.photos/seed/user3/200/200.jpg', '深圳', ARRAY['React', 'Node.js', 'Three.js', '创意编程']);

-- 插入示例作品数据
INSERT INTO works (title, description, cover_image, category_id, user_id, tags, featured, project_url) VALUES
('电商平台重设计', '为某知名电商平台进行的全新 UI/UX 设计，提升用户购物体验和转化率', 'https://picsum.photos/seed/work1/800/600.jpg', 
 (SELECT id FROM categories WHERE slug = 'web-design'), 
 (SELECT id FROM users WHERE username = 'designer001'),
 ARRAY['电商', 'UI设计', 'UX设计', '响应式'], TRUE, 'https://example.com/project1'),

('梦幻森林插画系列', '一组充满想象力的森林主题数字插画作品，展现大自然的神奇与美丽', 'https://picsum.photos/seed/work2/800/600.jpg',
 (SELECT id FROM categories WHERE slug = 'illustration'),
 (SELECT id FROM users WHERE username = 'artist002'),
 ARRAY['插画', '森林', '幻想', '数字艺术'], TRUE, 'https://example.com/project2'),

('智能宠物 App 界面', '一款智能宠物管理应用的界面设计，包含宠物健康监测、社交等功能', 'https://picsum.photos/seed/work3/800/600.jpg',
 (SELECT id FROM categories WHERE slug = 'mobile-app'),
 (SELECT id FROM users WHERE username = 'designer001'),
 ARRAY['移动应用', 'UI设计', '宠物', '健康'], FALSE, 'https://example.com/project3'),

('交互式 3D 音乐可视化', '使用 Three.js 创建的交互式音乐可视化项目，将音频转换为视觉艺术', 'https://picsum.photos/seed/work4/800/600.jpg',
 (SELECT id FROM categories WHERE slug = '3d-design'),
 (SELECT id FROM users WHERE username = 'developer003'),
 ARRAY['3D', '音乐可视化', 'Three.js', 'WebGL'], TRUE, 'https://example.com/project4');

-- 8. 启用行级安全策略 (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- 9. 创建安全策略
-- 分类表：所有人可读，只有认证用户可写
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create categories" ON categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 用户表：用户只能查看和修改自己的信息
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 作品表：所有人可读已发布的作品，用户只能管理自己的作品
CREATE POLICY "Published works are viewable by everyone" ON works
    FOR SELECT USING (status = 'published');

CREATE POLICY "Users can manage their own works" ON works
    FOR ALL USING (auth.uid()::text = user_id::text);
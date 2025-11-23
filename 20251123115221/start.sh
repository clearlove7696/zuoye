#!/bin/bash

# 创意作品展示平台 - 快速启动脚本

echo "🎨 创意作品展示平台启动脚本"
echo "=================================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ 依赖安装成功"
    else
        echo "❌ 依赖安装失败"
        exit 1
    fi
else
    echo "✅ 依赖已安装"
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在"
    echo "📝 正在创建 .env 文件..."
    cp .env.example .env
    echo "📝 请编辑 .env 文件，填入你的 Supabase 配置"
    echo "   VITE_SUPABASE_URL=your_supabase_project_url"
    echo "   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
fi

# 检查环境变量是否已配置
if grep -q "your_supabase" .env; then
    echo "⚠️  请先配置 .env 文件中的 Supabase 信息"
    echo "📝 编辑 .env 文件后重新运行此脚本"
    exit 1
fi

echo "🚀 启动开发服务器..."
echo "🌐 应用将在 http://localhost:3000 启动"
echo "⚡ 按 Ctrl+C 停止服务器"
echo ""

# 启动开发服务器
npm run dev
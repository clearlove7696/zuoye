@echo off
REM 创意作品展示平台 - 快速启动脚本 (Windows)

echo 🎨 创意作品展示平台启动脚本
echo ==================================

REM 检查 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js 18+
    pause
    exit /b 1
)

REM 检查 npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm 未安装，请先安装 npm
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js 版本: %NODE_VERSION%
echo ✅ npm 版本: %NPM_VERSION%

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装成功
) else (
    echo ✅ 依赖已安装
)

REM 检查环境变量文件
if not exist ".env" (
    echo ⚠️  .env 文件不存在
    echo 📝 正在创建 .env 文件...
    copy .env.example .env
    echo 📝 请编辑 .env 文件，填入你的 Supabase 配置
    echo    VITE_SUPABASE_URL=your_supabase_project_url
    echo    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
)

REM 检查环境变量是否已配置
findstr /C:"your_supabase" .env >nul
if %errorlevel% equ 0 (
    echo ⚠️  请先配置 .env 文件中的 Supabase 信息
    echo 📝 编辑 .env 文件后重新运行此脚本
    pause
    exit /b 1
)

echo 🚀 启动开发服务器...
echo 🌐 应用将在 http://localhost:3000 启动
echo ⚡ 按 Ctrl+C 停止服务器
echo.

REM 启动开发服务器
npm run dev
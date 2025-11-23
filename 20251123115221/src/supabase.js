import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('请设置 Supabase 环境变量 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库表名常量
export const TABLES = {
  USERS: 'users',
  WORKS: 'works',
  CATEGORIES: 'categories'
}

// 用户相关操作
export const userAPI = {
  // 创建用户
  create: async (userData) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select()
    return { data, error }
  },

  // 获取用户信息
  getById: async (id) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // 更新用户信息
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  }
}

// 作品相关操作
export const worksAPI = {
  // 获取所有作品
  getAll: async (limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from(TABLES.WORKS)
      .select(`
        *,
        users (username, avatar),
        categories (name, slug)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error }
  },

  // 获取单个作品
  getById: async (id) => {
    const { data, error } = await supabase
      .from(TABLES.WORKS)
      .select(`
        *,
        users (username, avatar, bio),
        categories (name, slug)
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  // 创建作品
  create: async (workData) => {
    const { data, error } = await supabase
      .from(TABLES.WORKS)
      .insert([workData])
      .select()
    return { data, error }
  },

  // 更新作品
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from(TABLES.WORKS)
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  // 删除作品
  delete: async (id) => {
    const { data, error } = await supabase
      .from(TABLES.WORKS)
      .delete()
      .eq('id', id)
    return { data, error }
  },

  // 按分类获取作品
  getByCategory: async (categoryId, limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from(TABLES.WORKS)
      .select(`
        *,
        users (username, avatar),
        categories (name, slug)
      `)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error }
  },

  // 获取用户的作品
  getByUser: async (userId, limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from(TABLES.WORKS)
      .select(`
        *,
        categories (name, slug)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error }
  }
}

// 分类相关操作
export const categoriesAPI = {
  // 获取所有分类
  getAll: async () => {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .order('name', { ascending: true })
    return { data, error }
  },

  // 创建分类
  create: async (categoryData) => {
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .insert([categoryData])
      .select()
    return { data, error }
  }
}
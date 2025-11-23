import { useState, useEffect, useCallback } from 'react'
import { supabase, worksAPI, categoriesAPI, userAPI } from '../supabase'

// 自定义 Hook：处理 Supabase 数据操作
export const useSupabaseWorks = () => {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWorks = useCallback(async (categoryId = null, limit = 20, offset = 0) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = categoryId 
        ? await worksAPI.getByCategory(categoryId, limit, offset)
        : await worksAPI.getAll(limit, offset)
        
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      setWorks(result.data || [])
    } catch (err) {
      setError(err.message)
      console.error('获取作品失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWorkById = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await worksAPI.getById(id)
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    } catch (err) {
      setError(err.message)
      console.error('获取作品详情失败:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createWork = useCallback(async (workData) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await worksAPI.create(workData)
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      // 更新本地作品列表
      setWorks(prev => [result.data[0], ...prev])
      return result.data[0]
    } catch (err) {
      setError(err.message)
      console.error('创建作品失败:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateWork = useCallback(async (id, updates) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await worksAPI.update(id, updates)
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      // 更新本地作品列表
      setWorks(prev => 
        prev.map(work => 
          work.id === id ? { ...work, ...result.data[0] } : work
        )
      )
      return result.data[0]
    } catch (err) {
      setError(err.message)
      console.error('更新作品失败:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteWork = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await worksAPI.delete(id)
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      // 从本地作品列表中移除
      setWorks(prev => prev.filter(work => work.id !== id))
      return true
    } catch (err) {
      setError(err.message)
      console.error('删除作品失败:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    works,
    loading,
    error,
    fetchWorks,
    fetchWorkById,
    createWork,
    updateWork,
    deleteWork
  }
}

// 自定义 Hook：处理分类数据
export const useSupabaseCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await categoriesAPI.getAll()
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      setCategories(result.data || [])
    } catch (err) {
      setError(err.message)
      console.error('获取分类失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories
  }
}

// 自定义 Hook：处理用户数据
export const useSupabaseUser = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUser = useCallback(async (userId) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await userAPI.getById(userId)
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      setUser(result.data)
      return result.data
    } catch (err) {
      setError(err.message)
      console.error('获取用户信息失败:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (userId, updates) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await userAPI.update(userId, updates)
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      setUser(result.data[0])
      return result.data[0]
    } catch (err) {
      setError(err.message)
      console.error('更新用户信息失败:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    user,
    loading,
    error,
    fetchUser,
    updateUser
  }
}

// 自定义 Hook：处理认证
export const useSupabaseAuth = () => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取当前会话
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = useCallback(async (email, password, options = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      ...options
    })
    
    return { data, error }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return { data, error }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }, [])

  return {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut
  }
}
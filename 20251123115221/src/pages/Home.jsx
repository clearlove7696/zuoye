import React, { useState, useEffect } from 'react'
import WorkCard from '../components/WorkCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { worksAPI, categoriesAPI } from '../supabase'

const Home = () => {
  const [works, setWorks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    fetchWorks(selectedCategory)
  }, [selectedCategory])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [categoriesResult] = await Promise.all([
        categoriesAPI.getAll()
      ])
      
      if (categoriesResult.error) {
        throw new Error(categoriesResult.error.message)
      }
      
      setCategories(categoriesResult.data || [])
      await fetchWorks(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchWorks = async (categoryId) => {
    try {
      setLoading(true)
      setError(null)
      
      let result
      if (categoryId) {
        result = await worksAPI.getByCategory(categoryId, 12, 0)
      } else {
        result = await worksAPI.getAll(12, 0)
      }
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      setWorks(result.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId)
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">发现创意灵感</h1>
            <p className="hero-subtitle">
              探索来自全球创意设计师的优秀作品，激发你的创作灵感
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary">开始探索</button>
              <button className="btn btn-secondary">分享作品</button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">作品分类</h2>
          <div className="categories-grid">
            <button
              className={`category-card ${!selectedCategory ? 'active' : ''}`}
              onClick={() => handleCategoryChange(null)}
            >
              <div className="category-icon">🎨</div>
              <h3>全部作品</h3>
            </button>
            
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
                style={{ borderColor: category.color }}
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon || '📁'}
                </div>
                <h3>{category.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="featured-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name || '作品展示'
                : '精选作品'
              }
            </h2>
            <button className="btn btn-secondary">查看更多</button>
          </div>

          {loading ? (
            <LoadingSpinner size="large" text="加载作品中..." />
          ) : error ? (
            <div className="error-message">
              <p>❌ 加载失败: {error}</p>
              <button 
                className="btn btn-primary mt-2"
                onClick={() => fetchWorks(selectedCategory)}
              >
                重试
              </button>
            </div>
          ) : works.length === 0 ? (
            <div className="empty-state">
              <p>🎨 暂无作品展示</p>
            </div>
          ) : (
            <div className="works-grid">
              {works.map(work => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
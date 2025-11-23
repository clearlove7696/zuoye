import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import { worksAPI } from '../supabase'

const WorkDetail = () => {
  const { id } = useParams()
  const [work, setWork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (id) {
      fetchWorkDetail(id)
    }
  }, [id])

  const fetchWorkDetail = async (workId) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await worksAPI.getById(workId)
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      setWork(result.data)
      
      // 增加浏览量
      if (result.data) {
        await worksAPI.update(workId, { views: (result.data.views || 0) + 1 })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!work) return
    
    try {
      const newLikes = isLiked ? (work.likes || 0) - 1 : (work.likes || 0) + 1
      await worksAPI.update(work.id, { likes: newLikes })
      setWork({ ...work, likes: newLikes })
      setIsLiked(!isLiked)
    } catch (err) {
      console.error('点赞失败:', err)
    }
  }

  if (loading) {
    return (
      <div className="work-detail-page loading-page">
        <LoadingSpinner size="large" text="加载作品详情..." />
      </div>
    )
  }

  if (error || !work) {
    return (
      <div className="work-detail-page error-page">
        <div className="container">
          <div className="error-message">
            <p>❌ {error || '作品不存在'}</p>
            <Link to="/" className="btn btn-primary mt-2">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="work-detail-page">
      <div className="container">
        {/* 面包屑导航 */}
        <nav className="breadcrumb">
          <Link to="/">首页</Link>
          <span className="separator">/</span>
          <Link to={`/explore?category=${work.categories?.slug}`}>
            {work.categories?.name}
          </Link>
          <span className="separator">/</span>
          <span className="current">{work.title}</span>
        </nav>

        <div className="work-detail-content">
          {/* 左侧：作品图片 */}
          <div className="work-images">
            <div className="main-image">
              <img 
                src={work.cover_image} 
                alt={work.title}
                onError={(e) => {
                  e.target.src = 'https://picsum.photos/seed/fallback/800/600.jpg'
                }}
              />
            </div>
            
            {work.images && work.images.length > 0 && (
              <div className="image-gallery">
                {work.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${work.title} - 图片 ${index + 1}`}
                    className="gallery-image"
                  />
                ))}
              </div>
            )}
          </div>

          {/* 右侧：作品信息 */}
          <div className="work-info">
            <div className="work-header">
              {work.categories && (
                <span 
                  className="category-badge"
                  style={{ backgroundColor: work.categories.color }}
                >
                  {work.categories.name}
                </span>
              )}
              <h1 className="work-title">{work.title}</h1>
            </div>

            <div className="work-description">
              <p>{work.description}</p>
            </div>

            {work.tags && work.tags.length > 0 && (
              <div className="work-tags">
                <h4>标签</h4>
                <div className="tags-list">
                  {work.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="work-stats">
              <div className="stat-item">
                <span className="stat-label">浏览</span>
                <span className="stat-value">{work.views || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">点赞</span>
                <span className="stat-value">{work.likes || 0}</span>
              </div>
            </div>

            <div className="work-actions">
              <button 
                className={`btn ${isLiked ? 'btn-liked' : 'btn-primary'}`}
                onClick={handleLike}
              >
                {isLiked ? '❤️ 已点赞' : '🤍 点赞'}
              </button>
              
              <button className="btn btn-secondary">
                📤 分享
              </button>
              
              {work.project_url && (
                <a 
                  href={work.project_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  🔗 查看项目
                </a>
              )}
              
              {work.source_code_url && (
                <a 
                  href={work.source_code_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  💻 源码
                </a>
              )}
            </div>

            {/* 作者信息 */}
            {work.users && (
              <div className="author-card">
                <div className="author-header">
                  <img 
                    src={work.users.avatar || 'https://picsum.photos/seed/avatar/60/60.jpg'} 
                    alt={work.users.username}
                    className="author-avatar-large"
                  />
                  <div className="author-info">
                    <h3>{work.users.username}</h3>
                    <p>{work.users.bio || '创意设计师'}</p>
                  </div>
                </div>
                <Link to={`/profile/${work.users.id}`} className="btn btn-secondary">
                  查看主页
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkDetail
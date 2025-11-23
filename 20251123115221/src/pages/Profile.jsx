import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import WorkCard from '../components/WorkCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { worksAPI, userAPI } from '../supabase'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('works')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    // 模拟用户登录状态，实际项目中应该从认证系统获取
    const mockUser = {
      id: 'mock-user-id',
      username: 'designer001',
      email: 'designer001@example.com',
      full_name: '张小明',
      bio: '资深 UI/UX 设计师，专注于网页和移动应用设计',
      avatar: 'https://picsum.photos/seed/user1/200/200.jpg',
      location: '北京',
      website: 'https://designer-portfolio.example.com',
      skills: ['UI设计', 'UX设计', 'Figma', 'Sketch']
    }
    
    setUser(mockUser)
    setEditForm(mockUser)
    fetchUserWorks(mockUser.id)
  }, [])

  const fetchUserWorks = async (userId) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await worksAPI.getByUser(userId, 12, 0)
      
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      setEditForm(user)
    }
  }

  const handleFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    
    try {
      // 这里应该调用用户 API 更新用户信息
      // const result = await userAPI.update(user.id, editForm)
      
      // 模拟更新成功
      setUser(editForm)
      setIsEditing(false)
      
      // 显示成功消息
      alert('个人资料更新成功！')
    } catch (err) {
      console.error('更新失败:', err)
      alert('更新失败，请重试')
    }
  }

  if (loading && !user) {
    return (
      <div className="profile-page loading-page">
        <LoadingSpinner size="large" text="加载个人资料..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-page error-page">
        <div className="container">
          <div className="error-message">
            <p>❌ {error}</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => window.location.reload()}
            >
              重试
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* 个人资料头部 */}
        <section className="profile-header">
          <div className="profile-card">
            <div className="profile-avatar">
              <img 
                src={user?.avatar || 'https://picsum.photos/seed/avatar/120/120.jpg'} 
                alt={user?.username}
              />
            </div>
            
            <div className="profile-info">
              <div className="profile-name-section">
                <h1>{user?.full_name || user?.username}</h1>
                <p className="username">@{user?.username}</p>
              </div>
              
              {user?.bio && <p className="bio">{user.bio}</p>}
              
              <div className="profile-meta">
                {user?.location && (
                  <span className="meta-item">📍 {user.location}</span>
                )}
                {user?.website && (
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="meta-item"
                  >
                    🔗 {user.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
              
              {user?.skills && user.skills.length > 0 && (
                <div className="skills">
                  <h4>技能</h4>
                  <div className="skills-list">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{works.length}</span>
                  <span className="stat-label">作品</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    {works.reduce((total, work) => total + (work.views || 0), 0)}
                  </span>
                  <span className="stat-label">浏览</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    {works.reduce((total, work) => total + (work.likes || 0), 0)}
                  </span>
                  <span className="stat-label">点赞</span>
                </div>
              </div>
              
              <button 
                className="btn btn-primary"
                onClick={handleEditToggle}
              >
                {isEditing ? '取消编辑' : '编辑资料'}
              </button>
            </div>
          </div>
        </section>

        {/* 编辑表单 */}
        {isEditing && (
          <section className="edit-profile-section">
            <div className="card">
              <h3>编辑个人资料</h3>
              <form onSubmit={handleSaveProfile} className="edit-form">
                <div className="form-group">
                  <label className="form-label">姓名</label>
                  <input
                    type="text"
                    name="full_name"
                    className="form-input"
                    value={editForm.full_name || ''}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">个人简介</label>
                  <textarea
                    name="bio"
                    className="form-textarea"
                    value={editForm.bio || ''}
                    onChange={handleFormChange}
                    rows={4}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">位置</label>
                  <input
                    type="text"
                    name="location"
                    className="form-input"
                    value={editForm.location || ''}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">网站</label>
                  <input
                    type="url"
                    name="website"
                    className="form-input"
                    value={editForm.website || ''}
                    onChange={handleFormChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">技能（用逗号分隔）</label>
                  <input
                    type="text"
                    name="skills"
                    className="form-input"
                    value={editForm.skills ? editForm.skills.join(', ') : ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    保存更改
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleEditToggle}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* 作品和内容标签页 */}
        <section className="profile-content">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'works' ? 'active' : ''}`}
              onClick={() => setActiveTab('works')}
            >
              我的作品 ({works.length})
            </button>
            <button 
              className={`tab ${activeTab === 'drafts' ? 'active' : ''}`}
              onClick={() => setActiveTab('drafts')}
            >
              草稿箱
            </button>
            <button 
              className={`tab ${activeTab === 'likes' ? 'active' : ''}`}
              onClick={() => setActiveTab('likes')}
            >
              收藏夹
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'works' && (
              <div className="works-section">
                <div className="section-header">
                  <h3>我的作品</h3>
                  <Link to="/upload" className="btn btn-primary">
                    + 上传作品
                  </Link>
                </div>
                
                {loading ? (
                  <LoadingSpinner size="large" text="加载作品中..." />
                ) : works.length === 0 ? (
                  <div className="empty-state">
                    <p>🎨 还没有上传作品</p>
                    <Link to="/upload" className="btn btn-primary mt-2">
                      上传第一个作品
                    </Link>
                  </div>
                ) : (
                  <div className="works-grid">
                    {works.map(work => (
                      <WorkCard key={work.id} work={work} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'drafts' && (
              <div className="drafts-section">
                <div className="empty-state">
                  <p>📝 草稿箱为空</p>
                </div>
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="likes-section">
                <div className="empty-state">
                  <p>❤️ 还没有收藏的作品</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile
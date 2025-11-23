import React from 'react'
import { Link } from 'react-router-dom'

const WorkCard = ({ work }) => {
  if (!work) return null

  return (
    <div className="work-card">
      <Link to={`/work/${work.id}`} className="work-link">
        <div className="work-image">
          <img 
            src={work.cover_image} 
            alt={work.title}
            onError={(e) => {
              e.target.src = 'https://picsum.photos/seed/fallback/400/300.jpg'
            }}
          />
        </div>
        
        <div className="work-content">
          <h3 className="work-title">{work.title}</h3>
          <p className="work-description">{work.description}</p>
          
          <div className="work-meta">
            <div className="author-info">
              <img 
                src={work.users?.avatar || 'https://picsum.photos/seed/avatar/40/40.jpg'} 
                alt={work.users?.username}
                className="author-avatar"
              />
              <span className="author-name">{work.users?.username}</span>
            </div>
            
            <div className="work-stats">
              <span className="views">👁 {work.views || 0}</span>
              <span className="likes">❤️ {work.likes || 0}</span>
            </div>
          </div>
          
          {work.categories && (
            <div className="work-category">
              <span className="category-tag" style={{ 
                backgroundColor: work.categories.color || '#3B82F6' 
              }}>
                {work.categories.name}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

export default WorkCard
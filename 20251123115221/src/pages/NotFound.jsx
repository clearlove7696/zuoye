import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-illustration">
            <div className="error-code">404</div>
            <div className="error-illustration">🎨</div>
          </div>
          
          <h1 className="not-found-title">页面未找到</h1>
          <p className="not-found-description">
            抱歉，您访问的页面不存在或已被移动。
          </p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              返回首页
            </Link>
            <Link to="/explore" className="btn btn-secondary">
              浏览作品
            </Link>
          </div>
          
          <div className="suggestions">
            <h3>您可能想要：</h3>
            <ul>
              <li><Link to="/">浏览首页</Link></li>
              <li><Link to="/categories">查看分类</Link></li>
              <li><Link to="/profile">访问个人中心</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
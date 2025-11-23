import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>创意展示平台</h3>
            <p>发现和分享创意作品的社区</p>
          </div>
          
          <div className="footer-section">
            <h4>快速链接</h4>
            <ul>
              <li><a href="/">首页</a></li>
              <li><a href="/explore">探索作品</a></li>
              <li><a href="/categories">分类浏览</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>关于</h4>
            <ul>
              <li><a href="/about">关于我们</a></li>
              <li><a href="/contact">联系我们</a></li>
              <li><a href="/privacy">隐私政策</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 创意展示平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">
            <h1>创意展示</h1>
          </Link>
          
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="切换菜单"
          >
            <span className="hamburger"></span>
          </button>

          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                首页
              </Link>
            </li>
            <li>
              <Link to="/explore" onClick={() => setIsMenuOpen(false)}>
                探索
              </Link>
            </li>
            <li>
              <Link to="/categories" onClick={() => setIsMenuOpen(false)}>
                分类
              </Link>
            </li>
            <li>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                个人中心
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
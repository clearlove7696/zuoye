import React from 'react'

const LoadingSpinner = ({ size = 'medium', text = '加载中...' }) => {
  const sizeClasses = {
    small: '16px',
    medium: '24px',
    large: '32px'
  }

  return (
    <div className="loading-container">
      <div 
        className="loading-spinner"
        style={{ width: sizeClasses[size], height: sizeClasses[size] }}
      ></div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  )
}

export default LoadingSpinner
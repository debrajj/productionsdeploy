import React from 'react'
import { Logo } from './Logo'

export const BeforeLogin: React.FC = () => {
  return (
    <div className="before-login">
      <div className="login-brand">
        <Logo />
        <div className="login-tagline">
          <h2 style={{ 
            color: '#2D3748', 
            fontSize: '18px', 
            fontWeight: '500', 
            marginTop: '16px',
            textAlign: 'center'
          }}>
            Premium Sports Nutrition
          </h2>
          <p style={{ 
            color: '#4A5568', 
            fontSize: '14px', 
            marginTop: '8px',
            textAlign: 'center'
          }}>
            Admin Dashboard
          </p>
        </div>
      </div>
    </div>
  )
}
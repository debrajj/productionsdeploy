import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '../../payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="home">
      <div className="content">
        <div className="logo">
          <h1>O2 NUTRITION</h1>
        </div>
        {user && <h2>Welcome, {user.email?.split('@')[0]}</h2>}
        <div className="links">
          <a className="admin" href={payloadConfig.routes.admin}>
            Admin Panel
          </a>
          <a className="frontend" href={process.env.FRONTEND_URL} target="_blank">
            Store
          </a>
        </div>
      </div>
    </div>
  )
}

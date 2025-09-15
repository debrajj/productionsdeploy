'use client'
import React from 'react'
import { DefaultNav } from '@payloadcms/ui'

export const CustomNav: React.FC = () => {
  return (
    <div>
      <style jsx global>{`
        .nav__group-label {
          display: none !important;
        }
        .nav__group {
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .nav__group:first-child .nav__group-label {
          display: none !important;
        }
      `}</style>
      <DefaultNav />
    </div>
  )
}
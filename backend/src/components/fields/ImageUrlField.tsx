'use client'

import React, { useState } from 'react'
import { TextInput, useField } from '@payloadcms/ui'

export const ImageUrlField: React.FC = () => {
  const { value, setValue } = useField<string>({ path: 'imageUrl' })
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    message: string
  } | null>(null)

  const validateUrl = async (url: string) => {
    if (!url) {
      setValidationResult(null)
      return
    }

    setIsValidating(true)
    try {
      const response = await fetch('/api/validate-image-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const result = await response.json()

      if (response.ok) {
        setValidationResult({
          valid: true,
          message: `Valid image (${result.contentType})${result.size ? ` - ${Math.round(result.size / 1024)}KB` : ''}`,
        })
      } else {
        setValidationResult({
          valid: false,
          message: result.error || 'Invalid image URL',
        })
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        message: 'Failed to validate URL',
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleChange = (newValue: string) => {
    setValue(newValue)
    if (newValue !== value) {
      setValidationResult(null)
      // Debounce validation
      const timeoutId = setTimeout(() => {
        validateUrl(newValue)
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }

  return (
    <div>
      <TextInput
        value={value || ''}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
      />
      
      {isValidating && (
        <div style={{ marginTop: '8px', color: '#666' }}>
          Validating image URL...
        </div>
      )}
      
      {validationResult && (
        <div
          style={{
            marginTop: '8px',
            color: validationResult.valid ? '#22c55e' : '#ef4444',
            fontSize: '14px',
          }}
        >
          {validationResult.message}
        </div>
      )}
      
      {value && validationResult?.valid && (
        <div style={{ marginTop: '8px' }}>
          <img
            src={value}
            alt="Preview"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'contain',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
            onError={() => {
              setValidationResult({
                valid: false,
                message: 'Failed to load image preview',
              })
            }}
          />
        </div>
      )}
    </div>
  )
}
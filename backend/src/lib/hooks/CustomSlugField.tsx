'use client'

import { TextField, useField } from '@payloadcms/ui'
import { UIFieldServerComponent, UIFieldServerProps } from 'payload'
import { useEffect } from 'react'

const generateSlug = (text: string): string => {
  if (!text) return ''

  const steps = {
    lowercase: text.toString().toLowerCase(),
    normalized: text.toString().toLowerCase().normalize('NFD'),
    final: text
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[''""\[\]]/g, '')
      .replace(/[!?.,;:]/g, '')
      .replace(/\+/g, '-plus-')
      .replace(/[@#$%^*()=_+\[\]{}<>\\|]/g, '')
      .replace(/[–—]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/[^a-z0-9-]/g, ''),
  }

  return steps.final
}

const CustomSlugField: UIFieldServerComponent = (_props: UIFieldServerProps) => {
  const { value: title } = useField<string>({ path: 'name' })
  const { value: id } = useField<string>({ path: 'createdAt' })
  const { setValue } = useField({ path: 'slug' })

  useEffect(() => {
    if (!id && title) {
      const generatedSlug = generateSlug(title)
      setValue(generatedSlug)
    }
  }, [title, id, setValue])

  return (
    <TextField
      path="slug"
      readOnly={id ? true : false}
      field={{
        type: 'text',
        name: 'slug',
        label: 'Slug',
        required: true,
        unique: true,
        admin: {
          rtl: false,
          position: 'sidebar',
          autoComplete: 'off',
          placeholder: id ? 'Contact dev team' : '',
        },
      }}
    />
  )
}

export default CustomSlugField

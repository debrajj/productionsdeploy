import { FieldHook } from 'payload'

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
      .replace(/[@#$%^*()=_+[\]{}<>\\|]/g, '')
      .replace(/[–—]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/[^a-z0-9-]/g, ''),
  }

  return steps.final
}
export const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    try {
      if (!fallback) {
        throw new Error('Fallback field name is required')
      }

      // If there's a value directly (e.g., title), generate a slug from it
      if (typeof value === 'string') {
        return generateSlug(value)
      }

      // If no direct value, use the fallback field (e.g., "title") to generate the slug
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]
      if (fallbackData && typeof fallbackData === 'string') {
        return generateSlug(fallbackData)
      }

      // If neither the value nor the fallback data is valid, log a warning and return the original value
      console.warn('No valid string found for slug formatting')
      return value
    } catch (error) {
      console.error('Error in formatSlug:', error)
      throw new Error(`Failed to format slug: ${(error as Error).message}`)
    }
  }
export const slugField = ({
  category,
  size,
  title = 'name',
}: {
  category: string
  size: string
  title?: string
}) => {
  return [
    {
      type: 'ui',
      name: 'slug_ui',
      admin: {
        components: {
          Field: {
            path: 'lib/hooks/CustomSlugField',
            serverProps: {
              path: 'name',
              category: category,
            },
          },
        },
        width: size,
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: false,
      admin: {
        // hidden: true,
        readOnly: true,
        width: size,
      },
      hooks: {
        beforeValidate: [formatSlug(title)],
      },
    },
  ]
}

import type { CollectionConfig } from 'payload'

export const BulkImport: CollectionConfig = {
  slug: 'bulk-import',
  admin: {
    useAsTitle: 'fileName',
    description: 'Upload Excel files to bulk import products. Download template first.',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'fileName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name for this import batch',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload Excel file (.xlsx, .xls, .csv)',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'successCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of products successfully imported',
      },
    },
    {
      name: 'errorCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of errors during import',
      },
    },
    {
      name: 'errorMessages',
      type: 'textarea',
      admin: {
        readOnly: true,
        description: 'Import error messages',
      },
    },
    {
      name: 'instructions',
      type: 'textarea',
      defaultValue: '📥 Download Template: /api/download-template\n\nRequired: name, price, category, brand\nOptional: variants, nutrition, images',
      admin: {
        readOnly: true,
        description: 'Download template at /api/download-template before uploading',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create' && doc.file) {
          try {
            // Get file details
            const media = await req.payload.findByID({
              collection: 'media',
              id: doc.file,
            })

            if (media && media.filename) {
              // Update status to processing
              await req.payload.update({
                collection: 'bulk-import',
                id: doc.id,
                data: { status: 'processing' },
              })

              // Import products from the uploaded file
              const { importProductsFromExcel } = await import('../../lib/bulk-import')
              const filePath = `./media/${media.filename}`
              const results = await importProductsFromExcel(req.payload, filePath, true)

              // Update with results
              await req.payload.update({
                collection: 'bulk-import',
                id: doc.id,
                data: {
                  status: 'completed',
                  successCount: results.success,
                  errorCount: results.errors.length,
                  errorMessages: results.errors.join('\n'),
                },
              })
            }
          } catch (error) {
            // Update with error
            await req.payload.update({
              collection: 'bulk-import',
              id: doc.id,
              data: {
                status: 'failed',
                successCount: 0,
                errorCount: 1,
                errorMessages: error.message,
              },
            })
          }
        }
      },
    ],
  },
}
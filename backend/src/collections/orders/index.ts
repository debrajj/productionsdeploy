import type { CollectionConfig } from 'payload'
import OrderView from '../../components/OrderView'

export const Orders: CollectionConfig = {
  slug: 'orders',
  lockDocuments: false,
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerEmail', 'shippingAddress', 'status', 'total', 'createdAt'],
    group: 'E-commerce',
    description: '📋 Customer Orders - Clean printable format',
    components: {
      views: {
        Edit: OrderView,
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      // Admin can read all orders
      if (user) return true;
      return false;
    },
    create: () => true, // Allow public order creation
    update: ({ req: { user } }) => {
      // Only admin can update orders
      if (user) return true;
      return false;
    },
    delete: ({ req: { user } }) => {
      // Only admin can delete orders
      if (user) return true;
      return false;
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Generate items summary
        if (data.items && Array.isArray(data.items)) {
          data.itemsSummary = data.items.map((item, index) => 
            `Item ${index + 1}:\nID: ${item.id}\nName: ${item.name}\nPrice: ₹${item.price}\nQuantity: ${item.quantity}\nTotal: ₹${item.price * item.quantity}`
          ).join('\n\n')
        }
        
        // Generate order summary
        const deliveryLabels = {
          standard: 'Standard Delivery',
          express: 'Express Delivery', 
          overnight: 'Overnight Delivery'
        }
        const paymentLabels = {
          CARD: 'Card Payment',
          UPI: 'UPI Payment',
          COD: 'Cash on Delivery'
        }
        
        data.orderSummary = `Subtotal: ₹${data.subtotal || 0}\nShipping: ₹${data.shippingCost || 0}\nTotal: ₹${data.total || 0}\n\nDelivery: ${deliveryLabels[data.deliveryMethod] || data.deliveryMethod}\nPayment: ${paymentLabels[data.paymentMethod] || data.paymentMethod}`
        
        return data
      },
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique order number (e.g., ORD-2024-001)',
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Customer email',
      },
    },

    {
      name: 'itemsSummary',
      type: 'textarea',
      admin: {
        description: '📦 ORDER ITEMS - Summary of all items',
        readOnly: true,
        rows: 6,
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: {
        description: 'Order items (detailed)',
        hidden: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
      ],
    },
    {
      name: 'orderSummary',
      type: 'textarea',
      admin: {
        description: '💰 ORDER SUMMARY - Pricing and payment details',
        readOnly: true,
        rows: 6,
      },
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'shippingCost',
      type: 'number',
      min: 0,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Standard Delivery', value: 'standard' },
        { label: 'Express Delivery', value: 'express' },
        { label: 'Overnight Delivery', value: 'overnight' },
      ],
      admin: {
        hidden: true,
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Card', value: 'CARD' },
        { label: 'UPI', value: 'UPI' },
        { label: 'Cash on Delivery', value: 'COD' },
      ],
      admin: {
        hidden: true,
      },
    },

    {
      name: 'shippingAddress',
      type: 'textarea',
      required: true,
      admin: {
        description: '📍 SHIPPING ADDRESS - Complete delivery address',
        placeholder: 'Name\nAddress\nCity, State - PIN\nPhone: Number',
        rows: 4,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Order notes or special instructions',
      },
    },
    {
      name: 'tracking',
      type: 'group',
      admin: {
        description: '📦 TRACKING INFO - Add tracking details for customer',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Processing', value: 'processing' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'In Transit', value: 'in_transit' },
            { label: 'Out for Delivery', value: 'out_for_delivery' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Returned', value: 'returned' },
            { label: 'Refunded', value: 'refunded' },
          ],
          admin: {
            description: '📋 Current order status',
          },
        },
        {
          name: 'trackingNumber',
          type: 'text',
          admin: {
            description: '🔢 Enter tracking number here',
            placeholder: 'e.g., 1234567890',
          },
        },
        {
          name: 'carrier',
          type: 'select',
          options: [
            { label: 'Blue Dart', value: 'bluedart' },
            { label: 'Delhivery', value: 'delhivery' },
            { label: 'DTDC', value: 'dtdc' },
            { label: 'Ekart', value: 'ekart' },
            { label: 'FedEx', value: 'fedex' },
            { label: 'India Post', value: 'indiapost' },
            { label: 'Other', value: 'other' },
          ],
          admin: {
            description: '🚚 Select shipping company',
          },
        },
        {
          name: 'shippedDate',
          type: 'date',
          admin: {
            description: '📅 When was it shipped?',
          },
        },
        {
          name: 'estimatedDelivery',
          type: 'date',
          admin: {
            description: '📅 Expected delivery date',
          },
        },
      ],
    },
  ],
}
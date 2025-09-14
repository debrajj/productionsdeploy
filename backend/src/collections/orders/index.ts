import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerEmail', 'status', 'total', 'createdAt'],
    group: 'E-commerce',
    description: '📋 Customer Orders',
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
      // Only authenticated admin users can delete orders
      console.log('Delete access check - User:', user ? 'authenticated' : 'not authenticated');
      if (user) {
        console.log('User email:', user.email);
        return true;
      }
      console.log('Delete access denied - no user');
      return false;
    },
  },

  hooks: {
    beforeChange: [
      ({ data }) => {
        // Generate items summary with variations
        if (data.items && data.items.length > 0) {
          data.itemsSummary = data.items.map(item => {
            let itemText = item.name || 'Product';
            
            // Add flavor if available
            if (item.flavor) {
              itemText += ` (${item.flavor})`;
            }
            
            // Add weight if available
            if (item.weight) {
              itemText += ` - ${item.weight}`;
            }
            
            // Add any other variant info
            if (item.variant && item.variant !== item.flavor && item.variant !== item.weight) {
              itemText += ` [${item.variant}]`;
            }
            
            return `${itemText} x${item.quantity} - ₹${item.price}`;
          }).join('\n');
        }
        
        // Generate detailed order summary with price breakdown
        const subtotal = data.subtotal || 0;
        const shipping = data.shippingCost || 0;
        const discount = data.discountAmount || data.discount || 0;
        const total = data.total || 0;
        const couponCode = data.couponCode;
        const itemCount = data.items ? data.items.length : 0;
        
        let orderSummary = `💰 ORDER SUMMARY\n`;
        orderSummary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        orderSummary += `Subtotal (${itemCount} items): ₹${subtotal.toLocaleString()}\n`;
        
        if (couponCode && discount > 0) {
          orderSummary += `Discount (${couponCode}): -₹${discount.toLocaleString()}\n`;
          orderSummary += `After Discount: ₹${(subtotal - discount).toLocaleString()}\n`;
        }
        
        if (shipping > 0) {
          orderSummary += `Shipping: ₹${shipping.toLocaleString()}\n`;
        } else {
          orderSummary += `Shipping: FREE\n`;
        }
        
        orderSummary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        orderSummary += `TOTAL: ₹${total.toLocaleString()}\n`;
        orderSummary += `Payment Method: ${data.paymentMethod || 'N/A'}\n`;
        
        data.orderSummary = orderSummary;
        
        return data;
      },
    ],
    beforeDelete: [
      ({ req, id }) => {
        console.log('🗑️ Attempting to delete order with ID:', id);
        console.log('🔐 User:', req.user ? req.user.email : 'No user');
        return true;
      },
    ],
    afterDelete: [
      ({ req, id, doc }) => {
        console.log('✅ Successfully deleted order:', doc.orderNumber);
      },
    ],
  },

  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
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
      name: 'userId',
      type: 'text',
      admin: {
        description: 'User ID for linking orders to users',
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
        {
          name: 'flavor',
          type: 'text',
          admin: {
            description: 'Product flavor (e.g., mango, chocolate)',
          },
        },
        {
          name: 'weight',
          type: 'text',
          admin: {
            description: 'Product weight (e.g., 250gm, 1kg)',
          },
        },
        {
          name: 'variant',
          type: 'text',
          admin: {
            description: 'Other product variations',
          },
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
      name: 'couponCode',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'discount',
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
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Please use POST to interact with the chatbot.' },
    { status: 405 }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { message, email } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    
    // Handle subscription if email is provided
    if (email) {
      try {
        await payload.create({
          collection: 'subscribers',
          data: {
            email,
            status: 'active'
          }
        })
      } catch (error) {
        // Ignore duplicate email errors
        if (!error.message.includes('E11000 duplicate key error')) {
          console.error('Error subscribing email:', error)
        }
      }
    }

    // Get product information for context
    let productContext = ''
    try {
      const result = await payload.find({
        collection: 'products',
        limit: 20,
        sort: '-createdAt'
      })
      const products = result.docs.map(p => {
        return `Product: ${p.name}
Price: ₹${p.price}
Brand: ${p.customBrand || p.brand}
Category: ${p.customCategory || p.category}
Description: ${p.description || 'Premium supplement'}
---`
      })
      productContext = products.join('\n')
    } catch (error) {
      console.error('Error fetching products:', error)
    }

    // Call OpenRouter API
    console.log('Calling OpenRouter API with key:', process.env.CHATBOT_API_KEY ? 'Key present' : 'Key missing')
    
    const openaiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHATBOT_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.BACKEND_URL,
        'X-Title': 'O2 Nutrition Chatbot'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful customer service assistant for O2 Nutrition, a fitness supplement store. Help customers find products, provide recommendations, and answer questions about supplements and nutrition.

Our Product Database:
${productContext}

When customers ask about products:
- Search through the product list above
- Recommend specific products with names and prices
- Mention brand, category, and key benefits
- Be specific about product details

Keep responses helpful and under 150 words.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    })

    console.log('OpenRouter response status:', openaiResponse.status)
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenRouter API error:', errorText)
      throw new Error(`OpenRouter API request failed: ${openaiResponse.status}`)
    }

    const aiData = await openaiResponse.json()
    const aiMessage = aiData.choices[0]?.message?.content || 'I apologize, but I\'m having trouble processing your request right now.'

    return NextResponse.json({ 
      message: aiMessage
    })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process your message',
        message: 'Sorry, I\'m having trouble connecting right now. Please try again later.'
      },
      { status: 500 }
    )
  }
}
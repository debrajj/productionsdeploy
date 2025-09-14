const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT

export interface ChatMessage {
  message: string
}

export interface ChatResponse {
  message: string
  error?: string
}

export const chatbotService = {
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      return data
    } catch (error) {
      console.error('Chatbot service error:', error)
      throw error
    }
  }
}
export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
  designId: number;
  createdAt: string;
  isUsed: boolean;
  usedAt?: string;
  remainingBalance: number;
}

export class GiftCardService {
  private static readonly STORAGE_KEY = 'o2nutrition-giftcards';

  // Generate unique 12-character code (mix of numbers and letters)
  static generateGiftCardCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    // Ensure we have a mix of letters and numbers
    for (let i = 0; i < 12; i++) {
      if (i % 3 === 0) {
        // Every 3rd character is a number
        code += Math.floor(Math.random() * 10).toString();
      } else {
        // Other characters are letters
        code += chars.charAt(Math.floor(Math.random() * 26));
      }
    }
    
    return code;
  }

  // Generate unique ID
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Create new gift card
  static createGiftCard(giftCardData: Omit<GiftCard, 'id' | 'code' | 'createdAt' | 'isUsed' | 'remainingBalance'>): GiftCard {
    const giftCard: GiftCard = {
      id: this.generateId(),
      code: this.generateGiftCardCode(),
      createdAt: new Date().toISOString(),
      isUsed: false,
      remainingBalance: giftCardData.amount,
      ...giftCardData
    };

    // Save to localStorage (in a real app, this would be sent to a backend)
    this.saveGiftCard(giftCard);
    
    return giftCard;
  }

  // Save gift card to localStorage
  static saveGiftCard(giftCard: GiftCard): void {
    const existingGiftCards = this.getAllGiftCards();
    const updatedGiftCards = [...existingGiftCards, giftCard];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedGiftCards));
  }

  // Get all gift cards from localStorage
  static getAllGiftCards(): GiftCard[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Find gift card by code
  static findGiftCardByCode(code: string): GiftCard | null {
    const giftCards = this.getAllGiftCards();
    return giftCards.find(gc => gc.code === code) || null;
  }

  // Use gift card (reduce balance)
  static useGiftCard(code: string, amount: number): { success: boolean; remainingBalance?: number; error?: string } {
    const giftCards = this.getAllGiftCards();
    const giftCardIndex = giftCards.findIndex(gc => gc.code === code);
    
    if (giftCardIndex === -1) {
      return { success: false, error: 'Gift card not found' };
    }

    const giftCard = giftCards[giftCardIndex];
    
    if (giftCard.remainingBalance < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    // Update gift card
    giftCard.remainingBalance -= amount;
    if (giftCard.remainingBalance === 0) {
      giftCard.isUsed = true;
      giftCard.usedAt = new Date().toISOString();
    }

    // Save updated gift cards
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(giftCards));
    
    return { success: true, remainingBalance: giftCard.remainingBalance };
  }

  // Validate gift card code format
  static isValidCodeFormat(code: string): boolean {
    return /^[A-Z0-9]{12}$/.test(code);
  }
}

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GiftCard, GiftCardService } from '@/services/giftCardService';

interface GiftCardState {
  giftCards: GiftCard[];
  currentGiftCard: GiftCard | null;
  isLoading: boolean;
  error: string | null;
}

type GiftCardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_GIFT_CARDS'; payload: GiftCard[] }
  | { type: 'ADD_GIFT_CARD'; payload: GiftCard }
  | { type: 'SET_CURRENT_GIFT_CARD'; payload: GiftCard | null }
  | { type: 'UPDATE_GIFT_CARD'; payload: GiftCard };

const initialState: GiftCardState = {
  giftCards: [],
  currentGiftCard: null,
  isLoading: false,
  error: null,
};

function giftCardReducer(state: GiftCardState, action: GiftCardAction): GiftCardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_GIFT_CARDS':
      return { ...state, giftCards: action.payload };
    case 'ADD_GIFT_CARD':
      return { ...state, giftCards: [...state.giftCards, action.payload] };
    case 'SET_CURRENT_GIFT_CARD':
      return { ...state, currentGiftCard: action.payload };
    case 'UPDATE_GIFT_CARD':
      return {
        ...state,
        giftCards: state.giftCards.map(gc =>
          gc.id === action.payload.id ? action.payload : gc
        ),
      };
    default:
      return state;
  }
}

interface GiftCardContextType {
  state: GiftCardState;
  createGiftCard: (giftCardData: Omit<GiftCard, 'id' | 'code' | 'createdAt' | 'isUsed' | 'remainingBalance'>) => Promise<GiftCard>;
  loadGiftCards: () => void;
  findGiftCardByCode: (code: string) => GiftCard | null;
  useGiftCard: (code: string, amount: number) => Promise<{ success: boolean; remainingBalance?: number; error?: string }>;
  addGiftCardToCart: (giftCard: GiftCard) => void;
}

const GiftCardContext = createContext<GiftCardContextType | undefined>(undefined);

export function GiftCardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(giftCardReducer, initialState);

  const createGiftCard = async (giftCardData: Omit<GiftCard, 'id' | 'code' | 'createdAt' | 'isUsed' | 'remainingBalance'>): Promise<GiftCard> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const newGiftCard = GiftCardService.createGiftCard(giftCardData);
      dispatch({ type: 'ADD_GIFT_CARD', payload: newGiftCard });
      dispatch({ type: 'SET_CURRENT_GIFT_CARD', payload: newGiftCard });
      return newGiftCard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create gift card';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadGiftCards = () => {
    const giftCards = GiftCardService.getAllGiftCards();
    dispatch({ type: 'SET_GIFT_CARDS', payload: giftCards });
  };

  const findGiftCardByCode = (code: string): GiftCard | null => {
    return GiftCardService.findGiftCardByCode(code);
  };

  const useGiftCard = async (code: string, amount: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = GiftCardService.useGiftCard(code, amount);
      if (result.success) {
        // Reload gift cards to reflect updated balances
        loadGiftCards();
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to use gift card';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addGiftCardToCart = (giftCard: GiftCard) => {
    // This will integrate with the existing cart context
    // For now, we'll create a special cart item for gift cards
    const giftCardItem = {
      id: giftCard.id,
      name: `Gift Card - ₹${giftCard.amount}`,
      price: giftCard.amount,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
      category: 'Gift Cards',
      brand: 'O2 Nutrition',
      isGiftCard: true,
      giftCardData: giftCard
    };

    // We'll need to integrate this with the existing CartContext
    // For now, we'll dispatch an event that the cart can listen to
    window.dispatchEvent(new CustomEvent('addGiftCardToCart', { 
      detail: giftCardItem 
    }));
  };

  return (
    <GiftCardContext.Provider
      value={{
        state,
        createGiftCard,
        loadGiftCards,
        findGiftCardByCode,
        useGiftCard,
        addGiftCardToCart,
      }}
    >
      {children}
    </GiftCardContext.Provider>
  );
}

export function useGiftCard() {
  const context = useContext(GiftCardContext);
  if (context === undefined) {
    throw new Error('useGiftCard must be used within a GiftCardProvider');
  }
  return context;
}

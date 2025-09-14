import React, { createContext, useContext, useEffect, useReducer } from "react";
import { toast } from "@/components/ui/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  // Variant details for both simple and complex variants
  selectedFlavor?: string;
  selectedWeight?: string;
  variantId?: string; // For complex variants with individual pricing
  variantType?: 'simple' | 'complex'; // Track which variant system is used
  isGiftCard?: boolean;
  giftCardData?: any;
  // Add upsell tracking
  isUpsell?: boolean;
  upsellDiscount?: number;
  relatedProductId?: string;
  originalPrice?: number; // Store original price before discount
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity"> & { quantity?: number };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }
  | {
      type: "APPLY_UPSELL_DISCOUNT";
      payload: {
        productId: string;
        discountPercentage: number;
        relatedProductId: string;
      };
    }
  | {
      type: "REMOVE_UPSELL_DISCOUNT";
      payload: { productId: string; relatedProductId: string };
    };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  applyUpsellDiscount: (
    productId: string,
    discountPercentage: number,
    relatedProductId: string
  ) => void;
  removeUpsellDiscount: (productId: string, relatedProductId: string) => void;
} | null>(null);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      // Create unique identifier for cart items including variants
      const getItemKey = (item: CartItem) => {
        return `${item.id}-${item.selectedFlavor || ''}-${item.selectedWeight || ''}-${item.variantId || ''}`;
      };
      
      const newItemKey = getItemKey(action.payload as CartItem);
      const existingItem = state.items.find(
        (item) => getItemKey(item) === newItemKey
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          getItemKey(item) === newItemKey
            ? {
                ...item,
                quantity: item.quantity + (action.payload.quantity || 1),
              }
            : item
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      } else {
        const newItems = [
          ...state.items,
          { ...action.payload, quantity: action.payload.quantity || 1 },
        ];
        return {
          items: newItems,
          total: calculateTotal(newItems),
          itemCount: calculateItemCount(newItems),
        };
      }
    }

    case "REMOVE_ITEM": {
      const getItemKey = (item: CartItem) => {
        return `${item.id}-${item.selectedFlavor || ''}-${item.selectedWeight || ''}-${item.variantId || ''}`;
      };
      
      const updatedItems = state.items.filter(
        (item) => getItemKey(item) !== action.payload
      );
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const getItemKey = (item: CartItem) => {
        return `${item.id}-${item.selectedFlavor || ''}-${item.selectedWeight || ''}-${item.variantId || ''}`;
      };
      
      if (action.payload.quantity <= 0) {
        const updatedItems = state.items.filter(
          (item) => getItemKey(item) !== action.payload.id
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      }

      const updatedItems = state.items.map((item) =>
        getItemKey(item) === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    case "LOAD_CART":
      return action.payload;

    case "APPLY_UPSELL_DISCOUNT": {
      const { productId, discountPercentage, relatedProductId } =
        action.payload;

      // Check if both products are in cart
      const mainProduct = state.items.find(
        (item) => item.id === relatedProductId
      );
      const upsellProduct = state.items.find((item) => item.id === productId);

      if (mainProduct && upsellProduct) {
        // Apply discount to upsell product
        const updatedItems = state.items.map((item) => {
          if (item.id === productId) {
            const originalPrice = item.originalPrice || item.price;
            const discountedPrice =
              originalPrice * (1 - discountPercentage / 100);

            return {
              ...item,
              isUpsell: true,
              upsellDiscount: discountPercentage,
              relatedProductId,
              originalPrice,
              price: Math.round(discountedPrice),
            };
          }
          return item;
        });

        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      }

      return state;
    }

    case "REMOVE_UPSELL_DISCOUNT": {
      const { productId, relatedProductId } = action.payload;

      // Remove discount when main product is removed
      const updatedItems = state.items.map((item) => {
        if (
          item.id === productId &&
          item.relatedProductId === relatedProductId
        ) {
          return {
            ...item,
            isUpsell: false,
            upsellDiscount: undefined,
            relatedProductId: undefined,
            price: item.originalPrice || item.price,
            originalPrice: undefined,
          };
        }
        return item;
      });

      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("o2nutrition-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("o2nutrition-cart", JSON.stringify(state));
  }, [state]);

  // Listen for gift card add events
  useEffect(() => {
    const handleAddGiftCardToCart = (event: CustomEvent) => {
      const giftCardItem = event.detail;
      addToCart(giftCardItem, 1);
    };

    window.addEventListener(
      "addGiftCardToCart",
      handleAddGiftCardToCart as EventListener
    );

    return () => {
      window.removeEventListener(
        "addGiftCardToCart",
        handleAddGiftCardToCart as EventListener
      );
    };
  }, []);

  const addToCart = (
    item: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity } });
    
    // Add vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    toast({
      description: `${item.name} added to cart`,
    });
  };

  const removeFromCart = (itemKey: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemKey });
  };

  const updateQuantity = (itemKey: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: itemKey, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getItemQuantity = (id: string): number => {
    const item = state.items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const applyUpsellDiscount = (
    productId: string,
    discountPercentage: number,
    relatedProductId: string
  ) => {
    dispatch({
      type: "APPLY_UPSELL_DISCOUNT",
      payload: { productId, discountPercentage, relatedProductId },
    });
  };

  const removeUpsellDiscount = (
    productId: string,
    relatedProductId: string
  ) => {
    dispatch({
      type: "REMOVE_UPSELL_DISCOUNT",
      payload: { productId, relatedProductId },
    });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        applyUpsellDiscount,
        removeUpsellDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

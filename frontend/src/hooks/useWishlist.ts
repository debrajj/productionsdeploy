import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useWishlist = () => {
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useAuth();
  const { toast } = useToast();

  const toggleWishlist = (
    productId: string,
    productData?: { name: string; price: number; image: string }
  ) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      toast({
        title: "Removed from wishlist",
        description: `${productData?.name || 'Product'} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(productId, productData);
      toast({
        title: "Added to wishlist",
        description: `${productData?.name || 'Product'} has been added to your wishlist.`,
      });
    }
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    wishlistCount: wishlist.length,
  };
};
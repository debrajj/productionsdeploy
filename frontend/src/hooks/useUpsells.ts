import { Product, productApi } from "@/services/api";
import { useEffect, useState } from "react";

interface UpsellOffer {
  upsellProduct: Product;
  discountPercentage: number;
  description: string;
  active: boolean;
}

export const useUpsells = (productId: string) => {
  const [upsells, setUpsells] = useState<UpsellOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpsells = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch the product with upsells
        const response = await productApi.getProductById(productId);

        if (response.success && response.data?.upsells) {
          setUpsells(response.data.upsells);
        }
      } catch (err) {
        console.error("Failed to fetch upsells:", err);
        setError("Failed to load upsell offers");
      } finally {
        setLoading(false);
      }
    };

    fetchUpsells();
  }, [productId]);

  return { upsells, loading, error };
};

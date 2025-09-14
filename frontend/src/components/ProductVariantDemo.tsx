import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductVariants {
  flavors: string[];
  weights: string[];
}

const ProductVariantDemo: React.FC = () => {
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [variants, setVariants] = useState<ProductVariants>({ flavors: [], weights: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVariants = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/product-variants`);
        const result = await response.json();
        if (result.success) {
          setVariants(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch variants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVariants();
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">Loading variants...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Product Variant Selector
      </h2>
      <p className="text-center text-gray-600 mb-6 text-sm">
        Backend Strings → Dropdown Options
      </p>

      <div className="space-y-6">
        {/* Flavor Selector */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-900">
            Choose Flavor
          </label>
          <Select value={selectedFlavor} onValueChange={setSelectedFlavor}>
            <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-[#F9A245] focus:border-[#F9A245] focus:ring-2 focus:ring-[#F9A245]/20 rounded-lg bg-white">
              <SelectValue placeholder="Select a flavor" />
            </SelectTrigger>
            <SelectContent className="border-2 border-gray-200 rounded-lg shadow-lg max-h-60">
              {variants.flavors.map((flavor, index) => (
                <SelectItem
                  key={`flavor-${index}`}
                  value={flavor}
                  className="cursor-pointer py-3"
                >
                  {flavor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Weight Selector */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-900">
            Choose Weight
          </label>
          <Select value={selectedWeight} onValueChange={setSelectedWeight}>
            <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-[#F9A245] focus:border-[#F9A245] focus:ring-2 focus:ring-[#F9A245]/20 rounded-lg bg-white">
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent className="border-2 border-gray-200 rounded-lg shadow-lg max-h-60">
              {variants.weights.map((weight, index) => (
                <SelectItem
                  key={`weight-${index}`}
                  value={weight}
                  className="cursor-pointer py-3"
                >
                  {weight}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Values Display */}
        {(selectedFlavor || selectedWeight) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Selected Options:
            </h3>
            {selectedFlavor && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Flavor:</span> {selectedFlavor}
              </p>
            )}
            {selectedWeight && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Weight:</span> {selectedWeight}
              </p>
            )}
            {selectedFlavor && selectedWeight && (
              <p className="text-sm text-green-600 font-medium mt-2">
                ✓ Available combination
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVariantDemo;

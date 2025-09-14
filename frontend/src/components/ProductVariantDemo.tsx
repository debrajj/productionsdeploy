import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Example product with variants
const exampleProduct = {
  id: 1,
  name: "Premium Whey Protein",
  price: 4999, // Base price
  variants: [
    { flavor: "Mangos", weight: "20gm", price: 344 },
    { flavor: "Mangos", weight: "250gm", price: 1299 },
    { flavor: "Mangos", weight: "500gm", price: 2199 },
    { flavor: "Chocolate", weight: "20gm", price: 344 },
    { flavor: "Chocolate", weight: "250gm", price: 1299 },
    { flavor: "Chocolate", weight: "500gm", price: 2199 },
    { flavor: "Vanilla", weight: "20gm", price: 344 },
    { flavor: "Vanilla", weight: "250gm", price: 1299 },
    { flavor: "Vanilla", weight: "500gm", price: 2199 },
  ]
};

const ProductVariantDemo: React.FC = () => {
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number>(exampleProduct.price);

  // Get unique flavors and weights
  const flavors = Array.from(new Set(exampleProduct.variants.map(v => v.flavor)));
  const weights = Array.from(new Set(exampleProduct.variants.map(v => v.weight)));

  // Update price when variant changes
  useEffect(() => {
    if (selectedFlavor && selectedWeight) {
      const variant = exampleProduct.variants.find(
        v => v.flavor === selectedFlavor && v.weight === selectedWeight
      );
      setSelectedPrice(variant ? variant.price : exampleProduct.price);
    } else {
      setSelectedPrice(exampleProduct.price);
    }
  }, [selectedFlavor, selectedWeight]);

  // Set default selections
  useEffect(() => {
    if (flavors.length > 0 && !selectedFlavor) {
      setSelectedFlavor(flavors[0]);
    }
    if (weights.length > 0 && !selectedWeight) {
      setSelectedWeight(weights[0]);
    }
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{exampleProduct.name}</h2>
      
      {/* Price Display */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900">
          ₹{selectedPrice.toLocaleString()}
        </div>
        {selectedPrice !== exampleProduct.price && (
          <div className="text-sm text-gray-500">
            Base price: ₹{exampleProduct.price.toLocaleString()}
          </div>
        )}
        <p className="text-sm text-gray-600">Inclusive of all taxes</p>
      </div>

      {/* Variant Selectors */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flavor
          </label>
          <Select value={selectedFlavor} onValueChange={setSelectedFlavor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose flavor" />
            </SelectTrigger>
            <SelectContent>
              {flavors.map((flavor) => (
                <SelectItem key={flavor} value={flavor}>
                  {flavor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight
          </label>
          <Select value={selectedWeight} onValueChange={setSelectedWeight}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose weight" />
            </SelectTrigger>
            <SelectContent>
              {weights.map((weight) => {
                const variant = exampleProduct.variants.find(v => v.weight === weight);
                return (
                  <SelectItem key={weight} value={weight}>
                    <div className="flex justify-between items-center w-full">
                      <span>{weight}</span>
                      {variant && (
                        <span className="text-sm text-gray-500 ml-2">
                          ₹{variant.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Variant Display */}
        {selectedFlavor && selectedWeight && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-sm text-gray-700 mb-1">
              <strong>Selected:</strong> {selectedFlavor} - {selectedWeight}
            </div>
            <div className="text-xl font-bold text-orange-600">
              ₹{selectedPrice.toLocaleString()}
            </div>
            {selectedPrice !== exampleProduct.price && (
              <div className="text-xs text-gray-500 mt-1">
                {selectedPrice < exampleProduct.price ? '🎉 Special variant price!' : 'Premium variant'}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">How it works:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Select flavor and weight combination</li>
          <li>• Price updates automatically based on variant</li>
          <li>• Each variant can have its own price</li>
          <li>• Main price display shows selected variant price</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductVariantDemo;
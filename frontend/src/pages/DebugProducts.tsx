import React, { useEffect, useState } from 'react';
import { productApi, Product } from '../services/api';

const DebugProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiTest, setApiTest] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test direct API call
        console.log('Testing direct API call...');
        const directResponse = await fetch('http://localhost:3000/api/products?limit=5');
        const directData = await directResponse.json();
        setApiTest(directData);

        // Test through productApi service
        console.log('Testing through productApi service...');
        const response = await productApi.getProducts({ limit: 5 });
        
        if (response.success) {
          setProducts(response.data);
          console.log('Products loaded successfully:', response.data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Debug Products - Loading...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Debug Products - Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
        
        {apiTest && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Direct API Response:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(apiTest, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Debug Products</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">API Status:</h2>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ Successfully loaded {products.length} products
        </div>
      </div>

      <div className="grid gap-6">
        {products.map((product, index) => (
          <div key={product.id} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="text-lg font-semibold mb-2">{index + 1}. {product.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Basic Info:</strong>
                <ul className="mt-1 space-y-1">
                  <li>ID: {product.id}</li>
                  <li>Price: ₹{product.price?.toLocaleString()}</li>
                  <li>Category: {product.category}</li>
                  <li>Brand: {product.brand}</li>
                </ul>
              </div>
              
              <div>
                <strong>Variant Info:</strong>
                <ul className="mt-1 space-y-1">
                  <li>Simple Flavors: {product.simpleFlavors || 'None'}</li>
                  <li>Simple Weights: {product.simpleWeights || 'None'}</li>
                  <li>Variants Array: {product.variants?.length || 0} items</li>
                  <li>Has Image: {product.image ? '✅' : '❌'}</li>
                </ul>
              </div>
            </div>

            {(product.simpleFlavors || product.simpleWeights) && (
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <strong>Variant Details:</strong>
                {product.simpleFlavors && (
                  <div className="mt-1">
                    <span className="font-medium">Flavors:</span> 
                    {product.simpleFlavors.split(',').map(flavor => (
                      <span key={flavor} className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs mr-1 mt-1">
                        {flavor.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {product.simpleWeights && (
                  <div className="mt-2">
                    <span className="font-medium">Weights:</span> 
                    {product.simpleWeights.split(',').map(weight => (
                      <span key={weight} className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded text-xs mr-1 mt-1">
                        {weight.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {product.image && (
              <div className="mt-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => {
                    console.error('Image failed to load:', product.image);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Raw API Response:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
          {JSON.stringify(apiTest, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DebugProducts;
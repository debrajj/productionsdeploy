import React, { useEffect, useState } from 'react';

const TestProducts: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products?limit=3');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };
    testAPI();
  }, []);

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Products</h1>
      <div className="space-y-4">
        {data.docs?.map((product: any) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p>ID: {product.id}</p>
            <p>Slug: {product.slug}</p>
            <p>Price: ₹{product.price}</p>
            <p>Flavors: {product.simpleFlavors || 'None'}</p>
            <p>Weights: {product.simpleWeights || 'None'}</p>
            <div className="mt-2">
              <a href={`/product/${product.id}`} className="text-blue-500 mr-4">View by ID</a>
              <a href={`/product/${product.slug}`} className="text-blue-500">View by Slug</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestProducts;
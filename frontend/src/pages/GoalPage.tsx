import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productApi, goalApi, type Product, type Goal } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const GoalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const productsPerPage = 20;

  useEffect(() => {
    const fetchGoalAndProducts = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch goal details
        const goalResponse = await goalApi.getGoalBySlug(slug);
        if (!goalResponse.success || !goalResponse.data) {
          setError('Goal not found');
          return;
        }

        setGoal(goalResponse.data);

        // Fetch products for this goal
        const productsResponse = await productApi.getProducts({
          shopByGoal: goalResponse.data.value,
          page: currentPage,
          limit: productsPerPage,
        });

        if (productsResponse.success) {
          setProducts(productsResponse.data);
          setTotalPages(productsResponse.pagination?.totalPages || 1);
          setTotalProducts(productsResponse.pagination?.totalDocs || 0);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error('Goal page error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalAndProducts();
  }, [slug, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Goal not found'}
          </h1>
          <p className="text-gray-600">
            The goal you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {goal.name}
            </h1>
            {goal.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {goal.description}
              </p>
            )}
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F9A245] text-white">
                {totalProducts} Products Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              We don't have any products for this goal yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-[#F9A245] text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GoalPage;
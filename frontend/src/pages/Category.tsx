import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Filter, Grid, List, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { products, categories, brands } from "@/data/products";
import { useCart } from "@/context/CartContext";

const Category: React.FC = () => {
  const { slug, categorySlug, subSlug } = useParams();
  const { addToCart } = useCart();

  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const currentCategory = categories.find(
    (cat) => cat.slug === (categorySlug || slug)
  );

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Category filtering
      const matchesCategory = categorySlug
        ? product.category === categorySlug || product.category === slug
        : product.category === slug;

      // Price filtering
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      // Brand filtering
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      return matchesCategory && matchesPrice && matchesBrand;
    });

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured first
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }

    return filtered;
  }, [slug, categorySlug, priceRange, selectedBrands, sortBy]);

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-heading font-semibold text-lg mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={200}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-heading font-semibold text-lg mb-4">Brands</h3>
        <div className="space-y-3">
          {brands.slice(0, 6).map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) =>
                  handleBrandChange(brand, checked as boolean)
                }
              />
              <label
                htmlFor={brand}
                className="font-body text-sm cursor-pointer"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary capitalize">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary capitalize">
            Shop
          </Link>
          {currentCategory && (
            <>
              <span>/</span>
              <span className="text-foreground font-medium capitalize">
                {currentCategory.name}
              </span>
            </>
          )}
        </div>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-2">
            {currentCategory?.name || "Products"}
          </h1>
          <p className="font-body text-muted-foreground">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid - Removed filters sidebar */}
      <div className="w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-lg text-muted-foreground mb-4">
              No products found matching your criteria.
            </p>
            <Button
              onClick={() => {
                setPriceRange([0, 100]);
                setSelectedBrands([]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`group hover:shadow-card transition-all duration-300 ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <CardContent
                  className={`p-4 ${viewMode === "list" ? "flex w-full space-x-4" : "space-y-4"}`}
                >
                  <div
                    className={`relative ${viewMode === "list" ? "w-32 h-32 shrink-0" : ""}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`object-cover rounded-lg ${
                        viewMode === "list" ? "w-full h-full" : "w-full h-48"
                      }`}
                    />
                    {product.onSale && (
                      <Badge className="absolute top-2 left-2 bg-[#F9A246] text-white">
                        SALE
                      </Badge>
                    )}
                  </div>

                  <div
                    className={`space-y-2 ${viewMode === "list" ? "flex-1" : ""}`}
                  >
                    <h3 className="font-body font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {product.brand}
                    </p>

                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < product.rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-heading font-bold text-xl text-foreground">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-muted-foreground line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        className="flex-1 text-base font-semibold h-11"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                      <Link to={`/product/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;

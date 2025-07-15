import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useLanguage } from "../hooks/use-language";
import { Product } from "@shared/schema";
import ProductCard from "../components/product/product-card";
import ProductFilters from "../components/product/product-filters";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, Grid, List, Filter } from "lucide-react";

export default function Catalog() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    priceRange: [0, 2000] as [number, number],
  });

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const category = params.get('category');
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category.charAt(0).toUpperCase() + category.slice(1)]
      }));
    }
  }, [location]);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter(product => {
    // Search filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Size filter
    if (filters.sizes.length > 0 && !filters.sizes.includes(product.size)) {
      return false;
    }

    // Price filter
    const price = parseFloat(product.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    return true;
  });

  const sortedProducts = filteredProducts?.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("nav.catalog")}</h1>
          
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une selle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom A-Z</SelectItem>
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                size="sm"
              >
                <Grid className="h-4 w-4" />
              </Button>
              
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ProductFilters onFiltersChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                    <div className="bg-gray-300 h-6 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded"></div>
                  </div>
                ))}
              </div>
            ) : sortedProducts?.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    {sortedProducts?.length} produit{sortedProducts?.length !== 1 ? 's' : ''} trouvé{sortedProducts?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts?.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedProducts?.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg shadow-md p-6 flex gap-6">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                          <p className="text-gray-600 mb-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">
                              {parseFloat(product.price).toFixed(2)} €
                            </span>
                            <Button className="btn-primary">
                              {t("product.addToCart")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

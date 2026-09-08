import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorMessage } from '../../components/feedback/ErrorMessage';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { Button } from '../../components/common/Button';
import {
  MapPin,
  ShoppingBag,
  Star,
  User,
  ShieldCheck,
  ArrowLeft,
  Minus,
  Plus,
  Tractor,
  Calendar
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useNotifications();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const prod = await productService.getProductById(id);
        if (!prod) {
          setError('Product not found or has been removed.');
          return;
        }
        setProduct(prod);
        setSelectedImage(prod.imageUrls[0] || '');

        // Fetch related products in same category
        const related = await productService.getProducts({ category: prod.category });
        setRelatedProducts(related.filter((p) => p.id !== prod.id).slice(0, 3));
      } catch (err: any) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Fetching product specifications..." />;
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorMessage title="Product Not Available" message={error || 'Product not found'} />
        <Button variant="outline" onClick={() => navigate('/marketplace')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`Added ${quantity} ${product.unit} of ${product.name} to cart!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/marketplace')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </button>

      {/* Main Product Details Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="h-96 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.imageUrls.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.imageUrls.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-emerald-700 ring-2 ring-emerald-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Specs & Actions */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              {product.rating && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating} Rating</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Farm Location: <strong>{product.location}</strong></span>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Harvest Price</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  Rs. {product.price.toLocaleString()} <span className="text-sm font-semibold text-slate-500">/ {product.unit}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Available Stock</span>
                <span className="text-sm font-bold text-slate-800">
                  {product.availableQuantity} {product.unit}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Farmer Card Box */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {product.farmerName.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-emerald-900 tracking-wider">Farmer Producer</h4>
                <p className="text-sm font-bold text-slate-900">{product.farmerName}</p>
                <p className="text-xs text-slate-500">{product.farmName}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Grower</span>
            </div>
          </div>

          {/* Quantity Selector & Add to Cart Action */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase text-slate-500">Select Quantity:</span>
              <div className="flex items-center rounded-xl border border-slate-300 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-l-xl transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.availableQuantity, q + 1))}
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-r-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-slate-500 font-medium">({product.unit})</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800 shadow-lg shadow-emerald-900/10"
              onClick={handleAddToCart}
              leftIcon={<ShoppingBag className="w-5 h-5" />}
            >
              Add to Shopping Cart (Rs. {(product.price * quantity).toLocaleString()})
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-2xl font-bold text-slate-900">Related Agricultural Harvests</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

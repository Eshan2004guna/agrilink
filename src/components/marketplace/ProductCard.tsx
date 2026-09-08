import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { MapPin, ShoppingBag, Star, User as UserIcon } from 'lucide-react';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useNotifications();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
          {product.category}
        </span>
        {/* Rating Badge */}
        {product.rating && (
          <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Star className="w-3 h-3 fill-slate-950" />
            {product.rating}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{product.district}</span>
          </div>

          <Link to={`/marketplace/${product.id}`} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="font-bold text-slate-900 line-clamp-1 text-base leading-snug">{product.name}</h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8">
            {product.description}
          </p>
        </div>

        {/* Farmer Info */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
              {product.farmerName.charAt(0)}
            </div>
            <span className="truncate font-medium">{product.farmerName}</span>
          </div>
          <span className="text-slate-400 font-normal shrink-0 text-[11px]">
            Stock: <strong className="text-slate-700 font-semibold">{product.availableQuantity} {product.unit}</strong>
          </span>
        </div>

        {/* Price & Action */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Price</div>
            <div className="text-base font-extrabold text-emerald-700">
              Rs. {product.price.toLocaleString()} <span className="text-[11px] font-normal text-slate-500">/{product.unit}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link to={`/marketplace/${product.id}`}>
              <Button variant="outline" size="sm" className="px-2.5 text-xs">
                Details
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
              className="px-2.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

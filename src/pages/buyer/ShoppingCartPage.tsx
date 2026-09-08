import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, Store } from 'lucide-react';

export const ShoppingCartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12" />}
          title="Your Shopping Cart is Empty"
          description="You haven't added any fresh agricultural produce to your cart yet. Explore our marketplace to find fresh vegetables, Ceylon tea, spices, and fruits direct from Sri Lankan farmers."
          actionText="Explore Fresh Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Your Produce Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">Review your direct farm items before proceeding to checkout.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 font-bold hover:underline"
        >
          Clear Entire Cart
        </button>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{product.name}</h3>
                  <p className="text-xs text-slate-500">
                    Farmer: <strong className="text-slate-700">{product.farmerName}</strong> • {product.district}
                  </p>
                  <p className="text-xs text-emerald-700 font-extrabold">
                    Rs. {product.price.toLocaleString()} / {product.unit}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center rounded-xl border border-slate-300 bg-white">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-l-xl"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-r-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900">
                    Rs. {(product.price * quantity).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Total Items</span>
                <strong className="text-slate-900">{totalItems} produce item(s)</strong>
              </div>
              <div className="flex justify-between">
                <span>Subtotal (LKR)</span>
                <strong className="text-slate-900">Rs. {subtotal.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated Direct Delivery</span>
                <span className="text-emerald-700 font-bold">Standard Farm Transit</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-emerald-700">Rs. {subtotal.toLocaleString()}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800 shadow-lg shadow-emerald-900/10"
              onClick={() => navigate('/checkout')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Delivery Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import { SRI_LANKA_DISTRICTS } from '../../types';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { useNotifications } from '../../context/NotificationContext';
import { ArrowLeft, MapPin, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [formData, setFormData] = useState({
    deliveryName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: user ? user.phone : '',
    district: user ? user.district || 'Colombo' : 'Colombo',
    address: user ? user.address || '' : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlacing, setIsPlacing] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to place an order', 'error');
      navigate('/login');
      return;
    }

    const newErrors: Record<string, string> = {};
    if (!formData.deliveryName) newErrors.deliveryName = 'Recipient name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Full delivery address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsPlacing(true);
    try {
      const order = await orderService.createOrder({
        buyerId: user.id,
        buyerName: `${user.firstName} ${user.lastName}`,
        buyerEmail: user.email,
        buyerPhone: user.phone,
        deliveryName: formData.deliveryName,
        phone: formData.phone,
        district: formData.district,
        address: formData.address,
        cartItems: cart,
      });

      clearCart();
      showToast(`Order #${order.orderNumber} placed successfully!`, 'success');
      navigate(`/buyer/orders/${order.id}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => navigate('/cart')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping Cart</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Delivery Details Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-extrabold text-slate-900">Fulfillment & Delivery Details</h1>
            <p className="text-xs text-slate-500">Provide recipient contact and delivery location in Sri Lanka.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Recipient / Delivery Name"
              placeholder="Dilani Fernando"
              value={formData.deliveryName}
              onChange={(e) => setFormData({ ...formData, deliveryName: e.target.value })}
              error={errors.deliveryName}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Phone Number"
                placeholder="+94 76 555 1234"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                required
              />
              <Select
                label="District"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                options={[...SRI_LANKA_DISTRICTS]}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700">Full Delivery Street Address</label>
              <textarea
                rows={3}
                className="block w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                placeholder="No 12, Park Street, Colombo 02..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              {errors.address && <p className="text-xs text-red-600 font-medium">{errors.address}</p>}
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-950">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                <strong>Direct Farm Settlement:</strong> Payment details arranged directly upon farm dispatch confirmation.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-emerald-700 hover:bg-emerald-800 shadow-md"
              isLoading={isPlacing}
            >
              Place Order Now (Rs. {subtotal.toLocaleString()})
            </Button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">Order Summary</h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                  <div className="flex items-center gap-2.5">
                    <img src={product.imageUrls[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <strong className="text-slate-900 block font-bold">{product.name}</strong>
                      <span className="text-slate-400">{quantity} {product.unit} @ Rs. {product.price}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    Rs. {(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Total Amount Payable</span>
              <span className="text-2xl font-black text-emerald-700">Rs. {subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

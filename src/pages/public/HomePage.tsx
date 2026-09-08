import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  Tractor,
  TrendingUp,
  ShieldCheck,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Package,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { Product } from '../../types';
import { productService } from '../../services/productService';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await productService.getProducts({ isFeatured: true });
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-15 mix-blend-overlay" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sri Lanka's #1 Direct Agricultural Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Connecting Farmers <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                Directly With Buyers
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              AgriLink Sri Lanka empowers local farmers to list fresh produce, track crop lifecycles, and sell straight to wholesalers, supermarkets, and households without unfair middlemen.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/marketplace')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40"
              >
                Explore Marketplace
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/register')}
                leftIcon={<Tractor className="w-5 h-5 text-emerald-400" />}
                className="w-full sm:w-auto border-emerald-400/40 text-emerald-200 hover:bg-emerald-900/50 hover:text-white"
              >
                Join as Farmer
              </Button>
            </div>

            {/* Micro Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-900/80 text-left text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Commission Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>25 Island Districts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Fresh Produce</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Stack */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-3xl blur-xl opacity-30 animate-pulse-slow" />
              <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-emerald-300 flex items-center justify-center font-bold">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Nuwara Eliya Highland Harvest</h4>
                      <p className="text-xs text-slate-400">Kamal Perera • 4.5 Acres</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    Live
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden h-48 border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&q=80&w=600"
                    alt="Fresh Carrots Harvest"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Harvest Price</span>
                    <strong className="text-emerald-400 text-base font-extrabold">Rs. 280 / kg</strong>
                  </div>
                  <Button size="sm" onClick={() => navigate('/marketplace')} className="bg-emerald-600 hover:bg-emerald-500">
                    Buy Direct
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Comprehensive Platform</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Everything You Need for Smart Agribusiness</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tailored tools designed for Sri Lanka’s unique agricultural ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tractor className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Manage Your Farm</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Register farms across districts, log land dimensions, and record soil & crop categories seamlessly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Sell Your Products</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              List fresh produce with transparent unit pricing in LKR, stock quantities, and direct contact options.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Buy Fresh Products</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Search upcountry vegetables, northern shallots, Ceylon spices, and fruits directly from verified farmers.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Track Your Orders</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time order lifecycle tracking from PENDING confirmation to final DELIVERED status.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Simple Workflow</span>
            <h2 className="text-3xl font-extrabold tracking-tight">How AgriLink Sri Lanka Works</h2>
            <p className="text-sm text-slate-300">Connecting local agriculture in 3 straightforward steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-emerald-800/60 p-6 rounded-2xl border border-emerald-700/60 space-y-4 text-center sm:text-left relative">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-xl font-bold">Farmers Register Produce</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Farmers create a profile, register their land size, and upload fresh crop harvests ready for market sale.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-emerald-800/60 p-6 rounded-2xl border border-emerald-700/60 space-y-4 text-center sm:text-left relative">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-xl font-bold">Buyers Browse & Order</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Wholesalers, retailers, and households filter produce by category, district, and price, then place orders in cart.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-emerald-800/60 p-6 rounded-2xl border border-emerald-700/60 space-y-4 text-center sm:text-left relative">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="text-xl font-bold">Direct Harvest Fulfillment</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Farmers confirm orders, prepare fresh harvesting, and update delivery status directly to the buyer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-300">1,250+</div>
            <div className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Registered Farmers</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-300">3,400+</div>
            <div className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Active Buyers</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-300">25</div>
            <div className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Island Districts</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-300">Rs. 18M+</div>
            <div className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Trade Volume</div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Fresh Produce</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Agricultural Harvests</h3>
          </div>
          <Link to="/marketplace">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Marketplace Products
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Join Sri Lanka’s Smart Agriculture Platform?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Create your free account today as a Farmer to list your crops or as a Buyer to purchase fresh, high-quality produce directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40"
            >
              Get Started Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/about')}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

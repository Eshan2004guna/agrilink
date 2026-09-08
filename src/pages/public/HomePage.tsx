import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  Tractor,
  ArrowRight,
  CheckCircle2,
  Package,
  BarChart3,
  Leaf,
  Users,
  Check,
  ShieldCheck,
  Globe2,
  Store
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
    <div className="space-y-16 md:space-y-24 pb-16 bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-stone-50/40 to-white pt-10 pb-16 md:pt-16 md:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200/60">
        {/* Subtle Decorative Background Blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Smart Agriculture Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Connecting{' '}
              <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2 underline-offset-4">
                Farmers to Buyers
              </span>
              .<br className="hidden sm:inline" /> Growing Agriculture Together.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              AgriLink Sri Lanka helps farmers manage farms and sell agricultural products while connecting buyers with fresh, reliable produce.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/marketplace')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-md shadow-emerald-900/15"
              >
                Explore Marketplace
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/register')}
                leftIcon={<Tractor className="w-4.5 h-4.5 text-emerald-700" />}
                className="w-full sm:w-auto bg-white border-slate-300 text-slate-800 hover:bg-emerald-50/60 hover:border-emerald-300"
              >
                Join as a Farmer
              </Button>
            </div>

            {/* Trust Support Line */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Connecting farmers and buyers across Sri Lanka</span>
            </div>
          </div>

          {/* Right Column Hero Visual Presentation */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Main Image Frame */}
              <div className="relative bg-white p-2.5 rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
                <div className="relative h-72 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=1000"
                    alt="Fresh Sri Lankan Produce Harvest"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                  {/* Image Overlay Tag */}
                  <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">Highland Produce</span>
                      <h4 className="text-base font-bold">Nuwara Eliya Carrot Harvest</h4>
                      <p className="text-xs text-slate-200">Kamal Perera • Nuwara Eliya</p>
                    </div>
                    <span className="bg-emerald-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-xs">
                      Rs. 280 / kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Direct Farm Trade</div>
                  <div className="text-[11px] text-slate-500 font-medium">Verified local suppliers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Statistics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-slate-900">Connect Farmers & Buyers</div>
              <div className="text-[11px] text-slate-500 font-normal">Direct collaboration</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Tractor className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-slate-900">Manage Farms Easily</div>
              <div className="text-[11px] text-slate-500 font-normal">Organized field data</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Leaf className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-slate-900">Discover Fresh Products</div>
              <div className="text-[11px] text-slate-500 font-normal">Verified harvests</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Globe2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-slate-900">Simplify Trading</div>
              <div className="text-[11px] text-slate-500 font-normal">Across 25 districts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Platform Features</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Grow Together
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            AgriLink brings farm management and agricultural commerce together in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full space-y-4 group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Tractor className="w-5.5 h-5.5 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Farm Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage your farms and agricultural information in one organized place.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full space-y-4 group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Leaf className="w-5.5 h-5.5 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Crop Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track crops, planting details, harvest information, and progress.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full space-y-4 group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package className="w-5.5 h-5.5 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sell Your Products</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                List agricultural products and connect directly with potential buyers.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full space-y-4 group">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Store className="w-5.5 h-5.5 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Fresh Marketplace</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover fresh agricultural products directly from farmers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-emerald-50/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Simple Step-by-Step Flow</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              How AgriLink Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Connecting agriculture from farm to buyer in a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col space-y-4 text-left relative">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  1
                </div>
                <Users className="w-6 h-6 text-emerald-600 opacity-60" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Create Your Account</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Farmer or buyer joins the platform.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col space-y-4 text-left relative">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  2
                </div>
                <Sprout className="w-6 h-6 text-emerald-600 opacity-60" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Connect & Explore</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Farmers manage farms and list products. Buyers discover fresh agricultural products.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col space-y-4 text-left relative">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  3
                </div>
                <BarChart3 className="w-6 h-6 text-emerald-600 opacity-60" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Manage Orders</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buyers place orders and farmers manage incoming requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">Direct Marketplace</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Fresh Products from Local Farmers
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Discover agricultural products available through the AgriLink marketplace.
            </p>
          </div>
          <Link to="/marketplace">
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Products
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-200/80 rounded-2xl animate-pulse" />
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

      {/* Why Choose AgriLink Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 md:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-72 sm:h-80 lg:h-96">
              <img
                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800"
                alt="Sri Lankan Tea and Crop Harvest"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Platform Benefits</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Built for the Future of Sri Lankan Agriculture
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Empowering farmers and buyers with clean digital management tools tailored for local agricultural needs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Direct Farmer-to-Buyer Connection</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Fair and direct trade connections.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Simple Farm Management</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Organize land and crop information.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Organized Product Listings</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Transparent Sri Lankan Rupee pricing.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Easy Order Management</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Streamlined order lifecycle tracking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/30 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Grow with AgriLink?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Join the platform and become part of a better connected agricultural community.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10 shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
            >
              Join as a Farmer
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/marketplace')}
              className="bg-emerald-950/60 border-emerald-700 text-emerald-100 hover:bg-emerald-800 hover:text-white"
            >
              Explore Marketplace
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Target, ShieldCheck, HeartHandshake, Sprout, Users, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider inline-block">
          Empowering Sri Lankan Agriculture
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          What is AgriLink Sri Lanka?
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          AgriLink Sri Lanka is a digital Smart Agriculture Marketplace and Farm Management System created specifically for Sri Lanka's agricultural sector.
        </p>
      </div>

      {/* Problem We Are Solving */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">The Problem We Are Solving</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            For decades, smallholder Sri Lankan farmers in districts like Nuwara Eliya, Jaffna, Badulla, and Kurunegala have suffered from unequal market access. Multiple layers of middlemen shrink farmer earnings to a fraction of harvest value, while buyers in Colombo and urban centers face inflated prices and variable produce freshness.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Additionally, traditional farm logs are kept on paper, leading to uncoordinated planting cycles, unpredictable post-harvest gluts, and wasted produce.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1592417817098-8f3d6eb16655?auto=format&fit=crop&q=80&w=800"
            alt="Sri Lankan Farmer Field"
            className="w-full h-80 object-cover"
          />
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-900 text-white p-8 rounded-3xl space-y-4 border border-emerald-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To digitize and modernize Sri Lankan farming by providing direct marketplace connectivity, transparent pricing, and structured farm management tools for every farmer across all 25 districts.
          </p>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">Our Commitment</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To build a fair, sustainable, and reliable digital ecosystem where Sri Lankan farmers earn what they deserve and buyers receive farm-fresh agricultural products delivered on schedule.
          </p>
        </div>
      </div>

      {/* Benefits Breakdown */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">How AgriLink Empowers Everyone</h2>
          <p className="text-xs text-slate-500">Mutual benefits for both farming communities and commercial buyers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* How Platform Helps Farmers */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">How Platform Helps Farmers</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Direct access to island-wide buyer markets without middleman commissions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Organized farm profiles showing total land size, crop stages, and harvest predictions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ability to set fair unit prices in LKR and specify minimum order quantities.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Real-time notifications for incoming orders and customer confirmations.</span>
              </li>
            </ul>
          </div>

          {/* How Buyers Benefit */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">How Buyers Benefit</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Guaranteed farm-fresh produce sourced directly from verified local growers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Filter produce by district location, vegetable category, and price range.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Transparent order tracking with step-by-step status notifications.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Bulk purchasing options for supermarkets, hotels, restaurants, and households.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-emerald-800 text-white rounded-3xl p-8 text-center space-y-4 max-w-3xl mx-auto shadow-xl">
        <h3 className="text-2xl font-bold">Start Trading Fresh Produce Today</h3>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
          Whether you are a farmer looking to expand your buyer base or a buyer seeking top-tier Sri Lankan agricultural produce, AgriLink is your trusted partner.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Button variant="primary" onClick={() => navigate('/register')} className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold">
            Join Platform Free
          </Button>
          <Button variant="outline" onClick={() => navigate('/marketplace')} className="border-emerald-400 text-white hover:bg-emerald-900">
            Explore Marketplace
          </Button>
        </div>
      </div>
    </div>
  );
};

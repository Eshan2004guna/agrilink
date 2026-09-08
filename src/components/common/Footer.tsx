import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-emerald-900/60 rounded-xl text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct Farm Delivery</h4>
              <p className="text-xs text-slate-400">Fresh produce straight from local farmers</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-emerald-900/60 rounded-xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fair Farmer Pricing</h4>
              <p className="text-xs text-slate-400">Eliminates unfair middleman margins</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-emerald-900/60 rounded-xl text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Island-wide Coverage</h4>
              <p className="text-xs text-slate-400">Connecting all 25 Sri Lankan districts</p>
            </div>
          </div>
        </div>

        {/* Navigation & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-950/30">
                <Sprout className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Agri<span className="text-emerald-400">Link</span> <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Sri Lanka</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connecting farmers and buyers through a smarter agricultural platform across Sri Lanka.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/marketplace" className="hover:text-emerald-400 transition-colors">Marketplace</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">Join as Farmer</Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">Register</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact AgriLink</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AgriLink HQ, Colombo 01, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@agrilink.lk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AgriLink Sri Lanka. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

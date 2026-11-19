import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Flame, Compass, Heart, Sparkles } from 'lucide-react';
import { DEMO_USER } from '../services/api';

const Navbar = ({ matchesCount = 0 }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Sparkles },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Matches', path: '/matches', icon: Heart, badge: matchesCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-coy-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Coy Brand Logo */}
        <NavLink to="/discover" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-coy-pink to-rose-400 flex items-center justify-center text-white shadow-coy-pink group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-coy-text group-hover:text-coy-pink transition-colors leading-none">
              coy<span className="text-coy-pink">.</span>
            </span>
            <span className="text-[10px] font-semibold text-coy-muted tracking-wider uppercase">
              Discover
            </span>
          </div>
        </NavLink>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-coy-bg p-1.5 rounded-full border border-coy-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-coy-pink shadow-coy-pink font-semibold'
                    : 'text-coy-muted hover:text-coy-text hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />
                <span>{item.label}</span>

                {item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-coy-pink'
                        : 'bg-coy-pink text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Demo Profile / User Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-coy-text leading-tight">
              {DEMO_USER.name}
            </span>
            <span className="text-[10px] text-coy-muted">
              {DEMO_USER.college}
            </span>
          </div>

          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-coy-pink/40 p-0.5 shadow-sm">
              <img
                src={DEMO_USER.photo}
                alt={DEMO_USER.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Active presence dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


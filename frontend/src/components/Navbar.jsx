import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Heart, Home } from 'lucide-react';
import { DEMO_USER } from '../services/api';

const Navbar = ({ matchesCount = 0 }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Matches', path: '/matches', icon: Heart, badge: matchesCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6F0]/95 backdrop-blur-xs border-b border-coy-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Coy Wordmark (Distinct Display Serif) */}
        <NavLink to="/discover" className="flex items-center gap-2 group">
          <span className="font-display text-2xl font-semibold tracking-tight text-coy-ink">
            coy<span className="text-coy-accent">.</span>
          </span>
        </NavLink>

        {/* Center: Desktop Navigation Tabs (Flat, simple active state) */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-colors ${
                  isActive
                    ? 'bg-coy-surface text-coy-ink font-medium border border-coy-border'
                    : 'text-coy-muted hover:text-coy-ink'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 stroke-[1.75] ${isActive ? 'text-coy-accent' : ''}`} />
                <span>{item.label}</span>

                {item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-coy-accent text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Demo Profile Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-medium text-coy-ink leading-tight">
              {DEMO_USER.name}
            </span>
            <span className="text-[10px] text-coy-muted">
              {DEMO_USER.college}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full border border-coy-border overflow-hidden bg-coy-surface">
            <img
              src={DEMO_USER.photo}
              alt={DEMO_USER.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

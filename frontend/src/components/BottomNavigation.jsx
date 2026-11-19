import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sparkles, Compass, Heart } from 'lucide-react';

const BottomNavigation = ({ matchesCount = 0 }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Sparkles },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Matches', path: '/matches', icon: Heart, badge: matchesCount },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-coy-border safe-area-pb shadow-lg">
      <nav className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors relative ${
                isActive ? 'text-coy-pink' : 'text-coy-muted hover:text-coy-text'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 fill-current' : ''
                  }`}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-coy-pink text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`mt-1 text-[11px] ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-coy-pink mt-0.5" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;


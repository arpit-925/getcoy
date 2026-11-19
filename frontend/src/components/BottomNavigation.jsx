import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Heart, Home } from 'lucide-react';

const BottomNavigation = ({ matchesCount = 0 }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Matches', path: '/matches', icon: Heart, badge: matchesCount },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-t border-coy-border safe-area-pb">
      <nav className="flex items-center justify-around h-14 px-3 max-w-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-normal transition-colors relative ${
                isActive ? 'text-coy-accent font-medium' : 'text-coy-muted hover:text-coy-ink'
              }`}
            >
              <div className="relative">
                <Icon
                  className="w-4 h-4 stroke-[1.75]"
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-medium bg-coy-accent text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-coy-accent mt-0.5" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;

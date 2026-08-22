import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Nav({ isLive }: { isLive: boolean }) {
  const location = useLocation();

  const navItems = [
    { path: '/console', label: 'Control Room' },
    { path: '/policies', label: 'Policies' },
    { path: '/catalog', label: 'Catalog' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-steel/30 bg-ink/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-paper font-display font-bold text-lg flex items-center gap-2 tracking-tight">
          <div className="w-6 h-6 bg-signal-blue rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-ink rounded-full" />
          </div>
          Agent Passport
        </Link>
        
        <div className="flex items-center gap-6">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-display uppercase tracking-wider transition-colors ${
                  isActive ? 'text-paper' : 'text-mist hover:text-paper'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-5 left-0 right-0 h-0.5 bg-signal-blue"
                    initial={false}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isLive ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mint"></span>
            </span>
            SYSTEM ONLINE
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs font-mono">
            <span className="w-2 h-2 bg-amber rounded-full" />
            MOCK DATA
          </div>
        )}
      </div>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Tags, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Calendar,
  Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    fetchUnseenCount();
    const interval = setInterval(fetchUnseenCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnseenCount = async () => {
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      const count = data.filter((r: any) => !r.is_seen && r.status === 'pending').length;
      setUnseenCount(count);
    } catch (error) {
      console.error('Error fetching unseen count:', error);
    }
  };

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: UtensilsCrossed },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Reservations', href: '/admin/reservations', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#060608]/80 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-gold font-serif text-xl italic tracking-tight">SUGI</span>
          <span className="text-white/20 text-[10px] uppercase tracking-widest font-mono mt-1">Admin</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-[#08080a] h-screen sticky top-0">
        <div className="p-8 mb-8">
          <Link href="/admin" className="flex flex-col">
            <span className="text-gold font-serif text-3xl italic tracking-tighter shimmer-gold">SUGI</span>
            <span className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-black font-mono mt-2">Management</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const showBadge = item.name === 'Reservations' && unseenCount > 0;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-500 group ${
                  isActive 
                    ? 'bg-gold/10 text-gold border border-gold/20' 
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <item.icon size={20} className={isActive ? 'text-gold' : 'text-white/20 group-hover:text-gold/40 transition-colors'} />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="text-sm font-medium tracking-wide">{item.name}</span>
                </div>
                {isActive && <motion.div layoutId="activeNav" className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={async () => {
              // Simple logout logic
              document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              window.location.href = '/admin/login';
            }}
            className="flex items-center gap-4 p-4 w-full text-red-400/40 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all duration-500 group"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-40 bg-[#060608] pt-20 px-6 md:hidden"
          >
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 p-6 rounded-3xl border ${
                    pathname === item.href 
                      ? 'bg-gold/10 border-gold/20 text-gold' 
                      : 'bg-white/[0.02] border-white/5 text-white/40'
                  }`}
                >
                  <item.icon size={24} />
                  <span className="text-xl font-medium">{item.name}</span>
                </Link>
              ))}
              <button 
                onClick={() => {
                  document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                  window.location.href = '/admin/login';
                }}
                className="flex items-center gap-4 p-6 w-full bg-red-400/5 border border-red-400/10 text-red-400 rounded-3xl mt-8"
              >
                <LogOut size={24} />
                <span className="text-xl font-medium">Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

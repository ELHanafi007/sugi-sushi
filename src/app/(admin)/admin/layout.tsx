'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Tags, 
  LogOut, 
  Calendar,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Eye
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  // Build breadcrumbs from pathname
  const buildBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];
    
    segments.forEach((seg, i) => {
      const href = '/' + segments.slice(0, i + 1).join('/');
      let label = seg.charAt(0).toUpperCase() + seg.slice(1);
      
      // Friendly labels
      if (seg === 'admin' && i === 0) label = 'Dashboard';
      if (seg === 'products') label = 'Products';
      if (seg === 'categories') label = 'Categories';
      if (seg === 'reservations') label = 'Reservations';
      if (seg === 'new') label = 'New Product';
      if (seg.startsWith('prod-') || seg.startsWith('salad-') || seg.startsWith('soup-') || seg.startsWith('starter-') || seg.startsWith('wok-') || seg.startsWith('tempura-') || seg.startsWith('sugi-') || seg.startsWith('sashimi-') || seg.startsWith('tataki-') || seg.startsWith('ceviche-') || seg.startsWith('nigiri-') || seg.startsWith('gunkan-') || seg.startsWith('temaki-') || seg.startsWith('maki-') || seg.startsWith('aromaki-') || seg.startsWith('california-') || seg.startsWith('special-') || seg.startsWith('fried-') || seg.startsWith('box-') || seg.startsWith('boat-') || seg.startsWith('cold-') || seg.startsWith('juice-') || seg.startsWith('hot-') || seg.startsWith('dessert-') || seg.startsWith('sauce-')) {
        label = 'Edit';
      }
      
      crumbs.push({ label, href });
    });
    
    return crumbs;
  };

  const breadcrumbs = buildBreadcrumbs();
  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col">
      {/* ─── Desktop Layout ─── */}
      <div className="hidden md:flex flex-1">
        {/* Sidebar */}
        <motion.aside
          animate={{ width: sidebarCollapsed ? 80 : 260 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col border-r border-white/[0.06] bg-[#08080a] h-screen sticky top-0 overflow-hidden"
        >
          {/* Logo */}
          <div className={`p-6 ${sidebarCollapsed ? 'px-0 flex justify-center' : ''} border-b border-white/[0.04]`}>
            <Link href="/admin" className="flex flex-col items-center md:items-start">
              {sidebarCollapsed ? (
                <span className="text-gold font-serif text-2xl italic tracking-tighter shimmer-gold">S</span>
              ) : (
                <>
                  <span className="text-gold font-serif text-2xl italic tracking-tighter shimmer-gold">SUGI</span>
                  <span className="text-white/15 text-[9px] uppercase tracking-[0.35em] font-mono mt-1">Admin Panel</span>
                </>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const showBadge = item.name === 'Reservations' && unseenCount > 0;
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-300 group relative ${
                    sidebarCollapsed ? 'justify-center px-0' : 'px-4'
                  } ${
                    active 
                      ? 'bg-gold/[0.08] text-gold' 
                      : 'text-white/35 hover:text-white/70 hover:bg-white/[0.03]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gold"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div className="relative flex-shrink-0">
                    <item.icon size={20} strokeWidth={active ? 2 : 1.5} />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold rounded-full ring-2 ring-[#08080a] animate-pulse" />
                    )}
                  </div>
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-[13px] font-medium tracking-wide whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {showBadge && !sidebarCollapsed && (
                    <span className="ml-auto text-[10px] font-mono font-bold bg-gold/15 text-gold px-2 py-0.5 rounded-full">
                      {unseenCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className={`p-3 space-y-1 border-t border-white/[0.04] ${sidebarCollapsed ? '' : ''}`}>
            {/* View site */}
            <Link
              href="/"
              target="_blank"
              title={sidebarCollapsed ? 'View Live Site' : undefined}
              className={`flex items-center gap-3 py-3 rounded-xl text-white/25 hover:text-white/50 hover:bg-white/[0.02] transition-all ${
                sidebarCollapsed ? 'justify-center px-0' : 'px-4'
              }`}
            >
              <Eye size={18} strokeWidth={1.5} />
              {!sidebarCollapsed && <span className="text-[12px] font-medium tracking-wide">View Site</span>}
            </Link>
            
            {/* Collapse toggle */}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`flex items-center gap-3 py-3 rounded-xl text-white/20 hover:text-white/40 hover:bg-white/[0.02] transition-all w-full ${
                sidebarCollapsed ? 'justify-center px-0' : 'px-4'
              }`}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              {!sidebarCollapsed && <span className="text-[12px] font-medium tracking-wide">Collapse</span>}
            </button>

            {/* Logout */}
            <button 
              onClick={async () => {
                document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                window.location.href = '/admin/login';
              }}
              title={sidebarCollapsed ? 'Logout' : undefined}
              className={`flex items-center gap-3 py-3 rounded-xl text-red-400/30 hover:text-red-400 hover:bg-red-400/[0.04] transition-all w-full ${
                sidebarCollapsed ? 'justify-center px-0' : 'px-4'
              }`}
            >
              <LogOut size={18} />
              {!sidebarCollapsed && <span className="text-[12px] font-medium tracking-wide">Logout</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top bar with breadcrumbs */}
          <header className="sticky top-0 z-30 bg-[#060608]/80 backdrop-blur-xl border-b border-white/[0.04]">
            <div className="px-8 py-4 flex items-center justify-between">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1.5 text-[12px]">
                {breadcrumbs.map((crumb, i) => (
                  <span key={crumb.href} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight size={12} className="text-white/10" />}
                    {i === breadcrumbs.length - 1 ? (
                      <span className="text-white/60 font-medium">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="text-white/25 hover:text-white/50 transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </span>
                ))}
              </nav>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* ─── Mobile Layout ─── */}
      <div className="md:hidden flex flex-col flex-1">
        {/* Mobile Top Bar */}
        <header className="sticky top-0 z-50 bg-[#060608]/90 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-gold font-serif text-xl italic tracking-tight shimmer-gold">SUGI</span>
              <span className="text-white/15 text-[9px] uppercase tracking-[0.2em] font-mono mt-0.5">Admin</span>
            </Link>
            <button
              onClick={async () => {
                document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                window.location.href = '/admin/login';
              }}
              className="p-2 text-white/20 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
          
          {/* Breadcrumbs on mobile */}
          {breadcrumbs.length > 1 && (
            <div className="px-4 pb-2 flex items-center gap-1 text-[11px] overflow-x-auto no-scrollbar">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1 whitespace-nowrap">
                  {i > 0 && <ChevronRight size={10} className="text-white/10 flex-shrink-0" />}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-white/50 font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-white/20">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Mobile Content */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#08080a]/95 backdrop-blur-xl border-t border-white/[0.06] safe-area-bottom">
          <div className="flex items-stretch justify-around px-2 py-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const showBadge = item.name === 'Reservations' && unseenCount > 0;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all relative ${
                    active ? 'text-gold' : 'text-white/30'
                  }`}
                >
                  <div className="relative">
                    <item.icon size={20} strokeWidth={active ? 2 : 1.5} />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" />
                    )}
                  </div>
                  <span className={`text-[9px] font-mono uppercase tracking-wider ${active ? 'font-bold' : ''}`}>
                    {item.name}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="mobile-tab"
                      className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-gold"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

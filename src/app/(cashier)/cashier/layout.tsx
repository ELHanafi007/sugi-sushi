'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar,
  LogOut, 
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Don't show sidebar on login page
  if (pathname === '/cashier/login') {
    return <>{children}</>;
  }

  const isActive = (href: string) => {
    if (href === '/cashier') return pathname === '/cashier';
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
            <Link href="/cashier" className="flex flex-col items-center md:items-start">
              {sidebarCollapsed ? (
                <span className="text-gold font-serif text-2xl italic tracking-tighter shimmer-gold">S</span>
              ) : (
                <>
                  <span className="text-gold font-serif text-2xl italic tracking-tighter shimmer-gold">SUGI</span>
                  <span className="text-white/15 text-[9px] uppercase tracking-[0.35em] font-mono mt-1">Reservations</span>
                </>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            <Link 
              href="/cashier"
              title={sidebarCollapsed ? 'Reservations' : undefined}
              className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-300 group relative ${
                sidebarCollapsed ? 'justify-center px-0' : 'px-4'
              } ${
                isActive('/cashier') 
                  ? 'bg-gold/[0.08] text-gold' 
                  : 'text-white/35 hover:text-white/70 hover:bg-white/[0.03]'
              }`}
            >
              {isActive('/cashier') && (
                <motion.div
                  layoutId="cashier-sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Calendar size={20} strokeWidth={isActive('/cashier') ? 2 : 1.5} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-[13px] font-medium tracking-wide whitespace-nowrap overflow-hidden"
                  >
                    Reservations
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </nav>

          {/* Bottom actions */}
          <div className="p-3 space-y-1 border-t border-white/[0.04]">
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
                document.cookie = "cashier_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                window.location.href = '/cashier/login';
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
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-[#060608]/80 backdrop-blur-xl border-b border-white/[0.04]">
            <div className="px-8 py-4 flex items-center justify-between">
              <nav className="flex items-center gap-1.5 text-[12px]">
                <span className="text-white/60 font-medium">Reservations</span>
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
            <Link href="/cashier" className="flex items-center gap-2">
              <span className="text-gold font-serif text-xl italic tracking-tight shimmer-gold">SUGI</span>
              <span className="text-white/15 text-[9px] uppercase tracking-[0.2em] font-mono mt-0.5">Reservations</span>
            </Link>
            <button
              onClick={async () => {
                document.cookie = "cashier_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                window.location.href = '/cashier/login';
              }}
              className="p-2 text-white/20 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="flex-1 p-4 pb-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

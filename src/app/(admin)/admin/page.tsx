import { getMenu } from '@/lib/data';
import { 
  UtensilsCrossed, 
  Tags, 
  ArrowUpRight,
  PlusCircle,
  Eye,
  TrendingUp,
  AlertCircle,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const { categories, products } = await getMenu();

  // Stats
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const productsWithImages = products.filter(p => p.image).length;
  const productsWithoutPrice = products.filter(p => !p.price || p.price === '').length;
  const productsWithoutImages = totalProducts - productsWithImages;

  // Products grouped by category for quick summary
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: products.filter(p => p.category === cat).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-serif italic text-white/90">Dashboard</h1>
        <p className="text-white/25 text-[11px] font-mono uppercase tracking-widest mt-1">
          Menu overview & quick actions
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-gold/20 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/[0.08] flex items-center justify-center text-gold">
              <UtensilsCrossed size={18} />
            </div>
            <TrendingUp size={14} className="text-white/10 group-hover:text-gold/40 transition-colors" />
          </div>
          <p className="text-3xl font-serif italic text-white/90">{totalProducts}</p>
          <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest mt-1">Products</p>
        </div>

        {/* Total Categories */}
        <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-gold/20 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-400/[0.08] flex items-center justify-center text-blue-400">
              <Tags size={18} />
            </div>
          </div>
          <p className="text-3xl font-serif italic text-white/90">{totalCategories}</p>
          <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest mt-1">Categories</p>
        </div>

        {/* Products with images */}
        <div className="p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06] hover:border-gold/20 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/[0.08] flex items-center justify-center text-emerald-400">
              <Eye size={18} />
            </div>
          </div>
          <p className="text-3xl font-serif italic text-white/90">{productsWithImages}</p>
          <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest mt-1">With Images</p>
        </div>

        {/* Issues */}
        <div className={`p-5 rounded-2xl border transition-all group ${
          productsWithoutPrice > 0 
            ? 'bg-amber-400/[0.03] border-amber-400/10 hover:border-amber-400/25' 
            : 'bg-white/[0.025] border-white/[0.06] hover:border-gold/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              productsWithoutPrice > 0 ? 'bg-amber-400/[0.12] text-amber-400' : 'bg-white/[0.04] text-white/30'
            }`}>
              <AlertCircle size={18} />
            </div>
          </div>
          <p className={`text-3xl font-serif italic ${productsWithoutPrice > 0 ? 'text-amber-400' : 'text-white/90'}`}>
            {productsWithoutPrice}
          </p>
          <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest mt-1">Missing Price</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link 
          href="/admin/products/new"
          className="p-6 rounded-2xl bg-gold/[0.06] border border-gold/15 flex items-center gap-4 group hover:bg-gold/[0.1] hover:border-gold/25 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
            <PlusCircle size={22} />
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-white/90">Add Product</h3>
            <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest mt-0.5">Create new item</p>
          </div>
        </Link>

        <Link 
          href="/admin/products"
          className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 group hover:border-gold/20 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center text-white/30 group-hover:text-gold group-hover:bg-gold/10 transition-all">
            <UtensilsCrossed size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-medium text-white/90">Manage Products</h3>
            <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest mt-0.5">Edit & organize</p>
          </div>
          <ArrowUpRight size={16} className="text-white/10 group-hover:text-gold/50 transition-colors" />
        </Link>

        <Link 
          href="/admin/reservations"
          className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-4 group hover:border-gold/20 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center text-white/30 group-hover:text-gold group-hover:bg-gold/10 transition-all">
            <Calendar size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-medium text-white/90">Reservations</h3>
            <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest mt-0.5">View bookings</p>
          </div>
          <ArrowUpRight size={16} className="text-white/10 group-hover:text-gold/50 transition-colors" />
        </Link>
      </div>

      {/* Category Breakdown */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
          <h2 className="text-[13px] font-medium text-white/60">Products by Category</h2>
          <Link href="/admin/categories" className="text-[10px] font-mono uppercase tracking-widest text-gold/40 hover:text-gold transition-colors">
            Manage →
          </Link>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {categoryCounts.map((cat) => (
            <Link
              key={cat.name}
              href={`/admin/products?category=${encodeURIComponent(cat.name)}`}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-white/20 text-[13px] font-serif italic group-hover:bg-gold/10 group-hover:text-gold transition-all flex-shrink-0">
                  {cat.name.charAt(0)}
                </div>
                <span className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors truncate">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Mini progress bar */}
                <div className="hidden sm:block w-24 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gold/30 transition-all"
                    style={{ width: `${Math.min((cat.count / Math.max(...categoryCounts.map(c => c.count))) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[12px] font-mono text-white/30 w-6 text-right">{cat.count}</span>
                <ArrowUpRight size={12} className="text-white/10 group-hover:text-gold/40 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Attention-needed items */}
      {(productsWithoutPrice > 0 || productsWithoutImages > 0) && (
        <div className="rounded-2xl bg-amber-400/[0.03] border border-amber-400/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-400/[0.08] flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-400/60" />
            <h2 className="text-[13px] font-medium text-amber-400/70">Needs Attention</h2>
          </div>
          <div className="p-6 space-y-3">
            {productsWithoutPrice > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-white/40">
                  <span className="text-amber-400/70 font-medium">{productsWithoutPrice}</span> products missing price
                </span>
                <Link 
                  href="/admin/products?filter=no-price"
                  className="text-[10px] font-mono uppercase tracking-widest text-amber-400/40 hover:text-amber-400 transition-colors"
                >
                  View →
                </Link>
              </div>
            )}
            {productsWithoutImages > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-white/40">
                  <span className="text-amber-400/70 font-medium">{productsWithoutImages}</span> products without images
                </span>
                <Link 
                  href="/admin/products?filter=no-image"
                  className="text-[10px] font-mono uppercase tracking-widest text-amber-400/40 hover:text-amber-400 transition-colors"
                >
                  View →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

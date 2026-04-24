import { getMenu } from '@/lib/data';
import { 
  UtensilsCrossed, 
  Tags, 
  ArrowUpRight,
  PlusCircle,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const { categories, products } = await getMenu();

  const stats = [
    { name: 'Total Products', value: products.length, icon: UtensilsCrossed, color: 'text-gold' },
    { name: 'Total Categories', value: categories.length, icon: Tags, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-serif italic mb-2">Overview</h1>
        <p className="text-white/20 text-sm font-mono tracking-widest uppercase">Management Dashboard</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-gold/20 transition-all duration-700">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black font-mono mb-4">{stat.name}</p>
              <p className="text-5xl font-serif italic">{stat.value}</p>
            </div>
            <div className={`p-6 rounded-3xl bg-white/[0.04] ${stat.color} group-hover:scale-110 transition-transform duration-700`}>
              <stat.icon size={32} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link 
          href="/admin/products/new"
          className="p-8 rounded-[2.5rem] bg-gold text-black flex flex-col justify-between aspect-square lg:aspect-auto lg:h-64 group transition-all duration-700 hover:scale-[1.02]"
        >
          <PlusCircle size={40} />
          <div>
            <h3 className="text-2xl font-serif italic mb-2">Add New Product</h3>
            <p className="text-black/60 text-[10px] uppercase tracking-widest font-black font-mono">Expand your menu</p>
          </div>
        </Link>

        <Link 
          href="/admin/products"
          className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between aspect-square lg:aspect-auto lg:h-64 group transition-all duration-700 hover:border-gold/30"
        >
          <div className="flex justify-between items-start">
            <UtensilsCrossed size={40} className="text-white/20 group-hover:text-gold transition-colors" />
            <ArrowUpRight size={24} className="text-white/10 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>
          <div>
            <h3 className="text-2xl font-serif italic mb-2">Manage Products</h3>
            <p className="text-white/20 text-[10px] uppercase tracking-widest font-black font-mono group-hover:text-gold/60">Edit existing items</p>
          </div>
        </Link>

        <Link 
          href="/"
          target="_blank"
          className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between aspect-square lg:aspect-auto lg:h-64 group transition-all duration-700 hover:border-gold/30"
        >
          <div className="flex justify-between items-start">
            <Eye size={40} className="text-white/20 group-hover:text-gold transition-colors" />
            <ArrowUpRight size={24} className="text-white/10 group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>
          <div>
            <h3 className="text-2xl font-serif italic mb-2">View Live Site</h3>
            <p className="text-white/20 text-[10px] uppercase tracking-widest font-black font-mono group-hover:text-gold/60">Check changes</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity or Placeholder */}
      <div className="p-12 rounded-[3rem] bg-white/[0.01] border border-white/5 text-center">
        <p className="text-white/20 font-serif italic text-xl">System active. Ready for updates.</p>
      </div>
    </div>
  );
}

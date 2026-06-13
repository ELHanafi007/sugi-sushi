import { OrderSessionProvider } from '@/context/OrderSessionContext';
import CartDrawer from '@/components/CartDrawer';
import StickyCartBar from '@/components/StickyCartBar';

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderSessionProvider>
      <div className="min-h-screen bg-[#060608] pb-24">
        {children}
        <StickyCartBar />
        <CartDrawer isOrderFlow={true} />
      </div>
    </OrderSessionProvider>
  );
}

"use client";
import BottomNavWrapper from "@/components/BottomNavWrapper";
import CinematicReveal from "@/components/CinematicReveal";
import CartDrawer from "@/components/CartDrawer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CinematicReveal>
        {children}
      </CinematicReveal>
      <CartDrawer />
      <BottomNavWrapper />
    </>
  );
}


"use client";
import BottomNavWrapper from "@/components/BottomNavWrapper";
import CinematicReveal from "@/components/CinematicReveal";

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
      <BottomNavWrapper />
    </>
  );
}


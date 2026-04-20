'use client';

import React from 'react';
import { InteractiveMenu, InteractiveMenuItem } from "./modern-mobile-menu";
import { Home, Briefcase, Calendar, Shield, Settings } from 'lucide-react';

const lucideDemoMenuItems: InteractiveMenuItem[] = [
    { label: 'home', icon: Home }, 
    { label: 'strategy', icon: Briefcase }, 
    { label: 'period', icon: Calendar }, 
    { label: 'security', icon: Shield }, 
    { label: 'settings', icon: Settings }, 
];

const customAccentColor = 'var(--chart-2)';

const Default = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] bg-bg p-10">
      <InteractiveMenu />
    </div>
  );
};

const Customized = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px] bg-bg p-10">
      <InteractiveMenu items={lucideDemoMenuItems} accentColor={customAccentColor} />
    </div>
  );
};

export { Default, Customized };

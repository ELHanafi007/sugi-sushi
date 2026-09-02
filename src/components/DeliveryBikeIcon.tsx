'use client';

import React from 'react';

interface DeliveryBikeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export default function DeliveryBikeIcon({
  size = 20,
  className = '',
  ...props
}: DeliveryBikeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      {/* Rear Wheel */}
      <circle cx="4.5" cy="17.5" r="3.2" />
      <circle cx="4.5" cy="17.5" r="0.8" fill="currentColor" />

      {/* Front Wheel */}
      <circle cx="19.5" cy="17.5" r="3.2" />
      <circle cx="19.5" cy="17.5" r="0.8" fill="currentColor" />

      {/* Frame Geometry */}
      <path d="M4.5 17.5L11.5 17.5" />
      <path d="M11.5 17.5L9.8 10.5" />
      <path d="M4.5 17.5L9.8 10.5" />
      <path d="M9.8 10.5L15.5 10.5" />
      <path d="M11.5 17.5L15.5 10.5" />
      <path d="M19.5 17.5L15.5 10.5L15.2 8L13.6 8" />

      {/* Bicycle Saddle */}
      <path d="M8.5 10.5L11 10.5" strokeWidth="1.8" />

      {/* Courier Head & Helmet */}
      <circle cx="13" cy="4.2" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <path d="M13.8 4.1L15 4.7" strokeWidth="1.3" />

      {/* Courier Body & Arm */}
      <path d="M10 10.5L12.4 6.2L14.6 8" />

      {/* Pedaling Leg */}
      <path d="M10 10.5L12.3 14L11.5 17.5" />

      {/* Delivery Courier Backpack / Thermal Box */}
      <path
        d="M6.8 5.8L10 5.1L9.2 9.5L6 10.2Z"
        fill="currentColor"
        fillOpacity="0.2"
        strokeWidth="1.4"
      />
      <path d="M8.2 6.5L11.2 7.2" strokeWidth="1.2" strokeOpacity="0.7" />
    </svg>
  );
}

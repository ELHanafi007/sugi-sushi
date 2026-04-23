'use client';

import Image from 'next/image';

function splitPrice(price: string) {
  const trimmed = (price || '').trim();
  // Improved regex to handle case-insensitivity, optional spaces, and different positions
  // Matches "20 SR", "20SR", "SR 20", "20 SAR", etc.
  const match = trimmed.match(/^(\d+)\s*(SR|SAR)$/i) || trimmed.match(/^(SR|SAR)\s*(\d+)$/i);
  
  if (!match) return { amount: trimmed, hasRiyal: false };
  
  // If first group is SR/SAR, amount is in second group, otherwise first
  const amount = /SR|SAR/i.test(match[1]) ? match[2] : match[1];
  return { amount, hasRiyal: true };
}

export default function CurrencyPrice({
  price,
  className,
  iconClassName = 'w-4 h-4',
}: {
  price: string;
  className?: string;
  iconClassName?: string;
}) {
  const { amount, hasRiyal } = splitPrice(price);

  if (!amount) return null;

  return (
    <span className={`inline-flex items-center gap-2 ${className || ''}`}>
      <span>{amount}</span>
      {hasRiyal ? (
        <Image
          src="/media/optimized/Saudi_Riyal_Symbol.png"
          alt="SR"
          width={24}
          height={24}
          className={`${iconClassName} object-contain brightness-110`}
          unoptimized
          priority
        />
      ) : null}
    </span>
  );
}

'use client';

import Image from 'next/image';

function splitPrice(price: string) {
  const trimmed = (price || '').trim();
  const match = trimmed.match(/^(.*?)(?:\s*)(SR|SAR)$/i);
  if (!match) return { amount: trimmed, hasRiyal: false };
  return { amount: match[1].trim(), hasRiyal: true };
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
          alt="Saudi Riyal"
          width={16}
          height={16}
          className={iconClassName}
        />
      ) : null}
    </span>
  );
}

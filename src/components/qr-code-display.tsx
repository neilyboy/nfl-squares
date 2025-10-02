'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
  logoSrc?: string;
  title?: string;
}

export function QRCodeDisplay({
  url,
  size = 256,
  logoSrc,
  title,
}: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR Code generation error:', err));
  }, [url, size]);

  if (!qrCodeUrl) {
    return (
      <div
        className="flex items-center justify-center bg-muted rounded-lg"
        style={{ width: size, height: size }}
      >
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {title && (
        <div className="flex items-center gap-2">
          {logoSrc && (
            <Image
              src={logoSrc}
              alt={title}
              width={32}
              height={32}
              className="object-contain"
            />
          )}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="relative">
        <img
          src={qrCodeUrl}
          alt="QR Code"
          className="rounded-lg border-4 border-background"
        />
        {logoSrc && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg">
            <Image
              src={logoSrc}
              alt={title || 'Logo'}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        )}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:underline break-all max-w-[300px] text-center"
      >
        {url}
      </a>
    </div>
  );
}

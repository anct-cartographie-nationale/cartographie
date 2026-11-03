'use client';

import { toCanvas } from 'qrcode';
import { type RefObject, useEffect, useRef, useState } from 'react';

const QR_CODE_SIZE = 512;

export const useQrCode = (value: string): { canvasRef: RefObject<HTMLCanvasElement | null>; dataUrl: string | null } => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    let active = true;
    toCanvas(canvas, value, { width: QR_CODE_SIZE, margin: 2 }).then(() => {
      if (active) setDataUrl(canvas.toDataURL('image/png'));
    });
    return () => {
      active = false;
    };
  }, [value]);

  return { canvasRef, dataUrl };
};

'use client';

import { useEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';

const CANVAS_MAX_WIDTH = 500;
const CANVAS_MAX_HEIGHT = 220;
const CANVAS_RATIO = CANVAS_MAX_HEIGHT / CANVAS_MAX_WIDTH;

export function useSignaturePad(token: string | null) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const draftSignatureUrlRef = useRef<string | null>(null);
  const [draftSignatureUrlState, setDraftSignatureUrlState] = useState<
    string | null
  >(null);

  const setDraftSignatureUrl = (value: string | null) => {
    draftSignatureUrlRef.current = value;
    setDraftSignatureUrlState(value);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    let animationFrameId: number | null = null;

    const syncDraftSignaturePreview = () => {
      if (animationFrameId != null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(() => {
        const existingSignatureUrl = draftSignatureUrlRef.current;
        animationFrameId = null;
        setDraftSignatureUrl(
          padRef.current && !padRef.current.isEmpty()
            ? canvas.toDataURL('image/png')
            : existingSignatureUrl,
        );
      });
    };

    const resizeCanvas = () => {
      const parentWidth = canvas.parentElement?.clientWidth ?? CANVAS_MAX_WIDTH;
      const width = Math.max(Math.min(Math.floor(parentWidth), CANVAS_MAX_WIDTH), 1);
      const height = Math.max(Math.round(width * CANVAS_RATIO), 1);
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const existingSignatureUrl =
        padRef.current && !padRef.current.isEmpty()
          ? canvas.toDataURL('image/png')
          : draftSignatureUrlRef.current;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      if (existingSignatureUrl) {
        const image = new window.Image();
        image.onload = () => {
          context.clearRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
        };
        image.src = existingSignatureUrl;
      }

      setDraftSignatureUrl(existingSignatureUrl);
    };

    resizeCanvas();
    padRef.current = new SignaturePad(canvas, {
      minWidth: 1,
      maxWidth: 3,
      penColor: 'black',
    });

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('pointerdown', syncDraftSignaturePreview);
    canvas.addEventListener('pointermove', syncDraftSignaturePreview);
    canvas.addEventListener('pointerup', syncDraftSignaturePreview);
    canvas.addEventListener('pointerleave', syncDraftSignaturePreview);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('pointerdown', syncDraftSignaturePreview);
      canvas.removeEventListener('pointermove', syncDraftSignaturePreview);
      canvas.removeEventListener('pointerup', syncDraftSignaturePreview);
      canvas.removeEventListener('pointerleave', syncDraftSignaturePreview);
      if (animationFrameId != null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      padRef.current?.off();
      padRef.current = null;
    };
  }, []);

  useEffect(() => {
    padRef.current?.clear();
    setDraftSignatureUrl(null);
  }, [token]);

  const clearSignature = () => {
    padRef.current?.clear();
    setDraftSignatureUrl(null);
  };

  const readSignatureDataUrl = () => {
    if (draftSignatureUrlRef.current) {
      return draftSignatureUrlRef.current;
    }

    const pad = padRef.current;
    if (!pad || pad.isEmpty()) {
      return null;
    }

    return pad.toDataURL('image/png');
  };

  const saveSignature = () => {
    const dataUrl = readSignatureDataUrl();
    if (!dataUrl) {
      window.alert('Please draw your signature first.');
      return;
    }

    console.log(dataUrl);
    setDraftSignatureUrl(dataUrl);

    const newWindow = window.open('');
    if (newWindow) {
      newWindow.document.write(`<img src="${dataUrl}" alt="signature" />`);
    }
  };

  return {
    canvasRef,
    clearSignature,
    draftSignatureUrl: draftSignatureUrlState,
    readSignatureDataUrl,
    saveSignature,
  };
}

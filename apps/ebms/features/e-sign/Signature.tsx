'use client';

import { useEffect, useRef } from 'react';
import SignaturePad from 'signature_pad';

export default function SignPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = canvas.parentElement?.clientWidth ?? 560;
      const height = 360;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext('2d');
      if (!context) return;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      padRef.current?.clear();
    };

    resizeCanvas();

    padRef.current = new SignaturePad(canvas, {
      backgroundColor: 'rgba(0,0,0,0)',
      penColor: '#0b1832',
      minWidth: 1.2,
      maxWidth: 2.8,
    });

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      padRef.current?.off();
      padRef.current = null;
    };
  }, []);

  const handleApprove = () => {
    if (padRef.current?.isEmpty()) {
      window.alert('Please sign before approving.');
      return;
    }

    console.log('Signature approved');
  };

  return (
    <div className="w-full max-w-[670px] overflow-hidden rounded-[28px] bg-[#08101c]/95 shadow-[0_40px_80px_rgba(0,0,0,0.38)]">
      <div className="px-12 py-10">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-white">
          Signing Form
        </h1>

        <div className="mt-10 flex items-start justify-between gap-10">
          <div>
            <p className="text-[20px] text-[#7d92be]">Narantsatsral.B</p>
            <p className="mt-1 text-[22px] text-[#f0f4ff]">
              Salary Increase Notice ↗
            </p>
          </div>

          <div className="text-right">
            <p className="text-[20px] text-[#7d92be]">Jun 15, 2026</p>
            <p className="text-[22px] text-[#f0f4ff]">09:14</p>
          </div>
        </div>

        <div className="mt-10 h-px bg-[#2b4d89]/85" />

        <h2 className="mt-8 text-[28px] font-semibold text-white">Sign Here</h2>

        <div className="mt-8 rounded-[18px] bg-[#8fa1c1] p-0">
          <canvas
            ref={canvasRef}
            className="block w-full rounded-[18px] touch-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleApprove}
        className="flex h-[70px] w-full items-center justify-center bg-[#23478a] text-[24px] font-semibold text-white"
      >
        Approve
      </button>
    </div>
  );
}

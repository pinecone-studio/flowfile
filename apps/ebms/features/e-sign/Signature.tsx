'use client'

import { useEffect, useRef } from 'react'
import SignaturePad from 'signature_pad'

export default function SignPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const signaturePadRef = useRef<SignaturePad | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = 500 * ratio
      canvas.height = 220 * ratio
      canvas.style.width = '500px'
      canvas.style.height = '220px'

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(ratio, ratio)

      signaturePadRef.current?.clear()
    }

    resizeCanvas()

    signaturePadRef.current = new SignaturePad(canvas, {
      minWidth: 1,
      maxWidth: 3,
      penColor: 'black',
    })

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      signaturePadRef.current?.off()
      signaturePadRef.current = null
    }
  }, [])

  const clearSignature = () => {
    signaturePadRef.current?.clear()
  }

  const saveSignature = () => {
    const pad = signaturePadRef.current
    if (!pad || pad.isEmpty()) {
      alert('Please draw your signature first.')
      return
    }

    const dataUrl = pad.toDataURL('image/png')
    console.log(dataUrl)

    const newWindow = window.open('')
    if (newWindow) {
      newWindow.document.write(`<img src="${dataUrl}" alt="signature" />`)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Sign here</h1>

      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          touchAction: 'none',
          display: 'block',
          background: '#fff',
        }}
      />

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={clearSignature}>Clear</button>
        <button onClick={saveSignature}>Save</button>
      </div>
    </div>
  )
}
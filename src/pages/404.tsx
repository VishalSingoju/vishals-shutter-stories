// pages/404.tsx or src/pages/404.tsx
import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';

const APERTURES = [
  { label: 'f/1.4', val: 1.4 },
  { label: 'f/2.8', val: 2.8 },
  { label: 'f/5.6', val: 5.6 },
  { label: 'f/8.0', val: 8.0 },
  { label: 'f/16', val: 16.0 },
];

const SHUTTERS = [
  { label: '1/1000s', val: 1 / 1000 },
  { label: '1/250s', val: 1 / 250 },
  { label: '1/60s', val: 1 / 60 },
  { label: '1/15s', val: 1 / 15 },
  { label: '1s', val: 1.0 },
];

const ISOS = [
  { label: '100', val: 100 },
  { label: '400', val: 400 },
  { label: '800', val: 800 },
  { label: '1600', val: 1600 },
  { label: '6400', val: 6400 },
];

export default function Custom404() {
  const [apertureIdx, setApertureIdx] = useState(4);
  const [shutterIdx, setShutterIdx] = useState(0);
  const [isoIdx, setIsoIdx] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [flash, setFlash] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playMechanicalShutter = async () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Mirror slap up
      const mirrorOsc = ctx.createOscillator();
      const mirrorGain = ctx.createGain();
      mirrorOsc.type = 'triangle';
      mirrorOsc.frequency.setValueAtTime(140, now);
      mirrorOsc.frequency.exponentialRampToValueAtTime(20, now + 0.035);
      mirrorGain.gain.setValueAtTime(0.8, now);
      mirrorGain.gain.exponentialRampToValueAtTime(0.01, now + 0.035);
      mirrorOsc.connect(mirrorGain);
      mirrorGain.connect(ctx.destination);
      mirrorOsc.start(now);
      mirrorOsc.stop(now + 0.035);

      // 2. Shutter Curtain Click 1
      const curtain1 = ctx.createOscillator();
      const curtain1Gain = ctx.createGain();
      curtain1.type = 'square';
      curtain1.frequency.setValueAtTime(320, now + 0.015);
      curtain1Gain.gain.setValueAtTime(0.9, now + 0.015);
      curtain1Gain.gain.exponentialRampToValueAtTime(0.01, now + 0.055);
      curtain1.connect(curtain1Gain);
      curtain1Gain.connect(ctx.destination);
      curtain1.start(now + 0.015);
      curtain1.stop(now + 0.055);

      // 3. Shutter Curtain Click 2 & Mirror Return
      const curtain2 = ctx.createOscillator();
      const curtain2Gain = ctx.createGain();
      curtain2.type = 'sawtooth';
      curtain2.frequency.setValueAtTime(220, now + 0.075);
      curtain2Gain.gain.setValueAtTime(0.7, now + 0.075);
      curtain2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      curtain2.connect(curtain2Gain);
      curtain2Gain.connect(ctx.destination);
      curtain2.start(now + 0.075);
      curtain2.stop(now + 0.12);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  };

  const evDifference = useMemo(() => {
    const N = APERTURES[apertureIdx].val;
    const t = SHUTTERS[shutterIdx].val;
    const S = ISOS[isoIdx].val;
    const ev = Math.log2((N * N) / t) - Math.log2(S / 100);
    return Number((8.0 - ev).toFixed(1));
  }, [apertureIdx, shutterIdx, isoIdx]);

  const isBalanced = Math.abs(evDifference) < 0.5;

  const handleTakeShot = async () => {
    if (!isBalanced || unlocked) return;
    await playMechanicalShutter();
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      setUnlocked(true);
    }, 180);
  };

  const previewBrightness = Math.min(Math.max(100 + evDifference * 28, 5), 250);

  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0a0a0c',
        color: '#f4f4f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'monospace, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {flash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#ffffff',
            zIndex: 9999,
          }}
        />
      )}

      {/* Camera LCD Shell */}
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          borderRadius: '24px',
          border: '1px solid #27272a',
          backgroundColor: '#121215',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Header Ribbon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 24px',
            backgroundColor: '#18181c',
            borderBottom: '1px solid #27272a',
            fontSize: '11px',
            color: '#a1a1aa',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>● REC</span>
            <span>|</span>
            <span style={{ color: '#fbbf24' }}>M-MODE</span>
            <span>|</span>
            <span style={{ color: '#e4e4e7' }}>RAW + FINE</span>
          </div>
          <div>SD: [942 REM] • 88% BATTERY</div>
        </div>

        {/* Layout Body */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            padding: '24px',
          }}
        >
          {/* Viewfinder Monitor */}
          <div>
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '16px',
                border: '1px solid #27272a',
                backgroundColor: '#050507',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                filter: unlocked ? 'none' : `brightness(${previewBrightness}%)`,
                transition: 'filter 0.2s ease',
                position: 'relative',
              }}
            >
              {/* AF Box */}
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  border: isBalanced ? '2px solid #34d399' : '2px solid #52525b',
                  backgroundColor: isBalanced ? 'rgba(52, 211, 153, 0.1)' : 'transparent',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isBalanced ? '#34d399' : '#ef4444',
                  }}
                />
              </div>

              {!unlocked ? (
                <p style={{ marginTop: '16px', fontSize: '11px', color: '#d4d4d8' }}>
                  {evDifference < -2
                    ? '⚠️ UNDEREXPOSED (Too Dark)'
                    : evDifference > 2
                    ? '⚠️ OVEREXPOSED (Blown Out)'
                    : isBalanced
                    ? '✨ EXPOSURE LOCKED • Ready'
                    : 'Adjust dials to balance EV meter'}
                </p>
              ) : (
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <div style={{ fontSize: '32px' }}>🏆</div>
                  <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '13px' }}>
                    Tack Sharp Shot Captured!
                  </div>
                </div>
              )}
            </div>

            {/* Readout Strip */}
            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '10px',
                backgroundColor: '#18181c',
                borderRadius: '12px',
                border: '1px solid #27272a',
                fontSize: '12px',
                color: '#fbbf24',
                fontWeight: 'bold',
              }}
            >
              <span>{APERTURES[apertureIdx].label}</span>
              <span>{SHUTTERS[shutterIdx].label}</span>
              <span>ISO {ISOS[isoIdx].label}</span>
              <span style={{ color: isBalanced ? '#34d399' : '#a1a1aa' }}>
                {evDifference > 0 ? `+${evDifference}` : evDifference} EV
              </span>
            </div>
          </div>

          {/* Controls Deck */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                ERROR 404
              </span>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>
                Subject Out of Frame
              </h1>
              <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '8px', lineHeight: 1.5 }}>
                Someone forgot to remove the lens cap. We zoomed in, adjusted dials, and spun the shutter... but this route completely missed focus.
              </p>
            </div>

            {/* Select Dials */}
            <div
              style={{
                backgroundColor: '#18181c',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid #27272a',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                    APERTURE
                  </label>
                  <select
                    value={apertureIdx}
                    onChange={(e) => setApertureIdx(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#101012',
                      border: '1px solid #3f3f46',
                      color: '#ffffff',
                      fontSize: '11px',
                    }}
                  >
                    {APERTURES.map((item, idx) => (
                      <option key={item.label} value={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '10px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                    SHUTTER
                  </label>
                  <select
                    value={shutterIdx}
                    onChange={(e) => setShutterIdx(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#101012',
                      border: '1px solid #3f3f46',
                      color: '#ffffff',
                      fontSize: '11px',
                    }}
                  >
                    {SHUTTERS.map((item, idx) => (
                      <option key={item.label} value={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '10px', color: '#a1a1aa', display: 'block', marginBottom: '4px' }}>
                    ISO
                  </label>
                  <select
                    value={isoIdx}
                    onChange={(e) => setIsoIdx(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: '#101012',
                      border: '1px solid #3f3f46',
                      color: '#ffffff',
                      fontSize: '11px',
                    }}
                  >
                    {ISOS.map((item, idx) => (
                      <option key={item.label} value={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shutter Button */}
              <button
                onClick={handleTakeShot}
                disabled={!isBalanced || unlocked}
                style={{
                  marginTop: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isBalanced && !unlocked ? '#dc2626' : '#27272a',
                  color: isBalanced && !unlocked ? '#ffffff' : '#71717a',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  cursor: isBalanced && !unlocked ? 'pointer' : 'not-allowed',
                }}
              >
                {unlocked ? '✨ Shot Captured' : isBalanced ? '📷 Take Shot (Exposure Balanced)' : '🔒 Balance EV Meter to Unlock'}
              </button>
            </div>

            {/* Return Link */}
            <Link
              href="/"
              onClick={playMechanicalShutter}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                color: '#09090b',
                fontWeight: 'bold',
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              Return to Home →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
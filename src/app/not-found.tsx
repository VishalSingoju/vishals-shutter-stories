'use client';

import { useState, useMemo, useRef } from 'react';
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

export default function NotFound() {
  const [apertureIdx, setApertureIdx] = useState(4); // Start underexposed at f/16
  const [shutterIdx, setShutterIdx] = useState(0);   // 1/1000s
  const [isoIdx, setIsoIdx] = useState(0);           // ISO 100
  const [unlocked, setUnlocked] = useState(false);
  const [flash, setFlash] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // High-Fidelity Mechanical DSLR Shutter Sound Generator
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

      // 2. Front mechanical shutter curtain snap
      const curtain1 = ctx.createOscillator();
      const curtain1Gain = ctx.createGain();
      curtain1.type = 'square';
      curtain1.frequency.setValueAtTime(320, now + 0.015);
      curtain1.frequency.exponentialRampToValueAtTime(60, now + 0.055);
      curtain1Gain.gain.setValueAtTime(0.9, now + 0.015);
      curtain1Gain.gain.exponentialRampToValueAtTime(0.01, now + 0.055);
      curtain1.connect(curtain1Gain);
      curtain1Gain.connect(ctx.destination);
      curtain1.start(now + 0.015);
      curtain1.stop(now + 0.055);

      // 3. Rear curtain snap & spring recoil
      const curtain2 = ctx.createOscillator();
      const curtain2Gain = ctx.createGain();
      curtain2.type = 'sawtooth';
      curtain2.frequency.setValueAtTime(220, now + 0.075);
      curtain2.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      curtain2Gain.gain.setValueAtTime(0.7, now + 0.075);
      curtain2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      curtain2.connect(curtain2Gain);
      curtain2Gain.connect(ctx.destination);
      curtain2.start(now + 0.075);
      curtain2.stop(now + 0.12);

      // 4. Textured mechanical friction burst
      const bufferSize = ctx.sampleRate * 0.04;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1400;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start(now + 0.01);
      whiteNoise.stop(now + 0.05);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  };

  // EV Delta Calculation (Logarithmic exposure scale)
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
    <main className="relative min-h-screen w-full bg-[#0a0a0c] text-zinc-100 flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 select-none overflow-hidden">
      {/* Visual Flash Overlay */}
      {flash && <div className="fixed inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150" />}

      {/* Subtle Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,30,40,0.5),transparent_70%)] pointer-events-none" />

      {/* Master 16:9 Pro Camera Monitor Shell */}
      <div className="relative w-full max-w-5xl rounded-3xl border border-zinc-800/80 bg-[#121215] shadow-2xl shadow-black/80 flex flex-col overflow-hidden backdrop-blur-xl">
        
        {/* Top Camera LCD HUD Ribbon */}
        <header className="flex items-center justify-between px-6 py-3.5 bg-[#18181c] border-b border-zinc-800/80 text-[11px] font-mono tracking-wider text-zinc-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold text-red-500">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span>REC</span>
            </div>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="text-amber-400 font-semibold">M-MODE</span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="text-zinc-300">RAW + FINE</span>
            <span className="hidden md:inline text-zinc-500">4K 60FPS</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-zinc-400 font-mono">SD: [942 REM]</span>
            <div className="flex items-center gap-1.5 border border-zinc-700 px-2 py-0.5 rounded text-[10px] text-zinc-300">
              <span className="font-semibold text-emerald-400">88%</span>
              <div className="w-3.5 h-2 border border-zinc-400 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>
        </header>

        {/* Camera Main Body: Split Desktop Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-8 items-stretch">
          
          {/* LEFT: 16:9 Optical Viewfinder / Screen (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div 
              className="relative w-full aspect-video rounded-2xl border border-zinc-800 bg-[#050507] flex flex-col items-center justify-center overflow-hidden transition-all duration-300 shadow-inner group"
              style={{
                filter: unlocked ? 'none' : `brightness(${previewBrightness}%)`,
              }}
            >
              {/* Professional Rule of Thirds Grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Viewfinder Autofocus Brackets */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-red-500/70" />
              <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-red-500/70" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-red-500/70" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-red-500/70" />

              {/* Center AF Target Crosshair */}
              <div className={`relative flex items-center justify-center transition-transform duration-300 ${isBalanced ? 'scale-110' : 'scale-100'}`}>
                <div className={`w-14 h-14 border rounded-lg transition-colors duration-200 ${isBalanced ? 'border-emerald-400 bg-emerald-500/10' : 'border-zinc-600/80'}`} />
                <div className={`absolute w-2 h-2 rounded-full ${isBalanced ? 'bg-emerald-400' : 'bg-red-500/60'}`} />
              </div>

              {/* Inside Display State */}
              {!unlocked ? (
                <div className="absolute bottom-4 left-0 right-0 px-4 text-center">
                  <p className="text-xs font-mono font-medium tracking-wide text-zinc-300 drop-shadow-md">
                    {evDifference < -2
                      ? '⚠️ [UNDEREXPOSED] Increase ISO or widen aperture'
                      : evDifference > 2
                      ? '⚠️ [OVEREXPOSED] Faster shutter or narrow aperture'
                      : isBalanced
                      ? '✨ [EXPOSURE LOCKED] Ready to snap'
                      : 'Adjust exposure dials to balance EV meter'}
                  </p>
                </div>
              ) : (
                <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
                  <span className="text-5xl mb-2">🏆</span>
                  <h3 className="text-lg font-bold font-mono text-emerald-400">
                    Tack Sharp Shot Captured!
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1 max-w-sm">
                    Exposure calibrated perfectly at 0.0 EV. You mastered the Exposure Triangle!
                  </p>
                </div>
              )}
            </div>

            {/* Live Camera Bottom Parameters Strip */}
            <div className="mt-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#18181c] border border-zinc-800/80 font-mono text-xs text-zinc-300">
              <span className="text-amber-400 font-bold">{APERTURES[apertureIdx].label}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-400 font-bold">{SHUTTERS[shutterIdx].label}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-400 font-bold">ISO {ISOS[isoIdx].label}</span>
              <span className="text-zinc-600">•</span>
              <span className={isBalanced ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                {evDifference > 0 ? `+${evDifference}` : evDifference} EV
              </span>
            </div>
          </div>

          {/* RIGHT: Dial Deck & Controls (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Header / Error Description */}
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-mono text-red-400 font-semibold mb-2">
                ERROR 404
              </div>
              <h1 className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-white">
                Subject Out of Frame
              </h1>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Looks like someone forgot to remove the lens cap. We zoomed in, spun the dials, and balanced the shutter... but this route completely missed focus.
              </p>
            </div>

            {/* Exposure Controls Module */}
            <div className="p-4 rounded-2xl bg-[#18181c] border border-zinc-800/80 space-y-4">
              <div className="grid grid-cols-3 gap-2.5">
                
                {/* Aperture Control */}
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1.5">
                    Aperture
                  </label>
                  <select
                    value={apertureIdx}
                    onChange={(e) => setApertureIdx(Number(e.target.value))}
                    className="w-full bg-[#101012] border border-zinc-700/80 hover:border-zinc-500 text-zinc-100 rounded-lg py-2 px-2.5 text-xs font-mono focus:outline-none focus:border-amber-400 transition cursor-pointer"
                  >
                    {APERTURES.map((item, idx) => (
                      <option key={item.label} value={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shutter Control */}
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1.5">
                    Shutter
                  </label>
                  <select
                    value={shutterIdx}
                    onChange={(e) => setShutterIdx(Number(e.target.value))}
                    className="w-full bg-[#101012] border border-zinc-700/80 hover:border-zinc-500 text-zinc-100 rounded-lg py-2 px-2.5 text-xs font-mono focus:outline-none focus:border-amber-400 transition cursor-pointer"
                  >
                    {SHUTTERS.map((item, idx) => (
                      <option key={item.label} value={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ISO Control */}
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1.5">
                    ISO
                  </label>
                  <select
                    value={isoIdx}
                    onChange={(e) => setIsoIdx(Number(e.target.value))}
                    className="w-full bg-[#101012] border border-zinc-700/80 hover:border-zinc-500 text-zinc-100 rounded-lg py-2 px-2.5 text-xs font-mono focus:outline-none focus:border-amber-400 transition cursor-pointer"
                  >
                    {ISOS.map((item, idx) => (
                      <option key={item.label} value={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* EV Bar Indicator */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1.5">
                  <span>-3 EV</span>
                  <span className={`font-bold ${isBalanced ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {evDifference > 0 ? `+${evDifference}` : evDifference} EV
                  </span>
                  <span>+3 EV</span>
                </div>

                <div className="relative w-full h-2 bg-[#101012] rounded-full overflow-hidden border border-zinc-800">
                  <div className="absolute left-[45%] w-[10%] h-full bg-emerald-500/40" />
                  <div
                    className={`absolute top-0 w-2 h-full rounded-full transition-all duration-200 ${
                      isBalanced ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
                    }`}
                    style={{
                      left: `${Math.min(Math.max(((evDifference + 3) / 6) * 100, 0), 96)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Shutter Release Button */}
              <button
                onClick={handleTakeShot}
                disabled={!isBalanced || unlocked}
                className={`w-full py-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition active:scale-[0.98] ${
                  isBalanced && !unlocked
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950 cursor-pointer animate-pulse'
                    : 'bg-[#222228] text-zinc-500 border border-zinc-800 cursor-not-allowed'
                }`}
              >
                {unlocked ? '✨ Shot Captured' : isBalanced ? '📷 Take Shot (Balanced)' : '🔒 Balance EV Meter'}
              </button>
            </div>

            {/* Navigation Return Home Action */}
            <div className="pt-2">
              <Link
                href="/"
                
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider transition active:scale-95 shadow-md"
              >
                <span>Return to Home</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
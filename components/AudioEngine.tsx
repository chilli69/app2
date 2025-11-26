import React, { useEffect, useRef } from 'react';
import { WaveParams } from '../types';

interface AudioEngineProps {
  params: WaveParams;
  isPlaying: boolean;
  muted: boolean;
}

const AudioEngine: React.FC<AudioEngineProps> = ({ params, isPlaying, muted }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // Initialize Audio Context
  useEffect(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      
      const ctx = audioCtxRef.current;
      
      // Master Gain
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);
      gainNode.gain.value = 0;
      gainRef.current = gainNode;

      // Main Oscillator
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.connect(gainNode);
      osc.start();
      oscillatorRef.current = osc;

      // LFO (Low Frequency Oscillator) to modulate pitch based on wave speed
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.5;
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 50; // Modulation depth
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      lfoRef.current = lfo;
    }

    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  // Update Audio Params based on Wave Params
  useEffect(() => {
    if (!oscillatorRef.current || !lfoRef.current || !audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Map visual params to audio params
    // Frequency -> Pitch (Base)
    // Low freq (visual) = Low pitch. High freq = High pitch.
    // Range: 0.001 - 0.1 -> 60Hz - 600Hz
    const targetPitch = 60 + (params.frequency * 5000); 

    // Complexity -> Waveform type
    if (params.complexity < 3) oscillatorRef.current.type = 'sine';
    else if (params.complexity < 6) oscillatorRef.current.type = 'triangle';
    else oscillatorRef.current.type = 'sawtooth';

    // Smooth transition for pitch
    oscillatorRef.current.frequency.setTargetAtTime(targetPitch, now, 0.2);

    // Speed -> LFO Frequency (Modulation speed)
    lfoRef.current.frequency.setTargetAtTime(params.speed * 20, now, 0.2);

  }, [params]);

  // Handle Mute/Play State
  useEffect(() => {
    if (!gainRef.current || !audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    if (isPlaying && !muted) {
      if (ctx.state === 'suspended') ctx.resume();
      // Fade in
      gainRef.current.gain.setTargetAtTime(0.15, now, 0.1); // Keep volume low/ambient
    } else {
      // Fade out
      gainRef.current.gain.setTargetAtTime(0, now, 0.1);
    }
  }, [isPlaying, muted]);

  return null; // Headless component
};

export default AudioEngine;
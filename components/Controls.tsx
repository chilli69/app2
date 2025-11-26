import React, { useState } from 'react';
import { Mic, Send, Volume2, VolumeX, Pause, Play, Sliders, Sparkles } from 'lucide-react';
import { WaveParams } from '../types';

interface ControlsProps {
  prompt: string;
  setPrompt: (s: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isPlaying: boolean;
  togglePlay: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  currentParams: WaveParams;
  setParams: (p: WaveParams) => void;
}

const Controls: React.FC<ControlsProps> = ({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  isPlaying,
  togglePlay,
  isMuted,
  toggleMute,
  currentParams,
  setParams
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleParamChange = (key: keyof WaveParams, value: number) => {
    setParams({ ...currentParams, [key]: value });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 z-10 flex justify-center items-end pointer-events-none">
      <div className="w-full max-w-2xl glass-panel rounded-2xl p-4 pointer-events-auto shadow-2xl shadow-synth-primary/20 transition-all duration-300">
        
        {/* Main Input Area */}
        <div className="flex gap-2 items-center mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
              placeholder="Describe a wave (e.g., 'Neon Tokyo Drift', 'Calm Ocean', 'Panic Attack')..."
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-synth-primary focus:ring-1 focus:ring-synth-primary transition-all"
            />
            <Sparkles className={`absolute right-3 top-3.5 w-5 h-5 text-synth-primary ${isGenerating ? 'animate-spin' : 'opacity-50'}`} />
          </div>
          
          <button
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-synth-primary hover:bg-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-lg shadow-synth-primary/30"
          >
            <Send size={20} />
          </button>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <div className="h-4 w-[1px] bg-white/20 mx-2"></div>
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${showAdvanced ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
            >
              <Sliders size={16} />
              <span className="hidden sm:inline">Tweak Wave</span>
            </button>
          </div>
          
          <div className="text-xs text-white/40 font-mono hidden sm:block">
             powered by Gemini 2.5
          </div>
        </div>

        {/* Advanced Sliders */}
        {showAdvanced && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-1">
              <label className="text-xs text-white/60 font-mono">Frequency</label>
              <input 
                type="range" min="0.001" max="0.1" step="0.001"
                value={currentParams.frequency}
                onChange={(e) => handleParamChange('frequency', parseFloat(e.target.value))}
                className="w-full accent-synth-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/60 font-mono">Amplitude</label>
              <input 
                type="range" min="10" max="200" step="1"
                value={currentParams.amplitude}
                onChange={(e) => handleParamChange('amplitude', parseFloat(e.target.value))}
                className="w-full accent-synth-secondary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/60 font-mono">Speed</label>
              <input 
                type="range" min="0" max="0.2" step="0.001"
                value={currentParams.speed}
                onChange={(e) => handleParamChange('speed', parseFloat(e.target.value))}
                className="w-full accent-synth-accent h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
             <div className="space-y-1">
              <label className="text-xs text-white/60 font-mono">Complexity</label>
              <input 
                type="range" min="1" max="10" step="1"
                value={currentParams.complexity}
                onChange={(e) => handleParamChange('complexity', parseFloat(e.target.value))}
                className="w-full accent-pink-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/60 font-mono">Tension</label>
              <input 
                type="range" min="0.1" max="3" step="0.1"
                value={currentParams.tension}
                onChange={(e) => handleParamChange('tension', parseFloat(e.target.value))}
                className="w-full accent-orange-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Controls;
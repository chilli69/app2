import React, { useState, useCallback } from 'react';
import WaveCanvas from './components/WaveCanvas';
import AudioEngine from './components/AudioEngine';
import Controls from './components/Controls';
import { generateWaveFromPrompt } from './services/geminiService';
import { WaveTheme, DEFAULT_WAVE, WaveParams } from './types';
import { Waves } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [theme, setTheme] = useState<WaveTheme>(DEFAULT_WAVE);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default muted for browser policy
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const newTheme = await generateWaveFromPrompt(prompt);
      setTheme(newTheme);
      // If user generates, they likely want to hear it, but we respect the mute toggle mostly. 
      // If it's their first interaction, they might need to unmute manually.
    } catch (err) {
      console.error(err);
      setError("Failed to generate wave. Try a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleParamUpdate = useCallback((newParams: WaveParams) => {
    setTheme(prev => ({ ...prev, params: newParams }));
  }, []);

  return (
    <div className="relative w-full h-screen bg-synth-bg text-white selection:bg-synth-primary selection:text-white overflow-hidden">
      
      {/* Background/Visualizer */}
      <WaveCanvas 
        colors={theme.colors} 
        params={theme.params} 
        isPlaying={isPlaying} 
      />

      {/* Audio Layer (Headless) */}
      <AudioEngine 
        params={theme.params}
        isPlaying={isPlaying}
        muted={isMuted}
      />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-8 pointer-events-none z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-start">
          <div className="glass-panel p-4 rounded-xl border-l-4 border-l-synth-primary">
             <div className="flex items-center gap-2 mb-1">
                <Waves className="text-synth-primary" />
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-synth-primary to-synth-accent bg-clip-text text-transparent">
                  {theme.name}
                </h1>
             </div>
             <p className="text-white/80 max-w-md text-sm leading-relaxed">
               {theme.description}
             </p>
          </div>

          {/* Error Toast */}
          {error && (
            <div className="absolute top-24 right-6 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce pointer-events-auto cursor-pointer" onClick={() => setError(null)}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Main Controls */}
      <Controls 
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        isPlaying={isPlaying}
        togglePlay={() => setIsPlaying(!isPlaying)}
        isMuted={isMuted}
        toggleMute={() => setIsMuted(!isMuted)}
        currentParams={theme.params}
        setParams={handleParamUpdate}
      />
      
    </div>
  );
};

export default App;
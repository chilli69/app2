export interface WaveParams {
  frequency: number; // 0.001 to 0.1
  amplitude: number; // 10 to 200
  speed: number; // 0.001 to 0.1
  complexity: number; // 1 to 10 (number of sine layers)
  tension: number; // 0.1 to 2.0 (sharpness of peaks)
}

export interface WaveTheme {
  name: string;
  description: string;
  colors: string[]; // Array of hex strings
  params: WaveParams;
}

export const DEFAULT_WAVE: WaveTheme = {
  name: "Resting State",
  description: "The calm before the surge. Waiting for input...",
  colors: ["#2dd4bf", "#0ea5e9", "#6366f1"],
  params: {
    frequency: 0.01,
    amplitude: 50,
    speed: 0.02,
    complexity: 3,
    tension: 1.0,
  }
};
// Generate procedural audio effects using Web Audio API
// These can be replaced with real audio files later

export function createFootstepsAudio(): string {
  // Create a simple footstep pattern using Web Audio API
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const duration = 4; // 4 seconds
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
  const data = buffer.getChannelData(0);

  // Generate footstep sounds (4 steps, alternating)
  const stepTimes = [0.5, 1.2, 1.9, 2.6, 3.3]; // Times for each footstep
  
  for (const stepTime of stepTimes) {
    const startSample = Math.floor(stepTime * sampleRate);
    const stepDuration = 0.15; // Each step is 150ms
    const stepSamples = Math.floor(stepDuration * sampleRate);
    
    // Generate a "thud" sound (low frequency burst with decay)
    for (let i = 0; i < stepSamples; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 15); // Exponential decay
      const freq = 60 + Math.random() * 40; // Low frequency rumble
      const noise = (Math.random() * 2 - 1) * 0.3; // Some noise
      const tone = Math.sin(2 * Math.PI * freq * t) * 0.5;
      
      if (startSample + i < data.length) {
        data[startSample + i] = (tone + noise) * decay * 0.4;
      }
    }
  }

  // Convert buffer to WAV blob URL
  return bufferToWavUrl(buffer);
}

export function createDoorClosingAudio(): string {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const duration = 2; // 2 seconds
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
  const data = buffer.getChannelData(0);

  // Door closing sound: creak + thud + click
  const creakStart = 0.1;
  const creakDuration = 0.8;
  const thudTime = 1.0;
  const clickTime = 1.1;

  // Generate creaking sound (sweeping frequency)
  for (let i = 0; i < creakDuration * sampleRate; i++) {
    const t = i / sampleRate;
    const freqSweep = 400 + Math.sin(t * 8) * 200; // Frequency modulation
    const noise = (Math.random() * 2 - 1) * 0.2;
    const tone = Math.sin(2 * Math.PI * freqSweep * t) * 0.3;
    const envelope = Math.sin(Math.PI * (t / creakDuration)); // Smooth envelope
    
    const sample = Math.floor((creakStart + t) * sampleRate);
    if (sample < data.length) {
      data[sample] = (tone + noise) * envelope * 0.3;
    }
  }

  // Generate thud sound (low frequency impact)
  const thudDuration = 0.3;
  for (let i = 0; i < thudDuration * sampleRate; i++) {
    const t = i / sampleRate;
    const decay = Math.exp(-t * 10);
    const freq = 80 + Math.random() * 30;
    const noise = (Math.random() * 2 - 1) * 0.4;
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.6;
    
    const sample = Math.floor((thudTime + t) * sampleRate);
    if (sample < data.length) {
      data[sample] = (tone + noise) * decay * 0.5;
    }
  }

  // Generate click sound (sharp transient)
  const clickDuration = 0.05;
  for (let i = 0; i < clickDuration * sampleRate; i++) {
    const t = i / sampleRate;
    const decay = Math.exp(-t * 50);
    const noise = (Math.random() * 2 - 1) * decay * 0.6;
    
    const sample = Math.floor((clickTime + t) * sampleRate);
    if (sample < data.length) {
      data[sample] = noise;
    }
  }

  return bufferToWavUrl(buffer);
}

// Helper function to convert AudioBuffer to WAV Blob URL
function bufferToWavUrl(buffer: AudioBuffer): string {
  const length = buffer.length * buffer.numberOfChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);
  const channels = [];
  let offset = 0;
  let pos = 0;

  // Write WAV header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(buffer.numberOfChannels);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels); // avg. bytes/sec
  setUint16(buffer.numberOfChannels * 2); // block-align
  setUint16(16); // 16-bit

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // Write interleaved data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true); // convert to 16-bit
      pos += 2;
    }
    offset++;
  }

  const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}

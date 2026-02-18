/**
 * Audio utility functions for recording and playback
 */

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private silenceTimeout: NodeJS.Timeout | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private silenceDetectionInterval: NodeJS.Timeout | null = null;
  private onSilenceDetected: (() => void) | null = null;

  /**
   * Request microphone permission and initialize recorder
   */
  async initialize(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Set up audio analysis for silence detection
      this.setupSilenceDetection();
    } catch (error) {
      console.error('Failed to initialize audio recorder:', error);
      throw new Error('Microphone access denied or not available');
    }
  }

  /**
   * Set up Web Audio API for silence detection
   */
  private setupSilenceDetection(): void {
    if (!this.stream) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = this.audioContext.createMediaStreamSource(this.stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    source.connect(this.analyser);
  }

  /**
   * Get current audio level (0-100)
   */
  private getAudioLevel(): number {
    if (!this.analyser) return 0;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    return average;
  }

  /**
   * Start automatic silence detection
   */
  private startSilenceDetection(callback: () => void, silenceThreshold: number = 10, silenceDuration: number = 2000): void {
    this.onSilenceDetected = callback;
    let silenceStart: number | null = null;

    this.silenceDetectionInterval = setInterval(() => {
      const audioLevel = this.getAudioLevel();

      if (audioLevel < silenceThreshold) {
        // Silence detected
        if (silenceStart === null) {
          silenceStart = Date.now();
        } else {
          const silencePeriod = Date.now() - silenceStart;
          if (silencePeriod >= silenceDuration) {
            // Silence lasted long enough - stop recording
            this.stopSilenceDetection();
            if (this.onSilenceDetected) {
              this.onSilenceDetected();
            }
          }
        }
      } else {
        // Sound detected - reset silence timer
        silenceStart = null;
      }
    }, 100); // Check every 100ms
  }

  /**
   * Stop silence detection
   */
  private stopSilenceDetection(): void {
    if (this.silenceDetectionInterval) {
      clearInterval(this.silenceDetectionInterval);
      this.silenceDetectionInterval = null;
    }
  }

  /**
   * Start recording audio with automatic silence detection
   */
  start(onAutoStop?: () => void): void {
    if (!this.mediaRecorder) {
      throw new Error('Recorder not initialized');
    }

    this.audioChunks = [];
    this.mediaRecorder.start();

    // Enable automatic silence detection if callback provided
    if (onAutoStop) {
      // Wait 500ms before starting silence detection (avoid immediate stop)
      setTimeout(() => {
        this.startSilenceDetection(onAutoStop, 15, 2000); // 15 = threshold, 2000ms = 2 seconds of silence
      }, 500);
    }
  }

  /**
   * Stop recording and return audio blob
   */
  async stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Recorder not initialized'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stopSilenceDetection();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.analyser = null;
    this.onSilenceDetected = null;
  }
}

export class AudioPlayer {
  private audio: HTMLAudioElement | null = null;

  /**
   * Play audio from URL
   */
  async play(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stop(); // Stop any current playback

      this.audio = new Audio(audioUrl);
      
      this.audio.onended = () => {
        resolve();
      };

      this.audio.onerror = (error) => {
        reject(error);
      };

      this.audio.play().catch(reject);
    });
  }

  /**
   * Stop current playback
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }

  /**
   * Check if currently playing
   */
  isPlaying(): boolean {
    return this.audio !== null && !this.audio.paused;
  }
}

/**
 * Check if browser supports audio recording
 */
export function isAudioRecordingSupported(): boolean {
  return !!(
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder === 'function'
  );
}

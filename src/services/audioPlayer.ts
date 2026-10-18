export interface AudioPlayerState {
  currentAudioId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
}

type StateListener = (state: AudioPlayerState) => void;

class AudioPlayerService {
  private audioElement: HTMLAudioElement | null = null;
  private currentAudioId: string | null = null;
  private currentObjectUrl: string | null = null;
  private listeners: Set<StateListener> = new Set();
  private state: AudioPlayerState = {
    currentAudioId: null,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    error: null,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'metadata';

    this.audioElement.addEventListener('loadstart', () => {
      this.updateState({ isLoading: true, error: null });
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      if (this.audioElement) {
        this.updateState({
          duration: this.audioElement.duration || 0,
          isLoading: false,
        });
      }
    });

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement) {
        this.updateState({
          currentTime: this.audioElement.currentTime,
          duration: this.audioElement.duration || this.state.duration,
        });
      }
    });

    this.audioElement.addEventListener('play', () => {
      this.updateState({ isPlaying: true, isLoading: false, error: null });
    });

    this.audioElement.addEventListener('pause', () => {
      this.updateState({ isPlaying: false });
    });

    this.audioElement.addEventListener('ended', () => {
      this.updateState({ isPlaying: false, currentTime: 0 });
    });

    this.audioElement.addEventListener('error', () => {
      this.updateState({
        isPlaying: false,
        isLoading: false,
        error: 'Gagal memuat berkas audio. Periksa ketersediaan berkas.',
      });
    });
  }

  private updateState(partial: Partial<AudioPlayerState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.state));
  }

  public getState(): AudioPlayerState {
    return this.state;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  public async play(audioId: string, audioSource: string | Blob): Promise<void> {
    if (!this.audioElement) {
      this.initAudioElement();
    }
    if (!this.audioElement) return;

    // If same audio is currently playing, toggle pause
    if (this.currentAudioId === audioId) {
      if (this.audioElement.paused) {
        try {
          await this.audioElement.play();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Pemutaran dicegah oleh browser.';
          this.updateState({ error: message, isPlaying: false });
        }
      } else {
        this.audioElement.pause();
      }
      return;
    }

    // New audio item: stop previous, clean up object URL
    this.stop();

    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }

    let srcUrl = '';
    if (typeof audioSource === 'string') {
      srcUrl = audioSource;
    } else if (audioSource instanceof Blob) {
      srcUrl = URL.createObjectURL(audioSource);
      this.currentObjectUrl = srcUrl;
    }

    this.currentAudioId = audioId;
    this.updateState({
      currentAudioId: audioId,
      currentTime: 0,
      duration: 0,
      isLoading: true,
      error: null,
    });

    this.audioElement.src = srcUrl;

    try {
      await this.audioElement.play();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Pemutaran dicegah oleh browser.';
      this.updateState({
        isPlaying: false,
        isLoading: false,
        error: message,
      });
    }
  }

  public pause(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }
  }

  public stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.currentAudioId = null;
    this.updateState({
      currentAudioId: null,
      isPlaying: false,
      currentTime: 0,
      isLoading: false,
    });
  }

  public seek(seconds: number): void {
    if (this.audioElement && isFinite(seconds)) {
      this.audioElement.currentTime = Math.max(0, Math.min(seconds, this.audioElement.duration || seconds));
      this.updateState({ currentTime: this.audioElement.currentTime });
    }
  }
}

export const audioPlayer = new AudioPlayerService();

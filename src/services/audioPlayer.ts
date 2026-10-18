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

  private sourceResolver: ((audioId: string) => Promise<string | Blob | null | undefined>) | null = null;

  public setSourceResolver(
    resolver: (audioId: string) => Promise<string | Blob | null | undefined>
  ): void {
    this.sourceResolver = resolver;
  }

  public async play(audioId: string, audioSource?: string | Blob): Promise<void> {
    if (!this.audioElement) {
      this.initAudioElement();
    }
    if (!this.audioElement) return;

    // If same audio is currently loaded, toggle pause / resume
    if (this.currentAudioId === audioId && this.audioElement.src) {
      if (this.audioElement.paused) {
        await this.resume();
      } else {
        this.audioElement.pause();
      }
      return;
    }

    // Resolve source if empty or omitted
    let resolvedSource = audioSource;
    if (
      (!resolvedSource || (typeof resolvedSource === 'string' && !resolvedSource.trim())) &&
      this.sourceResolver
    ) {
      try {
        const fromResolver = await this.sourceResolver(audioId);
        if (fromResolver) resolvedSource = fromResolver;
      } catch (err) {
        console.error('Audio source resolver error:', err);
      }
    }

    // Validate that we have a playable non-empty source
    if (!resolvedSource || (typeof resolvedSource === 'string' && !resolvedSource.trim())) {
      this.stop();
      this.updateState({
        currentAudioId: audioId,
        isPlaying: false,
        isLoading: false,
        error: 'Berkas audio tidak tersedia atau URL kosong.',
      });
      return;
    }

    // New audio item: stop previous, clean up object URL
    this.stop();

    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }

    let srcUrl = '';
    if (typeof resolvedSource === 'string') {
      srcUrl = resolvedSource.trim();
    } else if (resolvedSource instanceof Blob) {
      srcUrl = URL.createObjectURL(resolvedSource);
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

  public async resume(): Promise<void> {
    if (this.audioElement && this.audioElement.paused) {
      try {
        await this.audioElement.play();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Pemutaran dicegah oleh browser.';
        this.updateState({ error: message, isPlaying: false });
      }
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

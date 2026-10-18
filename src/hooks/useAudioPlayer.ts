import { useState, useEffect } from 'react';
import { audioPlayer, AudioPlayerState } from '../services/audioPlayer';

export function useAudioPlayer() {
  const [state, setState] = useState<AudioPlayerState>(audioPlayer.getState());

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe(setState);
    return () => unsubscribe();
  }, []);

  return {
    ...state,
    play: (audioId: string, audioSource: string | Blob) => audioPlayer.play(audioId, audioSource),
    pause: () => audioPlayer.pause(),
    stop: () => audioPlayer.stop(),
    seek: (seconds: number) => audioPlayer.seek(seconds),
    isItemPlaying: (id: string) => state.currentAudioId === id && state.isPlaying,
    isItemActive: (id: string) => state.currentAudioId === id,
  };
}

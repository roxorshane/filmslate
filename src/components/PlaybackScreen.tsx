import { X } from 'lucide-react';
import type { Movie } from '../App';

interface PlaybackScreenProps {
  movie: Movie;
  onExit: () => void;
}

export function PlaybackScreen({ movie, onExit }: PlaybackScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Exit button */}
      <button
        onClick={onExit}
        className="absolute top-8 right-8 z-50 p-2 bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Playback placeholder */}
      <div className="w-full max-w-6xl aspect-video bg-black flex items-center justify-center relative">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-4xl mb-4">{movie.title}</h2>
            <p className="text-xl text-white/70">Now Playing</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ArrowLeft, Play } from 'lucide-react';
import type { Movie } from '../App';

interface MovieDetailPageProps {
  movie: Movie;
  onBack: () => void;
  onPlay: () => void;
}

export function MovieDetailPage({ movie, onBack, onPlay }: MovieDetailPageProps) {
  return (
    <div className="min-h-screen">
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-black hover:bg-white transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Hero section */}
      <div className="relative h-screen">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-12 pb-12">
          <div className="max-w-4xl">
            <h1 className="text-6xl text-white bg-black inline-block mb-8 px-6 py-4">{movie.title}</h1>
            
            <button
              onClick={onPlay}
              className="flex items-center gap-3 px-10 py-4 bg-black text-white hover:bg-black/90 transition-all duration-200 text-lg mb-8"
            >
              <Play className="w-6 h-6" fill="white" />
              Play
            </button>

            <div className="max-w-2xl">
              <h3 className="text-xl text-black mb-3">About</h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                {movie.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

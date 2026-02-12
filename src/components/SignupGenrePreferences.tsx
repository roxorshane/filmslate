import { useState } from 'react';
import { Film, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SignupGenrePreferencesProps {
  onSubmit: (genres: string[]) => void;
  onSkip: () => void;
}

const GENRES = [
  'Action',
  'Comedy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Drama',
  'Thriller',
  'Documentary',
];

const genres = [
  {
    name: 'Action',
    image: 'https://images.unsplash.com/photo-1761948245185-fc300ad20316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjM4NzY3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    name: 'Comedy',
    image: 'https://images.unsplash.com/photo-1732029541807-1eede3bec4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzYzODI3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    name: 'Horror',
    image: 'https://images.unsplash.com/photo-1630338679229-99fb150fbf88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBtb3ZpZSUyMGRhcmt8ZW58MXx8fHwxNzYzODg0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    name: 'Romance',
    image: 'https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwY291cGxlJTIwY2luZW1hfGVufDF8fHx8MTc2MzkyOTM3NXww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    name: 'Sci-Fi',
    image: 'https://images.unsplash.com/photo-1644772310791-deb96e24ee65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzYzOTAwMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    name: 'Drama',
    image: 'https://images.unsplash.com/photo-1715322608224-a9efaeeffaf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMHRoZWF0cmljYWx8ZW58MXx8fHwxNzYzOTI5Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    name: 'Thriller',
    image: 'https://images.unsplash.com/photo-1563905463861-7d77975b3a44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMHN1c3BlbnNlJTIwZGFya3xlbnwxfHx8fDE3NjM4MTk2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    name: 'Documentary',
    image: 'https://images.unsplash.com/photo-1672274168497-a75b7b8298b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGNhbWVyYSUyMGZpbG18ZW58MXx8fHwxNzYzOTI5Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export function SignupGenrePreferences({ onSubmit, onSkip }: SignupGenrePreferencesProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleContinue = () => {
    onSubmit(selectedGenres);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <Film className="w-10 h-10 text-black" />
          <h1 className="text-3xl text-black tracking-tight">FilmSlate</h1>
        </div>

        {/* Heading */}
        <h2 className="text-3xl text-black mb-4 text-center">
          What kinds of films do you love?
        </h2>
        <p className="text-center text-slate-600 mb-12">
          Select your favourite genres to get personalised recommendations
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {genres.map((genre) => {
            const isSelected = selectedGenres.includes(genre.name);
            return (
              <button
                key={genre.name}
                onClick={() => toggleGenre(genre.name)}
                className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer"
              >
                <ImageWithFallback
                  src={genre.image}
                  alt={genre.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-black/30 transition-opacity ${isSelected ? 'bg-slate-600/80' : 'group-hover:bg-black/40'}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white z-10">{genre.name}</span>
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-slate-100 rounded-full p-1">
                      <Check className="size-5 text-black" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleContinue}
            disabled={selectedGenres.length === 0}
            className="w-full px-6 py-4 bg-black text-white hover:bg-black/90 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 text-lg"
          >
            Continue
          </button>
          <button
            onClick={onSkip}
            className="w-full px-6 py-4 bg-white text-slate-600 hover:text-black transition-all duration-200 text-lg"
          >
            Skip this step
          </button>
        </div>
      </div>
    </div>
  );
}

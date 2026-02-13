import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import type { UserData } from '../App';
import type { FilmData } from '../data/films';
import { ALL_FILMS, HERO_FILM_IDS, GRID_FILM_IDS } from '../data/films';

interface HomeScreenProps {
  userData: UserData;
  onMovieSelect: (film: FilmData) => void;
  onChooseGenresClick: () => void;
  onCritiquesClick?: () => void;
}

type Category = 'All' | 'Trending' | 'Just Added' | 'Leaving Soon' | 'Highly Acclaimed' | 'Most Liked';

const HERO_MOVIES = ALL_FILMS.filter(f => HERO_FILM_IDS.includes(f.id));
const MOVIE_GRID = ALL_FILMS.filter(f => GRID_FILM_IDS.includes(f.id));

const CATEGORIES: Category[] = ['All', 'Trending', 'Just Added', 'Leaving Soon', 'Highly Acclaimed', 'Most Liked'];

export function HomeScreen({ userData, onMovieSelect, onChooseGenresClick, onCritiquesClick }: HomeScreenProps) {
  // HomeScreen now uses FilmData from the central data file
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const hasGenres = userData.genres.length > 0;

  useEffect(() => {
    const getNextHeroIndex = () => {
      const nextHeroIndex = (currentHeroIndex + 1) % (HERO_MOVIES.length);
      console.log("Hero", { currentHeroIndex, nextHeroIndex, modulo: HERO_MOVIES.length });
      return nextHeroIndex;
    };
    
    const timer = setInterval(() => {
      setCurrentHeroIndex(getNextHeroIndex());
    }, 5000);
    return () => clearInterval(timer);
  }, [currentHeroIndex]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-8 h-8 text-black" aria-hidden="true" />
            <h1 className="text-2xl text-black tracking-tight">FilmSlate</h1>
          </div>
          <div className="flex items-center gap-6">
            {onCritiquesClick && (
              <button
                onClick={onCritiquesClick}
                className="text-sm text-slate-700 hover:text-black transition-colors tracking-wide cursor-pointer"
              >
                Editorial
              </button>
            )}
            <div className="w-10 h-10 bg-slate-600 rounded-full" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 max-w-[1440px] mx-auto px-12">
        {/* Hero Carousel */}
        <section aria-label="Featured films" className="relative h-[600px] mb-16 -mx-12">
          {HERO_MOVIES.map((movie, index) => (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentHeroIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="relative h-full">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-12 pb-12">
                  <div className="max-w-2xl">
                    {index === 0 && hasGenres && (
                      <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-sm mb-4">
                        For You
                      </span>
                    )}
                    <h2 className="text-5xl text-black mb-4 ">{movie.title}</h2>
                    <button
                      onClick={() => onMovieSelect(movie)}
                      className="px-8 py-3 bg-black text-white hover:bg-black/90 transition-all duration-200 cursor-pointer"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel indicators */}
          <div className="absolute bottom-6 right-12 flex gap-2">
            {HERO_MOVIES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentHeroIndex ? "true" : undefined}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  index === currentHeroIndex ? 'bg-black w-8' : 'bg-slate-500'
                }`}
              />
            ))}
          </div>
        </section>

        {/* For You Section */}
        {hasGenres ? (
          <section aria-labelledby="for-you-heading" className="mb-16">
            <h3 id="for-you-heading" className="text-2xl text-black mb-6">For You</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {MOVIE_GRID.slice(0, 5).map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => onMovieSelect(movie)}
                  className="flex-shrink-0 w-[240px] group cursor-pointer"
                >
                  <div className="relative aspect-[2/3] mb-2 overflow-hidden">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-black group-hover:text-slate-600 transition-colors">{movie.title}</p>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section aria-label="Genre preferences" className="mb-16 p-8 bg-slate-50 text-center">
            <p className="text-slate-700 mb-4">
              Select your favourite genres to get personalised recommendations
            </p>
            <button onClick={onChooseGenresClick} className="px-6 py-3 bg-black text-white hover:bg-black/90 transition-all cursor-pointer">
              Choose Genres
            </button>
          </section>
        )}

        {/* Category Selector */}
        <nav aria-label="Film categories" className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-slate-600 text-white'
                  : 'bg-slate-100 text-black hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </nav>

        {/* Movie Grid */}
        <section aria-label="Film library" className="grid grid-cols-5 gap-4 pb-16">
          {MOVIE_GRID.map((movie) => (
            <button
              key={movie.id}
              onClick={() => onMovieSelect(movie)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] mb-2 overflow-hidden">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="text-black group-hover:text-slate-600 transition-colors text-left">
                {movie.title}
              </p>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

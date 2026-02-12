import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import type { UserData, Movie } from '../App';

interface HomeScreenProps {
  userData: UserData;
  onMovieSelect: (movie: Movie) => void;
  onChooseGenresClick: () => void;
}

type Category = 'All' | 'Trending' | 'Just Added' | 'Leaving Soon' | 'Highly Acclaimed' | 'Most Liked';

const HERO_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Shadows of Tomorrow',
    image: 'https://images.unsplash.com/photo-1761998528613-a18866ce78ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub2lyJTIwZmlsbSUyMGF0bW9zcGhlcmV8ZW58MXx8fHwxNzY3ODc0MDE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'A haunting noir thriller following a detective through the rain-soaked streets of a city that never sleeps. As she unravels a web of corruption, she must confront her own demons.',
  },
  {
    id: 2,
    title: 'The Last Projection',
    image: 'https://images.unsplash.com/photo-1765188987985-6a9a0769b79b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBwcm9qZWN0b3IlMjB2aW50YWdlfGVufDF8fHx8MTc2NzgzNzYwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'An aging projectionist discovers a mysterious film reel that seems to predict the future. A meditation on cinema, memory, and the power of storytelling.',
  },
  {
    id: 3,
    title: 'Portraits in Silence',
    image: 'https://images.unsplash.com/photo-1681308830471-75bc6b8bd2ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb29keSUyMHBvcnRyYWl0JTIwY2luZW1hdGljfGVufDF8fHx8MTc2Nzg3NDAxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'An intimate character study exploring the inner life of a reclusive artist. Shot in stunning black and white with minimal dialogue.',
  },
];

const MOVIE_GRID: Movie[] = [
  { id: 4, title: 'Dark Horizons', image: 'https://images.unsplash.com/photo-1648591645922-9632ea04c3cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYXRpYyUyMGxhbmRzY2FwZSUyMGRhcmt8ZW58MXx8fHwxNzY3ODc0MDE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A sci-fi epic set in a dystopian future.' },
  { id: 5, title: 'City Lights', image: 'https://images.unsplash.com/photo-1611416370495-50fac9e1b382?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMG5pZ2h0JTIwY2l0eXxlbnwxfHx8fDE3Njc4NzQwMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A love story told through the lens of urban isolation.' },
  { id: 6, title: 'Through the Lens', image: 'https://images.unsplash.com/photo-1697238724718-29cc8b1a2340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FtZXJhJTIwZmlsbXxlbnwxfHx8fDE3Njc4NjUzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A documentary about the art of analog photography.' },
  { id: 7, title: 'Echoes', image: 'https://images.unsplash.com/photo-1674757621246-ab7bcaba8bcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMHBvcnRyYWl0JTIwZHJhbWF8ZW58MXx8fHwxNzY3ODc0MDE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A psychological thriller about memory and identity.' },
  { id: 8, title: 'Into the Woods', image: 'https://images.unsplash.com/photo-1762871950969-55419104d2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZm9yZXN0JTIwYXRtb3NwaGVyaWN8ZW58MXx8fHwxNzY3ODc0MDE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A haunting fairy tale reimagined for modern audiences.' },
  { id: 9, title: 'Luminescence', image: 'https://images.unsplash.com/photo-1637434001140-f5328c2d885b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGxpZ2h0JTIwY2luZW1hfGVufDF8fHx8MTc2Nzg3NDAxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'An experimental film exploring light and color.' },
  { id: 10, title: 'Silhouettes', image: 'https://images.unsplash.com/photo-1743164584214-b04b42afa6b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxob3VldHRlJTIwZHJhbWF0aWMlMjBsaWdodGluZ3xlbnwxfHx8fDE3Njc4NzQwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A visual poem about human connection.' },
  { id: 11, title: 'Neon Dreams', image: 'https://images.unsplash.com/photo-1650114361973-3e987d7f0be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMG5lb24lMjBsaWdodHN8ZW58MXx8fHwxNzY3ODEyMzc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A cyberpunk romance set in Tokyo.' },
  { id: 12, title: 'Wasteland', image: 'https://images.unsplash.com/photo-1666982821449-e0e79688ea1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBsYW5kc2NhcGUlMjBtb29keXxlbnwxfHx8fDE3Njc4NzQwMTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A survival story in the desert.' },
  { id: 13, title: 'The Empty Room', image: 'https://images.unsplash.com/photo-1611271581777-def56cc4b5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwaW50ZXJpb3IlMjBjaW5lbWF0aWN8ZW58MXx8fHwxNzY3ODc0MDE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A minimalist drama about grief and letting go.' },
  { id: 14, title: 'Tides', image: 'https://images.unsplash.com/photo-1610581950163-c37ae06c3a96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwZHJhbWF0aWN8ZW58MXx8fHwxNzY3ODc0MDE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'An environmental documentary about ocean conservation.' },
  { id: 15, title: 'Concrete', image: 'https://images.unsplash.com/photo-1584563123253-3785be1f0ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBtaW5pbWFsJTIwZGFya3xlbnwxfHx8fDE3Njc4NzQwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'An architectural meditation on urban spaces.' },
  { id: 16, title: 'Haze', image: 'https://images.unsplash.com/photo-1661782533035-ef946cca5ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbW9rZSUyMGF0bW9zcGhlcmljJTIwbW9vZHxlbnwxfHx8fDE3Njc4NzQwMTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A dreamy exploration of consciousness.' },
  { id: 17, title: 'The Road Less Traveled', image: 'https://images.unsplash.com/photo-1679247888138-e5bd89a4b586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyJTIwcmV0cm98ZW58MXx8fHwxNzY3ODc0MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A road trip film about finding yourself.' },
  { id: 18, title: 'Summit', image: 'https://images.unsplash.com/photo-1559666358-1bf722875b85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGVwaWN8ZW58MXx8fHwxNzY3ODc0MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A mountaineering documentary.' },
  { id: 19, title: 'Between Shadows', image: 'https://images.unsplash.com/photo-1645445197786-8e2e9f4d58d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMHNoYWRvdyUyMGRyYW1hdGljfGVufDF8fHx8MTc2Nzg3NDAyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A noir mystery with stunning visuals.' },
  { id: 20, title: 'Midnight City', image: 'https://images.unsplash.com/photo-1683041133665-41f7ff45b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb3dudG93biUyMG5pZ2h0JTIwY2l0eXNjYXBlfGVufDF8fHx8MTc2Nzg3NDAxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A crime drama set in the heart of downtown.' },
  { id: 21, title: 'Reflections', image: 'https://images.unsplash.com/photo-1764568912404-172039752261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXJyb3IlMjByZWZsZWN0aW9uJTIwYXJ0aXN0aWN8ZW58MXx8fHwxNzY3ODc0MDIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'An introspective drama about self-discovery.' },
  { id: 22, title: 'Ruins', image: 'https://images.unsplash.com/photo-1661619007999-cb2a215cd799?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYmFuZG9uZWQlMjBidWlsZGluZyUyMGF0bW9zcGhlcmljfGVufDF8fHx8MTc2Nzg3NDAyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A post-apocalyptic tale of hope.' },
  { id: 23, title: 'Winter\'s End', image: 'https://images.unsplash.com/photo-1671538856590-564ae61456dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbm93JTIwd2ludGVyJTIwbW9vZHl8ZW58MXx8fHwxNzY3ODc0MDIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A cold war drama.' },
  { id: 24, title: 'Through the Window', image: 'https://images.unsplash.com/photo-1635279557426-ac20080c9f4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kb3clMjBsaWdodCUyMGRyYW1hdGljfGVufDF8fHx8MTc2Nzg3NDAyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A voyeuristic thriller.' },
  { id: 25, title: 'Red Room', image: 'https://images.unsplash.com/photo-1554657546-abbb568d6782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBsaWdodCUyMG5vaXJ8ZW58MXx8fHwxNzY3ODc0MDIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A psychological horror film.' },
  { id: 26, title: 'Solitude', image: 'https://images.unsplash.com/photo-1766749365150-53cad707e156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wbGF0aXZlJTIwcG9ydHJhaXQlMjBlbW90aW9uYWx8ZW58MXx8fHwxNzY3ODc0MDIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A character study about isolation.' },
  { id: 27, title: 'Ascension', image: 'https://images.unsplash.com/photo-1758413353049-746198a0f1a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpcmNhc2UlMjBkcmFtYXRpYyUyMHBlcnNwZWN0aXZlfGVufDF8fHx8MTc2Nzg3NDAyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A metaphysical journey upward.' },
  { id: 28, title: 'Lost in the Fog', image: 'https://images.unsplash.com/photo-1663422879687-4979355e0f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2clMjBteXN0ZXJpb3VzJTIwYXRtb3NwaGVyZXxlbnwxfHx8fDE3Njc4NzQwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A mystery shrouded in mist.' },
  { id: 29, title: 'Night Walk', image: 'https://images.unsplash.com/photo-1673095288333-ac62dbbad575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBuaWdodCUyMGNpbmVtYXRpY3xlbnwxfHx8fDE3Njc4NzQwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A single continuous shot through the city.' },
  { id: 30, title: 'The Archives', image: 'https://images.unsplash.com/photo-1763368230669-3a2e97368032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwdmludGFnZSUyMGJvb2tzfGVufDF8fHx8MTc2Nzg3NDAyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A documentary about preserving film history.' },
  { id: 31, title: 'Cafe Noir', image: 'https://images.unsplash.com/photo-1620818309748-e3a0f35a12d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwaW50ZXJpb3IlMjBtb29keXxlbnwxfHx8fDE3Njc4NzQwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'Conversations over coffee in a dim cafe.' },
  { id: 32, title: 'Platform', image: 'https://images.unsplash.com/photo-1764271685362-b46c14d1256f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbiUyMHN0YXRpb24lMjBhdG1vc3BoZXJpY3xlbnwxfHx8fDE3Njc4NzQwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'A romance that begins at a train station.' },
  { id: 33, title: 'Fragments', image: 'https://images.unsplash.com/photo-1606522104957-b56686d56e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMGZpbG0lMjBkYXJrJTIwY2luZW1hdGljfGVufDF8fHx8MTc2Nzg3NDAxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', description: 'Piecing together scattered memories.' },
];

const CATEGORIES: Category[] = ['All', 'Trending', 'Just Added', 'Leaving Soon', 'Highly Acclaimed', 'Most Liked'];

export function HomeScreen({ userData, onMovieSelect, onChooseGenresClick }: HomeScreenProps) {
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
      // setCurrentHeroIndex(getNextHeroIndex());
    }, 5000);
    return () => clearInterval(timer);
  }, [currentHeroIndex]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-8 h-8 text-black" />
            <h1 className="text-2xl text-black tracking-tight">FilmSlate</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 bg-slate-600 rounded-full" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 max-w-[1440px] mx-auto px-12">
        {/* Hero Carousel */}
        <div className="relative h-[600px] mb-16 -mx-12">
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
                      className="px-8 py-3 bg-black text-white hover:bg-black/90 transition-all duration-200"
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
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentHeroIndex ? 'bg-black w-8' : 'bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* For You Section */}
        {hasGenres ? (
          <div className="mb-16">
            <h3 className="text-2xl text-black mb-6">For You</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {MOVIE_GRID.slice(0, 5).map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => onMovieSelect(movie)}
                  className="flex-shrink-0 w-[240px] group"
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
          </div>
        ) : (
          <div className="mb-16 p-8 bg-slate-50 text-center">
            <p className="text-slate-600 mb-4">
              Select your favourite genres to get personalised recommendations
            </p>
            <button onClick={onChooseGenresClick} className="px-6 py-3 bg-black text-white hover:bg-black/90 transition-all">
              Choose Genres
            </button>
          </div>
        )}

        {/* Category Selector */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-slate-600 text-white'
                  : 'bg-slate-100 text-black hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-5 gap-4 pb-16">
          {MOVIE_GRID.map((movie) => (
            <button
              key={movie.id}
              onClick={() => onMovieSelect(movie)}
              className="group"
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
        </div>
      </main>
    </div>
  );
}

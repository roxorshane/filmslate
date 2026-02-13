import { Film } from 'lucide-react';

interface LandingScreenProps {
  onCreateAccount: () => void;
}

export function LandingScreen({ onCreateAccount }: LandingScreenProps) {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background hero image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwY291cGxlJTIwY2luZW1hfGVufDF8fHx8MTc2MzkyOTM3NXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <button
        onClick={onCreateAccount}
        className="absolute z-15 top-4 right-4 px-8 py-4 text-white hover:bg-white hover:text-black transition-all duration-200 text-lg cursor-pointer"
      >
        Log in
      </button>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <Film className="w-12 h-12 text-white" aria-hidden="true" />
          <h1 className="text-5xl text-white tracking-tight">FilmSlate</h1>
        </div>

        {/* Value proposition */}
        <h2 className="text-4xl text-white mb-6 leading-tight">
          Discover unforgettable indie films, curated for you
        </h2>
        
        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Stream bold, independent cinema from visionary filmmakers around the world. 
          Experience stories that challenge, inspire, and stay with you long after the credits roll.
        </p>

        <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Explore FilmSlate for free with a 7-day trial, then subscribe for £9.99 per month. Cancel anytime.
        </p>

        {/* Actions */}
        <button
          onClick={onCreateAccount}
          className="px-8 py-4 bg-slate-100 text-black hover:bg-white transition-all duration-200 text-lg cursor-pointer"
        >
          Create an account
        </button>
      </div>
    </main>
  );
}

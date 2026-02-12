import { useState } from 'react';
import { Film } from 'lucide-react';
import type { UserData } from '../App';

interface SignupBasicInfoProps {
  onSubmit: (data: Partial<UserData>) => void;
  context?: 'signup' | 'play' | 'genres';
}

const CONTEXT_COPY = {
  signup: {
    heading: 'Create your account',
    sub: 'Join millions of movie lovers worldwide',
  },
  play: {
    heading: 'Sign in to watch',
    sub: 'Create an account or sign in to start your free trial',
  },
  genres: {
    heading: 'Sign in to personalise',
    sub: 'Create an account or sign in to save your preferences',
  },
};

export function SignupBasicInfo({ onSubmit, context = 'signup' }: SignupBasicInfoProps) {
  const copy = CONTEXT_COPY[context];
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    password: '',
    acceptedTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!!formData.acceptedTerms) {
      onSubmit({
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
      });
    }
  };

  const isValid = !!formData.acceptedTerms;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-8 py-12">
      {/* Background hero image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwY291cGxlJTIwY2luZW1hfGVufDF8fHx8MTc2MzkyOTM3NXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cinematic background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="z-10 w-full max-w-md">
        {/* Form */}
        <div className="bg-slate-50/90 rounded-lg p-8 border border-slate-400 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 mb-12">
              <Film className="w-10 h-10 text-black" />
              <h1 className="text-3xl text-black tracking-tight">FilmSlate</h1>
            </div>
            <h2 className="text-black text-3xl">{copy.heading}</h2>
            <p className="text-black-400">{copy.sub}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-black">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                
              />
            </div>
  
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-black">
                Email address
              </label>
              <input
                type="text"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                
              />
            </div>
  
            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-black">
                Create Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                
              />
            </div>
  
            <div>
              <label htmlFor="dob" className="block text-sm mb-2 text-black">
                Date of birth
              </label>
              <input
                type="date"
                id="dob"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
                
              />
            </div>
  
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptedTerms}
                onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                className="mt-1 w-4 h-4 border-slate-300 text-black focus:ring-slate-400"
                required
              />
              <label htmlFor="terms" className="text-sm text-black leading-relaxed">
                I accept the <span className="underline">Terms of Service</span> and{' '}
                <span className="underline">Privacy Policy</span>
              </label>
            </div>
  
            <button
              type="submit"
              disabled={!isValid}
              className="w-full px-6 py-4 bg-black text-white hover:bg-black/90 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 text-lg"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

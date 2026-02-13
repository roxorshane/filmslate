import { ArrowRight } from 'lucide-react';
import type { FilmData } from '../data/films';
import type { Recommendation } from '../lib/rag';
import { Card, CardContent } from './ui/card';
import { MaterialCard } from './ui/material-card';
import { Button } from './ui/button';

interface MovieUnavailableScreenProps {
  film: FilmData;
  recommendations: Recommendation[];
  onSelectFilm: (film: FilmData) => void;
  onReadEditorial: (film: FilmData) => void;
  onViewAll: () => void;
}

export function MovieUnavailableScreen({
  film,
  recommendations,
  onSelectFilm,
  onReadEditorial,
  onViewAll,
}: MovieUnavailableScreenProps) {
  return (
    <main className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-black">
            This film is no longer available
          </h1>
          <p className="text-lg text-slate-700">
            <strong>{film.title}</strong> has left our rotating 30-day library.{' '}
            <a href="#" className="underline text-slate-600">
              Learn more
            </a>
          </p>

          {/* Unavailable film card */}
          <div className="flex justify-center">
            <div className="w-[360px]">
              <MaterialCard
                thumbnail={film.image}
                title={film.title}
                subtitle="No longer playing on FilmSlate"
                horizontal
                outline
              />
            </div>
          </div>

          <section aria-labelledby="recs-heading" className="mt-8">
            <h2 id="recs-heading" className="text-2xl font-bold text-black pt-6">Try these instead</h2>
            <p>These films are similar to the one you were looking for.</p>
          </section>
        </div>

        {/* Similar Films — 3 across */}
        <div style={{ display: 'flex', gap: 24 }}>
          {recommendations.map(({ film: recFilm, reason }) => (
            <Card key={recFilm.id} style={{ flex: '1 1 0', minWidth: 0 }} className="overflow-hidden">
              <img
                src={recFilm.image}
                alt={recFilm.title}
                className="w-full object-cover"
                style={{ height: 188 }}
              />
              <CardContent className="space-y-2 flex flex-col h-full">
                <p className="font-bold text-black">{recFilm.title}</p>
                <p className="text-sm text-slate-700">{recFilm.description}</p>
                <p className="text-sm text-slate-700 grow">{reason}</p>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => onReadEditorial(recFilm)}
                  >
                    Read Editorial
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => onSelectFilm(recFilm)}
                  >
                    Watch
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer — right-aligned */}
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onViewAll}>
            View more films <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </main>
  );
}

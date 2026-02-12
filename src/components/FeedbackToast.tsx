import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import type { Movie } from '../App';

interface FeedbackToastProps {
  movieDetails: Movie;
  feedbackGiven: 'up' | 'down' | null;
  onFeedback: (type: 'up' | 'down') => void;
  onClose: () => void;
}

export function FeedbackToast({ movieDetails, feedbackGiven, onFeedback, onClose }: FeedbackToastProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50 bg-white shadow-xl border border-slate-200 p-6 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-black transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {feedbackGiven === null ? (
        <>
          <p className="text-black mb-4 pr-6">Did you enjoy {movieDetails.title}?</p>
          <div className="flex gap-3">
            <button
              onClick={() => onFeedback('up')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 hover:border-slate-600 hover:bg-slate-50 text-black transition-all"
            >
              <ThumbsUp className="w-5 h-5" />
              Yes
            </button>
            <button
              onClick={() => onFeedback('down')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 hover:border-slate-600 hover:bg-slate-50 text-black transition-all"
            >
              <ThumbsDown className="w-5 h-5" />
              No
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-2">
          <p className="text-black">Thank you for your feedback!</p>
        </div>
      )}
    </div>
  );
}

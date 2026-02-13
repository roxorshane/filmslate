import { useState } from 'react';
import { X } from 'lucide-react';

interface PaymentDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

type PaymentMethod = 'card' | 'paypal';

export function PaymentDialog({ onConfirm, onCancel }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="payment-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-8 relative animate-in fade-in duration-200">
        <button
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 text-slate-500 hover:text-black transition-colors"
        >
          <X className="w-6 h-6" aria-hidden="true" />
        </button>

        <h2 id="payment-title" className="text-2xl text-black mb-2">Start Your Free Trial</h2>
        <p className="text-slate-700 mb-8">
          Enjoy 7 days free, then £9.99/month. Cancel anytime.
        </p>

        {/* Payment method selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`flex-1 px-4 py-3 border-2 transition-all ${
              paymentMethod === 'card'
                ? 'border-slate-600 bg-slate-600 text-white'
                : 'border-slate-300 text-black hover:border-slate-400'
            }`}
          >
            Card
          </button>
          <button
            onClick={() => setPaymentMethod('paypal')}
            className={`flex-1 px-4 py-3 border-2 transition-all ${
              paymentMethod === 'paypal'
                ? 'border-slate-600 bg-slate-600 text-white'
                : 'border-slate-300 text-black hover:border-slate-400'
            }`}
          >
            PayPal
          </button>
        </div>

        {/* Payment form */}
        {paymentMethod === 'card' ? (
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm text-black mb-2">Card number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-black mb-2">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-black mb-2">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-700 mb-8">
            You'll be redirected to PayPal to complete your payment
          </div>
        )}

        {/* Terms */}
        <p className="text-sm text-slate-700 mb-6">
          By confirming, you agree to be charged £9.99/month after your 7-day free trial ends. 
          You can cancel anytime before the trial ends to avoid charges.
        </p>

        {/* Confirm button */}
        <button
          onClick={onConfirm}
          className="w-full px-6 py-4 bg-black text-white hover:bg-black/90 transition-all duration-200 text-lg"
        >
          Start Free Trial
        </button>
      </div>
    </div>
  );
}

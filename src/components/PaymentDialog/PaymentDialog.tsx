import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/helpers';
import styles from './PaymentDialog.module.css';

interface PaymentDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

type PaymentMethod = 'card' | 'paypal';

export function PaymentDialog({ onConfirm, onCancel }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="payment-title" className={styles.overlay}>
      <div className={styles.dialog}>
        <button onClick={onCancel} aria-label="Close" className={styles.closeButton}>
          <X className={styles.closeIcon} aria-hidden="true" />
        </button>
        <h2 id="payment-title" className={styles.title}>Start Your Free Trial</h2>
        <p className={styles.subtitle}>Enjoy 7 days free, then £9.99/month. Cancel anytime.</p>
        <div className={styles.methodToggle}>
          <button onClick={() => setPaymentMethod('card')} className={cn(styles.methodButton, paymentMethod === 'card' ? styles.methodButtonActive : styles.methodButtonInactive)}>Card</button>
          <button onClick={() => setPaymentMethod('paypal')} className={cn(styles.methodButton, paymentMethod === 'paypal' ? styles.methodButtonActive : styles.methodButtonInactive)}>PayPal</button>
        </div>
        {paymentMethod === 'card' ? (
          <div className={styles.cardFields}>
            <div>
              <label className={styles.fieldLabel}>Card number</label>
              <input type="text" placeholder="1234 5678 9012 3456" className={styles.fieldInput} />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldRowItem}>
                <label className={styles.fieldLabel}>Expiry</label>
                <input type="text" placeholder="MM/YY" className={styles.fieldInput} />
              </div>
              <div className={styles.fieldRowItem}>
                <label className={styles.fieldLabel}>CVC</label>
                <input type="text" placeholder="123" className={styles.fieldInput} />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.paypalMessage}>You'll be redirected to PayPal to complete your payment</div>
        )}
        <p className={styles.terms}>By confirming, you agree to be charged £9.99/month after your 7-day free trial ends. You can cancel anytime before the trial ends to avoid charges.</p>
        <button onClick={onConfirm} className={styles.submitButton}>Start Free Trial</button>
      </div>
    </div>
  );
}

export default PaymentDialog;

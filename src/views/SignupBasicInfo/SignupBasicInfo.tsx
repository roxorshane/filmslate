import { useState } from 'react';
import { Film } from 'lucide-react';
import type { UserData } from '@/types';
import styles from './SignupBasicInfo.module.css';

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
    <main className={styles.main}>
      <div className={styles.backgroundContainer}>
        <img
          src="https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwY291cGxlJTIwY2luZW1hfGVufDF8fHx8MTc2MzkyOTM3NXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt=""
          className={styles.backgroundImage}
        />
        <div className={styles.backgroundOverlay} />
      </div>
      <div className={styles.formWrapper}>
        <div className={styles.card}>
          <div className={styles.headerSection}>
            <div className={styles.logoContainer}>
              <Film className={styles.logoIcon} aria-hidden="true" />
              <h1 className={styles.logoTitle}>FilmSlate</h1>
            </div>
            <h2 className={styles.heading}>{copy.heading}</h2>
            <p className={styles.subheading}>{copy.sub}</p>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label htmlFor="name" className={styles.fieldLabel}>Name</label>
              <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={styles.textInput} />
            </div>
            <div>
              <label htmlFor="email" className={styles.fieldLabel}>Email address</label>
              <input type="text" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={styles.textInput} />
            </div>
            <div>
              <label htmlFor="password" className={styles.fieldLabel}>Create Password</label>
              <input type="password" id="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={styles.textInput} />
            </div>
            <div>
              <label htmlFor="dob" className={styles.fieldLabel}>Date of birth</label>
              <input type="date" id="dob" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className={styles.textInput} />
            </div>
            <div className={styles.checkboxRow}>
              <input type="checkbox" id="terms" checked={formData.acceptedTerms} onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })} className={styles.checkbox} required />
              <label htmlFor="terms" className={styles.termsLabel}>
                I accept the <span className={styles.termsLink}>Terms of Service</span> and{' '}
                <span className={styles.termsLink}>Privacy Policy</span>
              </label>
            </div>
            <button type="submit" disabled={!isValid} className={styles.submitButton}>
              Continue
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default SignupBasicInfo;

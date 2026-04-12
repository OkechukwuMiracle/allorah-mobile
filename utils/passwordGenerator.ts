export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

export const generatePassword = (opts: PasswordOptions): string => {
  let pool = '';
  let guaranteed = '';

  if (opts.uppercase) { pool += SETS.uppercase; guaranteed += SETS.uppercase[Math.floor(Math.random() * SETS.uppercase.length)]; }
  if (opts.lowercase) { pool += SETS.lowercase; guaranteed += SETS.lowercase[Math.floor(Math.random() * SETS.lowercase.length)]; }
  if (opts.numbers)   { pool += SETS.numbers;   guaranteed += SETS.numbers[Math.floor(Math.random() * SETS.numbers.length)]; }
  if (opts.symbols)   { pool += SETS.symbols;   guaranteed += SETS.symbols[Math.floor(Math.random() * SETS.symbols.length)]; }

  if (!pool) return '';

  const remaining = opts.length - guaranteed.length;
  let password = guaranteed;

  for (let i = 0; i < remaining; i++) {
    password += pool[Math.floor(Math.random() * pool.length)];
  }

  // Shuffle
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

export const rateStrength = (password: string): { label: string; color: string; score: number } => {
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: 'Weak', color: '#EF4444', score };
  if (score <= 4) return { label: 'Fair', color: '#F59E0B', score };
  if (score <= 5) return { label: 'Good', color: '#3B82F6', score };
  return { label: 'Strong', color: '#10B981', score };
};

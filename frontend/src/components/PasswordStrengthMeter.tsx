import { evaluatePasswordRules, getPasswordScore } from '../utils/passwordStrength';

type Props = {
  password: string;
};

const labels: Record<number, string> = {
  0: 'Very weak',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
};

export function PasswordStrengthMeter({ password }: Props) {
  const score = getPasswordScore(password);
  const rules = evaluatePasswordRules(password);
  const percent = (score / 4) * 100;

  const barColor =
    score <= 1 ? 'bg-rose-500' : score === 2 ? 'bg-amber-500' : score === 3 ? 'bg-blue-500' : 'bg-emerald-500';

  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
        <span>Password strength</span>
        <span className="font-semibold text-slate-700">{labels[score]}</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={`h-2 transition-all ${barColor}`} style={{ width: `${percent}%` }} />
      </div>

      <div className="mt-2 grid gap-1 text-xs text-slate-700">
        <p className={rules.minLength ? 'text-emerald-700' : 'text-slate-600'}>
          {rules.minLength ? 'OK' : 'Required'} At least 8 characters
        </p>
        <p className={rules.uppercase ? 'text-emerald-700' : 'text-slate-600'}>
          {rules.uppercase ? 'OK' : 'Required'} One uppercase letter
        </p>
        <p className={rules.number ? 'text-emerald-700' : 'text-slate-600'}>
          {rules.number ? 'OK' : 'Required'} One number
        </p>
        <p className={rules.specialChar ? 'text-emerald-700' : 'text-slate-600'}>
          {rules.specialChar ? 'OK' : 'Required'} One special character
        </p>
      </div>
    </div>
  );
}

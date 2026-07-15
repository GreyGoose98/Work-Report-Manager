export type PasswordRules = {
  minLength: boolean;
  uppercase: boolean;
  number: boolean;
  specialChar: boolean;
};

export function evaluatePasswordRules(password: string): PasswordRules {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[^A-Za-z0-9]/.test(password),
  };
}

export function getPasswordScore(password: string): number {
  const rules = evaluatePasswordRules(password);
  return Object.values(rules).filter(Boolean).length;
}

export function isStrongPassword(password: string): boolean {
  return getPasswordScore(password) === 4;
}

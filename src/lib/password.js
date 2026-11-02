/** Assignment rules: an uppercase letter, a lowercase letter, at least 6 characters. */
export const PASSWORD_RULES = [
  { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p), short: "an uppercase letter" },
  { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p), short: "a lowercase letter" },
  { id: "length", label: "At least 6 characters", test: (p) => p.length >= 6, short: "at least 6 characters" },
];

export function passwordProblems(password) {
  return PASSWORD_RULES.filter((r) => !r.test(password)).map((r) => r.short);
}

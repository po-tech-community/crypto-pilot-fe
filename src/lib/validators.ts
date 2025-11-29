export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function minLength(v: string, len = 8) {
  return v.trim().length >= len;
}

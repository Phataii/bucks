// utils/random-gen.ts
export function randomGen(type: 'numeric' | 'alphanumeric', length: number): string {
  const chars =
    type === 'numeric'
      ? '0123456789'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

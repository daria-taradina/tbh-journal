export const parsePage = (value?: string) =>
  Math.max(1, Number.parseInt(value ?? "1", 10) || 1);
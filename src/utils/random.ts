export const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

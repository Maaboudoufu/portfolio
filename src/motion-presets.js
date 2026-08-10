import { useReducedMotion } from 'motion/react';

const REDUCED = { duration: 0.15 };

export const springs = {
  ui:     { type: 'spring', bounce: 0,   duration: 0.4 },
  drawer: { type: 'spring', bounce: 0.2, duration: 0.3 },
};

export function useSprings() {
  const reduced = useReducedMotion();
  return reduced
    ? { ui: REDUCED, drawer: REDUCED, reduced: true }
    : { ...springs, reduced: false };
}

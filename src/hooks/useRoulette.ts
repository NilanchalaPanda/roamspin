import { useCallback, useEffect, useRef, useState } from 'react';
import type { Destination } from '../domain/types';

export function useRoulette(pool: Destination[]) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Destination | null>(null);
  const [phase, setPhase] = useState<'idle'|'spinning'|'reveal'>('idle');
  const [history, setHistory] = useState<Destination[]>([]);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const spin = useCallback(() => {
    if (spinning || !pool.length) return;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const turns = 7 + Math.random() * 4;
    const target = rotation + turns * 360 + Math.random() * 360;
    setWinner(null); setSpinning(true); setPhase('spinning'); setRotation(target);
    timer.current = window.setTimeout(() => {
      setSpinning(false); setPhase('reveal'); setWinner(chosen);
      setHistory(h => [chosen, ...h.filter(x => x.id !== chosen.id)].slice(0, 5));
    }, 4300);
  }, [pool, rotation, spinning]);

  return { rotation, spinning, winner, phase, history, spin };
}

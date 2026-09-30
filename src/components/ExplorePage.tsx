import { useEffect, useMemo, useRef, useState } from 'react';
import { destinationRepository } from '../repositories/destinationRepository';
import type { Destination } from '../domain/types';

function MiniCard({ d }: { d: Destination }) {
  return <article className="exploreCard">
    <div className="exploreCardTop"><span>{d.kind}</span><b>₹{d.jugaadBudgetPerPersonINR.toLocaleString('en-IN')}+</b></div>
    <h3>{d.name}</h3>
    <p>{d.state} · {d.region}</p>
    <div className="exploreTags">{d.tags.slice(0, 3).map(t => <span key={t}>#{t}</span>)}</div>
    <a href={`/destination/${d.id}`}>Open destination →</a>
  </article>;
}

const PAGE_SIZE = 48;

export function ExplorePage() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');
  const [sort, setSort] = useState<'random' | 'budget' | 'name'>('random');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const all = destinationRepository.all();
  const states = destinationRepository.states();
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = all.filter(d => (!state || d.state === state) && (!q || `${d.name} ${d.state} ${d.region} ${d.tags.join(' ')}`.toLowerCase().includes(q)));
    if (sort === 'budget') return [...filtered].sort((a, b) => a.jugaadBudgetPerPersonINR - b.jugaadBudgetPerPersonINR);
    if (sort === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [all, query, state, sort]);

  // Every new search/filter starts from the first page. The catalogue itself is
  // never truncated; more cards are progressively mounted as the user scrolls.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, state, sort]);

  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting || isLoadingMore) return;
        setIsLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount(count => Math.min(count + PAGE_SIZE, results.length));
          setIsLoadingMore(false);
        }, 180);
      },
      { rootMargin: '600px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, results.length]);

  const loadMore = () => setVisibleCount(count => Math.min(count + PAGE_SIZE, results.length));

  return <main>
    <header><div className="brand">ESCAPE <span>DIRECTORY</span></div><a className="backLink" href="/">← Back to roulette</a></header>
    <section className="exploreHero">
      <span className="eyebrow">THE OTHER SIDE OF RANDOM</span>
      <h1>Browse the<br/><em>possibilities.</em></h1>
      <p>{all.length} destinations. Search them, stalk them, then send the decision back to the roulette.</p>
    </section>
    <section className="exploreTools panel">
      <label><span>SEARCH</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Try Goa, fort, beach, desert…" /></label>
      <label><span>STATE</span><select value={state} onChange={e => setState(e.target.value)}><option value="">Everywhere</option>{states.map(s => <option key={s}>{s}</option>)}</select></label>
      <label><span>SORT</span><select value={sort} onChange={e => setSort(e.target.value as typeof sort)}><option value="random">Catalogue order</option><option value="budget">Lowest jugaad first</option><option value="name">A–Z</option></select></label>
      <div className="exploreCount"><strong>{results.length}</strong> MATCHES<br/><small>SHOWING {Math.min(visibleCount, results.length)} OF {results.length}</small></div>
    </section>
    <section className="exploreGrid">{visibleResults.map(d => <MiniCard d={d} key={d.id} />)}</section>

    {results.length === 0 && <div className="exploreEmpty panel">No destinations match those filters. Try widening the search.</div>}

    {hasMore && <>
      <div ref={loadMoreRef} className="exploreLoader" aria-live="polite">
        <div className="exploreProgress"><span style={{ width: `${(visibleResults.length / results.length) * 100}%` }} /></div>
        <p>{isLoadingMore ? 'Loading more escapes…' : `Keep scrolling — ${results.length - visibleResults.length} more destinations waiting.`}</p>
        <button type="button" className="loadMoreButton" onClick={loadMore} disabled={isLoadingMore}>
          {isLoadingMore ? 'LOADING…' : `LOAD ${Math.min(PAGE_SIZE, results.length - visibleResults.length)} MORE`}
        </button>
      </div>
    </>}

    {!hasMore && results.length > 0 && <p className="exploreMore">You reached the end. All {results.length} matching destinations are loaded.</p>}
  </main>;
}

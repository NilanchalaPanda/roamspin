import type { Destination } from '../domain/types';

export function Wheel({ items, rotation, spinning, onSpin, phase }: { items: Destination[]; rotation: number; spinning: boolean; onSpin:()=>void; phase:string }) {
  const count=Math.max(12, Math.min(items.length, 28));
  const colors=Array.from({length:count},(_,i)=>`hsl(${(i*360/count)+12} 68% ${i%2?58:66}%)`).join(', ');
  return <div className="wheelStage">
    <div className="wheelHint">{phase==='reveal'?'DESTINATION LOCKED':'THE DESTINATION IS SECRET'}</div>
    <div className="pointer"><span>▼</span></div>
    <div className={`wheel ${spinning?'wheelSpinning':''}`} style={{transform:`rotate(${rotation}deg)`,background:`conic-gradient(${colors})`}}>
      <div className="secretOverlay"><span>{spinning?'...':'?'}</span><small>{spinning?'CHOOSING':'HIDE & SEEK'}</small></div>
      {Array.from({length:count}).map((_,i)=><i key={i} className="tick" style={{transform:`rotate(${i*(360/count)}deg)`}} />)}
    </div>
    <button className="spinBtn" disabled={spinning||!items.length} onClick={onSpin}>{spinning?'NO PEEK…':'SPIN THE UNKNOWN'}</button>
    <div className="wheelMeta"><span>🎲 {items.length} candidates</span><span>🔒 names hidden</span><span>⚡ {spinning?'7–11 sec of suspense':'your call'}</span></div>
  </div>
}

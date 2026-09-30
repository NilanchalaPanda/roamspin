import { useState } from 'react';
import type { Destination } from '../domain/types';
import { activities, foods, rules, stays } from '../data/tripOptions';
const pick=(a:string[])=>a[Math.floor(Math.random()*a.length)];
type Plan={stay:string;activity:string;food:string;rule:string};
export function TripBuilder({destination}:{destination:Destination}){
 const makePlan=():Plan=>({stay:pick(stays),activity:pick(activities),food:pick(foods),rule:pick(rules)});
 const [plan,setPlan]=useState<Plan>(makePlan);
 const reroll=(key:keyof Plan, options:string[])=>setPlan(p=>({...p,[key]:pick(options)}));
 const cards:[string,string,keyof Plan,string[]][]=[['🏠','STAY','stay',stays],['🧗','ACTIVITY','activity',activities],['🍜','FOOD','food',foods],['🎯','TRIP RULE','rule',rules]];
 return <section className="trip panel"><div className="sectionHead"><div><span className="eyebrow">04 · NOW MAKE IT YOURS</span><h2>You got {destination.name}. Now roll the dice again.</h2></div><button className="shuffleBtn" onClick={()=>setPlan(makePlan())}>Shuffle the whole trip ↻</button></div><div className="tripGrid">{cards.map(([icon,label,key,options])=><button className="tripCard" key={key} onClick={()=>reroll(key,options)}><span>{icon}</span><small>{label}</small><strong>{plan[key]}</strong><em>tap to reroll</em></button>)}</div></section>
}

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { experiments } from './data';

const canvasTypes = ['spring-mass','spring-toy','spring-tuner','metaballs','dither','boids','contour','bayer'];
const bayer = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function CanvasToy({kind,amount,speed,paused,seed}: {kind:string;amount:number;speed:number;paused:boolean;seed:number}) {
  const ref=useRef<HTMLCanvasElement>(null);
  const pointer=useRef({x:280,y:160,down:false,active:false,scatterUntil:0});
  const initial=()=>({x:370,y:160,vx:0,vy:0,t:0,birds:Array.from({length:65},()=>({x:Math.random()*560,y:Math.random()*320,vx:Math.random()*2-1,vy:Math.random()*2-1}))});
  const simulation=useRef<ReturnType<typeof initial>|null>(null);
  if(!simulation.current)simulation.current=initial();
  useEffect(()=>{simulation.current=initial();},[kind,seed]);
  useEffect(()=>{
    const c=ref.current!; const ctx=c.getContext('2d')!; let raf=0; let last=0; let t=simulation.current!.t; let painted=false;
    let {x,y,vx,vy}=simulation.current!;
    const birds=simulation.current!.birds;
    const draw=(now:number)=>{
      if(!c.getClientRects().length || document.hidden || (paused && painted && !pointer.current.down)){last=now;raf=requestAnimationFrame(draw);return;}
      painted=true;const dt=Math.min((now-last)/16.667||1,2); last=now; if(!paused)t+=dt*speed*.008;
      ctx.fillStyle='#061f27';ctx.fillRect(0,0,560,320);
      ctx.strokeStyle='#12373c';ctx.lineWidth=1;
      for(let i=0;i<560;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,320);ctx.stroke();}
      for(let i=0;i<320;i+=20){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(560,i);ctx.stroke();}
      if(kind.startsWith('spring')){
        if(pointer.current.down){vx=(pointer.current.x-x)*.3;vy=(pointer.current.y-y)*.3;x=pointer.current.x;y=pointer.current.y;}
        else if(!paused){const k=(amount*.0008+.004)*(kind==='spring-toy'?.65:1);vx+=(280-x)*k*dt;vy+=(160-y)*k*dt;vx*=Math.pow(1-speed*.025,dt);vy*=Math.pow(1-speed*.025,dt);x+=vx*dt;y+=vy*dt;}
        ctx.strokeStyle='#9aada4';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(280,160);
        const angle=Math.atan2(y-160,x-280),len=Math.hypot(x-280,y-160);
        for(let i=1;i<=30;i++){const d=len*i/30,off=i===30?0:Math.sin(i*Math.PI/2)*8;ctx.lineTo(280+Math.cos(angle)*d-Math.sin(angle)*off,160+Math.sin(angle)*d+Math.cos(angle)*off);}ctx.stroke();
        ctx.fillStyle='#899b91';ctx.fillRect(276,156,8,8);ctx.beginPath();ctx.arc(x+3,y+5,20,0,Math.PI*2);ctx.fillStyle='#0009';ctx.fill();
        ctx.beginPath();ctx.arc(x,y,20,0,Math.PI*2);ctx.fillStyle='#eac75b';ctx.fill();ctx.strokeStyle='#fff2ac';ctx.stroke();ctx.fillStyle='#8e721e';ctx.fillRect(x-5,y-1,10,2);ctx.fillRect(x-1,y-5,2,10);
        ctx.font='11px monospace';ctx.fillStyle='#8dafaa';ctx.fillText('DRAG THE WEIGHT · RELEASE TO RETURN',18,298);
      }else if(kind==='boids'){
        birds.forEach((b,i)=>{
          if(!paused){let ax=0,ay=0,cx=0,cy=0,sx=0,sy=0,n=0;birds.forEach((o,j)=>{if(i===j)return;const d=Math.hypot(o.x-b.x,o.y-b.y);if(d<65){ax+=o.vx;ay+=o.vy;cx+=o.x;cy+=o.y;n++;if(d<22){sx+=(b.x-o.x)/(d+1);sy+=(b.y-o.y)/(d+1);}}});
            if(n){b.vx+=(ax/n-b.vx)*.035+(cx/n-b.x)*.0007+sx*.07;b.vy+=(ay/n-b.vy)*.035+(cy/n-b.y)*.0007+sy*.07;}
            if(pointer.current.down||pointer.current.scatterUntil>now){const dx=b.x-pointer.current.x,dy=b.y-pointer.current.y,d=Math.hypot(dx,dy);if(d<140){b.vx+=dx/(d+1)*1.2;b.vy+=dy/(d+1)*1.2;}}
            const vel=Math.hypot(b.vx,b.vy)||1;const target=.6+amount*.025;b.vx=b.vx/vel*target;b.vy=b.vy/vel*target;b.x=(b.x+b.vx*speed*dt+560)%560;b.y=(b.y+b.vy*speed*dt+320)%320;}
          ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ctx.fillStyle=i%4===0?'#e8c963':'#85c9bd';ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(-4,-3);ctx.lineTo(-2,0);ctx.lineTo(-4,3);ctx.closePath();ctx.fill();ctx.restore();});
      }else if(kind==='metaballs'||kind==='dither'||kind==='bayer'){
        const balls=Array.from({length:5},(_,i)=>({x:70+210*(1+Math.sin(t*.6+i*1.8)),y:50+110*(1+Math.cos(t*.8+i*2.1))}));
        for(let py=0;py<320;py+=4)for(let px=0;px<560;px+=4){let val=0;
          if(kind==='metaballs'){for(const b of balls)val+=(400+amount*40)/((px-b.x)**2+(py-b.y)**2+1);if(pointer.current.active)val+=2500/((px-pointer.current.x)**2+(py-pointer.current.y)**2+1);ctx.fillStyle=val>1?'#8dd4bf':val>.84?'#487e74':'#061f27';}
          else{val=kind==='dither'?px/560+(amount-50)/150: .45+.24*Math.sin(px*.022+t)+.22*Math.cos(py*.032-t*1.3)+.15*Math.sin((px+py)*.014+t*.7)+(amount-50)/160;const threshold=bayer[(Math.floor(py/4)%4)*4+(Math.floor(px/4)%4)]/16;ctx.fillStyle=val>threshold?'#b7d4b6':'#173e39';}ctx.fillRect(px,py,4,4);}
      }else if(kind==='contour'){
        const field=(px:number,py:number)=>Math.sin(px*.012+t*.3)*Math.cos(py*.013+t*.2)*50+Math.sin(px*.023+py*.011-t*.5)*25+py*.3;
        for(let level=-65;level<180;level+=10){ctx.strokeStyle=level%30===0?'#d6c877':'#509a8d';ctx.lineWidth=level%30===0?1.3:.7;ctx.beginPath();for(let py=0;py<320;py+=8)for(let px=0;px<560;px+=8){const points=[[px,py],[px+8,py],[px+8,py+8],[px,py+8]];const hits:number[][]=[];for(let e=0;e<4;e++){const a=points[e],b=points[(e+1)%4],av=field(a[0]*amount/50,a[1]),bv=field(b[0]*amount/50,b[1]);if((av<level)!==(bv<level)){const f=(level-av)/(bv-av);hits.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]);}}if(hits.length>=2){ctx.moveTo(hits[0][0],hits[0][1]);ctx.lineTo(hits[1][0],hits[1][1]);}}ctx.stroke();}
      }
      simulation.current={x,y,vx,vy,t,birds};
      raf=requestAnimationFrame(draw);
    };raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf);
  },[kind,amount,speed,paused,seed]);
  const update=(e:React.PointerEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();pointer.current.x=(e.clientX-r.left)/r.width*560;pointer.current.y=(e.clientY-r.top)/r.height*320;pointer.current.active=true;};
  return <canvas ref={ref} width="560" height="320" tabIndex={0} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)){e.preventDefault();pointer.current.down=true;pointer.current.x+=e.key==='ArrowLeft'?-20:e.key==='ArrowRight'?20:0;pointer.current.y+=e.key==='ArrowUp'?-20:e.key==='ArrowDown'?20:0;}}} onKeyUp={()=>{pointer.current.down=false;}} aria-label={`${kind} interactive simulation. Drag or tap to interact. Arrow keys move the weight; Space scatters boids.`} onPointerDown={e=>{update(e);pointer.current.down=true;pointer.current.scatterUntil=performance.now()+450;e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={update} onPointerUp={()=>{pointer.current.down=false;}} onPointerCancel={()=>{pointer.current.down=false;}} onPointerLeave={()=>{pointer.current.active=false;}}/>;
}
function Scramble({text}: {text:string}) {
 const [value,setValue]=useState(text); const timer=useRef<ReturnType<typeof setInterval>|undefined>(undefined);
 useEffect(()=>()=>clearInterval(timer.current),[]);
 const decode=()=>{clearInterval(timer.current);if(matchMedia('(prefers-reduced-motion: reduce)').matches){setValue(text);return;}let n=0;timer.current=setInterval(()=>{setValue(text.split('').map((c,i)=>i<n?c:'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random()*36)]).join(''));n+=.6;if(n>text.length)clearInterval(timer.current);},35);};
 return <button className="scramble-text" onMouseEnter={decode} onFocus={decode} onClick={decode}>{value}</button>;
}
export function ExperimentView({id}: {id:string}) {
 const exp=experiments.find(e=>e.id===id)!;
 const [amount,setAmount]=useState(50),[speed,setSpeed]=useState(1),[seed,setSeed]=useState(0),[paused,setPaused]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),[count,setCount]=useState(0),[text,setText]=useState('Make something that makes you feel something.'),[typed,setTyped]=useState(0),[order,setOrder]=useState([0,1,2,3,4]),[point,setPoint]=useState({x:50,y:50}),[palette,setPalette]=useState('sage');
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setPaused(m.matches);m.addEventListener('change',change);return()=>m.removeEventListener('change',change);},[]);
 useEffect(()=>{if(id!=='typewriter'||paused)return;const timer=setInterval(()=>setTyped(v=>Math.min(v+1,text.length)),90/speed);return()=>clearInterval(timer);},[id,paused,text,speed,seed]);
 const reset=()=>{setAmount(50);setSpeed(1);setCount(0);setTyped(0);setOrder([0,1,2,3,4]);setSeed(s=>s+1);};
 const canvas=canvasTypes.includes(id);
 const hasIntensity=!['scramble','shuffle','click','typewriter','linear'].includes(id);
 const hasTempo=!['optical-type','glass','scramble','shuffle','click','linear','dither','gooey'].includes(id);
 const hasPause=hasTempo||id==='linear';
 return <div className="experiment-app"><div className="experiment-heading"><span className="eyebrow">EXPERIMENT {String(experiments.indexOf(exp)+1).padStart(2,'0')} / 22</span><h1>{exp.name}</h1><p>{exp.description}</p></div>
 <div className={`experiment-stage ${paused?'paused':''} palette-${palette}`} style={{'--tempo':`${6/speed}s`,'--amount':amount,'--scale':.5+amount/100} as CSSProperties}>
 {canvas?<CanvasToy kind={id} amount={amount} speed={speed} paused={paused} seed={seed}/>:<>
 {id==='optical-type'&&<div className="type-specimen"><small>Aa — TAHOMA / SYSTEM SANS</small><span style={{fontSize:22+amount*.7,letterSpacing:`${(50-amount)*.035}px`}}>Form follows<br/>feeling.</span><small>{Math.round(22+amount*.7)} PX · OPTICAL SPACING STUDY</small></div>}
 {id==='glass'&&<div className="glass-scene"><div className="glass-orb"/><div className="acrylic" style={{backdropFilter:`blur(${amount/4}px)`,transform:`rotateY(${(amount-50)*.5}deg) rotate(-8deg)`}}><small>ACRYLIC / 001</small><span>See<br/>through.</span><small>DEPTH {amount} MM</small></div></div>}
 {id==='scramble'&&<div className="center-toy"><small>HOVER, FOCUS, OR TAP TO DECODE</small><Scramble text="HELLO, HUMAN."/></div>}
 {id==='gooey'&&<div className="goo-area" onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();setPoint({x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100});}}><svg width="0" height="0"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="10"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"/></filter></defs></svg><div className="goo-blobs">{[0,1,2,3,4].map(i=><i key={i} style={{left:`${i===0?point.x:50+Math.cos(i*1.57)*amount*.35}%`,top:`${i===0?point.y:50+Math.sin(i*1.57)*amount*.35}%`}}/>)}</div><small>MOVE YOUR POINTER THROUGH THE INK</small></div>}
 {id==='shuffle'&&<div className="shuffle-demo"><div className="shuffle-list">{[0,1,2,3,4].map(i=><div className="shuffle-item" key={i} style={{transform:`translateY(${order.indexOf(i)*44}px)`}}><b>0{i+1}</b>{['Curiosity','A little chaos','Iteration','Happy accidents','Something good'][i]}<span>≡</span></div>)}</div><button className="win-button" onClick={()=>setOrder(o=>{const next=[...o];for(let i=next.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[next[i],next[j]]=[next[j],next[i]];}return next.every((v,i)=>v===o[i])?[...next.slice(1),next[0]]:next;})}>Shuffle the stack ↕</button></div>}
 {id==='breathing-type'&&<div className="breathing-type" style={{fontSize:35+amount*.6}}>inhale.<span>exhale.</span></div>}
 {(id==='orbital'||id==='css-orbits')&&<div className={`orbit-system ${id==='css-orbits'?'css-paths':''}`}><div className="sun">✳</div>{[0,1,2].map(i=><div key={i} className={`orbit orbit-${i}`} style={{width:(100+i*75)*(.65+amount*.007),height:(100+i*75)*(.65+amount*.007),animationDuration:`${(i+1)*5/speed}s`}}><i/></div>)}<small>ALL IS QUIET OUT HERE.</small></div>}
 {id==='click'&&<div className="counter-toy"><div className="counter-readout">{String(count).padStart(5,'0')}</div><button className="big-click" onClick={()=>setCount(c=>c+1)}>CLICK<span>just one more.</span></button><small>{count===0?'A GOOD BUTTON NEEDS NO REASON.':`${count} VERY SATISFYING ${count===1?'CLICK':'CLICKS'}.`}</small></div>}
 {id==='bars'&&<div className="audio-bars">{Array.from({length:22},(_,i)=><i key={i} style={{animationDelay:`${-i*.17}s`,height:`${30+Math.sin(i*.7)*20+amount*1.2}px`}}/>)}<small>VISUAL ONLY · SILENCE IS GOLDEN</small></div>}
 {id==='conic'&&<div className="conic-demo"><div className="conic-loader" style={{width:100+amount,height:100+amount}}/><small>TAKING THE LONG WAY AROUND.</small></div>}
 {id==='grid'&&<div className="breathing-grid" style={{gridTemplateColumns:`repeat(8, ${12+amount*.14}px)`}}>{Array.from({length:64},(_,i)=><i key={i} style={{animationDelay:`${-(Math.floor(i/8)+i%8)*.15}s`}}/>)}</div>}
 {id==='typewriter'&&<div className="typewriter"><small>C:\MIKAIL\THOUGHTS.TXT</small><p>{text.slice(0,typed)}<span className={typed===text.length?'stopped-cursor':'cursor'}>▋</span></p><small>{typed===text.length?'PROCESS COMPLETE. NOTHING MORE TO SAY.':'WRITING TO MEMORY...'}</small></div>}
 {id==='linear'&&<div className="linear-demo"><div className="linear-track"><i key={count} className={count%2?'go':''}/></div><button className="win-button" onClick={()=>setCount(c=>c+1)}>Release spring →</button><code>transition-timing-function: linear(…)</code></div>}
 </>}
 </div><fieldset className="experiment-controls"><legend>Control panel</legend>{hasIntensity&&<label>{id.startsWith('spring')?'Stiffness':id==='optical-type'?'Type size':id==='glass'?'Depth':'Intensity'}<input aria-label="Intensity" type="range" min="5" max="100" value={amount} onChange={e=>setAmount(+e.target.value)}/><output>{amount}</output></label>}{hasTempo&&<label>{id.startsWith('spring')?'Damping':'Tempo'}<input aria-label="Tempo" type="range" min=".3" max="3" step=".1" value={speed} onChange={e=>setSpeed(+e.target.value)}/><output>{speed.toFixed(1)}×</output></label>}<div className="control-actions">{hasPause&&<button className="win-button" onClick={()=>setPaused(p=>!p)}>{paused?'▶ Play':'Ⅱ Pause'}</button>}<button className="win-button" onClick={reset}>Reset</button>{['orbital','css-orbits','grid','bars','conic'].includes(id)&&<select aria-label="Palette" value={palette} onChange={e=>setPalette(e.target.value)}><option value="sage">Sage</option><option value="amber">Amber</option><option value="ice">Ice</option></select>}</div>{id==='typewriter'&&<input className="type-input" aria-label="Typewriter text" value={text} maxLength={140} onChange={e=>{setText(e.target.value);setTyped(0);}}/>}</fieldset><div className="experiment-footer"><span>Source: {exp.source}</span><span>{paused?'Reduced motion / paused':'● Running locally'} · {exp.category}</span></div></div>;
}

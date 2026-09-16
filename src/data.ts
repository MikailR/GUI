import type { IconName } from './Icons';
export const apps: {id:string;name:string;icon:IconName;description:string}[] = [
  {id:'about',name:'My Computer',icon:'computer',description:'A little about me'},
  {id:'lab',name:'Lab',icon:'lab',description:'22 experiments to play with'},
  {id:'projects',name:'Hackathons',icon:'folder',description:'Things built against the clock'},
  {id:'writing',name:'Writing',icon:'note',description:'Notes from the workbench'},
  {id:'papers',name:'Papers & Analyses',icon:'paper',description:'Going a little deeper'},
  {id:'trash',name:'Recycle Bin',icon:'trash',description:'Nothing is ever really wasted'},
];
export const sources = ['grok-4.6','fable-5.1','opus-5','gpt-6-astra','claude-design'];
export const experiments = [
  ['spring-mass','Spring mass',0,'Physics','Pull a point away from home. Let physics bring it back.'],
  ['optical-type','Optical size',0,'Typography','One specimen. Every size has a different voice.'],
  ['glass','Glass depth',0,'Material','Layered acrylic, rendered by your browser.'],
  ['spring-toy','Spring toy',1,'Physics','A little weight, a little friction, a lot of fun.'],
  ['metaballs','Metaballs',1,'Canvas','Separate things with a tendency to become one.'],
  ['scramble','Text scramble',1,'Typography','A message hiding in plain sight. Hover to decode.'],
  ['dither','Ordered dither',1,'Pixels','Turning a smooth world into a very small palette.'],
  ['boids','Boids',1,'Simulation','No leader. Just three rules and a little chaos.'],
  ['contour','Contour Field',2,'Canvas','A living topographic map of nowhere in particular.'],
  ['spring-tuner','Spring Tuner',2,'Physics','Find the space between snappy and springy.'],
  ['gooey','Gooey Cursor',2,'SVG filter','A cursor that leaves a little of itself behind.'],
  ['shuffle','FLIP Shuffle',2,'Motion','New order. Same elements. A smooth journey between.'],
  ['bayer','Bayer Camera',2,'Pixels','A synthetic live feed through a four-by-four matrix.'],
  ['breathing-type','Breathing Type',2,'Typography','Letters with a pulse. No microphone required.'],
  ['orbital','Orbital daydream',3,'CSS','A small solar system with nowhere to be.'],
  ['click','Satisfying click',3,'Interaction','For the simple pleasure of pressing a good button.'],
  ['css-orbits','Orbits without JS',4,'CSS','Satellites taking the scenic route. Pure CSS motion.'],
  ['bars','Audio-ish bars',4,'CSS','Looks like sound. Sounds like absolutely nothing.'],
  ['conic','Conic loader',4,'CSS','Going around in circles, beautifully.'],
  ['grid','Breathing grid',4,'CSS','A field of little squares taking a collective breath.'],
  ['typewriter','Typewriter',4,'Typography','A sentence that knows when to stop.'],
  ['linear','Linear() spring',4,'CSS','A spring curve with no physics engine attached.'],
].map(([id,name,source,category,description])=>({id:String(id),name:String(name),source:sources[Number(source)],category:String(category),description:String(description)}));
export type Experiment = typeof experiments[number];
export const articles = [
  {title:'Small interfaces, big feelings',date:'SEPT 12, 2026',time:'4 min read',text:'The interfaces I remember most are the ones that made the smallest actions feel good. A switch with some resistance. A button that visibly gives way. A folder that feels like a place, rather than a label.\n\nThere is information in those little details. A raised edge tells you something can be pressed. A sunken edge says something lives inside. Long before a tooltip arrives, the surface has already explained itself.\n\nI have been experimenting with bringing that quality back to the web. Not because every interface needs to look old, but because every interface should feel considered.\n\nThe test is simple: does the detail help someone understand what happens next? If it does, keep it. If it only gets in the way, let it go.'},
  {title:'In praise of the unfinished experiment',date:'AUG 28, 2026',time:'3 min read',text:'Some things should be allowed to stay small. A spring on a page. A field of moving dots. A word that changes its weight when you touch it.\n\nAn experiment does not need a business model to be useful. It needs a question. What would happen if this were heavier? What if the delay were twice as long? What if the text moved, but its container did not?\n\nThe Lab is where I keep those questions. None of them are finished products. All of them have taught me something.'},
  {title:'Building under a very unreasonable deadline',date:'AUG 03, 2026',time:'5 min read',text:'At a hackathon, the clock is part of the design team. It has strong opinions.\n\nWe started with a feature list that could have filled a month. By midnight, we had one useful interaction. By morning, we had made that interaction understandable. The demo worked because we finally agreed on what mattered.\n\nThe lesson I took home was not to work faster. It was to decide earlier. A small thing that works is a much better conversation starter than a large thing that almost does.'},
];

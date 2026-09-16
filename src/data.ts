export const sources = ['grok-4.6','fable-5.1','opus-5','gpt-6-astra','claude-design'];
export const experiments = [
['Spring mass','Drag, stretch, let go.','grok-4.6','spring'],
['Optical size','A little type, a lot of personality.','grok-4.6','type'],
['Glass depth','A study in translucent layers.','grok-4.6','glass'],
['Spring toy','Give a damped spring a gentle throw.','fable-5.1','spring'],
['Metaballs','Separate shapes. Shared attraction.','fable-5.1','metaballs'],
['Text scramble','A message hiding in the noise.','fable-5.1','scramble'],
['Ordered dither','Gradients, one bit at a time.','fable-5.1','dither'],
['Boids','A tiny, somewhat chaotic flock.','fable-5.1','boids'],
['Contour Field','A landscape that never sits still.','opus-5','contour'],
['Spring Tuner','Find your kind of bounce.','opus-5','spring'],
['Gooey Cursor','Leave a little liquid in your wake.','opus-5','goo'],
['FLIP Shuffle','Everything in its new place.','opus-5','flip'],
['Bayer Camera','An imaginary camera from 1984.','opus-5','camera'],
['Breathing Type','Letters with a pulse.','opus-5','breathing'],
['Orbital daydream','Somewhere between here and space.','gpt-6-astra','orbit'],
['Satisfying click','One more click couldn’t hurt.','gpt-6-astra','click'],
['Orbits without JS','Satellites on a CSS-only journey.','claude-design','cssorbit'],
['Audio-ish bars','No music. Still a good rhythm.','claude-design','bars'],
['Conic loader','Going nowhere, beautifully.','claude-design','loader'],
['Breathing grid','A small collective inhale.','claude-design','grid'],
['Typewriter','A thought, with a proper ending.','claude-design','writer'],
['Linear() spring','A bounce written in pure CSS.','claude-design','linear']
].map(([name,description,source,kind],index)=>({id:index+1,name,description,source,kind}));
export type Experiment = typeof experiments[number];
export const apps = ['About','Hackathons','Writing','Lab','Papers','Trash'];

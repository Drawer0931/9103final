const fs=require('fs'),vm=require('vm'),assert=require('assert');
let now=0,seed=1;const ctx={console,Math,millis:()=>now,max:Math.max,min:Math.min,floor:Math.floor,canvasScale:1,width:1280,height:720,randomSeed:()=>{},noiseSeed:()=>{},random:(a,b)=>{seed=(seed*16807)%2147483647;const r=seed/2147483647;if(Array.isArray(a))return a[Math.floor(r*a.length)];return b===undefined?r*a:a+r*(b-a)},heldCircle:null};vm.createContext(ctx);
for(const f of ['circle.js','circle_manager.js','noise.js','time-mechanic.js'])vm.runInContext(fs.readFileSync(require('path').join(__dirname,f),'utf8'),ctx);
vm.runInContext('globalThis.manager=new CircleManager();initialiseCircles(1,manager)',ctx);
const m=ctx.manager,original=[...m.circles],seen=new Set();let replacements=0,zero=0;
for(now=0;now<=240000;now+=50){const before=[...m.circles];ctx.updateTimeMechanic(m,now);assert.equal(m.circles.length,30);assert(m.circles.filter(c=>c.lifeState!=='alive').length<=6);for(let i=0;i<30;i++){const c=m.circles[i];assert(c.lifeAlpha>=0&&c.lifeAlpha<=1);if(c.lifeAlpha===0)zero++;if(c!==before[i]){assert.equal(before[i].lifeAlpha,0);assert.equal(c.lifeAlpha,0);assert(Number.isFinite(c.haloBrightness));replacements++;seen.add(c.sizeLevel)}}}
assert.equal(seen.size,6);assert(replacements>30);assert(zero>0);
const oldArray=m.circles;vm.runInContext('initialiseCircles(2,manager)',ctx);ctx.updateTimeMechanic(m,now);assert.notEqual(oldArray,m.circles);assert(m.circles.every(c=>c.lifeAlpha===1));
console.log({seconds:240,replacements,zeroAlphaSamples:zero,allSixGroupsReplaced:seen.size===6,resetPassed:true});


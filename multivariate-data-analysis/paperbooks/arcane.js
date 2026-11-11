/* ---------- ARCANE theme: magic-archive atmosphere + ink particles (opt-in: BOOK.theme === 'arcane') ---------- */
const ARC=(B.theme==='arcane')?(function(){
  document.body.classList.add('arcane');
  scene.background=new THREE.Color(0x120e1c);scene.fog=new THREE.Fog(0x120e1c,9,22);
  desk.material.color.setHex(0x5a4436);
  const glowTex=canvasTex(128,128,(g,w,h)=>{const r=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(0.25,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h);});
  const addGlow=(c,s,o)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:c,transparent:true,opacity:o===undefined?1:o,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));m.scale.setScalar(s);m.raycast=()=>{};return m;};
  // gold rim on the cover
  const gold=mat(0xc9a14a,{metalness:.7,roughness:.35,flatShading:false});
  [[BW*2+0.36,0.02,0,(BH+0.24)/2],[BW*2+0.36,0.02,0,-(BH+0.24)/2]].forEach(([w,h,x,z])=>book.add(at(box(w,0.075,0.035,gold),x,-0.03,z)));
  [-1,1].forEach(s=>book.add(at(box(0.035,0.075,BH+0.27,gold),s*(BW+0.17),-0.03,0)));
  // props behind the book: candles, stacked tomes, inkwell + quill, crystal
  const candles=[];
  function candle(x,z,h){const g=new THREE.Group();g.add(at(cyl(0.16,0.2,0.06,0x8a6a3a,16),0,0.03,0));const w=cyl(0.08,0.085,h,0xf1e6c8,14);w.position.y=0.06+h/2;g.add(w);
    const fl=addGlow(0xffb24a,0.32);fl.position.y=0.06+h+0.07;g.add(fl);const core=addGlow(0xfff2c0,0.12);core.position.y=0.06+h+0.06;g.add(core);
    const L=new THREE.PointLight(0xffa64a,0.4,1.6,2);L.position.y=0.06+h+0.15;g.add(L);g.position.set(x,-0.3,z);scene.add(g);candles.push({fl,core,L,ph:Math.random()*6});}
  candle(-2.0,-1.98,0.2);candle(-1.55,-2.12,0.14);candle(1.95,-2.0,0.18);
  [[0x4a2a3a,0.32],[0x2a3a4a,0.26],[0x3a4a2a,0.3],[0x5a3a1a,0.24]].reduce((y,[c,t],i)=>{const b=box(1.05-i*0.08,t,0.78-i*0.05,c);b.position.set(3.1,y+t/2,-2.9);b.rotation.y=0.15*(i%2?1:-1);scene.add(b);const band=box(1.06-i*0.08,0.03,0.79-i*0.05,gold);band.position.copy(b.position);band.rotation.y=b.rotation.y;scene.add(band);return y+t;},-0.3);
  const ink=cyl(0.13,0.16,0.2,0x1a1a2e,12);ink.position.set(-0.9,-0.2,-2.55);scene.add(ink);
  const quill=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.9,6),mat(0xe8e0d0));quill.position.set(-0.8,0.22,-2.53);quill.rotation.z=-0.45;quill.rotation.x=0.2;scene.add(quill);
  const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(0.18,0),new THREE.MeshStandardMaterial({color:0x8fd8ff,emissive:0x2a6aa0,emissiveIntensity:.8,roughness:.2,metalness:.1,transparent:true,opacity:.85}));crystal.position.set(1.1,0.35,-2.6);scene.add(crystal);const cg=addGlow(0x7fd0ff,0.9,0.5);cg.position.copy(crystal.position);scene.add(cg);
  // lights: cool moonlight + warmer fill
  scene.traverse(o=>{if(o.isAmbientLight)o.intensity=0.2;if(o.isHemisphereLight)o.intensity=0.3;if(o.isDirectionalLight)o.intensity=0.95;if(o.isPointLight&&o.distance>5)o.intensity=0.15;});
  // floating orbs (kept around the book, not over the text) + dust motes
  const orbs=[];for(let i=0;i<16;i++){const side=i%2?1:-1;const c=[0xffc86a,0x8fe0d0,0xc6a2ff][i%3];const o=addGlow(c,0.18+Math.random()*0.22,0.75);const b={x:side*(2.7+Math.random()*1.6),y:0.5+Math.random()*2.2,z:-2.8+Math.random()*3.6};if(i%5===0){b.x=(Math.random()-.5)*4;b.z=-2.9+Math.random()*0.6;b.y=1.6+Math.random()*1.2;}o.position.set(b.x,b.y,b.z);scene.add(o);orbs.push({o,b,ph:Math.random()*6,sp:0.3+Math.random()*0.5});}
  const DN=260,dg=new THREE.BufferGeometry(),dp=new Float32Array(DN*3);for(let i=0;i<DN;i++){dp[i*3]=(Math.random()-.5)*10;dp[i*3+1]=Math.random()*4;dp[i*3+2]=-4+Math.random()*6;}dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
  const dust=new THREE.Points(dg,new THREE.PointsMaterial({size:0.035,map:glowTex,color:0xffe3a8,transparent:true,opacity:.35,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));dust.raycast=()=>{};scene.add(dust);

  /* ---- spell effects: each page gets a different one (cycled), spec.fx can force one ---- */
  const systems=[],decor=[];
  const PALS={ink:[0x1a2a6a,0x0e6a60,0x5a2a9a,0x1a2a6a],gold:[0xa8740a,0xc8901a,0x8a5a08,0xe0a830],teal:[0x0e6a60,0x138a7a,0x0a4a44,0x2aa090],violet:[0x5a2a9a,0x7a3ab8,0x3a1a6a,0x9a5ad0],ember:[0xb8420e,0xd86a1a,0x8a2a08,0xe8902a],night:[0x1a2a6a,0x2a4aa0,0x0a1440,0xa8740a]};
  const palC=k=>(PALS[k]||PALS.ink).map(c=>new THREE.Color(c));
  const inkMat=sz=>new THREE.ShaderMaterial({uniforms:{map:{value:glowTex},size:{value:sz}},vertexShader:'attribute float alpha;attribute vec3 color;varying vec3 vC;varying float vA;uniform float size;void main(){vC=color;vA=alpha;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=size*(420.0/-mv.z);gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform sampler2D map;varying vec3 vC;varying float vA;void main(){vec4 t=texture2D(map,gl_PointCoord);float a=t.a*vA;if(a<0.01)discard;gl_FragColor=vec4(vC,a);}',transparent:true,depthWrite:false});
  const tmp=new THREE.Vector3(),tmp2=new THREE.Vector3();
  function sample(root,n){root.updateMatrixWorld(true);const meshes=[];root.traverse(o=>{if(o.isMesh&&o.visible&&o.geometry&&o.geometry.attributes.position&&!(o.material&&o.material.map&&o.material.transparent&&o.geometry.type==='PlaneGeometry'))meshes.push(o);});
    const out=[];if(!meshes.length)return out;let tries=0;while(out.length<n&&tries<n*4){tries++;const m=meshes[Math.floor(Math.random()*meshes.length)];let vis=true;m.traverseAncestors(a=>{if(!a.visible)vis=false;});if(!vis)continue;const pa=m.geometry.attributes.position;const k=Math.floor(Math.random()*pa.count);tmp.fromBufferAttribute(pa,k).applyMatrix4(m.matrixWorld);out.push(tmp.clone());}return out;}
  const pageV=(x,z)=>rightPage.localToWorld(new THREE.Vector3(x,z,0.004));
  function pagePts(n,spread){const out=[];for(let i=0;i<n;i++)out.push(pageV((Math.random()-.5)*BW*0.8,(Math.random()-.5)*BH*(spread||0.55)+BH*0.1));return out;}
  function centerOf(pts){const c=new THREE.Vector3();pts.forEach(p=>c.add(p));c.divideScalar(Math.max(1,pts.length));c.y=pageV(0,0).y;return c;}
  const rnd=()=>Math.random()-0.5;
  function burst(starts,targets,o){const n=Math.min(starts.length,targets.length);if(!n)return;const geo=new THREE.BufferGeometry();const pos=new Float32Array(n*3),col=new Float32Array(n*3),al=new Float32Array(n);geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.setAttribute('alpha',new THREE.BufferAttribute(al,1));
    const pts=new THREE.Points(geo,inkMat(o.size||0.05));pts.raycast=()=>{};pts.frustumCulled=false;scene.add(pts);const C=palC(o.pal);const st=o.stagger===undefined?0.6:o.stagger;
    const P=[];for(let i=0;i<n;i++){const v=new THREE.Vector3(rnd(),Math.random()*0.8+0.2,rnd()).normalize().multiplyScalar(0.5+Math.random()*0.6);P.push({s:starts[i],t:targets[i],d:o.seq?i/n*o.seq:Math.random()*st,c:C[i%C.length],w:Math.random()*6.28,r:0.05+Math.random()*0.12,v,fl:Math.random()*6});}
    const hold=o.hold||0,dur=o.dur||1.1,fade=o.fade||0.5;systems.push({pts,geo,P,t0:CLOCK,dur,fade,hold,mode:o.mode||'arc',c:o.c||centerOf(targets),arc:o.arc===undefined?0.35:o.arc,end:(o.seq||st)+hold+dur+fade});}
  const easeIO=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,easeO=u=>1-Math.pow(1-u,3);
  function move(S2,p,u){const e=easeIO(u);
    switch(S2.mode){
      case 'spiral':{tmp.copy(p.s).lerp(p.t,e);const a=p.w+e*10,R=(1-e)*(0.3+p.r*2.5);tmp.x+=Math.cos(a)*R;tmp.z+=Math.sin(a)*R;tmp.y+=Math.sin(Math.PI*e)*0.3;break;}
      case 'rain':{const g=u*u;tmp.copy(p.s).lerp(p.t,g);tmp.x+=Math.sin(u*6+p.w)*0.04*(1-u);break;}
      case 'burst':{const c=tmp2.copy(S2.c);c.y+=0.45;if(u<0.4){tmp.copy(c).addScaledVector(p.v,easeO(u/0.4));}else{const q=easeIO((u-0.4)/0.6);tmp.copy(c).add(p.v).lerp(p.t,q);}break;}
      case 'beam':{tmp.copy(p.s).lerp(p.t,e);const a=p.w+u*8,R=(1-e)*0.12;tmp.x+=Math.cos(a)*R;tmp.z+=Math.sin(a)*R;break;}
      case 'twinkle':{tmp.copy(p.s).lerp(p.t,easeO(u));break;}
      default:{tmp.copy(p.s).lerp(p.t,e);tmp.y+=Math.sin(Math.PI*e)*S2.arc;const sw=(1-e)*p.r;tmp.x+=Math.cos(p.w+e*7)*sw;tmp.z+=Math.sin(p.w+e*7)*sw;}}}
  // decorations drawn on/above the page
  const runeTex=(()=>{const SY=['μ','σ','β','χ²','r','ρ','Σ','α','F','t','R²','λ'];return canvasTex(512,512,(g,w,h)=>{const c=w/2;g.strokeStyle='#fff';g.fillStyle='#fff';g.lineWidth=6;[230,200,120].forEach(r=>{g.beginPath();g.arc(c,c,r,0,7);g.stroke();});
    g.lineWidth=3;for(let k=0;k<2;k++){g.beginPath();for(let i=0;i<=3;i++){const a=i/3*Math.PI*2+k*Math.PI/3-Math.PI/2;const x=c+Math.cos(a)*200,y=c+Math.sin(a)*200;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
    g.font='bold 30px "Noto Serif TC",serif';g.textAlign='center';g.textBaseline='middle';SY.forEach((s,i)=>{const a=i/SY.length*Math.PI*2;g.fillText(s,c+Math.cos(a)*215,c+Math.sin(a)*215);});});})();
  const ringTex=canvasTex(256,256,(g,w,h)=>{g.strokeStyle='#fff';g.lineWidth=10;g.beginPath();g.arc(w/2,h/2,w/2-8,0,7);g.stroke();});
  function flat(tex,color,size,c){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:tex,color,transparent:true,opacity:0,depthWrite:false,toneMapped:false}));m.rotation.x=-Math.PI/2;m.position.copy(c);m.position.y+=0.006;m.scale.setScalar(0.001);m.raycast=()=>{};scene.add(m);return m;}
  function addDecor(kind,c,color){const t0=CLOCK;
    if(kind==='circle'){const m=flat(runeTex,color,1,c);decor.push({t0,end:3.2,m,up:el=>{const k=Math.min(1,el/0.6);m.scale.setScalar(Math.max(0.001,1.9*easeO(k)));m.rotation.z=el*0.8;m.material.opacity=el<2.4?0.75*k:Math.max(0,0.75*(1-(el-2.4)/0.8));}});}
    if(kind==='ripple'){[0,0.25,0.5].forEach(dl=>{const m=flat(ringTex,color,1,c);decor.push({t0:t0+dl,end:1.6,m,up:el=>{const k=Math.max(0,el/1.6);m.scale.setScalar(Math.max(0.001,0.2+2.6*easeO(k)));m.material.opacity=0.7*(1-k);}});});}
    if(kind==='beam'){const m=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.5,2.2,32,1,true),new THREE.MeshBasicMaterial({color,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,toneMapped:false}));m.position.copy(c);m.position.y+=1.1;m.raycast=()=>{};scene.add(m);
      decor.push({t0,end:2.6,m,up:el=>{const k=Math.min(1,el/0.4);m.scale.set(1,Math.max(0.001,k),1);m.position.y=c.y+1.1*k;m.material.opacity=el<1.8?0.22*k:Math.max(0,0.22*(1-(el-1.8)/0.8));}});}}
  // the spell book: 7 entrances, 3 exits
  const FX=[
    {name:'墨水凝聚',go:(tg)=>burst(pagePts(tg.length),tg,{mode:'arc',pal:'ink',dur:1.25,stagger:0.55,size:0.1,arc:0.3,fade:0.9})},
    {name:'星芒漩渦',go:(tg,c)=>{addDecor('circle',c,0x5a2a9a);const s=tg.map(()=>{const a=Math.random()*6.28,r=Math.random()*0.25;return c.clone().add(new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r));});burst(s,tg,{mode:'spiral',pal:'violet',dur:1.4,stagger:0.5,size:0.09,fade:0.9,c});}},
    {name:'金粉降落',go:(tg)=>{const s=tg.map(t=>t.clone().add(new THREE.Vector3(rnd()*0.5,1.6+Math.random()*1.2,rnd()*0.5)));burst(s,tg,{mode:'rain',pal:'gold',dur:1.1,stagger:0.7,size:0.09,fade:1.0});}},
    {name:'火花迸發',go:(tg,c)=>{addDecor('ripple',c,0xb8420e);burst(tg.map(()=>c.clone()),tg,{mode:'burst',pal:'ember',dur:1.4,stagger:0.25,size:0.085,fade:0.8,c});}},
    {name:'光柱升起',go:(tg,c)=>{addDecor('beam',c,0x2aa090);const s=tg.map(()=>{const a=Math.random()*6.28,r=Math.random()*0.4;return c.clone().add(new THREE.Vector3(Math.cos(a)*r,Math.random()*2.0,Math.sin(a)*r));});burst(s,tg,{mode:'beam',pal:'teal',dur:1.1,stagger:0.6,size:0.085,fade:0.9});}},
    {name:'羽筆書寫',go:(tg)=>{const n=tg.length;const s=tg.map((_,i)=>{const u=i/n;return pageV((u-0.5)*BW*0.82,BH*0.1+Math.sin(u*Math.PI*5)*0.28+rnd()*0.05);});burst(s,tg,{mode:'arc',pal:'night',seq:0.7,hold:0.35,dur:0.8,size:0.075,arc:0.4,fade:0.8});}},
    {name:'星辰閃現',go:(tg,c)=>{addDecor('circle',c,0xa8740a);const s=tg.map(t=>t.clone().add(new THREE.Vector3(rnd()*0.7,0.2+Math.random()*0.5,rnd()*0.7)));burst(s,tg,{mode:'twinkle',pal:'night',dur:0.9,stagger:0.35,hold:0.5,size:0.11,fade:1.0});}}];
  const OUT=[
    tg=>burst(tg,pagePts(tg.length),{mode:'arc',pal:'ink',dur:0.7,stagger:0.25,size:0.045,arc:0.12,fade:0.3}),
    tg=>{const c=centerOf(tg);burst(tg,tg.map(()=>c.clone()),{mode:'spiral',pal:'violet',dur:0.75,stagger:0.2,size:0.05,fade:0.3});},
    tg=>burst(tg,tg.map(p=>{const q=p.clone().add(new THREE.Vector3(rnd()*0.8,0,rnd()*0.8));q.y=pageV(0,0).y;return q;}),{mode:'rain',pal:'ember',dur:0.8,stagger:0.3,size:0.05,fade:0.4})];
  let fxI=-1,outI=-1,curFx=0;
  function finalize(g,fn){const H=[];g.traverse(o=>{if(o.userData.an)H.push(o.userData.an);});H.forEach(a=>a.intro.forEach(x=>x.fn(1)));fn();H.forEach(a=>a.intro.forEach(x=>{if(!x.done)x.fn(0);}));}
  return {
    FX:FX.map(f=>f.name),get current(){return FX[curFx].name;},
    inkIn(g,spec){let tg=[];finalize(g,()=>{tg=sample(g,650);});if(!tg.length)return;const want=spec&&spec.fx!==undefined?FX.findIndex(f=>f.name===spec.fx||String(spec.fx)===String(FX.indexOf(f))):-1;
      fxI=want>=0?want:(fxI+1)%FX.length;curFx=fxI;window.__fxN=(window.__fxN||0)+1;FX[fxI].go(tg,centerOf(tg));AUDIO.chime&&AUDIO.chime();let el=document.getElementById('spell');if(!el){el=document.createElement('div');el.id='spell';document.getElementById('ui').appendChild(el);}el.textContent='✦ '+FX[fxI].name+' ✦';el.classList.remove('on');void el.offsetWidth;el.classList.add('on');},
    inkSwap(h){let tg=[];finalize(h,()=>{tg=sample(h,240);});if(tg.length){const s=tg.slice();FX[curFx].go(s,centerOf(s));}},
    inkOut(g){const st=sample(g,320);if(st.length){outI=(outI+1)%OUT.length;OUT[outI](st);}},
    tick(dt,t){candles.forEach(c=>{const f=0.85+Math.sin(t*9+c.ph)*0.08+Math.sin(t*23+c.ph*2)*0.05;c.fl.scale.setScalar(0.32*f);c.L.intensity=0.5*f;});
      orbs.forEach(q=>{q.o.position.set(q.b.x+Math.sin(t*q.sp+q.ph)*0.25,q.b.y+Math.sin(t*q.sp*1.3+q.ph)*0.18,q.b.z+Math.cos(t*q.sp+q.ph)*0.2);q.o.material.opacity=0.45+0.3*Math.sin(t*1.5+q.ph);});
      crystal.rotation.y+=dt*0.6;crystal.position.y=0.35+Math.sin(t*1.2)*0.06;cg.position.copy(crystal.position);
      const a=dust.geometry.attributes.position;for(let i=0;i<DN;i++){let y=a.getY(i)+dt*0.04;if(y>4)y=0;a.setY(i,y);a.setX(i,a.getX(i)+Math.sin(t*0.3+i)*dt*0.02);}a.needsUpdate=true;
      for(let di=decor.length-1;di>=0;di--){const D=decor[di];const el=CLOCK-D.t0;if(el<0)continue;D.up(el);if(el>D.end){scene.remove(D.m);D.m.geometry.dispose();D.m.material.dispose();decor.splice(di,1);}}
      for(let si=systems.length-1;si>=0;si--){const S2=systems[si];const el=CLOCK-S2.t0;const pa=S2.geo.attributes.position,ca=S2.geo.attributes.color,aa=S2.geo.attributes.alpha;
        S2.P.forEach((p,i)=>{const lt=el-p.d;let b;if(lt<0){b=0;tmp.copy(p.s);}else if(lt<S2.hold){tmp.copy(p.s);b=Math.min(1,lt/0.12);if(S2.mode==='twinkle')b*=0.55+0.45*Math.sin(lt*30+p.fl);}
          else{const u=Math.max(0,Math.min(1,(lt-S2.hold)/S2.dur));move(S2,p,u);b=u<1?(S2.hold?1:Math.min(1,u*4)):Math.max(0,1-(lt-S2.hold-S2.dur)/S2.fade);}
          pa.setXYZ(i,tmp.x,tmp.y,tmp.z);ca.setXYZ(i,p.c.r,p.c.g,p.c.b);aa.setX(i,b*0.9);});
        pa.needsUpdate=true;ca.needsUpdate=true;aa.needsUpdate=true;if(el>S2.end+0.1){scene.remove(S2.pts);S2.geo.dispose();S2.pts.material.dispose();systems.splice(si,1);}}}
  };})():null;

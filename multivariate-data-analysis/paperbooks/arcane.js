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

  /* ---- ink particles ---- */
  const systems=[];const INKC=[new THREE.Color(0x1a2a6a),new THREE.Color(0x0e6a60),new THREE.Color(0xb8820e),new THREE.Color(0x5a2a9a),new THREE.Color(0x1a2a6a)];
  const inkMat=sz=>new THREE.ShaderMaterial({uniforms:{map:{value:glowTex},size:{value:sz}},vertexShader:'attribute float alpha;attribute vec3 color;varying vec3 vC;varying float vA;uniform float size;void main(){vC=color;vA=alpha;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=size*(420.0/-mv.z);gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform sampler2D map;varying vec3 vC;varying float vA;void main(){vec4 t=texture2D(map,gl_PointCoord);float a=t.a*vA;if(a<0.01)discard;gl_FragColor=vec4(vC,a);}',transparent:true,depthWrite:false});
  const tmp=new THREE.Vector3();
  function sample(root,n){root.updateMatrixWorld(true);const meshes=[];root.traverse(o=>{if(o.isMesh&&o.visible&&o.geometry&&o.geometry.attributes.position&&!(o.material&&o.material.map&&o.material.transparent&&o.geometry.type==='PlaneGeometry'))meshes.push(o);});
    const out=[];if(!meshes.length)return out;let tries=0;while(out.length<n&&tries<n*4){tries++;const m=meshes[Math.floor(Math.random()*meshes.length)];let vis=true;m.traverseAncestors(a=>{if(!a.visible)vis=false;});if(!vis)continue;const pa=m.geometry.attributes.position;const k=Math.floor(Math.random()*pa.count);tmp.fromBufferAttribute(pa,k).applyMatrix4(m.matrixWorld);out.push(tmp.clone());}return out;}
  function pagePts(n,spread){const out=[];for(let i=0;i<n;i++){const v=new THREE.Vector3((Math.random()-.5)*BW*0.8,(Math.random()-.5)*BH*(spread||0.55)+BH*0.1,0.004);out.push(rightPage.localToWorld(v));}return out;}
  function burst(starts,targets,o){const n=Math.min(starts.length,targets.length);if(!n)return;const geo=new THREE.BufferGeometry();const pos=new Float32Array(n*3),col=new Float32Array(n*3),al=new Float32Array(n);geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.setAttribute('alpha',new THREE.BufferAttribute(al,1));
    const pts=new THREE.Points(geo,inkMat(o.size||0.05));pts.raycast=()=>{};pts.frustumCulled=false;scene.add(pts);
    const P=[];for(let i=0;i<n;i++)P.push({s:starts[i],t:targets[i],d:Math.random()*(o.stagger||0.6),c:INKC[i%INKC.length],w:Math.random()*6.28,r:0.05+Math.random()*0.12});
    systems.push({pts,geo,P,t0:CLOCK,dur:o.dur||1.1,fade:o.fade||0.5,arc:o.arc===undefined?0.35:o.arc,end:(o.stagger||0.6)+(o.dur||1.1)+(o.fade||0.5)});}
  function finalize(g,fn){const H=[];g.traverse(o=>{if(o.userData.an)H.push(o.userData.an);});H.forEach(a=>a.intro.forEach(x=>x.fn(1)));fn();H.forEach(a=>a.intro.forEach(x=>{if(!x.done)x.fn(0);}));}
  return {
    inkIn(g){let tg=[];finalize(g,()=>{tg=sample(g,650);});if(!tg.length)return;burst(pagePts(tg.length),tg,{dur:1.25,stagger:0.55,size:0.1,arc:0.3,fade:0.9});AUDIO.chime&&AUDIO.chime();},
    inkSwap(h){let tg=[];finalize(h,()=>{tg=sample(h,220);});if(tg.length)burst(pagePts(tg.length,0.3),tg,{dur:0.9,stagger:0.45,size:0.045,arc:0.2});},
    inkOut(g){const st=sample(g,320);if(st.length)burst(st,pagePts(st.length),{dur:0.7,stagger:0.25,size:0.045,arc:0.12,fade:0.3});},
    tick(dt,t){candles.forEach(c=>{const f=0.85+Math.sin(t*9+c.ph)*0.08+Math.sin(t*23+c.ph*2)*0.05;c.fl.scale.setScalar(0.32*f);c.L.intensity=0.5*f;});
      orbs.forEach(q=>{q.o.position.set(q.b.x+Math.sin(t*q.sp+q.ph)*0.25,q.b.y+Math.sin(t*q.sp*1.3+q.ph)*0.18,q.b.z+Math.cos(t*q.sp+q.ph)*0.2);q.o.material.opacity=0.45+0.3*Math.sin(t*1.5+q.ph);});
      crystal.rotation.y+=dt*0.6;crystal.position.y=0.35+Math.sin(t*1.2)*0.06;cg.position.copy(crystal.position);
      const a=dust.geometry.attributes.position;for(let i=0;i<DN;i++){let y=a.getY(i)+dt*0.04;if(y>4)y=0;a.setY(i,y);a.setX(i,a.getX(i)+Math.sin(t*0.3+i)*dt*0.02);}a.needsUpdate=true;
      for(let si=systems.length-1;si>=0;si--){const S2=systems[si];const el=CLOCK-S2.t0;const pa=S2.geo.attributes.position,ca=S2.geo.attributes.color,aa=S2.geo.attributes.alpha;
        S2.P.forEach((p,i)=>{const u=Math.max(0,Math.min(1,(el-p.d)/S2.dur));const e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;tmp.copy(p.s).lerp(p.t,e);tmp.y+=Math.sin(Math.PI*e)*S2.arc;const sw=(1-e)*p.r;tmp.x+=Math.cos(p.w+e*7)*sw;tmp.z+=Math.sin(p.w+e*7)*sw;pa.setXYZ(i,tmp.x,tmp.y,tmp.z);
          let b=el<p.d?0:(u<1?Math.min(1,u*4):Math.max(0,1-(el-p.d-S2.dur)/S2.fade));ca.setXYZ(i,p.c.r,p.c.g,p.c.b);aa.setX(i,b*0.9);});
        pa.needsUpdate=true;ca.needsUpdate=true;aa.needsUpdate=true;if(el>S2.end+0.1){scene.remove(S2.pts);S2.geo.dispose();S2.pts.material.dispose();systems.splice(si,1);}}}
  };})():null;

/* ---------- ARCANE ARCHIVE: gothic windows, star-map rose window, floating books, orbs, ladder ---------- */
const ARCH=(function(){
  const glowTex=canvasTex(128,128,(g,w,h)=>{const r=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(0.25,'rgba(255,255,255,.5)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h);});
  const glow=(c,s,o)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:c,transparent:true,opacity:o===undefined?1:o,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));m.scale.setScalar(s);m.raycast=()=>{};return m;};
  const gold=new THREE.MeshStandardMaterial({color:0xc9a14a,metalness:.75,roughness:.35});
  // gold trim on the shelf
  [0.04,1.0,1.96,2.92].forEach(y=>{const s=new THREE.Mesh(new THREE.BoxGeometry(SW+0.32,0.025,0.02),gold);s.position.set(0,y+0.045,SHELF_Z+0.315);scene.add(s);});
  const crown=new THREE.Mesh(new THREE.BoxGeometry(SW+0.64,0.04,0.03),gold);crown.position.set(0,3.2,SHELF_Z+0.37);scene.add(crown);
  // gothic arched windows (night sky)
  const archTex=canvasTex(256,576,(g,w,h)=>{g.save();g.beginPath();g.moveTo(8,h-4);g.lineTo(8,w/2);g.quadraticCurveTo(8,6,w/2,4);g.quadraticCurveTo(w-8,6,w-8,w/2);g.lineTo(w-8,h-4);g.closePath();g.clip();
    const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#0b1640');gr.addColorStop(0.6,'#1d2f6a');gr.addColorStop(1,'#3a4f8a');g.fillStyle=gr;g.fillRect(0,0,w,h);
    for(let i=0;i<120;i++){g.fillStyle=`rgba(255,255,240,${0.3+Math.random()*0.7})`;const r=Math.random()*1.6;g.beginPath();g.arc(Math.random()*w,Math.random()*h*0.8,r,0,7);g.fill();}
    g.fillStyle='rgba(255,245,210,.95)';g.beginPath();g.arc(w*0.68,h*0.2,22,0,7);g.fill();g.fillStyle='#0b1640';g.beginPath();g.arc(w*0.68+9,h*0.2-5,20,0,7);g.fill();g.restore();
    g.strokeStyle='#2a1c12';g.lineWidth=12;g.beginPath();g.moveTo(8,h-4);g.lineTo(8,w/2);g.quadraticCurveTo(8,6,w/2,4);g.quadraticCurveTo(w-8,6,w-8,w/2);g.lineTo(w-8,h-4);g.closePath();g.stroke();
    g.lineWidth=6;g.beginPath();g.moveTo(w/2,4);g.lineTo(w/2,h);g.moveTo(8,h*0.5);g.lineTo(w-8,h*0.5);g.moveTo(8,h*0.75);g.lineTo(w-8,h*0.75);g.stroke();
    g.strokeStyle='rgba(201,161,74,.8)';g.lineWidth=3;g.beginPath();g.arc(w/2,w*0.55,w*0.22,0,7);g.stroke();});
  const winMat=new THREE.MeshBasicMaterial({map:archTex,transparent:true,toneMapped:false});
  [-5.9,5.9].forEach(x=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(1.5,3.4),winMat);m.position.set(x,3.0,-5.16);scene.add(m);const gl=glow(0x6f8cff,2.6,0.25);gl.position.set(x,3.2,-5.0);scene.add(gl);});
  const moon=new THREE.DirectionalLight(0x8ea8ff,0.35);moon.position.set(0,6,-8);moon.target.position.set(0,0,2);scene.add(moon,moon.target);
  // rose window = star map with statistical glyphs
  const SYM=['μ','σ','β','χ²','r','ρ','λ','Σ','α','η²','F','t','R²','ω','κ','π'];
  const roseTex=canvasTex(1024,1024,(g,w,h)=>{const c=w/2;g.fillStyle='#0d1238';g.beginPath();g.arc(c,c,c-6,0,7);g.fill();
    const gr=g.createRadialGradient(c,c,0,c,c,c);gr.addColorStop(0,'rgba(90,110,220,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);
    g.strokeStyle='#c9a14a';[c-10,c-70,c-80,c*0.42].forEach((r,i)=>{g.lineWidth=i===0?14:4;g.beginPath();g.arc(c,c,r,0,7);g.stroke();});
    g.font='bold 46px "Noto Serif TC",serif';g.fillStyle='#f0d890';g.textAlign='center';g.textBaseline='middle';SYM.forEach((s,i)=>{const a=i/SYM.length*Math.PI*2-Math.PI/2;g.fillText(s,c+Math.cos(a)*(c-40),c+Math.sin(a)*(c-40));});
    for(let i=0;i<48;i++){const a=i/48*Math.PI*2;g.lineWidth=2;g.beginPath();g.moveTo(c+Math.cos(a)*(c-80),c+Math.sin(a)*(c-80));g.lineTo(c+Math.cos(a)*(c-(i%4?96:116)),c+Math.sin(a)*(c-(i%4?96:116)));g.stroke();}
    for(let i=0;i<260;i++){const a=Math.random()*7,r=Math.random()*(c-100);g.fillStyle=`rgba(255,250,230,${0.25+Math.random()*0.6})`;g.beginPath();g.arc(c+Math.cos(a)*r,c+Math.sin(a)*r,Math.random()*2.2,0,7);g.fill();}});
  const rose=new THREE.Mesh(new THREE.CircleGeometry(1.08,64),new THREE.MeshBasicMaterial({map:roseTex,toneMapped:false}));rose.position.set(0,4.42,-5.15);scene.add(rose);
  const roseRing=new THREE.Mesh(new THREE.TorusGeometry(1.1,0.045,8,64),gold);roseRing.position.copy(rose.position);scene.add(roseRing);
  // inner constellation = a rotating scatter + regression line (data as stars)
  const con=new THREE.Group();con.position.set(0,4.42,-5.1);con.scale.setScalar(0.86);scene.add(con);const cp=[];for(let i=0;i<22;i++){const x=(Math.random()-.5)*0.95,y=x*0.6+(Math.random()-.5)*0.3;if(Math.hypot(x,y)>0.5)continue;const s=glow(0xfff2c0,0.09+Math.random()*0.06);s.position.set(x,y,0.01);con.add(s);cp.push(s);}
  const cl=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.012,0.005),new THREE.MeshBasicMaterial({color:0xffc86a,toneMapped:false}));cl.rotation.z=Math.atan(0.6);con.add(cl);
  const roseGlow=glow(0x6070ff,3.6,0.22);roseGlow.position.set(0,4.42,-5.0);scene.add(roseGlow);
  // rolling ladder at the right end of the shelf
  (function(){const g=new THREE.Group();const wood=0x5a3a22;[-0.22,0.22].forEach(x=>{const r=new THREE.Mesh(new THREE.BoxGeometry(0.05,3.5,0.05),new THREE.MeshStandardMaterial({color:wood,roughness:.8}));r.position.set(x,1.75,0);g.add(r);});
    for(let i=0;i<9;i++){const s=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,0.44,6),gold);s.rotation.z=Math.PI/2;s.position.set(0,0.3+i*0.38,0);g.add(s);}
    g.position.set(4.35,0,-4.1);g.rotation.x=-0.17;scene.add(g);})();
  // floating books with flapping pages
  const flyers=[];const pageMat=new THREE.MeshStandardMaterial({color:0xf2e6c6,roughness:.9,side:THREE.DoubleSide});
  const fcol=[0x5a1f2a,0x1f3a5a,0x2a4a2a,0x4a2a5a,0x6a4a1a,0x1a4a4a,0x5a2a1a];
  for(let i=0;i<7;i++){const g=new THREE.Group();const cm=new THREE.MeshStandardMaterial({color:fcol[i],roughness:.6});
    const L=new THREE.Group(),R=new THREE.Group();[L,R].forEach((h,k)=>{const c=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.015,0.42),cm);c.position.x=(k?1:-1)*0.15;h.add(c);const p=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.03,0.4),pageMat);p.position.set((k?1:-1)*0.14,0.02,0);h.add(p);const tr=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.016,0.012),gold);tr.position.set((k?1:-1)*0.15,0,0.205);h.add(tr);g.add(h);});
    const flap=new THREE.Mesh(new THREE.PlaneGeometry(0.27,0.38),pageMat);flap.rotation.x=-Math.PI/2;flap.position.x=0.135;const fp=new THREE.Group();fp.position.y=0.04;fp.add(flap);g.add(fp);
    const gl=glow([0xffd27a,0x8fe0d0,0xc6a2ff][i%3],0.5,0.5);gl.position.y=0.12;g.add(gl);
    const a=i/7*Math.PI*2;const base=new THREE.Vector3(Math.cos(a)*4.8,3.3+(i%3)*0.5,-1.6+Math.sin(a)*2.0);g.position.copy(base);scene.add(g);flyers.push({g,L,R,fp,base,ph:Math.random()*6,sp:0.12+Math.random()*0.1,a});}
  // orbs + extra warm light pools (replacing the pendant lamps)
  const orbs=[];for(let i=0;i<14;i++){const c=[0xffc86a,0x8fe0d0,0xc6a2ff][i%3];const o=glow(c,0.22+Math.random()*0.2,0.8);const b=new THREE.Vector3((Math.random()-.5)*13,1.4+Math.random()*3.4,-4.4+Math.random()*7);o.position.copy(b);scene.add(o);orbs.push({o,b,ph:Math.random()*6,sp:0.3+Math.random()*0.4});}
  [[-3,3.2,-1.2,0xffc88a],[3,3.2,-1.2,0xffc88a],[0,2.6,-3.4,0xb8a0ff]].forEach(([x,y,z,c])=>{const l=new THREE.PointLight(c,0.5,9,1.6);l.position.set(x,y,z);scene.add(l);});
  return {tick(dt,t){flyers.forEach(f=>{const a=f.a+t*f.sp;f.g.position.set(Math.cos(a)*4.8,f.base.y+Math.sin(t*0.9+f.ph)*0.18,-1.6+Math.sin(a)*2.0);f.g.rotation.set(0.25+Math.sin(t*0.7+f.ph)*0.12,-a+Math.PI/2,Math.sin(t+f.ph)*0.1);const o=0.55+Math.sin(t*2.2+f.ph)*0.25;f.L.rotation.z=o;f.R.rotation.z=-o;f.fp.rotation.z=-(0.2+((t*0.9+f.ph)%1)*2.6);});
    orbs.forEach(q=>{q.o.position.set(q.b.x+Math.sin(t*q.sp+q.ph)*0.3,q.b.y+Math.sin(t*q.sp*1.4+q.ph)*0.2,q.b.z+Math.cos(t*q.sp+q.ph)*0.3);q.o.material.opacity=0.5+0.3*Math.sin(t*1.6+q.ph);});
    con.rotation.z=Math.sin(t*0.15)*0.25;cp.forEach((s,i)=>s.material.opacity=0.6+0.4*Math.sin(t*2+i));roseGlow.material.opacity=0.18+0.06*Math.sin(t*0.8);}};})();

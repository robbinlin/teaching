/* ---------- W13: dagadj 調整 Z 會發生什麼 ---------- */
W.dagadj=(w)=>{
  const N=4000;let kind='conf',seed=3;
  const SPEC={
    conf:{z:'Z 性別',name:'混淆',arrows:[['Z','X'],['Z','Y'],['X','Y']],truth:0.5,eq:'Z → X、Z → Y、X → Y'},
    med:{z:'Z 運動技能',name:'中介',arrows:[['X','Z'],['Z','Y'],['X','Y']],truth:0.2+0.8*0.5,eq:'X → Z → Y、X → Y'},
    coll:{z:'Z 入選校隊',name:'衝突因子',arrows:[['X','Z'],['Y','Z'],['X','Y']],truth:0.5,eq:'X → Z ← Y、X → Y'}};
  w.innerHTML=`<div class="widget-title"><strong>調整 Z 之後，X 的係數變對還是變錯</strong>${segHTML('dgk',[['conf','混淆'],['med','中介'],['coll','衝突因子']],'conf')}</div>
  <div class="in-row"><button class="btn" type="button" id="dgre">重新抽樣</button><span class="note">模擬資料：${N.toLocaleString()} 人，連續變項、線性關係，只用來示意方向。X 是社團參與，Y 是規律運動。</span></div>
  ${SV('0 0 640 300','上方是三個變項的箭頭圖，下方是三個 X 係數的長條')}<div id="dgS"></div><p class="readout" id="dgM"></p>`;
  const svg=w.querySelector('svg');
  function sim(){const r=ST.rng(seed*101+kind.length*7+kind.charCodeAt(0));const x=[],y=[],z=[];for(let i=0;i<N;i++){const e1=ST.rnorm(r),e2=ST.rnorm(r),e3=ST.rnorm(r);let X,Y,Z;
      if(kind==='conf'){Z=e1;X=0.8*Z+e2;Y=0.5*X+0.8*Z+e3;}
      else if(kind==='med'){X=e1;Z=0.8*X+e2;Y=0.2*X+0.5*Z+e3;}
      else{X=e1;Y=0.5*X+e2;Z=X+Y+e3;}
      x.push(X);y.push(Y);z.push(Z);}return{x,y,z};}
  function ols2(y,x,z){const my=ST.mean(y),mx=ST.mean(x),mz=ST.mean(z);let sxx=0,szz=0,sxz=0,sxy=0,szy=0;for(let i=0;i<y.length;i++){const a=x[i]-mx,b=z[i]-mz,c=y[i]-my;sxx+=a*a;szz+=b*b;sxz+=a*b;sxy+=a*c;szy+=b*c;}return(sxy*szz-szy*sxz)/(sxx*szz-sxz*sxz);}
  const txt=(x,y,s,anchor,style)=>{const t=el('text',{x,y,'text-anchor':anchor||'middle'},svg);if(style)t.setAttribute('style',style);t.textContent=s;return t;};
  const POS={X:[150,96],Z:[320,30],Y:[490,96]},BW=64,BH=17;
  function arrow(a,b){const [x1,y1]=POS[a],[x2,y2]=POS[b];const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;
    const clip=(ux,uy)=>Math.min(Math.abs(ux)>1e-9?BW/Math.abs(ux):1e9,Math.abs(uy)>1e-9?BH/Math.abs(uy):1e9)+4;
    const s=clip(ux,uy),sx=x1+ux*s,sy=y1+uy*s,ex=x2-ux*s,ey=y2-uy*s;el('line',{x1:sx,y1:sy,x2:ex,y2:ey,style:'stroke:var(--ink);stroke-width:2'},svg);
    const h=9,px=-uy,py=ux;el('path',{d:`M${ex} ${ey}L${ex-ux*h+px*h*0.5} ${ey-uy*h+py*h*0.5}L${ex-ux*h-px*h*0.5} ${ey-uy*h-py*h*0.5}Z`,style:'fill:var(--ink)'},svg);}
  const draw=()=>{const sp=SPEC[kind],D=sim();const b0=ST.ols(D.x,D.y).b,b1=ols2(D.y,D.x,D.z),tr=sp.truth;svg.innerHTML='';
    sp.arrows.forEach(([a,b])=>arrow(a,b));
    [['X','X 社團參與','var(--line)'],['Z',sp.z,'var(--amber)'],['Y','Y 規律運動','var(--line)']].forEach(([k,l,c])=>{const [x,y]=POS[k];el('rect',{x:x-BW,y:y-BH,width:BW*2,height:BH*2,rx:6,style:`fill:var(--surface);stroke:${c};stroke-width:2`},svg);txt(x,y+5,l,'middle','fill:var(--ink);font-size:14px');});
    /* bars */
    const vals=[tr,b0,b1],lo=Math.min(0,...vals)-0.12,hi=Math.max(...vals)+0.2,L=170,R=610,X=v=>L+(v-lo)/(hi-lo)*(R-L);
    el('line',{x1:X(0),x2:X(0),y1:150,y2:268,class:'axis'},svg);txt(X(0),284,'0');
    el('line',{x1:X(tr),x2:X(tr),y1:150,y2:268,style:'stroke:var(--ok);stroke-dasharray:4 4;stroke-width:1.5'},svg);txt(X(tr),284,'真實 '+f2(tr,2),'middle','fill:var(--ok)');
    const good=v=>Math.abs(v-tr)<0.06;
    [['真實的總效果',tr,'var(--ok)'],['不調整 Z',b0,good(b0)?'var(--accent)':'var(--bad)'],['調整 Z',b1,good(b1)?'var(--accent)':'var(--bad)']].forEach(([l,v,c],i)=>{const y=158+i*38;txt(L-12,y+17,l,'end','fill:var(--ink)');
      const x0=Math.min(X(0),X(v)),wd=Math.max(1,Math.abs(X(v)-X(0)));el('rect',{x:x0,y,width:wd,height:24,style:`fill:${c};opacity:.8`},svg);txt(v>=0?X(v)+6:X(v)-6,y+17,f2(v,2),v>=0?'start':'end','fill:var(--ink);font-weight:600');});
    w.querySelector('#dgS').innerHTML=statsHTML([['真實的總效果',f2(tr,2)],['不調整 Z',f2(b0,2),good(b0)?'mean':'med'],['調整 Z',f2(b1,2),good(b1)?'mean':'med'],['結構',sp.name]]);
    w.querySelector('#dgM').textContent=kind==='conf'?`${sp.eq}。Z 同時推高 X 和 Y，不調整時 X 的係數是 ${f2(b0,2)}，比真實的 ${f2(tr,2)} 大；調整 Z 之後回到 ${f2(b1,2)}。混淆因子要調整。`:
      kind==='med'?`${sp.eq}。X 的效果有一部分經過 Z 才到 Y。不調整時得到總效果 ${f2(b0,2)}；調整 Z 之後只剩 ${f2(b1,2)}，經過 Z 的那一段被扣掉了。想估總效果時，中介不要調整。`:
      `${sp.eq}。Z 是 X 和 Y 共同的結果。不調整時係數是 ${f2(b0,2)}，正確；調整 Z 之後變成 ${f2(b1,2)}，${b1<0?'連方向都反了':'被壓低了'}。只分析 Z 的某一層（例如只看校隊學生）是同一件事。衝突因子不要調整。`;};
  segBind(w,'dgk',v=>{kind=v;draw();});w.querySelector('#dgre').addEventListener('click',()=>{seed++;draw();});draw();
};

/* ===== stats library ===== */
const ST=(()=>{
  function lgamma(x){const c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];let y=x,tmp=x+5.5;tmp-=(x+0.5)*Math.log(tmp);let ser=1.000000000190015;for(let j=0;j<6;j++)ser+=c[j]/++y;return -tmp+Math.log(2.5066282746310005*ser/x);}
  function betacf(a,b,x){const MAXIT=300,EPS=3e-14,FPMIN=1e-300;let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<FPMIN)d=FPMIN;d=1/d;let h=d;for(let m=1;m<=MAXIT;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<FPMIN)d=FPMIN;c=1+aa/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;h*=d*c;aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<FPMIN)d=FPMIN;c=1+aa/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<EPS)break;}return h;}
  function ibeta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(lgamma(a+b)-lgamma(a)-lgamma(b)+a*Math.log(x)+b*Math.log(1-x));return x<(a+1)/(a+b+2)?bt*betacf(a,b,x)/a:1-bt*betacf(b,a,1-x)/b;}
  function gammp(a,x){if(x<=0)return 0;if(x<a+1){let ap=a,sum=1/a,del=sum;for(let n=0;n<500;n++){ap++;del*=x/ap;sum+=del;if(Math.abs(del)<Math.abs(sum)*1e-15)break;}return sum*Math.exp(-x+a*Math.log(x)-lgamma(a));}let b=x+1-a,c=1e300,d=1/b,h=d;for(let i=1;i<500;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-15)break;}return 1-Math.exp(-x+a*Math.log(x)-lgamma(a))*h;}
  const pnorm=z=>z<0?0.5*(1-gammp(0.5,z*z/2)):0.5*(1+gammp(0.5,z*z/2));
  const dnorm=(x,m=0,s=1)=>Math.exp(-0.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
  function qnorm(p){const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.3577518672690,-30.66479806614716,2.506628277459239],b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],c=[-7.784894002430293e-3,-0.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],d=[7.784695709041462e-3,0.3224671290700398,2.445134137142996,3.754408661907416];const pl=0.02425;let q,r;if(p<pl){q=Math.sqrt(-2*Math.log(p));return(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}if(p>1-pl){q=Math.sqrt(-2*Math.log(1-p));return-(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}q=p-0.5;r=q*q;return(((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);}
  function pt(t,df){const x=df/(df+t*t);const tail=0.5*ibeta(x,df/2,0.5);return t>=0?1-tail:tail;}
  const dt=(t,df)=>Math.exp(lgamma((df+1)/2)-lgamma(df/2)-0.5*Math.log(df*Math.PI)-(df+1)/2*Math.log(1+t*t/df));
  function qt(p,df){let lo=-60,hi=60;for(let i=0;i<120;i++){const m=(lo+hi)/2;if(pt(m,df)<p)lo=m;else hi=m;}return (lo+hi)/2;}
  const pf=(f,d1,d2)=>f<=0?0:ibeta(d1*f/(d1*f+d2),d1/2,d2/2);
  const pchisq=(x,k)=>gammp(k/2,x/2);
  const lchoose=(n,k)=>lgamma(n+1)-lgamma(k+1)-lgamma(n-k+1);
  const dbinom=(k,n,p)=>p<=0?(k===0?1:0):p>=1?(k===n?1:0):Math.exp(lchoose(n,k)+k*Math.log(p)+(n-k)*Math.log(1-p));
  const dhyper=(a,r1,r2,c1)=>Math.exp(lchoose(r1,a)+lchoose(r2,c1-a)-lchoose(r1+r2,c1));
  function rng(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
  function rnorm(r){let u=0,v=0;while(u===0)u=r();v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
  const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
  const sd=a=>{const m=mean(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/(a.length-1));};
  function ols(x,y){const mx=mean(x),my=mean(y);let sxy=0,sxx=0,syy=0;for(let i=0;i<x.length;i++){sxy+=(x[i]-mx)*(y[i]-my);sxx+=(x[i]-mx)**2;syy+=(y[i]-my)**2;}const b=sxy/sxx,a=my-b*mx,r=sxy/Math.sqrt(sxx*syy),n=x.length;const sse=syy-b*sxy;const se=Math.sqrt(sse/(n-2)/sxx);const tt=b/se;return{a,b,r,r2:r*r,n,se,t:tt,p:2*(1-pt(Math.abs(tt),n-2))};}
  function ranks(a){const idx=a.map((v,i)=>[v,i]).sort((p,q)=>p[0]-q[0]);const r=new Array(a.length);for(let i=0;i<idx.length;){let j=i;while(j+1<idx.length&&idx[j+1][0]===idx[i][0])j++;const avg=(i+j)/2+1;for(let k=i;k<=j;k++)r[idx[k][1]]=avg;i=j+1;}return r;}
  const spearman=(x,y)=>ols(ranks(x),ranks(y)).r;
  return{lgamma,ibeta,gammp,pnorm,dnorm,qnorm,pt,dt,qt,pf,pchisq,dbinom,dhyper,rng,rnorm,mean,sd,ols,ranks,spearman};
})();

/* ===== widget helpers ===== */
const W={};
const SV=(vb,label)=>`<div class="chart"><svg viewBox="${vb}" role="img" aria-label="${esc(label)}"></svg></div>`;
function axisX(svg,x,lo,hi,Y,step,fmtf,label,L,R){el('line',{x1:L,x2:R,y1:Y,y2:Y,class:'axis'},svg);for(let t=Math.ceil(lo/step)*step;t<=hi+1e-9;t+=step){el('line',{x1:x(t),x2:x(t),y1:Y,y2:Y+4,class:'axis'},svg);const tx=el('text',{x:x(t),y:Y+17,'text-anchor':'middle'},svg);tx.textContent=fmtf?fmtf(t):(+t.toFixed(6));}if(label){const l=el('text',{x:R,y:Y+32,'text-anchor':'end'},svg);l.textContent=label;}}
function axisY(svg,y,lo,hi,X,step,fmtf,label,T){for(let t=Math.ceil(lo/step)*step;t<=hi+1e-9;t+=step){el('line',{x1:X,x2:X+560,y1:y(t),y2:y(t),class:'grid'},svg);const tx=el('text',{x:X-6,y:y(t)+4,'text-anchor':'end'},svg);tx.textContent=fmtf?fmtf(t):(+t.toFixed(6));}if(label){const l=el('text',{x:4,y:Math.max(11,T-6),'text-anchor':'start'},svg);l.textContent=label;}}
function pathOf(pts){return pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');}
function sliders(defs){return `<div class="slider-row">${defs.map(d=>`<label for="${d.id}"><span>${d.label}<b id="${d.id}-v"></b></span><input type="range" id="${d.id}" min="${d.min}" max="${d.max}" step="${d.step}" value="${d.value}"></label>`).join('')}</div>`;}
function bindSliders(root,defs,on){defs.forEach(d=>{const i=root.querySelector('#'+d.id);const upd=()=>{root.querySelector('#'+d.id+'-v').textContent=d.fmt?d.fmt(+i.value):i.value;};i.addEventListener('input',()=>{upd();on();});upd();});}
const val=(root,id)=>+root.querySelector('#'+id).value;
function segHTML(name,opts,cur){return `<div class="seg" role="group">${opts.map(([v,l])=>`<button type="button" data-${name}="${v}" aria-pressed="${v===cur}">${l}</button>`).join('')}</div>`;}
function segBind(root,name,on){root.addEventListener('click',e=>{const b=e.target.closest(`[data-${name}]`);if(!b)return;root.querySelectorAll(`[data-${name}]`).forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));on(b.dataset[name]);});}
function statsHTML(items){return `<div class="stats">${items.map(([l,v,c])=>`<div class="stat ${c||''}"><span>${l}</span><b>${v}</b></div>`).join('')}</div>`;}
const fp=p=>p<0.001?'< .001':p.toFixed(3).replace(/^0/,'');
const f2=(x,d=2)=>fmt(x,d);
function curveArea(svg,x,y,f,a,b,cls,steps=120){if(b<=a)return;const pts=[[x(a),y(0)]];for(let i=0;i<=steps;i++){const t=a+(b-a)*i/steps;pts.push([x(t),y(f(t))]);}pts.push([x(b),y(0)]);el('path',{d:pathOf(pts)+'Z',class:cls},svg);}
function curve(svg,x,y,f,a,b,cls,steps=200){const pts=[];for(let i=0;i<=steps;i++){const t=a+(b-a)*i/steps;pts.push([x(t),y(f(t))]);}el('path',{d:pathOf(pts),class:cls},svg);}

/* ---------- CH1 widgets (vartype / drag / lung) are injected separately ---------- */

/* ---------- ch2: condprob ---------- */
W.condprob=(w)=>{
  const T=[[7970,30],[1980,20]];const R=['無吸菸','吸菸'],C=['無肺癌','有肺癌'];let cell=[1,1],mode='all';
  w.innerHTML=`<div class="widget-title"><strong>同一格，不同分母</strong>${segHTML('cpm',[['all','以全體為分母'],['row','已知吸菸狀態'],['col','已知肺癌狀態']],'all')}</div>
  <div class="tbl-wrap"><table class="ct" id="cpT"></table></div><p class="frac" id="cpF"></p><p class="readout" id="cpM"></p><p class="note" style="margin:0">點表中任一格（人數）。資料：講義第 29 張，10,000 人。</p>`;
  const draw=()=>{const rs=T.map(r=>r[0]+r[1]),cs=[T[0][0]+T[1][0],T[0][1]+T[1][1]],N=rs[0]+rs[1];const [i,j]=cell;
    const den=mode==='all'?N:mode==='row'?rs[i]:cs[j];const isDen=(a,b)=>mode==='all'||(mode==='row'&&a===i)||(mode==='col'&&b===j);
    let h=`<tr><th></th>${C.map(c=>`<th>${c}</th>`).join('')}<th>合計</th></tr>`;
    T.forEach((r,a)=>{h+=`<tr><th>${R[a]}</th>${r.map((v,b)=>`<td class="cell ${a===i&&b===j?'hl-num':isDen(a,b)?'hl-den':''}" data-c="${a},${b}" tabindex="0">${v.toLocaleString()}</td>`).join('')}<td class="tot ${mode==='row'&&a===i?'hl-den':''}">${rs[a].toLocaleString()}</td></tr>`;});
    h+=`<tr><th>合計</th>${cs.map((v,b)=>`<td class="tot ${mode==='col'&&b===j?'hl-den':''}">${v.toLocaleString()}</td>`).join('')}<td class="tot ${mode==='all'?'hl-den':''}">${N.toLocaleString()}</td></tr>`;
    w.querySelector('#cpT').innerHTML=h;const num=T[i][j];
    w.querySelector('#cpF').innerHTML=`<b>${num.toLocaleString()}</b> ÷ <i>${den.toLocaleString()}</i> = ${(num/den).toFixed(mode==='all'?4:4)}`;
    const ev=`${R[i]}且${C[j]}`;w.querySelector('#cpM').textContent=mode==='all'?`P(${R[i]} 且 ${C[j]})：交集機率，分母是全部 ${N.toLocaleString()} 人。`:mode==='row'?`P(${C[j]} | ${R[i]})：已知${R[i]}，研究範圍縮到這 ${den.toLocaleString()} 人，分母跟著改。`:`P(${R[i]} | ${C[j]})：已知${C[j]}，分母是${C[j]}的 ${den.toLocaleString()} 人。`;};
  w.addEventListener('click',e=>{const c=e.target.closest('[data-c]');if(c){cell=c.dataset.c.split(',').map(Number);draw();}});
  w.addEventListener('keydown',e=>{const c=e.target.closest('[data-c]');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();cell=c.dataset.c.split(',').map(Number);draw();}});
  segBind(w,'cpm',v=>{mode=v;draw();});draw();
};

/* ---------- ch2: binom ---------- */
W.binom=(w)=>{
  const defs=[{id:'bn',label:'試驗次數 n',min:1,max:50,step:1,value:30},{id:'bp',label:'成功機率 p',min:0.05,max:0.95,step:0.05,value:0.2,fmt:v=>v.toFixed(2)}];let k=3;
  w.innerHTML=`<div class="widget-title"><strong>二項分配 Binomial(n, p)</strong><span class="note">預設：30 位選手、受傷機率 0.2</span></div>${sliders(defs)}<div class="slider-row" style="align-items:center"><label for="bk" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span>X 的值 k</span><input type="number" id="bk" min="0" max="30" step="1" value="3" inputmode="numeric" class="num-in"><span class="note">輸入 0–n 的整數，或直接點長條</span></label></div>${SV('0 0 640 280','二項分配長條圖')}<div id="bS"></div><p class="readout" id="bM"></p>`;
  const svg=w.querySelector('svg');
  const kin=w.querySelector('#bk');const draw=()=>{const n=val(w,'bn'),p=val(w,'bp');if(k>n)k=n;kin.max=n;if(+kin.value!==k)kin.value=k;svg.innerHTML='';const L=48,R=625,T=20,B=240;const pr=[];for(let i=0;i<=n;i++)pr.push(ST.dbinom(i,n,p));const ym=Math.max(...pr);const ys=ym>0.2?0.1:ym>0.08?0.02:0.01;const yt=Math.ceil(ym/ys)*ys;
    const x=i=>L+(i+0.5)/(n+1)*(R-L),y=v=>B-v/yt*(B-T),bw=Math.max(2,(R-L)/(n+1)-2);
    axisY(svg,y,0,yt,L,ys,v=>v.toFixed(2),'P(X=k)',T);
    pr.forEach((v,i)=>{const r=el('rect',{x:x(i)-bw/2,y:y(v),width:bw,height:B-y(v),class:'bar'+(i===k?' sel':''),'data-k':i,style:'cursor:pointer'},svg);if(i===k)r.setAttribute('style','cursor:pointer;fill:var(--amber);opacity:.85');const tt=el('title',{},r);tt.textContent=`P(X=${i}) = ${v.toFixed(4)}`;});
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);const st=n>30?5:n>12?2:1;for(let i=0;i<=n;i+=st){const t=el('text',{x:x(i),y:B+16,'text-anchor':'middle'},svg);t.textContent=i;}const lb=el('text',{x:R,y:B+32,'text-anchor':'end'},svg);lb.textContent='成功次數 k';
    el('line',{x1:x(n*p-0.0),x2:x(n*p),y1:T,y2:B,class:'mean'},svg);
    const cum=pr.slice(0,k+1).reduce((s,v)=>s+v,0);
    w.querySelector('#bS').innerHTML=statsHTML([['P(X='+k+')',pr[k].toFixed(4),'med'],['P(X≤'+k+')',cum.toFixed(4)],['P(X≥'+k+')',Math.max(0,1-cum+pr[k]).toFixed(4)],['平均數 np',f2(n*p,2),'mean'],['變異數 np(1−p)',f2(n*p*(1-p),2)],['標準差',f2(Math.sqrt(n*p*(1-p)),3)]]);
    w.querySelector('#bM').textContent=`在「X 的值 k」輸入數字或點長條可換 k。虛線是平均數 np = ${f2(n*p,2)}。n=30、p=0.2 時，恰有 3 人受傷的機率約 0.0785，平均 6 人、變異數 4.8。`;};
  svg.addEventListener('click',e=>{const r=e.target.closest('[data-k]');if(r){k=+r.dataset.k;draw();}});kin.addEventListener('input',()=>{const n=val(w,'bn');const v=Math.round(+kin.value);if(kin.value===''||!isFinite(v))return;k=Math.max(0,Math.min(n,v));draw();});kin.addEventListener('change',()=>{kin.value=k;});
  bindSliders(w,defs,draw);draw();
};

/* ---------- ch2: normal ---------- */
W.normal=(w)=>{
  const PRE={h:{mu:1.40,sg:0.15,a:1.749,b:1.70,u:' 公尺'},z:{mu:0,sg:1,a:1.96,b:1.96,u:''}};
  let mode='le',mu=1.40,sg=0.15,a=1.749,b=1.70,pc=99,u=' 公尺';
  const inp=(id,v,st,lab,extra='')=>`<label for="${id}"><span>${lab}</span><input class="num-in" type="number" id="${id}" value="${v}" step="${st}" inputmode="decimal"${extra}></label>`;
  w.innerHTML=`<div class="widget-title"><strong>常態分配 N(μ, σ²)</strong>${segHTML('nm',[['le','X≤a'],['ge','X≥a'],['bt','a≤X≤b'],['pc','百分位']],'le')}</div>
  <div class="in-row">${inp('nmu',mu,'any','平均數 μ')}${inp('nsg',sg,'any','標準差 σ',' min="0"')}<span class="note">範例：</span><button class="btn" type="button" data-npre="h">身高（講義第 23 張）</button><button class="btn" type="button" data-npre="z">標準常態 Z</button></div>
  <div class="in-row"><span id="nA">${inp('na',a,'any','a')}</span><span id="nB" hidden>${inp('nb',b,'any','b')}</span><span id="nP" hidden>${inp('npc',pc,'any','百分位 %',' min="0.01" max="99.99"')}</span><span id="nQ" hidden><button class="btn" type="button" data-nk="1">μ ± 1σ</button> <button class="btn" type="button" data-nk="2">μ ± 2σ</button> <button class="btn" type="button" data-nk="3">μ ± 3σ</button></span><span class="note" id="nH">輸入數值，或直接點曲線</span></div>
  ${SV('0 0 640 270','常態分配曲線與機率面積')}<div id="nS"></div><p class="readout" id="nM"></p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const L=30,R=625,T=16,B=208;
  const dec=()=>sg>=10?1:sg>=1?2:3;const fx=v=>(+v).toFixed(dec());
  const sync=()=>{q('na').value=+a.toFixed(4);q('nb').value=+b.toFixed(4);q('npc').value=+pc.toFixed(4);};
  const draw=()=>{const lo=mu-4*sg,hi=mu+4*sg;const x=v=>L+(v-lo)/(hi-lo)*(R-L),f=v=>ST.dnorm((v-mu)/sg),y=v=>B-v/f(mu)*(B-T);
    q('nB').hidden=mode!=='bt';q('nQ').hidden=mode!=='bt';q('nP').hidden=mode!=='pc';q('nA').hidden=mode==='pc';
    svg.innerHTML='';const za=(a-mu)/sg,zb=(b-mu)/sg;let P,cuts=[],items,msg;
    if(mode==='le'){P=ST.pnorm(za);curveArea(svg,x,y,f,lo,Math.min(Math.max(a,lo),hi),'area-p');cuts=[a];}
    if(mode==='ge'){P=1-ST.pnorm(za);curveArea(svg,x,y,f,Math.max(Math.min(a,hi),lo),hi,'area-p');cuts=[a];}
    if(mode==='bt'){const l=Math.min(a,b),h=Math.max(a,b);P=ST.pnorm((h-mu)/sg)-ST.pnorm((l-mu)/sg);curveArea(svg,x,y,f,Math.max(l,lo),Math.min(h,hi),'area-p');cuts=[a,b];}
    if(mode==='pc'){const z=ST.qnorm(pc/100),xv=mu+z*sg;P=pc/100;curveArea(svg,x,y,f,lo,Math.min(Math.max(xv,lo),hi),'area-q');cuts=[xv];}
    // ticks at mu+k sigma
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
    for(let k=-3;k<=3;k++){const xv=mu+k*sg;el('line',{x1:x(xv),x2:x(xv),y1:B,y2:B+4,class:'axis'},svg);const t1=el('text',{x:x(xv),y:B+17,'text-anchor':'middle'},svg);t1.textContent=fx(xv);const t2=el('text',{x:x(xv),y:B+32,'text-anchor':'middle',style:'fill:var(--muted)'},svg);t2.textContent=k===0?'z=0':'z='+(k>0?'+':'−')+Math.abs(k);}
    curve(svg,x,y,f,lo,hi,'curve');el('line',{x1:x(mu),x2:x(mu),y1:T,y2:B,class:'mean'},svg);
    cuts.forEach(c=>{const cx=Math.min(Math.max(x(c),L),R);el('line',{x1:cx,x2:cx,y1:T,y2:B,class:'zline'},svg);});
    const pr=v=>v<0.0001?v.toExponential(2):v.toFixed(4);const zs=z=>(z<0?'−':'')+Math.abs(z).toFixed(3);
    if(mode==='le'){items=[['P(X ≤ '+fx(a)+')',pr(P),'mean'],['z = (a−μ)/σ',zs(za)],['右尾 P(X ≥ a)',pr(1-P)]];msg=`a 在平均數${za>=0?'上方':'下方'} ${Math.abs(za).toFixed(2)} 個標準差；曲線下 a 左側的面積是 ${(P*100).toFixed(2)}%，所以 a 約為第 ${(P*100).toFixed(1)} 百分位。`;}
    if(mode==='ge'){items=[['P(X ≥ '+fx(a)+')',pr(P),'mean'],['z = (a−μ)/σ',zs(za)],['左尾 P(X ≤ a)',pr(1-P)]];msg=`右尾面積 ${(P*100).toFixed(2)}%：大約每 ${P>0?Math.max(1,Math.round(1/P)).toLocaleString():'∞'} 人中有 1 人超過 ${fx(a)}${u}。`;}
    if(mode==='bt'){items=[['P('+fx(Math.min(a,b))+' ≤ X ≤ '+fx(Math.max(a,b))+')',pr(P),'mean'],['z(a)',zs(za)],['z(b)',zs(zb)],['區間外',pr(1-P)]];msg=`中間面積 ${(P*100).toFixed(2)}%。按 μ ± 1σ、2σ、3σ 可看到 68–95–99.7 規則（精確值 68.27%、95.45%、99.73%）。`;}
    if(mode==='pc'){const z=ST.qnorm(pc/100),xv=mu+z*sg;items=[['第 '+(+pc.toFixed(2))+' 百分位',fx(xv)+u,'mean'],['對應 z',zs(z)],['x = μ + zσ',fx(mu)+(z<0?' − ':' + ')+Math.abs(z).toFixed(3)+'×'+fx(sg)]];msg=`有 ${(+pc.toFixed(2))}% 的觀察值低於 ${fx(xv)}${u}。講義第 23 張：第 99 百分位用 z≈2.326，不是平均數加 3 個標準差（那是第 99.865 百分位）。`;}
    items.push(['μ',fx(mu)],['σ',fx(sg)]);
    q('nS').innerHTML=statsHTML(items);q('nM').textContent=msg;q('nH').textContent=mode==='pc'?'輸入百分位，或直接點曲線':'輸入數值，或直接點曲線';
    svg._x=v=>lo+(v-L)/(R-L)*(hi-lo);};
  const num=id=>{const v=parseFloat(q(id).value);return isFinite(v)?v:null;};
  q('nmu').addEventListener('input',()=>{const v=num('nmu');if(v!==null){mu=v;draw();}});
  q('nsg').addEventListener('input',()=>{const v=num('nsg');if(v!==null&&v>0){sg=v;draw();}});
  q('na').addEventListener('input',()=>{const v=num('na');if(v!==null){a=v;draw();}});
  q('nb').addEventListener('input',()=>{const v=num('nb');if(v!==null){b=v;draw();}});
  q('npc').addEventListener('input',()=>{const v=num('npc');if(v!==null&&v>0&&v<100){pc=v;draw();}});
  ['nmu','nsg','na','nb','npc'].forEach(id=>q(id).addEventListener('change',()=>{q('nmu').value=mu;q('nsg').value=sg;sync();}));
  w.addEventListener('click',e=>{const pb=e.target.closest('[data-npre]');if(pb){const P=PRE[pb.dataset.npre];({mu,sg,a,b,u}=P);q('nmu').value=mu;q('nsg').value=sg;sync();draw();return;}
    const kb=e.target.closest('[data-nk]');if(kb){const k=+kb.dataset.nk;a=mu-k*sg;b=mu+k*sg;sync();draw();}});
  svg.addEventListener('click',e=>{const r=svg.getBoundingClientRect();const vx=(e.clientX-r.left)/r.width*640;if(vx<L||vx>R)return;const v=+svg._x(vx).toFixed(dec());
    if(mode==='pc'){pc=Math.min(99.99,Math.max(0.01,+(ST.pnorm((v-mu)/sg)*100).toFixed(2)));}
    else if(mode==='bt'){if(Math.abs(v-a)<=Math.abs(v-b))a=v;else b=v;}else a=v;sync();draw();});
  svg.style.cursor='crosshair';
  segBind(w,'nm',v=>{mode=v;if(v==='bt'&&a===b){a=mu-sg;b=mu+sg;sync();}draw();});draw();
};

/* ---------- ch2: clt ---------- */
W.clt=(w)=>{
  let pop='skew',seed=7;const defs=[{id:'cn',label:'樣本數 n',min:1,max:100,step:1,value:5}];
  const pops={unif:{m:5,s:10/Math.sqrt(12),draw:r=>r()*10,lab:'均勻 0–10'},skew:{m:2,s:2,draw:r=>-2*Math.log(1-r()),lab:'右偏（指數，平均 2）'}};
  w.innerHTML=`<div class="widget-title"><strong>抽 1,000 次，看樣本平均數</strong><div class="controls">${segHTML('cp',[['skew','右偏母體'],['unif','均勻母體']],'skew')}<button class="btn" type="button" id="cRe">重抽</button></div></div>${sliders(defs)}${SV('0 0 640 300','樣本平均數的抽樣分配')}<div id="cS"></div><p class="readout" id="cM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const n=val(w,'cn'),P=pops[pop],r=ST.rng(seed*1000+n);const means=[];for(let i=0;i<1000;i++){let s=0;for(let j=0;j<n;j++)s+=P.draw(r);means.push(s/n);}
    svg.innerHTML='';const L=48,R=625,T=20,B=250;const lo=pop==='unif'?0:0,hi=pop==='unif'?10:Math.max(8,P.m+4*P.s/Math.sqrt(n));const nb=40,bw=(hi-lo)/nb;const cnt=new Array(nb).fill(0);means.forEach(m=>{let k=Math.floor((m-lo)/bw);if(k>=nb)k=nb-1;if(k<0)k=0;cnt[k]++;});
    const se=P.s/Math.sqrt(n);const dens=cnt.map(c=>c/1000/bw);const ym=Math.max(...dens,ST.dnorm(0,0,se)*1.0);const x=v=>L+(v-lo)/(hi-lo)*(R-L),y=v=>B-v/ym*(B-T)*0.95;
    cnt.forEach((c,k)=>{el('rect',{x:x(lo+k*bw)+0.5,y:y(dens[k]),width:Math.max(1,x(lo+(k+1)*bw)-x(lo+k*bw)-1),height:B-y(dens[k]),class:'bar'},svg);});
    curve(svg,x,y,t=>ST.dnorm(t,P.m,se),lo,hi,'curve2');
    axisX(svg,x,lo,hi,B,hi-lo>12?2:1,null,'樣本平均數',L,R);
    const sdm=ST.sd(means);
    w.querySelector('#cS').innerHTML=statsHTML([['母體 μ',f2(P.m,2)],['母體 σ',f2(P.s,3)],['理論標準誤 σ/√n',f2(se,3),'mean'],['1,000 個平均數的標準差',f2(sdm,3),'med']]);
    w.querySelector('#cM').textContent=n<5&&pop==='skew'?`n=${n}：母體右偏，樣本平均數的分布也還偏。增加 n 看看曲線（常態近似）何時貼合。`:`n=${n}：平均數的分散約為 σ/√n = ${f2(se,3)}。增加 n 變窄的是「平均數的抽樣分配」，不是母體裡個人的分散。`;};
  segBind(w,'cp',v=>{pop=v;draw();});w.querySelector('#cRe').addEventListener('click',()=>{seed++;draw();});bindSliders(w,defs,draw);draw();
};

/* ---------- ch3: sdse ---------- */
W.sdse=(w)=>{
  const mu=90,s=2.6;let seed=3;const defs=[{id:'sn',label:'樣本數 n',min:5,max:400,step:5,value:40}];
  w.innerHTML=`<div class="widget-title"><strong>標準差 vs. 標準誤</strong><button class="btn" type="button" id="sRe">重抽一組樣本</button></div>${sliders(defs)}${SV('0 0 640 260','個體分布與平均數抽樣分配')}<div class="legend"><span><i style="background:var(--ink)"></i>個體分布 N(90, 2.6)</span><span><i style="background:var(--amber)"></i>樣本平均數的抽樣分配</span></div><div id="sS"></div><p class="readout" id="sM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const n=val(w,'sn');const r=ST.rng(seed*7919+n);const xs=[];for(let i=0;i<n;i++)xs.push(mu+s*ST.rnorm(r));const se=s/Math.sqrt(n);
    svg.innerHTML='';const L=40,R=625,T=16,B=190;const lo=80,hi=100;const x=v=>L+(v-lo)/(hi-lo)*(R-L);const ym=ST.dnorm(mu,mu,se);const y=v=>B-v/ym*(B-T);
    curve(svg,x,v=>B-v/ST.dnorm(mu,mu,s)*(B-T)*0.35,t=>ST.dnorm(t,mu,s),lo,hi,'curve');
    curve(svg,x,y,t=>ST.dnorm(t,mu,se),lo,hi,'curve2',300);
    xs.slice(0,400).forEach((v,i)=>{el('circle',{cx:x(Math.max(lo,Math.min(hi,v))),cy:B+18+((i*37)%9),r:2.2,class:'ptN'},svg);});
    el('line',{x1:L,x2:R,y1:B+34,y2:B+34,class:'axis'},svg);for(let t=lo;t<=hi;t+=2){const tx=el('text',{x:x(t),y:B+50,'text-anchor':'middle'},svg);tx.textContent=t;}
    const xm=ST.mean(xs);el('line',{x1:x(xm),x2:x(xm),y1:T,y2:B+30,class:'mean'},svg);
    w.querySelector('#sS').innerHTML=statsHTML([['樣本平均數',f2(xm,2),'mean'],['樣本標準差 s',f2(ST.sd(xs),2)],['標準誤 σ/√n',f2(se,3),'med'],['95% 區間半寬 1.96·SE',f2(1.96*se,3)]]);
    w.querySelector('#sM').textContent=`n=${n}：點（個人跳高高度）仍然散在約 ±${f2(2*s,1)} 公分內，樣本標準差維持在 2.6 附近；橘色的平均數抽樣分配卻隨 n 變窄。n=40 時標準誤 = 2.6/√40 ≈ 0.4111。`;};
  w.querySelector('#sRe').addEventListener('click',()=>{seed++;draw();});bindSliders(w,defs,draw);draw();
};

/* ---------- ch3: ci ---------- */
W.ci=(w)=>{
  const mu=90,s=2.6;let seed=11,conf=0.95;const defs=[{id:'in',label:'樣本數 n',min:5,max:100,step:5,value:40}];
  w.innerHTML=`<div class="widget-title"><strong>重複抽樣 100 次</strong><div class="controls">${segHTML('cc',[['0.9','90%'],['0.95','95%'],['0.99','99%']],'0.95')}<button class="btn" type="button" id="iRe">再抽 100 組</button></div></div>${sliders(defs)}${SV('0 0 640 340','100 個信賴區間')}<div id="iS"></div><p class="readout" id="iM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const n=val(w,'in'),r=ST.rng(seed*31+n);const z=ST.qnorm(1-(1-conf)/2),se=s/Math.sqrt(n);svg.innerHTML='';const L=40,R=625,T=10,B=300;const lo=mu-5*s/Math.sqrt(5)*0.9,hi=mu+5*s/Math.sqrt(5)*0.9;const x=v=>L+(v-lo)/(hi-lo)*(R-L);let hit=0;
    for(let i=0;i<100;i++){let m=0;for(let j=0;j<n;j++)m+=mu+s*ST.rnorm(r);m/=n;const a=m-z*se,b=m+z*se,ok=a<=mu&&mu<=b;if(ok)hit++;const yy=T+i*2.9;el('line',{x1:x(Math.max(lo,a)),x2:x(Math.min(hi,b)),y1:yy,y2:yy,class:ok?'ci-hit':'ci-miss'},svg);}
    el('line',{x1:x(mu),x2:x(mu),y1:T-4,y2:B,class:'zline'},svg);axisX(svg,x,lo,hi,B+4,1,null,'跳高高度（公分）',L,R);const lb=el('text',{x:x(mu)+4,y:T+6,'text-anchor':'start'},svg);lb.textContent='μ = 90';
    w.querySelector('#iS').innerHTML=statsHTML([['涵蓋 μ 的區間',hit+' / 100','mean'],['沒涵蓋',(100-hit)+' 個','med'],['區間半寬 z·σ/√n',f2(z*se,3)],['z 臨界值',f2(z,3)]]);
    w.querySelector('#iM').textContent=`信心水準 ${conf*100}%：長期約 ${conf*100} 個區間會涵蓋固定的 μ；這次 ${hit} 個。橘色是沒涵蓋的區間。μ 沒有在動，動的是每次抽樣算出的區間。`;};
  segBind(w,'cc',v=>{conf=+v;draw();});w.querySelector('#iRe').addEventListener('click',()=>{seed++;draw();});bindSliders(w,defs,draw);draw();
};

/* ---------- ch3: ztest ---------- */
W.ztest=(w)=>{
  let dir='right',alpha=0.05;const defs=[{id:'zx',label:'樣本平均數 x̄',min:120,max:145,step:0.5,value:138.5,fmt:v=>v.toFixed(1)}];
  w.innerHTML=`<div class="widget-title"><strong>收縮壓：n=30、μ₀=130、σ=20</strong><div class="controls">${segHTML('zd',[['right','右尾 H₁: μ>130'],['two','雙尾'],['left','左尾']],'right')}${segHTML('za',[['0.01','α=.01'],['0.05','α=.05'],['0.1','α=.10']],'0.05')}</div></div>${sliders(defs)}${SV('0 0 640 260','標準常態曲線與拒絕域')}<div class="legend"><span><i style="background:var(--amber);opacity:.4"></i>拒絕域（面積 α）</span><span><i style="background:var(--accent);opacity:.5"></i>P 值面積</span></div><div id="zS"></div><p class="readout" id="zM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const xb=val(w,'zx'),se=20/Math.sqrt(30),z=(xb-130)/se;let p,crit;if(dir==='right'){p=1-ST.pnorm(z);crit=ST.qnorm(1-alpha);}else if(dir==='left'){p=ST.pnorm(z);crit=ST.qnorm(alpha);}else{p=2*(1-ST.pnorm(Math.abs(z)));crit=ST.qnorm(1-alpha/2);}
    svg.innerHTML='';const L=30,R=625,T=16,B=210,lo=-4,hi=4;const x=v=>L+(v-lo)/(hi-lo)*(R-L),y=v=>B-v/0.4*(B-T);
    if(dir==='right')curveArea(svg,x,y,ST.dnorm,crit,hi,'area-r');if(dir==='left')curveArea(svg,x,y,ST.dnorm,lo,crit,'area-r');if(dir==='two'){curveArea(svg,x,y,ST.dnorm,crit,hi,'area-r');curveArea(svg,x,y,ST.dnorm,lo,-crit,'area-r');}
    const zc=Math.max(lo,Math.min(hi,z));if(dir==='right')curveArea(svg,x,y,ST.dnorm,zc,hi,'area-p');if(dir==='left')curveArea(svg,x,y,ST.dnorm,lo,zc,'area-p');if(dir==='two'){const a=Math.abs(zc);curveArea(svg,x,y,ST.dnorm,a,hi,'area-p');curveArea(svg,x,y,ST.dnorm,lo,-a,'area-p');}
    curve(svg,x,y,ST.dnorm,lo,hi,'curve');el('line',{x1:x(zc),x2:x(zc),y1:T,y2:B,class:'zline'},svg);const zl=el('text',{x:x(zc)+(z>2.5?-6:6),y:T+12,'text-anchor':z>2.5?'end':'start'},svg);zl.textContent='z = '+z.toFixed(4);
    axisX(svg,x,lo,hi,B,1,null,'z',L,R);
    const rej=p<alpha;
    w.querySelector('#zS').innerHTML=statsHTML([['標準誤 σ/√n',f2(se,4)],['z',f2(z,4),'mean'],['P 值',p<0.0001?p.toExponential(2):p.toFixed(6),'med'],['臨界值',dir==='two'?'±'+f2(crit,4):f2(crit,4)]]);
    w.querySelector('#zM').innerHTML=`<span class="decision ${rej?'rej':'keep'}">${rej?'拒絕 H₀':'未拒絕 H₀'}</span>：P ${rej?'<':'≥'} α=${alpha}。${dir==='left'&&z>0?'觀察方向和左尾 H₁ 相反，P 值很大；方向要在看資料前決定。':''}${!rej?' 未拒絕不等於證明 H₀ 為真。':''} 講義第 26 張的 z=5.06 不符合這組數據，正確約為 2.3278。`;};
  segBind(w,'zd',v=>{dir=v;draw();});segBind(w,'za',v=>{alpha=+v;draw();});bindSliders(w,defs,draw);draw();
};

/* ---------- design (ch4, generic classify) ---------- */
W.design=(w,CH)=>{
  const items=CH.designItems||[];const ans={};
  w.innerHTML=`<div class="widget-title"><strong>獨立樣本還是成對樣本？</strong><span class="note">${items.length} 個情境</span></div><div class="tbl-wrap"><table><tbody>${items.map((it,i)=>`<tr><td style="white-space:normal">${esc(it[0])}</td><td>${segHTML('dg'+i,[['indep','獨立'],['paired','成對']],'')}</td></tr>`).join('')}</tbody></table></div><p class="readout" id="dgM">每一列選一個。</p>`;
  items.forEach((it,i)=>segBind(w,'dg'+i,v=>{ans[i]=v;const n=Object.keys(ans).length,ok=Object.entries(ans).filter(([k,a])=>items[k][1]===a).length;const wrong=Object.entries(ans).filter(([k,a])=>items[k][1]!==a).map(([k])=>+k+1);
    w.querySelector('#dgM').innerHTML=n<items.length?`已判斷 ${n} / ${items.length}，答對 ${ok}。`:ok===items.length?'<b>全對。</b>同一對象重複測量或刻意配對，就要保留配對，分析每對的差值。':`答對 ${ok} / ${items.length}。再看第 ${wrong.join('、')} 題：是不是同一批人（或配對的人）被測了兩次？`;}));
};

/* ---------- ch4: ttest ---------- */
W.ttest=(w)=>{
  const defs=[{id:'m1',label:'組 1 平均',min:30,max:70,step:0.5,value:50},{id:'m2',label:'組 2 平均',min:30,max:70,step:0.5,value:45},{id:'s1',label:'組 1 標準差',min:2,max:20,step:0.5,value:10},{id:'s2',label:'組 2 標準差',min:2,max:20,step:0.5,value:10},{id:'n1',label:'組 1 人數',min:3,max:100,step:1,value:20},{id:'n2',label:'組 2 人數',min:3,max:100,step:1,value:20}];
  w.innerHTML=`<div class="widget-title"><strong>兩獨立組平均數比較</strong><span class="note">改平均差、分散、人數</span></div>${sliders(defs)}${SV('0 0 640 230','兩組分布')}<div class="legend"><span><i style="background:var(--accent)"></i>組 1</span><span><i style="background:var(--amber)"></i>組 2</span></div><div id="tS"></div><p class="readout" id="tM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const m1=val(w,'m1'),m2=val(w,'m2'),s1=val(w,'s1'),s2=val(w,'s2'),n1=val(w,'n1'),n2=val(w,'n2');
    const sp=Math.sqrt(((n1-1)*s1*s1+(n2-1)*s2*s2)/(n1+n2-2));const tS=(m1-m2)/(sp*Math.sqrt(1/n1+1/n2)),dfS=n1+n2-2,pS=2*(1-ST.pt(Math.abs(tS),dfS));
    const v1=s1*s1/n1,v2=s2*s2/n2,tW=(m1-m2)/Math.sqrt(v1+v2),dfW=(v1+v2)**2/(v1*v1/(n1-1)+v2*v2/(n2-1)),pW=2*(1-ST.pt(Math.abs(tW),dfW));
    svg.innerHTML='';const L=30,R=625,T=14,B=190,lo=0,hi=100;const x=v=>L+(v-lo)/(hi-lo)*(R-L);const ym=Math.max(ST.dnorm(0,0,s1),ST.dnorm(0,0,s2));const y=v=>B-v/ym*(B-T);
    curveArea(svg,x,y,t=>ST.dnorm(t,m1,s1),lo,hi,'area-p');curve(svg,x,y,t=>ST.dnorm(t,m1,s1),lo,hi,'curve3');curve(svg,x,y,t=>ST.dnorm(t,m2,s2),lo,hi,'curve2');axisX(svg,x,lo,hi,B,10,null,'測量值',L,R);
    w.querySelector('#tS').innerHTML=statsHTML([['平均差',f2(m1-m2,2),'mean'],['Student t',f2(tS,3)],['df',dfS],['P（雙尾）',fp(pS)],['Welch t',f2(tW,3),'med'],['Welch df',f2(dfW,1)],['Welch P',fp(pW)]]);
    const ratio=Math.max(s1,s2)/Math.min(s1,s2);
    w.querySelector('#tM').textContent=`${ratio>=2||n1!==n2&&ratio>1.5?'兩組標準差差很多（且人數不同時更明顯），Student 與 Welch 結果可能分歧，這時考慮 Welch。':'標準差相近時，Student t 與 Welch t 幾乎相同。'} 平均差不變、人數變多，t 變大、P 變小；分散變大則相反。`;};
  bindSliders(w,defs,draw);draw();
};

/* ---------- ch4: tails ---------- */
W.tails=(w)=>{
  let h1='gt';const defs=[{id:'tt',label:'觀察到的 t',min:-4,max:4,step:0.001,value:2.081,fmt:v=>v.toFixed(3)},{id:'td',label:'自由度 df',min:3,max:150,step:1,value:127}];
  w.innerHTML=`<div class="widget-title"><strong>單尾、雙尾與方向</strong>${segHTML('th',[['gt','H₁：大於'],['lt','H₁：小於'],['ne','H₁：不等於']],'gt')}</div>${sliders(defs)}${SV('0 0 640 240','t 分配與 P 值面積')}<div id="hS"></div><p class="readout" id="hM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const t=val(w,'tt'),df=val(w,'td');const pR=1-ST.pt(t,df),pL=ST.pt(t,df),p2=2*(1-ST.pt(Math.abs(t),df));const p=h1==='gt'?pR:h1==='lt'?pL:p2;
    svg.innerHTML='';const L=30,R=625,T=16,B=200,lo=-5,hi=5;const x=v=>L+(v-lo)/(hi-lo)*(R-L),f=v=>ST.dt(v,df),y=v=>B-v/f(0)*(B-T);
    if(h1==='gt')curveArea(svg,x,y,f,t,hi,'area-p');if(h1==='lt')curveArea(svg,x,y,f,lo,t,'area-p');if(h1==='ne'){curveArea(svg,x,y,f,Math.abs(t),hi,'area-p');curveArea(svg,x,y,f,lo,-Math.abs(t),'area-p');}
    curve(svg,x,y,f,lo,hi,'curve');el('line',{x1:x(t),x2:x(t),y1:T,y2:B,class:'zline'},svg);axisX(svg,x,lo,hi,B,1,null,'t',L,R);
    w.querySelector('#hS').innerHTML=statsHTML([['P（你選的 H₁）',fp(p),'mean'],['右尾 P',fp(pR)],['左尾 P',fp(pL)],['雙尾 P',fp(p2)],['雙尾 ÷ 2',fp(p2/2),'med']]);
    const opp=(h1==='gt'&&t<0)||(h1==='lt'&&t>0);
    w.querySelector('#hM').textContent=opp?`觀察到的 t 方向與 H₁ 相反：正確的單尾 P = ${fp(p)}，不是雙尾 P ÷ 2 = ${fp(p2/2)}。方向必須在看資料前由研究問題決定。`:h1==='ne'?'雙尾檢定把兩側都算進 P 值。':`方向與 H₁ 一致時，單尾 P 才等於雙尾 P 的一半（${fp(p2/2)}）。`;};
  segBind(w,'th',v=>{h1=v;draw();});bindSliders(w,defs,draw);draw();
};

/* ---------- ch5: anova ---------- */
W.anova=(w)=>{
  const G=['A','B','C','D'];let means=[1.205,1.361,1.448,1.330];const Z=(()=>{const r=ST.rng(5);const z=[];for(let g=0;g<4;g++){const a=[];for(let i=0;i<12;i++)a.push(ST.rnorm(r));const m=ST.mean(a),s=ST.sd(a);z.push(a.map(v=>(v-m)/s));}return z;})();
  const defs=[{id:'as',label:'組內標準差（kg）',min:0.01,max:0.25,step:0.005,value:0.05,fmt:v=>v.toFixed(3)},{id:'an',label:'每組人數',min:3,max:12,step:1,value:6}];
  w.innerHTML=`<div class="widget-title"><strong>拖動組平均，看 F 怎麼變</strong><span class="note">預設接近作業的四種補充品平均增重</span></div>${sliders(defs)}${SV('0 0 640 300','四組資料點與平均')}<div id="aS"></div><p class="readout" id="aM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const sdw=val(w,'as'),n=val(w,'an');const k=4,N=k*n;const data=G.map((g,i)=>Z[i].slice(0,n).map(z=>means[i]+sdw*z*Math.sqrt((n-1)/n)*Math.sqrt(n/(n-1))));
    const gm=ST.mean(data.flat());const ssb=data.reduce((s,a)=>s+n*(ST.mean(a)-gm)**2,0);const ssw=data.reduce((s,a)=>{const m=ST.mean(a);return s+a.reduce((t,v)=>t+(v-m)**2,0);},0);const F=(ssb/(k-1))/(ssw/(N-k)),p=1-ST.pf(F,k-1,N-k);
    svg.innerHTML='';const L=48,R=625,T=16,B=250,lo=0.8,hi=1.9;const y=v=>B-(v-lo)/(hi-lo)*(B-T);const cw=(R-L)/k;axisY(svg,y,lo,hi,L,0.1,v=>v.toFixed(1),'增重 kg',T);
    el('line',{x1:L,x2:R,y1:y(gm),y2:y(gm),class:'mean'},svg);const gl=el('text',{x:R,y:y(gm)-5,'text-anchor':'end',class:'meanlab'},svg);gl.textContent='總平均 '+f2(gm,3);
    data.forEach((a,i)=>{const cx=L+cw*(i+0.5);a.forEach((v,j)=>el('circle',{cx:cx-18+(j%6)*7,cy:y(Math.max(lo,Math.min(hi,v))),r:3,class:'ptN'},svg));const m=ST.mean(a);
      el('line',{x1:cx-34,x2:cx+34,y1:y(m),y2:y(m),class:'median'},svg);const h=el('circle',{cx:cx+30,cy:y(m),r:9,class:'dot drag',tabindex:0,'data-g':i,'aria-label':G[i]+' 組平均 '+m.toFixed(3)},svg);
      const t=el('text',{x:cx,y:B+18,'text-anchor':'middle',class:'grp'},svg);t.textContent=G[i]+' 組';});
    const pt2=ev=>{const r=svg.getBoundingClientRect();const vy=(ev.clientY-r.top)/r.height*300;return Math.max(lo+0.05,Math.min(hi-0.05,lo+(B-vy)/(B-T)*(hi-lo)));};
    svg.querySelectorAll('[data-g]').forEach(c=>{const i=+c.dataset.g;c.addEventListener('pointerdown',ev=>{ev.preventDefault();c.setPointerCapture(ev.pointerId);const mv=e2=>{means[i]=Math.round(pt2(e2)*200)/200;draw();};const up=()=>{svg.removeEventListener('pointermove',mv);svg.removeEventListener('pointerup',up);};svg.addEventListener('pointermove',mv);svg.addEventListener('pointerup',up);});
      c.addEventListener('keydown',ev=>{if(ev.key==='ArrowUp'||ev.key==='ArrowDown'){ev.preventDefault();means[i]=Math.round((means[i]+(ev.key==='ArrowUp'?0.01:-0.01))*1000)/1000;draw();const n2=svg.querySelector(`[data-g="${i}"]`);if(n2)n2.focus();}});});
    const share=ssb/(ssb+ssw);
    w.querySelector('#aS').innerHTML=statsHTML([['組間 SS',f2(ssb,3),'mean'],['組內 SS',f2(ssw,3),'med'],['F('+(k-1)+', '+(N-k)+')',f2(F,3)],['P',fp(p)],['η²（組間占比）',f2(share,3)]]);
    w.querySelector('#aM').textContent=`${p<0.05?'F 檢定顯著：只能說四組平均並非全部相等，還要事後比較才知道哪幾組不同。':'F 不顯著：組間差異相對組內分散不夠大。'} 把組內標準差調大，同樣的平均差會變得不顯著。拖動右側圓點改變組平均（或聚焦後按上下鍵）。`;};
  bindSliders(w,defs,draw);draw();
};

/* ---------- ch5: fwer ---------- */
W.fwer=(w)=>{
  let alpha=0.05;const defs=[{id:'fk',label:'組數 k',min:2,max:8,step:1,value:4}];
  w.innerHTML=`<div class="widget-title"><strong>比較越多次，誤判越多</strong>${segHTML('fa',[['0.05','α=.05'],['0.01','α=.01']],'0.05')}</div>${sliders(defs)}${SV('0 0 640 240','整體型一錯誤率')}<div id="fS"></div><p class="readout" id="fM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const k=val(w,'fk'),m=k*(k-1)/2,fw=1-(1-alpha)**m,bon=alpha/m,fwb=1-(1-bon)**m;svg.innerHTML='';const L=48,R=625,T=16,B=200;const x=v=>L+(v-1)/(28-1)*(R-L),y=v=>B-v/0.8*(B-T);axisY(svg,y,0,0.8,L,0.2,v=>v.toFixed(1),'整體型一錯誤率',T);
    curve(svg,x,y,mm=>1-(1-alpha)**mm,1,28,'curve2');curve(svg,x,y,mm=>1-(1-alpha/mm)**mm,1,28,'curve3');axisX(svg,x,1,28,B,3,null,'比較次數 m',L,R);
    el('circle',{cx:x(m),cy:y(fw),r:6,style:'fill:var(--amber)'},svg);el('circle',{cx:x(m),cy:y(fwb),r:6,style:'fill:var(--accent)'},svg);
    w.querySelector('#fS').innerHTML=statsHTML([['配對數 m = k(k−1)/2',m],['未校正整體錯誤率',(fw*100).toFixed(1)+'%','med'],['Bonferroni 每次 α',bon.toPrecision(3),'mean'],['校正後整體錯誤率 ≤',(fwb*100).toFixed(1)+'%']]);
    w.querySelector('#fM').textContent=`${k} 組共有 ${m} 對。每對都用 α=${alpha} 檢定（假設獨立），至少誤判一次的機率約 ${(fw*100).toFixed(1)}%。Bonferroni 把每次門檻降到 α/m；SPSS 報的「調整後 P」已經乘過 m，不要再乘一次。`;};
  segBind(w,'fa',v=>{alpha=+v;draw();});bindSliders(w,defs,draw);draw();
};

/* ---------- ch6: chi2 & fisher ---------- */
function tableStats(t){const[a,b,c,d]=t,r1=a+b,r2=c+d,c1=a+c,c2=b+d,N=r1+r2;const E=[r1*c1/N,r1*c2/N,r2*c1/N,r2*c2/N];const chi=t.reduce((s,o,i)=>s+(E[i]?(o-E[i])**2/E[i]:0),0);const pc=1-ST.pchisq(chi,1);
  const lo=Math.max(0,c1-r2),hi=Math.min(r1,c1);const probs=[];for(let x=lo;x<=hi;x++)probs.push([x,ST.dhyper(x,r1,r2,c1)]);const pobs=ST.dhyper(a,r1,r2,c1);const pf=Math.min(1,probs.filter(q=>q[1]<=pobs*(1+1e-7)).reduce((s,q)=>s+q[1],0));return{r1,r2,c1,c2,N,E,chi,pc,pf,probs,pobs,lo,hi};}
const CHI_PRE={cfs:{rows:['藥物組','安慰劑組'],cols:['改善','未改善'],t:[12,3,3,14],note:'CFS 原始資料：χ²(1)=12.441、Fisher 雙尾 p=.001、最小期望 7.03。'},pphn:{rows:['未滿 34 週','至少 34 週'],cols:['存活','死亡'],t:[25,6,87,13],note:'PPHN 原始資料：χ²(1)=.771、p=.380；Fisher 雙尾 p=.390；最小期望 4.50。'}};
let CHI_DEF=CHI_PRE.cfs;
let chiState=CHI_DEF.t.slice();const chiListeners=[];
W.chi2=(w)=>{
  w.innerHTML=`<div class="widget-title"><strong>2×2 表：觀察、期望與檢定</strong><div class="controls">${segHTML('xp',[['cfs','CFS 試驗'],['pphn','PPHN 胎齡×存活']],'cfs')}<button class="btn" type="button" id="xR">重設</button></div></div><div class="tbl-wrap"><table class="ct" id="xT"></table></div><div id="xS"></div><p class="readout" id="xM"></p><p class="note" style="margin:0">直接改四格人數。小字是期望次數，紅色表示小於 5。</p>`;
  const build=()=>{const s=tableStats(chiState);const R=CHI_DEF.rows,C=CHI_DEF.cols;let h=`<tr><th></th>${C.map(c=>`<th>${c}</th>`).join('')}<th>合計</th><th>${C[0]}比例</th></tr>`;
    [0,1].forEach(i=>{h+=`<tr><th>${R[i]}</th>${[0,1].map(j=>{const k=i*2+j;return `<td><input type="number" min="0" max="999" value="${chiState[k]}" data-x="${k}" aria-label="${R[i]}${C[j]}"><span class="exp${s.E[k]<5?' low':''}" data-e="${k}">期望 ${f2(s.E[k],2)}</span></td>`;}).join('')}<td class="tot" data-rt="${i}">${i?s.r2:s.r1}</td><td class="tot" data-rp="${i}">${f2((i?chiState[2]/s.r2:chiState[0]/s.r1)*100,1)}%</td></tr>`;});
    h+=`<tr><th>合計</th><td class="tot" data-ct="0">${s.c1}</td><td class="tot" data-ct="1">${s.c2}</td><td class="tot" data-n>${s.N}</td><td></td></tr>`;w.querySelector('#xT').innerHTML=h;upd();};
  const upd=()=>{const s=tableStats(chiState);if(s.N===0||s.r1===0||s.r2===0||s.c1===0||s.c2===0){w.querySelector('#xS').innerHTML='';w.querySelector('#xM').textContent='每一列、每一欄至少要有 1 人。';return;}
    [0,1,2,3].forEach(k=>{const e=w.querySelector(`[data-e="${k}"]`);e.textContent='期望 '+f2(s.E[k],2);e.classList.toggle('low',s.E[k]<5);});
    w.querySelector('[data-rt="0"]').textContent=s.r1;w.querySelector('[data-rt="1"]').textContent=s.r2;w.querySelector('[data-rp="0"]').textContent=f2(chiState[0]/s.r1*100,1)+'%';w.querySelector('[data-rp="1"]').textContent=f2(chiState[2]/s.r2*100,1)+'%';w.querySelector('[data-ct="0"]').textContent=s.c1;w.querySelector('[data-ct="1"]').textContent=s.c2;w.querySelector('[data-n]').textContent=s.N;
    const low=s.E.filter(e=>e<5).length;w.querySelector('#xS').innerHTML=statsHTML([['Pearson χ²(1)',f2(s.chi,3),'mean'],['χ² 的 P',fp(s.pc)],['Fisher 雙尾 P',fp(s.pf),'med'],['最小期望次數',f2(Math.min(...s.E),2)],['期望 < 5 的格數',low+' / 4']]);
    w.querySelector('#xM').textContent=low?`有 ${low} 格期望次數小於 5，卡方近似可能不準，主要報告 Fisher 精確檢定。`+(chiState.join()===CHI_DEF.t.join()?' '+CHI_DEF.note:''):'四格期望次數都 ≥ 5，Pearson 卡方近似可用；Fisher 可作為一致性檢查。'+(chiState.join()===CHI_DEF.t.join()?' '+CHI_DEF.note:'');chiListeners.forEach(f=>f());};
  w.addEventListener('input',e=>{const i=e.target.closest('[data-x]');if(!i)return;const v=Math.max(0,Math.min(999,Math.round(+i.value||0)));chiState[+i.dataset.x]=v;upd();});
  w.querySelector('#xR').addEventListener('click',()=>{chiState=CHI_DEF.t.slice();build();});segBind(w,'xp',v=>{CHI_DEF=CHI_PRE[v];chiState=CHI_DEF.t.slice();build();});build();
};
W.fisher=(w)=>{
  w.innerHTML=`<div class="widget-title"><strong>邊際總數固定時，所有可能的表</strong><span class="note">與上方表格連動</span></div>${SV('0 0 640 260','超幾何分配')}<p class="readout" id="fiM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const s=tableStats(chiState);svg.innerHTML='';if(!s.N||!s.r1||!s.r2||!s.c1||!s.c2){w.querySelector('#fiM').textContent='上方表格每列、每欄至少要有 1 人。';return;}
    const L=48,R=625,T=16,B=210;const n=s.hi-s.lo+1;const ym=Math.max(...s.probs.map(q=>q[1]));const ys=ym>0.2?0.1:ym>0.05?0.05:0.01;const yt=Math.ceil(ym/ys)*ys;const x=i=>L+(i-s.lo+0.5)/n*(R-L),y=v=>B-v/yt*(B-T),bw=Math.max(2,(R-L)/n-3);
    axisY(svg,y,0,yt,L,ys,v=>v.toFixed(2),'機率',T);
    s.probs.forEach(([a,p])=>{const ext=p<=s.pobs*(1+1e-7);const r=el('rect',{x:x(a)-bw/2,y:y(p),width:bw,height:B-y(p),class:ext?'bar2':'bar'},svg);if(a===chiState[0])r.setAttribute('style','fill:var(--amber);opacity:1');const tt=el('title',{},r);tt.textContent=`左上格 = ${a}：機率 ${p.toFixed(5)}`;});
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);const st=n>24?5:n>12?2:1;s.probs.forEach(([a])=>{if((a-s.lo)%st===0){const t=el('text',{x:x(a),y:B+16,'text-anchor':'middle'},svg);t.textContent=a;}});const lb=el('text',{x:R,y:B+32,'text-anchor':'end'},svg);lb.textContent=`左上格（${CHI_DEF.rows[0]}・${CHI_DEF.cols[0]}）的人數`;
    w.querySelector('#fiM').textContent=`列總數 ${s.r1}、${s.r2} 與欄總數 ${s.c1}、${s.c2} 固定下，左上格可能是 ${s.lo}–${s.hi}。觀察到 ${chiState[0]}（深色）。所有機率不大於它的表（橘色）加總，就是 Fisher 雙尾 P = ${fp(s.pf)}。`;};
  chiListeners.push(draw);draw();
};

/* ---------- ch7: corr ---------- */
W.corr=(w)=>{
  const base=(()=>{const r=ST.rng(21);const p=[];for(let i=0;i<25;i++){const x=72+r()*36;p.push([x,72+0.55*x+ST.rnorm(r)*9]);}return p;})();let pts=base.map(p=>p.slice());
  w.innerHTML=`<div class="widget-title"><strong>拖動點，看 r、ρ 與迴歸線</strong><div class="controls"><button class="btn" type="button" id="cAdd">加入一個極端點</button><button class="btn" type="button" id="cRs">重設</button></div></div>${SV('0 0 640 320','腰圍與收縮壓散佈圖')}<div id="rS"></div><p class="readout" id="rM"></p>`;
  const svg=w.querySelector('svg');const L=52,R=625,T=16,B=270,xl=60,xh=150,yl=90,yh=200;const X=v=>L+(v-xl)/(xh-xl)*(R-L),Y=v=>B-(v-yl)/(yh-yl)*(B-T);
  const draw=(act)=>{svg.innerHTML='';axisY(svg,Y,yl,yh,L,20,null,'收縮壓 mmHg',T);axisX(svg,X,xl,xh,B,10,null,'腰圍 cm',L,R);const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const f=ST.ols(xs,ys),rho=ST.spearman(xs,ys);
    el('line',{x1:X(xl),x2:X(xh),y1:Y(f.a+f.b*xl),y2:Y(f.a+f.b*xh),class:'fit'},svg);
    pts.forEach((p,i)=>el('circle',{cx:X(p[0]),cy:Y(p[1]),r:6,class:'dot'+(i===act?' active':''),tabindex:0,'data-i':i,'aria-label':`點 ${i+1}：腰圍 ${p[0].toFixed(0)}、收縮壓 ${p[1].toFixed(0)}`},svg));
    const toV=ev=>{const r=svg.getBoundingClientRect();const vx=(ev.clientX-r.left)/r.width*640,vy=(ev.clientY-r.top)/r.height*320;return[Math.max(xl,Math.min(xh,xl+(vx-L)/(R-L)*(xh-xl))),Math.max(yl,Math.min(yh,yl+(B-vy)/(B-T)*(yh-yl)))];};
    svg.querySelectorAll('[data-i]').forEach(c=>{const i=+c.dataset.i;c.addEventListener('pointerdown',ev=>{ev.preventDefault();c.setPointerCapture(ev.pointerId);const mv=e2=>{pts[i]=toV(e2);draw(i);};const up=()=>{svg.removeEventListener('pointermove',mv);svg.removeEventListener('pointerup',up);draw();};svg.addEventListener('pointermove',mv);svg.addEventListener('pointerup',up);});});
    w.querySelector('#rS').innerHTML=statsHTML([['Pearson r',f2(f.r,3),'mean'],['Spearman ρ',f2(rho,3),'med'],['斜率 b',f2(f.b,3)+' mmHg/cm'],['截距 a',f2(f.a,1)],['R²',f2(f.r2,3)],['n',f.n]]);
    w.querySelector('#rM').textContent=`ŷ = ${f2(f.a,1)} + ${f2(f.b,3)} × 腰圍：腰圍每多 1 公分，平均收縮壓估計${f.b>=0?'增加':'減少'} ${f2(Math.abs(f.b),3)} mmHg（只在資料範圍內解讀）。把一個點拖到極端位置，r 通常比 ρ 變得多，因為 ρ 只看排序。示範資料為模擬值。`;};
  w.querySelector('#cAdd').addEventListener('click',()=>{pts.push([145,105]);draw(pts.length-1);});w.querySelector('#cRs').addEventListener('click',()=>{pts=base.map(p=>p.slice());draw();});draw();
};

/* ---------- ch7: r2 ---------- */
W.r2=(w)=>{
  let N=300;const defs=[{id:'rn',label:'個體差異（殘差標準差）',min:2,max:40,step:1,value:18}];
  w.innerHTML=`<div class="widget-title"><strong>顯著 ≠ 預測得準</strong>${segHTML('rnn',[['30','n=30'],['300','n=300'],['3000','n=3,000']],'300')}</div>${sliders(defs)}${SV('0 0 640 300','模擬散佈圖與迴歸線')}<div id="r2S"></div><p class="readout" id="r2M"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const sdv=val(w,'rn'),r=ST.rng(99+N);const xs=[],ys=[];for(let i=0;i<N;i++){const x=70+r()*40;xs.push(x);ys.push(60+0.6*x+ST.rnorm(r)*sdv);}const f=ST.ols(xs,ys);
    svg.innerHTML='';const L=52,R=625,T=16,B=250,xl=65,xh=115,yl=40,yh=220;const X=v=>L+(v-xl)/(xh-xl)*(R-L),Y=v=>B-(Math.max(yl,Math.min(yh,v))-yl)/(yh-yl)*(B-T);axisY(svg,Y,yl,yh,L,40,null,'收縮壓 mmHg',T);axisX(svg,X,xl,xh,B,10,null,'腰圍 cm',L,R);
    for(let i=0;i<Math.min(N,700);i++)el('circle',{cx:X(xs[i]),cy:Y(ys[i]),r:2.2,class:'ptN'},svg);el('line',{x1:X(xl),x2:X(xh),y1:Y(f.a+f.b*xl),y2:Y(f.a+f.b*xh),class:'fitA'},svg);
    w.querySelector('#r2S').innerHTML=statsHTML([['估計斜率',f2(f.b,3),'mean'],['斜率 P',f.p<1e-4?'< .0001':fp(f.p)],['R²',f2(f.r2,3),'med'],['n',N.toLocaleString()]]);
    w.querySelector('#r2M').textContent=`真實斜率固定為 0.6 mmHg/cm。${f.p<0.05&&f.r2<0.1?`斜率顯著（P ${f.p<1e-4?'< .0001':'= '+fp(f.p)}），但 R² 只有 ${f2(f.r2,3)}：線性關係偵測得到，個人血壓仍有大量變異沒被腰圍解釋。`:'調大個體差異、把 n 改成 3,000，看斜率仍顯著但 R² 很小的情況。'}${N>700?' 圖上只畫前 700 點。':''}`;};
  segBind(w,'rnn',v=>{N=+v;draw();});bindSliders(w,defs,draw);draw();
};

/* ---------- ch8: simpson ---------- */
W.simpson=(w)=>{
  let view='pool';const pts=(()=>{const r=ST.rng(8);const p=[];for(let g=0;g<2;g++)for(let i=0;i<40;i++){const x=(g?60:30)+r()*20;p.push([x,(g?70:40)+0.5*(x-(g?60:30))+ST.rnorm(r)*4,g]);}return p;})();
  // flip so pooled is negative: group1 high x low y
  pts.forEach(p=>{if(p[2]===1)p[1]-=55;});
  w.innerHTML=`<div class="widget-title"><strong>合併看 vs. 分組看</strong>${segHTML('sv',[['pool','合併看（未調整）'],['grp','依組別分開（調整後）']],'pool')}</div>${SV('0 0 640 300','兩組散佈圖')}<div class="legend"><span><i style="background:var(--accent)"></i>A 組</span><span><i style="background:var(--amber)"></i>B 組</span></div><div id="smS"></div><p class="readout" id="smM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{svg.innerHTML='';const L=48,R=625,T=16,B=250,xl=25,xh=85,yl=0,yh=80;const X=v=>L+(v-xl)/(xh-xl)*(R-L),Y=v=>B-(v-yl)/(yh-yl)*(B-T);axisY(svg,Y,yl,yh,L,20,null,'結果 Y',T);axisX(svg,X,xl,xh,B,10,null,'暴露 X',L,R);
    pts.forEach(p=>el('circle',{cx:X(p[0]),cy:Y(p[1]),r:3.4,class:view==='pool'?'ptN':(p[2]?'ptB':'ptA')},svg));
    const all=ST.ols(pts.map(p=>p[0]),pts.map(p=>p[1]));const g0=pts.filter(p=>!p[2]),g1=pts.filter(p=>p[2]);const a0=ST.ols(g0.map(p=>p[0]),g0.map(p=>p[1])),a1=ST.ols(g1.map(p=>p[0]),g1.map(p=>p[1]));
    // adjusted common slope (y ~ x + group)
    const cx=pts.map(p=>p[0]-(p[2]?ST.mean(g1.map(q=>q[0])):ST.mean(g0.map(q=>q[0])))),cy=pts.map(p=>p[1]-(p[2]?ST.mean(g1.map(q=>q[1])):ST.mean(g0.map(q=>q[1]))));const badj=cx.reduce((s,v,i)=>s+v*cy[i],0)/cx.reduce((s,v)=>s+v*v,0);
    if(view==='pool')el('line',{x1:X(xl),x2:X(xh),y1:Y(all.a+all.b*xl),y2:Y(all.a+all.b*xh),class:'fit'},svg);
    else{[[g0,a0,'fitA'],[g1,a1,'fitB']].forEach(([g,f,c])=>{const lo=Math.min(...g.map(p=>p[0])),hi=Math.max(...g.map(p=>p[0]));el('line',{x1:X(lo),x2:X(hi),y1:Y(f.a+f.b*lo),y2:Y(f.a+f.b*hi),class:c},svg);});}
    w.querySelector('#smS').innerHTML=statsHTML([['未調整斜率',f2(all.b,3),'mean'],['調整組別後斜率',f2(badj,3),'med'],['A 組內斜率',f2(a0.b,3)],['B 組內斜率',f2(a1.b,3)]]);
    w.querySelector('#smM').textContent=view==='pool'?`合併看，X 越大 Y 越小（斜率 ${f2(all.b,2)}）。切到「依組別分開」看看。`:`每組內部 X 越大 Y 越大（約 ${f2(badj,2)}），方向和合併時相反。組別同時影響 X 與 Y，是混雜因子；未調整與調整後係數差很多時要警覺。示範資料為模擬值。`;};
  segBind(w,'sv',v=>{view=v;draw();});draw();
};

/* ---------- ch8: interact ---------- */
W.interact=(w)=>{
  const defs=[{id:'ib',label:'交互作用項 β₃（sex=1 × 年齡）',min:-0.4,max:0.4,step:0.001,value:-0.149,fmt:v=>v.toFixed(3)}];
  w.innerHTML=`<div class="widget-title"><strong>年齡效果隨性別改變</strong><span class="note">壓差 = 22.388 + 0.459·年齡 + 10.658·sex + β₃·年齡·sex</span></div>${sliders(defs)}${SV('0 0 640 280','兩條迴歸線')}<div class="legend"><span><i style="background:var(--accent)"></i>sex=0</span><span><i style="background:var(--amber)"></i>sex=1</span></div><div id="inS"></div><p class="readout" id="inM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const b3=val(w,'ib'),b0=22.388,b1=0.459,b2=10.658;svg.innerHTML='';const L=48,R=625,T=16,B=230,xl=20,xh=80,yl=20,yh=80;const X=v=>L+(v-xl)/(xh-xl)*(R-L),Y=v=>B-(Math.max(yl,Math.min(yh,v))-yl)/(yh-yl)*(B-T);
    axisY(svg,Y,yl,yh,L,10,null,'壓差 mmHg',T);axisX(svg,X,xl,xh,B,10,null,'年齡',L,R);
    el('line',{x1:X(xl),x2:X(xh),y1:Y(b0+b1*xl),y2:Y(b0+b1*xh),class:'fitA'},svg);el('line',{x1:X(xl),x2:X(xh),y1:Y(b0+b2+(b1+b3)*xl),y2:Y(b0+b2+(b1+b3)*xh),class:'fitB'},svg);
    const d50=b2+b3*50;
    w.querySelector('#inS').innerHTML=statsHTML([['sex=0 年齡斜率',f2(b1,3),'mean'],['sex=1 年齡斜率',f2(b1+b3,3),'med'],['50 歲時組間差',f2(d50,3)],['年齡 0 時組間差',f2(b2,3)]]);
    w.querySelector('#inM').textContent=`β₃=0 時兩線平行，年齡效果兩性相同。β₃=${b3.toFixed(3)} 時，sex=1 的年齡斜率是 ${f2(b1+b3,3)}。模型含交互作用時，10.658 只是年齡=0 的組間差；50 歲時差約 ${f2(d50,3)} mmHg。預設值取自本章 SPSS 輸出。`;};
  bindSliders(w,defs,draw);draw();
};

/* ---------- ch8: rate ---------- */
W.rate=(w)=>{
  const st={e1:3612,p1:148374,e2:2399,p2:85292};
  w.innerHTML=`<div class="widget-title"><strong>事件數 ÷ 人年 = 發生率</strong><button class="btn" type="button" id="raR">回到 CVD 資料</button></div><div class="tbl-wrap"><table class="ct"><tr><th></th><th>事件數</th><th>追蹤人年</th><th>每 1,000 人年</th></tr>${[['sex=0','e1','p1'],['sex=1','e2','p2']].map(([l,e,p])=>`<tr><th>${l}</th><td><input type="number" min="0" data-ra="${e}" value="${st[e]}" style="width:90px" aria-label="${l} 事件數"></td><td><input type="number" min="1" data-ra="${p}" value="${st[p]}" style="width:110px" aria-label="${l} 人年"></td><td class="num" data-rr="${e}"></td></tr>`).join('')}</table></div>${SV('0 0 640 200','發生率與信賴區間')}<div id="raS"></div><p class="readout" id="raM"></p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const{e1,p1,e2,p2}=st;if(!(e1>0&&e2>0&&p1>0&&p2>0)){w.querySelector('#raM').textContent='事件數與人年都要大於 0。';return;}const r1=e1/p1*1000,r2=e2/p2*1000;const ci=(e,p)=>[Math.exp(Math.log(e/p)-1.96/Math.sqrt(e))*1000,Math.exp(Math.log(e/p)+1.96/Math.sqrt(e))*1000];const c1=ci(e1,p1),c2=ci(e2,p2);
    const irr=r2/r1,se=Math.sqrt(1/e1+1/e2),il=Math.exp(Math.log(irr)-1.96*se),ih=Math.exp(Math.log(irr)+1.96*se);
    w.querySelector('[data-rr="e1"]').textContent=f2(r1,3);w.querySelector('[data-rr="e2"]').textContent=f2(r2,3);
    svg.innerHTML='';const L=70,R=625,T=20,B=170;const hi=Math.max(c1[1],c2[1])*1.15;const X=v=>L+v/hi*(R-L);const st2=niceStep(hi,6);axisX(svg,X,0,hi,B,st2,null,'每 1,000 人年',L,R);
    [[r1,c1,'sex=0','fitA'],[r2,c2,'sex=1','fitB']].forEach(([r,c,l,cls],i)=>{const yy=T+30+i*60;el('rect',{x:L,y:yy-14,width:X(r)-L,height:28,class:i?'bar2':'bar'},svg);el('line',{x1:X(c[0]),x2:X(c[1]),y1:yy,y2:yy,class:cls},svg);[c[0],c[1]].forEach(v=>el('line',{x1:X(v),x2:X(v),y1:yy-7,y2:yy+7,class:cls},svg));const t=el('text',{x:L-8,y:yy+4,'text-anchor':'end',class:'grp'},svg);t.textContent=l;});
    w.querySelector('#raS').innerHTML=statsHTML([['sex=0 發生率',f2(r1,3),'mean'],['sex=1 發生率',f2(r2,3),'med'],['IRR（sex=1 ÷ sex=0）',f2(irr,3)],['IRR 95% CI',f2(il,3)+'–'+f2(ih,3)]]);
    w.querySelector('#raM').textContent=`改變人年但不改事件數，率就會變：分母是暴露時間。Poisson 模型以 log(人年) 為 offset（係數固定為 1）才能比較不同追蹤時間的組。預設值：本章指南的 CVD 事件數與人年（sex=0 每千人年 24.344、sex=1 為 28.127）。`;};
  w.addEventListener('input',e=>{const i=e.target.closest('[data-ra]');if(!i)return;st[i.dataset.ra]=Math.max(0,+i.value||0);draw();});
  w.querySelector('#raR').addEventListener('click',()=>{Object.assign(st,{e1:3612,p1:148374,e2:2399,p2:85292});w.querySelectorAll('[data-ra]').forEach(i=>i.value=st[i.dataset.ra]);draw();});draw();
};

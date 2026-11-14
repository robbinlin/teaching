/* ---------- W12: kmeans 分群與穩定性 ---------- */
W.kmeans=(w)=>{
  const COL=['var(--accent)','var(--amber)','#7A5EA8','var(--ok)','var(--bad)','var(--muted)'];
  let kind='three',seed=1,prev=null,cur=null;
  const mk=k=>{const r=ST.rng(k==='three'?5:9);const P=[];if(k==='three'){[[2.2,2.6],[6.6,3.2],[4.3,7.2]].forEach(c=>{for(let i=0;i<50;i++)P.push([c[0]+ST.rnorm(r)*0.75,c[1]+ST.rnorm(r)*0.75]);});}else for(let i=0;i<150;i++)P.push([4.5+ST.rnorm(r)*1.6,4.9+ST.rnorm(r)*1.6]);return P;};
  const DATA={three:mk('three'),none:mk('none')};
  const defs=[{id:'kmk',label:'群數 k',min:2,max:6,step:1,value:3}];
  w.innerHTML=`<div class="widget-title"><strong>k-means：換一個起點，結果還一樣嗎</strong>${segHTML('kmd',[['three','三個分開的群'],['none','沒有結構']],'three')}</div>
  ${sliders(defs)}<div class="in-row"><button class="btn" type="button" id="kmre">換種子重跑</button><span class="note">模擬資料：150 個點。每次只用一組隨機起點（nstart = 1）。叉號是群中心。</span></div>
  ${SV('0 0 640 340','二維散布圖，顏色代表 k-means 分出的群')}<div id="kmS"></div><p class="readout" id="kmM"></p>`;
  const svg=w.querySelector('svg');
  function km(P,k,sd){const r=ST.rng(sd*7919+k*31+(kind==='three'?1:2));const n=P.length;const pick=[];while(pick.length<k){const i=Math.floor(r()*n);if(!pick.includes(i))pick.push(i);}
    let C=pick.map(i=>P[i].slice());const lab=new Array(n).fill(-1);
    for(let it=0;it<80;it++){let ch=false;for(let i=0;i<n;i++){let b=0,bd=1e18;for(let c=0;c<k;c++){const d=(P[i][0]-C[c][0])**2+(P[i][1]-C[c][1])**2;if(d<bd){bd=d;b=c;}}if(lab[i]!==b){lab[i]=b;ch=true;}}
      if(!ch)break;const S=C.map(()=>[0,0,0]);for(let i=0;i<n;i++){const s=S[lab[i]];s[0]+=P[i][0];s[1]+=P[i][1];s[2]++;}C=C.map((c,j)=>S[j][2]?[S[j][0]/S[j][2],S[j][1]/S[j][2]]:c);}
    /* stable colours: order clusters by centre position */
    const ord=C.map((c,j)=>j).sort((a,b)=>(C[a][0]+C[a][1]*0.3)-(C[b][0]+C[b][1]*0.3));const map=[];ord.forEach((j,i)=>{map[j]=i;});
    const L2=lab.map(l=>map[l]),C2=ord.map(j=>C[j]);let wss=0;for(let i=0;i<n;i++)wss+=(P[i][0]-C2[L2[i]][0])**2+(P[i][1]-C2[L2[i]][1])**2;return{lab:L2,C:C2,wss};}
  function ari(a,b){const n=a.length,ka=Math.max(...a)+1,kb=Math.max(...b)+1;const M=Array.from({length:ka},()=>new Array(kb).fill(0));for(let i=0;i<n;i++)M[a[i]][b[i]]++;const c2=v=>v*(v-1)/2;
    let sij=0,sa=0,sb=0;for(let i=0;i<ka;i++){let r=0;for(let j=0;j<kb;j++){sij+=c2(M[i][j]);r+=M[i][j];}sa+=c2(r);}for(let j=0;j<kb;j++){let c=0;for(let i=0;i<ka;i++)c+=M[i][j];sb+=c2(c);}
    const ex=sa*sb/c2(n),mx=(sa+sb)/2;return mx===ex?1:(sij-ex)/(mx-ex);}
  const draw=()=>{const k=val(w,'kmk'),P=DATA[kind];cur=km(P,k,seed);svg.innerHTML='';const L=40,R=625,T=12,B=300,X=v=>L+v/9*(R-L),Y=v=>B-v/10*(B-T);
    axisY(svg,Y,0,10,L,2,null,'',T);axisX(svg,X,0,9,B,1,null,'',L,R);
    P.forEach((p,i)=>el('circle',{cx:X(p[0]),cy:Y(p[1]),r:4,style:`fill:${COL[cur.lab[i]]};opacity:.75`},svg));
    cur.C.forEach((c,j)=>{const x=X(c[0]),y=Y(c[1]);[[-7,-7,7,7],[-7,7,7,-7]].forEach(d=>el('line',{x1:x+d[0],y1:y+d[1],x2:x+d[2],y2:y+d[3],style:'stroke:var(--ink);stroke-width:3'},svg));});
    const a=prev?ari(prev,cur.lab):null;
    w.querySelector('#kmS').innerHTML=statsHTML([['群數 k',k],['組內平方和',f2(cur.wss,1),'mean'],['與上一次的 ARI',a===null?'—':f2(a,2),'med'],['種子',seed]]);
    const m=w.querySelector('#kmM');
    if(a===null)m.textContent=kind==='none'?`這份資料只有一團，k-means 照樣交出 ${k} 群。按「換種子重跑」，看同一個點會不會被分到同一群。`:`按「換種子重跑」幾次，看分群結果變不變。調整蘭德指數（ARI）等於 1 表示兩次分法完全相同。`;
    else if(kind==='none')m.textContent=a>0.9?`這一次剛好和上一次相近（ARI ${f2(a,2)}）。多按幾次，或把 k 調大，邊界會開始移動。資料沒有結構時，分界線落在哪裡取決於起點。`:`換一個起點，分法就變了：ARI 只有 ${f2(a,2)}。這份資料本來就只有一團，${k} 個群是演算法切出來的。替這些群取名字之前，先確認它們換種子後還在。`;
    else m.textContent=k===3?(a>0.95?`三群分得開，換種子後幾乎一樣（ARI ${f2(a,2)}）。`:(()=>{let best=1e18;for(let s=100;s<110;s++)best=Math.min(best,km(P,k,s).wss);return cur.wss>best*1.2?`這次起點不好，卡在較差的解：組內平方和 ${f2(cur.wss,1)}，好的解約 ${f2(best,1)}（ARI ${f2(a,2)}）。正式分析用 nstart = 25 以上，讓演算法多試幾個起點。`:`上一次卡在較差的解，這一次回到三群（ARI ${f2(a,2)}，組內平方和降到 ${f2(cur.wss,1)}）。只跑一個起點時，就算資料有清楚的群，也可能拿到壞結果。`;})()):`資料有三群，硬切成 ${k} 群${k<3?'會把兩群併在一起':'會把其中一群再切開'}。和上一次的 ARI 是 ${f2(a,2)}；多出來的切法換種子就可能改變。`;};
  segBind(w,'kmd',v=>{kind=v;prev=null;draw();});
  w.querySelector('#kmre').addEventListener('click',()=>{prev=cur?cur.lab:null;seed++;draw();});
  bindSliders(w,defs,()=>{prev=null;draw();});draw();
};

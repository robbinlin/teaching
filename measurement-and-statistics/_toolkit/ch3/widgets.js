/* ===== 第 3 章　描述統計與常態分配：互動工具 =====
   資料：講義表 3-1（65 筆，總和 3143）、表 3-2（10 筆）。統計量都由陣列即時計算，不寫死。 */
const C3D=[48,45,50,49,46,47,47,49,50,50,45,54,51,48,49,46,44,44,52,53,48,43,48,41,48,49,47,49,51,54,51,43,53,45,48,47,51,46,49,50,48,48,45,46,49,48,46,48,52,54,52,50,51,47,45,47,43,47,49,50,44,55,48,50,53];

/* ---------- c3scales：四種測量尺度分類練習 ---------- */
W.c3scales=(w)=>{
  const SC=['名義變項','次序變項','等距變項','比率變項'],OPS=['分類','排序','加減','乘除'],USE=['次數、眾數','中位數、名次','平均數、標準差','平均數、標準差、倍數'];
  const IT=[
    ['球衣背號（5 號、10 號）',0,'背號只是代號，用來認人；10 號不會比 5 號厲害兩倍，連誰大誰小都沒有意義。','影片 EP1'],
    ['比賽結束後的最後排名',1,'排得出誰前誰後，但名次之間差多少比不出來：第 1 名可能只贏 0.1 秒，第 2 名卻贏第 3 名 5 秒。','講義第 4 張'],
    ['溫度（攝氏 10 度、20 度）',2,'每一度的差距一樣大，20 度比 10 度高 10 度；但 0 度不是「沒有溫度」，只是數線上的一個點，所以 20 度不是 10 度的兩倍熱。','講義第 4 張'],
    ['身高（公分）',3,'0 公分就是真的沒有高度，這叫真正零點；有了它，才能說誰是誰的幾倍。','講義第 4 張'],
    ['足球位置（四分衛、邊鋒）',0,'位置只是分類，就算編成 1、2 也只是代號，不能排大小。','講義第 4 張'],
    ['James 的最大攝氧量（50 ml/kg/min）',3,'0 代表完全沒有攝氧，是真正零點；所以可以算平均數和標準差，也可以比倍數。','影片 EP1'],
    ['獎牌（金、銀、銅）',1,'金牌比銀牌好、銀牌比銅牌好，排得出順序；但金與銀的差距不一定等於銀與銅的差距。','自編例子'],
    ['體重（40 公斤、80 公斤）',3,'0 公斤就是真的沒有重量，所以 80 公斤真的是 40 公斤的兩倍。','影片 EP1'],
    ['西元年份（2000 年、2024 年）',2,'兩個年份相減得到相隔幾年，差距有意義；但西元 0 年不是「沒有時間」，不能說 2000 年是 1000 年的兩倍。','自編例子'],
    ['性別（男、女）',0,'只有類別，沒有大小順序，只能數各有幾人。','講義第 4 張']];
  let i=0,picked=null,right=0;const q=id=>w.querySelector('#'+id);
  w.innerHTML=`<div class="widget-title"><strong>這個變項是哪一種尺度？</strong><span class="note" id="c3qN"></span></div>
  <p id="c3qQ" style="margin:0;font-size:18px;font-weight:700"></p>
  <div class="tagrow">${SC.map((s,k)=>`<button type="button" class="tag" data-c3q="${k}" style="font-size:15px;padding:7px 14px">${s}</button>`).join('')}</div>
  <p class="readout" id="c3qM"></p>
  <div class="tbl-wrap"><table class="wtbl" id="c3qT"></table></div>
  <div class="in-row" style="margin:0"><button class="btn" type="button" id="c3qNext">下一題</button><button class="btn" type="button" id="c3qRe">重新開始</button><span class="note" id="c3qS"></span></div>`;
  const draw=()=>{const fin=i>=IT.length,it=fin?null:IT[i],ans=fin?-1:it[1],shown=picked!==null&&!fin;
    q('c3qN').textContent=fin?`共 ${IT.length} 題`:`第 ${i+1} / ${IT.length} 題・${it[3]}`;
    q('c3qQ').textContent=fin?`做完了：${IT.length} 題答對 ${right} 題。`:it[0];
    w.querySelectorAll('[data-c3q]').forEach(b=>{const k=+b.dataset.c3q;b.className='tag'+(shown?(k===ans?' right':k===picked?' wrong':''):'');b.disabled=shown||fin;});
    q('c3qT').innerHTML=`<tr><th>尺度</th>${OPS.map(o=>`<th>${o}</th>`).join('')}<th style="white-space:normal">常用統計量</th></tr>`+SC.map((s,k)=>`<tr><td${shown&&k===ans?' class="hl"':''}>${s}</td>${OPS.map((o,j)=>`<td${shown&&k===ans?' class="hl"':''}>${j<=k?'可':'—'}</td>`).join('')}<td${shown&&k===ans?' class="hl"':''} style="white-space:normal">${USE[k].split('、').map(t=>`<span style="white-space:nowrap">${t}</span>`).join('、')}</td></tr>`).join('');
    q('c3qM').textContent=fin?(right===IT.length?'全部答對。':'答錯的題目按「重新開始」再做一次。')+'判斷時依序問：能不能排大小？差距是不是一樣大？0 是不是「真的沒有」？三個問題各往上爬一階。'
      :!shown?'依序問三件事：能不能排大小？差距是不是一樣大？0 是不是「真的沒有」？選一個尺度。'
      :`${picked===ans?'答對了。':'不對，這是'+SC[ans]+'。'}${it[2]}這個尺度可以做：${OPS.slice(0,ans+1).join('、')}${ans<3?'；不能做：'+OPS.slice(ans+1).join('、'):''}。`;
    q('c3qNext').hidden=fin;q('c3qNext').disabled=!shown;q('c3qNext').textContent=i===IT.length-1?'看結果':'下一題';
    q('c3qS').textContent=fin?'':`已答對 ${right} 題`;};
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c3q]');if(b&&picked===null&&i<IT.length){picked=+b.dataset.c3q;if(picked===IT[i][1])right++;draw();}});
  q('c3qNext').addEventListener('click',()=>{if(picked===null)return;i++;picked=null;draw();});
  q('c3qRe').addEventListener('click',()=>{i=0;picked=null;right=0;draw();});
  draw();
};

/* ---------- c3central：直方圖＋平均數、中位數、眾數＋極端值 ---------- */
W.c3central=(w)=>{
  const D=C3D,m0=ST.mean(D),q=id=>w.querySelector('#'+id);
  const defs=[{id:'c3cn',label:'加入幾位新同學',min:0,max:5,step:1,value:0,fmt:v=>v+' 位'},{id:'c3cx',label:'新同學的分數',min:20,max:90,step:1,value:70,fmt:v=>v+' 分'}];
  w.innerHTML=`<div class="widget-title"><strong>65 位同學的最大攝氧量（表 3-1）</strong><span class="note">加入極端值，看哪個數被拉走</span></div>
  <div class="in-row" style="margin:0"><button class="btn" type="button" data-c3c="1,70">加 1 位 70 分</button><button class="btn" type="button" data-c3c="3,25">加 3 位 25 分</button><button class="btn" type="button" data-c3c="0,70">講義資料</button></div>
  ${sliders(defs)}${SV('0 0 480 250','最大攝氧量直方圖，標出平均數、中位數與眾數')}
  <div class="legend"><span><i style="background:var(--mustard)"></i>眾數（最高的長條）</span><span><i style="background:var(--accent)"></i>平均數（虛線）</span><span><i style="background:var(--amber)"></i>中位數（實線）、新同學（長條）</span></div>
  <div id="c3cS"></div><p class="readout" id="c3cM"></p><p class="note" style="margin:0">原始 65 筆出自講義表 3-1；新同學是自編例子，用來示範極端值。</p>`;
  const svg=w.querySelector('svg');
  const med=a=>{const s=a.slice().sort((p,r)=>p-r),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;};
  const modes=a=>{const c={};a.forEach(v=>{c[v]=(c[v]||0)+1;});const mx=Math.max(...Object.values(c));return[Object.keys(c).filter(k=>c[k]===mx).map(Number).sort((p,r)=>p-r),mx];};
  const cnt={};D.forEach(v=>{cnt[v]=(cnt[v]||0)+1;});
  const tr=v=>String(+(+v).toFixed(2));
  const draw=()=>{const n=val(w,'c3cn'),e=val(w,'c3cx'),xs=D.concat(Array(n).fill(e)),mean=ST.mean(xs),md=med(xs),[mo,mc]=modes(xs),sum=xs.reduce((s,v)=>s+v,0);
    svg.innerHTML='';const L=34,R=470,T=34,B=206,lo=Math.min(40,n?e-1:40)-0.5,hi=Math.max(56,n?e+1:56)+0.5,ymax=Math.ceil((Math.max(mc,11)+1)/2)*2;
    const x=v=>L+(v-lo)/(hi-lo)*(R-L),y=v=>B-v/ymax*(B-T),bw=(R-L)/(hi-lo);
    axisY(svg,y,0,ymax,L,ymax>12?4:2,null,'',T);el('text',{x:4,y:14,'text-anchor':'start'},svg).textContent='人數';
    for(let v=Math.ceil(lo);v<=Math.floor(hi);v++){const c=cnt[v]||0,ce=n&&v===e?n:0;
      if(c){const r=el('rect',{x:x(v-0.5)+0.5,y:y(c),width:Math.max(1,bw-1),height:B-y(c),class:mo.includes(v)?'must':'bar'},svg);el('title',{},r).textContent=`${v} 分：${c} 人`;}
      if(ce){const r=el('rect',{x:x(v-0.5)+0.5,y:y(c+ce),width:Math.max(1,bw-1),height:y(c)-y(c+ce),class:'bar2'},svg);el('title',{},r).textContent=`新同學 ${v} 分：${ce} 人`;}}
    axisX(svg,x,lo,hi,B,niceStep(hi-lo,8),null,'最大攝氧量（ml/kg/min）',L,R);
    const xm=x(mean),xd=x(md),rt=mean>=md;
    el('line',{x1:xd,x2:xd,y1:T-14,y2:B,class:'median'},svg);el('line',{x1:xm,x2:xm,y1:T-14,y2:B,class:'mean'},svg);
    el('text',{x:xm+(rt?5:-5),y:T-18,'text-anchor':rt?'start':'end',class:'meanlab'},svg).textContent='平均數 '+f2(mean);
    el('text',{x:xd+(rt?-5:5),y:T-18,'text-anchor':rt?'end':'start',class:'medlab'},svg).textContent='中位數 '+tr(md);
    const dm=mean-md;
    q('c3cS').innerHTML=statsHTML([['人數 N',xs.length],['總和',sum.toLocaleString()],['平均數',f2(mean),'mean'],['中位數',tr(md),'med'],['眾數',mo.join('、')+'（'+mc+' 次）'],['平均數 − 中位數',(dm<0?'−':'＋')+f2(Math.abs(dm))]]);
    const d0=mean-m0,up=e>55;
    q('c3cM').textContent=!n?`講義資料：平均數 ${f2(mean)}、中位數 ${tr(md)}、眾數 ${mo.join('、')}（${mc} 次）幾乎一樣，直方圖左右大致對稱，接近常態分配。加入新同學，看哪一個數被拉走。`
      :(e>55||e<41)?`加入 ${n} 位 ${e} 分的同學：平均數從 ${f2(m0)} 被拉到 ${f2(mean)}（${up?'＋':'−'}${f2(Math.abs(d0))}），中位數${md===48?'還是 48':'只從 48 變成 '+tr(md)}，眾數是 ${mo.join('、')}。${up?'右':'左'}邊拖出一條尾巴，這是${up?'正':'負'}偏：平均數${up?'大':'小'}於中位數。`
      :`新同學的 ${e} 分落在原本的範圍（41 到 55）裡，不算極端值：平均數 ${f2(mean)}、中位數 ${tr(md)}，幾乎沒動。把分數拉到 60 以上或 40 以下再看。`;};
  w.addEventListener('click',ev=>{const b=ev.target.closest('[data-c3c]');if(!b)return;const [n,e]=b.dataset.c3c.split(',');[['c3cx',e],['c3cn',n]].forEach(([id,v])=>{const s=q(id);s.value=v;s.dispatchEvent(new Event('input'));});});
  bindSliders(w,defs,draw);draw();
};

/* ---------- c3spread：離均差、離均差平方、除以 N 或 N−1 ---------- */
W.c3spread=(w)=>{
  const PRE={t32:[3,1,2,2,4,5,1,4,3,5],t31:C3D,a:[8,8,8,8,8],b:[10,6,10,4,10]};
  const q=id=>w.querySelector('#'+id);let div='n';
  const nf=v=>{const r=Math.round(v*100)/100;return(r<0?'−':'')+(Number.isInteger(r)?String(Math.abs(r)):Math.abs(r).toFixed(2));};
  w.innerHTML=`<div class="widget-title"><strong>變異數與標準差：一欄一欄算</strong>${segHTML('c3sd',[['n','除以 N'],['n1','除以 N−1']],'n')}</div>
  <div class="in-row" style="margin:0"><span class="note">資料：</span><button class="btn" type="button" data-c3s="t32">表 3-2（講義）</button><button class="btn" type="button" data-c3s="t31">表 3-1（65 人）</button><button class="btn" type="button" data-c3s="a">射箭選手甲</button><button class="btn" type="button" data-c3s="b">射箭選手乙</button></div>
  <textarea class="nums" id="c3sT" aria-label="分數，用空白或逗號分開" spellcheck="false">${PRE.t32.join(' ')}</textarea>
  ${SV('0 0 480 158','每個分數的點圖，標出平均數與正負一個標準差')}
  <div class="legend" id="c3sL"></div>
  <div class="tbl-wrap"><table class="wtbl" id="c3sB"></table></div>
  <p class="formula" id="c3sF"></p><div id="c3sS"></div><p class="readout" id="c3sM"></p>
  <p class="note" style="margin:0">上面的數字可以直接改，也可以貼上自己的資料（用空白或逗號分開）。兩位射箭選手是影片 EP3 的自編例子。</p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const xs=q('c3sT').value.replace(/−/g,'-').split(/[^0-9.\-]+/).map(parseFloat).filter(Number.isFinite);
    svg.innerHTML='';
    if(xs.length<2){q('c3sB').innerHTML='';q('c3sF').textContent='';q('c3sS').innerHTML='';q('c3sL').innerHTML='';q('c3sM').textContent='至少要有 2 個數字才能算變異數。數字之間用空白或逗號分開。';return;}
    const N=xs.length,sum=xs.reduce((s,v)=>s+v,0),M=sum/N,dev=xs.map(v=>v-M),ss=dev.reduce((s,v)=>s+v*v,0),den=div==='n'?N:N-1,va=ss/den,sd=Math.sqrt(va),mn=Math.min(...xs),mx=Math.max(...xs);
    const L=24,R=462,T=30,B=118,pad=Math.max(1,(mx-mn)*0.08),lo=Math.min(mn,M-sd)-pad,hi=Math.max(mx,M+sd)+pad,x=v=>L+(v-lo)/(hi-lo)*(R-L);
    const grp={};xs.forEach(v=>{const k=v.toFixed(4);grp[k]=(grp[k]||0)+1;});const r=Math.min(7,(B-T-6)/(2*Math.max(...Object.values(grp))));
    if(sd>0)el('rect',{x:x(M-sd),y:T,width:x(M+sd)-x(M-sd),height:B-T,class:'area-r'},svg);
    const seen={};xs.forEach(v=>{const k=v.toFixed(4);seen[k]=(seen[k]||0)+1;el('circle',{cx:x(v),cy:B-r-(seen[k]-1)*2*r-1,r:Math.max(1.5,r-0.7),class:'pt'},svg);});
    el('line',{x1:x(M),x2:x(M),y1:T-8,y2:B,class:'mean'},svg);el('text',{x:x(M),y:T-13,'text-anchor':'middle',class:'meanlab'},svg).textContent='平均數 '+nf(M);
    axisX(svg,x,lo,hi,B,niceStep(hi-lo,8),null,'分數',L,R);
    q('c3sL').innerHTML=`<span><i style="background:var(--accent)"></i>一個點是一個分數</span><span><i style="background:var(--amber);opacity:.35"></i>平均數 ± 1 個標準差${sd>0?`（${nf(M-sd)} 到 ${nf(M+sd)}）`:'（標準差是 0）'}</span>`;
    const show=N<=12?N:10;let h='<tr><th>分數 X</th><th>平均數 M</th><th>離均差 X − M</th><th>離均差平方</th></tr>';
    for(let i=0;i<show;i++)h+=`<tr><td>${nf(xs[i])}</td><td>${nf(M)}</td><td>${nf(dev[i])}</td><td>${nf(dev[i]*dev[i])}</td></tr>`;
    if(show<N)h+=`<tr><td colspan="4" style="text-align:center;color:var(--muted)">其餘 ${N-show} 筆省略；總計列包含全部 ${N} 筆</td></tr>`;
    h+=`<tr class="sum"><td>總計 ${nf(sum)}</td><td></td><td>${nf(dev.reduce((s,v)=>s+v,0))}</td><td class="hl">${nf(ss)}</td></tr>`;q('c3sB').innerHTML=h;
    q('c3sF').innerHTML=`變異數 = <b>${nf(ss)}</b> ÷ <i>${den}</i> = ${nf(va)}<br>標準差 = √${nf(va)} = ${nf(sd)}`;
    q('c3sS').innerHTML=statsHTML([['人數 N',N],['平均數 M',nf(M),'mean'],['全距（最大−最小）',nf(mx-mn)],['離均差平方和',nf(ss)],['變異數',nf(va)],['標準差',nf(sd),'med']]);
    const o=div==='n'?N-1:N,vo=ss/o;
    q('c3sM').textContent=ss<1e-12?`每個分數都等於平均數 ${nf(M)}，離均差全是 0，所以變異數和標準差都是 0：完全沒有分散。`
      :`現在除以 ${div==='n'?`N＝${N}（把這 ${N} 個分數當成全部的人）`:`N−1＝${N-1}（把這 ${N} 個分數當成樣本；SPSS 和 Excel 的 STDEV.S 用這一種）`}：變異數 ${nf(va)}、標準差 ${nf(sd)}，也就是分數離平均數大約 ${nf(sd)}。改成除以 ${div==='n'?'N−1＝'+(N-1):'N＝'+N} 會是 ${nf(vo)}、${nf(Math.sqrt(vo))}；${N>=30?'人數多，兩種算法差很少':'人數少，兩種算法差得比較多'}。`;};
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c3s]');if(b){q('c3sT').value=PRE[b.dataset.c3s].join(' ');draw();}});
  q('c3sT').addEventListener('input',draw);segBind(w,'c3sd',v=>{div=v;draw();});draw();
};

/* ---------- c3zt：原始分數、z 分數、T 分數三把尺 ---------- */
W.c3zt=(w)=>{
  const m0=ST.mean(C3D),s0=ST.sd(C3D),q=id=>w.querySelector('#'+id);let mu=m0,sg=s0,x=50,u=' ml/kg/min';
  const inp=(id,v,lab)=>`<label for="${id}"><span>${lab}</span><input class="num-in" type="number" id="${id}" value="${v}" step="any" inputmode="decimal"></label>`;
  w.innerHTML=`<div class="widget-title"><strong>標準分數：拿標準差當尺</strong><span class="note">三個分數連動，改哪一個都可以</span></div>
  <div class="in-row" style="margin:0">${inp('c3zm','48.35','平均數')}${inp('c3zs','3.05','標準差')}<span class="note">範例：</span><button class="btn" type="button" data-c3z="j">65 位同學與 James</button><button class="btn" type="button" data-c3z="f">圖 3-6（平均數 60、標準差 5）</button></div>
  <div class="in-row" style="margin:0">${inp('c3zx','50','原始分數')}${inp('c3zz','0.54','z 分數')}${inp('c3zt','55.4','T 分數')}</div>
  <div class="slider-row"><label for="c3zr"><span>拖動原始分數<b id="c3zr-v"></b></span><input type="range" id="c3zr" min="-3.5" max="3.5" step="0.01" value="0.54"></label></div>
  ${SV('0 0 480 182','原始分數、z 分數、T 分數對照的尺')}
  <p class="formula" id="c3zF"></p><div id="c3zS"></div><p class="readout" id="c3zM"></p>`;
  const svg=w.querySelector('svg'),tr=(v,d=2)=>String(+(+v).toFixed(d)),sn=s=>s.replace('-','−');
  const draw=(src)=>{const z=(x-mu)/sg,zr=Math.round(z*100)/100,T=50+10*zr,zs=sn(zr.toFixed(2)),dx=(+tr(x))-(+tr(mu));
    if(src!=='x')q('c3zx').value=tr(x);if(src!=='z')q('c3zz').value=zr.toFixed(2);if(src!=='t')q('c3zt').value=T.toFixed(1);
    if(src!=='r')q('c3zr').value=Math.max(-3.5,Math.min(3.5,z));q('c3zr-v').textContent=tr(x)+u;
    svg.innerHTML='';const L=76,R=468,Y=78,X=v=>L+(v+3.5)/7*(R-L),zc=Math.max(-3.5,Math.min(3.5,z));
    const allInt=Number.isInteger(mu)&&Number.isInteger(sg);
    el('line',{x1:L,x2:R,y1:Y,y2:Y,class:'axis'},svg);
    [['原始分數',100],['z 分數',122],['T 分數',144]].forEach(([t,yy])=>{el('text',{x:4,y:yy,'text-anchor':'start',style:'fill:var(--ink)'},svg).textContent=t;});
    for(let k=-3;k<=3;k++){el('line',{x1:X(k),x2:X(k),y1:Y-5,y2:Y+5,class:'axis'},svg);
      el('text',{x:X(k),y:100,'text-anchor':'middle'},svg).textContent=allInt?String(mu+k*sg):(mu+k*sg).toFixed(2);
      el('text',{x:X(k),y:122,'text-anchor':'middle'},svg).textContent=k===0?'0':(k>0?'+':'−')+Math.abs(k);
      el('text',{x:X(k),y:144,'text-anchor':'middle'},svg).textContent=50+10*k;}
    el('line',{x1:X(0),x2:X(0),y1:36,y2:Y,class:'dash'},svg);
    if(zc!==0)el('line',{x1:X(0),x2:X(zc),y1:Y-10,y2:Y-10,class:'ln2'},svg);
    el('line',{x1:X(zc),x2:X(zc),y1:26,y2:Y+6,class:'zline'},svg);
    el('text',{x:Math.max(84,Math.min(396,X(zc))),y:16,'text-anchor':'middle',style:'fill:var(--ink);font-weight:500'},svg).textContent=`${tr(x)} 分：z = ${zs}，T = ${T.toFixed(1)}`;
    el('line',{x1:X(0),x2:X(1),y1:166,y2:166,class:'lnm'},svg);[0,1].forEach(k=>el('line',{x1:X(k),x2:X(k),y1:161,y2:171,class:'lnm'},svg));
    el('text',{x:X(1)+8,y:170,'text-anchor':'start'},svg).textContent='1 個標準差 = '+tr(sg);
    q('c3zF').innerHTML=`z = (<b>${tr(x)}</b> − ${tr(mu)}) ÷ ${tr(sg)} = <i>${zs}</i><br>T = 50 + 10 × ${zr<0?'('+zs+')':zs} = <i>${T.toFixed(1)}</i>`;
    q('c3zS').innerHTML=statsHTML([['離平均數',(dx<0?'−':'＋')+tr(Math.abs(dx))],['z 分數',zs,'mean'],['T 分數',T.toFixed(1),'med'],['平均數',tr(mu)],['標準差',tr(sg)]]);
    q('c3zM').textContent=(zr===0?`${tr(x)} 分幾乎就是平均數：z＝0、T＝50。`
      :`${tr(x)} 分比平均數 ${tr(mu)} ${z>0?'高':'低'} ${tr(Math.abs(dx))}，等於 ${Math.abs(zr).toFixed(2)} 個標準差，所以 z＝${zs}、T＝${T.toFixed(1)}。z 是${z>0?'正':'負'}的代表${z>0?'高':'低'}於平均。`)
      +(Math.abs(z)>3.5?'這個分數超出圖的範圍，標記停在邊緣。':'換算只用到平均數和標準差，不需要假設常態分配。');};
  const num=id=>{const v=parseFloat(q(id).value);return Number.isFinite(v)?v:null;};
  q('c3zm').addEventListener('input',()=>{const v=num('c3zm');if(v!==null){mu=v;draw();}});
  q('c3zs').addEventListener('input',()=>{const v=num('c3zs');if(v!==null&&v>0){sg=v;draw();}});
  q('c3zx').addEventListener('input',()=>{const v=num('c3zx');if(v!==null){x=v;draw('x');}});
  q('c3zz').addEventListener('input',()=>{const v=num('c3zz');if(v!==null){x=mu+v*sg;draw('z');}});
  q('c3zt').addEventListener('input',()=>{const v=num('c3zt');if(v!==null){x=mu+(v-50)/10*sg;draw('t');}});
  q('c3zr').addEventListener('input',()=>{x=+(mu+(+q('c3zr').value)*sg).toFixed(1);draw('r');});
  ['c3zx','c3zz','c3zt'].forEach(id=>q(id).addEventListener('change',()=>draw()));
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c3z]');if(!b)return;if(b.dataset.c3z==='j'){mu=m0;sg=s0;u=' ml/kg/min';}else{mu=60;sg=5;u=' ml/kg/min';}x=50;q('c3zm').value=tr(mu);q('c3zs').value=tr(sg);draw();});
  draw();
};

/* ---------- c3normal：常態曲線面積（依 gen2 的 W.normal 改寫，查法與表 3-4 一致） ---------- */
W.c3normal=(w)=>{
  const m0=ST.mean(C3D),s0=ST.sd(C3D),q=id=>w.querySelector('#'+id);
  const PRE={j:{mu:m0,sg:s0,a:50,b:55,u:' ml/kg/min'},z:{mu:0,sg:1,a:1,b:1.5,u:''}};
  let mode='le',mu=m0,sg=s0,a=50,b=55,pc=90,u=' ml/kg/min';
  const inp=(id,v,lab,extra='')=>`<label for="${id}"><span>${lab}</span><input class="num-in" type="number" id="${id}" value="${v}" step="any" inputmode="decimal"${extra}></label>`;
  w.innerHTML=`<div class="widget-title"><strong>常態曲線下的面積</strong>${segHTML('c3nm',[['le','低於 a'],['ge','高於 a'],['bt','a 到 b'],['pc','百分位']],'le')}</div>
  <div class="in-row" style="margin:0">${inp('c3nmu','48.35','平均數')}${inp('c3nsg','3.05','標準差',' min="0"')}<span class="note">範例：</span><button class="btn" type="button" data-c3np="j">James 的 VO₂max</button><button class="btn" type="button" data-c3np="z">標準常態 Z</button></div>
  <div class="in-row" style="margin:0"><span id="c3nA">${inp('c3na','50','分數 a')}</span><span id="c3nB" hidden>${inp('c3nb','55','分數 b')}</span><span id="c3nP" hidden>${inp('c3npc','90','百分位 %',' min="0.01" max="99.99"')}</span><span id="c3nQ" hidden><button class="btn" type="button" data-c3nk="1">平均數 ± 1 個標準差</button> <button class="btn" type="button" data-c3nk="2">± 2 個</button> <button class="btn" type="button" data-c3nk="3">± 3 個</button></span><span class="note" id="c3nH"></span></div>
  ${SV('0 0 480 222','常態曲線與塗色的面積')}<p class="formula" id="c3nF"></p><div id="c3nS"></div><p class="readout" id="c3nM"></p>
  <p class="note" style="margin:0">面積的查法和表 3-4 相同：z 取到小數第 2 位，表上的數字是「平均數到 z」之間的面積（%）。</p>`;
  const svg=w.querySelector('svg'),L=16,R=464,T=14,B=180;
  const dec=()=>sg>=10?1:sg>=1?2:3,fx=v=>(+v).toFixed(dec()).replace('-','−'),fa=v=>String(+(+v).toFixed(dec())).replace('-','−'),rz=v=>Math.round(v*100)/100,r2=v=>Math.round(v*100)/100;
  const A=z=>Math.round((ST.pnorm(Math.abs(z))-0.5)*10000)/100,pct=v=>v.toFixed(2)+'%',zs=z=>(z<0?'−':'')+Math.abs(z).toFixed(2),Ts=z=>(50+10*z).toFixed(1);
  const sync=()=>{q('c3na').value=+a.toFixed(4);q('c3nb').value=+b.toFixed(4);q('c3npc').value=+pc.toFixed(4);};
  const draw=()=>{const lo=mu-4*sg,hi=mu+4*sg,x=v=>L+(v-lo)/(hi-lo)*(R-L),f=v=>ST.dnorm((v-mu)/sg),y=v=>B-v/f(mu)*(B-T),cl=v=>Math.min(Math.max(v,lo),hi);
    q('c3nB').hidden=mode!=='bt';q('c3nQ').hidden=mode!=='bt';q('c3nP').hidden=mode!=='pc';q('c3nA').hidden=mode==='pc';
    svg.innerHTML='';const za=rz((a-mu)/sg),zb=rz((b-mu)/sg),isJ=Math.abs(mu-m0)<0.005&&Math.abs(sg-s0)<0.005;let P,cuts=[],items,msg,fm;
    if(mode==='le'){P=r2(za>=0?50+A(za):50-A(za));curveArea(svg,x,y,f,lo,cl(a),'area-p');cuts=[a];
      fm=`低於 ${fa(a)}：50% ${za>=0?'+':'−'} <b>${pct(A(za))}</b> = <i>${pct(P)}</i>`;
      items=[['低於 '+fa(a),pct(P),'mean'],['z 分數',zs(za)],['T 分數',Ts(za),'med'],['平均數到 z',pct(A(za))],['高於 '+fa(a),pct(r2(100-P))]];
      msg=`${fa(a)}${u} 比平均數${za>=0?'高':'低'} ${Math.abs(za).toFixed(2)} 個標準差。平均數到 z＝${zs(za)} 之間的面積是 ${pct(A(za))}，${za>=0?'加上平均數以下的 50%':'用平均數以下的 50% 減掉它'}，低於這個分數的人占 ${pct(P)}。${isJ&&a===50?'這就是影片說的「James 大約贏過七成的人」；前提是分數接近常態分配，表 3-1 實際是 65 人中 43 人低於 50。':'前提是分數接近常態分配。'}`;}
    if(mode==='ge'){P=r2(za>=0?50-A(za):50+A(za));curveArea(svg,x,y,f,cl(a),hi,'area-p');cuts=[a];
      fm=`高於 ${fa(a)}：50% ${za>=0?'−':'+'} <b>${pct(A(za))}</b> = <i>${pct(P)}</i>`;
      items=[['高於 '+fa(a),pct(P),'mean'],['z 分數',zs(za)],['T 分數',Ts(za),'med'],['平均數到 z',pct(A(za))],['低於 '+fa(a),pct(r2(100-P))]];
      msg=`高於 ${fa(a)}${u} 的面積是 ${pct(P)}${P>0&&P<50?`：大約每 ${Math.round(100/P).toLocaleString()} 人中有 1 人超過這個分數`:''}。前提是分數接近常態分配。`;}
    if(mode==='bt'){const l=Math.min(a,b),h=Math.max(a,b),zl=rz((l-mu)/sg),zh=rz((h-mu)/sg),same=zl*zh>=0,big=Math.max(A(zl),A(zh)),sml=Math.min(A(zl),A(zh));
      P=r2(same?big-sml:big+sml);curveArea(svg,x,y,f,cl(l),cl(h),'area-p');cuts=[a,b];
      fm=`${fa(l)} 到 ${fa(h)}：<b>${pct(same?big:A(zl))}</b> ${same?'−':'+'} <b>${pct(same?sml:A(zh))}</b> = <i>${pct(P)}</i>`;
      items=[[fa(l)+' 到 '+fa(h),pct(P),'mean'],['z（左）',zs(zl)],['z（右）',zs(zh)],['區間以外',pct(r2(100-P))]];
      const k=Math.abs(zh);
      msg=(!same&&zl===-zh&&(k===1||k===2||k===3))?`平均數加減 ${k} 個標準差之間占 ${pct(P)}，就是 68–95–99.7 裡的${['','第一','第二','第三'][k]}個數（不四捨五入的精確值是 68.27%、95.45%、99.73%）。`
        :same?`兩個分數在平均數的同一邊：把兩個「平均數到 z」的面積相減，z＝${zs(zl)} 到 z＝${zs(zh)} 之間占 ${pct(P)}。`
        :`兩個分數在平均數的兩邊：把兩塊「平均數到 z」的面積相加，共 ${pct(P)}。`;}
    if(mode==='pc'){const z=rz(ST.qnorm(pc/100)),xv=mu+z*sg;P=pc;curveArea(svg,x,y,f,lo,cl(xv),'area-q');cuts=[xv];
      fm=`分數 = ${fx(mu)} ${z<0?'−':'+'} ${Math.abs(z).toFixed(2)} × ${fx(sg)} = <i>${fx(xv)}</i>`;
      items=[['第 '+(+pc.toFixed(2))+' 百分位',fx(xv),'mean'],['z 分數',zs(z)],['T 分數',Ts(z),'med']];
      msg=`要贏過 ${+pc.toFixed(2)}% 的人，z 要到 ${zs(z)}，換回原始分數是 ${fx(xv)}${u}，T 分數 ${Ts(z)}。這是反過來查表：先找面積，再讀 z。`;}
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
    for(let k=-3;k<=3;k++){const xv=mu+k*sg;el('line',{x1:x(xv),x2:x(xv),y1:B,y2:B+4,class:'axis'},svg);el('text',{x:x(xv),y:B+17,'text-anchor':'middle'},svg).textContent=fx(xv);el('text',{x:x(xv),y:B+32,'text-anchor':'middle'},svg).textContent=k===0?'z=0':'z='+(k>0?'+':'−')+Math.abs(k);}
    curve(svg,x,y,f,lo,hi,'curve');el('line',{x1:x(mu),x2:x(mu),y1:T,y2:B,class:'mean'},svg);
    cuts.forEach(c=>{const cx=Math.min(Math.max(x(c),L),R);el('line',{x1:cx,x2:cx,y1:T,y2:B,class:'zline'},svg);});
    q('c3nS').innerHTML=statsHTML(items);q('c3nF').innerHTML=fm;q('c3nM').textContent=msg;q('c3nH').textContent=mode==='pc'?'輸入百分位，或直接點曲線':'輸入分數，或直接點曲線';
    svg._x=v=>lo+(v-L)/(R-L)*(hi-lo);};
  const num=id=>{const v=parseFloat(q(id).value);return Number.isFinite(v)?v:null;};
  q('c3nmu').addEventListener('input',()=>{const v=num('c3nmu');if(v!==null){mu=v;draw();}});
  q('c3nsg').addEventListener('input',()=>{const v=num('c3nsg');if(v!==null&&v>0){sg=v;draw();}});
  q('c3na').addEventListener('input',()=>{const v=num('c3na');if(v!==null){a=v;draw();}});
  q('c3nb').addEventListener('input',()=>{const v=num('c3nb');if(v!==null){b=v;draw();}});
  q('c3npc').addEventListener('input',()=>{const v=num('c3npc');if(v!==null&&v>0&&v<100){pc=v;draw();}});
  ['c3na','c3nb','c3npc'].forEach(id=>q(id).addEventListener('change',sync));
  w.addEventListener('click',e=>{const pb=e.target.closest('[data-c3np]');if(pb){({mu,sg,a,b,u}=PRE[pb.dataset.c3np]);q('c3nmu').value=+mu.toFixed(2);q('c3nsg').value=+sg.toFixed(2);sync();draw();return;}
    const kb=e.target.closest('[data-c3nk]');if(kb){const k=+kb.dataset.c3nk;a=+(mu-k*sg).toFixed(4);b=+(mu+k*sg).toFixed(4);sync();draw();}});
  svg.addEventListener('click',e=>{const r=svg.getBoundingClientRect(),vx=(e.clientX-r.left)/r.width*480;if(vx<L||vx>R)return;const v=+svg._x(vx).toFixed(sg>=1?1:2);
    if(mode==='pc'){pc=Math.min(99.99,Math.max(0.01,+(ST.pnorm((v-mu)/sg)*100).toFixed(1)));}
    else if(mode==='bt'){if(Math.abs(v-a)<=Math.abs(v-b))a=v;else b=v;}else a=v;sync();draw();});
  svg.style.cursor='crosshair';
  segBind(w,'c3nm',v=>{mode=v;draw();});draw();
};

/* ===== 第 7 章　效標參照的信度與效度：互動工具 ===== */

/* ---------- c7method：這是哪一種訂標準的方法？（分類練習，講義第 5、6 張） ---------- */
W.c7method=(w)=>{
  const OPT=[['judge','判斷法'],['norm','常態法'],['emp','實證法'],['mix','綜合法']];
  const HINT={judge:'這一題的標準是誰說了算？沒有拿資料來對，靠的是專業經驗。',norm:'這一題的線是從「一群人的分數分布」裡找出來的。',emp:'這一題有一個外在的結果（效標）可以對照，線是照那個結果訂的。',mix:'這一題用的資訊不只一種。'};
  const Q=[
    {t:'高中排球教練規定：10 個上手發球要有 8 球落在界內，才算達到大學代表隊比賽的發球標準。',a:'judge',s:'講義第 5 張、影片 EP1',e:'標準來自教練的背景和經驗，反映的是專家認為適當的水準，這是判斷法。'},
    {t:'大學入學考試的目的是預測大學學習能不能成功，所以拿大學的學習成績當效標，回頭訂入學考試的標準。',a:'emp',s:'講義第 6 張、影片 EP1',e:'分數是根據外在的資料（大學學習成績）訂出來的，這是實證法。講義說它是最不獨斷的方法。'},
    {t:'拿常模參照的資料來設定標準：先看一大群人的分數怎麼分布，再從分布裡挑一個位置當及格線。',a:'norm',s:'講義第 5 張',e:'用常模資料訂標準，講義稱為常態法。'},
    {t:'把專家意見、先前經驗、實證資料和常模全部拿來一起考慮，再決定分界分數。',a:'mix',s:'講義第 6 張',e:'使用所有可獲得的資源，就是綜合法。'},
    {t:'游泳教練依多年帶隊的經驗規定：能連續游完 200 公尺，才可以進深水區練習。',a:'judge',s:'自編例子',e:'沒有拿資料來對，靠的是教練的專業判斷，所以是判斷法。'},
    {t:'學校把全年級立定跳遠成績的第 25 百分位數訂為及格線。',a:'norm',s:'自編例子',e:'及格線是從全年級的分數分布（常模資料）裡找出來的，是常態法。這樣訂的線，永遠會有大約四分之一的人不及格。'},
    {t:'研究者追蹤一批成年人多年，找出最大攝氧量低於多少時，日後得到心血管疾病的比例明顯升高，把那個數值訂為健康體適能的標準。',a:'emp',s:'自編例子',e:'標準是對照外在的結果（日後有沒有生病）訂出來的，是實證法。'},
    {t:'委員會先看全國常模和健康追蹤研究的結果，再請專家開會討論，最後才定出各年齡的體適能標準。',a:'mix',s:'自編例子',e:'常模、實證資料、專家判斷都用上了，是綜合法。'}];
  let i=0,res=Q.map(()=>null),done=false;
  w.innerHTML=`<div class="widget-title"><strong>這條及格線是用哪一種方法訂的？</strong><div class="controls"><button class="btn" type="button" id="c7mRs">從第 1 題重來</button></div></div>
  <p class="note" id="c7mN" style="margin:0"></p>
  <p id="c7mQ" style="margin:0;font-size:15px;line-height:1.75"></p>
  <div class="tagrow" id="c7mO">${OPT.map(([k,l])=>`<button type="button" class="tag" data-c7m="${k}">${l}</button>`).join('')}</div>
  <p class="readout" id="c7mM"></p>
  <div class="in-row" style="margin:0"><button class="btn" type="button" id="c7mNx">下一題</button></div>
  ${SV('0 0 640 40','八題的作答紀錄')}<div id="c7mS"></div>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;
  const strip=()=>{svg.innerHTML='';const VW=nar()?400:640;svg.setAttribute('viewBox','0 0 '+VW+' 40');Q.forEach((_,j)=>{const cx=22+j*(VW-44)/(Q.length-1);el('circle',{cx,cy:16,r:11,style:`fill:${res[j]===true?'var(--ok)':res[j]===false?'var(--bad)':'var(--soft)'};stroke:${j===i?'var(--ink)':'var(--line)'};stroke-width:${j===i?2.4:1}`},svg);const t=el('text',{x:cx,y:38,'text-anchor':'middle'},svg);t.textContent=j+1;});
    const n=res.filter(v=>v!==null).length,ok=res.filter(v=>v===true).length;
    q('c7mS').innerHTML=statsHTML([['已作答',n+' ／ '+Q.length],['第一次就答對',ok,'mean'],['第一次答錯',n-ok,'med']]);};
  const show=()=>{done=false;const it=Q[i];q('c7mN').textContent=`第 ${i+1} 題／共 ${Q.length} 題　出處：${it.s}`;q('c7mQ').textContent=it.t;
    w.querySelectorAll('[data-c7m]').forEach(b=>{b.classList.remove('right','wrong');b.disabled=false;});
    q('c7mM').textContent='先問自己：這條線的依據是專家的經驗、一群人的分數分布，還是一個外在的結果？想好再點一個選項。';
    q('c7mNx').disabled=true;q('c7mNx').textContent=i===Q.length-1?'回到第 1 題':'下一題';strip();};
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c7m]');
    if(b){if(done)return;const it=Q[i],k=b.dataset.c7m;
      if(k===it.a){b.classList.add('right');if(res[i]===null)res[i]=true;done=true;w.querySelectorAll('[data-c7m]').forEach(x=>{if(x!==b)x.disabled=true;});q('c7mM').textContent='答對了。'+it.e;q('c7mNx').disabled=false;}
      else{b.classList.add('wrong');if(res[i]===null)res[i]=false;q('c7mM').textContent='不是這一種，再想想。'+HINT[it.a];}
      strip();return;}
    if(e.target.closest('#c7mNx')){i=(i+1)%Q.length;show();return;}
    if(e.target.closest('#c7mRs')){i=0;res=Q.map(()=>null);show();}});
  window.addEventListener('resize',strip);
  show();
};

/* ---------- c7cut：拖動及格線（示意模型，切點 11.5 重現表 7-1(a) 更正後的四格） ---------- */
W.c7cut=(w)=>{
  const NB=88,NA=493,N=581,SD=1.5,MA=8.918019,MB=10.593122;
  const defs=[{id:'c7cutC',label:'及格線：跑走時間在幾分鐘以內算通過',min:8,max:14,step:0.1,value:11.5,fmt:v=>v.toFixed(1)+' 分鐘'}];
  w.innerHTML=`<div class="widget-title"><strong>拖動及格線：通過的人和分錯的人怎麼變</strong><div class="controls"><button class="btn" type="button" data-c7cut="11.5">表 7-1(a) 的四格</button><button class="btn" type="button" data-c7cut="10">訂嚴一點</button><button class="btn" type="button" data-c7cut="13">放寬一點</button></div></div>
  ${sliders(defs)}
  ${SV('0 0 640 250','兩群學生的跑走時間分布與一條可以移動的及格線')}
  <div class="legend"><span><i style="background:var(--accent)"></i>心肺夠（高於效標）493 人</span><span><i style="background:var(--amber)"></i>心肺不夠（低於效標）88 人；塗色＝過關卻不夠</span><span><i style="background:var(--mustard)"></i>塗色＝沒過關但其實夠</span></div>
  <div class="tbl-wrap"><table class="wtbl"><thead><tr><th>跑走測驗</th><th>低於效標</th><th>高於效標</th><th>總數</th></tr></thead><tbody>
  <tr><td>沒有達到標準</td><td id="c7cutA"></td><td id="c7cutB" class="hl"></td><td id="c7cutR0"></td></tr>
  <tr><td>有達到標準</td><td id="c7cutCc" class="hl"></td><td id="c7cutD"></td><td id="c7cutR1"></td></tr>
  <tr class="sum"><td>總數</td><td>88</td><td>493</td><td>581</td></tr></tbody></table></div>
  <div id="c7cutS"></div><p class="readout" id="c7cutM"></p>
  <p class="note" style="margin:0">這是示意模型（自編）：假設兩群人的跑走時間都是常態分配，並調成及格線在 11.5 分鐘時，四格剛好等於表 7-1(a) 更正後的 24、21、64、472。其他位置的人數是模型推算的，不是講義資料；分鐘數也只是示意。黃底的兩格是分錯的人。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;const L=16,T=26,B=196,XL=5,XH=16;
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const fa=v=>NA*ST.dnorm(v,MA,SD),fb=v=>NB*ST.dnorm(v,MB,SD);
  const area=(x,y,f,a,b,style)=>{const pts=[[x(a),y(0)]];for(let i=0;i<=100;i++){const t=a+(b-a)*i/100;pts.push([x(t),y(f(t))]);}pts.push([x(b),y(0)]);el('path',{d:pathOf(pts)+'Z',style},svg);};
  const draw=()=>{
    const c=val(w,'c7cutC');
    const a=Math.round(NB*(1-ST.pnorm((c-MB)/SD))),b=Math.round(NA*(1-ST.pnorm((c-MA)/SD))),cc=NB-a,d=NA-b;
    const pass=cc+d,agree=a+d;
    svg.innerHTML='';const VW=nar()?400:640,R=VW-16;svg.setAttribute('viewBox','0 0 '+VW+' 250');
    const x=v=>L+(v-XL)/(XH-XL)*(R-L),pk=fa(MA),y=v=>B-v/pk*(B-T);
    area(x,y,fb,XL,c,'fill:var(--amber);opacity:.5');area(x,y,fa,c,XH,'fill:var(--mustard);opacity:.75');
    curve(svg,x,y,fa,XL,XH,'ln');curve(svg,x,y,fb,XL,XH,'ln2');
    axisX(svg,x,XL,XH,B,nar()?2:1,null,'跑走時間（分鐘，示意）',L,R);
    el('line',{x1:x(c),x2:x(c),y1:T-12,y2:B,style:'stroke:var(--ink);stroke-width:2.2;stroke-dasharray:6 4'},svg);
    txt('← 通過 '+pass+' 人',{x:x(c)-6,y:T-12,'text-anchor':'end',class:'meanlab'});
    txt('沒通過 '+(a+b)+' 人 →',{x:x(c)+6,y:T-12,'text-anchor':'start',class:'medlab'});
    q('c7cutA').textContent=a;q('c7cutB').textContent=b;q('c7cutCc').textContent=cc;q('c7cutD').textContent=d;q('c7cutR0').textContent=a+b;q('c7cutR1').textContent=cc+d;
    q('c7cutS').innerHTML=statsHTML([['通過比例',Math.round(pass/N*100)+'%'],['分對的人',agree+' 人','mean'],['同意比例',(agree/N).toFixed(2),'mean'],['過關卻不夠',cc+' 人','med'],['沒過但其實夠',b+' 人']]);
    let s=`及格線訂在 ${c.toFixed(1)} 分鐘：581 人有 ${pass} 人通過（${Math.round(pass/N*100)}%）。分對 ${agree} 人，同意比例 ${(agree/N).toFixed(2)}；有 ${cc} 人過關但心肺其實不夠，${b} 人沒過關但心肺其實夠。`;
    if(Math.abs(c-11.5)<0.05)s+='這就是表 7-1(a) 的四格：分對 24＋472＝496 人。往左、往右各拉一點，看兩種分錯的人怎麼一增一減。';
    else if(pass/N>=0.975)s+=`幾乎人人通過，同意比例看起來還是很高，可是 88 位心肺不夠的人只抓到 ${a} 位。只看同意比例會被騙。`;
    else if(c>11.5)s+='線放寬：被冤枉的人變少，心肺不夠卻過關的人變多。';
    else s+='線訂嚴：漏掉的人變少，可是心肺夠卻沒過關的人變多。兩種分錯沒辦法同時變少，只能取捨。';
    q('c7cutM').textContent=s;
  };
  bindSliders(w,defs,draw);window.addEventListener('resize',draw);
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c7cut]');if(!b)return;q('c7cutC').value=b.dataset.c7cut;q('c7cutC').dispatchEvent(new Event('input'));});
  draw();
};

/* ---------- c7kappa：2×2 列聯表的同意比例、機率一致、kappa、phi、卡方 ---------- */
W.c7kappa=(w)=>{
  const PF=['沒有達到標準','有達到標準'];
  const PRE={
    t72:{n:'表 7-2',r:'第 1 天',c:'第 2 天',rl:PF,cl:PF,t:[80,20,50,250],note:''},
    t71a:{n:'表 7-1(a)',r:'跑走測驗',c:'效標 V̇O₂（Fitnessgram）',rl:PF,cl:['低於效標','高於效標'],t:[24,21,64,472],note:'左下格講義印 61，這裡用更正值 64：這樣總數才是內文說的 581 人，算出來的卡方、phi、kappa 也才和表 7-5 一致。'},
    t71b:{n:'表 7-1(b)',r:'跑走測驗',c:'效標 V̇O₂（Physical Best）',rl:PF,cl:['低於效標','高於效標'],t:[130,23,201,227],note:''},
    t76:{n:'表 7-6',r:'手緊握在胸前',c:'手在頭後面',rl:['0 失敗','1 通過'],cl:['0 失敗','1 通過'],t:[14,6,7,13],note:'由表 7-6 的 40 位受試者逐人數出來的四格。'},
    t77:{n:'表 7-7',r:'星期五',c:'星期一',rl:['0 不符合','1 符合'],cl:['0 不符合','1 符合'],t:[15,4,5,15],note:'由表 7-7 的 39 位受試者逐人數出來的四格。'},
    t78:{n:'表 7-8',r:'下背',c:'體前彎',rl:['0','1'],cl:['0','1'],t:[17,13,10,20],note:'由表 7-8 的 60 位受試者逐人數出來的四格。'},
    quiz:{n:'影片小考',r:'第 1 次',c:'第 2 次',rl:PF,cl:PF,t:[40,10,10,40],note:'自編的四格，湊成影片小考的條件：同意比例 0.8、機率一致 0.5。'}};
  let cur='t72';
  const cell=(k,hl)=>`<td${hl?' class="hl"':''}><input type="number" inputmode="numeric" min="0" step="1" id="c7k${k}" style="width:52px" aria-label="格子 ${k}"></td>`;
  w.innerHTML=`<div class="widget-title"><strong>2×2 列聯表：一致的人裡，有多少只是運氣</strong></div>
  <div class="in-row" style="margin:0">${Object.keys(PRE).map(k=>`<button class="btn" type="button" data-c7k="${k}">${PRE[k].n}</button>`).join('')}</div>
  <div class="tbl-wrap"><table class="wtbl"><thead><tr><th id="c7kH"></th><th id="c7kC0"></th><th id="c7kC1"></th><th>總數</th></tr></thead><tbody>
  <tr><td id="c7kR0"></td>${cell('a',1)}${cell('b',0)}<td id="c7kM0"></td></tr>
  <tr><td id="c7kR1"></td>${cell('c',0)}${cell('d',1)}<td id="c7kM1"></td></tr>
  <tr class="sum"><td>總數</td><td id="c7kN0"></td><td id="c7kN1"></td><td id="c7kN"></td></tr></tbody></table></div>
  ${SV('0 0 640 116','0 到 1 的長條：機率一致、超出機率的一致、不一致')}
  <div class="legend"><span><i style="background:var(--mustard)"></i>運氣造成的一致（機率一致）</span><span><i style="background:var(--accent)"></i>超出運氣的一致</span><span><i style="background:var(--soft);border:1px solid var(--line)"></i>不一致</span></div>
  <div class="formula" style="white-space:normal;line-height:1.8" id="c7kF"></div><div id="c7kS"></div><p class="readout" id="c7kM"></p><p class="note" id="c7kNote" style="margin:0"></p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const t4=v=>String(+v.toFixed(4));
  const draw=()=>{
    const P0=PRE[cur];q('c7kH').textContent=P0.r+' ＼ '+P0.c;q('c7kC0').textContent=P0.cl[0];q('c7kC1').textContent=P0.cl[1];q('c7kR0').textContent=P0.rl[0];q('c7kR1').textContent=P0.rl[1];
    const[a,b,c,d]=['a','b','c','d'].map(k=>parseFloat(q('c7k'+k).value));
    if(![a,b,c,d].every(v=>isFinite(v)&&v>=0)){q('c7kM').textContent='四個格子都要填 0 以上的人數。';return;}
    const r1=a+b,r2=c+d,c1=a+c,c2=b+d,N=r1+r2;
    q('c7kM0').textContent=r1;q('c7kM1').textContent=r2;q('c7kN0').textContent=c1;q('c7kN1').textContent=c2;q('c7kN').textContent=N;
    if(!(r1>0&&r2>0&&c1>0&&c2>0)){svg.innerHTML='';q('c7kF').innerHTML='';q('c7kS').innerHTML='';q('c7kM').textContent='有一列或一欄的總數是 0（所有人都分到同一類），phi、卡方和 kappa 都算不出來。';return;}
    const P=(a+d)/N,Pc=(r1*c1+r2*c2)/(N*N),kap=(P-Pc)/(1-Pc),phi=(a*d-b*c)/Math.sqrt(r1*r2*c1*c2),chi=N*phi*phi,p=1-ST.pchisq(chi,1);
    svg.innerHTML='';const VW=nar()?400:640,L=16,R=VW-16,x=v=>L+v*(R-L);svg.setAttribute('viewBox','0 0 '+VW+' 116');
    el('rect',{x:x(0),y:26,width:x(1)-x(0),height:30,style:'fill:var(--soft);stroke:var(--line)'},svg);
    el('rect',{x:x(0),y:26,width:x(Math.min(Pc,1))-x(0),height:30,class:'must'},svg);
    if(P>Pc)el('rect',{x:x(Pc),y:26,width:x(P)-x(Pc),height:30,class:'bar'},svg);
    el('line',{x1:x(Pc),x2:x(Pc),y1:16,y2:56,style:'stroke:var(--ink);stroke-width:1.6'},svg);
    txt('運氣造成的一致 '+t4(Pc),{x:x(Pc)+(Pc>0.5?4:-4),y:13,'text-anchor':Pc>0.5?'end':'start'});
    el('line',{x1:x(P),x2:x(P),y1:26,y2:66,style:'stroke:var(--ink);stroke-width:1.6'},svg);
    txt('同意比例 '+t4(P),{x:x(P)+(P>0.5?4:-4),y:79,'text-anchor':P>0.5?'end':'start',class:'meanlab'});
    el('line',{x1:L,x2:R,y1:90,y2:90,class:'axis'},svg);
    for(let i=0;i<=5;i++){const v=i/5;el('line',{x1:x(v),x2:x(v),y1:90,y2:94,class:'axis'},svg);txt(v.toFixed(1),{x:x(v),y:108,'text-anchor':i===0?'start':i===5?'end':'middle'});}
    q('c7kF').innerHTML=`同意比例 P ＝ (<b>${a}</b> ＋ <b>${d}</b>) ÷ ${N} ＝ <b>${t4(P)}</b><br>機率一致 Pc ＝ (${r1} × ${c1} ＋ ${r2} × ${c2}) ÷ ${N}² ＝ <i>${t4(Pc)}</i><br>kappa ＝ (P − Pc) ÷ (1 − Pc) ＝ (${t4(P)} − ${t4(Pc)}) ÷ (1 − ${t4(Pc)}) ＝ ${kap.toFixed(3)}<br>phi ＝ (${a} × ${d} − ${b} × ${c}) ÷ √(${r1} × ${r2} × ${c1} × ${c2}) ＝ ${phi.toFixed(3)}<br>卡方 ＝ N × phi² ＝ ${N} × ${phi.toFixed(4)}² ＝ ${chi.toFixed(2)}`;
    q('c7kS').innerHTML=statsHTML([['同意比例 P',P.toFixed(3),'mean'],['機率一致 Pc',t4(Pc)],['kappa',kap.toFixed(3),'med'],['phi 係數',phi.toFixed(3)],['卡方（df＝1）',chi.toFixed(2)],['p 值',fp(p)]]);
    const ps=p<0.001?'p 小於 0.001':'p＝'+p.toFixed(3);
    q('c7kM').textContent=`${N} 人裡有 ${a+d} 人兩邊的分類一致，同意比例 ${P.toFixed(3)}。可是照邊緣總數，光靠運氣就會有 ${t4(Pc)} 的一致；扣掉之後，kappa 是 ${kap.toFixed(3)}。`+
      (kap<=0?'一致的程度沒有比亂猜好。':P-kap>=0.3?'同意比例和 kappa 差很多：大部分的人本來就落在同一類，靠運氣就能一致，所以兩個數字要一起看。':'kappa 一定比同意比例低，兩個數字要一起看。')+
      `卡方 ${chi.toFixed(2)}、${ps}，${p<0.05?'兩個分類有關聯':'還不能說兩個分類有關聯'}；phi 係數 ${phi.toFixed(3)} 就是兩個 0／1 變項的相關係數。`;
    q('c7kNote').textContent=P0.note;
  };
  const load=k=>{cur=k;['a','b','c','d'].forEach((id,i)=>{q('c7k'+id).value=PRE[k].t[i];});draw();};
  w.addEventListener('input',e=>{if(e.target.id&&e.target.id.indexOf('c7k')===0)draw();});
  window.addEventListener('resize',draw);
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c7k]');if(b)load(b.dataset.c7k);});
  load('t72');
};

/* ---------- c7roc：靈敏度、特異度、Youden 指數與切點（講義第 27–30 張、表 7-1） ---------- */
W.c7roc=(w)=>{
  const G0=[21,30,40,25,15,9,0],G1=[0,0,12,22,35,21,15];
  const REF=[['Fitnessgram',24,21,64,472],['Physical Best',130,23,201,227]];
  const PRE={a:{t:[24,21,64,472],rl:['沒達標準（陽性）','有達標準（陰性）'],cl:['心肺不夠','心肺夠']},
             b:{t:[130,23,201,227],rl:['沒達標準（陽性）','有達標準（陰性）'],cl:['心肺不夠','心肺夠']},
             p:{t:null,rl:['≥ 切點（陽性）','＜ 切點（陰性）'],cl:['gold＝0','gold＝1']}};
  const defs=[{id:'c7rocC',label:'切點：score 大於等於多少判為陽性',min:0,max:41,step:1,value:25,fmt:v=>v+' 分'}];
  let mode='a';
  const cell=(k,hl)=>`<td${hl?' class="hl"':''}><input type="number" inputmode="numeric" min="0" step="1" id="c7r${k}" style="width:58px" aria-label="格子 ${k}"></td>`;
  w.innerHTML=`<div class="widget-title"><strong>靈敏度、特異度與切點</strong></div>
  ${segHTML('c7rm',[['a','表 7-1(a) Fitnessgram'],['b','表 7-1(b) Physical Best'],['p','第 29 張練習資料：自己移切點']],'a')}
  <div id="c7rocSl" hidden>${sliders(defs)}</div>
  <div class="tbl-wrap"><table class="wtbl"><thead><tr><th id="c7rH"></th><th id="c7rC0"></th><th id="c7rC1"></th><th>總數</th></tr></thead><tbody>
  <tr><td id="c7rR0"></td>${cell('a',1)}${cell('b',0)}<td id="c7rM0"></td></tr>
  <tr><td id="c7rR1"></td>${cell('c',0)}${cell('d',1)}<td id="c7rM1"></td></tr>
  <tr class="sum"><td>總數</td><td id="c7rN0"></td><td id="c7rN1"></td><td id="c7rN"></td></tr></tbody></table></div>
  ${SV('0 0 640 300','ROC 圖：橫軸是 1 減特異度，縱軸是靈敏度')}
  <div class="legend"><span><i style="background:var(--amber)"></i>目前這張表</span><span><i style="background:var(--mustard)"></i>表 7-1 的兩套標準</span><span><i style="background:var(--accent)"></i>練習資料每個切點連成的 ROC 曲線</span></div>
  <div class="formula" style="white-space:normal;line-height:1.8" id="c7rF"></div><div id="c7rS"></div><p class="readout" id="c7rM"></p>
  <p class="note" style="margin:0" id="c7rNote"></p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;const L=46,T=18,B=250;
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const at=c=>{const tp=G0.filter(s=>s>=c).length,fpn=G1.filter(s=>s>=c).length;return[tp,fpn,7-tp,7-fpn];};
  const CUTS=[...new Set(G0.concat(G1))].sort((x,y)=>x-y).concat([41]);
  const RP=CUTS.map(c=>{const[tp,fpn]=at(c);return[fpn/7,tp/7];}).sort((u,v)=>u[0]-v[0]||u[1]-v[1]);
  let auc=0;for(let i=1;i<RP.length;i++)auc+=(RP[i][0]-RP[i-1][0])*(RP[i][1]+RP[i-1][1])/2;
  const draw=()=>{
    const P0=PRE[mode];q('c7rH').textContent=mode==='p'?'score':'跑走測驗';q('c7rC0').textContent=P0.cl[0];q('c7rC1').textContent=P0.cl[1];q('c7rR0').textContent=P0.rl[0];q('c7rR1').textContent=P0.rl[1];
    const cut=val(w,'c7rocC');
    if(mode==='p'){const t=at(cut);['a','b','c','d'].forEach((k,i)=>{q('c7r'+k).value=t[i];});}
    const[a,b,c,d]=['a','b','c','d'].map(k=>parseFloat(q('c7r'+k).value));
    if(![a,b,c,d].every(v=>isFinite(v)&&v>=0)){q('c7rM').textContent='四個格子都要填 0 以上的人數。';return;}
    q('c7rM0').textContent=a+b;q('c7rM1').textContent=c+d;q('c7rN0').textContent=a+c;q('c7rN1').textContent=b+d;q('c7rN').textContent=a+b+c+d;
    if(!(a+c>0&&b+d>0)){q('c7rM').textContent='兩欄都要有人，才算得出靈敏度和特異度。';return;}
    const se=a/(a+c),sp=d/(b+d),J=se+sp-1;
    svg.innerHTML='';const VW=nar()?400:640,R=VW-22;svg.setAttribute('viewBox','0 0 '+VW+' 300');
    const x=v=>L+v*(R-L),y=v=>B-v*(B-T);
    for(let i=0;i<=5;i++){const v=i/5;el('line',{x1:L,x2:R,y1:y(v),y2:y(v),class:'grid'},svg);txt(v.toFixed(1),{x:L-6,y:y(v)+4,'text-anchor':'end'});}
    txt('靈敏度',{x:4,y:11,'text-anchor':'start'});axisX(svg,x,0,1,B,0.2,v=>v.toFixed(1),'1 − 特異度（沒狀況的人被誤判成陽性的比例）',L,R);
    el('line',{x1:x(0),y1:y(0),x2:x(1),y2:y(1),class:'dash'},svg);
    if(mode==='p'){el('path',{d:pathOf(RP.map(p=>[x(p[0]),y(p[1])])),class:'ln'},svg);RP.forEach(p=>el('circle',{cx:x(p[0]),cy:y(p[1]),r:3.2,class:'pt'},svg));}
    REF.forEach(([nm,ra,rb,rc,rd],i)=>{const rx=x(rb/(rb+rd)),ry=y(ra/(ra+rc));el('circle',{cx:rx,cy:ry,r:5,class:'must',style:'stroke:var(--ink);stroke-width:1'},svg);if(mode!=='p')txt(nm,{x:rx+9,y:ry+(i?-6:14),'text-anchor':'start'});});
    el('line',{x1:x(1-sp),x2:x(1-sp),y1:y(1-sp),y2:y(se),class:'ln2','stroke-dasharray':'4 3'},svg);
    el('circle',{cx:x(1-sp),cy:y(se),r:7,class:'pt2'},svg);
    q('c7rF').innerHTML=`靈敏度 ＝ a ÷ (a ＋ c) ＝ <b>${a}</b> ÷ ${a+c} ＝ <b>${se.toFixed(3)}</b><br>特異度 ＝ d ÷ (b ＋ d) ＝ <b>${d}</b> ÷ ${b+d} ＝ <b>${sp.toFixed(3)}</b><br>Youden 指數 ＝ 靈敏度 ＋ 特異度 − 1 ＝ ${se.toFixed(3)} ＋ ${sp.toFixed(3)} − 1 ＝ <i>${J.toFixed(3)}</i>`;
    const items=[['靈敏度',se.toFixed(2),'mean'],['特異度',sp.toFixed(2),'mean'],['Youden 指數',J.toFixed(2),'med'],['漏掉（假陰性）',c+' 人'],['誤判（假陽性）',b+' 人']];
    if(mode==='p')items.push(['曲線下面積',auc.toFixed(2)]);
    q('c7rS').innerHTML=statsHTML(items);
    let s;
    if(mode==='p'){s=`切點訂在 ${cut} 分：gold＝0 的 7 人抓到 ${a} 人（靈敏度 ${se.toFixed(2)}），gold＝1 的 7 人有 ${d} 人被正確判成陰性（特異度 ${sp.toFixed(2)}），Youden 指數 ${J.toFixed(2)}。`+(Math.abs(J-2/7)<1e-9?'這是所有切點裡 Youden 指數最大的一個。':'把切點往上調，靈敏度下降、特異度上升；往下調則相反。Youden 指數最大的切點在 25 分（0.29）。')+`粉紅色虛線的長度就是 Youden 指數：點離對角線越遠越好。這份資料的曲線下面積只有 ${auc.toFixed(2)}，離對角線的 0.5 不遠，表示 score 分不太開這兩群人。`;}
    else{s=`真正有狀況的 ${a+c} 人裡，測驗抓到 ${a} 人，靈敏度 ${se.toFixed(2)}，漏掉 ${c} 人；沒狀況的 ${b+d} 人裡，${d} 人被正確判成沒問題，特異度 ${sp.toFixed(2)}。`+
      (se<0.5&&sp>0.85?'特異度高、靈敏度低：這條線很少冤枉人，但有狀況的人大部分都漏掉了。':se>sp?'靈敏度比特異度高：有狀況的人抓得多，代價是比較多沒狀況的人被誤判。':'')+
      (mode==='b'?'和 Fitnessgram 比，Physical Best 的標準比較嚴：靈敏度 0.27 → 0.39，特異度 0.96 → 0.91，Youden 指數 0.23 → 0.30。':'按上面的「表 7-1(b)」換成較嚴的 Physical Best 標準，看圖上的點往哪裡移。');}
    q('c7rM').textContent=s;
    q('c7rNote').textContent=mode==='p'?'練習資料是講義第 29 張的 14 筆（gold＝0、gold＝1 各 7 筆）。照第 30 張 SPSS 的設定，狀態變數的值填 0，所以 gold＝0 是要抓出來的那一群，score 越高越傾向判成陽性。四格由切點自動算出，不能直接改。':'這裡把「心肺不夠（低於效標）」當成要抓出來的對象、「跑走沒達標準」當成陽性，再套第 27 張的公式。表 7-1(a) 的左下格用更正值 64。四格都可以改，圖上粉紅色的點會跟著移動。';
  };
  const setMode=m=>{mode=m;q('c7rocSl').hidden=m!=='p';['a','b','c','d'].forEach((k,i)=>{const inp=q('c7r'+k);inp.readOnly=m==='p';if(m!=='p')inp.value=PRE[m].t[i];});draw();};
  segBind(w,'c7rm',setMode);
  bindSliders(w,defs,draw);
  w.addEventListener('input',e=>{if(e.target.id&&/^c7r[abcd]$/.test(e.target.id))draw();});
  window.addEventListener('resize',draw);
  setMode('a');
};

/* ---------- c7risk：相對風險、勝算比、歸因危險性差（講義表 7-10、圖 7-3） ---------- */
W.c7risk=(w)=>{
  const PRE={t710:{n:'講義表 7-10',rl:['高膽固醇','無高膽固醇'],cl:['心臟病死亡','非心臟病死亡'],t:[25,31,7,37],note:''},
             quiz:{n:'影片小考 0.3 對 0.1',rl:['有暴露','沒暴露'],cl:['發生','沒發生'],t:[30,70,10,90],note:'自編的四格，湊成影片小考的條件：有暴露的風險 0.3、沒暴露的風險 0.1。'},
             same:{n:'兩組風險一樣',rl:['有暴露','沒暴露'],cl:['發生','沒發生'],t:[10,40,10,40],note:'自編的四格：兩組的風險都是 0.2。'}};
  let cur='t710';
  const cell=k=>`<td><input type="number" inputmode="numeric" min="0" step="1" id="c7x${k}" style="width:46px;padding:4px" aria-label="格子 ${k}"></td>`;
  w.innerHTML=`<div class="widget-title"><strong>風險高幾倍：相對風險、勝算比、歸因危險性差</strong></div>
  <div class="in-row" style="margin:0">${Object.keys(PRE).map(k=>`<button class="btn" type="button" data-c7x="${k}">${PRE[k].n}</button>`).join('')}</div>
  <div class="tbl-wrap"><table class="wtbl"><thead><tr><th>暴露</th><th id="c7xC0"></th><th id="c7xC1"></th><th>總數</th><th>風險</th></tr></thead><tbody>
  <tr><td id="c7xR0"></td>${cell('A')}${cell('B')}<td id="c7xM0"></td><td id="c7xK0" class="hl"></td></tr>
  <tr><td id="c7xR1"></td>${cell('C')}${cell('D')}<td id="c7xM1"></td><td id="c7xK1" class="hl"></td></tr>
  <tr class="sum"><td>總數</td><td id="c7xN0"></td><td id="c7xN1"></td><td id="c7xN"></td><td id="c7xK"></td></tr></tbody></table></div>
  ${SV('0 0 640 130','兩組的絕對風險長條，上面一條拆成本來就有的風險與多出來的風險')}
  <div class="legend"><span><i style="background:var(--mustard)"></i>沒暴露也有的風險</span><span><i style="background:var(--amber)"></i>多出來、算在暴露頭上的風險</span></div>
  <div class="formula" style="white-space:normal;line-height:1.8" id="c7xF"></div><div id="c7xS"></div><p class="readout" id="c7xM"></p><p class="note" id="c7xNote" style="margin:0"></p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const r3=v=>String(+v.toFixed(3)),ok=v=>isFinite(v);
  const draw=()=>{
    const P0=PRE[cur];q('c7xC0').textContent=P0.cl[0];q('c7xC1').textContent=P0.cl[1];q('c7xR0').textContent=P0.rl[0];q('c7xR1').textContent=P0.rl[1];
    const[A,B,C,D]=['A','B','C','D'].map(k=>parseFloat(q('c7x'+k).value));
    if(![A,B,C,D].every(v=>isFinite(v)&&v>=0)){q('c7xM').textContent='四個格子都要填 0 以上的人數。';return;}
    const n1=A+B,n0=C+D,N=n1+n0;
    q('c7xM0').textContent=n1;q('c7xM1').textContent=n0;q('c7xN0').textContent=A+C;q('c7xN1').textContent=B+D;q('c7xN').textContent=N;
    if(!(n1>0&&n0>0)){q('c7xM').textContent='兩組都要有人，才算得出風險。';return;}
    const k1=A/n1,k0=C/n0,kt=(A+C)/N,RR=k0>0?k1/k0:NaN,OR=(B>0&&C>0)?A*D/(B*C):NaN,AR=k1>0?(k1-k0)/k1:NaN,RD=k1-k0;
    q('c7xK0').textContent=k1.toFixed(2);q('c7xK1').textContent=k0.toFixed(2);q('c7xK').textContent=kt.toFixed(2);
    svg.innerHTML='';const VW=nar()?400:640,L=nar()?92:120,R=VW-64;svg.setAttribute('viewBox','0 0 '+VW+' 130');
    const mx=Math.max(k1,k0,0.5),top=Math.min(1,Math.ceil(mx*10)/10),x=v=>L+v/top*(R-L);
    const lab=s=>s.length>5&&nar()?s.slice(0,5):s;
    txt(lab(P0.rl[0]),{x:L-8,y:33,'text-anchor':'end'});txt(lab(P0.rl[1]),{x:L-8,y:75,'text-anchor':'end'});
    const base=Math.min(k0,k1);
    el('rect',{x:L,y:16,width:Math.max(0,x(base)-L),height:26,class:'must'},svg);
    if(k1>k0)el('rect',{x:x(k0),y:16,width:x(k1)-x(k0),height:26,class:'bar2'},svg);
    txt(k1.toFixed(2),{x:x(k1)+6,y:34,'text-anchor':'start',class:'medlab'});
    el('rect',{x:L,y:58,width:Math.max(0,x(k0)-L),height:26,class:'must'},svg);
    txt(k0.toFixed(2),{x:x(k0)+6,y:76,'text-anchor':'start'});
    if(k0>0)el('line',{x1:x(k0),x2:x(k0),y1:10,y2:90,class:'dash'},svg);
    axisX(svg,x,0,top,96,top<=0.5?0.1:0.2,v=>v.toFixed(1),'絕對風險',L,R);
    q('c7xF').innerHTML=`絕對風險：${esc(P0.rl[0])} ＝ A ÷ (A ＋ B) ＝ ${A} ÷ ${n1} ＝ <i>${r3(k1)}</i>；${esc(P0.rl[1])} ＝ C ÷ (C ＋ D) ＝ ${C} ÷ ${n0} ＝ <b>${r3(k0)}</b>；全體 ＝ ${A+C} ÷ ${N} ＝ ${r3(kt)}<br>相對風險 ＝ ${r3(k1)} ÷ ${r3(k0)} ＝ ${ok(RR)?RR.toFixed(2):'—'}<br>勝算比 ＝ (A × D) ÷ (B × C) ＝ ${A*D} ÷ ${B*C} ＝ ${ok(OR)?OR.toFixed(2):'—'}<br>歸因危險性差（圖 7-3 的算法）＝ (${r3(k1)} − ${r3(k0)}) ÷ ${r3(k1)} ＝ ${ok(AR)?AR.toFixed(2):'—'}<br>兩組風險直接相減（第 33 張的定義）＝ ${r3(k1)} − ${r3(k0)} ＝ ${RD.toFixed(2)}`;
    q('c7xS').innerHTML=statsHTML([[esc(P0.rl[0])+'的風險',k1.toFixed(2),'med'],[esc(P0.rl[1])+'的風險',k0.toFixed(2)],['相對風險',ok(RR)?RR.toFixed(2):'—','mean'],['勝算比',ok(OR)?OR.toFixed(2):'—','mean'],['歸因危險性差',ok(AR)?AR.toFixed(2):'—'],['風險直接相減',RD.toFixed(2)]]);
    let s;
    if(!ok(RR))s=`「${P0.rl[1]}」這一組沒有人發生，風險是 0，相對風險的分母是 0，算不出來。`;
    else if(Math.abs(RR-1)<0.005)s='兩組的風險一樣，相對風險等於 1，勝算比也等於 1：看不出暴露和結果有關。';
    else if(RR>1)s=`「${P0.rl[0]}」的風險是 ${k1.toFixed(2)}，「${P0.rl[1]}」是 ${k0.toFixed(2)}，相對風險 ${RR.toFixed(2)}：暴露的那一組風險是另一組的 ${RR.toFixed(1)} 倍。`+(ok(OR)?`勝算比 ${OR.toFixed(2)} 比相對風險大，兩個不是同一個數字。`:'')+`暴露組的風險裡，有 ${Math.round(AR*100)}% 是多出來的（圖 7-3 把這個比例叫歸因危險性差）；兩組風險直接相減是 ${RD.toFixed(2)}。`;
    else s=`相對風險 ${RR.toFixed(2)}，小於 1：暴露的那一組風險反而比較低`+(ok(OR)?`，勝算比 ${OR.toFixed(2)} 也小於 1。`:'。')+'這時候圖 7-3 的歸因危險性差會變成負的，不適合拿來解讀。';
    q('c7xM').textContent=s;q('c7xNote').textContent=(P0.note?P0.note+' ':'')+'格子可以直接改；公式裡的風險顯示到小數三位，講義圖 7-3 算表 7-10 時用的是四捨五入後的 0.45、0.16，結果相同。';
  };
  const load=k=>{cur=k;['A','B','C','D'].forEach((id,i)=>{q('c7x'+id).value=PRE[k].t[i];});draw();};
  w.addEventListener('input',e=>{if(e.target.id&&e.target.id.indexOf('c7x')===0)draw();});
  window.addEventListener('resize',draw);
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c7x]');if(b)load(b.dataset.c7x);});
  load('t710');
};

/* ===== 第 10 章 評分：互動工具 ===== */
const c10T=(svg,x,y,s,a)=>{a=Object.assign({x,y},a||{});if(!/font-size/.test(a.style||''))a.style='font-size:13px;'+(a.style||'');const t=el('text',a,svg);t.textContent=s;return t;};
const c10Set=(root,id,v)=>{const i=root.querySelector('#'+id);i.value=v;i.dispatchEvent(new Event('input'));};

/* ---------- c10fair：這個項目該不該算進體育成績／九個難題講義站哪一邊 ---------- */
W.c10fair=(w)=>{
  const YN=['可以算進體育成績','不該直接影響體育成績'];
  const SETS={
    item:{items:[
      ['罰球測驗十投八中（技能測驗的表現）。',YN,0,'講義第 5、12 張；情境出自短片 EP2','講義建議分數要基於學生的表現，罰球命中數就是表現。'],
      ['上課遲到五分鐘。',YN,1,'講義第 5 張；情境出自短片 EP2','出缺席是學校規章制度要求的行為。講義建議分數不應受這類行為影響；遲到要處理，但不是扣在球技的分數上。'],
      ['忘了穿運動服。',YN,1,'講義第 5 張；情境出自短片 EP2','服裝也是校規要求的行為，不是學習目標，不該直接影響體育成績。'],
      ['1 英哩跑的體適能測驗成績。',YN,0,'講義第 6 張','講義建議技能領域與健康體適能領域都要考核，體適能表現可以算，只是權重不必和技能一樣。'],
      ['期初到期末，朝著教學目標進步了多少（和表現一起看）。',YN,0,'講義第 5、7 張','講義第 5 張說分數應基於「表現」與「朝著既定教育目標所取得的進步」，所以進步可以算。但第 7 張提醒：不能只根據改善來評分。'],
      ['整個成績只看前測到後測進步幅度，不看最後的表現。',['可以，這樣最公平','不宜，只看改善不公正、不一致'],1,'講義第 7 張；說明出自短片 EP2','講義說僅根據改善評分會受到不公正與不一致的損害。短片補充的原因：本來就很強的人進步空間小，還有人前測會故意放水。'],
      ['運動規則與知識的筆試成績。',YN,0,'講義第 11 張','講義建議評分要包含所有四個學習領域的考核，知識也是其中之一。圖 10-2 的例子裡知識佔 15%。'],
      ['老師規定「上課講話一次，學期成績扣 2 分」。',['符合講義建議','不符合講義建議'],1,'講義第 8 張；自編例子','講義建議評分系統應獎勵正面的行為，而不是懲罰負面的行為。這條規定是扣分制，而且扣的是和學習目標無關的行為。']]},
    nine:{items:[
      ['一、教育目標 vs. 學生責任：分數要依什麼來評？',['學生的表現與朝教育目標的進步','出缺席、服裝這類校規行為'],0,'講義第 5 張','分數不應受學校規章制度所要求的行為或行動影響。'],
      ['二、技能領域 vs. 健康體適能領域：要評哪一個？',['只評技能','只評體適能','兩個都評，權重不必相同'],2,'講義第 6 張','每一個因素都要考慮，但不要求所有領域的權重都相同。講義把技能領域寫成「心理性肌肉運動領域」。'],
      ['三、改善 vs. 成績：可以只看進步多少來評分嗎？',['可以，這樣最能鼓勵人','要慎重，只看改善不公正也不一致'],1,'講義第 7 張','僅根據改善進行評分，會受到不公正與不一致的損害。'],
      ['四、扣分制 vs. 加分制：評分系統的結構應該怎麼設計？',['獎勵正面的行為','懲罰負面的行為'],0,'講義第 8 張','做到就加分，而不是沒做到就扣分。'],
      ['五、不及格制 vs. 自動升級制：講義站哪一邊？',['默許人人自動過關','正視有人不及格的現實'],1,'講義第 9 張','講義認為體育要維持和其他科目一樣的地位，評分系統就要正視有失敗者的現實。'],
      ['六、為考而教 vs. 為學而教：課程要怎麼開發？',['以標準化測驗與表現目標為指南，但不為考而教','考什麼就只教什麼'],0,'講義第 10 張','測驗與表現目標是開發課程的指南，不是教學的全部。'],
      ['七、單次衡量 vs. 多次衡量：分數要依據幾次評量？',['期末測一次就決定','多次、涵蓋四個學習領域的評量'],1,'講義第 11 張','講義還建議考慮第 5 章介紹的替代考核程序。'],
      ['八、過程 vs. 結果：講義的建議是？',['憑老師對學生的印象評分','根據表現評分，教學要充滿鼓勵與有效教導'],1,'講義第 12 張','原文：應根據表現進行評分，教學應在充滿鼓勵與有效教導的場域中進行。'],
      ['九、分數膨脹：全班大部分都拿 A，有什麼問題？',['沒有問題，皆大歡喜','出色的學生和同儕分不出差別'],1,'講義第 13 張','講義認為表現出色的學生應以較高的分數得到獎勵，分數的分布應較廣。']]}};
  let mode='item',k=0,st={item:{},nine:{}};
  w.innerHTML=`<div class="widget-title"><strong>評什麼才公平？</strong>${segHTML('c10fm',[['item','該不該算進成績'],['nine','九個難題']],mode)}</div>
  <p class="note" style="margin:0" id="c10fN"></p>
  <p style="margin:0;font-size:16px;font-weight:500" id="c10fQ"></p>
  <div class="tagrow" id="c10fO"></div>
  <p class="readout" id="c10fM"></p>
  <div class="controls"><button class="btn" type="button" id="c10fPrev">上一題</button><button class="btn primary" type="button" id="c10fNext">下一題</button><button class="btn" type="button" id="c10fR">重新開始</button></div>
  <div id="c10fS"></div>
  <p class="note" style="margin:0">回饋依講義第 5–13 張的九項建議。遲到、服裝、罰球十投八中是短片 EP2 的情境，標「自編例子」的是為了練習另外編的。選錯可以再選，直到選對。</p>`;
  const q=id=>w.querySelector('#'+id);
  const draw=()=>{
    const S0=SETS[mode],it=S0.items[k],s=st[mode][k]||{wrong:[],ok:false};
    q('c10fN').textContent=`第 ${k+1} 題／共 ${S0.items.length} 題　出處：${it[3]}`;
    q('c10fQ').textContent=it[0];
    q('c10fO').innerHTML=it[1].map((o,i)=>`<button type="button" class="tag${s.ok&&i===it[2]?' right':s.wrong.includes(i)?' wrong':''}" data-c10fo="${i}">${o}</button>`).join('');
    q('c10fM').textContent=s.ok?`答對了：「${it[1][it[2]]}」。${it[4]}`:s.wrong.length?`「${it[1][s.wrong[s.wrong.length-1]]}」和講義的建議不同，再想想：${mode==='item'?'這一項是學習目標上的表現，還是校規要求的行為？':'分數要反映的是有沒有達到學習目標。'}`:(mode==='item'?'讀完這個項目，判斷它該不該算進體育成績。':'九個難題各選一次：講義的建議是哪一個？');
    q('c10fPrev').disabled=k===0;q('c10fNext').disabled=k===S0.items.length-1;
    const all=Object.values(st[mode]),nOk=all.filter(a=>a.ok).length,first=all.filter(a=>a.ok&&!a.wrong.length).length;
    q('c10fS').innerHTML=statsHTML([['已答對',nOk+' / '+S0.items.length,'mean'],['第一次就選對',first+' 題'],['還沒答對',(S0.items.length-nOk)+' 題',nOk===S0.items.length?'':'med']]);
  };
  w.addEventListener('click',e=>{
    const b=e.target.closest('[data-c10fo]');
    if(b){const it=SETS[mode].items[k],s=st[mode][k]||(st[mode][k]={wrong:[],ok:false});if(s.ok)return;const i=+b.dataset.c10fo;if(i===it[2])s.ok=true;else{if(s.wrong.includes(i))s.wrong.splice(s.wrong.indexOf(i),1);s.wrong.push(i);}draw();}
  });
  q('c10fPrev').addEventListener('click',()=>{if(k>0){k--;draw();}});
  q('c10fNext').addEventListener('click',()=>{if(k<SETS[mode].items.length-1){k++;draw();}});
  q('c10fR').addEventListener('click',()=>{st[mode]={};k=0;draw();});
  segBind(w,'c10fm',v=>{mode=v;k=0;draw();});draw();
};

/* ---------- c10curve：圖 10-1 壘球擲遠的常態曲線評分 ---------- */
W.c10curve=(w)=>{
  // 講義圖 10-1：平均 125′、標準差 10′、表現得分 132′。刻度用更正值（−2、−3 個標準差是 105′、95′）。
  // B、A 兩區的分界講義沒有印數字，依短片 EP3 由圖估讀：+0.5 到 +1.5 個標準差是 B，以上是 A。
  const CRIT=130;
  const defs=[{id:'c10cx',label:'你的成績（英呎）',min:90,max:160,step:1,value:132,fmt:v=>v+'′'},
    {id:'c10cm',label:'全班平均（英呎）',min:115,max:135,step:1,value:125,fmt:v=>v+'′'},
    {id:'c10cs',label:'全班標準差（英呎）',min:5,max:12,step:1,value:10,fmt:v=>v+'′'}];
  w.innerHTML=`<div class="widget-title"><strong>圖 10-1　壘球擲遠：跟全班比</strong><span class="note">預設：講義的平均 125′、標準差 10′、成績 132′</span></div>
  ${sliders(defs)}
  <div class="in-row"><button class="btn" type="button" data-c10cp="132,125,10">講義資料</button><button class="btn" type="button" data-c10cp="132,135,10">全班變強：平均 135′</button><button class="btn" type="button" data-c10cp="132,115,10">全班變弱：平均 115′</button></div>
  ${SV('0 0 520 250','壘球擲遠成績的常態曲線，標出每個標準差的刻度、B 區、A 區與你的成績')}
  <div class="legend"><span><i style="background:var(--accent);opacity:.45"></i>B 的那一區</span><span><i style="background:var(--amber);opacity:.6"></i>A 的那一區</span><span><i style="background:var(--mustard)"></i>虛線：效標 130′（短片自編）</span></div>
  <div id="c10cS"></div><p class="readout" id="c10cM"></p>
  <p class="note" style="margin:0">刻度已更正：講義把 −2、−3 個標準差印成 110′、100′，應為 105′、95′。B、A 兩區的分界講義沒有印數字，這裡照短片由圖估讀（＋0.5 到 ＋1.5 個標準差是 B，以上是 A）；其他區域圖上沒有標等第。「大約贏過多少人」假設成績呈常態分配。怎麼把分數換成等第，第 13 章才會教。</p>`;
  const svg=w.querySelector('svg'),L=14,R=506,T=62,B=196,LO=78,HI=172,x=v=>L+(v-LO)/(HI-LO)*(R-L);
  const draw=()=>{
    const v=val(w,'c10cx'),mu=val(w,'c10cm'),sg=val(w,'c10cs');svg.innerHTML='';
    const f=t=>ST.dnorm((t-mu)/sg),y=d=>B-d/f(mu)*(B-T),z=(v-mu)/sg,P=ST.pnorm(z);
    const cl=t=>Math.min(HI,Math.max(LO,t));
    curveArea(svg,x,y,f,cl(mu+.5*sg),cl(mu+1.5*sg),'area-p');
    el('path',{d:(()=>{const a=cl(mu+1.5*sg),pts=[[x(a),y(0)]];for(let i=0;i<=60;i++){const t=a+(HI-a)*i/60;pts.push([x(t),y(f(t))]);}pts.push([x(HI),y(0)]);return pathOf(pts)+'Z';})(),style:'fill:var(--amber);opacity:.5'},svg);
    curve(svg,x,y,f,LO,HI,'curve');
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
    for(let k=-3;k<=3;k++){const t=mu+k*sg,X=x(t);
      el('line',{x1:X,x2:X,y1:T-6,y2:B,class:k===0?'mean':'grid'},svg);
      c10T(svg,X,T-26,(+t.toFixed(1))+'′',{'text-anchor':'middle',style:'font-size:13px;fill:var(--ink)'+(k===0?';font-weight:700':'')});
      c10T(svg,X,T-11,k===0?'平均':(k>0?'+':'−')+Math.abs(k)+'SD',{'text-anchor':'middle',style:'font-size:11px'});}
    c10T(svg,x(cl(mu+sg)),B-8,'B',{'text-anchor':'middle',style:'font-size:15px;font-weight:700;fill:var(--ink)'});
    c10T(svg,x(cl(mu+2*sg)),B-8,'A',{'text-anchor':'middle',style:'font-size:15px;font-weight:700;fill:var(--ink)'});
    el('line',{x1:x(CRIT),x2:x(CRIT),y1:T+8,y2:B+6,style:'stroke:var(--mustard);stroke-width:2.4;stroke-dasharray:5 4'},svg);
    el('line',{x1:x(v),x2:x(v),y1:T+2,y2:B+6,class:'zline'},svg);
    el('circle',{cx:x(v),cy:B,r:5,style:'fill:var(--ink)'},svg);
    c10T(svg,Math.min(Math.max(x(v),L+60),R-60),B+26,'你的成績 '+v+'′',{'text-anchor':'middle',style:'font-size:15px;font-weight:700;fill:var(--ink)'});
    c10T(svg,R,B+44,'壘球擲遠（英呎）',{'text-anchor':'end'});
    const zs=(z<0?'−':'+')+Math.abs(z).toFixed(2),zone=z>=1.5?'A 的那一區':z>=.5?'B 的那一區':'圖上沒有標等第';
    const pc=P*100,pcs=pc<1?'不到 1%':pc>99?'超過 99%':'約 '+Math.round(pc)+'%',ok=v>=CRIT;
    w.querySelector('#c10cS').innerHTML=statsHTML([['標準分數',zs+' 個標準差'],['常模參照：落在',zone,'mean'],['常態下贏過',pcs],['效標參照：標準 130′',ok?'達標':'未達標','med']]);
    const calc=`（${v}−${mu}）÷${sg}＝${zs.replace('+','')}`;
    let m=`${v}′ 在平均 ${mu}′、標準差 ${sg}′ 的班上：${calc}，${z===0?'剛好等於平均':`比平均${z>0?'高':'低'} ${Math.abs(z).toFixed(2)} 個標準差`}，`;
    m+=z>=1.5?'落在曲線上 A 的那一區。':z>=.5?'落在曲線上 B 的那一區。':z>=0?'還沒到 B 那一區的起點（＋0.5 個標準差，'+(+(mu+.5*sg).toFixed(1))+'′）。':'在平均以下，圖上這一段沒有標等第。';
    m+=`這是常模參照，全班的平均一變，同一個 ${v}′ 的位置就跟著變。效標參照只跟標準比：${v}′ ${ok?'≥':'<'} 130′，${ok?'達標':'未達標'}，不管全班強弱都一樣。`;
    w.querySelector('#c10cM').textContent=m;
  };
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c10cp]');if(b){const [a,m,s]=b.dataset.c10cp.split(',');c10Set(w,'c10cx',a);c10Set(w,'c10cm',m);c10Set(w,'c10cs',s);}});
  bindSliders(w,defs,draw);draw();
};

/* ---------- c10norm：表 10-1 常模查表（伊利諾體適能數據庫，10 歲女生） ---------- */
W.c10norm=(w)=>{
  // 逐格對照講義第 17–20 張。欄位：百分位數、三頭肌皮膚皺褶、皮膚皺褶總數、坐姿前彎、仰臥起坐、1 英哩跑（秒）。
  // 四格誤植已用更正值：97 列仰臥起坐 S2→52、68 列皮膚皺褶總數 16.S→16.5、9 列仰臥起坐「. 21」→21、1 列坐姿前彎 .14→14。講義缺百分位 41 那一列，照缺。
  const TB=[[99,5.0,10.0,41,58,398],[98,6.0,11.0,40,54,426],[97,6.0,11.0,39,52,441],[96,6.0,11.0,38,50,459],[95,7.0,11.5,38,49,468],[94,7.0,12.0,37,47,477],[93,7.0,12.5,37,47,482],[92,7.0,12.5,36,46,486],[91,7.0,13.0,36,46,495],[90,7.0,13.0,35,45,502],[89,7.5,13.0,35,45,504],[88,8.0,13.5,35,45,510],[87,8.0,14.0,35,44,512],[86,8.0,14.0,34,43,514],[85,8.0,14.0,34,43,519],[84,8.0,14.0,34,42,521],[83,8.0,14.0,34,42,523],[82,8.0,14.0,34,42,528],[81,8.0,14.5,33,42,530],[80,8.5,15.0,33,41,533],[79,8.5,15.0,33,41,538],[78,9.0,15.0,33,41,542],[77,9.0,15.0,33,40,545],[76,9.0,15.0,33,40,548],[75,9.0,15.5,32,40,551],[74,9.0,15.5,32,40,553],[73,9.0,16.0,32,40,555],[72,9.0,16.0,32,39,559],[71,9.0,16.0,32,39,561],[70,9.0,16.5,32,39,563],[69,9.5,16.5,32,38,568],[68,9.5,16.5,31,38,570],[67,10.0,17.0,31,38,574],[66,10.0,17.0,31,38,578],[65,10.0,17.0,31,37,579],[64,10.0,17.0,31,37,582],[63,10.0,17.0,31,37,585],[62,10.0,17.0,30,37,590],[61,10.0,17.0,30,36,592],[60,10.0,17.5,30,36,595],[59,10.0,18.0,30,36,599],[58,10.0,18.0,30,36,602],[57,10.5,18.0,30,36,606],[56,10.5,18.0,29,35,609],[55,11.0,18.5,29,35,610],[54,11.0,19.0,29,35,614],[53,11.0,19.0,29,35,617],[52,11.0,19.0,29,34,618],[51,11.0,19.0,29,34,620],[50,11.0,19.5,29,34,624],[49,11.0,20.0,28,34,626],[48,11.5,20.0,28,34,627],[47,11.5,20.0,28,33,630],[46,12.0,20.5,28,33,633],[45,12.0,21.0,28,33,635],[44,12.0,21.0,28,33,641],[43,12.0,21.0,28,32,645],[42,12.0,21.5,27,32,647],[40,12.0,22.0,27,32,656],[39,12.5,22.0,27,31,660],[38,13.0,22.0,27,31,663],[37,13.0,22.5,26,31,668],[36,13.0,23.0,26,31,673],[35,13.0,23.0,26,30,676],[34,13.0,23.0,26,30,679],[33,13.5,23.5,26,30,682],[32,14.0,24.0,26,30,688],[31,14.0,24.0,26,30,691],[30,14.0,24.0,25,29,693],[29,14.0,24.5,25,29,696],[28,14.0,25.0,25,29,700],[27,14.5,25.0,25,28,703],[26,15.0,26.0,25,28,707],[25,15.0,26.0,25,28,711],[24,15.0,26.5,24,28,715],[23,15.0,27.0,24,27,720],[22,16.0,27.0,24,27,726],[21,16.0,28.0,24,27,731],[20,16.0,28.0,23,26,734],[19,16.0,28.5,23,25,739],[18,16.5,29.0,23,25,745],[17,17.0,30.0,23,25,749],[16,17.0,30.5,23,24,752],[15,17.0,31.0,23,24,758],[14,18.0,32.0,22,24,765],[13,18.0,32.0,22,23,776],[12,18.5,34.0,22,23,780],[11,19.0,35.0,21,22,789],[10,19.0,36.0,21,22,802],[9,20.0,37.5,20,21,814],[8,21.0,38.0,20,20,828],[7,21.0,39.0,19,20,839],[6,22.0,40.0,19,19,848],[5,23.0,42.0,18,18,860],[4,24.0,45.0,18,17,882],[3,24.0,46.0,17,14,909],[2,25.0,52.0,16,12,927],[1,29.0,56.0,14,6,992]];
  const FIX={'97,4':'S2','68,2':'16.S','9,4':'. 21','1,3':'.14'};
  // [鍵, 名稱, 欄, 數值越大越好, 預設值, 輸入間距, 單位, 百分位的白話]
  const IT={situp:['仰臥起坐',4,true,49,1,' 下','做得比大約 P% 的同齡女生多'],reach:['坐姿前彎',3,true,33,1,'','成績比大約 P% 的同齡女生好'],mile:['1 英哩跑',5,false,624,1,'','跑得比大約 P% 的同齡女生快'],tri:['三頭肌皮膚皺褶',1,false,11,.5,'','皮膚皺褶比大約 P% 的同齡女生薄'],sum:['皮膚皺褶總數',2,false,19.5,.5,'','皮膚皺褶總數比大約 P% 的同齡女生小']};
  const HEAD=['百分位數','三頭肌皮膚皺褶','皮膚皺褶總數','坐姿前彎','仰臥起坐','1 英哩跑'];
  const ms=s=>Math.floor(s/60)+':'+String(Math.round(s%60)).padStart(2,'0');
  const show=(c,v)=>c===5?ms(v):c<=2?v.toFixed(1):String(v);
  let cur='situp';
  w.innerHTML=`<div class="widget-title"><strong>表 10-1　查常模表：這個成績排在第幾百分位</strong><span class="note">預設：講義與短片的例子，仰臥起坐 49 下</span></div>
  <div class="tagrow" id="c10nI">${Object.keys(IT).map(k=>`<button type="button" class="tag" data-c10ni="${k}" aria-pressed="${k===cur}">${IT[k][0]}</button>`).join('')}</div>
  <div class="in-row"><label for="c10nv"><span id="c10nL">成績</span><input class="num-in" type="number" id="c10nv" value="49" step="1" min="0" inputmode="decimal"></label><label for="c10ns" id="c10nSW" hidden><span>秒</span><input class="num-in" type="number" id="c10ns" value="24" step="1" min="0" max="59" inputmode="numeric"></label><button class="btn" type="button" id="c10nR">講義的例子：仰臥起坐 49 下</button></div>
  ${SV('0 0 520 82','百分位數 1 到 99 的橫軸，標出這個成績的位置')}
  <div id="c10nS"></div><p class="readout" id="c10nM"></p>
  <div class="tbl-wrap"><table class="wtbl" id="c10nT"></table></div>
  <p class="note" style="margin:0">資料：講義表 10-1（第 17–20 張），伊利諾體適能數據庫，10 歲女生；下方只列出查到的那幾列，完整 98 列在資料檔。講義沒有印各項目的單位。標 ＊ 的四格是講義誤植、已更正的值（97 列仰臥起坐 S2→52、68 列皮膚皺褶總數 16.S→16.5、9 列仰臥起坐「. 21」→21、1 列坐姿前彎 .14→14）；講義缺百分位 41 那一列，這裡照缺。仰臥起坐、坐姿前彎是數值越大百分位越高；1 英哩跑與兩項皮膚皺褶是數值越小百分位越高。</p>`;
  const q=id=>w.querySelector('#'+id),svg=w.querySelector('svg'),L=20,R=500,x=p=>L+(p-1)/98*(R-L);
  const get=()=>{const a=parseFloat(q('c10nv').value);if(cur!=='mile')return a;const s=parseFloat(q('c10ns').value);return a*60+(Number.isFinite(s)?s:0);};
  const draw=()=>{
    const it=IT[cur],c=it[1],hi=it[2],v=get();svg.innerHTML='';
    el('line',{x1:L,x2:R,y1:40,y2:40,class:'axis'},svg);
    [1,10,25,50,75,90,99].forEach(p=>{el('line',{x1:x(p),x2:x(p),y1:40,y2:45,class:'axis'},svg);c10T(svg,x(p),61,p,{'text-anchor':'middle',style:'font-size:14px'});});
    c10T(svg,R,78,'百分位數',{'text-anchor':'end',style:'font-size:12px'});
    if(!Number.isFinite(v)){q('c10nS').innerHTML='';q('c10nM').textContent='請輸入成績。';q('c10nT').innerHTML='';return;}
    const hit=TB.filter(r=>r[c]===v),reach=TB.filter(r=>hi?r[c]<=v:r[c]>=v);
    let lo,up,txt,m,i0,i1;const vs=show(c,v)+it[5];
    if(hit.length){up=hit[0][0];lo=hit[hit.length-1][0];i0=TB.indexOf(hit[0]);i1=TB.indexOf(hit[hit.length-1]);
      txt=lo===up?'第 '+up+' 百分位':'第 '+lo+'–'+up+' 百分位';
      m=`${it[0]} ${vs}：在表 10-1 找到${hit.length>1?' '+hit.length+' 列都是這個成績，對應'+txt:'一列，對應'+txt}。意思是${it[6].replace('P',lo===up?up:lo+'–'+up)}。`+(lo<=40&&up>=42?'（百分位 41 那一列講義缺漏。）':'');}
    else if(!reach.length){lo=up=1;i0=i1=TB.length-1;txt='不到第 1 百分位';m=`${it[0]} ${vs}：比表上第 1 百分位的成績（${show(c,TB[TB.length-1][c])}）還${hi?'低':'高'}，排在最後 1% 以內。`;}
    else if(reach.length===TB.length){lo=up=99;i0=i1=0;txt='超過第 99 百分位';m=`${it[0]} ${vs}：比表上第 99 百分位的成績（${show(c,TB[0][c])}）還${hi?'高':'低'}，排在最前面 1% 以內。`;}
    else{i1=TB.indexOf(reach[0]);i0=i1-1;lo=TB[i1][0];up=TB[i0][0];txt='第 '+lo+' 與 '+up+' 之間';
      m=`${it[0]} ${vs}：表上沒有剛好這個成績的列。它已達到第 ${lo} 百分位的成績（${show(c,TB[i1][c])}），還不到第 ${up} 百分位的成績（${show(c,TB[i0][c])}），所以介於兩者之間。`;}
    el('rect',{x:x(lo)-3,y:26,width:x(up)-x(lo)+6,height:14,rx:3,style:'fill:var(--accent);opacity:.55'},svg);
    const xm=x((lo+up)/2);el('path',{d:`M${xm-8} 8L${xm+8} 8L${xm} 24Z`,style:'fill:var(--mustard);stroke:var(--ink);stroke-width:1.2'},svg);
    c10T(svg,xm>R-150?xm-13:xm+13,20,txt,{'text-anchor':xm>R-150?'end':'start',style:'font-size:17px;font-weight:700;fill:var(--ink)'});
    q('c10nS').innerHTML=statsHTML([['項目',it[0]],['成績',vs],['百分位數',txt,'mean'],['表上相同成績的列數',hit.length+' 列']]);
    q('c10nM').textContent=m+(hi?'':'這個項目是數值越小、百分位越高。');
    const a=Math.max(0,i0-2),b=Math.min(TB.length-1,i1+2);let h=`<tr>${HEAD.map((t,j)=>`<th${j===c?' class="hl"':''}>${t}</th>`).join('')}</tr>`;
    for(let i=a;i<=b;i++){const r=TB[i],on=i>=i0&&i<=i1;
      if(i>a&&TB[i-1][0]-r[0]>1)h+=`<tr><td>41</td><td colspan="5" style="text-align:center;color:var(--muted)">講義缺這一列</td></tr>`;
      h+=`<tr>${r.map((t,j)=>`<td${on&&(j===c||j===0)?' class="hl"':''}>${j?show(j,t)+(FIX[r[0]+','+j]?'＊':''):t}</td>`).join('')}</tr>`;}
    q('c10nT').innerHTML=h;
  };
  const pick=(k,v)=>{cur=k;const it=IT[k];w.querySelectorAll('[data-c10ni]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c10ni===k?'true':'false'));
    const mile=k==='mile';q('c10nSW').hidden=!mile;q('c10nL').textContent=mile?'成績：分':'成績';q('c10nv').step=mile?1:it[4];
    if(v===undefined)v=it[3];q('c10nv').value=mile?Math.floor(v/60):v;if(mile)q('c10ns').value=v%60;draw();};
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c10ni]');if(b)pick(b.dataset.c10ni);});
  q('c10nv').addEventListener('input',draw);q('c10ns').addEventListener('input',draw);
  q('c10nR').addEventListener('click',()=>pick('situp',49));
  draw();
};

/* ---------- c10weight：圖 10-2 加權學期成績試算 ---------- */
W.c10weight=(w)=>{
  // 等第值：A+＝12 … D−＝1；講義把 9 那一格印成 B，更正為 B+。預設四項與權重出自圖 10-2。
  const G=['D−','D','D+','C−','C','C+','B−','B','B+','A−','A','A+'],gn=v=>G[v-1];
  const DEF=[['技巧',6,35],['體適能',11,35],['社會技巧和態度',7,15],['知識',5,15]];
  const f=v=>(Math.round(v*100)/100).toFixed(2),rd=v=>Math.min(12,Math.max(1,Math.round(v+1e-9)));
  w.innerHTML=`<div class="widget-title"><strong>圖 10-2　加權算出學期成績</strong><span class="note">預設：講義的例子，C+、A、B−、C，權重 35、35、15、15</span></div>
  <div class="in-row"><button class="btn" type="button" data-c10wp="35,35,15,15">講義資料</button><button class="btn" type="button" data-c10wp="25,25,25,25">四項各 25%（等於直接平均）</button><button class="btn" type="button" data-c10wp="50,20,15,15">技巧加重到 50%</button></div>
  <div class="tbl-wrap"><table class="wtbl"><tr><th>項目</th><th>等第</th><th>等第值</th><th>權重（%）</th><th>乘積</th></tr>
  ${DEF.map((d,i)=>`<tr><td style="white-space:normal;min-width:4em">${d[0]}</td><td><select class="num-in" id="c10wg${i}" style="width:64px;padding:6px 4px" aria-label="${d[0]}的等第">${G.map((g,j)=>`<option value="${j+1}"${j+1===d[1]?' selected':''}>${g}</option>`).reverse().join('')}</select></td><td id="c10wv${i}"></td><td><input type="number" id="c10ww${i}" value="${d[2]}" min="0" max="100" step="5" inputmode="numeric" style="width:58px" aria-label="${d[0]}的權重"></td><td id="c10wx${i}"></td></tr>`).join('')}
  <tr class="sum"><td>合計</td><td></td><td id="c10wA"></td><td id="c10wW"></td><td id="c10wT"></td></tr></table></div>
  <p class="formula" id="c10wF"></p>
  ${SV('0 0 520 116','等第值 1 到 12 的刻度，標出加權結果與直接平均')}
  <div class="legend"><span><i style="background:var(--accent)"></i>加權結果</span><span><i style="background:var(--amber)"></i>直接平均（四項等權重）</span></div>
  <div id="c10wS"></div><p class="readout" id="c10wM"></p>
  <p class="note" style="margin:0">等第值對照出自講義圖 10-2（A+＝12 到 D−＝1）；講義把 9 那一格印成 B，這裡更正為 B+。講義直接寫「7.75＝B」，中間四捨五入成 8 的步驟是短片補上的；這個工具遇到 .5 一律進位。直接平均 7.25 是用講義資料重算的對照值。</p>`;
  const q=id=>w.querySelector('#'+id),svg=w.querySelector('svg'),L=24,R=496,x=v=>L+(v-1)/11*(R-L);
  const draw=()=>{
    const gs=DEF.map((d,i)=>+q('c10wg'+i).value),ws=DEF.map((d,i)=>{const t=parseFloat(q('c10ww'+i).value);return Number.isFinite(t)&&t>0?t:0;});
    const W0=ws.reduce((a,b)=>a+b,0),raw=gs.reduce((a,g,i)=>a+g*ws[i],0)/100,tot=W0>0?raw*100/W0:NaN,avg=gs.reduce((a,b)=>a+b,0)/4;
    DEF.forEach((d,i)=>{q('c10wv'+i).textContent=gs[i];q('c10wx'+i).textContent=f(gs[i]*ws[i]/100);});
    q('c10wA').textContent='平均 '+f(avg);q('c10wW').textContent=W0+'%';q('c10wT').textContent=f(raw);
    const ok=Math.abs(W0-100)<1e-9;
    q('c10wF').innerHTML=DEF.map((d,i)=>`<i>${(ws[i]/100).toFixed(2).replace(/^0/,'')}</i>×<b>${gs[i]}</b>`).join(' + ')+' ＝ '+f(raw)+(ok||!W0?'':`　÷ 權重合計 ${f(W0/100)} ＝ ${f(tot)}`);
    svg.innerHTML='';
    el('line',{x1:L,x2:R,y1:56,y2:56,class:'axis'},svg);
    for(let t=1;t<=12;t++){el('line',{x1:x(t),x2:x(t),y1:51,y2:61,class:'axis'},svg);c10T(svg,x(t),77,t,{'text-anchor':'middle',style:'font-size:14px'});c10T(svg,x(t),95,gn(t),{'text-anchor':'middle',style:'font-size:14px;fill:var(--ink)'});}
    c10T(svg,R,112,'等第值',{'text-anchor':'end',style:'font-size:12px'});
    const mark=(v,up,col,lab)=>{const X=x(v);el('path',{d:up?`M${X-8} 30L${X+8} 30L${X} 50Z`:`M${X-6} 36L${X+6} 36L${X} 50Z`,style:`fill:var(${col});stroke:var(--ink);stroke-width:1`},svg);return X;};
    if(Number.isFinite(tot)){const d=Math.abs(tot-avg)<.6,Xa=x(avg),Xt=x(tot),rt=tot>=avg;
      mark(avg,false,'--amber');mark(tot,true,'--accent');
      c10T(svg,Xt+(d?(rt?10:-10):0),22,'加權 '+f(tot),{'text-anchor':d?(rt?'start':'end'):'middle',style:'font-size:16px;font-weight:700;fill:var(--ink)'});
      c10T(svg,Xa+(d?(rt?-10:10):0),d?22:30,'平均 '+f(avg),{'text-anchor':d?(rt?'end':'start'):'middle',style:'font-size:15px'});}
    const r=Number.isFinite(tot)?rd(tot):null,ra=rd(avg);
    q('c10wS').innerHTML=statsHTML([['加權結果',Number.isFinite(tot)?f(tot):'—','mean'],['四捨五入後的等第',r?r+' ＝ '+gn(r):'—','mean'],['直接平均',f(avg)+' → '+ra+' ＝ '+gn(ra),'med'],['權重合計',W0+'%'+(ok?'':'（應為 100%）')]]);
    let m;
    if(!W0)m='四個權重都是 0，算不出來。請至少給一個項目權重。';
    else{m=`加權結果 ${f(tot)}，四捨五入是 ${r}，對照回去是 ${gn(r)}。四項直接平均是 ${f(avg)}，四捨五入 ${ra}，是 ${gn(ra)}。`;
      const ds=gs.map((g,i)=>(g-avg)*(ws[i]/W0-.25)),pk=ds.indexOf(tot>avg?Math.max(...ds):Math.min(...ds));
      if(Math.abs(tot-avg)<.005)m+='兩個結果一樣：四項權重相同時，加權就等於直接平均。';
      else m+=`加權比直接平均${tot>avg?'高':'低'} ${f(Math.abs(tot-avg))}，主要因為${DEF[pk][0]}（${gn(gs[pk])}，等第值比四項平均${gs[pk]>avg?'高':'低'}）的權重比 25% ${ws[pk]/W0>.25?'大':'小'}。`;
      if(r!==ra)m+='權重不同，最後的等第也跟著不同。';
      if(!ok)m+=`注意：權重合計是 ${W0}%，不是 100%，這裡已先除以權重合計；正式計算時請把權重調成合計 100%。`;}
    q('c10wM').textContent=m;
  };
  w.addEventListener('input',draw);w.addEventListener('change',draw);
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c10wp]');if(!b)return;const p=b.dataset.c10wp.split(',');DEF.forEach((d,i)=>{q('c10ww'+i).value=p[i];if(p[0]==='35')q('c10wg'+i).value=d[1];});draw();});
  draw();
};

/* ---------- c10contract：圖 10-3 長曲棍球評分契約 ---------- */
W.c10contract=(w)=>{
  // 講義圖 10-3：核心目標 10 項各 1 分、可選目標 5 項各 2 分，全部完成 20 分（講義沒有印總分，也沒有印幾分對應哪個等第）
  const CORE=['高手擲球穿越目標','低手擲球穿越目標','體側擲球穿越目標','任一種擲球穿越目標','高手接球','低手接球','反手接球並左軸轉','側撲救球','兜底救起「死」球','防守同伴投來的球'];
  const OPT=['跑動側撲救球（20 碼傳球）','兜底救起死球','15 碼高手擲球穿越目標','15 碼低手擲球穿越目標','擲球越過守門員得分'];
  const defs=[{id:'c10kg',label:'和老師約定的目標分數（自訂）',min:1,max:20,step:1,value:14,fmt:v=>v+' 分'}];
  let on=CORE.map(()=>true).concat(OPT.map(()=>false));
  w.innerHTML=`<div class="widget-title"><strong>圖 10-3　長曲棍球評分契約：完成幾項，拿幾分</strong><span class="note">預設：10 項核心目標都完成</span></div>
  <p class="note" style="margin:0">核心目標（每項 1 分）：點一下代表完成，再點一下取消。</p>
  <div class="tagrow" id="c10kC"></div>
  <p class="note" style="margin:0">可選目標（每項 2 分）</p>
  <div class="tagrow" id="c10kO"></div>
  ${sliders(defs)}
  <div class="in-row"><button class="btn" type="button" data-c10kp="core">只完成核心目標</button><button class="btn" type="button" data-c10kp="all">全部完成</button><button class="btn" type="button" data-c10kp="none">全部清空</button></div>
  ${SV('0 0 520 98','0 到 20 分的橫條，分成核心目標與可選目標的得分，並標出約定的目標分數')}
  <div class="legend"><span><i style="background:var(--accent)"></i>核心目標的分數</span><span><i style="background:var(--amber)"></i>可選目標的分數</span><span><i style="background:var(--mustard)"></i>約定的目標分數</span></div>
  <div id="c10kS"></div><p class="readout" id="c10kM"></p>
  <p class="note" style="margin:0">十五項目標與每項分數出自講義圖 10-3（第 23 張），這裡只寫簡稱，完整文字在資料檔。滿分 20 分是重算的（10×1＋5×2），講義沒有印總分，也沒有印幾分對應哪個等第，所以「約定的目標分數」由你自己訂，預設的 14 分只是示意。</p>`;
  const q=id=>w.querySelector('#'+id),svg=w.querySelector('svg'),L=20,R=500,x=v=>L+v/20*(R-L);
  const draw=()=>{
    const tg=(a,off)=>a.map((t,i)=>`<button type="button" class="tag" data-c10ki="${i+off}" aria-pressed="${on[i+off]}">${i+1}. ${t}</button>`).join('');
    q('c10kC').innerHTML=tg(CORE,0);q('c10kO').innerHTML=tg(OPT,10);
    const nc=on.slice(0,10).filter(Boolean).length,no=on.slice(10).filter(Boolean).length,pc=nc,po=no*2,tot=pc+po,goal=val(w,'c10kg');
    svg.innerHTML='';
    el('rect',{x:L,y:30,width:R-L,height:26,style:'fill:var(--soft);stroke:var(--line)'},svg);
    if(pc)el('rect',{x:x(0),y:30,width:x(pc)-x(0),height:26,class:'bar'},svg);
    if(po)el('rect',{x:x(pc),y:30,width:x(tot)-x(pc),height:26,class:'bar2'},svg);
    for(let t=0;t<=20;t+=2){el('line',{x1:x(t),x2:x(t),y1:56,y2:61,class:'axis'},svg);c10T(svg,x(t),77,t,{'text-anchor':'middle',style:'font-size:14px'});}
    c10T(svg,R,94,'分數（滿分 20）',{'text-anchor':'end',style:'font-size:11px'});
    el('line',{x1:x(goal),x2:x(goal),y1:22,y2:62,style:'stroke:var(--mustard);stroke-width:3'},svg);
    c10T(svg,goal>16?x(goal)-6:x(goal)+6,17,'目標 '+goal,{'text-anchor':goal>16?'end':'start',style:'font-size:15px;font-weight:700;fill:var(--ink)'});
    c10T(svg,tot>16?x(tot)-6:x(tot)+6,48,tot+' 分',{'text-anchor':tot>16?'end':'start',style:'font-size:16px;font-weight:700;fill:var('+(tot>16?'--accent-ink':'--ink')+')'});
    const gap=goal-tot;
    q('c10kS').innerHTML=statsHTML([['核心目標',nc+' 項，'+pc+' 分','mean'],['可選目標',no+' 項，'+po+' 分','med'],['合計',tot+' / 20 分'],['和約定的目標',gap<=0?'已達成':'還差 '+gap+' 分']]);
    let m=`完成 ${nc} 項核心目標、${no} 項可選目標：${nc}×1＋${no}×2＝${tot} 分。`;
    if(gap<=0)m+=`已達到約定的 ${goal} 分${gap<0?'，還多 '+(-gap)+' 分':''}。`;
    else{const ro=5-no,rc=10-nc,ways=[];
      if(ro*2>=gap)ways.push(`再完成 ${Math.ceil(gap/2)} 項可選目標`);
      if(rc>=gap)ways.push(`再完成 ${gap} 項核心目標`);
      m+=`離約定的 ${goal} 分還差 ${gap} 分：`+(ways.length?ways.join('，或')+'。':rc+ro*2>=gap?'剩下的核心目標和可選目標要搭配著完成。':'');}
    m+=tot===20?'十五項全部完成就是滿分 20 分。':'契約評分是效標參照：做到幾項就拿幾分，不必和別人比。';
    q('c10kM').textContent=m;
  };
  w.addEventListener('click',e=>{
    const b=e.target.closest('[data-c10ki]'),p=e.target.closest('[data-c10kp]');
    if(b){const i=+b.dataset.c10ki;on[i]=!on[i];draw();}
    else if(p){const k=p.dataset.c10kp;on=on.map((t,i)=>k==='all'||(k==='core'&&i<10));draw();}
  });
  bindSliders(w,defs,draw);draw();
};

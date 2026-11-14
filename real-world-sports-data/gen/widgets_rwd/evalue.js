/* ---------- W15: evalue ---------- */
W.evalue=(w)=>{
  const inp=(id,v,lab,ph)=>`<label for="${id}"><span>${lab}</span><input class="num-in" type="number" id="${id}" value="${v}" step="0.01" min="0.01" inputmode="decimal"${ph?` placeholder="${ph}"`:''}></label>`;
  w.innerHTML=`<div class="widget-title"><strong>E-value：未測混淆要多強</strong><span class="note">預設為講義例子</span></div>
  <div class="in-row">${inp('evalueRR',1.5,'風險比 RR')}${inp('evalueLo',1.3,'信賴區間下限')}${inp('evalueHi',1.7,'信賴區間上限')}</div>
  <div class="in-row"><span class="note">講義表中的三個 RR：</span><button class="btn" type="button" data-evpre="1.2">1.2</button><button class="btn" type="button" data-evpre="1.5">1.5</button><button class="btn" type="button" data-evpre="2">2.0</button></div>
  <div class="in-row">${inp('evalueB','','已測最強混淆因子與處理、結果的關聯（風險比）','例如 1.8')}</div>
  ${SV('0 0 640 270','E-value 隨風險比變化的曲線')}<div id="evalueS"></div><p class="readout" id="evalueM"></p>
  <p class="note" style="margin:0">公式：E-value = RR + √(RR × (RR − 1))；RR 小於 1 時先取倒數。信賴區間取靠近 1 的那一端，區間包含 1 時 E-value 為 1。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const num=id=>{const s=q(id).value.trim();const v=Number(s);return s!==''&&Number.isFinite(v)&&v>0?v:null;};
  const ev=r=>{if(r<1)r=1/r;return r+Math.sqrt(r*(r-1));};
  const draw=()=>{
    const rr=num('evalueRR'),lo=num('evalueLo'),hi=num('evalueHi'),b=num('evalueB');
    svg.innerHTML='';
    if(rr===null){q('evalueS').innerHTML='';q('evalueM').textContent='請輸入大於 0 的風險比。';return;}
    const r=rr<1?1/rr:rr;const e=ev(rr);
    let eci=null,bound=null;
    if(rr>=1&&lo!==null){bound=lo;eci=lo<=1?1:ev(lo);}
    if(rr<1&&hi!==null){bound=hi;eci=hi>=1?1:ev(hi);}
    const xm=Math.max(4,Math.ceil(r*1.2)),ym=Math.ceil(ev(xm));
    const L=48,R=608,T=22,B=220;const x=v=>L+(v-1)/(xm-1)*(R-L),y=v=>B-(v-1)/(ym-1)*(B-T);
    const ys=ym>12?4:ym>6?2:1,xs=xm>8?2:xm>4?1:0.5;
    axisY(svg,y,1,ym,L,ys,v=>v.toFixed(0),'E-value',T);
    axisX(svg,x,1,xm,B,xs,v=>v.toFixed(xs<1?1:0),rr<1?'風險比（已取倒數）':'觀察到的風險比 RR',L,R);
    curve(svg,x,y,ev,1,xm,'curve');
    const dot=(vx,vy,col,lab,dy)=>{el('line',{x1:x(vx),x2:x(vx),y1:y(vy),y2:B,stroke:col,'stroke-dasharray':'3 3','stroke-width':1},svg);el('circle',{cx:x(vx),cy:y(vy),r:5,fill:col},svg);const t=el('text',{x:Math.min(x(vx)+8,R-70),y:y(vy)+dy,fill:col},svg);t.textContent=lab;};
    if(eci!==null&&eci>1){const br=bound<1?1/bound:bound;dot(br,eci,'var(--muted)','區間端 '+eci.toFixed(2),18);}
    dot(r,e,'var(--amber)','點估計 '+e.toFixed(2),-8);
    if(b!==null&&b>=1&&b<=ym){el('line',{x1:L,x2:R,y1:y(b),y2:y(b),stroke:'var(--accent)','stroke-width':1.5,'stroke-dasharray':'6 4'},svg);const t=el('text',{x:R,y:y(b)-5,'text-anchor':'end',fill:'var(--accent)'},svg);t.textContent='已測最強混淆 '+b.toFixed(2);}
    q('evalueS').innerHTML=statsHTML([['點估計的 E-value',e.toFixed(2),'med'],['信賴區間端的 E-value',eci===null?'—':eci.toFixed(2)],['使用的區間端',bound===null?'—':bound.toFixed(2)],['已測最強混淆',b===null?'未輸入':b.toFixed(2),'mean']]);
    let m=`一個未測量的混淆因子，要與處理和結果各有 ${e.toFixed(2)} 倍的關聯，才能把 RR = ${rr.toFixed(2)} 完全解釋掉。`;
    if(eci!==null)m+=eci<=1?'信賴區間包含 1，區間端的 E-value 是 1：不需要任何未測混淆，資料本身就無法排除沒有關聯。':`要讓信賴區間碰到 1，需要各 ${eci.toFixed(2)} 倍。`;
    if(b===null)m+='在下方輸入資料中最強的已測混淆因子的關聯強度，才有比較的基準。';
    else if(b>=e)m+=`已測最強的混淆因子已有 ${b.toFixed(2)} 倍，不低於 E-value。若未測的因子可能和它一樣強或更強，這個結論站不住。`;
    else if(eci!==null&&eci>1&&b>=eci)m+=`已測最強的混淆因子為 ${b.toFixed(2)} 倍，低於點估計的 E-value，但已達到區間端的 ${eci.toFixed(2)}。同樣強度的未測因子足以讓區間包含 1。`;
    else m+=`已測最強的混淆因子為 ${b.toFixed(2)} 倍，低於 E-value。未測的因子要比它強才能推翻結論；接著要問的是，領域知識上有沒有這樣的因子。`;
    q('evalueM').textContent=m;};
  w.addEventListener('input',e=>{if(e.target.matches('input'))draw();});
  w.addEventListener('click',e=>{const b=e.target.closest('[data-evpre]');if(!b)return;q('evalueRR').value=b.dataset.evpre;q('evalueLo').value='';q('evalueHi').value='';draw();});
  draw();
};

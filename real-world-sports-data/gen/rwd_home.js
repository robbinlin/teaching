/* home page: the W01 tool as the opening interaction, plus per-week progress read from localStorage */
try{W.decide5(document.getElementById('homeW'),CH);}catch(err){document.getElementById('homeW').innerHTML='<p class="note">這個互動工具載入失敗。</p>';console.error(err);}
$$('[data-pct]').forEach(s=>{
  let p=0;
  try{const raw=localStorage.getItem('rwd-w'+s.dataset.pct+'-v1');if(raw)p=JSON.parse(raw).pct||0;}catch(e){}
  s.textContent=p?p+'%':'';
  if(p>=100)s.parentElement.classList.add('done');
  else if(p>0)s.parentElement.classList.add('started');
});

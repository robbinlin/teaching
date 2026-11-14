/* ===== AdvStat：Google 登入與進度同步（Firebase） ===== */
(function(){
'use strict';
var CFG={apiKey:'AIzaSyBoRC-HE1njeOKFg2Nq3FMv4m2ua2MikKg',authDomain:'advstat-ntsu.firebaseapp.com',projectId:'advstat-ntsu',storageBucket:'advstat-ntsu.firebasestorage.app',messagingSenderId:'736539818685',appId:'1:736539818685:web:1e5faa3dcbbde0279f55d4'};
var TEACHER='robbinlin@ntsu.edu.tw';
var CH_KEYS=[1,2,3,4,5,6,7,8].map(function(i){return 'ass-ch'+i+'-v2';});
var OWNER='advstat-owner';
if(!window.firebase||!firebase.initializeApp){console.warn('Firebase SDK 未載入');return;}
var app=firebase.apps.length?firebase.app():firebase.initializeApp(CFG);
var auth=firebase.auth(),db=firebase.firestore();
var ADV=window.__ADV||null; // chapter bridge (only on chapter pages)
var chId=ADV?(ADV.key.match(/ch(\d)/)||[])[1]:null;

/* ---------- account widget ---------- */
var host=document.querySelector('.intro-top')||document.querySelector('.wrap.top');
var box=document.createElement('div');box.className='acct';box.innerHTML='<span class="acct-wait">…</span>';
if(host)host.appendChild(box);
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var syncState='';
function renderBox(u){
  if(!u){box.innerHTML='<button type="button" class="acct-in" id="acctIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.4-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8C4 20.5 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.8 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7.1H2.2C1.4 8.6 1 10.3 1 12s.4 3.4 1.2 4.9l3.6-2.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1C17.4 2.2 15 1 12 1 7.7 1 4 3.5 2.2 7.1l3.6 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>登入，進度跟著帳號</button>';
    return;}
  var nm=u.displayName||u.email;
  box.innerHTML=(u.email===TEACHER&&!/\/teacher\//.test(location.pathname)?'<a class="acct-teacher" href="'+(chId?'../':'')+'teacher/">教師頁面</a>':'')+
    '<span class="acct-user" title="'+esc(u.email)+'">'+(u.photoURL?'<img src="'+esc(u.photoURL)+'" alt="" referrerpolicy="no-referrer">':'')+'<span class="acct-name">'+esc(nm)+'</span></span>'+
    (chId?'<span class="acct-sync" id="acctSync">'+esc(syncState)+'</span>':'')+
    '<button type="button" class="acct-out" id="acctOut">登出</button>';
}
function setSync(t){syncState=t;var e=document.getElementById('acctSync');if(e)e.textContent=t;}
box.addEventListener('click',function(e){
  if(e.target.closest('#acctIn')){var p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
    auth.signInWithPopup(p).catch(function(err){
      if(err&&(err.code==='auth/popup-blocked'||err.code==='auth/operation-not-supported-in-this-environment'))return auth.signInWithRedirect(p);
      if(err&&err.code!=='auth/popup-closed-by-user'&&err.code!=='auth/cancelled-popup-request')alert('登入失敗：'+(err.message||err.code));});}
  if(e.target.closest('#acctOut')){var uid=auth.currentUser&&auth.currentUser.uid;flush().then(function(){
      // 共用電腦：登出時清掉這個帳號存在本機的進度（雲端仍保留）
      try{if(uid&&localStorage.getItem(OWNER)===uid){CH_KEYS.forEach(function(k){localStorage.removeItem(k);});localStorage.removeItem(OWNER);}}catch(_){}
      return auth.signOut();}).then(function(){location.reload();});}
});

/* ---------- merge local + cloud ---------- */
function isObj(x){return x&&typeof x==='object'&&!Array.isArray(x);}
function filled(v){return !(v===undefined||v===null||v===''||(Array.isArray(v)&&!v.length));}
function merge(cloud,local){
  var o=JSON.parse(JSON.stringify(local||{}));cloud=cloud||{};
  Object.keys(cloud).forEach(function(k){if(!(k in o))o[k]=cloud[k];});
  ['videos','spss','hwChecked'].forEach(function(k){if(isObj(cloud[k])||isObj(o[k])){var r={},a=cloud[k]||{},b=o[k]||{};Object.keys(a).concat(Object.keys(b)).forEach(function(x){r[x]=!!(a[x]||b[x]);});o[k]=r;}});
  o.slidesDone=!!(cloud.slidesDone||o.slidesDone);o.slideMax=Math.max(+cloud.slideMax||1,+o.slideMax||1);
  if(isObj(cloud.quiz)||isObj(o.quiz)){var q={},qa=cloud.quiz||{},qb=o.quiz||{};Object.keys(qa).concat(Object.keys(qb)).forEach(function(x){var A=qa[x],B=qb[x];q[x]=(B&&B.ok)?B:(A&&A.ok)?A:(B||A);});o.quiz=q;}
  if(isObj(cloud.hw)||isObj(o.hw)){var h={},ha=cloud.hw||{},hb=o.hw||{};Object.keys(ha).concat(Object.keys(hb)).forEach(function(x){h[x]=filled(hb[x])?hb[x]:ha[x];});o.hw=h;}
  if(!filled(o.think)&&filled(cloud.think))o.think=cloud.think;
  return o;
}
function canon(x){var s=function(v){if(Array.isArray(v))return v.map(s);if(isObj(v)){var r={};Object.keys(v).sort().forEach(function(k){r[k]=s(v[k]);});return r;}return v;};return JSON.stringify(s(x));}

/* ---------- summary for the teacher page ---------- */
function summary(){
  var t=function(id){var e=document.getElementById(id);return e?e.textContent.trim():'';};
  var pct=parseInt(t('meterPct'),10)||0;
  var steps=[].slice.call(document.querySelectorAll('.stage-tab.done')).map(function(x){return x.dataset.tab;});
  var hw=(t('hwStatus').match(/(\d+)\s*\/\s*(\d+)/)||[]);
  return {pct:pct,steps:steps,quizCorrect:parseInt(t('quizScore'),10)||0,hwAnswered:+hw[1]||0,hwTotal:+hw[2]||0};
}

/* ---------- chapter sync ---------- */
var timer=null,pending=false,ready=false;
function ref(u){return db.collection('users').doc(u.uid).collection('progress').doc('ch'+chId);}
function push(){
  var u=auth.currentUser;if(!u||!ADV||!ready)return Promise.resolve();
  pending=false;setSync('同步中…');
  var s=summary();
  return ref(u).set({chapter:+chId,state:JSON.stringify(ADV.state),pct:s.pct,steps:s.steps,quizCorrect:s.quizCorrect,hwAnswered:s.hwAnswered,hwTotal:s.hwTotal,updatedAt:firebase.firestore.FieldValue.serverTimestamp()})
    .then(function(){setSync('✓ 已同步');}).catch(function(e){console.error(e);setSync('⚠ 未同步');});
}
function queue(){if(!auth.currentUser||!ready)return;pending=true;setSync('…');clearTimeout(timer);timer=setTimeout(push,1200);}
function flush(){clearTimeout(timer);return pending?push():Promise.resolve();}
if(ADV){ADV._cb=queue;
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')flush();});
  window.addEventListener('pagehide',function(){flush();});}

function onSignedIn(u){
  db.collection('users').doc(u.uid).set({email:u.email||'',name:u.displayName||'',photo:u.photoURL||'',lastSeen:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(function(e){console.error(e);});
  var owner=null;try{owner=localStorage.getItem(OWNER);}catch(_){}
  if(!ADV){try{localStorage.setItem(OWNER,u.uid);}catch(_){}homeProgress(u);return;}
  setSync('讀取中…');
  ref(u).get().then(function(snap){
    var cloud=null;if(snap.exists){try{cloud=JSON.parse(snap.data().state||'{}');}catch(_){cloud={};}}
    var local=ADV.state;
    // 本機進度若屬於另一個帳號，就不合併，直接以雲端為準
    var foreign=owner&&owner!==u.uid;
    var merged=foreign?(cloud||{}):merge(cloud,local);
    try{localStorage.setItem(OWNER,u.uid);}catch(_){}
    if(foreign){try{CH_KEYS.forEach(function(k){if(k!==ADV.key)localStorage.removeItem(k);});}catch(_){}}
    if(canon(merged)!==canon(local)){
      var flag='advstat-merged-'+chId;
      if(!sessionStorage.getItem(flag)){sessionStorage.setItem(flag,'1');
        try{localStorage.setItem(ADV.key,JSON.stringify(merged));}catch(_){}
        // 先把合併結果寫回雲端，再重新載入頁面套用
        ready=true;return ref(u).set({chapter:+chId,state:JSON.stringify(merged),updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).then(function(){location.reload();});}
    }
    sessionStorage.removeItem('advstat-merged-'+chId);
    ready=true;setSync('✓ 已同步');
    push();
  }).catch(function(e){console.error(e);ready=true;setSync('⚠ 無法讀取雲端進度');});
}

/* ---------- home: show per-chapter progress ---------- */
function homeProgress(u){
  var rows=[].slice.call(document.querySelectorAll('.chrow'));if(!rows.length)return;
  db.collection('users').doc(u.uid).collection('progress').get().then(function(qs){
    var m={};qs.forEach(function(d){m[d.id]=d.data();});
    rows.forEach(function(r,i){var d=m['ch'+(i+1)];var tag=r.querySelector('.my-prog');if(!tag){tag=document.createElement('p');tag.className='my-prog';(r.querySelector('.cmain')||r).appendChild(tag);}
      var p=d&&typeof d.pct==='number'?d.pct:0;tag.innerHTML='<span>你的進度</span><span class="mp-bar"><span style="width:'+p+'%"></span></span><b>'+p+'%</b>';tag.title='你的第 '+(i+1)+' 章進度';});
  }).catch(function(e){console.error(e);});
}

auth.getRedirectResult().catch(function(e){console.error(e);});
auth.onAuthStateChanged(function(u){renderBox(u);if(u)onSignedIn(u);else{ready=false;[].forEach.call(document.querySelectorAll('.my-prog'),function(x){x.remove();});}});
})();

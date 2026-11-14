'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const NS='http://www.w3.org/2000/svg';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=(x,d=2)=>Number.isFinite(x)?x.toLocaleString('zh-TW',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
function niceStep(range,target){const raw=range/target;const p=Math.pow(10,Math.floor(Math.log10(raw)));const m=raw/p;return (m<1.5?1:m<3?2:m<7?5:10)*p;}
const CH=JSON.parse(document.getElementById('chData').textContent);
const KEY='rwd-w'+CH.id+'-v1';
let S={videos:{},slidesDone:false,slideMax:1,spss:{},quiz:{},hw:{},hwChecked:{},think:''};
try{const raw=localStorage.getItem(KEY);if(raw)S=Object.assign(S,JSON.parse(raw));}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
let toastTimer;
function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t);}t.textContent=msg;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.hidden=true},2600);}

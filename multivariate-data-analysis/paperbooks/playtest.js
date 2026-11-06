// 用法：node playtest.js <html 檔> [截圖資料夾] [choicePolicy: good|first|last]
const path=require('path');
const {chromium}=require(path.join(process.env.USERPROFILE||'C:/Users/user','node_modules','playwright'));
(async()=>{
  const file=path.resolve(process.argv[2]);const shots=process.argv[3]||null;const policy=process.argv[4]||'good';
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1280,height:860}});
  const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,300));});
  await p.goto('file:///'+file.replace(/\\/g,'/'),{waitUntil:'commit',timeout:120000});
  await p.waitForFunction(()=>window.__booted===true,null,{timeout:120000});
  const fs=require('fs');if(shots)fs.mkdirSync(shots,{recursive:true});
  let n=0,lastKey='',stuck=0,steps=0;const seen=new Set();
  const snap=async(name)=>{if(!shots)return;await p.waitForTimeout(1800);await p.screenshot({path:path.join(shots,String(++n).padStart(2,'0')+'_'+name+'.png')});};
  await snap('title');
  while(steps++<400){
    const st=await p.evaluate(()=>({state:S.state,busy:S.busy,act:S.act,beat:S.beat,onNote:S.onNote,choice:S.choice&&S.state==='CHOICE'?S.choice.opts.map(o=>!!o.good):null}));
    if(st.busy||st.state==='TURN'||st.state==='LIFTING'){await p.waitForTimeout(250);continue;}
    const key=st.state+'|'+st.act+'|'+st.beat;
    if(key===lastKey){if(++stuck>40){errs.push('STUCK at '+key);break;}}else{stuck=0;lastKey=key;}
    if(st.state==='DONE'){await snap('ending');break;}
    if(st.onNote&&!seen.has(key)){seen.add(key);await snap('note_a'+st.act+'b'+st.beat);}
    if(st.state==='CHOICE'){if(!seen.has(key)){seen.add(key);await snap('choice_a'+st.act+'b'+st.beat);}let idx=0;if(policy==='good')idx=Math.max(0,st.choice.indexOf(true));else if(policy==='last')idx=st.choice.length-1;await p.evaluate(i=>__api.pickOption(i),idx);await p.waitForTimeout(900);continue;}
    if(st.state==='FLAP'){await p.evaluate(()=>__api.liftFlap());await p.waitForTimeout(1300);if(!seen.has(key+'f')){seen.add(key+'f');await snap('feedback_a'+st.act+'b'+st.beat);}continue;}
    await p.evaluate(()=>__api.advance());await p.waitForTimeout(150);
  }
  const fin=await p.evaluate(()=>S.state);
  console.log(JSON.stringify({file:path.basename(file),final:fin,steps,errors:errs},null,1));
  await b.close();process.exit(errs.length||fin!=='DONE'?1:0);
})().catch(e=>{console.error('FATAL',e);process.exit(2);});

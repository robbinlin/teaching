const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const S=process.argv[2]; const meta=JSON.parse(fs.readFileSync('youtube/youtube_metadata.json','utf8'));
(async()=>{
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
  for(const v of meta){
    const m=v.title.match(/第(\d+)章 EP(\d) (.*)$/); const ch=m[1],ep=m[2],t=m[3];
    const img='file://'+path.resolve(`${S}/yt2/frames/${String(v.order).padStart(2,'0')}.png`);
    const html=`<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file:///home/user/teaching/animations/fonts/700.css"><link rel="stylesheet" href="file:///home/user/teaching/animations/fonts/400.css">
<style>html,body{margin:0;width:1280px;height:720px;overflow:hidden;font-family:'LXGW WenKai TC',sans-serif}
.bg{position:absolute;inset:0;background:url(${img}) center 70%/118% auto no-repeat}
.band{position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(to top,rgba(255,250,240,.98) 0,rgba(255,250,240,.96) 60%,rgba(255,250,240,0) 100%)}
.tag{position:absolute;left:48px;top:40px;background:#1d3a6b;color:#fff;font-weight:700;font-size:44px;padding:8px 26px;border-radius:14px;box-shadow:3px 4px 0 #0b1f3f;transform:rotate(-2deg)}
.ch{position:absolute;left:52px;bottom:150px;font-size:60px;font-weight:700;color:#b3261e}
.tt{position:absolute;left:52px;right:52px;bottom:58px;font-size:${t.length>14?64:76}px;font-weight:700;color:#1b1b1b;line-height:1.15;text-shadow:0 0 12px rgba(255,250,240,1)}
.ul{position:absolute;left:52px;bottom:34px;width:420px;height:8px;background:#e0a100;border-radius:4px;transform:rotate(-.6deg)}
</style></head><body><div class="bg"></div><div class="band"></div>
<div class="tag">高等體育統計</div><div class="ch">第${ch}章・EP${ep}</div><div class="tt">${t}</div><div class="ul"></div></body></html>`;
    fs.writeFileSync(`${S}/yt2/_t.html`,html); await pg.goto('file://'+path.resolve(`${S}/yt2/_t.html`),{waitUntil:'load'}); await pg.evaluate(()=>document.fonts.ready); await pg.waitForTimeout(300);
    const out=`${S}/yt2/thumbs/${String(v.order).padStart(2,'0')}.jpg`;
    await pg.screenshot({path:out,type:'jpeg',quality:88}); console.log(out, fs.statSync(out).size);
  }
  await b.close();
})();

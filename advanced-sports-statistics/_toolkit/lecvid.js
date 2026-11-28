/* 投影片頁上方的「完整講解影片」。影片 ID 統一寫在網站根目錄的 lecture-videos.js；沒有 ID 的章節不顯示。 */
(function(){
  var box=document.getElementById('lecVid');if(!box)return;
  var ch=box.getAttribute('data-ch'),v=(window.LECTURE_VIDEOS||{})[ch];
  if(!v)return;
  var id=typeof v==='string'?v:v.id,min=typeof v==='object'?v.minutes:null;
  if(!/^[A-Za-z0-9_-]{11}$/.test(id||''))return;
  box.innerHTML='<div class="lecvid-head"><h3>完整講解影片</h3><p>逐頁講解本章投影片'+(min?'，約 '+min+' 分鐘':'')+
    '。想自己翻頁看重點，可以直接用下方的投影片。<a href="https://www.youtube.com/watch?v='+id+'" target="_blank" rel="noopener">在 YouTube 開啟</a></p></div>'+
    '<div class="lecvid-frame"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'?rel=0" title="第 '+ch+' 章完整講解影片" loading="lazy" '+
    'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>';
  box.hidden=false;
})();

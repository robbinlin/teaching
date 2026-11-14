# 課程網站建置工具組（高等體育統計版，供其他課程複用）

這是 https://robbinlin.github.io/advanced-sports-statistics/ 的產生程式。
它把「每章一份 content.json＋講義圖片＋SPSS 指南＋資料檔」組成靜態網站，
加上 Google 登入、雲端進度與教師頁。複製到新課程時，要改的地方都列在下面。

## 檔案

| 檔案 | 作用 |
|---|---|
| `content-spec.md` | 給撰寫者（或子代理）的每章 content.json 規格：影片、概念、測驗、作業、講義對照 |
| `build.py` | 單章頁面組裝：base.css＋extra.css＋body.html＋prelude.js＋widgets.js＋main.js，content.json 內嵌為 `#chData` |
| `static.py` | 輸出 GitHub Pages 版：`/index.html`、`/chN/`、`/teacher/`，並注入 epflow、filelinks、auth |
| `widgets.js` | 互動工具（`W.<名稱>`）：condprob binom normal clt sdse ci ztest design ttest tails anova fwer chi2 fisher corr r2 simpson interact rate |
| `main.js` | 章節頁邏輯：步驟分頁、影片、概念、講義、SPSS 指南、測驗、作業、本機進度（localStorage）|
| `epflow.js/.css` | Step 1「看一集、玩一個工具」：`EP_MAP` 決定每集後面接哪些概念 |
| `filelink.js/.css` | 把指南內出現的資料檔名變成下載連結（`window.FILEMAP`）|
| `auth.js/.css` | Firebase Google 登入、本機＋雲端進度合併、首頁個人進度、教師入口 |
| `teacher.html` | 教師頁：學生進度表、排序搜尋、作業答案明細、CSV 匯出 |
| `intro.*` | 首頁 Galton board 動畫 |
| `example-*.json` | content.json、source.json、資料 manifest 的實例 |

## 換到新課程時要改

- `build.py`：`R`（工作根目錄）、`WIDGETS`（每章掛哪些工具，順序對應概念；None 表示無工具）、`DECK`（講義檔名）、`<title>` 課名
- `static.py`：章數 `range(…)`、`EPMAP`、第 1 章特例段（本課第 1 章是另一套模板，新課程可刪掉該段，全部用 build.py 模板）、首頁的 claude.ai artifact 連結替換
- `auth.js`：`CFG`（新 Firebase 專案的 web config）、`TEACHER`（教師 email）、`CH_KEYS`（localStorage key 前綴與章數）、`OWNER` key
- `teacher.html`：Firebase config、章數、課名
- `main.js` / `prelude.js`：localStorage `KEY` 前綴（每門課要不同，避免同網域互相覆蓋）

## Firestore 規則（本課使用）

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isTeacher() { return request.auth != null && request.auth.token.email == 'TEACHER_EMAIL'; }
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      allow read: if isTeacher();
      match /progress/{ch} {
        allow read: if request.auth != null && (request.auth.uid == uid || isTeacher());
        allow write: if request.auth != null && request.auth.uid == uid
                     && request.resource.data.keys().size() < 40;
      }
    }
    match /{path=**}/progress/{ch} { allow read: if isTeacher(); }
  }
}
```

資料模型：`users/{uid}` {email,name,photo,lastSeen}；`users/{uid}/progress/chN` {chapter,state(JSON 字串),pct,steps,quizCorrect,hwAnswered,hwTotal,updatedAt}。

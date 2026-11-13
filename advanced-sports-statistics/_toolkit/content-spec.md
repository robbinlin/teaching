# Chapter content spec — 高等體育統計 interactive chapter pages

You are authoring the **content data** for one chapter page of a graduate statistics course (國立體育大學「高等體育統計」, 林彥光老師). The page template and interactive widgets are built separately; you only produce one JSON file. All text is Traditional Chinese (Taiwan usage), plain and direct, the way a knowledgeable teacher talks. No emoji. No marketing tone.

Chapter 1 is already done and is the model. Its content lives inside `/tmp/claude-0/-home-claude/cd232513-5fae-5ea8-89b2-c8c53a010923/scratchpad/ch1site/template.html` (look at the `VIDEOS`, `QUIZ`, `HW`, `STEP_REF`, `SEC_REF` constants and the concept blocks) — match its tone, length and level of precision.

## Sources (the ONLY sources of truth)

Scratch root: `/tmp/claude-0/-home-claude/cd232513-5fae-5ea8-89b2-c8c53a010923/scratchpad`

- `chN/source.json` — `guide_md` (the teacher-verified SPSS walkthrough markdown, or for ch2/3 the concept/correction notes), `learning` (concepts, example, practice answer, self-check), `datasets`, `videos` (title + full YouTube description incl. chapter timestamps).
- `chN/slides/s-01.jpg …` — the lecture deck rendered as images; `chN/sheet.jpg` is a contact sheet of all slides with labels `s-01`… Use the Read tool to view images.
- `/mnt/user-data/uploads/Claude統計課程/_site_build/src/course-website/app/page.tsx` — the `chapters` array (title, objectives), the `assignments` object (homework questions per chapter) and `practicePrompts`.

**Every number you write must appear in, or be directly computed from, these sources.** Never invent statistics. If the guide gives an SPSS output value, use it verbatim (same rounding). If you compute something (e.g. IQR from given Q1/Q3, an expected count from given margins), the inputs must be in the sources; show the arithmetic in the explanation. When the sources contain a correction of the slides (e.g. "原投影片…有誤"), follow the correction.

## Output

Write `chN/content.json` (UTF-8, valid JSON) with exactly this shape:

```json
{
  "id": 4,
  "title": "單樣本及雙樣本檢定",
  "eyebrow": "CH 04 / 08 · 兩組比較",
  "lede": "2 sentences: what students do on this page, concrete (data names, what they will play with).",
  "objectives": ["copied from page.tsx chapters[].objectives; if only one objective there, write 3 concise ones grounded in the guide/learning"],
  "videos": [
    {"k":"ep1","id":"<YouTube ID from the table below>","t":"EP1 <short title after '第N章 '>","d":"one-sentence summary taken from the description's first paragraph","c":[["0:00","short label"],["0:29","…"]]}
  ],
  "concepts": [
    {"title":"from learning.concepts[i][0]","text":"learning.concepts[i][1] verbatim or lightly tightened","tip":"1–2 sentences. If a widget is attached to this concept (see chapter notes), tell the student exactly what to try in it and what they should notice; otherwise a concrete pitfall or worked mini-example from the sources."}
  ],
  "example": "learning.example",
  "slidesNote": "one sentence naming the deck and slide count, e.g. 「單樣本及雙樣本檢定（lin20260411），共 23 張。」",
  "stepRefs": [["exact beginning text of a ### or #### heading in guide_md", [22], "one sentence: how the slide relates / what differs from the SPSS screenshots below"]],
  "secRefs": [["exact beginning text of a ## heading in guide_md", [12], "one sentence"]],
  "quiz": [
    {"id":"q1","p":"question","o":["correct or not…","…","…","…"],"a":0,"e":"why the answer is right, with numbers from sources"},
    {"id":"q3","p":"numeric question","num":14,"tol":0.01,"unit":"歲","hint":"short nudge shown when wrong","e":"worked answer"}
  ],
  "think": {"p":"practicePrompts[N] from page.tsx","answer":["learning.answer items"],"check":["learning.check items"]},
  "hw": {
    "title":"assignments[N].title","source":"assignments[N].source",
    "questions":[
      {"id":"h1","type":"long","p":"prompt from page.tsx","ref":"<h4>SPSS 實際輸出</h4><p>…</p> or a small <div class=\"tbl-wrap\"><table>… HTML reference answer built ONLY from guide_md/learning numbers"},
      {"id":"h2","type":"single","p":"…","o":["…"],"a":0,"e":"…"},
      {"id":"h3","type":"multi","p":"…","o":["…"],"a":[0,1],"e":"…"},
      {"id":"h4","type":"num","p":"…","num":80.0,"tol":0.05,"hint":"…","e":"…"}
    ]
  }
}
```

Rules:
- `quiz`: exactly 8 items, mixing ~6 multiple-choice (4 options) and 1–2 numeric. Vary the position of the correct option (do not always use index 0). Test understanding of this chapter's real pitfalls (denominators, SE vs SD, direction of tests, paired vs independent, Bonferroni, expected counts, R² vs significance, confounding vs interaction, offset…) using the chapter's real numbers. Explanations 1–3 sentences. At least one question should be answerable by using the chapter's widget(s) (say so in the question, like ch1 q8).
- `hw.questions`: one entry per question in `assignments[N]` from page.tsx, same order, same prompt text. Keep the original `type` mapping: page.tsx `long`→`long`, `single`/`method`/`tf`→`single`, `multiple`→`multi`, `numeric`→`num`. For `single`/`multi`/`num`, determine the correct answer from the sources and give `e`. For `long`, give `ref` HTML with the verified results and a short 解讀方向. If the sources truly do not contain the result for a question, write a `ref` that lists the method/steps the guide gives and say plainly 「指南未列出此題數值，請以自己的 SPSS 輸出為準」— never fabricate.
- `stepRefs`/`secRefs`: view the slides and map every slide that shows an SPSS procedure, an SPSS output, a worked example, or the homework, to the guide heading where that procedure is performed. Heading text must be the **exact start** of a real `###`/`####` (stepRefs) or `##` (secRefs) heading line in guide_md (without the #'s), long enough to be unique (headings like 「步驟 1」 repeat across sections — include the text after the colon). For ch2/ch3 (`guide_type: concept`), the guide uses `##`/`###` headings that cite slide numbers (第11張 etc.) — map those. 2–10 refs is typical. Slide numbers are 1-based (s-05.jpg = 5).
- `videos`: chapter labels shortened to ≤ 14 characters; keep every timestamp from the description.
- Validate: run `python3 -c "import json;json.load(open('chN/content.json'))"`, and check every stepRefs/secRefs heading prefix actually matches a heading line in guide_md (write a 5-line python check). Fix until clean.

YouTube IDs by package folder:
04 goiBgB1GuLg · 05 nMa1HduEWuM · 06 5NTofmZ_2w0 · 07 SMXF4_1tHzQ · 08 6sx2vMa3HiI · 09 rwPAh8gYzqo · 10 VQ9KPGtQwaE · 11 I-aPty_XsEo · 12 iNi71Ha2MXA · 13 a_WCEHIq6nA · 14 UmhHfcAzQ54 · 15 rcOCCudXJYM · 16 XdRPIXsamlw · 17 o-69HaKx8BU · 18 ZgAKGdTo4ho · 19 FJk6YZknzWg · 20 DuW-t8ZCPZ0 · 21 DqENn3WWUGM · 22 5ioAPDGeEQs · 23 bFQn5uNmCJs · 24 1vm4lJZItXc

When done, reply with: path written, a 3-line summary, and any question where the sources lacked a verified answer.

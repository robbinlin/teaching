"""第 5 章資料檔：依講義表 5-3～5-7 產生 CSV（UTF-8 加 BOM），再讀回來重算統計量核對。
  python -X utf8 make_data.py          產生 data/*.csv、data/manifest.json 並驗證
  python -X utf8 make_data.py --check  只讀現有 CSV 驗證
資料逐格對照 slides/s-13、s-14、s-17、s-20、s-23、s-26。
"""
import csv, json, sys
from pathlib import Path
import numpy as np
from scipy import stats

D = Path(__file__).resolve().parent / 'data'

# 表 5-3（講義第 13–14 張）：識別碼 1–30；性別 1＝男生 2＝女生；班級 1＝循環 2＝舞蹈
SEX = [1] * 12 + [2] * 18
CLS = [1] * 10 + [2] * 2 + [2] * 18
# 表 5-4（第 17 張）
V = [20, 18, 17, 19, 20, 16, 18, 19]
SV = [16, 15, 17, 14, 15, 13, 14, 12]
# 表 5-5（第 20 張）
PRE = [18, 20, 17, 16, 15, 18, 19, 17]
POST = [20, 24, 20, 19, 20, 22, 21, 21]
# 表 5-6（第 23 張）：識別碼、組別、臥舉最大重量
BENCH = [(1, 1, 193), (2, 1, 190), (3, 1, 195), (4, 1, 175), (5, 1, 188), (6, 2, 148), (7, 2, 170), (8, 2, 172),
         (9, 2, 168), (10, 2, 165), (11, 3, 170), (12, 3, 157), (13, 3, 140), (14, 3, 148), (15, 3, 150)]
# 表 5-7（第 26 張）：方法 1＝scrimmage 2＝動作訓練；位置 1＝投手 2＝野手。先左半（方法 1）再右半（方法 2）
TWO = ([(1, 1, x) for x in [29, 30, 24, 23, 28, 29]] + [(1, 2, x) for x in [34, 34, 31, 30, 32, 28]] +
       [(2, 1, x) for x in [29, 34, 34, 38, 28, 29]] + [(2, 2, x) for x in [28, 34, 31, 26, 27, 32]])

FILES = [
    ('table5-3_chi2.csv', '表 5-3　卡方考驗原始資料（30 人的性別與班級）',
     ['識別碼', '性別', '班級', '性別名稱', '班級名稱'],
     [(i + 1, s, c, {1: '男生', 2: '女生'}[s], {1: '循環', 2: '舞蹈'}[c]) for i, (s, c) in enumerate(zip(SEX, CLS))]),
    ('table5-4_serve_independent.csv', '表 5-4　發球分數（正選與候補各 8 人，獨立樣本）',
     ['正選球員', '候補球員'], list(zip(V, SV))),
    ('table5-5_serve_paired.csv', '表 5-5　配對 t 考驗資料（同 8 人季節前、季節後）',
     ['球員', '季節前', '季節後'], [(i + 1, a, b) for i, (a, b) in enumerate(zip(PRE, POST))]),
    ('table5-6_benchpress_oneway.csv', '表 5-6　單因子變異數分析資料（三組各 5 人的臥舉最大重量）',
     ['識別碼', '組別', '臥舉最大重量'], BENCH),
    ('table5-7_fielding_twoway.csv', '表 5-7　二因子變異數分析資料（方法 × 位置，每格 6 人）',
     ['方法', '位置', '分數', '方法名稱', '位置名稱'],
     [(m, p, x, {1: 'scrimmage', 2: '動作訓練'}[m], {1: '投手', 2: '野手'}[p]) for m, p, x in TWO]),
]


def make():
    D.mkdir(exist_ok=True)
    for name, label, head, rows in FILES:
        with open(D / name, 'w', encoding='utf-8-sig', newline='') as f:
            w = csv.writer(f)
            w.writerow(head)
            w.writerows(rows)
    man = [{'file': n, 'label': l, 'ext': 'CSV'} for n, l, _, _ in FILES]
    (D / 'manifest.json').write_text(json.dumps(man, ensure_ascii=False, indent=1), encoding='utf-8')


def rd(name):
    with open(D / name, encoding='utf-8-sig', newline='') as f:
        r = list(csv.reader(f))
    return r[0], r[1:]


def near(a, b, tol=5e-4):
    assert abs(a - b) <= tol, (a, b)


def check():
    # 卡方
    _, rows = rd('table5-3_chi2.csv')
    assert len(rows) == 30
    tab = np.zeros((2, 2), int)          # 列＝班級（循環、舞蹈），欄＝性別（男、女），同講義圖 5-2
    for r in rows:
        tab[int(r[2]) - 1, int(r[1]) - 1] += 1
    assert tab.tolist() == [[10, 0], [2, 18]], tab
    chi, p, df, E = stats.chi2_contingency(tab, correction=False)
    chiY, pY, _, _ = stats.chi2_contingency(tab, correction=True)
    near(chi, 22.5); near(chiY, 18.90625); assert df == 1 and E.min() == 4
    print('卡方  次數表', tab.tolist(), ' 期望', E.tolist())
    print('      Pearson χ²(1)=%.3f p=%.2e；校正後 χ²=%.3f p=%.2e；Fisher p=%.2e' % (chi, p, chiY, pY, stats.fisher_exact(tab)[1]))
    # 獨立 t
    _, rows = rd('table5-4_serve_independent.csv')
    v = np.array([int(r[0]) for r in rows]); sv = np.array([int(r[1]) for r in rows])
    assert len(v) == 8 and v.sum() == 147 and sv.sum() == 116
    t = stats.ttest_ind(v, sv); w = stats.ttest_ind(v, sv, equal_var=False)
    near(v.mean(), 18.375); near(sv.mean(), 14.5); near(v.std(ddof=1), 1.408); near(sv.std(ddof=1), 1.604); near(t.statistic, 5.136)
    print('獨立t M=%.3f、%.2f SD=%.3f、%.3f t(14)=%.3f p=%.5f；Welch t=%.3f df=%.3f p=%.5f' % (v.mean(), sv.mean(), v.std(ddof=1), sv.std(ddof=1), t.statistic, t.pvalue, w.statistic, w.df, w.pvalue))
    # 相依 t
    _, rows = rd('table5-5_serve_paired.csv')
    a = np.array([int(r[1]) for r in rows]); b = np.array([int(r[2]) for r in rows]); d = b - a
    assert len(a) == 8 and a.sum() == 140 and b.sum() == 167 and d.sum() == 27
    t = stats.ttest_rel(b, a)
    near(d.mean(), 3.375); near(d.std(ddof=1), 1.0607); near(t.statistic, 9.0)
    print('相依t M=%.2f、%.3f 平均差=%.3f 差值SD=%.4f t(7)=%.3f p=%.6f；r=%.3f' % (a.mean(), b.mean(), d.mean(), d.std(ddof=1), t.statistic, t.pvalue, stats.pearsonr(a, b)[0]))
    # 單因子
    _, rows = rd('table5-6_benchpress_oneway.csv')
    assert len(rows) == 15 and [int(r[0]) for r in rows] == list(range(1, 16))
    g = [np.array([int(r[2]) for r in rows if int(r[1]) == k]) for k in (1, 2, 3)]
    assert [len(x) for x in g] == [5, 5, 5] and [int(x.sum()) for x in g] == [941, 823, 765]
    allv = np.concatenate(g); gm = allv.mean()
    ssb = sum(len(x) * (x.mean() - gm) ** 2 for x in g); ssw = sum(((x - x.mean()) ** 2).sum() for x in g)
    F = stats.f_oneway(*g)
    near(ssb, 3217.6); near(ssw, 1126.0); near(F.statistic, 17.1453)
    print('單因子 M=%s SSb=%.1f SSw=%.1f MSb=%.1f MSw=%.3f F(2,12)=%.3f p=%.6f' % ([round(float(x.mean()), 1) for x in g], ssb, ssw, ssb / 2, ssw / 12, F.statistic, F.pvalue))
    # 二因子
    _, rows = rd('table5-7_fielding_twoway.csv')
    assert len(rows) == 24
    c = {(m, p): np.array([int(r[2]) for r in rows if (int(r[0]), int(r[1])) == (m, p)]) for m in (1, 2) for p in (1, 2)}
    assert all(len(x) == 6 for x in c.values())
    assert [int(c[k].sum()) for k in ((1, 1), (1, 2), (2, 1), (2, 2))] == [163, 189, 192, 178]
    A = np.concatenate(list(c.values())); GM = A.mean()
    mM = {m: np.concatenate([c[(m, 1)], c[(m, 2)]]).mean() for m in (1, 2)}
    mP = {p: np.concatenate([c[(1, p)], c[(2, p)]]).mean() for p in (1, 2)}
    ssM = 12 * sum((x - GM) ** 2 for x in mM.values()); ssP = 12 * sum((x - GM) ** 2 for x in mP.values())
    ssC = 6 * sum((x.mean() - GM) ** 2 for x in c.values()); ssI = ssC - ssM - ssP
    ssE = sum(((x - x.mean()) ** 2).sum() for x in c.values()); msE = ssE / 20
    near(ssM, 13.5); near(ssP, 6.0); near(ssI, 66.6667); near(ssE, 197.6667)
    out = []
    for nm, ss in (('方法', ssM), ('位置', ssP), ('交互作用', ssI)):
        out.append('%s F(1,20)=%.3f p=%.3f' % (nm, ss / msE, stats.f.sf(ss / msE, 1, 20)))
    print('二因子 細格平均', {k: round(float(x.mean()), 2) for k, x in c.items()}, '；'.join(out))
    print('      方法邊際 %.2f／%.2f  位置邊際 %.2f／%.2f  誤差 MS=%.3f' % (mM[1], mM[2], mP[1], mP[2], msE))
    print('全部核對通過')


if __name__ == '__main__':
    if '--check' not in sys.argv:
        make()
    check()

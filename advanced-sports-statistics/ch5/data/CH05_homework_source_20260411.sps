* Source: chapter 5 lecture 20260411 slides 24-25.
* Transcribed 26 observations; executed and verified in SPSS on 2026-09-04.
DATA LIST FREE /supplement gain.
BEGIN DATA
1 1.21
1 1.19
1 1.17
1 1.23
1 1.29
1 1.14
2 1.34
2 1.41
2 1.38
2 1.29
2 1.36
2 1.42
2 1.37
2 1.32
3 1.45
3 1.45
3 1.51
3 1.39
3 1.44
4 1.31
4 1.32
4 1.28
4 1.35
4 1.41
4 1.27
4 1.37
END DATA.
DATASET NAME SupplementsVerified.
VALUE LABELS supplement 1 'A' 2 'B' 3 'C' 4 'D'.
VARIABLE LABELS gain 'Weight gain after one week (kg)'.
VARIABLE LEVEL supplement (NOMINAL) gain (SCALE).
FORMATS supplement (F1.0) gain (F4.2).
EXECUTE.

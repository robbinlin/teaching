* Source: 兩個類別變數之檢定_lin20220520.pptx, slide 8.
* Four aggregated cells. Apply count as the frequency weight before analysis.
NEW FILE.
DATA LIST FREE /job_level preference count.
BEGIN DATA
1 1 55
1 0 45
0 1 70
0 0 30
END DATA.
DATASET NAME CardPreferenceVerified.
VARIABLE LABELS job_level 'Job level' preference 'Card system preference' count 'Frequency'.
VALUE LABELS job_level 0 'Non-manager' 1 'Manager'
 /preference 0 'Old system' 1 'New system'.
VARIABLE LEVEL job_level preference (NOMINAL) count (SCALE).
FORMATS job_level preference (F1.0) count (F3.0).
WEIGHT OFF.
EXECUTE.

* Source: chapter 6 lecture lin20220520 slide 15.
* Four aggregated cells; frequency weighting is a separate teaching step.
NEW FILE.
DATA LIST FREE /treatment response count.
BEGIN DATA
1 1 12
1 0 3
0 1 3
0 0 14
END DATA.
DATASET NAME CFSVerified.
VARIABLE LABELS treatment 'Treatment' response 'Improvement after six weeks' count 'Frequency'.
VALUE LABELS treatment 0 'Placebo' 1 'A drug'
 /response 0 'Not improved' 1 'Improved'.
VARIABLE LEVEL treatment response (NOMINAL) count (SCALE).
FORMATS treatment response (F1.0) count (F2.0).
WEIGHT OFF.
EXECUTE.

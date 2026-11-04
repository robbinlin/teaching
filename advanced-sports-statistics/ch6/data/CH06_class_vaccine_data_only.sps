* Source: 兩個類別變數之檢定_lin20220520.pptx, slide 17.
* Aggregated vaccination status by clinical severity.
NEW FILE.
DATA LIST FREE /dose_status severe count.
BEGIN DATA
0 1 41
0 0 1504628
1 1 19
1 0 1152382
2 1 39
2 0 6298294
3 1 59
3 0 12031931
END DATA.
DATASET NAME VaccineVerified.
VARIABLE LABELS dose_status 'Vaccination status' severe 'Moderate or severe disease' count 'Frequency'.
VALUE LABELS dose_status 0 'Unvaccinated' 1 'One dose' 2 'Two doses' 3 'Three doses'
 /severe 0 'Mild or asymptomatic' 1 'Moderate or severe'.
VARIABLE LEVEL dose_status severe (NOMINAL) count (SCALE).
FORMATS dose_status severe (F1.0) count (F8.0).


WEIGHT OFF.
EXECUTE.

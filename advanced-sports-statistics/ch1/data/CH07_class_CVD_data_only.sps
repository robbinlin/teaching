* Chapter 7 classroom data source: CVD_All_spss.csv.
NEW FILE.
GET DATA
 /TYPE=TXT
 /FILE='F:\高等體育統計課程平台\CVD_All_spss.csv'
 /ENCODING='UTF8'
 /ARRANGEMENT=DELIMITED
 /DELCASE=LINE
 /DELIMITERS=","
 /QUALIFIER='"'
 /FIRSTCASE=2
 /IMPORTCASE=ALL
 /VARIABLES=
  id F8.0 cvd F1.0 age F3.0 sex F1.0 followup F2.0
  waist F8.2 sbp F8.2 dbp F8.2 glucose F8.2 hdl F8.2 triglyceride F8.2
  betel F1.0 alcohol F1.0 family F1.0 smoking F1.0 smoking_amount F8.2.
DATASET NAME CH07Class.
VARIABLE LABELS
 age 'Age (years)'
 waist 'Waist circumference'
 sbp 'Systolic blood pressure'
 dbp 'Diastolic blood pressure'
 glucose 'Blood glucose'
 hdl 'HDL cholesterol'
 triglyceride 'Triglyceride'.
VARIABLE LEVEL age waist sbp dbp glucose hdl triglyceride (SCALE).
EXECUTE.


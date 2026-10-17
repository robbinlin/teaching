DATASET DECLARE CH01AdultImportFinal.
DATASET ACTIVATE CH01AdultImportFinal.
* 第1章作業1：Adult Income.
GET DATA
  /TYPE=TXT
  /FILE='F:\高等體育統計課程平台\site-source\public\datasets\adult income1.csv'
  /ENCODING='UTF8'
  /ARRANGEMENT=DELIMITED
  /FIRSTCASE=2
  /DELCASE=LINE
  /DELIMITERS=","
  /QUALIFIER='"'
  /VARIABLES=
    age F3.0
    workclass A30
    fnlwgt F10.0
    education A20
    education_num F3.0
    marital_status A30
    occupation A30
    relationship A30
    race A30
    sex A8
    native_country A30
    income F12.2.
DATASET NAME CH01AdultImportFinal WINDOW=FRONT.
EXECUTE.


VARIABLE LEVEL age income (SCALE) sex (NOMINAL).
EXECUTE.

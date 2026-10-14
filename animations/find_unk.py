import json,sys,sherpa_onnx
d=sys.argv[1]+'/'; spec=json.load(open(sys.argv[2]))
cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=d+'model.onnx',voices=d+'voices.bin',tokens=d+'tokens.txt',data_dir=d+'espeak-ng-data',dict_dir=d+'dict',lexicon=d+'lexicon-us-en.txt,'+d+'lexicon-zh.txt'),num_threads=4),rule_fsts=d+'phone-zh.fst,'+d+'date-zh.fst,'+d+'number-zh.fst')
t=sherpa_onnx.OfflineTts(cfg)
for s in spec['scenes']:
  for l in s:
    print('>>',l['say'],flush=True); t.generate(l['say'],sid=60)

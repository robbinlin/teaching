import json,sys,wave,re,numpy as np,sherpa_onnx
m=sys.argv[1]+'/'; wavp=sys.argv[2]; tl=json.loads(re.sub(r'^[^=]*=\s*','',open(sys.argv[3]).read()).rstrip().rstrip(';'))
rec=sherpa_onnx.OfflineRecognizer.from_paraformer(paraformer=m+'model.int8.onnx',tokens=m+'tokens.txt',num_threads=4)
w=wave.open(wavp); sr=w.getframerate(); x=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(np.float32)/32768
for s in tl['scenes']:
  for l in s['lines']:
    a=int((s['t0']+l['t0'])*sr); b=int((s['t0']+l['t1'])*sr)
    st=rec.create_stream(); st.accept_waveform(sr,x[a:b]); rec.decode_stream(st)
    print('原文:',l['say']); print('辨識:',st.result.text); print()

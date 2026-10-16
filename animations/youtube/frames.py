import json, subprocess, sys, os
S=sys.argv[1]
meta=json.load(open('youtube/youtube_metadata.json'))
labels=json.load(open(S+'/labels.json'))
keys=list(json.load(open(S+'/meta.json')).keys())
for v,k in zip(meta,keys):
    # pick a frame ~40% in, but at least 4 s after the start of the nearest chapter
    FR={'c1e1':.62,'c1e3':.58,'c3e1':.6,'c3e2':.62,'3r':.62,'c5e3':.7,'c6e2':.6,'c7e1':.3,'c8e2':.55,'c6e1':.5}
    dur=v['seconds']; t=dur*FR.get(k,0.42)
    f=S+'/upload/'+v['file'].replace('_720p','_1080p')
    out=f"{S}/yt2/frames/{v['order']:02d}.png"
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(t),'-i',f,'-frames:v','1',out],check=True)
    print(v['order'],k,round(t,1),os.path.getsize(out))

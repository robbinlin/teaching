#!/bin/bash
# usage: mix_audio.sh <music.wav> <voice.wav> <out.wav>
# voice: per-sentence levels already matched by tts.py; here: slow dynaudnorm + gentle compressor, constant music bed (no ducking), two-pass linear loudnorm to -16 LUFS
set -e
music=$1; voice=$2; out=$3; pre=${out%.wav}_pre.wav
ffmpeg -y -loglevel error -i "$music" -i "$voice" -filter_complex \
 "[1:a]aresample=44100,dynaudnorm=f=100:g=5:p=0.9:m=15,acompressor=threshold=-28dB:ratio=4:attack=5:release=120:makeup=3,pan=stereo|c0=c0|c1=c0[v];[0:a]volume=0.22[m];[m][v]amix=inputs=2:duration=first:normalize=0[a]" -map "[a]" "$pre"
j=$(ffmpeg -hide_banner -i "$pre" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | python3 -c "import sys,re,json;print(json.dumps(json.loads(re.search(r'\{[^{}]*\"input_i\"[^{}]*\}',sys.stdin.read()).group(0))))")
I=$(echo "$j" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
set -- $I
ffmpeg -y -loglevel error -i "$pre" -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$1:measured_TP=$2:measured_LRA=$3:measured_thresh=$4:offset=$5:linear=true,aresample=44100" "$out"
echo "mixed -> $out (measured I=$1 LRA=$3)"

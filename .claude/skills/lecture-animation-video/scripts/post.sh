#!/bin/bash
# usage: post.sh <key e.g. c5e1v> <share name> [sheet rows]   (run from the animations/ directory)
set -e
k=$1; name=$2; rows=$3
mkdir -p out/check out/share
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 out/ep$k.mp4); echo "duration $dur"
[ -z "$rows" ] && rows=$(python3 -c "import math;print(math.ceil($dur/10))")
ffmpeg -hide_banner -i out/ep$k.mp4 -af loudnorm=I=-16:TP=-1.5:print_format=json -f null - 2>&1 | grep -E 'input_i|input_tp|input_lra'
ffmpeg -y -loglevel error -i out/ep$k.mp4 -vf "fps=1,scale=320:-1,tile=10x$rows" -frames:v 1 out/check/${k}_sheet.jpg
ffmpeg -y -loglevel error -i out/ep$k.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -preset medium -c:a copy -movflags +faststart "out/share/${name}_720p.mp4"
cp out/ep$k.mp4 "out/share/${name}_1080p.mp4"
ffmpeg -y -loglevel error -i out/ep$k.mp4 -vf scale=1280:720 -c:v libx264 -crf 27 -preset medium -c:a aac -b:a 128k -movflags +faststart out/share/${k%v}_small.mp4
echo "post $k done -> out/check/${k}_sheet.jpg (READ IT), out/share/${name}_720p.mp4, out/share/${k%v}_small.mp4"

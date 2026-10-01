#!/usr/bin/env bash
# Turns a stretch of a stock clip into a seamless loop master.
#
#   tools/make_loop.sh SOURCE START LENGTH FADE OUT.mkv
#
# Takes LENGTH + FADE seconds from START and dissolves the last FADE seconds
# into the first, so the loop ends on exactly the frame it starts on. Choose a
# stretch where the camera holds still: a dissolve across a moving camera shows
# as a double image. Then run tools/encode_video.sh on the result.
set -euo pipefail
src=$1; start=$2; len=$3; fade=$4; out=$5
total=$(python3 -c "print($len + $fade)")
offset=$(python3 -c "print($len - $fade)")
ffmpeg -y -loglevel error -ss "$start" -t "$total" -i "$src" -an -filter_complex \
  "[0:v]fps=24,split[a][b];[a]trim=start=${fade},setpts=PTS-STARTPTS[x];[b]trim=end=${fade},setpts=PTS-STARTPTS[y];[x][y]xfade=transition=fade:duration=${fade}:offset=${offset},format=yuv420p" \
  -c:v libx264 -preset slow -crf 10 "$out"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$out"

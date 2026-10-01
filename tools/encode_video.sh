#!/usr/bin/env bash
# Encodes a video master into the files the site serves.
#
#   tools/encode_video.sh MASTER OUT_PREFIX [START END]
#
# For each of two sizes (1280 × 720 for phones, 1920 × 1080 from 1024px wide)
# it writes an AV1 file, which modern browsers prefer, and an H.264 fallback,
# all silent and ready to stream (+faststart). It also writes the first frame
# as a WebP poster, which shows at once and stays for visitors who prefer
# reduced motion or save data.
#
#   OUT_PREFIX-720.av1.mp4   OUT_PREFIX-720.h264.mp4
#   OUT_PREFIX-1080.av1.mp4  OUT_PREFIX-1080.h264.mp4
#   OUT_PREFIX-poster.webp   (1920 wide)  OUT_PREFIX-poster-960.webp
#
# START and END (seconds) trim a stock clip before encoding. Budgets per file:
# 720p up to 1 MB, 1080p up to 2.5 MB. Lower the quality (raise CRF) if a file
# goes over. Needs ffmpeg with libsvtav1 and libx264.
set -euo pipefail

in=$1
out=$2
trim=()
if [[ $# -ge 4 ]]; then trim=(-ss "$3" -to "$4"); fi
mkdir -p "$(dirname "$out")"

# CRF per size: lower is higher quality and larger files.
AV1_CRF_720=${AV1_CRF_720:-40}
AV1_CRF_1080=${AV1_CRF_1080:-42}
X264_CRF_720=${X264_CRF_720:-27}
X264_CRF_1080=${X264_CRF_1080:-29}

encode() {
  local height=$1 width=$2
  local vf="scale=${width}:${height}:flags=lanczos:force_original_aspect_ratio=increase,crop=${width}:${height},fps=24,format=yuv420p"
  local av1_crf x264_crf
  if [[ $height == 720 ]]; then av1_crf=$AV1_CRF_720; x264_crf=$X264_CRF_720; else av1_crf=$AV1_CRF_1080; x264_crf=$X264_CRF_1080; fi
  ffmpeg -y -loglevel error "${trim[@]}" -i "$in" -an -vf "$vf" \
    -c:v libsvtav1 -preset 4 -crf "$av1_crf" -g 120 -svtav1-params tune=0:enable-overlays=1 \
    -movflags +faststart "$out-$height.av1.mp4"
  ffmpeg -y -loglevel error "${trim[@]}" -i "$in" -an -vf "$vf" \
    -c:v libx264 -preset veryslow -crf "$x264_crf" -profile:v high -level 4.0 -tune animation -g 120 \
    -movflags +faststart "$out-$height.h264.mp4"
}

encode 720 1280
encode 1080 1920

# Poster: the first frame of the trimmed clip, as WebP.
ffmpeg -y -loglevel error "${trim[@]}" -i "$in" -frames:v 1 -vf "scale=1920:1080:flags=lanczos:force_original_aspect_ratio=increase,crop=1920:1080" -c:v libwebp -quality 80 "$out-poster.webp"
ffmpeg -y -loglevel error -i "$out-poster.webp" -vf "scale=960:-2:flags=lanczos" -c:v libwebp -quality 80 "$out-poster-960.webp"

ls -l "$out"-*

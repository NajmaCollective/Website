#!/usr/bin/env python3
"""Check the site's video files against assets/video/manifest.json.

    python3 tools/validate_video_assets.py          check every file
    python3 tools/validate_video_assets.py --write  rebuild manifest.json from
                                                    sources.json and the files

Each asset in assets/video/sources.json must have four encodes (AV1 and H.264
at 720p and 1080p) and two posters. The check confirms each file's size and
checksum, the size budgets (720p up to 1 MB, 1080p up to 2.5 MB), that stock
footage carries a licence that allows commercial use, and that every file the
pages reference exists. Needs ffprobe for --write.
"""
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
folder = root / 'assets/video'
BUDGET = {720: 1_000_000, 1080: 2_500_000}
ALLOWED_STOCK_LICENCES = {'Mixkit Stock Video Free License'}
FILES = ['720.av1.mp4', '720.h264.mp4', '1080.av1.mp4', '1080.h264.mp4', 'poster.webp', 'poster-960.webp']


def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                          'stream=codec_name,width,height:format=duration', '-of', 'json', str(path)],
                         capture_output=True, text=True, check=True)
    data = json.loads(out.stdout)
    stream = data['streams'][0]
    info = {'width': stream['width'], 'height': stream['height'], 'codec': stream['codec_name']}
    if path.suffix == '.mp4':
        info['seconds'] = round(float(data['format']['duration']), 2)
    return info


def record(path):
    data = path.read_bytes()
    return {'path': str(path.relative_to(root)), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}


sources = json.loads((folder / 'sources.json').read_text())

if '--write' in sys.argv:
    assets = []
    for asset in sources['assets']:
        files = []
        for suffix in FILES:
            path = folder / f"{asset['id']}-{suffix}"
            files.append({**record(path), **probe(path)})
        assets.append({**asset, 'files': files})
    manifest = {'about': sources['about'], 'assets': assets}
    (folder / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')
    print(f"Wrote manifest.json: {len(assets)} assets, {sum(len(a['files']) for a in assets)} files.")

manifest = json.loads((folder / 'manifest.json').read_text())
ids = [a['id'] for a in sources['assets']]
assert [a['id'] for a in manifest['assets']] == ids, 'manifest.json is out of date: run with --write'
checked = 0
for asset in manifest['assets']:
    if asset['kind'] == 'stock video':
        assert asset['source']['license'] in ALLOWED_STOCK_LICENCES, f"{asset['id']}: licence"
        assert asset['source']['page_url'].startswith('https://'), asset['id']
        assert asset['alt'], f"{asset['id']}: stock video needs alt text for its poster"
    for f in asset['files']:
        path = root / f['path']
        data = path.read_bytes()
        assert len(data) == f['bytes'], f"Byte count: {f['path']}"
        assert hashlib.sha256(data).hexdigest() == f['sha256'], f"Checksum: {f['path']}"
        size = re.search(r'-(720|1080)\.', f['path'])
        if size:
            assert f['bytes'] <= BUDGET[int(size[1])], f"Over budget: {f['path']} is {f['bytes']:,} bytes"
            assert f['height'] == int(size[1]), f"Height: {f['path']}"
        checked += 1

# Every video file a page references must exist.
referenced = set()
for page in root.glob('*.html'):
    referenced |= set(re.findall(r'assets/video/[\w.-]+', page.read_text()))
missing = sorted(p for p in referenced if not (root / p).exists())
assert not missing, f'Missing: {missing}'
print(f'PASS: {len(ids)} videos, {checked} files; checksums, budgets, licences and page references verified.')

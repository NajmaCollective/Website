#!/usr/bin/env python3
"""Add larger WebP exports for stock photographs that the website draws wider than 960 CSS pixels.

The website crops photographs with object-fit: cover, so a landscape photograph in a
tall frame is drawn wider than the frame itself. On a 2x display those crops need
more than the 1920 px export. This script creates additional widths from the JPEG
masters with the same settings as the original exports (Lanczos resampling, WebP
quality 88) and records them in manifest.json so validate_stock_assets.py checks them.

Usage: python3 tools/export_stock_sizes.py ID:WIDTH[,WIDTH] ...
Example: python3 tools/export_stock_sizes.py j0dCClyasFk:2560 F4AS3X2swic:2560,3200
Requires Pillow with WebP support.
"""
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
manifest_path = root / 'assets/stock/manifest.json'
manifest = json.loads(manifest_path.read_text())
assets = {asset['id']: asset for asset in manifest['assets']}

added = 0
for arg in sys.argv[1:]:
    asset_id, _, widths = arg.rpartition(':')
    asset = assets[asset_id]
    master = asset['master']
    existing = {version['width'] for version in asset['web']}
    reference = next(version for version in asset['web'] if version['width'] == 1920)
    source = None
    for width in sorted(int(w) for w in widths.split(',')):
        if width in existing or width >= master['width']:
            continue
        source = source or Image.open(root / master['path']).convert('RGB')
        height = round(master['height'] * width / master['width'])
        path = reference['path'].replace('-1920.webp', f'-{width}.webp')
        source.resize((width, height), Image.LANCZOS).save(root / path, 'WEBP', quality=88, method=6)
        data = (root / path).read_bytes()
        asset['web'].append({'path': path, 'width': width, 'height': height, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
        asset['web'].sort(key=lambda version: version['width'])
        manifest['summary']['asset_files'] += 1
        manifest['summary']['total_asset_bytes'] += len(data)
        added += 1
        print(f'{path}  {width}x{height}  {len(data) / 1024:.0f} KB')

manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')
print(f'Added {added} exports; manifest now lists {manifest["summary"]["asset_files"]} image files.')

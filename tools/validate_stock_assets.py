#!/usr/bin/env python3
"""Verify the downloaded stock collection using only Python's standard library."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'assets/stock/manifest.json').read_text())
assets = manifest['assets']
seen = set()
checked = 0
for asset in assets:
    assert asset['id'] not in seen, f"Duplicate asset: {asset['id']}"
    seen.add(asset['id'])
    master = asset['master']
    source = asset['source']
    assert max(master['width'], master['height']) >= 3200, asset['id']
    assert min(master['width'], master['height']) >= 1800, asset['id']
    assert master['width'] <= source['native_width'], asset['id']
    assert master['height'] <= source['native_height'], asset['id']
    assert source['provider'] == 'Unsplash', asset['id']
    assert source['page_url'].startswith('https://unsplash.com/photos/'), asset['id']
    assert {960, 1920} <= {version['width'] for version in asset['web']}, asset['id']
    for version in [master, *asset['web']]:
        path = (root / version['path']).resolve()
        assert path.is_relative_to(root / 'assets/stock'), version['path']
        data = path.read_bytes()
        assert len(data) == version['bytes'] > 0, f"Byte count: {version['path']}"
        assert hashlib.sha256(data).hexdigest() == version['sha256'], f"Checksum: {version['path']}"
        assert version['width'] <= master['width'], version['path']
        assert version['height'] <= master['height'], version['path']
        checked += 1
assert len(assets) == manifest['summary']['unique_assets'] == 50
assert checked == manifest['summary']['asset_files']
print(f'PASS: {len(assets)} assets, {checked} image files; hashes, resolution and source bounds verified.')

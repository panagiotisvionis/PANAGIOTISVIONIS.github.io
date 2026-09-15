from pathlib import Path
import re

OLD = 'community=async function(){'
NEW = 'const community=async function(){'


def patch_community(path: str) -> None:
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    old_count = text.count(OLD)
    if old_count > 1:
        raise SystemExit(f'unexpected duplicate community assignments in {path}: {old_count}')
    if old_count == 1:
        text = text.replace(OLD, NEW, 1)
    elif NEW not in text:
        raise SystemExit(f'community function was not found in {path}')
    if re.search(r'(?m)^\s*community=async function', text):
        raise SystemExit(f'undeclared community assignment still present in {path}')
    if NEW not in text:
        raise SystemExit(f'declared community binding missing in {path}')
    p.write_text(text, encoding='utf-8')


# premium.js is the source of the enhancement layer; index.html contains the
# same layer inlined in the ES module used by production.
patch_community('docs/blueability/premium.js')
patch_community('docs/blueability/index.html')

index_path = Path('docs/blueability/index.html')
index = index_path.read_text(encoding='utf-8')
index = index.replace('>Κανονική προβολή<', '>Κανονική διαχείριση<')
index = re.sub(
    r'\./premium\.css\?v=[^"\']+',
    './premium.css?v=20260915pro5',
    index,
)
index_path.write_text(index, encoding='utf-8')

print('BlueAbility runtime binding fixed and production cache version bumped to pro5.')

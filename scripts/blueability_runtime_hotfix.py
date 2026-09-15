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

# Never leave the application body completely blank if a future runtime error
# happens before the first view is rendered. The real application replaces
# #main immediately after boot; this is only a resilient, static fallback.
main_empty = '<main class="main" id="main"></main>'
main_marker = 'BLUEABILITY_STATIC_FALLBACK_V1'
main_fallback = '''<main class="main" id="main"><!-- BLUEABILITY_STATIC_FALLBACK_V1 --><section class="ba-hero ba-static-fallback" style="background-image:linear-gradient(90deg,rgba(2,28,45,.92),rgba(4,71,91,.54)),url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&amp;fit=crop&amp;w=1800&amp;q=85')"><div><span class="tag">BlueAbility · Production</span><h1>Η θάλασσα είναι για όλους.</h1><p>Φορτώνουμε το προσωπικό σου περιβάλλον μάθησης, δράσεων και συμμετοχής.</p></div><div class="ba-hero-side"><div class="ba-glass"><small>Κατάσταση</small><strong style="font-size:1rem">Σύνδεση με το BlueAbility…</strong></div></div></section><div class="ba-stats"><article class="card ba-stat"><span class="ico">🌊</span><div><strong>18</strong><small>εκπαιδευτικές ενότητες</small></div></article><article class="card ba-stat"><span class="ico">🎮</span><div><strong>6</strong><small>διαδραστικές εμπειρίες</small></div></article><article class="card ba-stat"><span class="ico">✦</span><div><strong>∞</strong><small>διαδρομές συμμετοχής</small></div></article><article class="card ba-stat"><span class="ico">♿</span><div><strong>AA</strong><small>στόχος προσβασιμότητας</small></div></article></div><article class="card ba-panel"><h3>Το BlueAbility φορτώνει…</h3><p class="muted">Αν αυτή η οθόνη παραμένει για αρκετά δευτερόλεπτα, ανανέωσε τη σελίδα. Το περιεχόμενο δεν χάνεται.</p></article></main>'''
if main_marker not in index:
    if main_empty not in index:
        raise SystemExit('empty #main anchor not found and static fallback is missing')
    index = index.replace(main_empty, main_fallback, 1)

index = re.sub(
    r'\./premium\.css\?v=[^"\']+',
    './premium.css?v=20260915pro6',
    index,
)
index_path.write_text(index, encoding='utf-8')

print('BlueAbility runtime binding verified, static fallback installed, cache bumped to pro6.')

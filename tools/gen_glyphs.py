#!/usr/bin/env python3
"""가나 글자 윤곽(path)을 폰트에서 뽑아 src/kana-glyphs.js 로 저장합니다.

연상 그림 카드에서 '글자 획'을 정확한 모양으로 그린 뒤, 그 위에 그림 요소를
겹쳐 그리기 위한 재료입니다. 폰트: Noto Sans CJK (kana 포함).
사용: python3 tools/gen_glyphs.py
"""
import pathlib
import sys

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONT = pathlib.Path('/usr/share/fonts/pickle-hwp/NotoSansCJKkr-Regular.otf')
OUT = ROOT / 'src' / 'kana-glyphs.js'

HIRA = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'
KATA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
BOX = 134      # 200x200 카드 안에서 글자가 차지할 크기 (참고용)
SCALE = 0.152  # 모든 글자 공통 배율 (글자끼리 크기 비율을 유지)
CENTER = 100


def main() -> None:
    if not FONT.exists():
        sys.exit(f'font missing: {FONT}')
    font = TTFont(str(FONT))
    cmap = font.getBestCmap()
    glyphs = font.getGlyphSet()

    rows = []
    for ch in HIRA + KATA:
        name = cmap.get(ord(ch))
        if not name:
            sys.exit(f'no glyph for {ch}')
        gs = glyphs[name]
        bp = BoundsPen(glyphs)
        gs.draw(bp)
        if bp.bounds is None:
            sys.exit(f'empty bounds for {ch}')
        x0, y0, x1, y1 = bp.bounds
        w, h = x1 - x0, y1 - y0
        s = SCALE
        tx = CENTER - (x0 + w / 2) * s
        ty = CENTER + (y0 + h / 2) * s
        pen = SVGPathPen(glyphs)
        gs.draw(pen)
        d = pen.getCommands()
        t = f'translate({tx:.1f},{ty:.1f}) scale({s:.3f},{-s:.3f})'
        rows.append((ch, d, t))

    body = ',\n'.join(
        f'  {ch!r}: {{ d: {d!r}, t: {t!r} }}'.replace("'", '"')
        for ch, d, t in rows
    )
    js = (
        '/* ============================================================\n'
        '   가나 글자 윤곽 — tools/gen_glyphs.py 가 폰트에서 추출해 만든 파일\n'
        '   d: 1000단위 글자 외곽선, t: 200x200 카드 좌표로 옮기는 변환\n'
        '   ============================================================ */\n'
        'var KANA_GLYPH = {\n' + body + '\n};\n'
    )
    OUT.write_text(js, encoding='utf-8')
    print(f'wrote {OUT} ({len(rows)} glyphs, {len(js):,} chars)')


if __name__ == '__main__':
    main()

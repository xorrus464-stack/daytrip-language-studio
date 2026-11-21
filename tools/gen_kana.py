#!/usr/bin/env python3
"""가나 연상 그림 카드 데이터를 만듭니다.

- 글자 윤곽은 src/kana-glyphs.js (폰트에서 추출) 를 그대로 쓰고,
- 그 위/아래에 한국어 발음 첫소리와 모양이 바로 연결되는 그림(back/front)을 얹습니다.
사용: python3 tools/gen_kana.py            # src/data-kana.js 생성
      python3 tools/gen_kana.py --preview  # qa/_kana-sheet.png 미리보기
"""
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'data-kana.js'


# ---------------------------------------------------------------- helpers
def eye(x, y, r=4.4, lx=1.0, ly=-0.4):
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="#2B3A32"/>'
            f'<circle cx="{x + lx:.1f}" cy="{y + ly:.1f}" r="{r * .34:.1f}" fill="#fff" opacity=".9"/>')


def closed_eye(x, y, r=7, sw=3.4):
    return (f'<path d="M{x - r} {y}q{r} {-r * .85:.1f} {r * 2} 0" stroke="#2B3A32" '
            f'stroke-width="{sw}" fill="none" stroke-linecap="round"/>')


def blush(x, y, rx=9, ry=5.4):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#EE9F8B" opacity=".5"/>'


def smile(x, y, w=9, h=7, color='#2B3A32', sw=3.4):
    return (f'<path d="M{x - w} {y}q{w} {h} {w * 2} 0" stroke="{color}" stroke-width="{sw}" '
            f'fill="none" stroke-linecap="round"/>')


def mouth(cx, cy, rx, ry, inner='#7E3A33', tongue='#E58A76', teeth=False):
    s = f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{inner}"/>'
    s += f'<ellipse cx="{cx}" cy="{cy + ry * .5:.1f}" rx="{rx * .6:.1f}" ry="{ry * .33:.1f}" fill="{tongue}"/>'
    if teeth:
        s += (f'<path d="M{cx - rx + 3} {cy - ry + 1}h{(rx - 3) * 2:.0f}v{ry * .3:.0f}'
              f'h-{(rx - 3) * 2:.0f}z" fill="#fff" opacity=".95"/>')
    return s


def spark(x, y, s=7, c='#F2CE6B', sw=3.0):
    return (f'<path d="M{x - s} {y}H{x + s}M{x} {y - s}V{y + s}" stroke="{c}" stroke-width="{sw}" '
            f'stroke-linecap="round"/>')


def star(x, y, s=9, c='#F2CE6B'):
    return (f'<path d="M{x} {y - s}l{s * .26:.1f} {s * .62:.1f} {s * .68:.1f} {s * .22:.1f}'
            f'-{s * .5:.1f} {s * .46:.1f} {s * .16:.1f} {s * .7:.1f}'
            f'-{s * .6:.1f} -{s * .42:.1f} -{s * .6:.1f} {s * .42:.1f}'
            f'{s * .16:.1f} -{s * .7:.1f} -{s * .5:.1f} -{s * .46:.1f}'
            f'{s * .68:.1f} -{s * .22:.1f}z" fill="{c}"/>')


def drop(x, y, s=5.0, c='#9CC4E0'):
    return (f'<path d="M{x} {y - s * 1.6:.1f}c-{s * .9:.1f} {s * 1.2:.1f} -{s:.1f} {s * 1.9:.1f} 0 {s * 1.9:.1f}'
            f's{s:.1f} -{s * .7:.1f} 0 -{s * 1.9:.1f}z" fill="{c}"/>')


def sound(cx, cy, c='#E58A76', n=2, sw=3.2):
    out = ''
    for i in range(n):
        r = 10 + i * 7
        out += (f'<path d="M{cx + r * .55:.1f} {cy - r:.1f}a{r:.1f} {r:.1f} 0 0 1 0 {r * 2:.1f}" '
                f'stroke="{c}" stroke-width="{sw}" fill="none" stroke-linecap="round"/>')
    return out


def note(x, y, s=1.0, c='#7FB392'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            '<ellipse cx="0" cy="0" rx="7" ry="5.4" fill="' + c + '" transform="rotate(-18)"/>'
            '<path d="M6 -2V-24" stroke="' + c + '" stroke-width="3.2" stroke-linecap="round"/>'
            '<path d="M6 -24q9 3 8 11" stroke="' + c + '" stroke-width="3.2" fill="none" stroke-linecap="round"/></g>')


def ground(y=184, w=112, c='#E7DCC8', cx=100):
    return f'<ellipse cx="{cx}" cy="{y}" rx="{w // 2}" ry="6" fill="{c}"/>'


def badge(x=170, y=34, t='2', bg='#fff', fg='#C97F4E'):
    return (f'<circle cx="{x}" cy="{y}" r="15" fill="{bg}" opacity=".95"/>'
            f'<text x="{x}" y="{y + 7}" text-anchor="middle" font-size="20" font-weight="800" '
            f'fill="{fg}" font-family="-apple-system,Segoe UI,Roboto,sans-serif">{t}</text>')


def steam(x, y, s=1.0, c='#C9DED2', n=2):
    out = ''
    for i in range(n):
        out += (f'<path d="M{x + i * 12 * s:.1f} {y}c-{5 * s:.1f} -{9 * s:.1f} {5 * s:.1f} -{14 * s:.1f} '
                f'0 -{22 * s:.1f}" stroke="{c}" stroke-width="{4 * s:.1f}" fill="none" stroke-linecap="round"/>')
    return out


def cup(x, y, s=1.0, c='#EFA96B', drink='#7B4A2A'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<path d="M-22 0h44v14c0 12-10 20-22 20s-22-8-22-20z" fill="{c}"/>'
            f'<path d="M22 4h6a10 10 0 0 1 0 20h-6" fill="none" stroke="{c}" stroke-width="6" stroke-linecap="round"/>'
            f'<ellipse cx="0" cy="0" rx="22" ry="5.4" fill="{drink}"/></g>')


def bowl(x, y, s=1.0, c='#E9A88D', rim='#fff'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<path d="M-30 0h60c0 18-13 30-30 30S-30 18-30 0z" fill="{c}"/>'
            f'<path d="M-30 0h60" stroke="{rim}" stroke-width="4" opacity=".8"/></g>')


def boat(x, y, s=1.0, c='#C05F45', sail='#fff'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<path d="M-20 0h40l-7 10h-26z" fill="{c}"/>'
            f'<path d="M0 -30v30M0 -28l16 24H0z" fill="{sail}" stroke="{c}" stroke-width="1.5"/></g>')


def cloud(x, y, s=1.0, c='#fff'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<path d="M-24 6a12 12 0 0 1 2-24 16 16 0 0 1 30-2 12 12 0 0 1 14 26z" fill="{c}"/></g>')


def sun(x, y, r=13, c='#F2CE6B'):
    rays = ''.join(f'<path d="M{x + (r + 6) * dx:.1f} {y + (r + 6) * dy:.1f}L{x + (r + 12) * dx:.1f} '
                   f'{y + (r + 12) * dy:.1f}" stroke="{c}" stroke-width="3" stroke-linecap="round"/>'
                   for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (.7, .7), (-.7, .7), (.7, -.7), (-.7, -.7)))
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>' + rays


def rabbit(x, y, s=1.0, c='#F6D3BC'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<ellipse cx="0" cy="0" rx="22" ry="20" fill="{c}"/>'
            f'<ellipse cx="-9" cy="-24" rx="6" ry="16" fill="{c}"/><ellipse cx="7" cy="-26" rx="6" ry="16" fill="{c}"/>'
            '<circle cx="-8" cy="-2" r="2.6" fill="#3E4C43"/><circle cx="6" cy="-2" r="2.6" fill="#3E4C43"/>'
            '<path d="M-3 6h6l-3 4z" fill="#E58A76"/></g>')


def duck(x, y, s=1.0, c='#F2CE6B'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<ellipse cx="0" cy="0" rx="24" ry="17" fill="{c}"/>'
            f'<circle cx="16" cy="-14" r="13" fill="{c}"/>'
            '<circle cx="20" cy="-17" r="2.4" fill="#3E4C43"/>'
            '<path d="M28 -12l12 5-12 5z" fill="#E58A76"/></g>')


def cake(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            '<path d="M0 0l44-6-8 40-36-2z" fill="#F6D3BC"/>'
            '<path d="M0 0l44-6-3 12-41 4z" fill="#fff"/>'
            '<path d="M2 -8c2-8 10-12 16-10" stroke="#E58A76" stroke-width="4" fill="none" stroke-linecap="round"/>'
            '<circle cx="22" cy="6" r="4" fill="#C05F45"/></g>')


def carrot(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            '<path d="M0 0l26 14-8 10z" fill="#E8913D"/>'
            '<path d="M26 14c6-4 12-2 14 4-6 3-11 2-14-4z" fill="#7FB392"/></g>')


def flag(x, y, c='#E58A76'):
    return (f'<path d="M{x} {y}v-26" stroke="#8A6242" stroke-width="3.4" stroke-linecap="round"/>'
            f'<path d="M{x} {y - 26}l16 6-16 7z" fill="{c}"/>')


def leaf(x, y, s=1.0, c='#7FB392'):
    return (f'<path d="M{x} {y}c{-6 * s:.1f} {-9 * s:.1f} {2 * s:.1f} {-15 * s:.1f} {10 * s:.1f} {-13 * s:.1f}'
            f'c{1 * s:.1f} {8 * s:.1f} {-4 * s:.1f} {13 * s:.1f} {-10 * s:.1f} {13 * s:.1f}z" fill="{c}"/>')


def elephant(x, y, s=1.0, c='#B7C4D1'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<circle cx="0" cy="0" r="26" fill="{c}"/>'
            f'<ellipse cx="-26" cy="-2" rx="14" ry="18" fill="{c}"/><ellipse cx="26" cy="-2" rx="14" ry="18" fill="{c}"/>'
            '<circle cx="-8" cy="-4" r="3" fill="#3E4C43"/><circle cx="8" cy="-4" r="3" fill="#3E4C43"/>'
            '<circle cx="-8" cy="-4" r="1" fill="#fff"/><circle cx="8" cy="-4" r="1" fill="#fff"/></g>')


def hippo(x, y, s=1.0, c='#9FB3C6'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<circle cx="0" cy="0" r="34" fill="{c}"/>'
            f'<circle cx="-26" cy="-26" r="8" fill="{c}"/><circle cx="26" cy="-26" r="8" fill="{c}"/>'
            '<circle cx="-12" cy="-6" r="3.4" fill="#3E4C43"/><circle cx="12" cy="-6" r="3.4" fill="#3E4C43"/>'
            '<circle cx="-8" cy="-24" r="2.6" fill="#7E8C99"/><circle cx="8" cy="-24" r="2.6" fill="#7E8C99"/></g>')


def cat_face(x, y, s=1.0, c='#F6D3BC'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<path d="M-24 -6l-4 -18 16 8zM24 -6l4 -18-16 8z" fill="{c}"/>'
            f'<circle cx="0" cy="0" r="24" fill="{c}"/>'
            '<circle cx="-8" cy="-2" r="3" fill="#3E4C43"/><circle cx="8" cy="-2" r="3" fill="#3E4C43"/>'
            '<path d="M-3 8h6l-3 4z" fill="#E58A76"/></g>')


def robot(x, y, s=1.0, c='#9FB6CC'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<rect x="-26" y="-22" width="52" height="44" rx="9" fill="{c}"/>'
            '<circle cx="-10" cy="-4" r="6" fill="#fff"/><circle cx="10" cy="-4" r="6" fill="#fff"/>'
            '<circle cx="-10" cy="-4" r="2.6" fill="#3E4C43"/><circle cx="10" cy="-4" r="2.6" fill="#3E4C43"/>'
            '<path d="M0 -22v-10" stroke="#8FA8C9" stroke-width="3" stroke-linecap="round"/>'
            '<circle cx="0" cy="-34" r="4" fill="#E58A76"/>'
            '<path d="M-8 10h16" stroke="#7E8C99" stroke-width="3" stroke-linecap="round"/></g>')


def mountain(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            '<path d="M-46 0l30-42 26 42z" fill="#8FA8C9"/>'
            '<path d="M-16 -42l8-10 8 12-8 6z" fill="#fff"/></g>')


def helmet(x, y, s=1.0, c='#E8A33D'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<path d="M-26 4a26 26 0 0 1 52 0z" fill="{c}"/>'
            '<path d="M-26 4h52" stroke="#C97F4E" stroke-width="4"/>'
            '<path d="M6 10c0 10 6 16 16 18" stroke="#C97F4E" stroke-width="4" fill="none" stroke-linecap="round"/>'
            '<rect x="20" y="26" width="8" height="6" rx="1.5" fill="#8A6242"/></g>')


def pumpkin(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            '<ellipse cx="0" cy="0" rx="34" ry="28" fill="#E8913D"/>'
            '<path d="M-14 -26c-4 16-4 36 0 52M14 -26c4 16 4 36 0 52" stroke="#C97F4E" stroke-width="3" fill="none"/>'
            '<path d="M0 -28v-10" stroke="#6E8F5E" stroke-width="5" stroke-linecap="round"/>'
            '<path d="M0 -34c8-6 16-4 18 2-7 3-13 2-18-2z" fill="#7FB392"/></g>')


def rainbow(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})" fill="none" stroke-linecap="round">'
            '<path d="M-44 0a44 44 0 0 1 88 0" stroke="#E58A76" stroke-width="8"/>'
            '<path d="M-34 0a34 34 0 0 1 68 0" stroke="#F2CE6B" stroke-width="8"/>'
            '<path d="M-24 0a24 24 0 0 1 48 0" stroke="#9DC3AA" stroke-width="8"/></g>')


def glass(x, y, s=1.0, c='#9CC4E0'):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<path d="M-18 -30h36l-4 52h-28z" fill="none" stroke="{c}" stroke-width="4"/>'
            f'<path d="M-16 -8h32l-3 28h-26z" fill="{c}" opacity=".7"/></g>')


# ---------------------------------------------------------------- data
HIRA = [
    dict(ch='あ', ro='a', ko='아', row='あ행', ink='#B4564B',
         story='입을 크게 벌려 "아~" — 벌린 입 안에 혀가 보여요.',
         back='',
         front='<ellipse cx="64" cy="132" rx="26" ry="21" fill="#7E3A33"/>'
               '<ellipse cx="64" cy="142" rx="15" ry="8" fill="#E58A76"/>'
               '<path d="M44 116c12-6 28-6 40 0" stroke="#fff" stroke-width="7" stroke-linecap="round"/>'
               + sound(98, 122) + note(158, 56, .8, '#E9A88D')),
    dict(ch='い', ro='i', ko='이', row='あ행', ink='#C98A4B',
         story='막대기 두 개가 나란히 = 숫자 2 = "이".',
         back=ground(),
         front=badge(168, 36) + '<circle cx="74" cy="50" r="4.2" fill="#8A6242"/><circle cx="132" cy="58" r="4.2" fill="#8A6242"/>'),
    dict(ch='う', ro='u', ko='우', row='あ행', ink='#3E7FB0', dy=10,
         story='우산 손잡이가 구부러진 모양 그대로 "우".',
         back=('<g transform="translate(0,-6)"><path d="M34 40c12-22 38-34 68-34s56 12 68 34c-12 6-20 6-32 0-10 7-18 7-28 0'
               '-11 7-19 7-30 0-11 6-19 6-30 0z" fill="#E58A76"/>'
               '<path d="M34 40c12-22 38-34 68-34s56 12 68 34" fill="none" stroke="#C05F45" stroke-width="3.2"/>'
               '<path d="M102 6V-2" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/></g>'
               '<path d="M102 34v12" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/>'),
         front=drop(28, 92) + drop(172, 110) + drop(154, 74) + drop(26, 138)),
    dict(ch='え', ro='e', ko='에', row='あ행', ink='#2F6B4F',
         story='"에?" 하고 놀라 팔을 벌린 사람 — 발밑에 바나나 껍질.',
         back='<circle cx="102" cy="30" r="21" fill="#F2C6A0"/>'
              '<path d="M84 22c6-12 26-14 34-2" stroke="#5A4632" stroke-width="6" fill="none" stroke-linecap="round"/>'
              '<path d="M126 170c14-2 24-10 28-22" stroke="#E8B93D" stroke-width="9" fill="none" stroke-linecap="round"/>'
              '<path d="M120 170c8 6 18 6 26 2" stroke="#C9A227" stroke-width="3" fill="none"/>',
         front=eye(94, 28, 4) + eye(112, 27, 4) + '<ellipse cx="103" cy="40" rx="6" ry="7" fill="#C9785F"/>'
               + '<path d="M160 74l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#E58A76"/>' + drop(56, 84, 4)),
    dict(ch='お', ro='o', ko='오', row='あ행', ink='#B4564B',
         story='"오!" 하고 동그랗게 모은 입 — 오른쪽 점이 감탄 표시.',
         back='',
         front='<ellipse cx="80" cy="132" rx="24" ry="20" fill="#7E3A33"/>'
               '<ellipse cx="80" cy="141" rx="14" ry="7.6" fill="#E58A76"/>'
               '<path d="M60 116c12-6 26-6 38 0" stroke="#fff" stroke-width="7" stroke-linecap="round"/>'
               + sound(114, 126, '#E9A88D') + spark(150, 62, 8) + blush(130, 96, 8, 4.6)),
    dict(ch='か', ro='ka', ko='카', row='か행', ink='#46586B',
         story='카메라로 "카샤!" — 글자가 카메라 렌즈 앞에서 빛나요.',
         back='<rect x="128" y="140" width="52" height="34" rx="8" fill="#8FA8C9"/>'
              '<circle cx="154" cy="157" r="11" fill="#5E7590"/><circle cx="154" cy="157" r="5" fill="#C9DCEB"/>'
              '<rect x="170" y="146" width="8" height="5" rx="1.5" fill="#F2CE6B"/>',
         front='<path d="M156 118l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#F2CE6B"/>'
               '<path d="M56 44l-14-8M52 56l-16-2" stroke="#C9DED2" stroke-width="4" stroke-linecap="round"/>'),
    dict(ch='き', ro='ki', ko='키', row='か행', ink='#D9A94E',
         story='열쇠 모양 그대로 — 열쇠고리를 달면 "키".',
         back='<circle cx="46" cy="152" r="13" fill="none" stroke="#9A9384" stroke-width="6"/>',
         front='<path d="M62 92h30M62 116h30" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/>'
               + spark(166, 62, 6) + '<circle cx="46" cy="152" r="5" fill="#F6F1E7"/>'),
    dict(ch='く', ro='ku', ko='쿠', row='か행', ink='#8A4B2A',
         story='쿠키를 "쿠" 하고 한 입 — 벌린 입이 글자예요.',
         back='<circle cx="122" cy="102" r="18" fill="#C98A5B"/><circle cx="115" cy="97" r="3" fill="#7B4A2A"/>'
              '<circle cx="127" cy="108" r="2.6" fill="#7B4A2A"/>',
         front='<path d="M118 92l9-3-2 9z" fill="#F2CE6B"/><path d="M132 126l8-2-2 8z" fill="#F2CE6B"/>'
               + '<circle cx="146" cy="86" r="3" fill="#C98A5B"/><circle cx="152" cy="112" r="2.4" fill="#C98A5B"/>'),
    dict(ch='け', ro='ke', ko='케', row='か행', ink='#B4703C',
         story='케이크 한 조각, 위에는 촛불 — "케".',
         back=cake(108, 152, .82),
         front='<path d="M74 22c7 8 7 14 0 20-7-6-7-12 0-20z" fill="#E8A33D"/>'
               '<path d="M74 42v8" stroke="#8A6242" stroke-width="3" stroke-linecap="round"/>'),
    dict(ch='こ', ro='ko', ko='코', row='か행', ink='#93A6B5',
         story='코끼리 코가 구부러진 모양 "코".',
         back=elephant(160, 76, .92) + '<path d="M146 96c-12 10-26 12-40 8" stroke="#B7C4D1" stroke-width="12" fill="none" stroke-linecap="round"/>',
         front='<circle cx="144" cy="86" r="2.8" fill="#7E8C99"/><circle cx="36" cy="164" r="2.4" fill="#B7C4D1"/>'
               + '<path d="M40 96c-6 6-6 14 0 20" stroke="#C9DED2" stroke-width="3.4" fill="none" stroke-linecap="round"/>'),
    dict(ch='さ', ro='sa', ko='사', row='さ행', ink='#B4703C',
         story='사람이 손을 흔들며 "사!" 하고 인사해요.',
         back='<circle cx="106" cy="30" r="17" fill="#F2C6A0"/><path d="M92 18c6-8 22-8 28 0" stroke="#5A4632" stroke-width="5" fill="none" stroke-linecap="round"/>',
         front=eye(100, 28, 3.4) + eye(114, 28, 3.4) + smile(107, 36, 5, 4) + '<path d="M156 46l10-8M158 58l12-2" stroke="#E9A88D" stroke-width="4" stroke-linecap="round"/>'),
    dict(ch='し', ro='shi', ko='시', row='さ행', ink='#E58A76',
         story='미끄럼틀을 타고 "시~" 내려와요.',
         back='<path d="M132 34v54M158 34v54" stroke="#C9DED2" stroke-width="4" stroke-linecap="round"/>'
              '<path d="M132 46h26M132 62h26M132 78h26" stroke="#C9DED2" stroke-width="3.4" stroke-linecap="round"/>',
         front='<circle cx="62" cy="146" r="11" fill="#F2C6A0"/>'
               '<path d="M62 158c-8 0-14 8-14 16h28c0-8-6-16-14-16z" fill="#7FA8C9"/>'
               + '<path d="M30 60q-6 8 0 16" stroke="#9DC3AA" stroke-width="4" fill="none" stroke-linecap="round"/>'
               + spark(44, 40, 6)),
    dict(ch='す', ro='su', ko='스', row='さ행', ink='#7FA8C9',
         story='포크에 스파게티를 "스~" 감았어요.',
         back='<path d="M100 14v14M88 14v18M112 14v18" stroke="#9AA7B5" stroke-width="4" stroke-linecap="round"/>',
         front='<ellipse cx="102" cy="122" rx="21" ry="18" fill="#F2CE6B"/>'
               '<path d="M85 116c10 7 24 7 34 0M85 128c10 7 24 7 34 0" stroke="#E8A33D" stroke-width="3" fill="none"/>'
               '<path d="M92 106c8 6 18 6 24 0" stroke="#F6E2A8" stroke-width="3" fill="none"/>'
               + steam(138, 96, .7)),
    dict(ch='せ', ro='se', ko='세', row='さ행', ink='#2F6B4F',
         story='세 사람이 손을 잡고 "세".',
         back='',
         front='<circle cx="70" cy="64" r="13" fill="#F2C6A0"/><circle cx="124" cy="54" r="13" fill="#F2C6A0"/>'
               '<circle cx="166" cy="66" r="13" fill="#F2C6A0"/>'
               + eye(66, 63, 2.6) + eye(74, 63, 2.6) + eye(120, 53, 2.6) + eye(128, 53, 2.6) + eye(162, 65, 2.6) + eye(170, 65, 2.6)
               + smile(70, 72, 5, 4) + smile(124, 62, 5, 4) + smile(166, 74, 5, 4)),
    dict(ch='そ', ro='so', ko='소', row='さ행', ink='#7FB392',
         story='소라 껍데기가 지그재그로 말려 있어요 "소".',
         back='<ellipse cx="150" cy="150" rx="36" ry="9" fill="#F6E2C8"/>'
              '<path d="M146 70l22 10-4 24-20 14-22-8c-6-12-2-26 8-34z" fill="#F6D3BC" stroke="#D9A98A" stroke-width="3"/>'
              '<path d="M150 78c-14 2-22 12-20 24 2 11 14 18 25 14 10-4 14-14 9-23-5-8-16-9-22-3" stroke="#D9A98A" stroke-width="4" fill="none"/>'
              '<circle cx="150" cy="96" r="6" fill="#F6E2C8"/>',
         front='<path d="M40 170c10 5 20 5 30 0" stroke="#9DC3AA" stroke-width="4" fill="none" stroke-linecap="round"/>'),
    dict(ch='た', ro='ta', ko='타', row='た행', ink='#B4703C',
         story='타일을 척척 붙여요 "타".',
         back='<rect x="40" y="96" width="120" height="76" fill="#DCE7EF"/>'
              '<path d="M40 96h120M40 134h120M80 96v76M120 96v76" stroke="#fff" stroke-width="5"/>',
         front='<rect x="140" y="146" width="34" height="22" rx="5" fill="#F2CE6B"/>'
               '<path d="M146 152h22M146 158h14" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/>'
               + drop(52, 92, 4) + drop(72, 86, 3)),
    dict(ch='ち', ro='chi', ko='치', row='た행', ink='#E8B93D',
         story='구멍 뚫린 치즈 한 조각 "치".',
         back='<path d="M104 132l64-14 6 44-62 14z" fill="#F2CE6B"/>'
              '<path d="M104 132l64-14 6 44-62 14z" fill="none" stroke="#D9A94E" stroke-width="2.4"/>'
              '<circle cx="128" cy="150" r="6" fill="#F6E2A8"/><circle cx="150" cy="144" r="4.4" fill="#F6E2A8"/>'
              '<circle cx="138" cy="164" r="3.6" fill="#F6E2A8"/>',
         front='<path d="M84 40c-10 10-8 22 2 28" stroke="#F2CE6B" stroke-width="3" fill="none" stroke-linecap="round"/>'),
    dict(ch='つ', ro='tsu', ko='츠', row='た행', ink='#7FA8C9',
         story='파도가 "츠" 하고 밀려와요.',
         back='<path d="M40 152c14 8 28 10 42 6" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>',
         front='<circle cx="64" cy="52" r="4" fill="#9CC4E0"/><circle cx="90" cy="42" r="3.4" fill="#9CC4E0"/>'
               + boat(160, 150, .95, '#C05F45', '#fff')
               + '<path d="M170 96q8 6 0 12" stroke="#9CC4E0" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
               + '<circle cx="166" cy="72" r="2.6" fill="#fff"/>'),
    dict(ch='て', ro='te', ko='테', row='た행', ink='#A0785A',
         story='테이블 위에 컵을 올려요 "테".',
         back=ground(176, 130),
         front=cup(66, 52, .78, '#EFA96B') + '<ellipse cx="66" cy="63" rx="26" ry="4" fill="#D9C9AE"/>' + steam(72, 36, .65, '#E7C7A6', 1)
               + '<path d="M148 148v26M40 176h120" stroke="#A0785A" stroke-width="5" stroke-linecap="round"/>',
         ),
    dict(ch='と', ro='to', ko='토', row='た행', ink='#B08968',
         story='긴 귀를 세운 토끼 "토".',
         back=rabbit(140, 118, 1.0) + carrot(30, 140, .9),
         front='<circle cx="132" cy="112" r="3" fill="#3E4C43"/><circle cx="148" cy="112" r="3" fill="#3E4C43"/>'
               + '<path d="M140 118h0" stroke="#E58A76" stroke-width="0"/>'),
    dict(ch='な', ro='na', ko='나', row='な행', ink='#C05F45',
         story='나비가 팔랑팔랑 "나".',
         back='<ellipse cx="50" cy="74" rx="30" ry="20" fill="#E9A88D" transform="rotate(-26 50 74)"/>'
              '<ellipse cx="158" cy="74" rx="30" ry="20" fill="#E9A88D" transform="rotate(26 158 74)"/>'
              '<ellipse cx="52" cy="146" rx="24" ry="16" fill="#F6D3BC" transform="rotate(20 52 146)"/>'
              '<ellipse cx="156" cy="146" rx="24" ry="16" fill="#F6D3BC" transform="rotate(-20 156 146)"/>',
         front='<path d="M100 40c-4-10 1-17 9-19M100 40c4-9 11-13 17-11" stroke="#3E4C43" stroke-width="3" fill="none" stroke-linecap="round"/>'
               + '<circle cx="50" cy="74" r="5" fill="#fff" opacity=".7"/><circle cx="158" cy="74" r="5" fill="#fff" opacity=".7"/>'),
    dict(ch='に', ro='ni', ko='니', row='な행', ink='#7FB392',
         story='두 바늘로 니트를 떠요 "니".',
         back='<circle cx="152" cy="136" r="24" fill="#F6D3BC"/><path d="M132 128c12-8 28-8 40 0M132 144c12 8 28 8 40 0" stroke="#D9A98A" stroke-width="3" fill="none"/>'
              '<path d="M132 136h40" stroke="#E58A76" stroke-width="3" stroke-linecap="round"/>',
         front='<circle cx="52" cy="56" r="3.4" fill="#9AA7B5"/><circle cx="150" cy="52" r="3.4" fill="#9AA7B5"/>'),
    dict(ch='ぬ', ro='nu', ko='누', row='な행', ink='#C98A6B',
         story='국수 한 그릇, 후루룩 "누".',
         back=bowl(100, 146, 1.35, '#8FA8C9') + '<ellipse cx="100" cy="146" rx="40" ry="7" fill="#F2CE6B"/>'
              '<path d="M76 140c14 8 34 8 48 0" stroke="#E8A33D" stroke-width="3" fill="none"/>',
         front=steam(84, 120, 1.0) + '<path d="M150 60l-8 30M162 62l-8 30" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/>'),
    dict(ch='ね', ro='ne', ko='네', row='な행', ink='#356B4E',
         story='네잎클로버를 발견! "네".',
         back='<circle cx="86" cy="76" r="19" fill="#A9D3B7"/><circle cx="132" cy="72" r="19" fill="#A9D3B7"/>'
              '<circle cx="82" cy="126" r="17" fill="#BFE0C9"/><circle cx="130" cy="128" r="17" fill="#A9D3B7"/>'
              '<path d="M106 142c0 14-6 24-16 30" stroke="#4F7E60" stroke-width="4" fill="none" stroke-linecap="round"/>',
         front='<circle cx="106" cy="100" r="5" fill="#F2CE6B"/>'),
    dict(ch='の', ro='no', ko='노', row='な행', ink='#E58A76',
         story='동그란 음표 모양, 노래해요 "노".',
         back=sound(140, 70, '#9DC3AA', 2),
         front='<path d="M148 66v-28" stroke="#E58A76" stroke-width="4" stroke-linecap="round"/>'
               '<path d="M148 38q10 4 9 13" stroke="#E58A76" stroke-width="4" fill="none" stroke-linecap="round"/>'
               + note(150, 150, .9, '#7FB392')),
    dict(ch='は', ro='ha', ko='하', row='は행', ink='#93A6B5',
         story='하마가 입을 크게 벌려 "하".',
         back=hippo(54, 64, .9) + '<path d="M40 150c8-6 18-6 26 0" stroke="#9CC4E0" stroke-width="5" fill="none" stroke-linecap="round"/>'
              '<path d="M140 156c8-6 18-6 26 0" stroke="#9CC4E0" stroke-width="5" fill="none" stroke-linecap="round"/>',
         front=mouth(96, 122, 22, 18, teeth=True),
         ),
    dict(ch='ひ', ro='hi', ko='히', row='は행', ink='#E9A88D',
         story='히죽 웃는 입 모양 그대로 "히".',
         back='',
         front=closed_eye(60, 62, 8) + closed_eye(140, 62, 8) + blush(50, 88, 9, 5) + blush(150, 88, 9, 5)
               + spark(164, 40, 7, '#F2CE6B')),
    dict(ch='ふ', ro='fu', ko='후', row='は행', ink='#C9A227',
         story='촛불을 "후~" 하고 불어요.',
         back='<rect x="144" y="126" width="26" height="46" rx="6" fill="#F6EFD8"/>'
              '<path d="M157 124c8-9 8-17 0-26-8 9-8 17 0 26z" fill="#E8A33D"/>'
              '<path d="M157 128v42" stroke="#E8D9B0" stroke-width="2"/>'
              '<ellipse cx="157" cy="174" rx="20" ry="5" fill="#E7DCC8"/>',
         front='<path d="M60 96c14-4 24-12 30-24M62 112c16 0 28 6 36 16" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>'
               + '<circle cx="94" cy="66" r="3" fill="#E7D9B8"/>'),
    dict(ch='へ', ro='he', ko='헤', row='は行', ink='#7FB392',
         story='낮은 언덕을 넘어 "헤".',
         back=ground(170, 150, '#DCEBDD') + sun(166, 46, 14),
         front=flag(104, 62) + '<path d="M40 168c10-6 22-6 32 0" stroke="#C9DED2" stroke-width="3" fill="none"/>'),
    dict(ch='ほ', ro='ho', ko='호', row='は행', ink='#7FA8C9',
         story='잔잔한 호수 위에 배가 떠 있어요 "호".',
         back='<path d="M30 168c18 8 36 10 54 6" stroke="#BFDCEB" stroke-width="4" fill="none" stroke-linecap="round"/>'
              '<path d="M150 168c14 6 28 6 40 0" stroke="#BFDCEB" stroke-width="4" fill="none" stroke-linecap="round"/>'
              '<path d="M40 96c0-14 8-24 20-28M40 120c0-10 6-18 14-22" stroke="#9DC3AA" stroke-width="4" fill="none" stroke-linecap="round"/>',
         front=boat(62, 52, .95) + '<circle cx="120" cy="166" r="2.4" fill="#9CC4E0"/>'
               + '<path d="M148 150c8-6 8-14 0-20" stroke="#9DC3AA" stroke-width="3.4" fill="none" stroke-linecap="round"/>'),
    dict(ch='ま', ro='ma', ko='마', row='ま행', ink='#C98A6B',
         story='마이크 앞에서 "마".',
         back='<circle cx="104" cy="52" r="26" fill="#9AA7B5"/>'
              '<path d="M92 50h24M92 58h24M92 42h24" stroke="#EAF2F8" stroke-width="2.4"/>'
              '<circle cx="104" cy="52" r="26" fill="none" stroke="#6E8FA8" stroke-width="3"/>',
         front='<path d="M62 176h84" stroke="#8A6242" stroke-width="5" stroke-linecap="round"/>'
               + '<path d="M30 60q-4 8 0 16" stroke="#E58A76" stroke-width="3.4" fill="none" stroke-linecap="round"/>'),
    dict(ch='み', ro='mi', ko='미', row='ま행', ink='#8A5A9E',
         story='물감을 짜서 "미" — 팔레트에 색이 번져요.',
         back='<circle cx="50" cy="150" r="16" fill="#E58A76"/><circle cx="78" cy="164" r="13" fill="#F2CE6B"/>'
              '<circle cx="34" cy="124" r="11" fill="#7FA8C9"/>'
              '<path d="M158 54l24-18M162 66l26-8" stroke="#C9A227" stroke-width="5" stroke-linecap="round"/>'
              '<path d="M150 74c14-8 26-10 38-6" stroke="#8A5A9E" stroke-width="0"/>',
         front='<circle cx="120" cy="70" r="4" fill="#9DC3AA"/>'),
    dict(ch='む', ro='mu', ko='무', row='ま행', ink='#5C8F6E',
         story='비가 그친 뒤 무지개가 떴어요 "무".',
         back=rainbow(168, 62, .95) + cloud(52, 46, .95, '#fff'),
         front='<path d="M40 172c14 6 28 8 42 4" stroke="#C9DED2" stroke-width="4" fill="none" stroke-linecap="round"/>'),
    dict(ch='め', ro='me', ko='메', row='ま행', ink='#7FA8C9',
         story='눈을 크게 뜨고 "메롱".',
         back='<ellipse cx="96" cy="108" rx="30" ry="24" fill="#fff"/>',
         front='<circle cx="90" cy="106" r="10" fill="#3E4C43"/><circle cx="94" cy="102" r="3.6" fill="#fff"/>'
               '<path d="M62 92l-12-9M64 106h-14M66 120l-12 9" stroke="#3E4C43" stroke-width="3" stroke-linecap="round"/>'
               '<path d="M104 138c8 0 12 6 10 12-8 2-12-4-10-12z" fill="#E58A76"/>'),
    dict(ch='も', ro='mo', ko='모', row='ま행', ink='#C97F4E',
         story='모자 모양 그대로 — 챙과 폼폼까지 "모".',
         back='<circle cx="150" cy="54" r="12" fill="#F2CE6B"/>'
              '<path d="M40 150h96c-8 12-26 18-48 18s-40-6-48-18z" fill="#B4703C"/>',
         front='<path d="M148 66v6" stroke="#C97F4E" stroke-width="4" stroke-linecap="round"/>'
               '<path d="M62 100h28M62 124h24" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/>'),
    dict(ch='や', ro='ya', ko='야', row='や행', ink='#B4703C',
         story='야구 방망이를 휘두르면 "야".',
         back='<path d="M148 40c14 2 22 8 26 16" stroke="#C9DED2" stroke-width="3" fill="none" stroke-dasharray="5 6"/>'
              '<circle cx="170" cy="52" r="11" fill="#fff" stroke="#C05F45" stroke-width="2"/>'
              '<path d="M166 46q6 6 0 12" stroke="#C05F45" stroke-width="1.6" fill="none"/>',
         front='<path d="M160 76l-16-8M164 92l-18 0" stroke="#C9DED2" stroke-width="3.4" stroke-linecap="round"/>'),
    dict(ch='ゆ', ro='yu', ko='유', row='や행', ink='#7FA8C9',
         story='따뜻한 욕조에 들어가 "유~".',
         back='<path d="M52 122h96" stroke="#9CC4E0" stroke-width="4"/>'
              '<path d="M56 172h88" stroke="#BFDCEB" stroke-width="6" stroke-linecap="round"/>',
         front=steam(72, 108, 1.0) + duck(150, 150, .85) + '<circle cx="70" cy="140" r="3" fill="#fff" opacity=".8"/>'
               + '<circle cx="84" cy="150" r="2.4" fill="#fff" opacity=".8"/>'),
    dict(ch='よ', ro='yo', ko='요', row='や행', ink='#E8B93D',
         story='요요가 줄 끝에서 돌아와요 "요".',
         back='<path d="M104 40c0-10 8-16 18-14" stroke="#C97F4E" stroke-width="3" fill="none" stroke-linecap="round"/>',
         front=star(112, 96, 10, '#fff') + '<circle cx="86" cy="120" r="4" fill="#fff" opacity=".7"/>'),
    dict(ch='ら', ro='ra', ko='라', row='ら행', ink='#E58A76',
         story='라면 한 그릇, 김 모락모락 "라".',
         back=bowl(100, 150, 1.35, '#D9534F') + '<ellipse cx="100" cy="150" rx="40" ry="7" fill="#F6E2C8"/>'
              '<circle cx="118" cy="146" r="9" fill="#F6E2C8"/><circle cx="118" cy="146" r="4" fill="#F2CE6B"/>',
         front=steam(80, 124, 1.0) + '<path d="M140 62l-10 34M154 64l-10 34" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/>'),
    dict(ch='り', ro='ri', ko='리', row='ら행', ink='#E58A76',
         story='리본 두 갈래가 나풀나풀 "리".',
         back='<path d="M104 44c-16-12-32-6-30 8 2 12 18 14 28 4z" fill="#F6D3BC"/>'
              '<path d="M110 44c16-12 32-6 30 8-2 12-18 14-28 4z" fill="#F6D3BC"/>'
              '<circle cx="107" cy="48" r="7" fill="#E9A88D"/>',
         front='<circle cx="86" cy="150" r="4" fill="#F2CE6B"/><circle cx="126" cy="160" r="3.4" fill="#F2CE6B"/>'),
    dict(ch='る', ro='ru', ko='루', row='ら행', ink='#7FA8C9',
         story='롤러코스터가 동그랗게 한 바퀴 "루".',
         back='<path d="M40 168c40 0 60-10 60-30s-24-28-40-14" stroke="#E0D3BC" stroke-width="7" fill="none" stroke-linecap="round"/>'
              '<path d="M36 172h40" stroke="#D9C9AE" stroke-width="4"/>',
         front='<circle cx="112" cy="112" r="10" fill="#E58A76"/><circle cx="108" cy="110" r="3" fill="#fff"/>'
               + '<path d="M168 60l-14-6M170 76h-16" stroke="#C9DED2" stroke-width="3" fill="none" stroke-linecap="round"/>'),
    dict(ch='れ', ro='re', ko='레', row='ら행', ink='#E8B93D',
         story='상큼한 레몬 한 조각 "레".',
         back='<circle cx="130" cy="120" r="30" fill="#F2CE6B"/>'
              '<path d="M130 90c0-8 6-12 12-12" stroke="#7FB392" stroke-width="4" fill="none" stroke-linecap="round"/>'
              + leaf(142, 80, .8) +
              '<circle cx="130" cy="120" r="22" fill="none" stroke="#E8B93D" stroke-width="3"/>'
              '<path d="M130 98v44M108 120h44M114 104l32 32M146 104l-32 32" stroke="#F6E2A8" stroke-width="2.6"/>',
         front=drop(56, 88, 5) + spark(46, 60, 6, '#9DC3AA')),
    dict(ch='ろ', ro='ro', ko='로', row='ら행', ink='#93A6B5',
         story='네모난 로봇이 "로" 하고 인사해요.',
         back=robot(150, 60, .9) + '<path d="M150 86v10" stroke="#8FA8C9" stroke-width="4" stroke-linecap="round"/>',
         front='<path d="M174 118l-8 10M176 132l-8 10" stroke="#C9DED2" stroke-width="3.4" stroke-linecap="round"/>'),
    dict(ch='わ', ro='wa', ko='와', row='わ행', ink='#E8B93D',
         story='와플 한 장, 버터 올리고 "와".',
         back='<rect x="66" y="76" width="76" height="76" rx="10" fill="#E8B93D"/>'
              '<path d="M66 102h76M66 128h76M92 76v76M118 76v76" stroke="#C9A227" stroke-width="4"/>'
              '<rect x="92" y="66" width="22" height="12" rx="3" fill="#F6E2A8" transform="rotate(-8 103 72)"/>',
         front='<path d="M154 150c8 4 14 4 20 0" stroke="#D9A94E" stroke-width="3" fill="none" stroke-linecap="round"/>'
               + spark(40, 60, 6, '#E58A76')),
    dict(ch='を', ro='wo', ko='오', row='わ행', ink='#E8A33D',
         story='오리가 물 위를 미끄러져요 "오".',
         back=duck(120, 132, 1.0) + '<path d="M40 168c14 8 30 10 46 8M120 172c16 6 32 4 44-2" stroke="#BFDCEB" stroke-width="4" fill="none" stroke-linecap="round"/>',
         front='<circle cx="46" cy="100" r="3" fill="#9CC4E0"/><circle cx="62" cy="86" r="2.4" fill="#9CC4E0"/>'),
    dict(ch='ん', ro='n', ko='응', row='わ행', ink='#7FB392',
         story='콧노래를 "응~" 하고 흥얼거려요.',
         back='',
         front=note(158, 62, .9, '#E58A76') + note(176, 92, .7, '#9DC3AA') + sound(60, 70, '#9DC3AA', 2)),
]

KATA = [
    dict(ch='ア', ro='a', ko='아', row='ア행', ink='#3E6B51',
         story='악어가 입을 딱 벌려 "아" — 윗턱이 글자 모양.',
         back='<path d="M30 40h116c12 0 18 6 18 15s-6 15-18 15H30z" fill="#9DC3AA"/>'
              '<path d="M56 70l8 11 8-11 8 11 8-11 8 11 8-11 8 11" stroke="#fff" stroke-width="4" fill="none"/>'
              '<circle cx="150" cy="30" r="6" fill="#2B3A32"/><circle cx="152" cy="28" r="2" fill="#fff"/>'
              '<path d="M104 116l62-10 6 14-60 14z" fill="#7FB392"/>'
              '<path d="M30 150c-14-6-22-18-20-32" stroke="#9DC3AA" stroke-width="9" fill="none" stroke-linecap="round"/>',
         front='<path d="M120 96l6 8 6-8" stroke="#fff" stroke-width="3" fill="none"/>'),
    dict(ch='イ', ro='i', ko='이', row='ア행', ink='#C98A4B',
         story='막대기 두 개가 나란히 = 숫자 2 = "이".',
         back=ground(),
         front=badge(170, 36) + '<circle cx="78" cy="48" r="4.2" fill="#8A6242"/>'),
    dict(ch='ウ', ro='u', ko='우', row='ア행', ink='#3E7FB0',
         story='우산을 펼쳤어요 — 손잡이가 "우".',
         back='<path d="M34 42c12-22 38-34 68-34s56 12 68 34c-12 6-20 6-32 0-10 7-18 7-28 0-11 7-19 7-30 0'
              '-11 6-19 6-30 0z" fill="#E58A76"/>'
              '<path d="M34 42c12-22 38-34 68-34s56 12 68 34" fill="none" stroke="#C05F45" stroke-width="3.2"/>'
              '<path d="M102 8V0" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/>'
              '<path d="M102 42v10" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/>',
         front=drop(26, 96) + drop(174, 112) + drop(152, 78)),
    dict(ch='エ', ro='e', ko='에', row='ア행', ink='#6E8FA8',
         story='공사장 工자 기둥, 안전모 쓰고 "에".',
         back='<path d="M78 46a26 26 0 0 1 52 0z" fill="#F2CE6B"/>'
              '<path d="M74 46h60" stroke="#E8A33D" stroke-width="5" stroke-linecap="round"/>'
              '<path d="M170 30v26M170 56l-8 6" stroke="#8FA8C9" stroke-width="4" fill="none" stroke-linecap="round"/>',
         front='<path d="M62 84h28M110 84h28" stroke="#C9DCEB" stroke-width="4" opacity=".8" stroke-linecap="round"/>'),
    dict(ch='オ', ro='o', ko='오', row='ア행', ink='#E58A76',
         story='오뚝이가 쓰러져도 다시 일어나 "오".',
         back='<path d="M42 156a58 26 0 0 0 116 0z" fill="#E9A88D"/>'
              '<path d="M42 156h116" stroke="#fff" stroke-width="4" opacity=".7"/>',
         front=eye(82, 52) + eye(120, 52) + smile(101, 66, 9, 6) + blush(64, 70, 9, 5) + blush(138, 70, 9, 5)),
    dict(ch='カ', ro='ka', ko='카', row='カ행', ink='#46586B',
         story='칼로 당근을 "카" 하고 내리쳤어요.',
         back='<path d="M96 40h64l-8 26H96z" fill="#C9DCEB"/>'
              '<path d="M96 88h76v16H96z" fill="#D9C9AE"/>'
              '<path d="M120 88l20-18 20 18z" fill="#E8913D"/>'
              '<path d="M126 78c4-8 12-10 20-6" stroke="#7FB392" stroke-width="4" fill="none" stroke-linecap="round"/>',
         front='<path d="M170 66l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2CE6B"/>'),
    dict(ch='キ', ro='ki', ko='키', row='カ행', ink='#D9A94E',
         story='열쇠 모양 그대로 — 이빨 두 개가 "키".',
         back='<circle cx="44" cy="140" r="13" fill="none" stroke="#9A9384" stroke-width="6"/>',
         front='<path d="M62 84h34M62 108h34" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/>'
               + spark(168, 58, 6) + '<circle cx="44" cy="140" r="5" fill="#F6F1E7"/>'),
    dict(ch='ク', ro='ku', ko='쿠', row='カ행', ink='#8A4B2A',
         story='새 부리가 "쿠" 하고 쿠키를 물었어요.',
         back='<circle cx="118" cy="52" r="24" fill="#7FB392"/>'
              '<circle cx="112" cy="46" r="4" fill="#2B3A32"/><circle cx="114" cy="44" r="1.6" fill="#fff"/>'
              '<path d="M136 52l14 6-14 7z" fill="#E8A33D"/>'
              '<circle cx="122" cy="112" r="17" fill="#C98A5B"/><circle cx="116" cy="107" r="3" fill="#7B4A2A"/>',
         front='<path d="M140 104l8-3-2 8z" fill="#7B4A2A"/>' + '<path d="M148 118l6 0" stroke="#C9DED2" stroke-width="3" stroke-linecap="round"/>'),
    dict(ch='ケ', ro='ke', ko='케', row='カ행', ink='#B4703C',
         story='케이크 한 조각에 촛불까지 "케".',
         back=cake(106, 150, .8),
         front='<path d="M74 24c7 8 7 14 0 20-7-6-7-12 0-20z" fill="#E8A33D"/>'
               '<path d="M74 44v8" stroke="#8A6242" stroke-width="3" stroke-linecap="round"/>'),
    dict(ch='コ', ro='ko', ko='코', row='カ행', ink='#B4703C',
         story='코코아 한 잔 — 김이 모락모락 "코".',
         back='<path d="M56 66h84v58c0 12-10 20-22 20H78c-12 0-22-8-22-20z" fill="#8A5A3C"/>'
              '<path d="M140 84h12a14 14 0 0 1 0 28h-12" fill="none" stroke="#8A5A3C" stroke-width="8"/>'
              '<ellipse cx="98" cy="66" rx="42" ry="7" fill="#F6E2C8"/>',
         front=steam(82, 46, .9, '#E7C7A6') + '<circle cx="120" cy="120" r="4" fill="#F6E2C8" opacity=".5"/>'),
    dict(ch='サ', ro='sa', ko='사', row='サ행', ink='#B08968',
         story='사슴 뿔이 가지런히 갈라졌어요 "사".',
         back='<ellipse cx="98" cy="152" rx="34" ry="30" fill="#C98A5B"/>'
              '<ellipse cx="68" cy="138" rx="12" ry="16" fill="#C98A5B"/><ellipse cx="128" cy="138" rx="12" ry="16" fill="#C98A5B"/>'
              '<circle cx="86" cy="146" r="3.6" fill="#3E4C43"/><circle cx="110" cy="146" r="3.6" fill="#3E4C43"/>',
         front='<ellipse cx="98" cy="166" rx="7" ry="5" fill="#3E4C43"/>'
               + '<path d="M74 168c-8 4-12 10-12 16M122 168c8 4 12 10 12 16" stroke="#B08968" stroke-width="3" fill="none" stroke-linecap="round"/>'),
    dict(ch='シ', ro='shi', ko='시', row='サ행', ink='#7FA8C9',
         story='동그란 시계 바늘이 "시" — 시각을 알려요.',
         back='<circle cx="92" cy="104" r="58" fill="#fff" stroke="#9CC4E0" stroke-width="6"/>'
              '<circle cx="92" cy="104" r="4" fill="#46586B"/>'
              '<path d="M92 56v8M92 144v-8M44 104h8M140 104h-8" stroke="#C9DCEB" stroke-width="4" stroke-linecap="round"/>',
         front='<circle cx="150" cy="60" r="3" fill="#C9DCEB"/>'),
    dict(ch='ス', ro='su', ko='스', row='サ행', ink='#46586B',
         story='스키를 타고 "스~" 미끄러져요.',
         back='<path d="M34 168h96l-10 10H30z" fill="#C9A227"/>'
              '<path d="M60 150l6 18M120 140l10 24" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/>'
              '<path d="M40 92l-14-6M42 106l-16 6" stroke="#C9DCEB" stroke-width="4" stroke-linecap="round"/>',
         front='<circle cx="150" cy="52" r="3" fill="#fff"/><circle cx="170" cy="70" r="2.4" fill="#fff"/>'),
    dict(ch='セ', ro='se', ko='세', row='サ행', ink='#7FA8C9',
         story='세탁기가 돌아가요 "세" — 거품이 보글보글.',
         back='<rect x="54" y="70" width="96" height="104" rx="12" fill="#EAF2F8" stroke="#B7D2E8" stroke-width="4"/>'
              '<circle cx="102" cy="124" r="30" fill="#BFDCEB" stroke="#9CC4E0" stroke-width="4"/>'
              '<circle cx="92" cy="114" r="7" fill="#fff" opacity=".8"/><circle cx="112" cy="132" r="5" fill="#fff" opacity=".8"/>',
         front='<circle cx="160" cy="60" r="7" fill="#fff"/><circle cx="176" cy="80" r="5" fill="#fff"/>'
               '<circle cx="44" cy="66" r="6" fill="#fff"/><path d="M76 84h50" stroke="#C9DCEB" stroke-width="5" stroke-linecap="round"/>'),
    dict(ch='ソ', ro='so', ko='소', row='サ행', ink='#2F6B4F',
         story='소나무 가지가 사선으로 뻗었어요 "소".',
         back='<path d="M96 180V104" stroke="#8A6242" stroke-width="8" stroke-linecap="round"/>'
              '<ellipse cx="96" cy="150" rx="42" ry="12" fill="#7FB392" opacity=".85"/>'
              '<ellipse cx="96" cy="118" rx="32" ry="10" fill="#9DC3AA" opacity=".9"/>',
         front='<circle cx="60" cy="40" r="3" fill="#C9DED2"/><circle cx="80" cy="30" r="2.4" fill="#C9DED2"/>'),
    dict(ch='タ', ro='ta', ko='타', row='タ행', ink='#7FB392',
         story='타월을 걸어 두었어요 "타".',
         back='<path d="M150 60c0-8 6-14 14-14s14 6 14 14c0 6-4 10-10 12v10" fill="none" stroke="#9AA7B5" stroke-width="4" stroke-linecap="round"/>'
              '<path d="M64 92h84v72H64z" fill="#EAF2F8"/>'
              '<path d="M64 92h84v20H64z" fill="#BFDCEB"/>'
              '<path d="M76 120h60M76 136h44M76 152h52" stroke="#D6E2EC" stroke-width="4" stroke-linecap="round"/>',
         front='<path d="M148 92v20" stroke="#9AA7B5" stroke-width="4"/>'),
    dict(ch='チ', ro='chi', ko='치', row='タ행', ink='#E8B93D',
         story='구멍 뚫린 치즈 한 조각 "치".',
         back='<path d="M96 128l64-14 6 44-62 14z" fill="#F2CE6B"/>'
              '<path d="M96 128l64-14 6 44-62 14z" fill="none" stroke="#D9A94E" stroke-width="2.4"/>'
              '<circle cx="120" cy="146" r="6" fill="#F6E2A8"/><circle cx="144" cy="140" r="4.4" fill="#F6E2A8"/>'
              '<circle cx="132" cy="160" r="3.6" fill="#F6E2A8"/>',
         front='<path d="M76 40c-6 8-4 16 4 20" stroke="#F2CE6B" stroke-width="3" fill="none" stroke-linecap="round"/>'),
    dict(ch='ツ', ro='tsu', ko='츠', row='タ행', ink='#7FA8C9',
         story='파도 두 개가 "츠" 하고 밀려와요.',
         back='<path d="M36 156c14 8 28 10 42 6" stroke="#C9DED2" stroke-width="5" fill="none" stroke-linecap="round"/>',
         front='<circle cx="58" cy="52" r="4" fill="#9CC4E0"/><circle cx="86" cy="40" r="3.4" fill="#9CC4E0"/>'
               + boat(158, 152, .9) + '<circle cx="168" cy="74" r="2.6" fill="#fff"/>'),
    dict(ch='テ', ro='te', ko='테', row='タ행', ink='#A0785A',
         story='테이블 위에 컵을 올려요 "테".',
         back=ground(176, 130),
         front=cup(66, 52, .78) + '<ellipse cx="66" cy="63" rx="26" ry="4" fill="#D9C9AE"/>'
               + steam(72, 36, .65, '#E7C7A6', 1)
               + '<path d="M150 150v26M40 176h120" stroke="#A0785A" stroke-width="5" stroke-linecap="round"/>'),
    dict(ch='ト', ro='to', ko='토', row='タ행', ink='#B08968',
         story='긴 귀를 세운 토끼 "토".',
         back=rabbit(138, 118, 1.0) + carrot(28, 138, .9),
         front='<circle cx="132" cy="112" r="3" fill="#3E4C43"/><circle cx="146" cy="112" r="3" fill="#3E4C43"/>'),
    dict(ch='ナ', ro='na', ko='나', row='タ행', ink='#8FA8C9',
         story='나이프로 토마토를 썰어요 "나".',
         back='<path d="M90 56h78v34H90z" fill="#C9DCEB"/>'
              '<path d="M90 56h78v8H90z" fill="#EAF2F8"/>'
              '<rect x="56" y="118" width="106" height="14" rx="6" fill="#D9C9AE"/>'
              '<circle cx="112" cy="106" r="14" fill="#D9534F"/><path d="M112 92c4-6 10-8 14-6-2 6-8 8-14 6z" fill="#7FB392"/>',
         front='<path d="M170 44l-12-5M172 62l-12 3" stroke="#C9DED2" stroke-width="3" fill="none" stroke-linecap="round"/>'),
    dict(ch='ニ', ro='ni', ko='니', row='タ행', ink='#C9793F',
         story='두 바늘로 니트를 떠요 "니".',
         back='<circle cx="148" cy="134" r="24" fill="#F6D3BC"/>'
              '<path d="M128 126c12-8 28-8 40 0M128 142c12 8 28 8 40 0" stroke="#D9A98A" stroke-width="3" fill="none"/>'
              '<path d="M128 134h40" stroke="#E58A76" stroke-width="3" stroke-linecap="round"/>',
         front='<circle cx="52" cy="60" r="3.4" fill="#9AA7B5"/><circle cx="160" cy="58" r="3.4" fill="#9AA7B5"/>'),
    dict(ch='ヌ', ro='nu', ko='누', row='タ행', ink='#E8A33D',
         story='국수가 엇갈려요, 후루룩 "누".',
         back=bowl(96, 148, 1.3, '#8FA8C9') + '<ellipse cx="96" cy="148" rx="38" ry="7" fill="#F2CE6B"/>'
              '<path d="M70 142c14 8 32 8 46 0" stroke="#E8A33D" stroke-width="3" fill="none"/>',
         front=steam(80, 122, .95) + '<path d="M150 62l-8 30M162 64l-8 30" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/>'),
    dict(ch='ネ', ro='ne', ko='네', row='タ행', ink='#E58A76',
         story='네모난 선물 상자에 리본을 묶었어요 "네".',
         back='<rect x="56" y="86" width="92" height="76" rx="8" fill="#F6D3BC"/>'
              '<path d="M56 118h92" stroke="#E58A76" stroke-width="8"/>'
              '<path d="M96 86v76" stroke="#E58A76" stroke-width="8"/>'
              '<path d="M96 86c-14-10-28-6-26 6 2 10 16 10 26 0zM96 86c14-10 28-6 26 6-2 10-16 10-26 0z" fill="#E58A76"/>',
         front='<circle cx="96" cy="86" r="7" fill="#C05F45"/>'),
    dict(ch='ノ', ro='no', ko='노', row='タ행', ink='#8A6242',
         story='노를 저어 배를 움직여요 "노".',
         back='<path d="M40 158h74l-12 14H30z" fill="#C05F45"/>'
              '<path d="M60 168c10 6 22 6 32 0" stroke="#BFDCEB" stroke-width="4" fill="none" stroke-linecap="round"/>'
              '<path d="M100 168c14 6 28 6 40 0" stroke="#BFDCEB" stroke-width="4" fill="none" stroke-linecap="round"/>',
         front='<circle cx="160" cy="60" r="3" fill="#9CC4E0"/>'),
    dict(ch='ハ', ro='ha', ko='하', row='ハ행', ink='#7FA8C9',
         story='두 날개를 펴고 하늘로 "하".',
         back='<path d="M40 130c22-6 38-2 50 10 12-12 28-16 50-10" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>',
         front=cloud(46, 60, .9) + cloud(156, 52, .75) + '<circle cx="100" cy="30" r="3" fill="#7FB392"/>'),
    dict(ch='ヒ', ro='hi', ko='히', row='ハ행', ink='#2F6B4F',
         story='히죽 웃는 얼굴 — 눈과 입이 "히".',
         back='',
         front=closed_eye(74, 64, 8) + closed_eye(128, 60, 8) + smile(100, 78, 12, 8) + blush(54, 88, 9, 5) + blush(148, 84, 9, 5) + spark(160, 44, 7)),
    dict(ch='フ', ro='fu', ko='후', row='ハ행', ink='#8FA8C9',
         story='후지산 꼭대기에 눈이 쌓였어요 "후".',
         back='<path d="M20 178L100 66l80 112z" fill="#9FB6CC"/>'
              '<path d="M78 96l22-30 22 30-11 8-11-8-11 8z" fill="#fff"/>'
              '<ellipse cx="100" cy="180" rx="88" ry="8" fill="#DCE7EF"/>',
         front=sun(168, 48, 14) + '<path d="M52 150c14-6 28-6 42 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>'),
    dict(ch='ヘ', ro='he', ko='ヘ', row='ハ행', ink='#C05F45',
         story='헬멧을 쓰고 "헤" — 끈까지 채웠어요.',
         back='<path d="M42 118a58 52 0 0 1 116 0z" fill="#E8A33D"/>'
              '<path d="M42 118h116" stroke="#C97F4E" stroke-width="5"/>'
              '<path d="M60 96c8-16 24-26 40-28" stroke="#F6E2C8" stroke-width="5" fill="none" stroke-linecap="round"/>'
              '<path d="M120 122c0 14 8 22 20 24" stroke="#C97F4E" stroke-width="5" fill="none" stroke-linecap="round"/>'
              '<rect x="134" y="144" width="12" height="9" rx="2" fill="#8A6242"/>',
         front=''),
    dict(ch='ホ', ro='ho', ko='호', row='ハ행', ink='#E8913D',
         story='동그란 호박, 줄기까지 "호".',
         back='<ellipse cx="100" cy="112" rx="56" ry="46" fill="#E8913D"/>'
              '<path d="M74 70c-6 26-6 58 0 84M126 70c6 26 6 58 0 84" stroke="#C97F4E" stroke-width="4" fill="none"/>'
              '<path d="M100 60v-12" stroke="#6E8F5E" stroke-width="6" stroke-linecap="round"/>'
              '<path d="M100 48c8-8 18-6 20 2-8 4-14 2-20-2z" fill="#7FB392"/>',
         front='<circle cx="86" cy="108" r="4" fill="#8A4B2A"/><circle cx="114" cy="108" r="4" fill="#8A4B2A"/>'
               '<path d="M82 128q18 12 36 0" stroke="#8A4B2A" stroke-width="4" fill="none" stroke-linecap="round"/>'),
    dict(ch='マ', ro='ma', ko='마', row='マ행', ink='#7FB392',
         story='마스크를 쓰고 "마" — 귀에 거는 끈까지.',
         back='<circle cx="100" cy="104" r="52" fill="#F2C6A0"/>'
              '<circle cx="82" cy="86" r="4" fill="#2B3A32"/><circle cx="118" cy="86" r="4" fill="#2B3A32"/>'
              '<path d="M72 118c0 20 12 32 28 32s28-12 28-32z" fill="#fff"/>'
              '<path d="M72 118h56" stroke="#DCE7EF" stroke-width="4"/>',
         front='<path d="M54 92c-10 4-14 12-12 22M146 92c10 4 14 12 12 22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>'),
    dict(ch='ミ', ro='mi', ko='미', row='マ행', ink='#C98A6B',
         story='고양이 수염이 세 줄, 미소 지어요 "미".',
         back=cat_face(96, 108, 1.0),
         front='<path d="M40 72l26 8M38 100h28M42 128l26-8" stroke="#C98A6B" stroke-width="3.4" stroke-linecap="round"/>'
               '<path d="M104 152c8 0 12 6 10 12-8 2-12-4-10-12z" fill="#E58A76"/>'),
    dict(ch='ム', ro='mu', ko='무', row='マ행', ink='#5C8F6E',
         story='비가 그친 뒤 무지개가 떴어요 "무".',
         back=rainbow(150, 66, .9) + cloud(58, 54, .8, '#fff'),
         front='<path d="M40 172c14 6 28 8 42 4" stroke="#C9DED2" stroke-width="4" fill="none" stroke-linecap="round"/>'),
    dict(ch='メ', ro='me', ko='메', row='マ행', ink='#6E9E7E',
         story='메뚜기가 풀잎을 타고 "메".',
         back='<path d="M30 178c34-2 64-14 86-34" stroke="#7FB392" stroke-width="4" fill="none" stroke-linecap="round"/>'
              '<ellipse cx="146" cy="66" rx="26" ry="14" fill="#8FBE9E" transform="rotate(-18 146 66)"/>'
              '<circle cx="168" cy="54" r="11" fill="#8FBE9E"/><circle cx="172" cy="51" r="2.8" fill="#2B3A32"/>'
              '<path d="M178 58l10 4-10 4z" fill="#C9A227"/>',
         front='<path d="M136 78l-6 22M156 78l2 24M126 72l-14 16" stroke="#6E9E7E" stroke-width="3.4" stroke-linecap="round"/>'),
    dict(ch='モ', ro='mo', ko='모', row='マ행', ink='#C98A6B',
         story='모래성 두 탑을 쌓았어요 "모".',
         back='<path d="M50 172h100v-52H50z" fill="#F2D9A8"/>'
              '<path d="M50 120h26v-20H50zM126 120h24v-20h-24z" fill="#E8C68A"/>'
              '<path d="M56 100l6-10 6 10M130 100l5-9 5 9" fill="#E8C68A"/>'
              '<path d="M50 172h100" stroke="#D9B87E" stroke-width="4"/>'
              '<path d="M118 92V78" stroke="#8A6242" stroke-width="3"/>'
              '<path d="M118 78l12 5-12 5z" fill="#E58A76"/>',
         front='<path d="M62 150h20M62 162h34" stroke="#D9B87E" stroke-width="3.4" stroke-linecap="round"/>'),
    dict(ch='ヤ', ro='ya', ko='야', row='ヤ행', ink='#B4703C',
         story='야구 방망이를 휘두르면 "야".',
         back='<circle cx="168" cy="50" r="11" fill="#fff" stroke="#C05F45" stroke-width="2"/>'
              '<path d="M164 44q6 6 0 12" stroke="#C05F45" stroke-width="1.6" fill="none"/>'
              '<path d="M148 40c10-2 18 0 24 6" stroke="#C9DED2" stroke-width="3" fill="none" stroke-dasharray="5 6"/>',
         front='<path d="M156 78l-16-6M160 94l-18 2" stroke="#C9DED2" stroke-width="3.4" stroke-linecap="round"/>'),
    dict(ch='ユ', ro='yu', ko='유', row='ヤ행', ink='#7FA8C9',
         story='유리컵에 물을 따라 "유".',
         back='<path d="M62 70h76l-6 90H68z" fill="#EAF2F8" stroke="#B7D2E8" stroke-width="4"/>'
              '<path d="M66 106h68l-4 54H70z" fill="#9CC4E0" opacity=".8"/>',
         front='<path d="M120 62l-14 52" stroke="#E58A76" stroke-width="6" stroke-linecap="round"/>'
               '<path d="M84 96h26" stroke="#fff" stroke-width="4" opacity=".8" stroke-linecap="round"/>'),
    dict(ch='ヨ', ro='yo', ko='요', row='ヤ행', ink='#E8B93D',
         story='요요가 줄 끝에서 돌아와요 "요".',
         back='<path d="M104 40c0-10 8-16 18-14" stroke="#C97F4E" stroke-width="3" fill="none" stroke-linecap="round"/>',
         front=star(112, 96, 10, '#fff') + '<circle cx="86" cy="120" r="4" fill="#fff" opacity=".7"/>'),
    dict(ch='ラ', ro='ra', ko='라', row='ラ행', ink='#E58A76',
         story='라면 한 그릇, 김 모락모락 "라".',
         back=bowl(100, 150, 1.35, '#D9534F') + '<ellipse cx="100" cy="150" rx="40" ry="7" fill="#F6E2C8"/>'
              '<circle cx="118" cy="146" r="9" fill="#F6E2C8"/><circle cx="118" cy="146" r="4" fill="#F2CE6B"/>',
         front=steam(80, 124, 1.0) + '<path d="M140 62l-10 34M154 64l-10 34" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/>'),
    dict(ch='リ', ro='ri', ko='리', row='ラ행', ink='#E58A76',
         story='리본 두 갈래가 나풀나풀 "리".',
         back='<path d="M104 44c-16-12-32-6-30 8 2 12 18 14 28 4z" fill="#F6D3BC"/>'
              '<path d="M110 44c16-12 32-6 30 8-2 12-18 14-28 4z" fill="#F6D3BC"/>'
              '<circle cx="107" cy="48" r="7" fill="#E9A88D"/>',
         front='<circle cx="86" cy="150" r="4" fill="#F2CE6B"/><circle cx="126" cy="160" r="3.4" fill="#F2CE6B"/>'),
    dict(ch='ル', ro='ru', ko='루', row='ラ행', ink='#B08968',
         story='루돌프 사슴의 뿔이 갈라졌어요 "루".',
         back='<ellipse cx="112" cy="146" rx="26" ry="22" fill="#B08968"/>'
              '<path d="M96 132c-6-8-4-16 4-20M128 132c6-8 4-16-4-20" stroke="#B08968" stroke-width="5" fill="none" stroke-linecap="round"/>'
              '<path d="M92 126l-10-12M132 126l10-12" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/>'
              '<circle cx="104" cy="146" r="3" fill="#3E4C43"/><circle cx="120" cy="146" r="3" fill="#3E4C43"/>'
              '<circle cx="112" cy="158" r="4.4" fill="#C05F45"/>',
         front='<path d="M84 116l-8-8M140 116l8-8" stroke="#8A6242" stroke-width="4" stroke-linecap="round"/>'),
    dict(ch='レ', ro='re', ko='레', row='ラ행', ink='#E8B93D',
         story='레몬에이드 한 잔, 상큼해요 "레".',
         back='<path d="M132 64h44l-6 100h-32z" fill="#EAF2F8" stroke="#B7D2E8" stroke-width="4"/>'
              '<path d="M136 96h36l-4 64h-28z" fill="#F6E2A8"/>'
              '<circle cx="154" cy="82" r="14" fill="#F2CE6B"/><path d="M154 68v28M140 82h28" stroke="#F6E2A8" stroke-width="2.4"/>'
              '<path d="M160 56l-6 22" stroke="#E58A76" stroke-width="4" stroke-linecap="round"/>',
         front=drop(60, 96, 5) + spark(48, 66, 6, '#9DC3AA')),
    dict(ch='ロ', ro='ro', ko='로', row='ラ행', ink='#8FA8C9',
         story='네모난 로봇 얼굴이 "로" 하고 인사해요.',
         back='<rect x="52" y="60" width="96" height="96" rx="14" fill="#B7C4D1"/>'
              '<path d="M100 60V42" stroke="#8FA8C9" stroke-width="4"/><circle cx="100" cy="38" r="6" fill="#E58A76"/>'
              '<path d="M52 96h-14M148 96h14" stroke="#8FA8C9" stroke-width="6" stroke-linecap="round"/>',
         front='<circle cx="86" cy="96" r="7" fill="#fff"/><circle cx="114" cy="96" r="7" fill="#fff"/>'
               '<circle cx="86" cy="96" r="3.4" fill="#3E4C43"/><circle cx="114" cy="96" r="3.4" fill="#3E4C43"/>'
               '<path d="M88 124h24" stroke="#7E8C99" stroke-width="4" stroke-linecap="round"/>'),
    dict(ch='ワ', ro='wa', ko='와', row='ワ행', ink='#E58A76',
         story='"와!" 하고 입을 크게 벌렸어요.',
         back='',
         front=eye(72, 56) + eye(126, 52) + '<ellipse cx="100" cy="118" rx="30" ry="26" fill="#7E3A33"/>'
               '<ellipse cx="100" cy="132" rx="17" ry="9" fill="#E58A76"/>'
               '<path d="M74 96c16-8 36-8 52 0" stroke="#fff" stroke-width="8" stroke-linecap="round"/>'
               + spark(168, 62, 8, '#F2CE6B')),
    dict(ch='ヲ', ro='wo', ko='오', row='ワ행', ink='#E8A33D',
         story='오리가 물 위를 미끄러져요 "오".',
         back=duck(122, 130, 1.0) + '<path d="M40 166c14 8 30 10 46 8M120 170c16 6 32 4 44-2" stroke="#BFDCEB" stroke-width="4" fill="none" stroke-linecap="round"/>',
         front='<circle cx="46" cy="98" r="3" fill="#9CC4E0"/><circle cx="62" cy="84" r="2.4" fill="#9CC4E0"/>'),
    dict(ch='ン', ro='n', ko='응', row='ワ행', ink='#7FB392',
         story='응원단이 팔을 흔들어요 "응".',
         back='<circle cx="140" cy="120" r="20" fill="#F2C6A0"/>'
              '<path d="M120 184c0-18 9-30 20-30s20 12 20 30z" fill="#E58A76"/>'
              '<circle cx="152" cy="112" r="3.4" fill="#3E4C43"/><circle cx="140" cy="112" r="3.4" fill="#3E4C43"/>'
              '<path d="M144 124q6 6 12 0" stroke="#C9785F" stroke-width="3" fill="none" stroke-linecap="round"/>',
         front='<path d="M160 88l18-14" stroke="#F2C6A0" stroke-width="8" stroke-linecap="round"/>'
               '<circle cx="184" cy="68" r="14" fill="#F2CE6B"/>'
               '<path d="M184 54v-8M184 90v-8M170 68h-8M198 68h-8" stroke="#E8A33D" stroke-width="3.4" stroke-linecap="round"/>'),
]

ENTRIES = HIRA + KATA


# ---------------------------------------------------------------- output
def js_str(s):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'


def write_data():
    if len(HIRA) != 46 or len(KATA) != 46:
        sys.exit(f'need 46+46 entries, got {len(HIRA)}+{len(KATA)}')

    def block(items):
        return ',\n'.join(
            '  { ch: ' + js_str(e['ch']) + ', ro: ' + js_str(e['ro']) + ', ko: ' + js_str(e['ko'])
            + ', row: ' + js_str(e['row']) + ', story: ' + js_str(e['story'])
            + ', ink: ' + js_str(e['ink'])
            + (', dy: ' + str(e['dy']) if e.get('dy') else '')
            + ', back: ' + js_str(e['back']) + ', front: ' + js_str(e['front']) + ' }'
            for e in items)

    OUT.write_text(
        '/* ============================================================\n'
        '   가나 데이터 — tools/gen_kana.py 가 만든 파일 (직접 고치지 마세요)\n'
        '   히라가나 46자 · 가타카나 46자, 글자 획 + 연상 그림\n'
        '   ============================================================ */\n'
        'var KANA_HIRA = [\n' + block(HIRA) + '\n];\n\nvar KANA_KATA = [\n' + block(KATA) + '\n];\n',
        encoding='utf-8')
    print('wrote', OUT, len(HIRA) + len(KATA), 'entries')


def preview():
    js = (ROOT / 'src' / 'kana-glyphs.js').read_text(encoding='utf-8')
    g = {m.group(1): (m.group(2), m.group(3)) for m in
         re.finditer(r'"(.{1})": \{ d: "((?:[^"\\]|\\.)*)", t: "([^"]+)" \}', js)}
    cells = []
    for e in ENTRIES:
        d, t = g[e['ch']]
        art = (f'<svg viewBox="0 0 200 200" width="200" height="200">'
               f'<rect width="200" height="200" fill="#F6F1E7"/>'
               + e['back']
               + f'<path d="{d}" transform="{t}" fill="{e["ink"]}" stroke="{e["ink"]}" stroke-width="26" '
                 f'stroke-linejoin="round" stroke-linecap="round"/>'
               + e['front'] + '</svg>')
        cells.append(f'<div class="c">{art}<div class="t"><b>{e["ch"]} {e["ko"]}</b> {e["story"]}</div></div>')
    html = ('<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#fff;font:12.5px/1.45 sans-serif}'
            '.g{display:grid;grid-template-columns:repeat(5,210px);gap:10px;padding:10px}'
            '.c{border:1px solid #eee;border-radius:8px;overflow:hidden}'
            '.t{padding:5px 7px;color:#555}.t b{color:#1B4D3E}</style><div class="g">'
            + ''.join(cells) + '</div>')
    p = ROOT / 'qa' / '_kana-sheet.html'
    p.write_text(html, encoding='utf-8')
    script = f'''
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={{'width':1120,'height':1200}})
    pg.goto('file://{p}')
    pg.wait_for_timeout(200)
    pg.screenshot(path='{ROOT / "qa" / "_kana-sheet.png"}', full_page=True)
    b.close()
'''
    import os
    env = dict(os.environ)
    env['LD_LIBRARY_PATH'] = '/workspace/tmp/libs/root/usr/lib/x86_64-linux-gnu'
    subprocess.run([sys.executable, '-c', script], check=True, env=env)
    print('preview ok')


if __name__ == '__main__':
    if '--preview' in sys.argv:
        preview()
    else:
        write_data()

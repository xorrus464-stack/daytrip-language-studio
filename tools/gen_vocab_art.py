#!/usr/bin/env python3
"""필수 단어 41개의 그림을 '뜻이 한눈에 보이는 장면'으로 만들어 src/vocab-art.js 로 저장."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'vocab-art.js'

SKIN = '#F2C6A0'
INK = '#2B3A32'


def fig(x, y, s=1.0, shirt='#7FA8C9', opt=None):
    """머리+몸통+팔+다리. opt: arms, face, hair, legs, flip"""
    o = opt or {}
    g = f'<g transform="translate({x},{y}) scale({s})' + (' scale(-1,1)' if o.get('flip') else '') + '">'
    g += o.get('behind', '')
    g += o.get('legs', f'<path d="M-8 28v26M8 28v26" stroke="#4A5A66" stroke-width="9" stroke-linecap="round"/>')
    g += f'<path d="M-16 0c0-9 7-16 16-16s16 7 16 16v20c0 6-5 10-10 10H-6c-5 0-10-4-10-10z" fill="{shirt}"/>'
    g += o.get('arms', f'<path d="M-16 3l-12 18M16 3l12 18" stroke="{shirt}" stroke-width="7" stroke-linecap="round"/>')
    g += f'<circle cx="0" cy="-28" r="13" fill="{SKIN}"/>'
    g += f'<path d="M-13 -32c0-8 6-13 13-13s13 5 13 13c-4-3-7-4-13-4s-9 1-13 4z" fill="{o.get("hair", "#4A3B2E")}"/>'
    g += f'<circle cx="-4.4" cy="-27" r="1.8" fill="{INK}"/><circle cx="4.4" cy="-27" r="1.8" fill="{INK}"/>'
    f = o.get('face', 'smile')
    if f == 'happy':
        g += f'<path d="M-5 -20q5 5 10 0" stroke="{INK}" stroke-width="1.7" fill="none" stroke-linecap="round"/>'
    elif f == 'open':
        g += '<ellipse cx="0" cy="-20" rx="3.4" ry="4.4" fill="#B4553E"/>'
    elif f == 'flat':
        g += f'<path d="M-4 -20h8" stroke="{INK}" stroke-width="1.7" stroke-linecap="round"/>'
    else:
        g += f'<path d="M-4 -21q4 3.4 8 0" stroke="{INK}" stroke-width="1.7" fill="none" stroke-linecap="round"/>'
    g += o.get('front', '')
    return g + '</g>'


def sun(x, y, r=12):
    rays = ''.join(f'<path d="M{x + (r + 5) * dx:.0f} {y + (r + 5) * dy:.0f}L{x + (r + 11) * dx:.0f} {y + (r + 11) * dy:.0f}" stroke="#F2CE6B" stroke-width="3" stroke-linecap="round"/>'
                   for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (.7, .7), (-.7, .7), (.7, -.7), (-.7, -.7)))
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="#F2CE6B"/>' + rays


def drop(x, y, s=4.5, c='#9CC4E0'):
    return (f'<path d="M{x} {y - s * 1.6:.1f}c-{s * .9:.1f} {s * 1.2:.1f} -{s:.1f} {s * 1.9:.1f} 0 {s * 1.9:.1f}'
            f's{s:.1f} -{s * .7:.1f} 0 -{s * 1.9:.1f}z" fill="{c}"/>')


def spark(x, y, s=6, c='#F2CE6B'):
    return f'<path d="M{x - s} {y}H{x + s}M{x} {y - s}V{y + s}" stroke="{c}" stroke-width="2.8" stroke-linecap="round"/>'


def star(x, y, s=7, c='#F2CE6B'):
    return (f'<path d="M{x} {y - s}l{s * .26:.1f} {s * .62:.1f} {s * .68:.1f} {s * .22:.1f}'
            f'-{s * .5:.1f} {s * .46:.1f} {s * .16:.1f} {s * .7:.1f}'
            f'-{s * .6:.1f} -{s * .42:.1f} -{s * .6:.1f} {s * .42:.1f}'
            f'{s * .16:.1f} -{s * .7:.1f} -{s * .5:.1f} -{s * .46:.1f}'
            f'{s * .68:.1f} -{s * .22:.1f}z" fill="{c}"/>')


def bubble(x, y, w, h, tail='left', c='#fff', line='#E4DACA'):
    t = (f'<path d="M{x + 16} {y + h - 1}l-2 11 13-10z" fill="{c}"/>' if tail == 'left'
         else f'<path d="M{x + w - 16} {y + h - 1}l2 11-13-10z" fill="{c}"/>')
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="9" fill="{c}" stroke="{line}" stroke-width="1.6"/>' + t


def cup(x, y, s=1.0, c='#EFA96B'):
    return (f'<g transform="translate({x},{y}) scale({s})"><path d="M-13 0h26v11c0 8-6 13-13 13S-13 19-13 11z" fill="{c}"/>'
            f'<path d="M13 3h4a7 7 0 0 1 0 14h-4" fill="none" stroke="{c}" stroke-width="3"/></g>')


def bowl(x, y, s=1.0, c='#E9A88D', food='#F6E2C8'):
    return (f'<g transform="translate({x},{y}) scale({s})"><path d="M-24 0h48c0 15-11 25-24 25S-24 15-24 0z" fill="{c}"/>'
            f'<ellipse cx="0" cy="0" rx="24" ry="6" fill="{food}"/></g>')


def chop(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})"><path d="M0 0l-6 26M8 0l-2 26" stroke="#8A6242" stroke-width="3" stroke-linecap="round"/></g>')


def steam(x, y, s=1.0, c='#C9DED2'):
    return (f'<path d="M{x} {y}c-5 -8 5 -12 0 -20M{x + 11 * s:.0f} {y} c-5 -8 5 -12 0 -20" '
            f'stroke="{c}" stroke-width="{4 * s:.1f}" fill="none" stroke-linecap="round"/>')


def sign(x, y, w, h, c='#1B4D3E'):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="{c}"/>'
            f'<path d="M{x + 8} {y + h / 2}h{w - 16}" stroke="#fff" stroke-width="3" opacity=".55" stroke-linecap="round"/>')


def suitcase(x, y, s=1.0, c='#C97F4E'):
    return (f'<g transform="translate({x},{y}) scale({s})"><rect x="-12" y="-16" width="24" height="20" rx="3" fill="{c}"/>'
            f'<path d="M-4 -16v-4h8v4M0 -16v20" stroke="#8A5A3B" stroke-width="2" fill="none"/></g>')


def card(x, y, w=26, h=17, c='#7FB392'):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{c}"/>'
            f'<rect x="{x}" y="{y + 5}" width="{w}" height="4" fill="#1B4D3E" opacity=".5"/>')


def tag(x, y, c='#F2CE6B'):
    return (f'<path d="M{x} {y}h16v12l-8 6-8-6z" fill="{c}"/><circle cx="{x + 8}" cy="{y + 5}" r="2" fill="#fff"/>')


def ground(y=180, w=120, c='#E7DCC8'):
    return f'<ellipse cx="100" cy="{y}" rx="{w // 2}" ry="6" fill="{c}"/>'


def zzz(x, y):
    return (f'<path d="M{x} {y}h10l-10 12h10M{x + 13} {y - 12}h7l-7 9h7" stroke="#9AA7B5" stroke-width="2.6" fill="none" stroke-linejoin="round"/>')


ART = {}

# ---------- 주어·명사 ----------
ART['watashi'] = (ground(), fig(100, 118, 1.0, '#7FA8C9', {
    'arms': '<path d="M-16 3l-6 22M16 3l14 12" stroke="#7FA8C9" stroke-width="7" stroke-linecap="round"/>',
    'front': '<path d="M14 15c6-2 10 1 10 6" stroke="#7FA8C9" stroke-width="7" fill="none" stroke-linecap="round"/>'
             + '<circle cx="44" cy="54" r="9" fill="#fff" stroke="#E4DACA" stroke-width="1.6"/>'
             + '<path d="M40 54h8" stroke="#C97F4E" stroke-width="2"/>'}))

ART['anata'] = ('<circle cx="60" cy="18" r="16" fill="#F6D3BC" opacity=".35"/>'
                + fig(66, 120, .95, '#9DC3AA', {'face': 'flat'})
                + fig(148, 118, 1.0, '#7FA8C9', {'flip': True})
                + '<path d="M104 96h22M118 88l8 8-8 8" stroke="#E58A76" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
                + '<circle cx="136" cy="74" r="8" fill="none" stroke="#E58A76" stroke-width="3" opacity=".8"/>')

ART['mizu'] = (ground(), fig(88, 116, 1.0, '#7FA8C9', {
    'arms': '<path d="M-16 3l-4 20M16 3l14 10" stroke="#7FA8C9" stroke-width="7" stroke-linecap="round"/>'})
    + '<path d="M136 58h30l-4 44h-22z" fill="#BFDCEB" opacity=".9"/>'
    + '<path d="M136 58h30" stroke="#fff" stroke-width="3"/>' + drop(124, 46) + drop(168, 40) * 0
    + '<path d="M104 92l26 10" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>')

ART['ocha'] = (ground(), fig(92, 118, 1.0, '#7FB392', {
    'arms': '<path d="M-16 3l-8 18M16 3l12 14" stroke="#7FB392" stroke-width="7" stroke-linecap="round"/>'})
    + cup(140, 96, 1.0, '#7FB392') + steam(134, 90) + '<path d="M110 96l26-6" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>')

ART['gohan'] = (ground(), fig(96, 116, 1.0, '#E58A76', {'face': 'open'})
                + bowl(140, 104, 1.0, '#D9534F') + chop(128, 64, 1.0)
                + '<path d="M112 94l24 6" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>'
                + steam(146, 96, .8))

ART['eki'] = ('<rect x="96" y="28" width="88" height="46" rx="6" fill="#EFF1EA"/>'
              '<path d="M88 28h104" stroke="#1B4D3E" stroke-width="6" stroke-linecap="round"/>'
              '<rect x="108" y="42" width="22" height="32" fill="#C9DED2"/><rect x="146" y="42" width="26" height="18" fill="#F6D3BC"/>'
              '<rect x="130" y="14" width="22" height="13" rx="3" fill="#1B4D3E"/>'
              + ground(182, 130)
              + fig(58, 122, .95, '#8FA8C9', {'arms': '<path d="M-16 3l-14 10M16 3l18 4" stroke="#8FA8C9" stroke-width="7" stroke-linecap="round"/>'})
              + suitcase(38, 156, 1.0)
              + '<path d="M20 96h22M36 90l8 6-8 6" stroke="#E58A76" stroke-width="4" fill="none" stroke-linecap="round"/>')

ART['densha'] = ('<rect x="90" y="24" width="92" height="112" rx="14" fill="#7FA8C9"/>'
                 '<rect x="102" y="38" width="68" height="34" rx="6" fill="#EAF2F8"/>'
                 '<path d="M136 38v34" stroke="#B7D2E8" stroke-width="3"/>'
                 '<rect x="100" y="104" width="72" height="20" rx="4" fill="#fff" opacity=".5"/>'
                 '<circle cx="108" cy="140" r="7" fill="#3E4C43"/><circle cx="164" cy="140" r="7" fill="#3E4C43"/>'
                 + ground(184, 150)
                 + fig(48, 118, .95, '#E58A76', {'arms': '<path d="M-16 3l-10 12M16 3l16 6" stroke="#E58A76" stroke-width="7" stroke-linecap="round"/>'})
                 + '<path d="M70 96h16M80 90l7 6-7 6" stroke="#1B4D3E" stroke-width="3.4" fill="none" stroke-linecap="round"/>')

ART['kuukou'] = ('<path d="M96 92l42-13V56c0-6 3-9 7-9s7 3 7 9v23l42 13v11l-42-6v21l12 8v8l-20-5-20 5v-8l12-8v-21l-42 6z" fill="#8FA8C9" transform="rotate(20 146 96)"/>'
                 + ground(184, 150)
                 + fig(56, 122, .95, '#7FB392', {'face': 'open'})
                 + suitcase(36, 158, 1.0, '#8FA8C9')
                 + '<path d="M20 92c10-8 22-10 32-6" stroke="#C9DED2" stroke-width="3" fill="none" stroke-dasharray="5 6"/>')

ART['hoteru'] = ('<rect x="86" y="36" width="98" height="126" rx="8" fill="#F6D3BC"/>'
                 '<rect x="86" y="36" width="98" height="18" rx="8" fill="#C97F4E"/>'
                 '<rect x="100" y="62" width="18" height="16" fill="#fff" opacity=".85"/><rect x="132" y="62" width="18" height="16" fill="#fff" opacity=".85"/>'
                 '<rect x="100" y="88" width="18" height="16" fill="#fff" opacity=".85"/><rect x="132" y="88" width="18" height="16" fill="#fff" opacity=".85"/>'
                 '<rect x="112" y="120" width="44" height="26" rx="5" fill="#1B4D3E"/>'
                 + ground(184, 160)
                 + fig(48, 122, .95, '#8E86B8', {'arms': '<path d="M-16 3l-10 14M16 3l16 2" stroke="#8E86B8" stroke-width="7" stroke-linecap="round"/>'})
                 + suitcase(28, 158, 1.0, '#C97F4E'))

ART['toire'] = ('<rect x="94" y="28" width="86" height="60" rx="7" fill="#fff" stroke="#1B4D3E" stroke-width="4"/>'
                '<path d="M137 30v56" stroke="#E4DACA" stroke-width="3"/>'
                '<circle cx="118" cy="48" r="6" fill="#7FA8C9"/>'
                '<path d="M118 56v14M118 62l-8 9M118 62l8 9M118 70l-6 14M118 70l6 14" stroke="#7FA8C9" stroke-width="4.4" fill="none" stroke-linecap="round"/>'
                '<circle cx="158" cy="48" r="6" fill="#E9A88D"/>'
                '<path d="M158 56v10l-10 18h20l-10-18M148 84v10M168 84v10" stroke="#E9A88D" stroke-width="4.4" fill="none" stroke-linecap="round"/>'
                + ground(184, 150)
                + fig(56, 124, .95, '#9DC3AA', {'face': 'flat'})
                + '<path d="M74 96h16M84 90l7 6-7 6" stroke="#1B4D3E" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
                + '<path d="M40 74l-8-8M36 92h-10" stroke="#C9DED2" stroke-width="3" stroke-linecap="round"/>')

ART['okane'] = (ground(), fig(96, 118, 1.0, '#7FB392', {
    'arms': '<path d="M-16 3l-6 18M16 3l12 12" stroke="#7FB392" stroke-width="7" stroke-linecap="round"/>'})
    + '<rect x="118" y="84" width="34" height="24" rx="4" fill="#C97F4E"/>'
    + '<path d="M118 90h34" stroke="#8A5A3B" stroke-width="3"/>'
    + '<circle cx="166" cy="60" r="13" fill="#F2CE6B"/><circle cx="166" cy="60" r="7" fill="none" stroke="#D9A94E" stroke-width="2.4"/>'
    + '<circle cx="180" cy="84" r="9" fill="#E8A33D"/>'
    + '<path d="M112 96l16-4" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>'
    + spark(60, 58, 5))

ART['kyou'] = ('<rect x="96" y="30" width="86" height="84" rx="8" fill="#fff" stroke="#E4DACA" stroke-width="3"/>'
               '<rect x="96" y="30" width="86" height="20" rx="8" fill="#E9A88D"/>'
               '<circle cx="112" cy="40" r="3" fill="#fff"/><circle cx="166" cy="40" r="3" fill="#fff"/>'
               '<circle cx="139" cy="78" r="16" fill="#F2CE6B"/>'
               '<path d="M139 62v-5M139 99v5M123 78h-5M160 78h5" stroke="#E8A33D" stroke-width="3" stroke-linecap="round"/>'
               + ground(184, 140)
               + fig(52, 124, .95, '#E58A76', {'arms': '<path d="M-16 3l-8 16M16 3l18-6" stroke="#E58A76" stroke-width="7" stroke-linecap="round"/>'})
               + '<path d="M84 92h10" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>')

ART['ashita'] = ('<rect x="96" y="30" width="86" height="84" rx="8" fill="#fff" stroke="#E4DACA" stroke-width="3"/>'
                 '<rect x="96" y="30" width="86" height="20" rx="8" fill="#8FA8C9"/>'
                 '<circle cx="112" cy="40" r="3" fill="#fff"/><circle cx="166" cy="40" r="3" fill="#fff"/>'
                 '<path d="M112 64h48M112 78h32M112 92h40" stroke="#DCE7EF" stroke-width="4" stroke-linecap="round"/>'
                 + ground(184, 140)
                 + fig(52, 124, .95, '#9DC3AA', {'arms': '<path d="M-16 3l-8 16M16 3l18-8" stroke="#9DC3AA" stroke-width="7" stroke-linecap="round"/>'})
                 + '<path d="M84 88l12-8M96 80l2 12-12 0" fill="none" stroke="#E58A76" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'
                 + star(176, 138, 7))

ART['hito'] = (ground(184, 170), fig(68, 122, .95, '#7FB392', {'face': 'happy'}),
               fig(140, 122, .95, '#8FA8C9', {'flip': True, 'face': 'happy'}),
               '<path d="M96 92c6-6 14-6 20 0" stroke="#C9DED2" stroke-width="3" fill="none" stroke-linecap="round"/>')

ART['michi'] = ('<path d="M56 182c0-52 78-50 78-102 0-22-16-34-34-34" fill="none" stroke="#E0D3BC" stroke-width="22" stroke-linecap="round"/>'
                '<path d="M56 182c0-52 78-50 78-102 0-22-16-34-34-34" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 10"/>'
                + fig(74, 128, .9, '#E58A76', {'face': 'happy'})
                + '<path d="M130 46c-8 0-14 6-14 14 0 12 14 26 14 26s14-14 14-26c0-8-6-14-14-14z" fill="#E58A76"/><circle cx="130" cy="60" r="5" fill="#fff"/>')

ART['namae'] = ('<rect x="92" y="64" width="94" height="60" rx="6" fill="#fff" stroke="#1B4D3E" stroke-width="3"/>'
                '<circle cx="110" cy="94" r="10" fill="#F2C6A0"/>'
                '<path d="M126 84h46M126 96h32M126 108h22" stroke="#C9DED2" stroke-width="4" stroke-linecap="round"/>'
                + ground(184, 150)
                + fig(50, 124, .95, '#8E86B8', {'arms': '<path d="M-16 3l-8 14M16 3l16-6" stroke="#8E86B8" stroke-width="7" stroke-linecap="round"/>'})
                + '<path d="M78 96l24-2" stroke="#8A6242" stroke-width="3.4" stroke-linecap="round"/>'
                + '<path d="M100 92l8 4-8 5z" fill="#8A6242"/>')

# ---------- 동사 ----------
ART['iku'] = ('<rect x="132" y="40" width="54" height="96" rx="6" fill="#F6D3BC" opacity=".55"/>'
              '<path d="M132 40h54v96h-54z" fill="none" stroke="#E0D3BC" stroke-width="2.4"/>'
              '<rect x="146" y="86" width="26" height="50" fill="#C9DED2"/>'
              + ground(184, 170)
              + fig(78, 120, 1.0, '#8FA8C9', {'arms': '<path d="M-16 3l-16 8M16 3l12 16" stroke="#8FA8C9" stroke-width="7" stroke-linecap="round"/>'})
              + '<path d="M30 96h34M54 88l10 8-10 8" stroke="#E58A76" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
              + '<path d="M46 140l-8 6M56 150l-8 6" stroke="#C9DED2" stroke-width="3" stroke-linecap="round"/>')

ART['kuru'] = (ground(184, 170),
               fig(104, 120, 1.0, '#7FB392', {'arms': '<path d="M-16 3l-14 12M16 3l14 12" stroke="#7FB392" stroke-width="7" stroke-linecap="round"/>', 'face': 'happy'}),
               '<path d="M62 92h-30M44 84l-10 8 10 8" stroke="#E58A76" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
               '<path d="M150 76c8-6 8-14 0-20M164 82c12-8 12-20 0-28" stroke="#C9DED2" stroke-width="3.4" fill="none" stroke-linecap="round"/>')

ART['taberu'] = (ground(), fig(92, 118, 1.0, '#E58A76', {'face': 'open', 'face_': ''})
                 + bowl(146, 106, 1.0, '#D9534F') + chop(134, 64)
                 + '<path d="M110 94l22 8" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>'
                 + '<path d="M142 84c6-4 12-4 16 0" stroke="#E8A33D" stroke-width="3" fill="none" stroke-linecap="round"/>'
                 + spark(176, 70, 5))

ART['nomu'] = (ground(), fig(92, 118, 1.0, '#7FA8C9', {'face': 'open'})
               + '<path d="M132 62h34l-5 48h-24z" fill="#BFDCEB"/>'
               + '<path d="M132 62h34" stroke="#fff" stroke-width="3.4"/>'
               + '<path d="M110 92l24 8" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>'
               + '<path d="M144 70c-6 10-8 18-8 26" stroke="#EAF2F8" stroke-width="3" fill="none"/>')

ART['kau'] = (ground(), fig(84, 118, 1.0, '#9DC3AA', {'arms': '<path d="M-16 3l-6 16M16 3l14 10" stroke="#9DC3AA" stroke-width="7" stroke-linecap="round"/>'})
              + '<rect x="108" y="88" width="66" height="26" rx="5" fill="#C9A227"/>'
              + '<rect x="120" y="76" width="18" height="14" rx="3" fill="#E9A88D"/><rect x="144" y="76" width="18" height="14" rx="3" fill="#8FA8C9"/>'
              + '<circle cx="158" cy="140" r="13" fill="#F2CE6B"/>'
              + '<path d="M100 96l12-6" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>')

ART['miru'] = (ground(), fig(86, 120, 1.0, '#7FB392', {'arms': '<path d="M-16 3l-10 14M16 3l12 10" stroke="#7FB392" stroke-width="7" stroke-linecap="round"/>'})
               + '<rect x="112" y="70" width="62" height="46" rx="5" fill="#fff" stroke="#1B4D3E" stroke-width="3"/>'
               + '<path d="M118 104l14-16 12 12 10-14 12 18z" fill="#9DC3AA"/>'
               + '<circle cx="158" cy="84" r="5" fill="#F2CE6B"/>'
               + '<path d="M96 92l18-6" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>')

ART['kiku'] = (ground(), fig(92, 120, 1.0, '#E58A76', {'arms': '<path d="M-16 3l-14 8M16 3l10 12" stroke="#E58A76" stroke-width="7" stroke-linecap="round"/>'})
               + '<path d="M74 56c0-14 10-24 24-24s24 10 24 24c0 12-8 18-14 24" fill="none" stroke="#9AA7B5" stroke-width="5"/>'
               + '<circle cx="88" cy="98" r="10" fill="#9AA7B5"/>'
               + '<path d="M112 52c8 8 12 18 12 28M126 44c10 12 14 24 12 38" stroke="#C9DED2" stroke-width="3" fill="none" stroke-linecap="round"/>')

ART['hanasu'] = (ground(), fig(70, 122, .95, '#8FA8C9', {'face': 'open'}),
                 fig(140, 122, .95, '#9DC3AA', {'flip': True, 'face': 'smile'}),
                 bubble(30, 52, 62, 30) + '<path d="M42 66h38M42 72h24" stroke="#C9DED2" stroke-width="3" stroke-linecap="round"/>',
                 bubble(112, 46, 62, 30, 'right') + '<path d="M124 60h38M124 66h20" stroke="#C9DED2" stroke-width="3" stroke-linecap="round"/>')

ART['matsu'] = ('<rect x="52" y="118" width="96" height="12" rx="5" fill="#C9A227"/>'
                '<path d="M66 130v34M134 130v34" stroke="#A9843F" stroke-width="6" stroke-linecap="round"/>'
                + fig(100, 108, .95, '#7FA8C9', {'legs': '<path d="M-8 26v-2M8 26v-2" stroke="#4A5A66" stroke-width="0"/>',
                                                 'arms': '<path d="M-16 3l-10 16M16 3l10 16" stroke="#7FA8C9" stroke-width="7" stroke-linecap="round"/>'})
                + '<circle cx="160" cy="66" r="20" fill="#fff" stroke="#7FA8C9" stroke-width="4"/>'
                + '<path d="M160 54v12l8 6" stroke="#1B4D3E" stroke-width="3" fill="none" stroke-linecap="round"/>'
                + '<circle cx="160" cy="66" r="2.6" fill="#1B4D3E"/>')

ART['harau'] = (ground(), fig(80, 118, 1.0, '#9DC3AA', {'arms': '<path d="M-16 3l-6 16M16 3l14 6" stroke="#9DC3AA" stroke-width="7" stroke-linecap="round"/>'})
                + '<rect x="112" y="92" width="60" height="40" rx="6" fill="#EAF2F8" stroke="#B7D2E8" stroke-width="3"/>'
                + '<rect x="120" y="100" width="26" height="14" rx="2" fill="#7FA8C9"/>'
                + '<path d="M152 108h12M152 116h8" stroke="#C9DCEB" stroke-width="3" stroke-linecap="round"/>'
                + '<path d="M102 98l14-4" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>'
                + card(76, 62, 26, 17) + '<path d="M104 66l-6 6" stroke="#7FB392" stroke-width="3" stroke-linecap="round"/>')

ART['tomaru'] = ('<rect x="46" y="104" width="108" height="40" rx="8" fill="#7FA8C9"/>'
                 '<rect x="56" y="88" width="34" height="18" rx="7" fill="#fff"/>'
                 '<path d="M46 144h108" stroke="#8A6242" stroke-width="6" stroke-linecap="round"/>'
                 + fig(112, 96, .85, '#8E86B8', {'legs': '', 'arms': '<path d="M-16 3l-12 8M16 3l12 8" stroke="#8E86B8" stroke-width="7" stroke-linecap="round"/>'})
                 + '<circle cx="112" cy="66" r="12" fill="#F2C6A0"/>'
                 + zzz(146, 74))

ART['wakaru'] = (ground(), fig(84, 120, 1.0, '#8FA8C9', {'face': 'happy', 'arms': '<path d="M-16 3l-10 16M16 3l10 8" stroke="#8FA8C9" stroke-width="7" stroke-linecap="round"/>'})
                 + '<circle cx="150" cy="58" r="20" fill="#F2CE6B"/>'
                 + '<path d="M150 60c0-8 8-10 8-16a8 8 0 0 0-16 0" fill="none" stroke="#C9A227" stroke-width="3.4" stroke-linecap="round"/>'
                 + '<path d="M143 66h14M145 72h10" stroke="#C9A227" stroke-width="3" stroke-linecap="round"/>'
                 + '<path d="M164 30l-4-8M178 44l8-4M134 30l4-8" stroke="#F2CE6B" stroke-width="3" stroke-linecap="round"/>')

ART['noru'] = ('<rect x="70" y="76" width="106" height="52" rx="10" fill="#F2CE6B"/>'
               '<rect x="82" y="88" width="28" height="20" rx="4" fill="#fff"/><rect x="122" y="88" width="28" height="20" rx="4" fill="#fff"/>'
               '<circle cx="94" cy="132" r="9" fill="#3E4C43"/><circle cx="152" cy="132" r="9" fill="#3E4C43"/>'
               + ground(184, 170)
               + fig(48, 120, .95, '#E58A76', {'arms': '<path d="M-16 3l-14 12M16 3l16 6" stroke="#E58A76" stroke-width="7" stroke-linecap="round"/>'})
               + '<path d="M72 92h18M82 86l8 6-8 6" stroke="#1B4D3E" stroke-width="3.4" fill="none" stroke-linecap="round"/>')

# ---------- 형용사 ----------
ART['ookii'] = ('<rect x="104" y="34" width="66" height="120" rx="6" fill="#B7C4D1"/>'
                '<path d="M116 52h42M116 66h30M116 80h36M116 94h24" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/>'
                + ground(184, 170)
                + fig(62, 126, .8, '#7FB392', {'face': 'open'})
                + '<path d="M86 84l10-14M96 70l2 12-12 0" fill="none" stroke="#E58A76" stroke-width="3.4" stroke-linecap="round"/>'
                + '<circle cx="84" cy="72" r="3" fill="#E58A76"/><circle cx="102" cy="64" r="2.4" fill="#E58A76"/>')

ART['chiisai'] = (ground(), fig(100, 120, 1.0, '#7FA8C9', {'arms': '<path d="M-16 3l-10 16M16 3l6 16" stroke="#7FA8C9" stroke-width="7" stroke-linecap="round"/>'})
                  + '<path d="M126 96c10-4 16 0 16 6s-8 10-16 6" fill="none" stroke="#E9A88D" stroke-width="4"/>'
                  + '<circle cx="150" cy="120" r="4" fill="#E58A76"/>'
                  + '<circle cx="150" cy="120" r="10" fill="none" stroke="#2B3A32" stroke-width="2.4"/>'
                  + '<path d="M157 127l8 8" stroke="#2B3A32" stroke-width="2.6" stroke-linecap="round"/>')

ART['takai'] = (ground(), fig(78, 118, 1.0, '#8FA8C9', {'face': 'open', 'arms': '<path d="M-16 3l-10 16M16 3l10 10" stroke="#8FA8C9" stroke-width="7" stroke-linecap="round"/>'})
                + '<path d="M124 62l44-12 12 46-44 12z" fill="#F6D3BC" transform="rotate(6 152 84)"/>'
                + '<text x="150" y="94" text-anchor="middle" font-size="26" font-weight="800" fill="#C05F45" font-family="-apple-system,Segoe UI,sans-serif">¥</text>'
                + '<path d="M118 70c-8 2-14 6-18 12M124 84c-8 4-12 8-14 14" stroke="#E58A76" stroke-width="3" fill="none" stroke-linecap="round"/>')

ART['yasui'] = (ground(), fig(78, 118, 1.0, '#7FB392', {'face': 'happy'})
                + '<path d="M124 70l40 6-6 38-40-6z" fill="#9DC3AA"/>'
                + '<text x="144" y="100" text-anchor="middle" font-size="20" font-weight="800" fill="#2F6B4F" font-family="-apple-system,Segoe UI,sans-serif">¥</text>'
                + '<path d="M96 96l20-4" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>'
                + star(172, 60, 8) + spark(58, 56, 5, '#E58A76'))

ART['oishii'] = (ground(), fig(88, 118, 1.0, '#E58A76', {'face': 'happy'})
                 + bowl(146, 108, 1.0, '#D9534F') + chop(132, 66)
                 + '<path d="M108 94l24 8" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>'
                 + star(176, 66, 8) + spark(64, 60, 6, '#E58A76') + steam(152, 92, .8))

ART['chikai'] = ('<path d="M40 176h120" stroke="#E0D3BC" stroke-width="6" stroke-linecap="round"/>'
                 '<rect x="124" y="76" width="46" height="60" rx="4" fill="#EFF1EA"/>'
                 '<path d="M120 76h54" stroke="#1B4D3E" stroke-width="4" stroke-linecap="round"/>'
                 '<rect x="134" y="90" width="12" height="46" fill="#C9DED2"/>'
                 + fig(70, 128, .9, '#8FA8C9', {'face': 'happy'})
                 + '<path d="M96 120c10 0 18-2 24-6" stroke="#E58A76" stroke-width="3" fill="none" stroke-dasharray="4 5" stroke-linecap="round"/>'
                 + '<path d="M96 134h20" stroke="#C9DED2" stroke-width="3" stroke-linecap="round"/>')

ART['tooi'] = ('<path d="M40 176h120" stroke="#E0D3BC" stroke-width="6" stroke-linecap="round"/>'
               '<path d="M142 128l22-34 22 34z" fill="#B7C4D1"/>'
               '<path d="M154 108l10-14 10 14-10 4z" fill="#fff"/>'
               + fig(66, 132, .85, '#7FB392', {'face': 'flat'})
               + '<path d="M92 124h30" stroke="#9AA7B5" stroke-width="3" stroke-dasharray="5 6" stroke-linecap="round"/>'
               + '<circle cx="176" cy="60" r="8" fill="#F2CE6B" opacity=".7"/>')

ART['atsui'] = (sun(150, 44, 16), ground(),
                fig(96, 120, 1.0, '#E58A76', {'face': 'flat'})
                + '<path d="M74 70c6-6 14-8 20-6" stroke="#8A6242" stroke-width="3" fill="none"/>'
                + drop(120, 58, 4) + drop(76, 84, 3.4) + drop(134, 88, 3)
                + '<path d="M118 90c8 0 12 6 10 12" stroke="#F2C6A0" stroke-width="5" fill="none" stroke-linecap="round"/>'
                + '<path d="M40 62c6 4 10 4 16 0M44 76c6 4 10 4 16 0" stroke="#C9DED2" stroke-width="3" fill="none" stroke-linecap="round"/>')

ART['samui'] = ('<path d="M36 46l14 14M36 60l-14-14M164 46l-14 14M164 60l14-14" stroke="#BFDCEB" stroke-width="3" stroke-linecap="round"/>'
                + ground(184, 150)
                + fig(96, 120, 1.0, '#8FA8C9', {'face': 'flat'})
                + '<path d="M76 84c12 8 28 8 40 0M76 88c12 8 28 8 40 0" stroke="#E58A76" stroke-width="7" fill="none" stroke-linecap="round"/>'
                + '<path d="M64 108c-6 4-8 10-6 16M128 108c6 4 8 10 6 16" stroke="#7FA8C9" stroke-width="3" fill="none" stroke-linecap="round"/>'
                + '<path d="M112 68c4-2 8 0 8 4" stroke="#4A5A66" stroke-width="2"/>')

ART['kirei'] = (ground(), fig(92, 122, .95, '#F6D3BC', {'face': 'happy'})
                + '<circle cx="140" cy="96" r="10" fill="#F2CE6B"/><circle cx="156" cy="86" r="10" fill="#E58A76"/>'
                + '<circle cx="166" cy="104" r="10" fill="#F6D3BC"/><circle cx="148" cy="112" r="10" fill="#E9A88D"/>'
                + '<circle cx="156" cy="98" r="7" fill="#E58A76"/>'
                + '<path d="M156 118v20" stroke="#7FB392" stroke-width="4" stroke-linecap="round"/>'
                + '<path d="M156 130c-6 0-10-3-12-8M156 138c6 0 10-3 12-8" stroke="#7FB392" stroke-width="3" fill="none" stroke-linecap="round"/>'
                + star(62, 62, 8) + spark(178, 56, 5, '#E58A76'))

ART['benri'] = (ground(), fig(88, 120, 1.0, '#9DC3AA', {'face': 'happy'})
                + '<rect x="122" y="82" width="30" height="52" rx="6" fill="#fff" stroke="#7FB392" stroke-width="3"/>'
                + '<path d="M128 96h18M128 104h12" stroke="#C9DED2" stroke-width="3" stroke-linecap="round"/>'
                + '<path d="M136 118l5 5 10-12" stroke="#E58A76" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
                + '<path d="M108 94l14-6" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>'
                + spark(160, 64, 6, '#7FB392'))

ART['genki'] = (ground(), fig(96, 120, 1.0, '#E58A76', {
    'face': 'happy',
    'arms': '<path d="M-16 0l-14-16M16 0l14-16" stroke="#E58A76" stroke-width="8" stroke-linecap="round"/>'})
    + '<path d="M118 62l-6 14 10-2-8 16" stroke="#F2CE6B" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    + star(48, 62, 8) + spark(160, 104, 6, '#7FB392'))

def art_svg(v):
    return ''.join(v) if isinstance(v, tuple) else v


body = ',\n'.join(f'  {k}: {json.dumps(art_svg(v), ensure_ascii=False)}' for k, v in ART.items())
OUT.write_text(
    '/* ============================================================\n'
    '   필수 단어 41개 — 뜻/행동이 한눈에 보이는 장면 그림\n'
    '   tools/gen_vocab_art.py 가 만든 파일 (직접 고치지 마세요)\n'
    '   ============================================================ */\n'
    'var VOCAB_ART = {\n' + body + '\n};\n', encoding='utf-8')
print('wrote', OUT, len(ART), 'arts')

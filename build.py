#!/usr/bin/env python3
"""daytrip-language-studio/index.html 빌드 스크립트

src/ 의 조각들을 하나의 자족형 HTML 파일로 합칩니다.
아이콘(icon.svg / icon-180.png)은 data URI 로도 함께 넣어
index.html 단독 실행에서도 아이콘이 깨지지 않게 합니다.
사용: python3 build.py
"""
import base64
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"

SHELL = SRC / "shell.html"
CSS = SRC / "styles.css"
DATA = [
    SRC / "data-ui.js",
    SRC / "data-kana.js",
    SRC / "data-vocab.js",
    SRC / "data-sentences.js",
    SRC / "data-english.js",
]
APP = SRC / "app.js"
OUT = ROOT / "index.html"
ICON_SVG = ROOT / "icon.svg"
ICON_APPLE = ROOT / "icon-180.png"


def read(p: pathlib.Path) -> str:
    if not p.exists():
        sys.exit(f"missing source: {p}")
    return p.read_text(encoding="utf-8")


def data_uri(p: pathlib.Path) -> str:
    if not p.exists():
        sys.exit(f"missing icon: {p}")
    mime = "image/svg+xml" if p.suffix == ".svg" else "image/png"
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode("ascii")


def main() -> None:
    html = read(SHELL)
    css = read(CSS)
    data = "\n\n".join(read(p) for p in DATA)
    app = read(APP)

    html = html.replace("{{CSS}}", css)
    html = html.replace("{{DATA}}", data)
    html = html.replace("{{APP}}", app)
    html = html.replace("{{ICON_SVG_DATA}}", data_uri(ICON_SVG))
    html = html.replace("{{APPLE_ICON_DATA}}", data_uri(ICON_APPLE))

    leftovers = re.findall(r"\{\{[A-Z_]+\}\}|__ICON_[A-Z]+__", html)
    if leftovers:
        sys.exit(f"unreplaced placeholders: {sorted(set(leftovers))}")

    OUT.write_text(html, encoding="utf-8")

    # 간단한 무결성 점검
    sizes = {
        "index.html": len(html),
        "css": len(css),
        "data": len(data),
        "app": len(app),
    }
    for k, v in sizes.items():
        print(f"{k:12s} {v:>8,d} chars")

    # 태그 균형 (script/style/svg/section/article)
    for tag in ("script", "style", "svg", "section", "article"):
        opens = len(re.findall(rf"<{tag}[\s>]", html))
        closes = html.count(f"</{tag}>")
        print(f"<{tag}> open={opens} close={closes}", "OK" if opens == closes else "MISMATCH")

    # 데이터 개수
    print("hiragana:", len(re.findall(r"\{ ch: '", data.split("var KANA_KATA")[0])))
    print("katakana:", len(re.findall(r"\{ ch: '", data.split("var KANA_KATA")[1].split("var WORDS")[0])))
    print("english:", len(re.findall(r"\{ id: '", data.split("var ENGLISH = [")[1].split("var DIALOGUE")[0])))
    print("written:", OUT)


if __name__ == "__main__":
    main()

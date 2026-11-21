#!/usr/bin/env python3
"""daytrip-language-studio/index.html 빌드 스크립트

src/ 의 조각들을 하나의 자족형 HTML 파일로 합칩니다.
사용: python3 build.py
"""
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


def read(p: pathlib.Path) -> str:
    if not p.exists():
        sys.exit(f"missing source: {p}")
    return p.read_text(encoding="utf-8")


def main() -> None:
    html = read(SHELL)
    css = read(CSS)
    data = "\n\n".join(read(p) for p in DATA)
    app = read(APP)

    html = html.replace("{{CSS}}", css)
    html = html.replace("{{DATA}}", data)
    html = html.replace("{{APP}}", app)

    leftovers = re.findall(r"\{\{[A-Z]+\}\}|__ICON_[A-Z]+__", html)
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

    # 태그 균형 (script/style/div/section/article)
    for tag in ("script", "style", "svg", "section", "article"):
        opens = len(re.findall(rf"<{tag}[\s>]", html))
        closes = html.count(f"</{tag}>")
        print(f"<{tag}> open={opens} close={closes}", "OK" if opens == closes else "MISMATCH")

    # 데이터 개수
    print("hiragana:", len(re.findall(r"\{ ch: '", data.split("var KANA_KATA")[0])))
    print("katakana:", len(re.findall(r"\{ ch: '", data.split("var KANA_KATA")[1].split("var WORDS")[0])))
    print("written:", OUT)


if __name__ == "__main__":
    main()

#!/usr/bin/env bash
# Font alt kümesi üretir (Türkçe için optimize). Gereksinim: pip install fonttools brotli; npm i -D @fontsource-variable/*
# Normal geliştirmede çalıştırmanız gerekmez; çıktılar src/assets/fonts/ içinde commit'lidir.
set -euo pipefail
L="U+0020-007E,U+00A0-00FF,U+0131,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+20AC,U+2192,U+2190,U+2122,U+00D7,U+2713,U+2726"
T="U+011E,U+011F,U+0130,U+015E,U+015F,U+20BA"
mkdir -p src/assets/fonts
for f in "bricolage-grotesque:bricolage" "inter:inter"; do
  IFS=: read -r pkg out <<< "$f"; D=node_modules/@fontsource-variable/$pkg/files
  pyftsubset "$D/$pkg-latin-wght-normal.woff2" --unicodes="$L" --flavor=woff2 --layout-features='*' --output-file="src/assets/fonts/$out-latin.woff2"
  pyftsubset "$D/$pkg-latin-ext-wght-normal.woff2" --unicodes="$T" --flavor=woff2 --layout-features='*' --output-file="src/assets/fonts/$out-tr.woff2"
done

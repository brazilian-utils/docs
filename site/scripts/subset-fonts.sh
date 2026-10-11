#!/usr/bin/env sh
# Cuts the Geist variable fonts down to what the site's text needs: Latin, the accents of
# Portuguese, the typographic marks, arrows and the check mark; the weights from 400 to 700 (the
# site sets nothing lighter or heavier); and the default OpenType features plus tabular figures.
# A third of the bytes of the full fonts, in front of every first paint. Needs fonttools
# (pip install fonttools brotli).
set -e
cd "$(dirname "$0")/.."
RANGES='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0301,U+0303,U+0327,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+2713,U+FEFF,U+FFFD'
tmp=$(mktemp -d)
for face in sans mono; do
  case $face in sans) src=node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2;; mono) src=node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2;; esac
  # Subset first: the instancer fails on the full font.
  python3 -m fontTools.subset "$src" --unicodes="$RANGES" --layout-features+=tnum --no-hinting --desubroutinize --output-file="$tmp/$face.ttf"
  python3 -m fontTools.varLib.instancer "$tmp/$face.ttf" wght=400:700 --output="$tmp/$face-400-700.ttf" --quiet
  python3 -m fontTools.ttLib.woff2 compress -o "src/assets/fonts/geist-$face.woff2" "$tmp/$face-400-700.ttf"
  ls -l "src/assets/fonts/geist-$face.woff2"
done
rm -r "$tmp"

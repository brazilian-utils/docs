// public/og.png, the image a shared link shows: the dog, the line from the home page, a CPF and
// the languages. Run with `npm run og` after changing any of them; the build does not run it.
//
// The CPF is the home page's sample with its last check digit broken, struck in the fail color the
// way the home page shows a number that fails: a valid one could be somebody's.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { loadLibs } from '../src/lib/registry.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const site = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const libs = loadLibs().map((lib) => lib.label);
const dataUrl = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(site, file)).toString('base64')}`;

const html = `<!doctype html>
<style>
  @font-face { font-family: Geist; src: url(${dataUrl('src/assets/fonts/geist-sans.woff2', 'font/woff2')}); font-weight: 100 900; }
  @font-face { font-family: 'Geist Mono'; src: url(${dataUrl('src/assets/fonts/geist-mono.woff2', 'font/woff2')}); font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #fffcf0; color: #100f0f; font-family: Geist; position: relative; overflow: hidden; }
  .brand { position: absolute; left: 80px; top: 74px; display: flex; align-items: center; gap: 22px; font-size: 29px; font-weight: 600; }
  .brand img { width: 62px; height: 62px; }
  h1 { position: absolute; left: 80px; top: 176px; width: 900px; font-size: 64px; line-height: 70px; font-weight: 650; }
  .cpf { position: absolute; left: 80px; top: 414px; font-family: 'Geist Mono'; font-size: 44px; font-weight: 350; letter-spacing: 0.06em; }
  .cpf s { color: #af3029; text-decoration-thickness: 3px; }
  ul { position: absolute; left: 80px; top: 511px; display: flex; gap: 14px; padding: 0; list-style: none; }
  li { height: 46px; padding: 0 20px; display: flex; align-items: center; border: 1.5px solid #dad8ce; border-radius: 23px; background: #f2f0e5; color: #575653; font-size: 23px; font-weight: 600; }
  .flag { position: absolute; left: 0; right: 0; bottom: 0; height: 14px; display: grid; grid-template-columns: 720px 240px 240px; }
</style>
<div class="brand"><img src="${dataUrl('public/apple-touch-icon.png', 'image/png')}" alt="">Brazilian Utils</div>
<h1>Brazilian documents, validated the same way in every language.</h1>
<div class="cpf">831.595.621-<s>32</s></div>
<ul>${libs.map((l) => `<li>${l}</li>`).join('')}</ul>
<div class="flag"><i style="background:#009c3b"></i><i style="background:#ffdf00"></i><i style="background:#3e4095"></i></div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.resolve(site, process.argv[2] ?? 'public/og.png') });
await browser.close();

// The language's logo, in its brand color (Simple Icons). Decorative: the name is always next to it.
// Each logo's outline is on the page once, as a <symbol> (LangIconDefs, lang-icon-defs.tsx, in the
// root layout), and every icon points at it: a page that names the libraries a hundred times
// carries one copy. Only the colors are imported here (lib/lang-colors.ts), so a client component
// that shows an icon does not bring the outlines into its JavaScript.

import { LANG_COLORS } from '@/lib/lang-colors';

export function LangIcon({ lib, className = 'size-4' }: { lib: string; className?: string }) {
  const hex = LANG_COLORS[lib];
  if (!hex) return null;
  // Rust's brand color is black: the text color, so it shows in the dark theme. The .NET purple and
  // the Erlang red are too dark on the dark paper: the text color there too.
  const color = hex === '000000' ? 'currentColor' : `#${hex}`;
  const dark = lib === 'dotnet' || lib === 'erlang' ? 'dark:fill-current' : '';
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`shrink-0 ${dark} ${className}`} fill={color}>
      <use href={`#lang-${lib}`} />
    </svg>
  );
}

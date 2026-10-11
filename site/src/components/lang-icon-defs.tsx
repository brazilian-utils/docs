// The outlines of the languages' logos (Simple Icons), once per page as <symbol>s that every
// LangIcon (lang-icon.tsx) points at. Rendered on the server only, in the root layout.
import { siDotnet, siErlang, siGo, siJavascript, siPython, siRuby, siRust } from 'simple-icons';
import { LANG_COLORS } from '@/lib/lang-colors';

export const LANG_ICONS: Record<string, { path: string; hex: string }> = {
  javascript: siJavascript,
  python: siPython,
  go: siGo,
  ruby: siRuby,
  rust: siRust,
  dotnet: siDotnet,
  erlang: siErlang,
};

// The icons' colors are copied in lib/lang-colors.ts (for client components): the build stops when
// they drift from the package's.
for (const [lib, icon] of Object.entries(LANG_ICONS)) {
  if (LANG_COLORS[lib] !== icon.hex) throw new Error(`lib/lang-colors.ts: ${lib} is ${LANG_COLORS[lib]}, Simple Icons says ${icon.hex}`);
}

/** The outlines, once per page. */
export function LangIconDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {Object.entries(LANG_ICONS).map(([lib, icon]) => (
          <symbol key={lib} id={`lang-${lib}`} viewBox="0 0 24 24">
            <path d={icon.path} />
          </symbol>
        ))}
      </defs>
    </svg>
  );
}

// The languages' brand colors, from Simple Icons, apart from the logos' outlines
// (components/lang-icon-defs.tsx) so a client component can color an icon without shipping them.
// The build checks them against the package (lang-icon-defs.tsx).
export const LANG_COLORS: Record<string, string> = {
  javascript: 'F7DF1E',
  python: '3776AB',
  go: '00ADD8',
  ruby: 'CC342D',
  rust: '000000',
  dotnet: '512BD4',
  erlang: 'A90533',
};

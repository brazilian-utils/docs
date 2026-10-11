// sitemap.xml: every page in both languages, each with its twin (hreflang) and, for the pages that
// come from one file, the date of its last commit (lastmod).
import type { MetadataRoute } from 'next';
import { contractPath, loadGuides, loadLibs, loadSpecs } from '@/lib/data';
import { lastCommit } from '@/lib/git';
import { SITE } from '@/lib/meta';
import { folderPages } from '@/lib/source';

export const dynamic = 'force-static';

const mdx = (page: string) => [`site/content/docs/${page}.mdx`, `site/content/docs/${page}.pt-br.mdx`];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${SITE.origin}${SITE.pathname.replace(/\/$/, '')}`;
  // Pages built from the validator's last run (home, parity, libraries) change with every run: no lastmod.
  const pages: Array<[string, string[]?]> = [
    ['/'],
    ['/getting-started/', mdx('getting-started')],
    ['/reference/parity/'],
    ...folderPages('en', 'contributing').map((p): [string, string[]] => [`/contributing/${p.slug}/`, mdx(`contributing/${p.slug}`)]),
    ...folderPages('en', 'about').map((p): [string, string[]] => [`/about/${p.slug}/`, mdx(`about/${p.slug}`)]),
    ...loadSpecs().map((s: any): [string, string[]] => [`/utils/${s.id}/`, [contractPath(s)]]),
    ...loadLibs().map((l: any): [string] => [`/libs/${l.id}/`]),
    ...(loadGuides().length ? [['/guides/'] as [string]] : []),
    ...loadGuides().map((g: any): [string] => [`/guides/${g.lib}/${g.slug}/`]),
  ];
  return pages.flatMap(([path, files]) => {
    const languages = { en: `${base}${path}`, 'pt-BR': `${base}/pt-br${path}`, 'x-default': `${base}${path}` };
    const lastModified = files && lastCommit(...files);
    const priority = path === '/' ? 1 : path.startsWith('/utils/') ? 0.8 : 0.6;
    return [languages.en, languages['pt-BR']].map((url) => ({ url, alternates: { languages }, priority, ...(lastModified && { lastModified }) }));
  });
}

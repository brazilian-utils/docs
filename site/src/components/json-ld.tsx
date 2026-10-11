// Structured data for search engines: the site, the organization and each of its libraries on the
// home page; on every other page, where it sits (breadcrumb) and what it is (a technical article).
import { loadLibs } from '@/lib/data';
import { SITE_ROOT } from '@/lib/meta';
import { type Locale, prefixOf } from '@/lib/i18n';

const ORG_ID = 'https://github.com/brazilian-utils#org';
const WEBSITE_ID = `${SITE_ROOT}/#website`;
const ORG = { '@type': 'Organization', '@id': ORG_ID, name: 'Brazilian Utils', url: `${SITE_ROOT}/`, logo: `${SITE_ROOT}/apple-touch-icon.png` };

function Script({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c') }} />;
}

export function HomeJsonLd({ locale, description }: { locale: Locale; description: string }) {
  return (
    <Script
      data={{
        '@graph': [
          { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE_ROOT}${prefixOf(locale)}/`, name: 'Brazilian Utils', description, inLanguage: locale, publisher: { '@id': ORG_ID } },
          { ...ORG, sameAs: ['https://github.com/brazilian-utils', ...loadLibs().map((lib: any) => `https://github.com/${lib.repo}`)] },
          ...loadLibs().map((lib: any) => ({
            '@type': 'SoftwareSourceCode',
            name: `Brazilian Utils for ${lib.label}`,
            programmingLanguage: lib.label,
            codeRepository: `https://github.com/${lib.repo}`,
            url: `${SITE_ROOT}${prefixOf(locale)}/libs/${lib.id}/`,
            author: { '@id': ORG_ID },
          })),
        ],
      }}
    />
  );
}

/**
 * A documentation page: the trail from the home page (`trail` lists the pages between, without the
 * home page and without this one) and the page as a technical article.
 */
export function PageJsonLd({ locale, path, title, description, trail = [], modified }: { locale: Locale; path: string; title: string; description?: string; trail?: Array<{ name: string; path: string }>; modified?: Date }) {
  const url = (p: string) => `${SITE_ROOT}${prefixOf(locale)}${p}`;
  const crumbs = [{ name: 'Brazilian Utils', path: '/' }, ...trail, { name: title, path }];
  return (
    <Script
      data={{
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: url(c.path) })),
          },
          {
            '@type': 'TechArticle',
            headline: title,
            ...(description && { description }),
            url: url(path),
            mainEntityOfPage: url(path),
            inLanguage: locale,
            ...(modified && { dateModified: modified.toISOString() }),
            author: { '@id': ORG_ID },
            publisher: { '@id': ORG_ID },
            isPartOf: { '@id': WEBSITE_ID },
          },
          ORG,
          { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE_ROOT}${prefixOf(locale)}/`, name: 'Brazilian Utils' },
        ],
      }}
    />
  );
}

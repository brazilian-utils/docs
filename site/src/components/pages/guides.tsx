// Every guide, grouped by the library that publishes it, in the order of the libraries.
import Link from '@/components/link';
import { ArrowRight } from 'lucide-react';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { loadGuides, loadLibs } from '@/lib/data';
import { type Locale, pick, prefixOf } from '@/lib/i18n';
import { LangIcon } from '@/components/lang-icon';
import { DocsPager } from '@/components/docs-pager.client';

const L = (locale: Locale, en: string, pt: string) => (locale === 'en' ? en : pt);
export const guidesText = (locale: Locale) => ({
  title: L(locale, 'Guides', 'Guias'),
  description: L(locale, 'Forms and components built with each library, with live demos and the code for each framework.', 'Formulários e componentes feitos com cada biblioteca, com exemplos interativos e o código de cada framework.'),
});

/** The libraries that have guides, each with its guides. */
export function guidesByLib() {
  const guides = loadGuides();
  return loadLibs()
    .map((lib: any) => ({ lib, guides: guides.filter((g: any) => g.lib === lib.id) }))
    .filter((group: any) => group.guides.length);
}

export function GuidesPage({ locale }: { locale: Locale }) {
  const p = prefixOf(locale);
  const { title, description } = guidesText(locale);
  return (
    <DocsPage slots={{ footer: DocsPager }} tableOfContent={{ enabled: false }}>
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody>
        {guidesByLib().map(({ lib, guides }: any) => (
          <section key={lib.id}>
            <h2 id={lib.id} className="flex items-center gap-2">
              <LangIcon lib={lib.id} /> {lib.label}
            </h2>
            {/* Rows between rules, like the home page's lists: a guide is a link and a sentence. */}
            <ul className="not-prose divide-y border-y">
              {guides.map((g: any) => (
                <li key={g.slug}>
                  <Link href={`${p}/guides/${g.lib}/${g.slug}/`} className="group flex items-start justify-between gap-4 py-3">
                    <span>
                      <span className="font-medium group-hover:text-fd-primary">{pick(g.title, locale)}</span>
                      <span className="mt-0.5 block text-sm text-fd-muted-foreground">{pick(g.description, locale)}</span>
                    </span>
                    <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-fd-muted-foreground group-hover:text-fd-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p>
          {L(locale, 'Any library can publish guides: ', 'Qualquer biblioteca pode publicar guias: ')}
          <Link href={`${p}/contributing/usage-files/#${L(locale, 'guides-with-live-demos', 'guias-com-exemplos-interativos')}`}>{L(locale, 'see how', 'veja como')}</Link>.
        </p>
      </DocsBody>
    </DocsPage>
  );
}

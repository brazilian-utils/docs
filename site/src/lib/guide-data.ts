// The guides' data, apart from the guide page (components/pages/guide.tsx): the home page shows a
// guide's examples, and importing the page's module would bring the documentation layout's client
// code into the home page's bundle.
import { loadGuide, loadGuides } from './data';
import type { Locale } from './i18n';

export function guideEntry(lib: string, slug: string) {
  return loadGuides().find((g: any) => g.lib === lib && g.slug === slug);
}

/** The first group of examples of a guide (one per framework), or null without the guide. */
export function guideExamples(locale: Locale, lib: string, slug: string): any[] | null {
  const guide = guideEntry(lib, slug) && loadGuide(lib, slug, locale);
  return guide?.blocks.find((b: any) => b.type !== 'markdown')?.examples ?? null;
}

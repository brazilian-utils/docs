// Page metadata for search engines and link previews: title, description, canonical URL and the
// same page in the other language (hreflang).
import type { Metadata } from 'next';
import { coverage, loadLibs, loadSpec, loadSpecs } from './data';
import { type Locale, pick, prefixOf } from './i18n';

export const SITE = new URL(process.env.SITE_URL || 'https://brazilian-utils.com.br');
const base = SITE.pathname.replace(/\/$/, '');
export const SITE_ROOT = `${SITE.origin}${base}`;
const OG_IMAGE = `${SITE_ROOT}/og.png`;
/** Where this build is served from (a preview at the domain root, the site under SITE_URL's path). */
const servedBase = process.env.NEXT_PUBLIC_BASE ?? '';

/**
 * A build that is not the canonical site: a pull request preview (SITE_PREVIEW=true). Its pages
 * and files say noindex (Cloudflare Pages also adds X-Robots-Tag to every preview), and canonical
 * links point at SITE_URL.
 */
export const NOINDEX = process.env.SITE_PREVIEW === 'true';

/** Metadata for a page at `path` (without language prefix, starting and ending with /). */
export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const url = (l: Locale) => `${SITE.origin}${base}${prefixOf(l)}${path}`;
  return {
    // A title that starts with the site name (the home page, a library's page) skips the " · Brazilian Utils" suffix.
    title: title.startsWith('Brazilian Utils') ? { absolute: title } : title,
    description,
    alternates: { canonical: url(locale), languages: { en: url('en'), 'pt-BR': url('pt-BR'), 'x-default': url('en') } },
    openGraph: {
      title,
      description,
      url: url(locale),
      siteName: 'Brazilian Utils',
      locale: locale === 'en' ? 'en_US' : 'pt_BR',
      alternateLocale: locale === 'en' ? 'pt_BR' : 'en_US',
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Brazilian Utils' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE] },
  };
}

/** A library's page, for a search like "cpf javascript" or "brazilian utils python". */
export function libMetadata(locale: Locale, lib: any): Metadata {
  const title = locale === 'en' ? `Brazilian Utils for ${lib.label}: CPF, CNPJ, CEP and more` : `Brazilian Utils para ${lib.label}: CPF, CNPJ, CEP e mais`;
  const description =
    locale === 'en'
      ? `Install ${lib.package} and validate, format and generate CPF, CNPJ, CEP and more in ${lib.label}: what the library implements, and what is missing.`
      : `Instale ${lib.package} e valide, formate e gere CPF, CNPJ, CEP e mais em ${lib.label}: o que a biblioteca implementa e o que falta.`;
  return pageMetadata(locale, `/libs/${lib.id}/`, title, description);
}

export const utilParams = async () => loadSpecs().map((s: any) => ({ id: s.id }));

export function utilMetadata(locale: Locale, id: string): Metadata {
  const spec = loadSpec(id);
  return pageMetadata(locale, `/utils/${id}/`, utilTitle(spec, locale), utilDescription(spec, locale));
}

// What a search for a utility asks for ("validar CPF", "cpf validator python"): the title names the
// actions and the languages, while the page's H1, the sidebar and the search keep the short name.
const VERBS: Array<[RegExp, string, string]> = [
  [/^isValid/, 'validate', 'validar'],
  [/^format$/, 'format', 'formatar'],
  [/^generate$/, 'generate', 'gerar'],
  // A lookup in a table (CNAE, banks, the address of a CEP). Not getInfo or getFormat, which read the
  // value itself: "consultar CPF" would promise a query to the Receita, "consultar placa" one to the Detran.
  [/^(get(?!Info$|Format$)|list)/, 'look up', 'consultar'],
];
// Pages named after a topic, not a document: their title stays the name.
const TOPICS = new Set(['date', 'number', 'text', 'currency']);
// Names that keep their capital in the middle of a sentence; acronyms (CPF, NF-e) keep theirs anyway.
const PROPER = /^(Pix|Brazilian)\b/;
// Not Brazilian-specific, so an English title does not call them Brazilian.
const GENERIC = new Set(['email', 'credit-card', 'text', 'iban', 'gtin', 'isbn', 'vin']);
// "a, b and c", without the serial comma, like the rest of the site's English.
const join = (locale: Locale, xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${locale === 'en' ? 'and' : 'e'} ${xs.at(-1)}`);

/** The libraries that implement at least one function of a utility, in the site's order. */
const libsOf = (spec: any) => loadLibs().filter((lib: any) => coverage(spec, lib.id).state !== 'none').map((lib: any) => lib.label);

export function utilTitle(spec: any, locale: Locale) {
  const name = pick(spec.title, locale);
  const libs = libsOf(spec);
  const langs = libs.length > 2 ? `${libs.slice(0, 2).join(', ')} ${locale === 'en' ? 'and more' : 'e mais'}` : join(locale, libs);
  const where = libs.length ? ` ${locale === 'en' ? 'in' : 'em'} ${langs}` : '';
  const verbs = TOPICS.has(spec.id) ? [] : VERBS.filter(([re]) => spec.operations.some((op: any) => re.test(op.id))).map(([, en, pt]) => (locale === 'en' ? en : pt));
  if (!verbs.length) return `${name}${where}`;
  const first = name.split(' ')[0];
  const noun = locale === 'en' && spec.id === 'phone' ? 'phone numbers' : /[A-Z]/.test(first.slice(1)) || PROPER.test(name) ? name : name[0].toLowerCase() + name.slice(1);
  const object = locale === 'en' && !/[A-Z]/.test(first.slice(1)) && !GENERIC.has(spec.id) ? `Brazilian ${noun}` : noun;
  const action = join(locale, verbs);
  const short = `${action[0].toUpperCase()}${action.slice(1)} ${object}`;
  // Past about 65 characters a result cuts the title: the languages go before the name does.
  return `${short}${where}`.length <= 65 ? `${short}${where}` : short;
}

export function utilDescription(spec: any, locale: Locale) {
  const libs = libsOf(spec);
  if (!libs.length) return pick(spec.summary, locale);
  return `${pick(spec.summary, locale)} ${locale === 'en' ? `Functions in ${join('en', libs)}, checked against the same test cases.` : `Funções em ${join('pt-BR', libs)}, verificadas com os mesmos casos de teste.`}`;
}

/** Metadata shared by every page of a language: base URL, icons, theme color. */
export function rootMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(`${SITE_ROOT}/`),
    title: { template: '%s · Brazilian Utils', default: 'Brazilian Utils' },
    applicationName: 'Brazilian Utils',
    // Ownership proof for Google Search Console (the property was verified with this tag on the old
    // docsify site): removing it drops the verification.
    verification: { google: '8xH7xzJdpi19V6yr-QGvrZtAG84ihpVn_-yWd6DhpXg' },
    icons: { icon: `${servedBase}/favicon.ico`, apple: `${servedBase}/apple-touch-icon.png` },
    ...(NOINDEX && { robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } } }),
    openGraph: { siteName: 'Brazilian Utils', locale: locale === 'en' ? 'en_US' : 'pt_BR' },
  };
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f0e5' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1b1a' },
  ],
};

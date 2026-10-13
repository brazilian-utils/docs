// Where the old JavaScript docs' anchors are now. That site (docsify) put a section in the query
// string: /utilities?id=isvalidcpf for a function, /utilities?id=cep-e-endereço for a heading. Those
// URLs reach public/_worker.js, which answers with a 301 to the utility's page from this map.
import { loadSpecs, loadStatus } from './data';
import { type Locale, pick } from './i18n';
import { slug } from './prose';

// The old page's section headings that are not a utility's title, in both languages.
const SECTIONS: Record<string, string> = {
  'cep-and-address': 'cep',
  'cep-e-endereço': 'cep',
  pix: 'pix-key',
  'nf-e-key': 'nfe-key',
  'chave-de-nf-e': 'nfe-key',
  'nfs-e-key': 'nfse-key',
  'chave-de-nfs-e': 'nfse-key',
  pis: 'pis',
  'processo-jurídico': 'legal-process',
  'bank-accounts-and-banks': 'bank-account',
  'contas-bancárias-e-bancos': 'bank-account',
  'currency-numbers-and-dates-in-words': 'currency',
  'moeda-números-e-datas-por-extenso': 'currency',
  'states-and-municipalities': 'state',
  'estados-e-municípios': 'state',
  'holidays-and-business-days': 'date',
  'feriados-e-dias-úteis': 'date',
  'voter-id-título-de-eleitor': 'voter-id',
  'título-de-eleitor': 'voter-id',
  'certidão-civil-registry-certificate': 'certidao',
  'cei-cno-and-caepf': 'cei',
  'cei-cno-e-caepf': 'cei',
  'gtin-product-barcode': 'gtin',
  'gtin-código-de-barras-de-produto': 'gtin',
  'inscrição-estadual-ie': 'ie',
  'e-mail': 'email',
  'credit-card': 'credit-card',
  'cartão-de-crédito': 'credit-card',
  'professional-registration': 'registro-profissional',
  'registro-profissional': 'registro-profissional',
  vin: 'vin',
};

/** Old anchor (lowercase) → the page, without the language prefix, in each language. */
export function legacyIds() {
  const status = loadStatus();
  const js = status?.libs?.javascript?.functions ?? {};
  const specs = loadSpecs() as any[];
  const ids = new Set(specs.map((s) => s.id));
  const out = {} as Record<Locale, Record<string, string>>;
  for (const locale of ['en', 'pt-BR'] as Locale[]) {
    const m: Record<string, string> = {};
    for (const [key, id] of Object.entries(SECTIONS)) if (ids.has(id)) m[key] = `/utils/${id}/`;
    for (const spec of specs) {
      m[spec.id] ??= `/utils/${spec.id}/`;
      for (const l of ['en', 'pt-BR'] as Locale[]) m[slug(pick(spec.title, l))] ??= `/utils/${spec.id}/`;
      for (const op of spec.operations) {
        const symbol = js[op.fnId]?.symbol;
        if (symbol) m[symbol.toLowerCase()] = `/utils/${spec.id}/#${slug(pick(op.label, locale))}`;
      }
    }
    out[locale] = m;
  }
  return out;
}

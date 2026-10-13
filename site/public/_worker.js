// Cloudflare Pages runs this only for the paths in _routes.json; every other request is a static
// file. The old JavaScript docs (docsify) kept a section in the query string: /utilities?id=isvalidcpf
// for a function, /pt-br/utilities?id=cep-e-endereço for a heading. A _redirects rule cannot read
// a query string, so this sends each to its utility's page, from /legacy-ids.json (see
// src/lib/legacy-ids.ts). Without a known id: /utilities goes to the library's page as before, and
// the library's page is served as is.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pt = url.pathname.startsWith('/pt-br/');
    const prefix = pt ? '/pt-br' : '';
    const id = url.searchParams.get('id');
    if (id) {
      const res = await env.ASSETS.fetch(new URL('/legacy-ids.json', url));
      if (res.ok) {
        const to = (await res.json())[pt ? 'pt-BR' : 'en'][id.toLowerCase()];
        if (to) return Response.redirect(new URL(prefix + to, url).toString(), 301);
      }
    }
    if (/^(\/pt-br)?\/utilities\/?$/.test(url.pathname)) return Response.redirect(new URL(`${prefix}/libs/javascript/${url.search}`, url).toString(), 301);
    return env.ASSETS.fetch(request);
  },
};

// Route portfolio pages and preserve links shared before the /ux move.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path.startsWith('/case-studies/')) {
      url.pathname = '/ux' + path;
      return Response.redirect(url.href, 301);
    }
    if (/^\/UX(?:\/|$)/.test(path)) {
      url.pathname = path.replace(/^\/UX/, '/ux');
      return Response.redirect(url.href, 301);
    }
    if (path === '/ux' || path === '/art') {
      url.pathname += '/';
      return Response.redirect(url.href, 301);
    }
    if (path.startsWith('/ux/case-studies/')) {
      url.pathname = '/ux/';
      return env.ASSETS.fetch(new Request(url, request));
    }
    return env.ASSETS.fetch(request);
  }
};

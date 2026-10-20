import type { APIRoute } from 'astro';

export function getStaticPaths() {
  return [
    { legacy: 'contact', destination: '/contact/' },
    { legacy: 'blogs', destination: '/insights/' },
    { legacy: 'privacy-policy', destination: '/privacy-policy/' },
  ].map(item => ({ params: { legacy: item.legacy }, props: { destination: item.destination } }));
}

export const GET: APIRoute = ({ props }) => {
  const destination = props.destination as string;
  return new Response(`<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page moved | SR Infotech</title>
<link rel="canonical" href="https://srinfotech.biz${destination}">
<meta name="robots" content="noindex, follow">
<script>location.replace(${JSON.stringify(destination)} + location.search + location.hash);</script>
<noscript><meta http-equiv="refresh" content="0;url=${destination}"></noscript>
</head><body><h1>This page has moved.</h1><p><a href="${destination}">Continue to SR Infotech</a>.</p></body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};

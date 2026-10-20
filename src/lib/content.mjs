/** Compare calendar dates in India so scheduled articles never publish a day early. */
export function isPublished(data, now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  return !data.draft && new Date(data.pubDate).toISOString().slice(0, 10) <= today;
}
export function newestFirst(a, b) {
  return new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime() || a.id.localeCompare(b.id);
}

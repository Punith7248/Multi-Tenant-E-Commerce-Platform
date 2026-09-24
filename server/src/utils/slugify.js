// "Acme Café & Co." -> "acme-cafe-co". Matches the Store slug rule (lowercase words joined by single
// hyphens, max 60). Returns '' if nothing usable is left (e.g. "!!!"), so callers must check.
const slugify = (text) =>
  String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');

module.exports = slugify;

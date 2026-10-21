import { contact, isPlaceholder } from '@content/site';

/** Base path'e duyarlı iç link. href('/b2b/') -> '/b2b/' veya '/repo/b2b/' */
export function href(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (path.startsWith('/#')) return `${base}/${path.slice(1)}`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Mutlak URL (canonical, OG, JSON-LD) */
export function abs(path: string, site: URL | undefined): string {
  return new URL(href(path), site ?? 'https://vetrina.example').toString();
}

/** UTM'li link üretir. */
export function utm(
  url: string,
  source: string,
  medium: string,
  campaign: string,
  content?: string,
) {
  const u = new URL(url, 'https://x.invalid');
  u.searchParams.set('utm_source', source);
  u.searchParams.set('utm_medium', medium);
  u.searchParams.set('utm_campaign', campaign);
  if (content) u.searchParams.set('utm_content', content);
  return url.startsWith('http') ? u.toString() : `${u.pathname}${u.search}${u.hash}`;
}

/** WhatsApp linki. Numara yer tutucuysa forma yönlendirir (kırık link üretmez). */
export function waLink(message: string = contact.whatsappMessage): string {
  if (isPlaceholder(contact.whatsapp)) return href('/#iletisim');
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
export const waIsLive = () => !isPlaceholder(contact.whatsapp);
export const telLink = () =>
  isPlaceholder(contact.phoneHref) ? href('/#iletisim') : `tel:${contact.phoneHref}`;
export const telIsLive = () => !isPlaceholder(contact.phoneHref);

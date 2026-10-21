/**
 * Kanal başına kısa linkler + UTM parametreleri.
 * alanadiniz.com/ig  →  /?utm_source=instagram&utm_medium=social&utm_campaign=profil&utm_content=bio
 * Bu liste astro.config.mjs tarafından okunur ve statik yönlendirme sayfalarına dönüşür
 * (GitHub Pages ve Cloudflare Pages'te çalışır). Yeni kanal eklemek için bir satır eklemeniz yeterli.
 */
export interface ShortLink {
  slug: string;
  channel: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  /** Hedef yol (varsayılan ana sayfa) */
  to?: string;
}

export const shortLinks: ShortLink[] = [
  {
    slug: 'ig',
    channel: 'Instagram — profil/bio linki',
    source: 'instagram',
    medium: 'social',
    campaign: 'profil',
    content: 'bio',
  },
  {
    slug: 'ig-story',
    channel: 'Instagram — story bağlantı çıkartması',
    source: 'instagram',
    medium: 'social',
    campaign: 'story',
    content: 'link-sticker',
  },
  {
    slug: 'ig-reel',
    channel: 'Instagram — reel açıklaması/yorum',
    source: 'instagram',
    medium: 'social',
    campaign: 'reel',
    content: 'caption',
  },
  {
    slug: 'li',
    channel: 'LinkedIn — paylaşım ve profil',
    source: 'linkedin',
    medium: 'social',
    campaign: 'organik',
    content: 'post',
  },
  {
    slug: 'wa',
    channel: 'WhatsApp Business — profil/otomatik mesaj',
    source: 'whatsapp',
    medium: 'messaging',
    campaign: 'iletisim',
    content: 'profile',
  },
  {
    slug: 'yt',
    channel: 'YouTube — açıklama / Shorts',
    source: 'youtube',
    medium: 'social',
    campaign: 'video',
    content: 'description',
  },
  {
    slug: 'be',
    channel: 'Behance — proje bağlantısı',
    source: 'behance',
    medium: 'portfolio',
    campaign: 'portfoy',
    content: 'project',
  },
  {
    slug: 'mail',
    channel: 'E-posta imzası',
    source: 'email',
    medium: 'signature',
    campaign: 'imza',
    content: 'footer',
  },
  {
    slug: 'sunum',
    channel: 'Sunum / teklif PDF’i içi',
    source: 'pdf',
    medium: 'offline',
    campaign: 'teklif',
    content: 'deck',
    to: '/b2b/',
  },
  {
    slug: 'qr',
    channel: 'Basılı materyal / QR kod',
    source: 'qr',
    medium: 'offline',
    campaign: 'basili',
    content: 'qr',
  },
  {
    slug: 'gbp',
    channel: 'Google İşletme Profili',
    source: 'google',
    medium: 'organic-local',
    campaign: 'isletme-profili',
    content: 'website-button',
  },
];

export const utmTarget = (l: ShortLink) =>
  `${l.to ?? '/'}?utm_source=${l.source}&utm_medium=${l.medium}&utm_campaign=${l.campaign}&utm_content=${l.content}`;

export const redirectMap = () =>
  Object.fromEntries(shortLinks.map((l) => [`/${l.slug}`, utmTarget(l)]));

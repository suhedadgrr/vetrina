/** Blog iskeleti. Yazı eklemek için diziye bir öğe ekleyin; /blog/ sayfası otomatik listeler. */
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  draft?: boolean;
}
export const posts: Post[] = [
  {
    slug: 'markalar-neden-ayni-gorunuyor',
    title: 'Markalar neden birbirine benziyor?',
    excerpt:
      '[Taslak] Aynı şablon, aynı stok görsel, aynı ton: B2B’de fark yaratmanın önündeki üç engel.',
    date: '[GG.AA.YYYY]',
    tag: 'Marka',
    draft: true,
  },
  {
    slug: 'b2b-sunum-ilk-uc-slayt',
    title: 'B2B sunumda ilk 3 slayt neden her şeydir?',
    excerpt: '[Taslak] Karar vericiye ilk 60 saniyede ne göstermelisiniz?',
    date: '[GG.AA.YYYY]',
    tag: 'B2B',
    draft: true,
  },
  {
    slug: 'instagram-profil-5-saniye',
    title: 'Instagram profiliniz 5 saniyede ne söylüyor?',
    excerpt: '[Taslak] Profil fotoğrafı, bio, highlight ve ilk dokuz gönderi için kontrol listesi.',
    date: '[GG.AA.YYYY]',
    tag: 'Sosyal medya',
    draft: true,
  },
];

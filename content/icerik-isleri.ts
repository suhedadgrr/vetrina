/**
 * Kurucunun içerik ve sosyal medya çalışmaları (Berre Şuheda Doğru'nun kişisel portföyünden).
 * Rakamlar ve kapsam ifadeleri portföydeki metne birebir bağlıdır; yeni rakam eklemeyin.
 */
export interface ContentWork {
  brand: string;
  sector: string;
  scope: string;
  count?: string;
  note: string;
  instagram: string;
  handle: string;
}

export const contentWorks: ContentWork[] = [
  {
    brand: 'MAT İnşaat',
    sector: 'Mimari & gayrimenkul',
    scope: 'Fikir, üretim ve sosyal medya yönetimi',
    count: '16 içerik',
    note: 'Gayrimenkul ve mimari bir markanın sosyal medya içeriği: fikirden yayına.',
    instagram: 'https://www.instagram.com/matinsaat.tr/',
    handle: '@matinsaat.tr',
  },
  {
    brand: 'Lawly',
    sector: 'Hukuk teknolojisi',
    scope: 'İçerik stratejisi · ürün iletişimi · sosyal medya · ürün pazarlaması',
    note: 'Karmaşık bir ürünü, anlaşılır faydaya çeviren içerik ve iletişim çalışması.',
    instagram: 'https://www.instagram.com/lawly.tr/',
    handle: '@lawly.tr',
  },
  {
    brand: '360 Jewellery',
    sector: 'B2B yazılım',
    scope: 'Sektörel problem–çözüm anlatımı',
    count: '24 içerik',
    note: 'Sektörün diliyle, ihtiyacın merkezinde içerik serisi.',
    instagram: 'https://www.instagram.com/360.jewellery/',
    handle: '@360.jewellery',
  },
  {
    brand: 'MAC030',
    sector: 'Teknoloji · Berlin',
    scope: 'Almanca içerik ve marka iletişimi · marka ve hizmet tanıtımı',
    count: '9 içerik',
    note: 'Almanca yayın yapan bir teknoloji markası için marka ve hizmet tanıtımı.',
    instagram: 'https://www.instagram.com/mac030.de/',
    handle: '@mac030.de',
  },
  {
    brand: 'Voiser',
    sector: 'İçerik & yaratıcı üretim',
    scope: 'İçerik üretimi · fikir geliştirme · üretim sürecine katkı',
    note: 'Ses klonlama, yapay zekâ video ve gerçekçi sesler üzerine içerik üretimi.',
    instagram: 'https://www.instagram.com/voisertr/',
    handle: '@voisertr',
  },
];

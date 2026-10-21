/**
 * Seçilmiş çalışmalar. İlk kayıt gerçek bir vakadır (Dt. Bodur, müşteri izniyle); diğerleri KONSEPT çalışmadır (kurgusal markalar).
 * Gerçek bir müşteri işi ekledikçe `concept: false` yapın ve `client` alanını doldurun.
 */
export interface Work {
  slug: string;
  brand: string;
  concept: boolean;
  category: string;
  services: string[];
  tagline: string;
  palette: { bg: string; fg: string; a: string; b: string };
  pattern: 'grid' | 'orbit' | 'wave' | 'stripes';
  challenge: string;
  approach: string;
  result: string;
  before: string[];
  after: string[];
  /** Hover önizleme videosu (opsiyonel). Yoksa kart canlı CSS animasyonu oynatır. */
  previewVideo?: string;
  /** Gerçek vaka için: canlı site adresi ve izin notu. */
  url?: string;
  permissionNote?: string;
}

export const works: Work[] = [
  {
    slug: 'dt-bodur',
    brand: 'Dt. Yasin Emre Bodur',
    concept: false,
    category: 'Diş kliniği · Gölcük',
    services: ['Web sitesi', 'Google İşletme Profili', 'Yerel SEO', 'Kurumsal e-posta'],
    tagline: 'Yeni açılan bir kliniğin dijital altyapısı, sıfırdan.',
    palette: { bg: '#0B1F2A', fg: '#F2FBFF', a: '#3DD6C6', b: '#7CC4FF' },
    pattern: 'wave',
    challenge:
      'Gölcük’te yeni açılan bir diş kliniği için, açılışla birlikte güven veren, hastayı bilgilendiren ve Google’da bulunabilen bir dijital altyapı kurmak.',
    approach:
      'Tasarım, kodlama, yayın ve Google görünürlüğü tek elden: tedavilerin dönen 3D modelle anlatıldığı kurumsal site, randevu ve öneri/şikâyet formları, alan adı, hosting, SSL ve kurumsal e-posta. Sağlık reklam mevzuatına uygun organik içerik kurgusu.',
    result:
      '22 sayfalık, mobil uyumlu kurumsal site; Google İşletme Profili ve yerel SEO planı; vitrin afişleri ve bekleme salonu ekran videoları. Site yayında: yasinemrebodur.com.tr.',
    before: [
      'Yeni açılan klinik: çevrimiçi altyapı sıfırdan',
      'Web sitesi, Google profili ve kurumsal e-posta yok',
    ],
    after: [
      '22 sayfalık mobil uyumlu kurumsal site',
      '3D tedavi anlatımı, randevu ve öneri/şikâyet formları',
      'Google İşletme Profili ve yerel SEO planı',
      'Alan adı, hosting, SSL ve kurumsal e-posta',
    ],
    url: 'https://www.yasinemrebodur.com.tr',
    permissionNote: 'Proje, müşterinin izniyle gösterilmektedir.',
  },
  {
    slug: 'atolye-nova',
    brand: 'Atölye Nova',
    concept: true,
    category: 'Endüstriyel üretici',
    services: ['Kurumsal kimlik', 'B2B katalog'],
    tagline: 'Üretimin gücünü, güvenen bir dille anlatmak.',
    palette: { bg: '#0E1233', fg: '#F4F5FF', a: '#6C5CFF', b: '#FFB84D' },
    pattern: 'grid',
    challenge:
      'Kaliteli üretim yapan ama dokümanları dağınık görünen bir üreticinin kurumsal güvenini artırmak.',
    approach:
      'Tek bir görsel sistem: net bir logo, teknik çizimden esinlenen desen dili ve satış ekibi için modüler katalog sayfaları.',
    result:
      'Konsept çalışmada hedef: bayi sunumlarında tutarlı, ilk bakışta güven veren bir doküman seti.',
    before: [
      'Her katalogda farklı font',
      'Düşük çözünürlüklü ürün görselleri',
      'Logo kullanımı tutarsız',
    ],
    after: [
      'Tek tipografi sistemi',
      'Teknik desen + net ızgara',
      'Marka rehberiyle kontrollü kullanım',
    ],
  },
  {
    slug: 'derma-lumi',
    brand: 'Derma Lumi',
    concept: true,
    category: 'Estetik & dermatoloji kliniği',
    services: ['Sosyal medya', 'Motion'],
    tagline: 'Klinik ciddiyetinde, insan sıcaklığında içerik.',
    palette: { bg: '#241B3A', fg: '#FFF6EE', a: '#FF8FA3', b: '#8E82FF' },
    pattern: 'orbit',
    challenge: 'Tıbbi güveni bozmadan sosyal medyada ulaşılabilir görünmek.',
    approach:
      'Sakin bir renk paleti, bilgilendirici karusel şablonları ve 9:16 kısa motion açılışları.',
    result:
      'Konsept çalışmada hedef: profil ziyaretçisini 5 saniyede “güvenilir klinik” algısına taşıyan tutarlı akış.',
    before: ['Stok görsel karmaşası', 'Her gönderide farklı stil', 'Bilgilendirici içerik az'],
    after: ['Tek şablon ailesi', 'Net başlık hiyerarşisi', 'Düzenli bilgilendirici seri'],
  },
  {
    slug: 'kuzey-lojistik',
    brand: 'Kuzey Lojistik',
    concept: true,
    category: 'Lojistik & taşımacılık',
    services: ['B2B sunum', 'Web sitesi'],
    tagline: 'Karmaşık operasyonu tek sayfada anlaşılır kılmak.',
    palette: { bg: '#0B1F2E', fg: '#EAF6FF', a: '#2F9BFF', b: '#7CF2C4' },
    pattern: 'stripes',
    challenge: 'Teklif aşamasında hizmet kapsamı ve güvenceyi hızlıca anlatan bir sunum.',
    approach:
      'Rota çizgilerinden türeyen grafik dil, infografik sayfalar ve bilgi yoğunluğunu dengeleyen sunum şablonu.',
    result:
      'Konsept çalışmada hedef: ilk 3 slaytta “ne yapıyoruz, neden biz” sorusunu cevaplayan sunum.',
    before: ['Metin yoğun slaytlar', 'Tutarsız ikonlar', 'Uzun, odaksız anlatım'],
    after: ['Slayt başına tek mesaj', 'Tek ikon seti', 'Rota temalı infografik'],
  },
  {
    slug: 'mavi-cekirdek',
    brand: 'Mavi Çekirdek',
    concept: true,
    category: 'Yerel kafe & kavurma',
    services: ['Sosyal medya', 'Motion', 'Kimlik'],
    tagline: 'Mahalle kafesini şehrin hatırladığı bir markaya çevirmek.',
    palette: { bg: '#10243A', fg: '#FFF4E2', a: '#FFB84D', b: '#4DA3FF' },
    pattern: 'wave',
    challenge: 'Düşük bütçeyle fark edilir, tanınabilir ve paylaşılabilir bir görünüm.',
    approach: 'Cesur renk kullanımı, hikâye anlatan ürün reelleri ve menü/ambalaj şablonları.',
    result: 'Konsept çalışmada hedef: yerel müşterinin akılda tutup paylaştığı tutarlı bir kimlik.',
    before: ['Menü ve profil farklı dillerde', 'Kalitesiz ürün fotoğrafları', 'Reel yok'],
    after: [
      'Tek renk ve tipografi sistemi',
      'Hikâye odaklı kısa videolar',
      'Menü ve ambalaj şablonları',
    ],
  },
];

export const getWork = (slug: string) => works.find((w) => w.slug === slug);

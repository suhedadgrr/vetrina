/**
 * VETRINA — Site geneli içerik ve ayarlar.
 * Metinleri, iletişim bilgilerini ve linkleri buradan değiştirin.
 * [Köşeli parantez] içindeki her şey sizin dolduracağınız yer tutucudur.
 */

export const site = {
  name: 'Vetrina',
  legalName: 'Vetrina',
  tagline: 'B2B markalar için dijital vitrin ajansı',
  locale: 'tr-TR',
  /** Gelecekte İngilizce eklemek için: /en/ altında aynı içerik yapısı kullanılabilir. */
  defaultLang: 'tr',
  description:
    'Vetrina; sosyal medya, web sitesi, kurumsal kimlik, B2B marka iletişimi ve motion grafik ile markanızı net, tutarlı ve güvenilir gösteren dijital ajans. Ücretsiz Mini Analiz isteyin.',
  /** Hedef müşteri varsayımı — metinlerde ve SSS’te kullanılır. */
  audience: ['klinikler', 'üreticiler', 'B2B firmalar', 'yerel işletmeler'],
} as const;

export const contact = {
  email: 'bsuheda.dogru@gmail.com',
  /** Uluslararası biçim, + ve boşluk olmadan. Örn: 905321234567 */
  whatsapp: '[905XXXXXXXXX]',
  /** tel: linki için. Örn: +905321234567 */
  phone: '[+90 5XX XXX XX XX]',
  phoneHref: '[+905XXXXXXXXX]',
  address: 'Kocaeli',
  city: 'Kocaeli',
  hours: '[Hafta içi 09:00–18:00]',
  whatsappMessage: 'Merhaba Vetrina, ücretsiz mini analiz hakkında bilgi almak istiyorum.',
} as const;

export const social = {
  instagram: { handle: '@vetrinastudio.tr', url: 'https://www.instagram.com/vetrinastudio.tr/' },
  linkedin: { handle: 'Berre Şuheda Doğru', url: 'https://www.linkedin.com/in/suhedadgr24/' },
  youtube: { handle: 'Vetrina', url: '[https://youtube.com/@vetrina]' },
  behance: { handle: 'Vetrina', url: '[https://behance.net/vetrina]' },
} as const;

/** Yer tutucu mu? ([ ... ] içeren değerler) */
export const isPlaceholder = (v: string) => /\[|\]/.test(v);

export const nav = [
  { label: 'Hizmetler', href: '/#hizmetler' },
  { label: 'Çalışmalar', href: '/#calismalar' },
  { label: 'Paketler', href: '/#paketler' },
  { label: 'Süreç', href: '/#surec' },
  { label: 'B2B', href: '/b2b/' },
] as const;

export const cta = {
  primary: 'Ücretsiz Mini Analiz İste',
  primaryHref: '/#iletisim',
  secondary: 'Çalışmalarımız',
  secondaryHref: '/#calismalar',
  whatsapp: 'WhatsApp’tan Yaz',
} as const;

export const hero = {
  eyebrow: 'Dijital ajans · Kocaeli',
  /** Başlık kelimeleri tek tek belirir. <em> yerine vurgulanacak kelimeleri * ile işaretleyin. */
  title: 'Markanız vitrinde *fark edilsin*, akılda kalsın.',
  lead: 'Sosyal medya, web sitesi, kurumsal kimlik ve motion ile B2B markanızı net, tutarlı ve güvenilir gösteriyoruz. İlk adım: size özel, ücretsiz bir Mini Analiz.',
  note: 'Yazılı mini analiz · 2 iş günü içinde dönüş · Taahhüt yok',
} as const;

/**
 * Güven şeridi — uydurma rakam yok. Sayılar yalnızca bizim verdiğimiz sözler / yapımızdır.
 * 'count' animasyonla sayılır. Değerleri gerçek koşullarınıza göre güncelleyin.
 */
export const trust = [
  {
    count: 5,
    suffix: '',
    label: 'Pilot kontenjanı',
    text: 'İlk 5 müşteriye özel indirimli Pilot Programı.',
  },
  {
    count: 2,
    suffix: ' iş günü',
    label: 'Mini analiz teslimi',
    text: 'Hesabınızı/sitenizi inceleyip yazılı geri dönüş.',
  },
  {
    count: 4,
    suffix: ' adım',
    label: 'Net süreç',
    text: 'Keşiften yayına her aşama önceden belli.',
  },
  {
    count: 5,
    suffix: ' alan',
    label: 'Tek çatı',
    text: 'Sosyal, web, kimlik, B2B iletişim ve motion bir arada.',
  },
] as const;

export const pilot = {
  badge: 'Pilot Programı',
  title: 'İlk 5 müşteriye özel Pilot Programı',
  text: 'Yeni kurulduk ve portföyümüzü gerçek işlerle büyütüyoruz. İlk 5 müşterimize indirimli pilot fiyatı ve öncelikli ilgi sunuyoruz. Karşılığında: çalışmayı vaka olarak paylaşma izni (onayınızla).',
  slots: 5,
  cta: 'Pilot kontenjanımı ayır',
} as const;

export const showreel = {
  title: 'Hareket, markanızın sesidir',
  text: 'Kısa, sessiz, ilk saniyede dikkat çeken motion parçaları. Aşağıdaki akış, Vetrina’nın konsept reel diliyle hazırlanmıştır.',
  video: { webm: '/media/showreel.webm', mp4: '/media/showreel.mp4' },
  poster: '/media/showreel-poster.webp',
  label: 'Konsept reel — örnek müşteri işi değildir',
} as const;

export const about = {
  title: 'Vitrin gibi şeffaf, atölye gibi titiz.',
  paragraphs: [
    'Vetrina, markaların “iyi iş yapıyoruz ama bunu doğru anlatamıyoruz” sorununu çözmek için kuruldu. Birçok B2B firmanın sosyal medyası, web sitesi ve sunumu üç farklı dilde konuşuyor; biz bunları tek bir tutarlı vitrine çeviriyoruz.',
    'Kurucu Berre Şuheda Doğru, Yönetim Bilişim Sistemleri mezunu; yazılım şirketlerinde ürün, satış ve pazarlama alanında çalıştı. Ekim 2026’dan beri bağımsız projeler yürütüyor: Gölcük’te yeni açılan bir diş kliniği için web sitesinden Google İşletme Profili’ne, kurumsal e-postadan yerel SEO’ya tüm dijital altyapıyı kurdu. Vetrina’yı gerçek işlerle, adım adım büyütüyor.',
  ],
  founder: {
    name: 'Berre Şuheda Doğru',
    role: 'Kurucu',
    photo: '', // '/images/kurucu.webp' — boşsa monogram gösterilir
    initials: 'BŞ',
    portfolio: 'https://berresuhedadogru.netlify.app',
  },
  values: [
    { title: 'Net iletişim', text: 'Her teslimat için ne, ne zaman, ne kadar: yazılı ve önceden.' },
    { title: 'Ölçülebilir tasarım', text: 'Güzel olması yetmez; hedefi olan, ölçülen tasarım.' },
    { title: 'Tek muhatap', text: 'Tasarımcı, yazar ve geliştirici ile ayrı ayrı uğraşmazsınız.' },
  ],
} as const;

export const instagramBlock = {
  title: 'Instagram’da takip edin',
  text: 'Önce/sonra dönüşümleri, süreç videoları ve “markalar neden aynı görünüyor?” serimiz.',
  /** İleride API ile beslenecek. Şimdilik kurgusal (konsept) kareler gösterilir. */
  tiles: [
    { kind: 'quote', text: 'Logonuz değil, tutarlılığınız hatırlanır.' },
    { kind: 'beforeafter', text: 'Önce / Sonra' },
    { kind: 'process', text: 'Süreçten kareler' },
    { kind: 'tip', text: '3 dakikada profil denetimi' },
    { kind: 'reel', text: 'Motion denemesi' },
    { kind: 'quote', text: 'Aynı görünen markalar aynı unutulur.' },
  ],
} as const;

export const legal = {
  lastUpdated: '19.10.2026',
  dataController:
    'Berre Şuheda Doğru (Vetrina, bağımsız çalışan), Kocaeli, bsuheda.dogru@gmail.com',
} as const;

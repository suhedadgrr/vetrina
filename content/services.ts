export interface Service {
  slug: string;
  title: string;
  short: string;
  icon: 'social' | 'web' | 'identity' | 'b2b' | 'motion';
  hue: number;
  lead: string;
  for: string;
  includes: string[];
  deliverables: string[];
  timeline: string;
  faq: { q: string; a: string }[];
}

export const services: Service[] = [
  {
    slug: 'sosyal-medya',
    title: 'Sosyal Medya Tasarımı & Yönetimi',
    short: 'Tutarlı şablonlar, aylık içerik planı ve yayın. Profiliniz bir vitrin gibi okunsun.',
    icon: 'social',
    hue: 262,
    lead: 'Dağınık paylaşımları, tanınabilir bir görsel dile ve ölçülebilir bir içerik planına çeviriyoruz.',
    for: 'Düzenli içerik üretmeye vakti olmayan, ama profilinin güven vermesini isteyen firmalar.',
    includes: [
      'Profil ve vurgulu hikâye (highlight) tasarımı',
      'Markaya özel gönderi ve story şablonları',
      'Aylık içerik takvimi ve metin yazımı',
      'Yayın, topluluk yönetimi ve aylık rapor',
    ],
    deliverables: ['Şablon seti (düzenlenebilir)', 'Aylık içerik takvimi', 'Aylık özet rapor'],
    timeline: 'Kurulum 1–2 hafta, ardından aylık döngü',
    faq: [
      {
        q: 'Reklam yönetimi de yapıyor musunuz?',
        a: 'Evet, isteğe bağlı olarak Meta (Instagram/Facebook) reklam yönetimini de üstleniyoruz. Kapsam ve reklam bütçesi ayrıca, yazılı olarak netleştirilir.',
      },
      {
        q: 'İçerikleri kim onaylar?',
        a: 'Yayından önce her içerik size onaya gelir; onay süresi planda belirlenir.',
      },
    ],
  },
  {
    slug: 'web-sitesi',
    title: 'Web Sitesi',
    short:
      'Hızlı, mobil uyumlu, arama motorlarına hazır. Ziyaretçiyi teklif isteyene çeviren yapı.',
    icon: 'web',
    hue: 222,
    lead: 'Güzel görünen değil, iş getiren siteler: net mesaj, hızlı yükleme, tek bir ana eylem.',
    for: 'Sitesi yok, eski ya da mobilde bozuk olan; “siteniz var ama arayan yok” diyen firmalar.',
    includes: [
      'Mesaj mimarisi ve sayfa yapısı',
      'Özgün arayüz tasarımı ve geliştirme',
      'Temel SEO, hız ve erişilebilirlik',
      'Form, WhatsApp ve analitik kurulumu',
    ],
    deliverables: ['Yayında web sitesi', 'İçerik yönetim kılavuzu', 'Analitik kurulumu'],
    timeline: '3–5 hafta (kapsama göre)',
    faq: [
      {
        q: 'İçeriği sonradan kendim değiştirebilir miyim?',
        a: 'Evet. Metinler basit içerik dosyalarında tutulur; kısa bir kılavuzla teslim ederiz.',
      },
      {
        q: 'Alan adı ve barındırma?',
        a: 'Kurulumda yardımcı oluruz; hesaplar her zaman sizin adınıza açılır.',
      },
    ],
  },
  {
    slug: 'kurumsal-kimlik',
    title: 'Kurumsal Kimlik',
    short: 'Logo, renk, tipografi ve kullanım kuralları. Her temas noktasında aynı güven.',
    icon: 'identity',
    hue: 32,
    lead: 'Markanızın kim olduğunu ve nasıl göründüğünü tek bir sistemde topluyoruz.',
    for: 'Yeni kurulan ya da büyürken tutarsızlaşan, “her şey farklı görünüyor” diyen markalar.',
    includes: [
      'Marka konumlandırma ve ses tonu',
      'Logo ve logo sistemi',
      'Renk, tipografi ve görsel dil',
      'Marka rehberi (kullanım kuralları)',
    ],
    deliverables: [
      'Logo dosyaları (vektör)',
      'Marka rehberi PDF',
      'Temel kırtasiye ve sosyal şablonlar',
    ],
    timeline: '2–4 hafta',
    faq: [
      {
        q: 'Mevcut logomuzu yenilemek mümkün mü?',
        a: 'Evet; “yenileme” ve “sıfırdan” seçeneklerini mini analizde değerlendiririz.',
      },
    ],
  },
  {
    slug: 'b2b-marka-iletisimi',
    title: 'B2B Marka İletişimi',
    short: 'Sunum, katalog ve kurumsal profil. Satış ekibinizin eline güven veren dokümanlar.',
    icon: 'b2b',
    hue: 190,
    lead: 'Teklif masasında sizi öne çıkaran sunum, katalog ve kurumsal profil tasarımı.',
    for: 'Bayi, ihale ve kurumsal müşteriyle çalışan üretici, tedarikçi ve hizmet firmaları.',
    includes: [
      'Kurumsal sunum ve satış sunumu',
      'Ürün/hizmet kataloğu',
      'Kurumsal profil ve referans dokümanı',
      'Fuar ve toplantı materyalleri',
    ],
    deliverables: [
      'Düzenlenebilir sunum şablonu',
      'Baskıya hazır PDF',
      'Dijital (hafif) PDF sürümü',
    ],
    timeline: '1–3 hafta',
    faq: [
      {
        q: 'Katalog baskısı da yapıyor musunuz?',
        a: 'Baskıya hazır dosya teslim ederiz; basım için matbaa yönlendirmesi yaparız.',
      },
    ],
  },
  {
    slug: 'motion-reel',
    title: 'Motion Grafik & Reel',
    short: 'Kısa videolar, logo animasyonları ve reel serileri. İlk saniyede dikkat çeker.',
    icon: 'motion',
    hue: 320,
    lead: 'Hareketle anlatan kısa formatlar: reel, tanıtım animasyonu, logo açılışı.',
    for: 'Sosyal medyada öne çıkmak, ürünü/hizmeti 15 saniyede anlatmak isteyen markalar.',
    includes: [
      'Senaryo ve storyboard',
      'Motion grafik ve montaj',
      'Altyazı, müzik ve format uyarlama (9:16, 4:5, 16:9)',
      'Reel serisi için tekrar kullanılabilir şablon',
    ],
    deliverables: [
      'Kısa video dosyaları',
      'Platform başına format uyarlamaları',
      'Altyazılı sürümler',
    ],
    timeline: '1–2 hafta (video başına)',
    faq: [
      {
        q: 'Çekim yapıyor musunuz?',
        a: 'Hayır, motion ve kurgu odaklıyız. Sahada çekim ihtiyacı varsa bunu teklif aşamasında birlikte planlarız.',
      },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

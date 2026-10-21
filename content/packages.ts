export interface Pkg {
  id: string;
  name: string;
  tag: string;
  for: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

/** Fiyat gösterilmez; “teklif al” akışı. Paket içerikleri örnektir, kendi kapsamınıza göre düzenleyin. */
export const packages: Pkg[] = [
  {
    id: 'baslangic',
    name: 'Başlangıç',
    tag: 'Vitrini kur',
    for: 'Yeni markalar ve ilk kez toparlanmak isteyenler',
    features: [
      'Mini analiz ve yol haritası',
      'Temel marka kiti (logo uyarlama, renk, font)',
      '12 sosyal medya şablonu',
      'Tek sayfa tanıtım sitesi [opsiyonel]',
    ],
    cta: 'Teklif Al',
  },
  {
    id: 'buyume',
    name: 'Büyüme',
    tag: 'Düzenli büyüme',
    for: 'Düzenli içerik ve satış desteği isteyen firmalar',
    features: [
      'Başlangıç paketindeki her şey',
      'Aylık içerik takvimi + yayın',
      'Aylık 2 kısa motion/reel',
      'Çok sayfalı web sitesi',
      'Aylık raporlama görüşmesi',
    ],
    highlight: true,
    cta: 'Teklif Al',
  },
  {
    id: 'kurumsal',
    name: 'Kurumsal',
    tag: 'Tam görünürlük',
    for: 'Bayi/ihale/kurumsal müşteriyle çalışan firmalar',
    features: [
      'Büyüme paketindeki her şey',
      'Tam kurumsal kimlik + marka rehberi',
      'B2B sunum, katalog ve kurumsal profil',
      'Çok dilli yapı hazırlığı',
      'Öncelikli destek ve çeyreklik strateji oturumu',
    ],
    cta: 'Teklif Al',
  },
];

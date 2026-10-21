# Vetrina — Dijital Ajans Web Sitesi

B2B karar vericiyi ilk 5 saniyede etkilemek ve tek bir eyleme yönlendirmek için tasarlanmış statik site:
**“Ücretsiz Mini Analiz İste”** (form + WhatsApp).

- **Teknoloji:** Astro 7 (statik çıktı) · TypeScript · CSS tasarım token’ları · GSAP + ScrollTrigger (lazy)
- **Dil:** Türkçe (içerik `content/` altında olduğu için İngilizce eklemeye uygun)
- **Deploy:** GitHub Pages **veya** Cloudflare Pages (ikisi de hazır)
- **Ölçülen Lighthouse (mobil, 3 çalıştırma medyanı):** Performance 99–100 · Accessibility 100 · Best Practices 100 · SEO 100 (ana sayfa LCP 2,2 sn; diğer sayfalar 1,7 sn)

---

## İçindekiler

1. [Hızlı başlangıç](#hızlı-başlangıç)
2. [Teknoloji kararları ve gerekçeleri](#teknoloji-kararları-ve-gerekçeleri)
3. [Klasör yapısı](#klasör-yapısı)
4. [İçerik nasıl güncellenir?](#içerik-nasıl-güncellenir)
5. [Doldurmanız gereken yer tutucular](#doldurmanız-gereken-yer-tutucular)
6. [Form, spam koruması ve analitik kurulumu](#form-spam-koruması-ve-analitik-kurulumu)
7. [Görseller, paylaşım şablonları, showreel ve PDF](#görseller-paylaşım-şablonları-showreel-ve-pdf)
8. [Deploy](#deploy) — GitHub Pages / Cloudflare Pages
9. [Alan adı bağlama (DNS)](#alan-adı-bağlama-dns)
10. [CI (GitHub Actions)](#ci-github-actions)
11. [Test ve kalite komutları](#test-ve-kalite-komutları)
12. [Instagram beslemesi (API ile)](#instagram-beslemesi-api-ile)
13. [Çoklu dil: EN ekleme](#çoklu-dil-en-ekleme)
14. [Bilinen eksikler](#bilinen-eksikler)

---

## Hızlı başlangıç

Gereksinim: Node.js ≥ 20.

```bash
npm ci
cp .env.example .env     # form anahtarlarını doldurun (aşağıya bakın)
npm run dev              # http://localhost:4321
npm run build            # dist/ üretir
npm run preview          # build’i yerelde görmek için
```

| Komut            | Ne yapar                                                                   |
| ---------------- | -------------------------------------------------------------------------- |
| `npm run dev`    | Geliştirme sunucusu                                                        |
| `npm run build`  | Statik site (`dist/`)                                                      |
| `npm run check`  | TypeScript / Astro tip kontrolü                                            |
| `npm run lint`   | ESLint (`npx prettier --check .` biçim denetimi)                           |
| `npm run assets` | OG görselleri, Instagram paylaşım görselleri, PDF, showreel videosu üretir |
| `npm run lhci`   | Lighthouse CI (önce `npm run build`)                                       |

---

## Teknoloji kararları ve gerekçeleri

**Astro (Next.js değil).** Bu site içerik ağırlıklı ve etkileşimi küçük “adacıklarda” toplanıyor. Astro varsayılan olarak **sıfır istemci JS** gönderir; yalnızca ihtiyaç duyulan ~6 KB’lık kendi betiğimiz ve (boşta yüklenen) GSAP gider. Next.js’in React çalışma zamanı (~85+ KB) bu işe gereksiz ve mobil performans hedefini (≥ 90) zorlaştırır. Statik çıktı, GitHub Pages ve Cloudflare Pages’e doğrudan uyar. İleride bir ihtiyaç (ör. blog için MDX, CMS) çıkarsa Astro bunları destekler.

**Tailwind yerine CSS tasarım token’ları.** Marka dili (cam kartlar, gradyanlar, grain, tema) zaten özel; Tailwind’in utility sınıfları burada çıktıyı şişirir ve “şablon” görünümü getirir. Bunun yerine **tek dosyada** (`src/styles/tokens.css`) renk, tipografi, boşluk, hareket ve koyu/açık tema token’ları tutulur; bileşen stilleri Astro’nun kapsamlı CSS’iyle yazılır. Tailwind isterseniz `npx astro add tailwind` ile eklenebilir; token’lar `@theme`’e taşınır.

**Animasyon: GSAP + ScrollTrigger (lazy-load), geri kalanı CSS.**

- Hero kelime animasyonu, reveal/stagger, marquee, kart eğilmesi, manyetik butonlar, imleç: **saf CSS + küçük JS** (LCP’yi geciktirmez, GSAP’ten bağımsız).
- GSAP yalnızca **kaydırmaya bağlı** işlerde kullanılır: parallax, süreç zaman çizgisinin kaydırarak dolması, showreel çerçevesinin ölçeklenmesi. `import('gsap')` ile **tarayıcı boştayken** yüklenir (`requestIdleCallback`), hero çizimini bloklamaz. `prefers-reduced-motion` açıksa hiç yüklenmez.
- Framer Motion React gerektirir (kullanmıyoruz). CSS scroll-driven animations Safari’de henüz yaygın değil; ScrollTrigger her tarayıcıda tutarlı.
- **Akıcı kaydırma:** bağlantılar CSS `scroll-behavior: smooth` ile akar. Lenis gibi kaydırma-ele-geçirme kütüphaneleri erişilebilirlik ve mobil performans için bilinçli olarak kullanılmadı.

**Form: Web3Forms + Cloudflare Turnstile + honeypot.** Sunucusuz, ücretsiz; e-postanıza düşer. Turnstile yalnızca forma ilk dokunuşta yüklenir. Yedek: Formspree veya kendi Cloudflare Worker’ınız (`ENDPOINT` → `src/scripts/forms.ts`).

**Analitik: Plausible** (çerezsiz, KVKK dostu) — yalnızca kullanıcı çerez bildiriminde **izin verirse** yüklenir.

**Fontlar:** Bricolage Grotesque (başlık) + Inter (metin), kendi sunucumuzdan; **yalnızca Latin + Türkçe karakterlere** alt kümelenmiş (~80 KB toplam, `scripts/subset-fonts.sh`).

**Görseller:** Stok görsel yok. Tüm çalışma görselleri kodla üretilir (`ConceptArt` bileşeni; SVG/CSS) — bu yüzden yüklenen raster görsel neredeyse yok; OG/paylaşım görselleri JPG, showreel posteri WebP, video MP4 + WebM.

---

## Logo

`public/brand/` altında hazır: `logo-dark-bg` / `logo-light-bg` (renkli), `logo-white` / `logo-black` (tek renk), `mark` (yalnızca işaret), `app-icon` (uygulama/favicon karosu) — her biri SVG + PNG. Konsept: iki cam panelden (mor + mavi) oluşan, gövdeli bir “V” (vitrin camı) ve köşesinde amber bir ışık yansıması. Yazı, Bricolage Grotesque 800’den vektöre çevrilmiştir (font gerekmez). Sitede `src/components/Logo.astro` / `BrandMark.astro` kullanılır; renkler `tokens.css` paletiyle aynıdır.

## Klasör yapısı

```
content/            ← METİNLERİ BURADAN DEĞİŞTİRİN
  site.ts           ajans adı, iletişim, sosyal linkler, hero, güven şeridi, pilot, hakkımızda
  services.ts       5 hizmet (her biri /hizmetler/<slug>/ sayfası)
  work.ts           çalışmalar (şimdilik hepsi “konsept”)
  packages.ts       Başlangıç / Büyüme / Kurumsal
  process.ts        4 adımlı süreç
  faq.ts            SSS (FAQPage şeması otomatik)
  blog.ts           blog iskeleti
  links.ts          kanal kısa linkleri + UTM
src/
  styles/           tokens.css (tasarım token’ları), global.css, fonts.css
  components/       Hero, Services, Work, BeforeAfter, Showreel, Packages, Process, About, FAQ, ContactForm…
  layouts/          Base (SEO/JSON-LD/tema), Legal, Studio
  pages/            index, hizmetler/[slug], calismalar/, b2b, blog/, tesekkurler, kvkk, gizlilik, cerez-politikasi, 404
  scripts/          main.ts (giriş), ui.ts, interactions.ts, forms.ts, analytics.ts, motion.ts (GSAP, lazy)
  studio/           OG / Instagram / PDF / showreel ÜRETİM şablonları (canlı siteye girmez)
  assets/fonts/     alt kümelenmiş fontlar
public/             og/, share/, media/, downloads/, favicon, _headers
docs/               social-content-plan.md, utm-links.md
scripts/            generate-assets.mjs, subset-fonts.sh, qa-e2e.mjs, qa-axe.mjs, shot*.mjs
.github/workflows/  ci.yml, deploy.yml
```

---

## İçerik nasıl güncellenir?

Kodla uğraşmadan **yalnızca `content/` dosyalarını** düzenleyin (düz metin). Değişiklik sonrası `npm run build` (veya `git push` → otomatik deploy).

| Ne değiştirmek istiyorsunuz                                                             | Dosya                                   |
| --------------------------------------------------------------------------------------- | --------------------------------------- |
| Hero başlığı/alt metin, güven şeridi sayıları, pilot metni, hakkımızda, Instagram bloğu | `content/site.ts`                       |
| Telefon, WhatsApp, e-posta, adres, sosyal medya linkleri                                | `content/site.ts` (`contact`, `social`) |
| Hizmet metinleri, kapsam, teslimatlar                                                   | `content/services.ts`                   |
| Çalışmalar (marka, palet, desen, önce/sonra maddeleri)                                  | `content/work.ts`                       |
| Paket içerikleri                                                                        | `content/packages.ts`                   |
| Süreç adımları                                                                          | `content/process.ts`                    |
| SSS                                                                                     | `content/faq.ts`                        |
| Blog yazısı iskeleti                                                                    | `content/blog.ts`                       |
| Renk, font, boşluk, tema                                                                | `src/styles/tokens.css`                 |
| Kanal kısa linkleri                                                                     | `content/links.ts`                      |

**Gerçek bir müşteri işi eklemek:** `content/work.ts`’e yeni bir öğe ekleyin (`concept: false`), gerçek görselleri `public/work/<slug>/` altına koyup `ConceptArt` yerine `<Image>` kullanan bir kart tasarlayın (veya yazıyla bana/ekibe iletin). Sonra `npm run assets` ile OG ve paylaşım görsellerini yeniden üretin. **Müşteriden yazılı izin alın.**

**Hover video önizleme:** `work.ts` içinde bir çalışmaya `previewVideo: '/media/<dosya>.mp4'` ekleyin; kart üzerine gelince oynar (mobilde yüklenmez).

**Showreel’i kendi videonuzla değiştirmek:** `public/media/showreel.mp4`, `showreel.webm` (ve `showreel-poster.webp`) dosyalarını değiştirin. Öneri: 1280×720, 6–12 sn, sessiz, ≤ 1 MB. (Mevcut video bir *konsept reel*dir.)

---

## Doldurmanız gereken yer tutucular

Sitede **[köşeli parantez]** ile işaretli her şey sizin dolduracağınız alandır. Yer tutucu kalan iletişim kanalları **kırık link üretmez** (WhatsApp/telefon yer tutucuysa buton formu açar; sosyal ikonlar pasif görünür).

| Alan                                                                                                                                                                 | Dosya                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Şirket ünvanı, e-posta, telefon, WhatsApp numarası (`905XXXXXXXXX`), adres, çalışma saatleri                                                                         | `content/site.ts` → `site.legalName`, `contact`                     |
| Instagram / LinkedIn / YouTube / Behance linkleri                                                                                                                    | `content/site.ts` → `social`                                        |
| Hero eyebrow’daki şehir                                                                                                                                              | `content/site.ts` → `hero.eyebrow`                                  |
| Pilot indirim oranı (örn. %30)                                                                                                                                       | `content/site.ts` → `pilot.text`                                    |
| Güven şeridi sayıları (2 iş günü, 5 pilot kontenjanı…) — **verebileceğiniz sözler olmalı**                                                                           | `content/site.ts` → `trust`, `content/faq.ts`, `content/process.ts` |
| Süre aralıkları ([1–2 hafta], [3–5 hafta]…)                                                                                                                          | `content/services.ts`, `content/faq.ts`, `content/process.ts`       |
| Kurucu adı, hikâyesi, **fotoğrafı** (`about.founder.photo` → `public/images/kurucu.webp`, 4:5, ≥ 800×1000)                                                           | `content/site.ts` → `about`                                         |
| **Logo:** şu an geçici bir “V” işareti (`src/components/BrandMark.astro`, `Header.astro`, `public/favicon.svg`) — kendi logonuzla değiştirin, sonra `npm run assets` | —                                                                   |
| KVKK / Gizlilik / Çerez metinleri (taslak): veri sorumlusu, saklama süresi, güncelleme tarihi — **hukuk danışmanı onayı**                                            | `content/site.ts` → `legal`, `src/pages/kvkk.astro` vb.             |
| Paket içerikleri (örnek)                                                                                                                                             | `content/packages.ts`                                               |
| `[Evet/Hayır]` olan hizmet SSS yanıtları (reklam yönetimi, çekim vb.)                                                                                                | `content/services.ts`                                               |
| Blog yazıları (şu an taslak başlıklar)                                                                                                                               | `content/blog.ts`                                                   |
| Gerçek müşteri çalışmaları ve (izinli) referanslar                                                                                                                   | `content/work.ts`                                                   |
| Ortam anahtarları: `PUBLIC_WEB3FORMS_KEY`, `PUBLIC_TURNSTILE_SITEKEY`, `PUBLIC_PLAUSIBLE_DOMAIN`                                                                     | `.env` / GitHub Variables                                           |
| Alan adı: `SITE_URL` (sitemap, canonical, OG)                                                                                                                        | `.env` / GitHub Variables                                           |

> **Sahte veri yok:** sitede müşteri, yorum veya performans rakamı uydurulmamıştır. Çalışma örnekleri **“konsept / kurgusal marka”** etiketlidir. Bu ilkeyi koruyun.

---

## Form, spam koruması ve analitik kurulumu

### 1) Form (Web3Forms)

1. https://web3forms.com → e-postanızı girin → **Access Key** alın.
2. `.env` içine `PUBLIC_WEB3FORMS_KEY=...` yazın (CI için: GitHub → Settings → Secrets and variables → Actions → **Variables**).
3. Talepler e-postanıza düşer; konu satırı, **UTM kaynağı** (hangi kanaldan geldi) ve sayfa adresi ek alan olarak gelir.

Anahtar yoksa form **sahte başarı göstermez**; dürüst bir hata ve alternatifleri (WhatsApp/e-posta) gösterir.

Başarıda `/tesekkurler/` sayfasına yönlenir (noindex). Hata, ağ kopması, zaman aşımı (15 sn) ve doğrulama durumları ele alınmıştır.

### 2) Spam: honeypot + Turnstile

- Honeypot (`company_website` + `botcheck`) her zaman aktif; doluysa bot oyalanır, hiçbir şey gönderilmez.
- **Turnstile:** Cloudflare Dashboard → Turnstile → site ekleyin → **Site key**’i `PUBLIC_TURNSTILE_SITEKEY` olarak ekleyin. Widget yalnızca forma ilk odakta yüklenir. Web3Forms panelinde Turnstile’ı etkinleştirip secret’ı girin (Settings → Spam protection).

### 3) Analitik (Plausible)

1. plausible.io’da site ekleyin; `PUBLIC_PLAUSIBLE_DOMAIN=alanadiniz.com`.
2. Çerez bildirimi: ziyaretçi **“Kabul et”** demeden betik **yüklenmez** (KVKK uyumlu yaklaşım). Tercih `localStorage`’da (`vt_consent`) tutulur; footer’daki “Çerez tercihleri” ile değiştirilebilir.
3. Plausible → Settings → **Goals → Custom event** olarak şunları ekleyin:

| Olay                                                       | Ne zaman                                            |
| ---------------------------------------------------------- | --------------------------------------------------- |
| `form_submit`                                              | Mini analiz formu gönderildi                        |
| `whatsapp_click`                                           | Herhangi bir WhatsApp butonu                        |
| `phone_click`                                              | Telefon bağlantısı                                  |
| `pdf_request` / `pdf_download`                             | B2B e-posta kapısı gönderildi / PDF indirildi       |
| `cta_click`                                                | Ana CTA tıklamaları (`where` özelliği konumu verir) |
| `work_open`, `service_click`, `package_quote`, `reel_play` | Etkileşim olayları                                  |
| `lead_thankyou`                                            | Teşekkür sayfası görüldü                            |

Yeni olay eklemek için herhangi bir bağlantıya `data-track="olay_adi" data-track-where="konum"` yazmanız yeterli.

---

## Görseller, paylaşım şablonları, showreel ve PDF

```bash
npm run assets            # hepsini üretir (~1 dk, Chromium + ffmpeg gerekir)
node --experimental-strip-types --no-warnings scripts/generate-assets.mjs og share   # yalnızca seçilenler (og | share | icons | pdf | reel)
```

Çıktılar `public/` altına yazılır ve commit’lenir:

| Çıktı                                                                      | Yer                                                       | Not                                              |
| -------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------ |
| OG / Twitter Card (1200×630), her sayfa ayrı                               | `public/og/*.jpg`                                         | Şablon: `src/studio/og/[slug].astro`             |
| **Instagram paylaşım görselleri** 1080×1350 ve 1080×1920, her çalışma için | `public/share/<çalışma>-1080x1350.jpg` / `-1080x1920.jpg` | Şablon: `src/studio/share/…`                     |
| B2B örnek sunum PDF (A4 yatay, 5 sayfa)                                    | `public/downloads/vetrina-b2b-ornek-sunum.pdf`            | Şablon: `src/studio/b2b-deck.astro`              |
| Showreel (MP4 + WebM + poster)                                             | `public/media/`                                           | Şablon: `src/studio/showreel.astro` (9 sn döngü) |

Yeni çalışma eklediğinizde `content/work.ts`’e ekleyip `npm run assets` çalıştırın — OG ve paylaşım görselleri otomatik oluşur. Şablonları tarayıcıda görmek için: `STUDIO=1 npm run dev` → `/studio/share/atolye-nova/1350/`.

**Sosyal medya planı:** `docs/social-content-plan.md` (30 günlük takvim + 10 reel fikri). **UTM/kısa linkler:** `docs/utm-links.md`.

---

## Deploy

Önce deploy hedefinizi seçin; her ikisinde de `SITE_URL` sitenin son adresi olmalıdır (sitemap, canonical, OG görselleri bunu kullanır).

### A) GitHub Pages (hazır workflow: `.github/workflows/deploy.yml`)

1. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Repo → **Settings → Secrets and variables → Actions → Variables** sekmesine ekleyin:
   - `SITE_URL` → özel alan adıyla: `https://alanadiniz.com` · alan adı yoksa: `https://<kullanici>.github.io`
   - `BASE_PATH` → özel alan adıyla: `/` (varsayılan) · **alan adı yoksa proje sitesi için: `/Vetrina---Web-`**
   - `CUSTOM_DOMAIN` → (özel alan adı kullanıyorsanız) `alanadiniz.com` — `CNAME` dosyasını otomatik yazar
   - `PUBLIC_WEB3FORMS_KEY`, `PUBLIC_TURNSTILE_SITEKEY`, `PUBLIC_PLAUSIBLE_DOMAIN`
3. `main` dalına push’layın (veya Actions → Deploy → _Run workflow_).

### B) Cloudflare Pages (önerilen: daha hızlı CDN, `_headers` desteği)

**Seçenek 1 — Dashboard (en kolay):** Cloudflare → Workers & Pages → Create → Pages → GitHub repo’yu bağlayın →
Framework: **Astro** · Build command: `npm run build` · Output: `dist` · Environment variables: `SITE_URL`, `PUBLIC_*` (yukarıdaki gibi).

**Seçenek 2 — Workflow:** GitHub Variables’a `DEPLOY_TARGET=cloudflare`, `CLOUDFLARE_PROJECT` ekleyin; Secrets’a `CLOUDFLARE_API_TOKEN` ve `CLOUDFLARE_ACCOUNT_ID` ekleyin. `deploy.yml` otomatik Cloudflare’e yayınlar.

`public/_headers` dosyası önbellek ve güvenlik başlıklarını Cloudflare’de uygular.

---

## Alan adı bağlama (DNS)

Bir alan adınız olduğunu varsayarak (örn. `alanadiniz.com`):

**Cloudflare Pages ile**

1. Alan adını Cloudflare’e ekleyin (Add a site) ve registrar’da nameserver’ları Cloudflare’inkilerle değiştirin (yayılması 5 dk–24 saat).
2. Pages projesi → **Custom domains → Set up a domain** → `alanadiniz.com` (ve `www.alanadiniz.com`). Cloudflare gerekli CNAME kayıtlarını ve SSL’i otomatik ekler.
3. `www`’yi kök alan adına yönlendirin: Rules → Redirect Rules (`www.alanadiniz.com/*` → `https://alanadiniz.com/$1`, 301).
4. `SITE_URL=https://alanadiniz.com` değişkenini güncelleyip yeniden deploy edin.

**GitHub Pages ile**

1. DNS sağlayıcınızda:
   - Kök alan adı için **A kayıtları**: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` için **CNAME**: `<kullanici>.github.io`
2. Repo → Settings → Pages → **Custom domain**: `alanadiniz.com` → **Enforce HTTPS** işaretleyin (sertifika birkaç dakikada hazır olur).
3. Variables: `SITE_URL=https://alanadiniz.com`, `BASE_PATH=/`, `CUSTOM_DOMAIN=alanadiniz.com`.

**E-posta (merhaba@alanadiniz.com):** Google Workspace/Zoho/Cloudflare Email Routing ile MX kayıtlarını ekleyin; SPF/DKIM/DMARC TXT kayıtlarını unutmayın (form e-postalarının spam’e düşmemesi için).

Alan adı bağlandıktan sonra kontrol listesi:

- `https://alanadiniz.com/robots.txt` ve `/sitemap-index.xml` açılıyor mu?
- Google Search Console → alan adını ekleyin → sitemap’i gönderin.
- Google İşletme Profili / sosyal profillerdeki bağlantıları `docs/utm-links.md` kısa linkleriyle güncelleyin.
- https://www.opengraph.xyz veya Facebook Sharing Debugger ile OG önizlemesini test edin.

---

## CI (GitHub Actions)

- **`ci.yml`** (her push/PR): ESLint + Prettier → `astro check` → build → **uçtan uca testler** (`qa-e2e`) → **erişilebilirlik** (`qa-axe`, koyu/açık × masaüstü/mobil) → **Lighthouse CI** (`lighthouserc.json`: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95 → altı olursa build kırılır). Raporlar artifact olarak saklanır.
- **`deploy.yml`** (`main`’e push): build + GitHub Pages **veya** Cloudflare Pages deploy.

---

## Test ve kalite komutları

```bash
npm run build && npm run preview &        # 127.0.0.1:4321
node scripts/qa-e2e.mjs                   # 56 davranış testi: tema, çerez, form, hata/spam, modal, slider, showreel, reduced-motion…
node scripts/qa-axe.mjs http://127.0.0.1:4321 /,/b2b/   # axe-core: WCAG A/AA, her iki tema
npm run lhci                              # Lighthouse CI
node scripts/shot-sections.mjs http://127.0.0.1:4321 ./shots desktop dark   # bölüm bölüm ekran görüntüsü
```

Chromium yolu: `CHROME_PATH` ortam değişkeni (CI’de `/usr/bin/google-chrome`).

---

## Instagram beslemesi (API ile)

Şu an “Instagram’da takip edin” bloğu **kurgusal konsept kareler** gösterir (`InstagramBlock.astro`). Gerçek beslemeye geçiş:

1. Instagram **Business/Creator** hesabı + Meta for Developers’ta uygulama → **Instagram Graph API** (`instagram_basic`) → uzun ömürlü erişim token’ı.
2. Token’ı **asla istemciye koymayın.** Build sırasında çekin: `InstagramBlock.astro` frontmatter’ında
   `fetch('https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,thumbnail_url&limit=6&access_token=' + import.meta.env.IG_TOKEN)`
   ve çıktıyı `<img loading="lazy">` ile listeleyin (görselleri build’te `public/ig/`ye indirip WebP’ye çevirmek en hızlısıdır).
3. Statik site olduğu için güncelleme **build ile** olur: GitHub Actions’a günlük `schedule: cron` ekleyip yeniden deploy ettirin. Token’ı 60 günde bir yenilemeyi unutmayın.
4. Alternatif: Behold/Elfsight gibi hazır bir widget (üçüncü taraf betiği; performansı düşürür, çerez bildirimini genişletmeniz gerekir).

---

## Çoklu dil: EN ekleme

Yapı buna hazır: tüm metinler `content/*.ts` dosyalarında, sayfalar bu verileri kullanıyor, tüm iç linkler `href()` yardımcısından geçiyor, `<html lang>` ve `hreflang` etiketleri `Base.astro`’da.

Önerilen yol: Astro i18n routing (`i18n: { defaultLocale: 'tr', locales: ['tr', 'en'] }`) → `content/en/` klasörü açıp aynı dosya adlarıyla İngilizce içerik yazın → `src/pages/en/` altında sayfaları aynı bileşenlerle kurun → `Base.astro`’daki `hreflang` etiketlerine `en` karşılığını ekleyin → header’a dil seçici koyun.

---

## Bilinen eksikler

- **Kurucu fotoğrafı yer tutucu.** Logo Claude tarafından tasarlanmış bir öneridir; resmî marka tescili/benzerlik araştırması yapılmadı.
- **Çalışmalar konsepttir.** Gerçek müşteri vakası/ekran görüntüsü, hover önizleme videoları ve gerçek referanslar eklenmeli.
- **İletişim bilgileri ve sosyal linkler yer tutucu**; WhatsApp/telefon yer tutucuyken butonlar formu açar.
- **KVKK/Gizlilik/Çerez metinleri taslaktır**; hukuk danışmanı onayı gerekir.
- **Form anahtarları** (Web3Forms/Turnstile/Plausible) sizin hesaplarınızla bağlanmadan form gerçek gönderim yapmaz (e2e testleri ağı taklit eder; gerçek servislerle uçtan uca test **yapılmadı**).
- **Instagram beslemesi** henüz API’ye bağlı değil (statik konsept kareler).
- **İngilizce** henüz yok (yapı hazır).
- Showreel konsept bir motion parçasıdır; gerçek müşteri işleriyle değiştirilmelidir.
- iOS Safari ve Firefox’ta gerçek cihaz testi yapılmadı (testler Chromium’da).

# UTM ve kısa link yapısı

Site, kanal başına **kısa link** sunar (statik yönlendirme sayfası olarak build edilir). Kısa linkler ziyaretçiyi UTM parametreleriyle ana sayfaya (veya ilgili sayfaya) götürür; Plausible bu parametrelerle kaynağı raporlar.

> Alan adınızı bağladıktan sonra aşağıdaki `alanadiniz.com` kısmını gerçek alan adıyla değiştirerek kullanın.

## Kısa link tablosu

| Kısa link | Kanal | Gideceği URL |
|---|---|---|
| `alanadiniz.com/ig` | Instagram — profil/bio linki | `alanadiniz.com/?utm_source=instagram&utm_medium=social&utm_campaign=profil&utm_content=bio` |
| `alanadiniz.com/ig-story` | Instagram — story bağlantı çıkartması | `alanadiniz.com/?utm_source=instagram&utm_medium=social&utm_campaign=story&utm_content=link-sticker` |
| `alanadiniz.com/ig-reel` | Instagram — reel açıklaması/yorum | `alanadiniz.com/?utm_source=instagram&utm_medium=social&utm_campaign=reel&utm_content=caption` |
| `alanadiniz.com/li` | LinkedIn — paylaşım ve profil | `alanadiniz.com/?utm_source=linkedin&utm_medium=social&utm_campaign=organik&utm_content=post` |
| `alanadiniz.com/wa` | WhatsApp Business — profil/otomatik mesaj | `alanadiniz.com/?utm_source=whatsapp&utm_medium=messaging&utm_campaign=iletisim&utm_content=profile` |
| `alanadiniz.com/yt` | YouTube — açıklama / Shorts | `alanadiniz.com/?utm_source=youtube&utm_medium=social&utm_campaign=video&utm_content=description` |
| `alanadiniz.com/be` | Behance — proje bağlantısı | `alanadiniz.com/?utm_source=behance&utm_medium=portfolio&utm_campaign=portfoy&utm_content=project` |
| `alanadiniz.com/mail` | E-posta imzası | `alanadiniz.com/?utm_source=email&utm_medium=signature&utm_campaign=imza&utm_content=footer` |
| `alanadiniz.com/sunum` | Sunum / teklif PDF’i içi | `alanadiniz.com/b2b/?utm_source=pdf&utm_medium=offline&utm_campaign=teklif&utm_content=deck` |
| `alanadiniz.com/qr` | Basılı materyal / QR kod | `alanadiniz.com/?utm_source=qr&utm_medium=offline&utm_campaign=basili&utm_content=qr` |
| `alanadiniz.com/gbp` | Google İşletme Profili | `alanadiniz.com/?utm_source=google&utm_medium=organic-local&utm_campaign=isletme-profili&utm_content=website-button` |

## Kurallar

- Parametreler **küçük harf, Türkçe karaktersiz, tireli** olsun (`profil`, `link-in-bio`).
- `utm_source` = kanal (instagram, linkedin…), `utm_medium` = tür (social, messaging, offline…), `utm_campaign` = kampanya/amaç, `utm_content` = hangi yerleşim (bio, story, reel…).
- Yeni bir kampanya için (ör. Pilot duyurusu): `/ig` yerine özel link üretin: `content/links.ts` dosyasına satır ekleyin → `campaign: 'pilot-programi'`.
- Form gönderimlerine UTM bilgisi **otomatik eklenir** (gizli alan `utm`): talebin hangi kanaldan geldiğini e-postada görürsünüz.
- Plausible’da bu parametreler için: Site → *Sources* ve *Campaigns* sekmeleri. Dönüşüm hedefleri: `form_submit`, `whatsapp_click`, `phone_click`, `pdf_request` (e-posta kapısı), `pdf_download` (indirme tıklaması), `cta_click`.

## Kısa linkleri alan adınızda kendi başınıza kısaltmak (opsiyonel)

`alanadiniz.com/ig` zaten kısadır. Daha da kısa bir alan adı (`vtr.in` gibi) isterseniz Cloudflare Pages’te ikinci alan adını aynı projeye bağlayıp aynı yolları kullanabilirsiniz.

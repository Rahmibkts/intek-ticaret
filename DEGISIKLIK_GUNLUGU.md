# İNTEK TİCARET — Değişiklik Günlüğü

> Bu dosya proje üzerinde yapılan tüm değişiklikleri izler.
> Her değişiklik öncesi ilgili dosyaların kopyası `yedek_20260926/` içine snapshot olarak alınır.

---

## [v0.3.0] 2026-10-22 — Faz 2: Derin Denetim & Hata Düzeltme

**Durum:** 5 sayfa, CSS ve JS baştan sona yeniden denetlendi. Tespit edilen 14 hata düzeltildi, her biri gerçek tarayıcıda (headless Chrome + CDP cihaz taklidi) ölçülerek doğrulandı.

### Kritik Hatalar (Düzeltildi)

| # | Sorun | Çözüm |
|---|---|---|
| 1 | **Hizmet kartı ikonları kırpılıyordu.** `.service-card { overflow: hidden }` olduğu için kartın üst kenarından **-32px taşarak** çıkan yuvarlak altın ikonların üst yarısı görünmüyordu | `overflow: hidden` kaldırıldı (`visible` oldu). İkonlar artık tam daire olarak taşıyor — görsel doğrulandı |
| 2 | **`fa-radiator` ikonu hiç tanımlı değil** (Font Awesome 6.5.1'de yok) → "Petek & Kombi" kartında ikon yerine boş altın daire | 4 sayfada `fa-temperature-high` ile değiştirildi. 34 ikonun tamamı test edilerek doğrulandı |
| 3 | **Scroll animasyonu ana sayfada hiç çalışmıyordu.** 2 sn'lik güvenlik ağı, "hiçbir öğe görünür değilse **hepsini** aç" diyordu; ana sayfada ilk `.fade-up` fold'un altında olduğundan güvenlik ağı 2 sn'de tetiklenip 28 öğenin hepsi aynı anda, animasyonsuz açılıyordu | Güvenlik ağı artık yalnızca `IntersectionObserver` callback'inin **hiç** tetiklenmediği durumda devreye giriyor (`observerAlive` bayrağı). Ölçüm: 0 → 6 → 15 → 28 (scroll ile ilerlemeli) ✓ |
| 4 | **Lightbox boş bir `<img>` üretiyordu** → sayfada kırık görsel (broken image) oluşuyordu | `<img>` artık yalnızca gerçek fotoğraf bulunduğunda dinamik olarak oluşturuluyor |
| 5 | **Lightbox `[hidden]` özniteliğini eziyordu** — `.lightbox { display: flex }` kuralı UA'nın `[hidden] { display: none }` kuralından daha yüksek öncelikli olduğundan lightbox DOM'a eklendiği anda görünür kalıyordu | `.lightbox[hidden] { display: none !important }` eklendi |
| 6 | **Proje kartları klavyeyle erişilemezdi** — `cursor: pointer` + büyüteç ikonu vardı ama tıklama/odak yoktu | `tabindex="0"`, `role="button"`, Enter/Space ile açma ve görünür odak çerçevesi eklendi |
| 7 | **Mobil menü açıkken arka plan kaydırılabiliyordu** | `openNav()` artık `document.body.style.overflow = 'hidden'` ayarlıyor, kapanınca geri alıyor |
| 8 | **SSS akordeonu kardeş öğeleri kapatmıyordu** — aynı grupta birden fazla soru açık kalabiliyordu; `aria-expanded` güncellenmiyordu | Aynı gruptan diğer açık öğeler kapatılıyor, `aria-expanded` ve `maxHeight` her iki yönde de doğru set ediliyor |
| 9 | **WhatsApp popup'ı engellenince hiçbir şey olmuyordu** — `window.open` `null` dönse de kullanıcı geri dönüş almıyordu | Popup engellenirse yedek WhatsApp bağlantısı (`.fallback-wa`) oluşturulup odaklanıyor; eski yedek önce temizleniyor (ikizlenme yok) |
| 10 | **"Nasıl Çalışıyoruz?" kesikli çizgisi sütun merkezlerine değmiyordu** — `left/right: 6%` kullanılıyordu | 4 sütunlu ızgarada merkezler 1. ve 4. sütun merkezlerinde: `left: 12.5%; right: 12.5%` (100%/8). Ölçüm: çizgi başlangıcı 273px, 1. sütun merkezi 264px ✓ |
| 11 | **Eksik `aria-hidden` (16 ikon)** — ekran okuyucu dekoratif ikonları "water", "fire", "snowflake" diye okuyordu | Tüm dekoratif `<i>` ikonlarına `aria-hidden="true"` eklendi (index + hakkımizda) |
| 12 | **HTML geçersizliği: kaçışsız `&`** — meta, option, link ve iframe niteliklerinde düz `&` (tarayıcı yerine koydu, doğrulayıcı hata verirdi) | `&amp;` ile düzeltildi. JSON-LD ve `&copy;` doğru olduğu için korundu |
| 13 | **`hizmetler.html` SSS chevron'unda `aria-hidden` yoktu** | Eklendi |
| 14 | **`projelerimiz.html` filtre sekmeleri `role="tablist"`** kullanıyordu ama sekme paneli yok — yanlış ARIA | `role="group"` (zaten `aria-pressed` var) |

### Eksik Olan Yapılar (Eklendi)
- **`robots.txt`** — yedek klasörler, medya ve zip dosyaları indekslenmesin
- **`sitemap.xml`** — 5 sayfa, öncelik ve güncelleme sıklığı ile
- **`images/og-image.png`** — 1200×630 sosyal medya paylaşım görseli (marka renklerinde, gerçek PNG)
- **`og:image`** (5 sayfa) + **`twitter:image`** — daha önce hiç yoktu
- **Lightbox** — proje kartları tıklanabilir ama hiçbir işleyicisi yoktu (yalnızca CSS'te sınıflar vardı)

### Doğrulama (Gerçek Tarayıcı Testi)
| Test | Sonuç |
|---|---|
| Yatay taşma (5 sayfa × 390/768/1440) | **0 px** (15 ölçüm) |
| Derin taşma (scroller dışı) | 0 |
| Kırık görsel | 0 |
| JS konsol hatası | 0 |
| Lightbox aç/sonraki/önceki/çıkış | çalışıyor, `<img>` yok |
| Hizmet ikonu kırpılması | **yok** (`overflow: visible`, tam daire) |
| 34 Font Awesome ikonu | 33 geçerli (1 hata bulunup düzeltildi) |
| Scroll reveal (390px) | 0 → 6 → 15 → 28 (ilerlemeli) ✓ |
| JS kapalıyken içerik görünürlüğü | 28/28 görünür (`.no-js` koruması) ✓ |
| `prefers-reduced-motion` | animasyonlar kapalı, içerik görünür ✓ |
| Fiyat tablosu (390px) | kendi içinde yatay kaydırma (sayfa taşması yok) ✓ |

### Temizlik Notu
Aşağıdaki CSS sınıfları hiçbir HTML'de kullanılmıyor (önceki tasarım sürümünden artakalan): `bg-navy`, `bg-off`, `on-light`, `btn-lg`, `btn-sm`, `section-sm`, `service-card-body`, `service-card-media`, `service-link`, `stat-bar`, `map-placeholder`. Göze batmıyorlar; istenirse silinebilir.

### Bekleyen Kararlar (Kullanıcıdan)
1. **Yedek klasörleri ve medya dosyaları web kökünde:** `yedek_20260926/`, `yedek_20261021/`, 5 adet `.mp4` ve `.png` doğrudan site kökünde duruyor. `robots.txt` bunları indeks dışı bırakıyor, ancak **canlıya yüklerken bu klasör/dosyalar kökten çıkarılmalı** (yükleme boyutu 23 MB → ~120 KB düşer).
2. **Telefon numarası:** Sitede `0224 713 20 00` (sabit hat) ve WhatsApp `902247132000` kullanılıyor; tanıtım videolarında `0533 471 25 48` ve `0536 330 36 92` geçiyor. WhatsApp numarası doğru mu?
3. **Sosyal medya bağlantıları** hâlâ `href="#"` — hesap adresleri verilirse bağlanır.
4. **İstatistik rakamları** (500+ proje, 450+ müşteri, 15+ yıl) teyit edilmeli.

---

## [v0.2.0] 2026-10-21 — Faz 1: Hata Düzeltme & Eksik Tamamlama

**Durum:** Tüm sayfalar baştan sona denetlendi, tespit edilen hatalar düzeltildi, eksik bölümler eklendi. Her düzeltme gerçek tarayıcıda test edildi.

### Kritik Hatalar (Düzeltildi)
| # | Sorun | Çözüm |
|---|---|---|
| 1 | `.section-dark` CSS'te **tanımsız** — "Neden Biz" ve istatistik bölümü beyaz zeminde kalıyor, `--text-light` (#b0b8c4) yazılar okunmuyordu | `.section-dark` tam tanımlandı (koyu zemin, altın radial vurgu, koyu-zemin kart stilleri) |
| 2 | `.hero-image-placeholder` CSS'te **tanımsız** — hero görsel alanı biçimsiz boş kutu | Şık koyu gradient kutu + altın ikon + ızgara deseni |
| 3 | İç sayfalarda görsel yerine ikon kullanılıyor ama `img` stili hedeflenmiş — ikonlar sola yaslı, küçük | `.service-detail-image`, `.project-image`, `.about-image`, `.ba-layer` için ortalanmış ikon stilleri |
| 4 | `iletisim.html` yıldız puanları `*****` (düz metin) | `★★★★★` + `aria-label` |
| 5 | `iletisim.html` / `hakkimizda.html` / `projelerimiz.html` logosu `INTEK TICARET` (ASCII) — ana sayfayla tutarsız | `İNTEK TİCARET` (tüm sayfalarda aynı) |
| 6 | `.ba-labels` (Önce/Sonra etiketi) slider'ın **dışında** — absolute konumlandırma sayfa gövdesine göre çalışıyordu | Slider içine alındı |
| 7 | Google Maps alanı düz metin placeholder | Gerçek `iframe` harita gömme |
| 8 | JS bildirimleri `notification-success` class'ı üretiyordu, CSS `.notification.success` bekliyordu | Class uyumu düzeltildi, her çağrıda `<style>` ekleme (bellek sızıntısı) kaldırıldı |
| 9 | İletişim formu backend'siz simülasyondu — mesaj kayboluyordu | Gerçek doğrulama + WhatsApp'a aktarım (backend gerektirmez) |
| 10 | `.fade-up` elementleri JS observer tetiklenmezse `opacity:0` ile **görünmez** kalıyordu | `@media (scripting: none)` + scroll/resize güvence listener'ı + 2 sn zaman aşımı güvenlik ağı |
| 11 | `.about-image .corner` dekoratif köşesi `overflow:hidden` yüzünden kırpılıyordu | Konum içeri alındı |
| 12 | CSS/JS önbellek sorunu (eski sürüm yükleniyordu) | `?v=2.0` sürüm parametresi |

### Eklenen Eksikler
- **favicon.svg** — marka renklerinde SVG favicon (yoktu)
- **SEO/OG** — `description`, `keywords`, `canonical`, Open Graph, Twitter Card, `theme-color` (tüm sayfalarda)
- **JSON-LD** — `HVACBusiness` yapılandırılmış verisi (Google yerel işletme için)
- **Sıkça Sorulan Sorular** — ana sayfa (5 soru) + hizmetler (4 soru), akordeon
- **"Nasıl Çalışıyoruz?"** — 4 adımlı süreç bölümü
- **Misyon & Vizyon** — hakkımızda sayfası
- **Sertifika şeridi** — DemirDöküm, EEA, proje/encümen, işçilik garantisi
- **Header CTA** — her sayfada tıklanabilir telefon butonu
- **Yukarı çık butonu** + **mobil sabit çağrı çubuğu** (Ara / WhatsApp)
- **Breadcrumb** — iç sayfalarda
- **Erişilebilirlik** — `skip-link`, `aria-label`/`aria-expanded`/`aria-current`, `main` sarmalayıcı, klavye ile slider kontrolü, form hata mesajları
- **Form** — alan bazlı doğrulama, bot tuzağı (honeypot), durum kutusu, popup engeli için yedek bağlantı
- **Temizlik** — boş `Yeni klasör` kaldırıldı

### Doğrulama (Gerçek Tarayıcı Testi)
| Test | Sonuç |
|---|---|
| Yatay taşma (5 sayfa) | 0 px |
| 0×0 / kırık element | yok |
| Kırık görsel | yok |
| JS konsol hatası | yok |
| Mobil menü aç/kapa + `aria-expanded` | çalışıyor |
| Sayaç animasyonu (500+/450+/15+/7) | çalışıyor |
| Scroll animasyonları | çalışıyor |
| SSS akordeonu | çalışıyor |
| Proje filtresi (+ `aria-pressed`) | çalışıyor |
| Öncesi/sonrası kaydırıcı (+ klavye) | çalışıyor |
| Form doğrulama (boş/geçersiz) | çalışıyor |
| Font Awesome ikonları | yükleniyor |

### Bekleyen Karar (Kullanıcıdan)
1. **Telefon numarası çelişkisi:** Sitede `0224 713 20 00` kullanılıyor; WhatsApp linki de bu numaraya bağlı. Ancak tanıtım videosunda `0533 471 25 48` ve `0536 330 36 92` numaraları geçiyor. WhatsApp için cep numarası gerekir — hangisi doğru?
2. Sosyal medya bağlantıları (`href="#"`) — Instagram/Facebook hesap adresleri verilirse eklenir.
3. İstatistik rakamları (500+ proje, 450+ müşteri, 15+ yıl) teyit edilmeli.

---

## [v0.1.0] 2026-09-26 — Faz 0: Proje Devralma & Güvence

**Durum:** Proje incelendi, devralındı, değişiklik öncesi tam yedek alındı.

### Yapılanlar
- [x] Proje envanteri çıkarıldı (5 HTML, 1 CSS, 1 JS, 4 video, 1 görsel)
- [x] Kod incelemesi tamamlandı (tüm sayfalar + CSS + JS okundu)
- [x] Sorun listesi oluşturuldu (bkz. aşağıda)
- [x] Tam yedek: `yedek_20260926/intek_tam_yedek_20260926.zip` (19.68 MB)
- [x] Dosya kopyası yedek: `yedek_20260926/` içinde klasör yapısı

### Tespit Edilen Sorunlar (Faz 1 Hedefleri)
| # | Sorun | Önem |
|---|---|---|
| 1 | Sayaçlar "0" gösteriyor (`data-count` eksik) | KRİTİK |
| 2 | `images/` boş — görsel bağlantıları kırık olabilir | KRİTİK |
| 3 | İletişim formu backend'siz (simülasyon) | KRİTİK |
| 4 | Telefon bilgisi çelişkili | KRİTİK |
| 5 | Google Maps placeholder | ORTA |
| 6 | SEO meta + favicon yok | ORTA |
| 7 | `Yeni klasör` boş — temizlik | DÜŞÜK |

### Bekleyen Kararlar (Kullanıcıdan)
1. Doğru telefon/e-posta hangisi?
2. Sayaç rakamları ne olacak?
3. Hosting/domain durumu?

---

## 2026-10-24 — İletişim Bilgileri Güncellemesi

**Yapılan değişiklikler:**

1. **Gmail/e-posta kaldırıldı** — `mailto:info@intekticaret.com` linkleri tüm sayfalardan silindi (footer, iletişim kartı, JSON-LD).
2. **Sabit hat kaldırıldı** — `0224 713 20 00` numarası header CTA, footer, mobil call-bar, CTA butonu ve WhatsApp linklerinden çıkarıldı.
3. **Yeni cep numaraları eklendi:**
   - Niyazi Güven: `0 533 471 25 48` (`tel:+905334712548`)
   - Adem Aktepe: `0 536 330 36 92` (`tel:+905363303692`)
4. **WhatsApp butonları ikiye ayrıldı** — her iki kişi için ayrı buton (`.whatsapp-btn` + `.whatsapp-btn-2`).
5. **js/main.js** — `PHONE_LAND` ve `PHONE_WA` değerleri `905334712548` (Niyazi Güven) olarak güncellendi.
6. **css/style.css** — `.whatsapp-btn-2` kuralı eklendi; mobil görünümde buton konumları ayarlandı.
7. **JSON-LD yapılandırılmış verisi** — landline ve email alanları temizlendi; sadece iki ContactPoint kaldı.
8. **Hizmet listesi doğrulandı** — talep edilen tüm hizmetler mevcut (Doğalgaz, Pis/Temiz su, Kalörifer, Kombi-Petek, Yerden ısıtma, Hava, Yağmur suyu, Proje çizim, ECA-DemirDöküm yetkili bayi, TGaz yetkili firma).

**Etkilenen dosyalar:** `index.html`, `hizmetler.html`, `hakkimizda.html`, `projelerimiz.html`, `iletisim.html` + `dist/` kopyaları, `js/main.js`, `css/style.css`.

## 2026-10-24 — ECA/DemirDöküm Anlaşması, Yeni Hizmetler, WhatsApp-only İletişim

**Yapılan değişiklikler:**

1. **İletişim formu kaldırıldı** — ad/telefon/e-posta alanları ve kayıt zorunluluğu yok. Yerine WhatsApp-only bloğu: büyük WhatsApp ikonu + Niyazi Güven / Adem Aktepe butonları.
2. **ECA anlaşmalı** vurgusu eklendi: yeni hizmet kartı/detay bloğu "ECA Anlaşmalı Yetkili Bayi", hero rozeti, iş ortakları logosu, footer rozetleri.
3. **DemirDöküm anlaşmalı** vurgusu eklendi: footer rozetleri, sertifika öğesi, meta/JSON-LD.
4. **Yeni hizmetler** (DemirDöküm tanıtım görselinden): **Yangın Tesisatı** ve **Şofben Montajı** — index hizmet kartları + hizmetler.html detay blokları.
5. **Instagram** hesabı bağlandı: `instagram.com/intek_ticaret16` (footer sosyal ikon).
6. **Slogan** eklendi: "Isının doğru adresi." (footer + JSON-LD name).
7. **Meta/JSON-LD** güncellendi: yangın tesisatı, şofben montajı, ECA & DemirDöküm anlaşmalı.
8. **HTML doğrulama düzeltmeleri** (ölçümle tespit edildi):
   - `index.html` içindeki fazladan `</div>` kaldırıldı (önceden mevcut hataydı).
   - `dist/iletisim.html` içinde e-posta kartından kalan boş kart kabuğu kaldırıldı.
   - `hizmetler.html` ve `dist/hizmetler.html` içinde yeni blokların ECA bloğu içine gömülü olması düzeltildi (artık kardeş öğeler).
   - `dist/hizmetler.html` içindeki yinelenen "Yangın Tesisatı" bloğu kaldırıldı.

**Ölçüm:** 390px mobil görünümde `pageOverflow = 0` (yatay taşma yok), tüm sayfalarda `<div>` açma/kapama dengesi OK, her `.service-detail` bloğunda tek `<h3>`.

**Alan adı uyarısı:** `intekticaret.com` şu anda Cloudflare üzerinden `dewagg.us.com` (yabancı kumar sitesi) adresine yönlendiriliyor. DNS: `chance.ns.cloudflare.com` / `vivienne.ns.cloudflare.com`. Bu, İntek Ticaret'in içeriği DEĞİL. Cloudflare panelindeki yönlendirme kuralı kaldırılmalı.

---

## [v0.4.0] 2026-10-27 — Yayın Paketi Onarımı & Yüzen Öğe Çakışmaları

**Durum:** `dist/` yayın paketi kök kaynaktan yeniden üretildi, 3 gerçek hata düzeltildi. Yedek: `yedek_20261027/`.

### Düzeltilen Hatalar

| # | Sorun | Çözüm |
|---|---|---|
| 1 | **`dist/` paketi kök klasörün 3 sürüm gerisindeydi.** CSS/JS eskiydi: `.wa-only` stilleri yok (iletişimdeki yeşil WhatsApp ikonu 92px yerine 651px, köşesiz, renksiz çıkıyordu), `.whatsapp-btn-2` kuralı yok (Adem butonu yanlış konumda), `main.js` `PHONE_WA = 902247132000` (kaldırılmış sabit hat) | `dist/` sıfırdan üretildi: 5 HTML + `css/style.css` + `js/main.js` kökten birebir kopya, `?v=2.2` sürümü. Artık 236 KB, 11 dosya |
| 2 | **`tel:` linkleri kırıktı** — `dist/iletisim.html` içinde 2 link maskeliydi (`tel:+905****2548`), hiçbir buton arama başlatmıyordu | Gerçek numaralarla değiştirildi; tüm sitede **23 tel linki** doğrulandı (`334712548` / `363303692`) |
| 3 | **Mobil sabit çağrı çubuğu 3 butona sığmıyordu.** "Hemen Ara" + 2 WhatsApp yan yana, her biri ~%33 genişlik → metinler kırpılıyordu | Ara butonu tam genişlik üst satıra, iki WhatsApp alt satıra alındı (`flex-wrap`). Çubuk yüksekliği 68 → 125px |
| 4 | **"Yukarı çık" butonu Adem'in WhatsApp butonunun üstüne biniyordu** (masaüstü: `bottom: 92px` çakışma; mobil: `bottom: 264px` çakışma) | Masaüstü `bottom: 156px`, mobil `bottom: 280px`. Tüm yüzen öğeler artık ayrık |
| 5 | **`robots.txt`** yeni yedek klasörü ve taslak dosyaları (`_c_*`, `_o_*`, `_fa.html`) kapsamıyordu | `Disallow` satırları eklendi |

### Doğrulama (gerçek tarayıcı, CDP cihaz taklidi)
| Test | Sonuç |
|---|---|
| 5 sayfa × 4 ekran (360/390/768/1440) | **20 ölçüm, 0 sorun** |
| Yatay taşma | 0 px (tüm kombinasyonlar) |
| Yüzen öğe çakışması (to-top / 2 WhatsApp / çağrı çubuğu) | **0 çakışma** |
| `tel:` linkleri | 23/23 doğru, arama başlatır |
| WhatsApp butonları görünür | Her ekranda 2/2 |
| Kırık görsel | 0 |
| Mobil menü, akordeon, sayaç, scroll reveal | Çalışıyor |
| `<h1>` sayısı | Her sayfada 1 |
| Kök ↔ `dist/` içerik farkı | 0 (yalnızca `?v=2.2`) |

### Not
`dist/` üretimi artık elle kopyalanmıyor — kök dosyalar düzenlendikten sonra paket tek komutla yeniden üretilmeli, aksi halde canlı site eski sürümü yayınlar.

---

## [v0.5.0] 2026-10-27 — Hizmet Listesi Tamamlandı, İletişim Sadeleşti

### Hizmetler
İşletmenin yaptığı işler listesinin tamamı artık sitede:

| İstenen iş | Durum |
|---|---|
| Doğalgaz tesisatı | vardı |
| Pis su tesisatı | vardı |
| Temiz su tesisatı | vardı |
| Kalörifer hattı | vardı |
| Kombi petek satış ve montajı | vardı |
| **ECA DemirDöküm yetkili bayi** | kart başlığı "ECA Anlaşmalı Yetkili Bayi" → **"ECA & DemirDöküm Yetkili Bayi"** (DemirDöküm başlıkta yoktu — giderildi) |
| Yerden ısıtma | vardı |
| Hava tesisatı | vardı |
| Yağmur suyu iniş hattı | vardı |
| Proje çizim ve uygulama | vardı |
| **TGaz yetkili firma** | **EKLE: ana sayfa hizmet kartı (13. kart) + hizmetler.html detay bloğu (13. blok) + footer hizmet listesi** |

- Hizmetler sayfası: 12 → **13 detay bloğu**
- Ana sayfa: 12 → **13 hizmet kartı**
- Footer "Hizmetler" sütunu 5 → **11 kalem** (yukarıdaki listenin tamamı)
- Şofben Montajı kartının yinelenen `fa-hot-tub` ikonu `fa-file-signature` ile değiştirildi

### İletişim
- Yalnızca iki numara kaldı: **Niyazi Güven 0 533 471 25 48** · **Adem Aktepe 0 536 330 36 92**
- E-posta izi tamamen silindi: iletişim sayfasındaki "e-postanızı yazmanız gerekmez" ifadesi kaldırıldı, `js/main.js` içindeki `email` alanı referansları temizlendi
- Kullanılmayan `PHONE_LAND` değişkeni kaldırıldı

### Doğrulama (canlı dist, gerçek tarayıcı)
| Test | Sonuç |
|---|---|
| Hizmet başlıkları (13 blok) | İstenen 11 kalemin tamamı mevcut, eksik yok |
| `tel:` numaraları (5 sayfa) | Yalnızca `334712548` + `363303692` |
| WhatsApp numaraları (5 sayfa) | Yalnızca `905334712548` + `905363303692` |
| `0224`, `mailto:`, `@gmail`, "e-posta" metni | **0 eşleşme** |
| Yatay taşma / kırık görsel | 0 / 0 |
| Kök ↔ `dist` | Yeniden üretildi (`?v=2.2`)|

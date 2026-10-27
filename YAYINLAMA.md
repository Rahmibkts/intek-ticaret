# İntek Ticaret — Yayınlama Rehberi

Yayın paketi: `D:\İntek\dist` — 10 dosya, ~236 KB, statik site (sunucu tarafı kod yok).
Yeniden üretmek için: `cd "D:/İntek" && python araclar/dist_uret.py`

---

## Önce: alan adı sorunu (bu çözülmeden yayın anlamsız)

`intekticaret.com` şu anda bir yönlendirme zincirinin içinde. Ölçülen durum (2026-10-27):

| Kontrol | Sonuç |
|---|---|
| `https://intekticaret.com/` | `301` → `https://losmx.com/` |
| `https://losmx.com/` | `301` → `https://chickamauga160.com/` |
| `https://intekticaret.com/robots.txt` | `301` → aynı zincir |
| `https://intekticaret.com/rastgele-yol` | `301` → aynı zincir (catch-all kural) |
| DNS | Cloudflare proxy (`188.114.96.7`) |
| Nameserver | `chance.ns.cloudflare.com`, `vivienne.ns.cloudflare.com` |
| Kayıt firması | GoDaddy — bitiş **2027-03-19** |
| WHOIS durumu | clientTransfer/Renew/Update/Delete **Prohibited** (kilitli) |

**Yorum:** Her yolun aynı yere gitmesi, sunucudaki bir yönlendirme değil **Cloudflare panelindeki
catch-all Redirect Rule** demek. Yani kural Cloudflare hesabında; hesaba erişim varsa 1 dakikada silinir.

### Temizlik adımları
1. Cloudflare paneline gir → **intekticaret.com** bölgesi.
2. **Rules → Redirect Rules**: `losmx.com` / `dewagg` / `chickamauga160` hedefli tüm kuralları sil.
3. **Rules → Page Rules**: `*intekticaret.com/*` → Forwarding varsa sil.
4. **DNS → Records**: `A`/`CNAME` kayıtlarının hedefini kontrol et. Yeni hosting'in IP'si/CNAME'i yazılacak.
5. **SSL/TLS → Overview**: mod `Full (strict)` olsun.

> Hesaba giriş yapamıyorsan: alan adı **GoDaddy**'de kayıtlı ve kilitli durumda. GoDaddy hesabından
> nameserver'ları geçici olarak `ns41.domaincontrol.com` / `ns42.domaincontrol.com` yapıp Cloudflare
> bağlantısını koparabilirsin — bu, yönlendirmeyi de beraberinde keser. Sonra Cloudflare'i yeniden bağlarsın.

---

## Seçenek 1 — Cloudflare Pages (önerilen)

**Neden:** Alan adının DNS'i zaten Cloudflare'de. Ücretsiz, sınırsız trafik, otomatik HTTPS,
custom domain bağlamak 2 dakika, ek DNS işi yok. Statik site olduğu için sunucu kirası da yok.

**Kurulum:**
1. `dash.cloudflare.com` → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Proje adı: `intek-ticaret`.
3. `D:\İntek\dist` klasörünü sürükle-bırak → **Deploy**.
4. **Custom domains** → `intekticaret.com` ve `www.intekticaret.com` ekle. DNS kayıtları otomatik oluşur.
5. Yönlendirme kuralını sildiysen site anında canlı.

**Terminalden (alternatif):**
```bash
cd "D:/İntek"
npx wrangler pages deploy dist --project-name=intek-ticaret
```
İlk çalıştırmada `npx wrangler login` tarayıcı açar, Cloudflare hesabına giriş ister.

**Artı:** Her yeni `dist` üretiminde tek komutla güncelleme. GitHub'a bağlarsan push → otomatik yayın.

---

## Seçenek 2 — Klasik Türk hosting (cPanel / FTP)

**Neden:** Müşteri " hostingim var" diyorsa veya e-posta hesapları da aynı yerde olacaksa.
**Maliyet:** Yıllık ~500–1.500 TL (Natro, Turhost, Hostinger, Güzel Hosting).

1. Hosting panelinden FTP bilgilerini al (`ftp.guzelhosting.com`, kullanıcı, şifre).
2. `dist` içeriğini `public_html/` (bazı panellerde `httpdocs/`) klasörüne yükle — **klasörün kendisini değil, içindekileri**.
3. SSL: cPanel → **Let's Encrypt SSL** → `intekticaret.com` için kur.
4. Cloudflare DNS'te `A` kaydını hosting IP'sine çevir, proxy'yi (turuncu bulut) açık bırak.
5. `.htaccess` ile `www` → kök yönlendirmesi ve HTTPS zorlaması ekle.

**FTP ile tek komut yükleme (lftp kuruluysa):**
```bash
lftp -u KULLANICI,SIFRE ftp://ftp.ornek.com -e "mirror -R --delete D:/İntek/dist /public_html; bye"
```

---

## Seçenek 3 — Netlify Drop (en hızlı deneme)

Hesap açmadan test linki almak için: `app.netlify.com/drop` → `dist` klasörünü sürükle.
Anında `rastgele-ad.netlify.app` linki verir. Müşteriye "şu an böyle görünecek" demek için ideal,
kalıcı yayın için Cloudflare Pages daha iyi.

---

## Yayın sonrası kontrol listesi

- [ ] `https://intekticaret.com/` açılıyor, kumar sitesine gitmiyor
- [ ] `http://` otomatik `https://`'e dönüyor
- [ ] `www.intekticaret.com` kök adrese yönleniyor
- [ ] `https://intekticaret.com/robots.txt` ve `/sitemap.xml` erişilebilir
- [ ] Mobilde iki WhatsApp butonu ve "Ara" çubuğu çalışıyor
- [ ] Tüm `tel:` linkleri doğru numarayı arıyor
- [ ] Google Search Console → site ekle → `sitemap.xml` gönder
- [ ] Google Business Profile'da İnegöl adresi + telefonlar güncel

## Notlar

- Site tamamen statik: PHP, veritabanı, e-posta sunucusu gerekmiyor. En ucuz seçenek yeterli.
- `dist_uret.py` her çalıştığında port 8811'i kapatır (yerel test sunucusu kilidi).
- Yayın paketine **mp4 videolar, `yedek_*` klasörleri, `_c_`/`_o_`/`_fa.html` dosyaları dahil değil** — bunlar kaynak klasörde kalır.

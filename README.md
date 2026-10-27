# İntek Ticaret — statik site (Cloudflare Pages)

İnegöl / Bursa doğalgaz, su tesisatı, kombi-petek ve yerden ısıtma hizmetleri için statik site.
Sunucu tarafı kod yok: HTML + CSS + vanilla JS. Cloudflare Pages üzerinde yayınlanır.

## Canlı

- Üretim: https://intek-ticaret.pages.dev
- Repo: https://github.com/Rahmibkts/intek-ticaret

## Klasör yapısı

| Yol | İçerik |
|---|---|
| `*.html` | Sayfa kaynakları (kök) — `dist` buradan üretilir |
| `css/`, `js/`, `images/`, `favicon.svg` | Varlıklar |
| `araclar/dist_uret.py` | `dist/` yayın paketini üretir |
| `dist/` | **Yayınlanan klasör** — Cloudflare Pages bunu kök dizin olarak kullanır |
| `yedek_*`, `ekran-goruntuleri/` | Yerel arşiv, repoya dahil değil |

## Yayın akışı

```bash
cd "D:/İntek"
python araclar/dist_uret.py          # dist/ yeniden üretilir
git add -A && git commit -m "..."     # değişiklikleri kaydet
git push origin main                  # Cloudflare Pages otomatik yayınlar
```

Manuel yayın (git'siz, hızlı test):

```bash
npx wrangler pages deploy dist --project-name=intek-ticaret --branch=main
```

## Notlar

- `dist/` klasörü repoya dahildir; Cloudflare Pages build komutu boş, çıktı dizini `dist`.
- `.html` uzantılı adresler Cloudflare tarafından uzantısız adrese `308` ile yönlendirilir — normal davranış.
- Yayın paketine mp4 videolar, `yedek_*` ve `_c_`/`_o_`/`_fa.html` çalışma dosyaları girmez.
- Değişiklik geçmişi: `DEGISIKLIK_GUNLUGU.md`

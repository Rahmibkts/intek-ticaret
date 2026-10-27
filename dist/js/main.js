/* ============================================================
   İNTEK TİCARET — Main JavaScript
   Kalite • Güven • Konfor
   v2.0 — tüm bileşenler + form doğrulama + erişilebilirlik
   ============================================================ */

(function () {
  'use strict';

  /* JS çalışıyor — CSS'teki .no-js güvencesini kapat.
     (JS hiç çalışmazsa .no-js kalır ve içerik görünür olur) */
  document.documentElement.classList.remove('no-js');

  /* Sabitler — tek yerden yönetilir */
  var PHONE_M1   = '905334712548';   /* Niyazi Güven — 0 533 471 25 48 */
  var PHONE_M2   = '905363303692';   /* Adem Aktepe  — 0 536 330 36 92 */
  var PHONE_WA   = '905334712548';   /* WhatsApp (Niyazi Güven) */
  var WA_TEXT = "Merhaba, İntek Ticaret'ten bilgi almak istiyorum.";

  function waLink(text) {
    return 'https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(text || WA_TEXT);
  }

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 1. Mobil menü ---------- */
    var hamburger = document.querySelector('.hamburger');
    var nav = document.querySelector('.nav');
    var backdrop = document.querySelector('.nav-backdrop');

    function closeNav() {
      if (!nav || !hamburger) return;
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      if (backdrop) backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    function openNav() {
      if (!nav || !hamburger) return;
      nav.classList.add('open');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      if (backdrop) backdrop.classList.add('open');
      /* Menü açıkken arka plandaki sayfa kaydırmayı durdur */
      document.body.style.overflow = 'hidden';
    }

    if (hamburger && nav) {
      hamburger.addEventListener('click', function () {
        if (nav.classList.contains('open')) closeNav();
        else openNav();
      });

      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeNav);
      });

      if (backdrop) backdrop.addEventListener('click', closeNav);

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
      });
    }

    /* ---------- 2. Header scroll efekti ---------- */
    var header = document.querySelector('.header');
    var lastY = 0;
    /* toTop burada tanımlanıyor — scroll handler'ı yukarıda değil,
       aşağıda kayıtlı olması hoisting'e bağlı kalmaya bırakmaz. */
    var toTop = document.querySelector('.to-top');

    if (header) {
      window.addEventListener('scroll', function () {
        var y = window.scrollY || window.pageYOffset;

        if (y > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');

        /* Aşağı kaydırırken gizle, yukarı kaydırırken göster
           (mobil menü açıkken gizleme) */
        if (nav && !nav.classList.contains('open')) {
          if (y > 300 && y > lastY) header.classList.add('hidden');
          else header.classList.remove('hidden');
        }
        lastY = y;

        /* Yukarı çık butonu */
        if (toTop) {
          if (y > 500) toTop.classList.add('show');
          else toTop.classList.remove('show');
        }
      }, { passive: true });
    }

    /* ---------- 3. Yukarı çık butonu ---------- */
    if (toTop) {
      toTop.addEventListener('click', function () {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      });
    }

    /* ---------- 4. Mobil sabit çağrı çubuğu ---------- */
    if (document.querySelector('.call-bar')) {
      document.body.classList.add('has-call-bar');
    }

    /* ---------- 5. Scroll animasyonları ---------- */
    var fadeElements = document.querySelectorAll('.fade-up');
    if (fadeElements.length) {
      if (!('IntersectionObserver' in window)) {
        fadeElements.forEach(function (el) { el.classList.add('visible'); });
      } else {
        var observer = new IntersectionObserver(function (entries) {
          observerAlive = true;
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        fadeElements.forEach(function (el) { observer.observe(el); });

        /* Observer'a ek güvence: scroll/resize'da viewport içindekileri aç */
        function revealVisible() {
          fadeElements.forEach(function (el) {
            if (el.classList.contains('visible')) return;
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight - 30 && r.bottom > 0) {
              el.classList.add('visible');
              observer.unobserve(el);
            }
          });
        }
        window.addEventListener('scroll', revealVisible, { passive: true });
        window.addEventListener('resize', revealVisible, { passive: true });
        revealVisible();

        /* Güvenlik ağı: IntersectionObserver gerçekten çalışmıyorsa (callback
           hiç tetiklenmediyse) tüm içeriği aç. Observer sağlıklıysa bu dal
           devreye girmez; böylece aşağıdaki bölümler scroll'da animasyonla
           açılmaya devam eder. */
        var observerAlive = false;
        setTimeout(function () {
          if (!observerAlive) {
            fadeElements.forEach(function (el) { el.classList.add('visible'); });
          }
        }, 2000);
      }
    }

    /* ---------- 6. Proje filtreleri ---------- */
    var filterTabs = document.querySelectorAll('.filter-tab');
    var projectCards = document.querySelectorAll('.project-card');

    if (filterTabs.length) {
      filterTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          filterTabs.forEach(function (t) {
            t.classList.remove('active');
            t.setAttribute('aria-pressed', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-pressed', 'true');

          var filter = tab.dataset.filter;

          projectCards.forEach(function (card) {
            var show = (filter === 'all' || card.dataset.category === filter);
            if (show) {
              card.classList.remove('hide');
              card.style.display = '';
              requestAnimationFrame(function () {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px)';
              setTimeout(function () { card.classList.add('hide'); }, 250);
            }
          });
        });
      });
    }

    /* ---------- 7. Öncesi / Sonrası kaydırıcı ---------- */
    document.querySelectorAll('.before-after-slider').forEach(function (slider) {
      var divider = slider.querySelector('.ba-divider');
      var afterLayer = slider.querySelector('.ba-after');
      if (!divider || !afterLayer) return;

      var isDragging = false;

      function updateSlider(clientX) {
        var rect = slider.getBoundingClientRect();
        if (!rect.width) return;
        var pos = ((clientX - rect.left) / rect.width) * 100;
        pos = Math.max(2, Math.min(98, pos));
        divider.style.left = pos + '%';
        afterLayer.style.clipPath = 'inset(0 0 0 ' + pos + '%)';
        divider.setAttribute('aria-valuenow', Math.round(pos));
      }

      divider.addEventListener('mousedown', function (e) { isDragging = true; e.preventDefault(); });
      divider.addEventListener('touchstart', function () { isDragging = true; }, { passive: true });

      window.addEventListener('mousemove', function (e) {
        if (isDragging) updateSlider(e.clientX);
      });
      window.addEventListener('touchmove', function (e) {
        if (isDragging && e.touches[0]) updateSlider(e.touches[0].clientX);
      }, { passive: true });

      window.addEventListener('mouseup', function () { isDragging = false; });
      window.addEventListener('touchend', function () { isDragging = false; });

      slider.addEventListener('click', function (e) {
        if (e.target !== divider) updateSlider(e.clientX);
      });

      /* Klavye erişilebilirliği */
      divider.addEventListener('keydown', function (e) {
        var rect = slider.getBoundingClientRect();
        var current = parseFloat(divider.style.left) || 50;
        if (e.key === 'ArrowLeft') { updateSlider(rect.left + rect.width * ((current - 4) / 100)); e.preventDefault(); }
        if (e.key === 'ArrowRight') { updateSlider(rect.left + rect.width * ((current + 4) / 100)); e.preventDefault(); }
      });
    });

    /* ---------- 8. Sayaç animasyonu ---------- */
    var statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length) {
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function runCounter(el) {
        var countTo = parseInt(el.dataset.count, 10) || 0;
        var suffix = el.dataset.suffix || '';

        if (reduceMotion) {
          el.textContent = countTo + suffix;
          return;
        }

        var duration = 1400;
        var start = null;

        function step(ts) {
          if (start === null) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          /* easeOutCubic */
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * countTo) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = countTo + suffix;
        }
        requestAnimationFrame(step);
      }

      if (!('IntersectionObserver' in window)) {
        statNumbers.forEach(runCounter);
      } else {
        var counterObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.4 });

        statNumbers.forEach(function (el) { counterObserver.observe(el); });
      }
    }

    /* ---------- 9. SSS akordeonu ---------- */
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      var panel = item.querySelector('.faq-a');
      if (!btn || !panel) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        /* Aynı gruptaki diğerlerini kapat */
        var list = item.parentElement;
        if (list) {
          list.querySelectorAll('.faq-item.open').forEach(function (other) {
            if (other !== item) {
              other.classList.remove('open');
              var ob = other.querySelector('.faq-q');
              var op = other.querySelector('.faq-a');
              if (ob) ob.setAttribute('aria-expanded', 'false');
              if (op) op.style.maxHeight = null;
            }
          });
        }

        if (isOpen) {
          item.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });

    /* Pencere yeniden boyutlandığında açık panel sığmayı bırakabilir */
    window.addEventListener('resize', function () {
      faqItems.forEach(function (item) {
        if (!item.classList.contains('open')) return;
        var panel = item.querySelector('.faq-a');
        if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
      });
    });

    /* ---------- 10. Bildirim sistemi ---------- */
    function showNotification(text, type) {
      var existing = document.querySelector('.notification');
      if (existing) existing.remove();

      var el = document.createElement('div');
      el.className = 'notification ' + (type === 'error' ? 'error' : type === 'info' ? 'info' : 'success');
      el.setAttribute('role', type === 'error' ? 'alert' : 'status');

      var span = document.createElement('span');
      span.textContent = text;

      var close = document.createElement('button');
      close.type = 'button';
      close.setAttribute('aria-label', 'Bildirimi kapat');
      close.textContent = '✕';
      close.addEventListener('click', function () { el.remove(); });

      el.appendChild(span);
      el.appendChild(close);
      document.body.appendChild(el);

      setTimeout(function () {
        el.classList.add('leaving');
        setTimeout(function () { el.remove(); }, 320);
      }, 5000);
    }

    /* ---------- 11. İletişim formu (doğrulama + WhatsApp gönderimi) ---------- */
    var contactForm = document.querySelector('#contact-form');

    if (contactForm) {
      var statusBox = document.querySelector('#form-status');

      function setStatus(message, ok) {
        if (!statusBox) return;
        statusBox.textContent = message;
        statusBox.className = 'form-status show ' + (ok ? 'ok' : 'err');
      }

      function clearStatus() {
        if (!statusBox) return;
        statusBox.className = 'form-status';
        statusBox.textContent = '';
      }

      function fieldError(name, show) {
        var input = contactForm.querySelector('[name="' + name + '"]');
        var err = contactForm.querySelector('.field-error[data-for="' + name + '"]');
        if (input) input.classList.toggle('invalid', !!show);
        if (err) err.classList.toggle('show', !!show);
      }

      function digitsOnly(value) {
        return (value || '').replace(/\D/g, '');
      }

      function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }

      /* Kullanıcı yazmaya başlayınca hatayı kaldır */
      contactForm.querySelectorAll('input, textarea, select').forEach(function (el) {
        el.addEventListener('input', function () {
          if (el.name) fieldError(el.name, false);
        });
      });

      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearStatus();

        /* Bot tuzağı */
        var honey = contactForm.querySelector('[name="website"]');
        if (honey && honey.value) return;

        var data = new FormData(contactForm);
        var name = (data.get('name') || '').trim();
        var phone = (data.get('phone') || '').trim();
        var email = (data.get('email') || '').trim();
        var service = (data.get('service') || '').trim();
        var message = (data.get('message') || '').trim();

        var errors = [];

        if (name.length < 3) { fieldError('name', true); errors.push('name'); }
        if (digitsOnly(phone).length < 10) { fieldError('phone', true); errors.push('phone'); }
        if (email && !isValidEmail(email)) { fieldError('email', true); errors.push('email'); }
        if (message.length < 10) { fieldError('message', true); errors.push('message'); }

        if (errors.length) {
          setStatus('Lütfen işaretli alanları kontrol edin.', false);
          var firstBad = contactForm.querySelector('.invalid');
          if (firstBad) firstBad.focus();
          return;
        }

        /* Backend olmadığı için mesaj WhatsApp'a aktarılır */
        var lines = [
          'Merhaba, web sitesi iletişim formundan yazıyorum.',
          '',
          'Ad Soyad: ' + name,
          'Telefon: ' + phone
        ];
        if (email) lines.push('E-posta: ' + email);
        if (service) lines.push('Hizmet: ' + service);
        lines.push('', 'Mesaj:', message);

        var url = waLink(lines.join('\n'));

        setStatus('Mesajınız WhatsApp üzerinden iletiliyor. Açılan pencereden gönderimi tamamlayın.', true);

        var win = window.open(url, '_blank', 'noopener');
        if (!win) {
          /* Popup engellendiyse kullanıcıya link ver.
             Önceki denemelerde eklenmiş yedek linki kaldır — her gönderimde
             birikebilir. */
          var old = contactForm.querySelector('.fallback-wa');
          if (old) old.remove();

          setStatus('Tarayıcı yeni pencereyi engelledi. Aşağıdaki WhatsApp bağlantısını kullanabilirsiniz.', false);
          var fallback = document.createElement('a');
          fallback.href = url;
          fallback.target = '_blank';
          fallback.rel = 'noopener';
          fallback.className = 'btn btn-whatsapp btn-block fallback-wa';
          fallback.style.marginTop = '12px';
          fallback.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp\'ta aç';
          contactForm.appendChild(fallback);
          fallback.focus();
        } else {
          showNotification('WhatsApp penceresi açıldı. Gönderimi orada tamamlayın.', 'success');
          contactForm.reset();
        }
      });
    }

    /* ---------- 13. Lightbox (proje galerisi) ---------- */
    /* .project-card CSS'te cursor:pointer ve büyüteç ikonu ile
       "tıklanabilir" görünüyor ama hiçbir işleyicisi yoktu. */
    var projectCardsAll = Array.prototype.slice.call(document.querySelectorAll('.project-card'));

    if (projectCardsAll.length) {
      var lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Proje görseli');
      lightbox.setAttribute('hidden', '');
      lightbox.innerHTML =
        '<button class="lb-close" type="button" aria-label="Kapat">&times;</button>' +
        '<button class="lb-nav lb-prev" type="button" aria-label="Önceki proje">&#8249;</button>' +
        '<div class="lb-body">' +
          '<div class="lb-text" hidden>' +
            '<span class="project-tag"></span>' +
            '<h3></h3>' +
            '<p></p>' +
          '</div>' +
        '</div>' +
        '<button class="lb-nav lb-next" type="button" aria-label="Sonraki proje">&#8250;</button>' +
        '<div class="lightbox-caption" role="status" aria-live="polite"></div>';
      document.body.appendChild(lightbox);

      var lbBody = lightbox.querySelector('.lb-body');
      var lbImg = null;               /* gerçek fotoğraf yüklenene kadar <img> yok */
      var lbText = lightbox.querySelector('.lb-text');
      var lbIconBox = document.createElement('div');
      lbIconBox.className = 'lb-icon';
      lbBody.insertBefore(lbIconBox, lbText);
      var lbCaption = lightbox.querySelector('.lightbox-caption');
      var lbIndex = 0;
      var lastFocused = null;

      function renderLb() {
        var card = projectCardsAll[lbIndex];
        var icon = card.querySelector('.project-image i');
        var title = card.querySelector('h3');
        var tag = card.querySelector('.project-tag');
        var desc = card.querySelector('.project-info p');

        /* Gerçek fotoğraf yoksa büyük ikon + metin göster, varsa görseli göster */
        var realImage = card.querySelector('.project-image img');
        if (realImage) {
          if (!lbImg) {
            lbImg = document.createElement('img');
            lbBody.insertBefore(lbImg, lbBody.firstChild);
          }
          lbImg.src = realImage.src;
          lbImg.alt = realImage.alt || (title ? title.textContent : 'Proje görseli');
          lbImg.style.display = '';
          lbIconBox.hidden = true;
          lbText.hidden = true;
        } else {
          if (lbImg) { lbImg.removeAttribute('src'); lbImg.style.display = 'none'; }
          lbIconBox.hidden = false;
          lbIconBox.innerHTML = icon ? icon.outerHTML.replace('<i ', '<i aria-hidden="true" ') : '';
          lbText.hidden = false;
          if (tag) lbText.querySelector('.project-tag').textContent = tag.textContent;
          if (title) lbText.querySelector('h3').textContent = title.textContent;
          if (desc) lbText.querySelector('p').textContent = desc.textContent;
        }

        lbCaption.textContent =
          (tag ? tag.textContent + ' — ' : '') + (title ? title.textContent : '') +
          ' (' + (lbIndex + 1) + '/' + projectCardsAll.length + ')';
      }

      function openLb(card) {
        lbIndex = projectCardsAll.indexOf(card);
        if (lbIndex < 0) lbIndex = 0;
        lastFocused = document.activeElement;
        renderLb();
        lightbox.removeAttribute('hidden');
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('.lb-close').focus();
      }

      function closeLb() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('hidden', '');
        document.body.style.overflow = '';
        if (lastFocused && lastFocused.focus) lastFocused.focus();
      }

      function stepLb(delta) {
        lbIndex = (lbIndex + delta + projectCardsAll.length) % projectCardsAll.length;
        renderLb();
      }

      projectCardsAll.forEach(function (card) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label',
          'Projeyi büyüt: ' + (card.querySelector('h3') ? card.querySelector('h3').textContent : ''));

        card.addEventListener('click', function () { openLb(card); });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(card); }
        });
      });

      lightbox.querySelector('.lb-close').addEventListener('click', closeLb);
      lightbox.querySelector('.lb-prev').addEventListener('click', function () { stepLb(-1); });
      lightbox.querySelector('.lb-next').addEventListener('click', function () { stepLb(1); });

      /* Arka plana tıklayınca kapat */
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLb();
      });

      lightbox.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') stepLb(-1);
        if (e.key === 'ArrowRight') stepLb(1);
      });
    }

    /* ---------- 14. Anchor yumuşak kaydırma ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });

  });
})();

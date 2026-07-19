document.addEventListener('DOMContentLoaded', function() {

    var nav = document.querySelector('.site-nav');
    if (nav) {
        var onScroll = function() {
            if (window.scrollY > 40) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };
        window.addEventListener('scroll', onScroll);
        onScroll();
    }

    var burger = document.querySelector('.burger');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (burger && mobileMenu) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('a').forEach(function(a) {
            a.addEventListener('click', function() {
                burger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    var current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function(a) {
        var href = a.getAttribute('href');
        if (href === current || (current === '' && href === 'index.html')) {
            a.classList.add('active');
        }
    });

    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        reveals.forEach(function(el) { io.observe(el); });
    } else {
        reveals.forEach(function(el) { el.classList.add('is-visible'); });
    }

    document.querySelectorAll('.project-media').forEach(function(block) {
        var stage = block.querySelector('.media-stage');
        var video = block.querySelector('video');
        var playBtn = block.querySelector('.media-play');
        var mainImg = block.querySelector('.media-main-img');
        var thumbs = block.querySelectorAll('.thumb-row img');

        if (video && playBtn) {
            playBtn.addEventListener('click', function() {
                video.style.display = 'block';
                if (mainImg) mainImg.style.display = 'none';
                video.currentTime = 0;
                video.play();
                playBtn.classList.add('hidden');
            });
            video.addEventListener('pause', function() {
                if (video.currentTime === 0 || video.ended) playBtn.classList.remove('hidden');
            });
            video.addEventListener('click', function() {
                video.pause();
                playBtn.classList.remove('hidden');
            });
        }

        thumbs.forEach(function(thumb) {
            thumb.addEventListener('click', function() {
                thumbs.forEach(function(t) { t.classList.remove('active'); });
                thumb.classList.add('active');
                if (video) {
                    video.pause();
                    video.style.display = 'none';
                }
                if (playBtn) playBtn.classList.add('hidden');
                if (mainImg) {
                    mainImg.src = thumb.getAttribute('data-full') || thumb.src;
                    mainImg.style.display = 'block';
                }
                openLightboxGallery(block, thumb);
            });
        });
    });

    var lightbox = document.querySelector('.lightbox');
    var lbImg = lightbox ? lightbox.querySelector('img') : null;
    var lbGallery = [];
    var lbIndex = 0;

    function openLightboxGallery(block, clickedThumb) {
        if (!lightbox) return;
        lbGallery = Array.prototype.map.call(block.querySelectorAll('.thumb-row img'), function(t) {
            return t.getAttribute('data-full') || t.src;
        });
        lbIndex = Array.prototype.indexOf.call(block.querySelectorAll('.thumb-row img'), clickedThumb);
        showLightbox();
    }

    function showLightbox() {
        if (!lbImg || !lbGallery.length) return;
        lbImg.src = lbGallery[lbIndex];
        lightbox.classList.add('open');
    }

    if (lightbox) {
        var closeBtn = lightbox.querySelector('.lightbox-close');
        var prevBtn = lightbox.querySelector('.prev');
        var nextBtn = lightbox.querySelector('.next');
        if (closeBtn) closeBtn.addEventListener('click', function() { lightbox.classList.remove('open'); });
        lightbox.addEventListener('click', function(e) { if (e.target === lightbox) lightbox.classList.remove('open'); });
        if (prevBtn) prevBtn.addEventListener('click', function() {
            lbIndex = (lbIndex - 1 + lbGallery.length) % lbGallery.length;
            showLightbox();
        });
        if (nextBtn) nextBtn.addEventListener('click', function() {
            lbIndex = (lbIndex + 1) % lbGallery.length;
            showLightbox();
        });
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') lightbox.classList.remove('open');
            if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
            if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();

        });

    }

    var heroFrameEl = document.getElementById('heroFrame');
    var tiltPhoto = document.getElementById('tiltPhoto');
    if (heroFrameEl && window.matchMedia('(pointer:fine)').matches) {
        heroFrameEl.addEventListener('mousemove', function(e) {
            var r = heroFrameEl.getBoundingClientRect();
            var px = ((e.clientX - r.left) / r.width) * 100;
            var py = ((e.clientY - r.top) / r.height) * 100;
            heroFrameEl.style.setProperty('--mx', px + '%');
            heroFrameEl.style.setProperty('--my', py + '%');
            if (tiltPhoto) {
                var cx = r.left + r.width / 2,
                    cy = r.top + r.height / 2;
                var dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 2)));
                var dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 2)));
                tiltPhoto.style.transform = 'translate(-50%,-50%) rotateY(' + (dx * 10) + 'deg) rotateX(' + (dy * -10) + 'deg)';
            }
        });
        heroFrameEl.addEventListener('mouseleave', function() {
            heroFrameEl.style.setProperty('--mx', '50%');
            heroFrameEl.style.setProperty('--my', '50%');
            if (tiltPhoto) tiltPhoto.style.transform = 'translate(-50%,-50%) rotateY(0) rotateX(0)';
        });
    }

    var contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = contactForm.querySelector('#cf-name').value.trim();
            var email = contactForm.querySelector('#cf-email').value.trim();
            var message = contactForm.querySelector('#cf-message').value.trim();
            var msgEl = contactForm.querySelector('.form-msg');

            if (!name || !email || !message) {
                if (msgEl) msgEl.textContent = 'Please fill in all fields.';
                return;
            }

            var text = 'Hi Abdullah, my name is ' + name + ' (' + email + ').\n\n' + message;
            var url = 'https://wa.me/923330480775?text=' + encodeURIComponent(text);
            if (msgEl) msgEl.textContent = 'Opening WhatsApp with your message...';
            window.open(url, '_blank');
            contactForm.reset();
        });
    }

    function fitHeroGiant() {
        var el = document.getElementById('heroGiant');
        if (!el) return;
        var container = el.closest('.hero-title-wrap');
        el.style.transform = 'scale(1)';
        var targetWidth = container.clientWidth * 0.96; // 96% of frame width
        var textWidth = el.getBoundingClientRect().width;
        var scale = targetWidth / textWidth;
        el.style.transform = 'scale(' + scale + ')';
    }
    window.addEventListener('load', fitHeroGiant);
    window.addEventListener('resize', fitHeroGiant);

});
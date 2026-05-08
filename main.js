/* ============================================
   MAIN.JS — Navigation, Animations, i18n & Easter Eggs
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const nav = document.getElementById('main-nav');

    // Mobile navigation toggle
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            toggle.classList.toggle('open');
        });

        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.classList.remove('open');
            });
        });
    }

    // Navbar background on scroll
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Intersection Observer for fade-in animations
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        fadeEls.forEach(el => observer.observe(el));
    }

    // Init language from localStorage
    const savedLang = localStorage.getItem('portfolio-lang') || 'sv';
    applyLang(savedLang);
});

// ============================================
// Language Switcher (SV / EN)
// ============================================
function setLang(lang) {
    localStorage.setItem('portfolio-lang', lang);
    applyLang(lang);
}

function applyLang(lang) {
    // Update html lang attribute
    document.documentElement.lang = lang;

    // Swap text on all elements with data-sv / data-en
    document.querySelectorAll('[data-sv][data-en]').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text !== null) {
            // Use innerHTML to support &amp; entities in the attributes
            el.innerHTML = text;
        }
    });

    // Update active lang button
    const svBtn = document.getElementById('lang-sv');
    const enBtn = document.getElementById('lang-en');
    if (svBtn && enBtn) {
        svBtn.classList.toggle('active', lang === 'sv');
        enBtn.classList.toggle('active', lang === 'en');
    }
}

// ============================================
// Copy code to clipboard
// ============================================
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code');
    const text = code.innerText;

    navigator.clipboard.writeText(text).then(() => {
        const original = button.textContent;
        button.textContent = '✓ Kopierad!';
        button.classList.add('copied');
        setTimeout(() => {
            button.textContent = original;
            button.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        button.textContent = '✓ Kopierad!';
        setTimeout(() => { button.textContent = 'Kopiera'; }, 2000);
    });
}

// ============================================
// Konami Code Easter Egg: ↑↑↓↓←→←→BA
// ============================================
(function () {
    const KONAMI = [
        'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
        'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
        'b','a'
    ];
    let idx = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === KONAMI[idx]) {
            idx++;
            if (idx === KONAMI.length) {
                idx = 0;
                triggerKonami();
            }
        } else {
            idx = 0;
        }
    });

    function triggerKonami() {
        const overlay = document.getElementById('konami-overlay');
        const pixelsEl = document.getElementById('konami-pixels');
        if (!overlay) return;

        // Generate pixel art sprite using divs
        if (pixelsEl) {
            pixelsEl.innerHTML = '';
            const sprite = [
                '  XXXXX  ',
                ' XXXXXXX ',
                ' X O O X ',
                ' XXXXXXX ',
                '  X X X  ',
                ' X     X ',
            ];
            sprite.forEach(row => {
                const rowEl = document.createElement('div');
                rowEl.className = 'pixel-row';
                [...row].forEach(ch => {
                    const px = document.createElement('span');
                    px.className = 'pixel' + (ch === 'X' ? ' pixel-on' : ch === 'O' ? ' pixel-eye' : '');
                    rowEl.appendChild(px);
                });
                pixelsEl.appendChild(rowEl);
            });
        }

        overlay.classList.add('active');

        // Toggle colour scheme for fun
        document.documentElement.style.setProperty('--color-accent', '#F59E0B');
        document.documentElement.style.setProperty('--color-accent-glow', 'rgba(245,158,11,0.25)');

        setTimeout(() => {
            overlay.classList.remove('active');
            // Reset colours after 6 s
            setTimeout(() => {
                document.documentElement.style.removeProperty('--color-accent');
                document.documentElement.style.removeProperty('--color-accent-glow');
            }, 3000);
        }, 3000);
    }
})();

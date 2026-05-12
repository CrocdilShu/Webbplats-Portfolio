/* ============================================
   MAIN.JS — Navigation, Animations, i18n & Bubbles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    const nav    = document.getElementById('main-nav');

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

    // Intersection Observer — fade-in animations
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

    // Generate hero bubbles
    spawnBubbles();
});

// ============================================
// Language Switcher (SV / EN)
// ============================================
function setLang(lang) {
    localStorage.setItem('portfolio-lang', lang);
    applyLang(lang);
}

function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-sv][data-en]').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text !== null) el.innerHTML = text;
    });
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
    // Support both old .code-block wrapper and new .code-details dropdown
    const container = button.closest('.code-details') || button.closest('.code-block');
    // If inside details, make sure it's open so we can read the code
    if (container && container.tagName === 'DETAILS' && !container.open) {
        container.open = true;
    }
    const code = container.querySelector('code');
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
// Bubble water effect — hero section
// ============================================
function spawnBubbles() {
    const field = document.getElementById('bubble-field');
    if (!field) return;

    const COUNT = 22;

    for (let i = 0; i < COUNT; i++) {
        createBubble(field, i * (14000 / COUNT));
    }
}

function createBubble(container, initialDelay) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size    = rand(14, 56);          // px diameter
    const left    = rand(2, 96);           // % from left
    const dur     = rand(7, 16);           // seconds to rise
    const delay   = initialDelay / 1000;  // seconds (stagger on first load)
    const drift   = (Math.random() > 0.5 ? 1 : -1) * rand(20, 70); // px horizontal drift

    bubble.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        --dur: ${dur}s;
        --delay: ${delay}s;
        --drift: ${drift}px;
        bottom: -${size + 20}px;
    `;

    container.appendChild(bubble);

    // After first (staggered) run, re-spawn with random delay for looping variety
    bubble.addEventListener('animationiteration', () => {
        bubble.style.setProperty('--delay', '0s');
        // Re-randomise position each loop
        bubble.style.left = rand(2, 96) + '%';
        bubble.style.width  = rand(14, 56) + 'px';
        bubble.style.height = bubble.style.width;
        const newDrift = (Math.random() > 0.5 ? 1 : -1) * rand(20, 70);
        bubble.style.setProperty('--drift', newDrift + 'px');
        bubble.style.setProperty('--dur', rand(7, 16) + 's');
    });
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

document.addEventListener('DOMContentLoaded', () => {

    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('active');
        });
    });



    const langLinks = document.querySelectorAll('.lang-link');
    const defaultLang = 'ru';
    const supportedLangs = ['ru', 'en', 'cs', 'uk'];

    function getPreferredLanguage() {
        const savedLang = localStorage.getItem('selectedLanguage');
        if (savedLang && supportedLangs.includes(savedLang)) {
            return savedLang;
        }
        const browserLang = navigator.language.slice(0, 2);
        return supportedLangs.includes(browserLang) ? browserLang : defaultLang;
    }

    async function loadTranslations(lang) {
        try {
            const response = await fetch(`i18n/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Could not load translations for ${lang}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            return null;
        }
    }

    function applyTranslations(translations) {
        if (!translations) return;

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = getNestedTranslation(translations, key);
            if (translation) {
                el.innerHTML = translation;
            }
        });

        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = getNestedTranslation(translations, key);
            if (translation) {
                el.placeholder = translation;
            }
        });
    }

    function getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null;
        }, obj);
    }

    async function setLanguage(lang) {
        const translations = await loadTranslations(lang);
        if (translations) {
            applyTranslations(translations);
            localStorage.setItem('selectedLanguage', lang);
            document.documentElement.lang = lang;
            updateActiveLangLink(lang);
        }
    }

    function updateActiveLangLink(lang) {
        langLinks.forEach(link => {
            if (link.textContent.toLowerCase() === lang.toLowerCase() ||
                (lang === 'uk' && link.textContent.toLowerCase() === 'ua')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }


    const initialLang = getPreferredLanguage();
    setLanguage(initialLang);


    langLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const langText = link.textContent.toLowerCase();
            const lang = langText === 'ua' ? 'uk' : langText;
            setLanguage(lang);
        });
    });


    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reveal on scroll
    const revealItems = document.querySelectorAll('.reveal-on-scroll');

    if (prefersReducedMotion) {
        revealItems.forEach((el) => el.classList.add('is-visible'));
    } else {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        revealItems.forEach((el) => observer.observe(el));
    }

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                nav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        });
    }

    // Highlight active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a:not(.nav-cta)').forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

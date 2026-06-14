document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tabs         = Array.from(document.querySelectorAll('.service-tab'));
    const spotlight    = { title: document.getElementById('spotlight-title'), description: document.getElementById('spotlight-description'), points: document.getElementById('spotlight-points') };
    const explorer     = { title: document.getElementById('explorer-title'),  description: document.getElementById('explorer-description'),  points: document.getElementById('explorer-points') };
    const counters     = Array.from(document.querySelectorAll('.counter'));
    const testimonials = Array.from(document.querySelectorAll('[data-testimonial]'));
    const dots         = Array.from(document.querySelectorAll('.t-dot'));
    const prevBtn      = document.querySelector('[data-testimonial-prev]');
    const nextBtn      = document.querySelector('[data-testimonial-next]');

    // — COUNTER ANIMATION —
    const animateCounters = () => {
        counters.forEach((counter) => {
            const target   = Number(counter.dataset.target || 0);
            const duration = 1400;
            const start    = performance.now();

            const update = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased    = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target).toString();
                if (progress < 1) requestAnimationFrame(update);
                else counter.textContent = target.toString();
            };

            requestAnimationFrame(update);
        });
    };

    if (counters.length) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        counterObserver.disconnect();
                    }
                });
            },
            { threshold: 0.4 }
        );
        counterObserver.observe(counters[0]);
    }

    // — TAB SYSTEM —
    if (!tabs.length) return;

    const fillPoints = (listEl, values) => {
        if (!listEl) return;
        listEl.innerHTML = '';
        values.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            listEl.appendChild(li);
        });
    };

    const renderTab = (tab) => {
        tabs.forEach((t) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');

        const title       = tab.dataset.title       || '';
        const description = tab.dataset.description || '';
        const points      = (tab.dataset.points     || '').split('|').filter(Boolean);

        if (spotlight.title)       spotlight.title.textContent       = title;
        if (spotlight.description) spotlight.description.textContent = description;
        fillPoints(spotlight.points, points);

        if (explorer.title)       explorer.title.textContent       = title;
        if (explorer.description) explorer.description.textContent = description;
        fillPoints(explorer.points, points);

        const panel = document.getElementById('service-panel');
        if (panel && tab.id) panel.setAttribute('aria-labelledby', tab.id);
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => renderTab(tab));
        tab.addEventListener('keydown', (e) => {
            const i = tabs.indexOf(tab);
            if (e.key === 'ArrowRight') { e.preventDefault(); const n = tabs[(i + 1) % tabs.length]; n.focus(); renderTab(n); }
            if (e.key === 'ArrowLeft')  { e.preventDefault(); const n = tabs[(i - 1 + tabs.length) % tabs.length]; n.focus(); renderTab(n); }
            if (e.key === 'Home')       { e.preventDefault(); tabs[0].focus(); renderTab(tabs[0]); }
            if (e.key === 'End')        { e.preventDefault(); tabs[tabs.length - 1].focus(); renderTab(tabs[tabs.length - 1]); }
        });
    });

    renderTab(tabs.find((t) => t.classList.contains('active')) || tabs[0]);

    if (!prefersReducedMotion) {
        let tabIndex = 0;
        setInterval(() => {
            tabIndex = (tabIndex + 1) % tabs.length;
            renderTab(tabs[tabIndex]);
        }, 5500);
    }

    // — TESTIMONIAL CAROUSEL —
    if (!testimonials.length) return;

    let testimonialIndex = testimonials.findIndex((t) => t.classList.contains('active'));
    if (testimonialIndex < 0) testimonialIndex = 0;

    const renderTestimonial = (idx) => {
        testimonials.forEach((t, i) => {
            t.classList.toggle('active', i === idx);
            t.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        testimonialIndex = idx;
    };

    prevBtn?.addEventListener('click', () => renderTestimonial((testimonialIndex - 1 + testimonials.length) % testimonials.length));
    nextBtn?.addEventListener('click', () => renderTestimonial((testimonialIndex + 1) % testimonials.length));
    dots.forEach((dot) => dot.addEventListener('click', () => renderTestimonial(Number(dot.dataset.dot))));

    if (!prefersReducedMotion) {
        setInterval(() => renderTestimonial((testimonialIndex + 1) % testimonials.length), 6500);
    }
});

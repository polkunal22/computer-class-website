document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const progress = document.createElement('div');

    progress.className = 'page-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.prepend(progress);

    const updatePageState = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percent = scrollable > 0 ? Math.min((window.scrollY / scrollable) * 100, 100) : 0;
        progress.style.width = `${percent}%`;
        navbar?.classList.toggle('scrolled', window.scrollY > 12);
    };

    updatePageState();
    window.addEventListener('scroll', updatePageState, { passive: true });
    window.addEventListener('resize', updatePageState, { passive: true });

    if (navToggle && navLinks) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.addEventListener('click', () => requestAnimationFrame(() => {
            navToggle.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
        }));

        const closeMenu = () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        };

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
                navToggle.focus();
            }
        });

        document.addEventListener('click', event => {
            if (!navbar?.contains(event.target) && navLinks.classList.contains('open')) closeMenu();
        });
    }

    const items = document.querySelectorAll('.card, .feature-card, .showcase-card, .testimonial-card, .detail-card, .syllabus-item, .pricing-card, .instructor-section');

    if (!reduceMotion && 'IntersectionObserver' in window) {
        items.forEach((item, index) => {
            item.classList.add('reveal-on-scroll');
            item.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -24px' });

        items.forEach(item => observer.observe(item));
    }

    if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        items.forEach(item => {
            item.classList.add('interactive-surface');
            item.addEventListener('pointermove', event => {
                const bounds = item.getBoundingClientRect();
                item.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
                item.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       CUSTOM CURSOR
    ============================================ */
    const cursorDot  = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId  = null;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left  = mouseX + 'px';
            cursorDot.style.top   = mouseY + 'px';
        }

        if (!rafId) {
            rafId = requestAnimationFrame(animateRing);
        }
    });

    function animateRing() {
        if (cursorRing) {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
        }
        rafId = requestAnimationFrame(animateRing);
    }

    // Enlarge ring on hoverable elements
    const hoverables = document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card, .info-card, .stat-item');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing && cursorRing.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorRing && cursorRing.classList.remove('hovered'));
    });

    /* ============================================
       SCROLL PROGRESS BAR
    ============================================ */
    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        if (progressBar) {
            const scrollTop    = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress     = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = progress + '%';
        }
    }, { passive: true });

    /* ============================================
       MOBILE MENU TOGGLE
    ============================================ */
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* ============================================
       NAVBAR GLASS EFFECT ON SCROLL
    ============================================ */
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.style.background     = 'rgba(15, 23, 42, 0.85)';
            navbar.style.backdropFilter = 'blur(16px)';
            navbar.style.borderBottom   = '1px solid rgba(255, 255, 255, 0.06)';
        } else {
            navbar.style.background   = 'rgba(255, 255, 255, 0.02)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.04)';
        }
    }, { passive: true });

    /* ============================================
       HERO STAGGER ANIMATION
    ============================================ */
    const staggerElements = document.querySelectorAll('.fade-up-stagger');

    staggerElements.forEach((el, i) => {
        setTimeout(() => {
            el.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.opacity    = '1';
            el.style.transform  = 'translateY(0)';
        }, 250 * i);
    });

    /* ============================================
       INTERSECTION OBSERVER — FADE UP SECTIONS
    ============================================ */
    const fadeUpElements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeUpElements.forEach(el => observer.observe(el));

    /* ============================================
       COUNTER ANIMATION FOR STATS
    ============================================ */
    function animateCounter(el, target, duration = 1200) {
        let start     = 0;
        const step    = target / (duration / 16);
        const timer   = setInterval(() => {
            start += step;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            el.textContent = Math.round(start);
        }, 16);
    }

    const statsBar = document.querySelector('.stats-bar');
    let countersTriggered = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersTriggered) {
                countersTriggered = true;
                document.querySelectorAll('.stat-number').forEach(el => {
                    const target = parseInt(el.textContent, 10);
                    animateCounter(el, target);
                });
            }
        });
    }, { threshold: 0.5 });

    if (statsBar) statsObserver.observe(statsBar);

    /* ============================================
       SMOOTH ACTIVE NAV LINK ON SCROLL
    ============================================ */
    const sections     = document.querySelectorAll('section[id]');
    const navAnchors   = document.querySelectorAll('.nav-links a:not(.btn)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });

        navAnchors.forEach(a => {
            a.style.color = '';
            if (a.getAttribute('href') === `#${current}`) {
                a.style.color = 'white';
            }
        });
    }, { passive: true });

    /* ============================================
       PARALLAX TILT ON PROJECT CARDS
    ============================================ */
    document.querySelectorAll('.project-card, .skill-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left - rect.width  / 2;
            const y      = e.clientY - rect.top  - rect.height / 2;
            const tiltX  = (y / rect.height) * 6;
            const tiltY  = -(x / rect.width)  * 6;
            card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            card.style.transition = 'transform 0.05s linear';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform  = '';
        });
    });

    /* ============================================
       RIPPLE EFFECT ON BUTTONS
    ============================================ */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect   = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size   = Math.max(rect.width, rect.height);
            const x      = e.clientX - rect.left  - size / 2;
            const y      = e.clientY - rect.top   - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: rgba(255,255,255,0.18);
                transform: scale(0);
                animation: rippleAnim 0.5s ease-out forwards;
                pointer-events: none;
            `;

            // Inject keyframes once
            if (!document.getElementById('ripple-style')) {
                const style = document.createElement('style');
                style.id    = 'ripple-style';
                style.textContent = `
                    @keyframes rippleAnim {
                        to { transform: scale(2.5); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
});

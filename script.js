// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const countElement = document.querySelector('.count');
    let count = 0;

    const counter = setInterval(() => {
        if (count < 100) {
            count++;
            countElement.textContent = count;
        } else {
            clearInterval(counter);
            preloader.classList.add('hide');
        }
    }, 20);
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const links = document.querySelectorAll('a, .cursor-hover, .menu-toggle, .logo-svg');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
});

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const parallaxImages = document.querySelectorAll('.hero-image img, .project-img-container img, .about-image img');
    
    parallaxImages.forEach(img => {
        const speed = 0.1;
        // Use translate property to avoid conflict with CSS transform (scale)
        img.style.translate = `0 ${scrolled * speed}px`;
    });
});

// Menu Toggle
const menuTrigger = document.querySelector('.top-right');
const menuClose = document.querySelector('.menu-close');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-links a');

function toggleMenu() {
    menuOverlay.classList.toggle('open');
}

if (menuTrigger) menuTrigger.addEventListener('click', toggleMenu);
if (menuClose) menuClose.addEventListener('click', toggleMenu);

menuLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal-text, .reveal-img');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: Stop observing once revealed
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is fully in view
});

// Trigger immediately for elements already in view (fallback)
setTimeout(() => {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if(rect.top < window.innerHeight) {
            el.classList.add('active');
        }
        revealObserver.observe(el);
    });
}, 100);

// Marquee Infinite Loop Fix
// We duplicate the content to ensure it loops seamlessly
const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
    const content = marqueeContent.innerHTML;
    marqueeContent.innerHTML = content + content;
}


// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const countElement = document.querySelector('.count');
    
    if (preloader && countElement) {
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
    }
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const links = document.querySelectorAll('a, .cursor-hover, .menu-toggle, .logo-svg');

if (cursor) {
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
}

// Parallax Effect
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    // Removed .project-img-container img from parallax to prevent images from moving out of view
    const parallaxImages = document.querySelectorAll('.hero-image img, .about-image img');
    
    parallaxImages.forEach(img => {
        const speed = 0.1;
        // Use translate property to avoid conflict with CSS transform (scale)
        img.style.translate = `0 ${scrolled * speed}px`;
    });
});

// Navigation Active State & Indicator
const navLinks = document.querySelectorAll('.nav-link');
const navIndicator = document.querySelector('.nav-indicator');
const sections = document.querySelectorAll('section, header');

function updateNavIndicator(activeLink) {
    if (!activeLink || !navIndicator) return;
    
    // Check if mobile (indicator hidden)
    if (window.innerWidth <= 768) return;

    const linkRect = activeLink.getBoundingClientRect();
    // The container is the ul.nav-links-container
    const container = document.querySelector('.nav-links-container');
    const containerRect = container.getBoundingClientRect();
    
    // Calculate position relative to the container padding
    // The container has padding, so we need to account for that if we want exact positioning
    // But since the indicator is inside the container, relative positioning works best.
    // Actually, let's use offsetLeft and offsetWidth which are relative to offsetParent
    
    const left = activeLink.parentElement.offsetLeft;
    const width = activeLink.parentElement.offsetWidth;
    
    navIndicator.style.width = `${width}px`;
    navIndicator.style.transform = `translateX(${left}px)`;
    navIndicator.classList.add('visible');
}

// Initial set
window.addEventListener('load', () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        updateNavIndicator(activeLink);
    }
});

// Update on click
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        updateNavIndicator(link);
    });
});

// Update on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Adjust offset for better triggering
        if (scrollY >= (sectionTop - 300)) {
            current = section.getAttribute('id');
        }
    });

    // If at top, set home as active
    if (scrollY < 100) {
        current = 'hero';
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
            updateNavIndicator(link);
        }
    });
});

// Handle resize
window.addEventListener('resize', () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) updateNavIndicator(activeLink);
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

// Skills Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        skillCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hide');
                // Reset animation to ensure float continues after fade
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = 'fadeIn 0.5s ease forwards, float-card 6s ease-in-out infinite';
                
                // Re-apply delays based on index (approximate)
                const index = Array.from(skillCards).indexOf(card);
                if (index % 2 === 0) card.style.animationDelay = '0s, 1s';
                else if (index % 3 === 0) card.style.animationDelay = '0s, 2s';
                else card.style.animationDelay = '0s, 0s';
                
            } else {
                card.classList.add('hide');
                card.style.animation = 'none';
            }
        });
    });
});

// Add keyframes for fade in animation if not present in CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(styleSheet);

// Logo Rotation on Click
const logo = document.querySelector('.logo-svg');
if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior if wrapped in <a>
        logo.classList.toggle('rotating');
    });
}


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

// Project Modal Logic
const modal = document.getElementById('project-modal');
const closeModal = document.querySelector('.close-modal');
const viewProjectBtns = document.querySelectorAll('.btn-view-project');

if (modal && viewProjectBtns.length) {
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectItem = e.target.closest('.project-item');
            if (!projectItem) return;

            // Populate Modal Content from Data Attributes
            document.getElementById('modal-title').textContent = projectItem.dataset.title;
            document.getElementById('modal-tagline').textContent = projectItem.dataset.tagline;
            document.getElementById('modal-desc').textContent = projectItem.dataset.description;
            document.getElementById('modal-img').src = projectItem.dataset.image;
            document.getElementById('modal-github').href = projectItem.dataset.github;
            
            // Populate Tech Badges
            const techContainer = document.getElementById('modal-tech');
            techContainer.innerHTML = '';
            projectItem.dataset.tech.split(',').forEach(tech => {
                const span = document.createElement('span');
                span.className = 'tech-badge';
                span.textContent = tech.trim();
                techContainer.appendChild(span);
            });

            // Populate Features List
            const featuresContainer = document.getElementById('modal-features');
            featuresContainer.innerHTML = '';
            projectItem.dataset.features.split(',').forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature.trim();
                featuresContainer.appendChild(li);
            });

            // Show Modal with Animation
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    const closemodalFn = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };

    closeModal?.addEventListener('click', closemodalFn);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closemodalFn();
    });

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closemodalFn();
    });
}

// Initial set
window.addEventListener('load', () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        updateNavIndicator(activeLink);
    }
});

// Targeted nav click handler (use native scroll + CSS offset)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        // Use native scrollIntoView and rely on `scroll-margin-top` in CSS for header offset
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Immediate active feedback
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        updateNavIndicator(this);
    });
});

// Use IntersectionObserver for reliable scroll-spy (more robust than scroll events)
const observed = Array.from(document.querySelectorAll('header[id], section[id]'));
if (observed.length) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            if (!id) return;
            const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);

            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                    updateNavIndicator(correspondingLink);
                }
            }
        });
    }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    observed.forEach(s => io.observe(s));
}

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

// Logo Rotation on Click - Removed as per request
/*
const logo = document.querySelector('.logo-svg');
if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior if wrapped in <a>
        logo.classList.toggle('rotating');
    });
}
*/

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

if (themeToggleBtn && themeIcon) {
    // Check for saved user preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
}

// Typewriter Effect
const typewriterElement = document.getElementById('typewriter-text');
const cursorElement = document.querySelector('.typewriter-cursor');
const roles = ["AI/ML Engineer", "Backend Guy", "ML Developer", "LLM / LLMOps Guy"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        charIndex--;
        typeSpeed = 50;
    } else {
        charIndex++;
        typeSpeed = 100;
    }

    if (typewriterElement) {
        typewriterElement.textContent = currentRole.substring(0, charIndex);
    }

    if (cursorElement) {
        cursorElement.classList.add('typing');
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // End-of-word pause
        if (cursorElement) cursorElement.classList.remove('typing');
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Start-of-word pause
        if (cursorElement) cursorElement.classList.remove('typing');
    }

    setTimeout(type, typeSpeed);
}

// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typewriterElement && !prefersReducedMotion) {
    type();
} else if (typewriterElement) {
    typewriterElement.textContent = roles[0];
    if (cursorElement) cursorElement.style.display = 'none';
}


// Smooth Scroll for Hash Links
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // If it is NOT a nav link (handled elsewhere), prevent default
                if (!this.classList.contains('nav-link')) {
                     e.preventDefault();
                     targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                     });
                     history.pushState(null, null, targetId);
                }
            }
        });
    });

    // Handle page load with hash
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }
});


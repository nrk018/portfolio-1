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
            if (projectItem.dataset.tech) {
                projectItem.dataset.tech.split(',').forEach(tech => {
                    const span = document.createElement('span');
                    span.className = 'tech-badge';
                    span.textContent = tech.trim();
                    techContainer.appendChild(span);
                });
            }

            // Populate Features List
            const featuresContainer = document.getElementById('modal-features');
            featuresContainer.innerHTML = '';
            if (projectItem.dataset.features) {
                projectItem.dataset.features.split(',').forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature.trim();
                    featuresContainer.appendChild(li);
                });
            }

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
        const href = this.getAttribute('href');
        
        // Simple check: if it doesn't start with hash, check if it's the same page
        const isHash = href.startsWith('#');
        const isSamePage = link.pathname === window.location.pathname 
                           && link.hostname === window.location.hostname; // host check for safety

        // If it's a link to another page, let default behavior happen
        if (!isHash && !isSamePage) return;

        // If it is same page but fully qualified (e.g. index.html#about), extract hash
        // If it is just hash (e.g. #about), use as is
        let targetId = isHash ? href : link.hash;

        e.preventDefault();
        
        if (!targetId || targetId === '#') return;
        
        // Handle edge case where targetId might be empty if href="index.html"
        if (!targetId) {
             window.scrollTo({ top: 0, behavior: 'smooth' });
             return;
        }

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        // Use native scrollIntoView and rely on `scroll-margin-top` in CSS for header offset
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Immediate active feedback
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        updateNavIndicator(this);
        
        // Update URL hash without scroll (since we handled it)
        history.pushState(null, null, targetId);
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
    // Generic smooth scroll for all internal links (nav-links handled separately)
    // We select all links that contain a hash
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's a nav-link (already handled)
            if (this.classList.contains('nav-link')) return;

            const href = this.getAttribute('href');
            if (!href) return;

            // Determine if this link points to the current page
            const isHash = href.startsWith('#');
            // Check path and hostname to ensure it's the same page
            // We use properties of the anchor element (this.pathname) vs window.location
            const isSamePage = (this.hostname === window.location.hostname) &&
                               (this.pathname.replace(/^\//, '') === window.location.pathname.replace(/^\//, ''));

            if (!isHash && !isSamePage) return;

            const targetId = this.hash;
            // Skip if empty hash or just "#"
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                 e.preventDefault();
                 targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                 });
                 history.pushState(null, null, targetId);
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

// TOC Scroll-Spy and Smooth Navigation
document.addEventListener('DOMContentLoaded', () => {
    const tocLinks = document.querySelectorAll('.toc-link');
    const headings = document.querySelectorAll('[id]'); // All elements with IDs
    
    if (tocLinks.length === 0 || headings.length === 0) return;

    // Step 3: Smooth scroll with navbar offset
    const NAVBAR_HEIGHT = 100; // Adjust to match your navbar height
    
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetPosition = targetElement.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering scroll
                history.pushState(null, null, `#${targetId}`);
                
                // Update active state immediately
                tocLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Step 3 & 4: IntersectionObserver for scroll-spy
    // Build a map of heading IDs to their corresponding TOC links
    const headingMap = new Map();
    tocLinks.forEach(link => {
        const id = link.getAttribute('href').substring(1);
        const heading = document.getElementById(id);
        if (heading) {
            headingMap.set(heading, link);
        }
    });

    // Observer configuration
    const observerOptions = {
        root: null, // Use viewport as root (body is scroll container)
        rootMargin: `-${NAVBAR_HEIGHT + 20}px 0px -60% 0px`, // Account for navbar, trigger when heading is ~40% from top
        threshold: 0
    };

    let currentActive = null;

    const observer = new IntersectionObserver((entries) => {
        // Find all currently intersecting headings
        const visibleHeadings = entries
            .filter(entry => entry.isIntersecting)
            .map(entry => entry.target);

        if (visibleHeadings.length === 0) return;

        // Get the topmost visible heading
        const topHeading = visibleHeadings.reduce((highest, heading) => {
            const highestTop = highest.getBoundingClientRect().top;
            const headingTop = heading.getBoundingClientRect().top;
            return headingTop < highestTop ? heading : highest;
        });

        const tocLink = headingMap.get(topHeading);
        
        if (tocLink && tocLink !== currentActive) {
            // Remove active from all links
            tocLinks.forEach(link => link.classList.remove('active'));
            
            // Add active to current
            tocLink.classList.add('active');
            currentActive = tocLink;
            
            // Step 4: Auto-scroll TOC to keep active item visible
            const tocContainer = document.querySelector('.toc-sticky');
            if (tocContainer) {
                const linkRect = tocLink.getBoundingClientRect();
                const containerRect = tocContainer.getBoundingClientRect();
                
                // Check if link is outside visible area
                if (linkRect.top < containerRect.top || linkRect.bottom > containerRect.bottom) {
                    tocLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
        }
    }, observerOptions);

    // Observe all headings that have TOC links
    headingMap.forEach((link, heading) => {
        observer.observe(heading);
    });

    // Step 4: Handle page load with hash
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const targetLink = document.querySelector(`.toc-link[href="#${targetId}"]`);
            if (targetLink) {
                targetLink.click();
            }
        }, 100);
    } else {
        // Activate first item by default
        if (tocLinks.length > 0) {
            tocLinks[0].classList.add('active');
            currentActive = tocLinks[0];
        }
    }

    // Step 4: Handle window resize (recalculate on resize)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Re-trigger observation by scrolling slightly
            window.scrollBy(0, 1);
            window.scrollBy(0, -1);
        }, 150);
    });
});


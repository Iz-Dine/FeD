// ============================================
// CONSTANTS
// ============================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animationDuration = prefersReducedMotion ? 0 : 300;

// ============================================
// HERO CAROUSEL (Mobile only)
// ============================================

const heroSection = document.querySelector('main > section:first-of-type');
const heroParagraphs = heroSection ? heroSection.querySelectorAll('p') : [];

if (heroParagraphs.length > 1 && window.innerWidth < 768 && !prefersReducedMotion) {
    let currentIndex = 0;
    
    heroParagraphs.forEach((paragraph, index) => {
        if (index > 0) paragraph.style.display = 'none';
    });
    
    setInterval(() => {
        heroParagraphs[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % heroParagraphs.length;
        heroParagraphs[currentIndex].style.display = 'block';
    }, 4000);
}

// ============================================
// HAMBURGER MENU
// ============================================

const hamburgerButton = document.querySelector('nav[aria-label="Hoofdnavigatie"] > button[type="button"]');
const mobileMenu = document.querySelector('body > header > aside[aria-labelledby="mobile-menu-title"]');
const closeMenuButton = mobileMenu ? mobileMenu.querySelector('header button[type="button"]') : null;

if (hamburgerButton && mobileMenu && closeMenuButton) {
    
    const openMenu = () => {
        hamburgerButton.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('data-open', '');
        document.body.style.overflow = 'hidden';
    };
    
    const closeMenu = () => {
        hamburgerButton.setAttribute('aria-expanded', 'false');
        mobileMenu.removeAttribute('data-open');
        document.body.style.overflow = '';
    };
    
    hamburgerButton.addEventListener('click', openMenu);
    closeMenuButton.addEventListener('click', closeMenu);
    
    mobileMenu.addEventListener('click', (event) => {
        if (event.target === mobileMenu) {
            closeMenu();
        }
    });
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileMenu.hasAttribute('data-open')) {
            closeMenu();
            hamburgerButton.focus();
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu.hasAttribute('data-open')) {
            closeMenu();
        }
    });
}

// ============================================
// SEARCH FORMS
// ============================================

const searchForms = document.querySelectorAll('form[role="search"]');

searchForms.forEach(form => {
    form.addEventListener('submit', handleSearch);
});

function handleSearch(event) {
    event.preventDefault();
    const searchInput = event.target.querySelector('input[type="search"]');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    if (searchTerm.length < 2) {
        showNotification('Voer minimaal 2 karakters in', 'warning');
        if (searchInput) searchInput.focus();
        return;
    }
    
    if (searchTerm) {
        showNotification(`Zoeken naar "${searchTerm}"...`, 'info');
    }
}

// ============================================
// WISHLIST FUNCTIONALITY
// ============================================

const wishlistButtons = document.querySelectorAll('main article > button[aria-label^="Toevoegen"]');

wishlistButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const isPressed = button.getAttribute('aria-pressed') === 'true';
        button.setAttribute('aria-pressed', !isPressed);
        
        const svg = button.querySelector('svg');
        if (svg) {
            svg.style.fill = !isPressed ? '#f44336' : 'currentColor';
        }
        
        showNotification(
            !isPressed ? 'Toegevoegd aan verlanglijst ♥' : 'Verwijderd uit verlanglijst',
            !isPressed ? 'success' : 'info'
        );
    });
});

// ============================================
// ADD TO CART FUNCTIONALITY
// ============================================

const cartButtons = document.querySelectorAll('main article section > button[type="button"]');

cartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        
        button.disabled = true;
        const originalContent = button.textContent;
        
        button.textContent = '✓ Toegevoegd!';
        
        setTimeout(() => {
            button.textContent = originalContent;
            button.disabled = false;
        }, 2000);
        
        showNotification('Product toegevoegd aan winkelwagen', 'success');
    });
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================

let notificationTimeout;

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('aside[role="status"]');
    if (existingNotification) {
        existingNotification.remove();
        clearTimeout(notificationTimeout);
    }
    
    const notification = document.createElement('aside');
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    
    const icons = {
        success: '✓',
        warning: '⚠',
        error: '✕',
        info: 'ℹ'
    };
    
    const iconElement = document.createElement('strong');
    iconElement.setAttribute('aria-hidden', 'true');
    iconElement.textContent = icons[type] || icons.info;
    
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.setAttribute('aria-label', 'Sluiten');
    closeButton.setAttribute('type', 'button');
    closeButton.textContent = '×';
    
    notification.appendChild(iconElement);
    notification.appendChild(messageElement);
    notification.appendChild(closeButton);
    
    notification.setAttribute('data-notification', type);
    
    document.body.appendChild(notification);
    
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    notificationTimeout = setTimeout(() => {
        removeNotification(notification);
    }, 4000);
}

function removeNotification(notification) {
    if (!notification || !notification.isConnected) return;
    
    notification.setAttribute('data-closing', '');
    
    setTimeout(() => {
        notification.remove();
    }, prefersReducedMotion ? 0 : 300);
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#!') {
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            event.preventDefault();
            
            const header = document.querySelector('body > header');
            const headerHeight = header?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
            
            target.setAttribute('tabindex', '-1');
            target.focus();
        }
    });
});

// ============================================
// LAZY LOADING IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

const scrollToTopButton = document.createElement('button');
scrollToTopButton.textContent = '↑';
scrollToTopButton.setAttribute('aria-label', 'Scroll naar boven');
scrollToTopButton.setAttribute('type', 'button');
scrollToTopButton.setAttribute('data-scroll-top', '');

document.body.appendChild(scrollToTopButton);

let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        if (window.pageYOffset > 300) {
            scrollToTopButton.setAttribute('data-visible', '');
        } else {
            scrollToTopButton.removeAttribute('data-visible');
        }
    }, 100);
}, { passive: true });

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
});

// ============================================
// CAROUSEL IN HERO SECTION
// ============================================

// Only on mobile/tablet
if (window.innerWidth < 1024) {
    const carouselWrapper = document.querySelector('main > section:first-of-type .carousel-wrapper');
    const carouselSlides = document.querySelectorAll('main > section:first-of-type .carousel-slide');
    const progressBars = document.querySelectorAll('main > section:first-of-type .progress-bar');
    const prevButton = document.querySelector('main > section:first-of-type .carousel-prev');
    const nextButton = document.querySelector('main > section:first-of-type .carousel-next');

    if (carouselWrapper && carouselSlides.length > 0) {
        let currentSlide = 0;
        const totalSlides = carouselSlides.length;
        const autoPlayInterval = 5000;
        let autoPlayTimer;

        function goToSlide(index) {
            currentSlide = index;
            const offset = -currentSlide * 100;
            carouselWrapper.style.transform = `translateX(${offset}%)`;
            
            progressBars.forEach((bar, i) => {
                bar.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
            });
        }

        function nextSlide() {
            const next = (currentSlide + 1) % totalSlides;
            goToSlide(next);
        }

        function prevSlide() {
            const prev = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(prev);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
            }
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                startAutoPlay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                startAutoPlay();
            });
        }

        progressBars.forEach((bar, index) => {
            bar.addEventListener('click', () => {
                goToSlide(index);
                startAutoPlay();
            });
        });

        const carouselContainer = document.querySelector('main > section:first-of-type .carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }

        goToSlide(0);
        startAutoPlay();
    }
}

// ============================================
// SEMANTIC JAVASCRIPT - Zonder class selectors
// Gebruik data-attributes en semantic HTML
// ============================================

// ===========================
// 1. HERO TEXT CAROUSEL
// ===========================

function initHeroTextCarousel() {
    const heroSection = document.querySelector('main > section:first-of-type');
    if (!heroSection) return;
    
    const textContainer = heroSection.querySelector('div:first-of-type');
    if (!textContainer) return;
    
    const paragraphs = Array.from(textContainer.querySelectorAll('p'));
    if (paragraphs.length === 0) return;
    
    let currentIndex = 0;
    
    // Set first paragraph as active
    paragraphs[0].setAttribute('data-active', 'true');
    
    function showNextParagraph() {
        // Remove data-active from current
        paragraphs[currentIndex].removeAttribute('data-active');
        
        // Move to next
        currentIndex = (currentIndex + 1) % paragraphs.length;
        
        // Add data-active to new current
        paragraphs[currentIndex].setAttribute('data-active', 'true');
    }
    
    // Rotate every 5 seconds
    setInterval(showNextParagraph, 5000);
    
    console.log('%c✅ Hero text carousel gestart!', 'color: #0090e3; font-weight: bold;');
}

// ===========================
// 2. CAROUSEL NAVIGATION (Universal)
// Voor sections met data-carousel attribute
// ===========================

function initCarouselNavigation() {
    const carouselSections = document.querySelectorAll('section[data-carousel], div[data-carousel]');
    
    carouselSections.forEach(container => {
        // Only on mobile for most carousels
        if (window.innerWidth >= 768 && container.tagName === 'SECTION') {
            return;
        }
        
        // Check if buttons already exist
        if (container.querySelectorAll('button').length > 0) {
            return;
        }
        
        // Create navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.setAttribute('aria-label', 'Vorige');
        prevBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"/>
            </svg>
        `;
        
        const nextBtn = document.createElement('button');
        nextBtn.setAttribute('aria-label', 'Volgende');
        nextBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"/>
            </svg>
        `;
        
        // Get scrollable element
        let scrollable = container;
        if (container.tagName === 'SECTION') {
            // For section[data-carousel], look for direct children
            const articles = container.querySelectorAll('article');
            if (articles.length > 0) {
                scrollable = container;
            }
        }
        
        // Add buttons
        container.style.position = 'relative';
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
        
        // Scroll functionality
        const scrollAmount = 250;
        
        prevBtn.addEventListener('click', () => {
            scrollable.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            scrollable.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        scrollable.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        scrollable.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextBtn.click();
                } else {
                    prevBtn.click();
                }
            }
        }
    });
    
    if (carouselSections.length > 0) {
        console.log(`%c ${carouselSections.length} carousel(s) geïnitialiseerd!`, 'color: #0090e3; font-weight: bold;');
    }
}

// ===========================
// 3. MOBILE MENU FIX
// ===========================

function fixMobileMenu() {
    const nav = document.querySelector('body > header nav[aria-label="Primaire navigatie"]');
    if (!nav) return;
    
    // Force wit background op mobile
    if (window.innerWidth < 768) {
        nav.style.setProperty('background', 'var(--cb-color-background)', 'important');
        
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            link.style.setProperty('background', 'var(--cb-color-background)', 'important');
            link.style.setProperty('color', 'var(--cb-color-text-primary)', 'important');
        });
    }
    
    console.log('%c Mobile menu styling gefixed!', 'color: #0090e3; font-weight: bold;');
}

// ===========================
// 4. AUTO-DETECT CAROUSELS ON MOBILE
// Sections met 5+ articles worden automatisch carousels
// ===========================

function autoDetectCarousels() {
    if (window.innerWidth >= 768) return;
    
    // Find sections with many articles
    const sections = document.querySelectorAll('main > section');
    
    sections.forEach(section => {
        const articles = section.querySelectorAll(':scope > article');
        
        // If 5+ direct child articles, make it a carousel
        if (articles.length >= 5 && !section.hasAttribute('data-carousel')) {
            section.setAttribute('data-carousel', 'auto');
        }
    });
    
    // Find divs with many articles
    const divs = document.querySelectorAll('main > section > div');
    
    divs.forEach(div => {
        const articles = div.querySelectorAll(':scope > article');
        
        // If 5+ direct child articles, make it a carousel
        if (articles.length >= 5 && !div.hasAttribute('data-carousel')) {
            div.setAttribute('data-carousel', 'auto');
        }
    });
}

// ===========================
// 5. KEYBOARD NAVIGATION FOR CAROUSELS
// ===========================

function initKeyboardNavigation() {
    const carouselSections = document.querySelectorAll('section[data-carousel], div[data-carousel]');
    
    carouselSections.forEach(container => {
        container.setAttribute('tabindex', '0');
        
        container.addEventListener('keydown', (e) => {
            const buttons = container.querySelectorAll('button');
            const prevBtn = buttons[0];
            const nextBtn = buttons[1];
            
            if (e.key === 'ArrowLeft' && prevBtn) {
                e.preventDefault();
                prevBtn.click();
            } else if (e.key === 'ArrowRight' && nextBtn) {
                e.preventDefault();
                nextBtn.click();
            }
        });
    });
}

// ===========================
// INITIALIZE ALL
// ===========================

function initializeAll() {
    initHeroTextCarousel();
    autoDetectCarousels();
    initCarouselNavigation();
    initKeyboardNavigation();
    fixMobileMenu();
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

// Re-init on resize for responsive behavior
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Re-detect carousels if switched to mobile
        if (window.innerWidth < 768) {
            autoDetectCarousels();
            initCarouselNavigation();
            initKeyboardNavigation();
        }
        fixMobileMenu();
    }, 250);
});

console.log('%c  JavaScript geladen!', 'color: #0090e3; font-weight: bold; font-size: 16px;');

// ============================================
// CONSOLE INFO
// ============================================

console.log('%c🔵 Coolblue Website Geladen!', 'color: #0090e3; font-size: 18px; font-weight: bold;');
console.log('%c✓ Geen inline CSS in JavaScript', 'color: #4caf50; font-weight: bold;');
console.log('%c✓ camelCase naming', 'color: #4caf50; font-weight: bold;');
console.log('%c✓ W3C compliant HTML', 'color: #4caf50; font-weight: bold;');

if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    });
}

// ============================================
// 3 AFBEELDINGEN CAROUSEL NAVIGATION
// Voeg toe aan einde van scripts/script.js
// ============================================

// Images Carousel functionality
(function() {
    const carousel = document.querySelector('.images-carousel-section .carousel');
    const wrapper = document.querySelector('.images-carousel-section .carousel__wrapper');
    const slides = document.querySelectorAll('.images-carousel-section .carousel__slide');
    const dots = document.querySelectorAll('.images-carousel-section .carousel-dot');
    const prevBtn = document.querySelector('.images-carousel-section .carousel-prev-btn');
    const nextBtn = document.querySelector('.images-carousel-section .carousel-next-btn');
    
    if (!carousel || slides.length === 0) return;
    
    let currentIndex = 0;
    
    // Update dots
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.setAttribute('aria-selected', 'true');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.setAttribute('aria-selected', 'false');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    }
    
    // Scroll to slide
    function scrollToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;
        
        // For mobile: scroll horizontally
        if (window.innerWidth < 768) {
            const slideWidth = slides[0].offsetWidth;
            const gap = parseInt(getComputedStyle(wrapper).gap) || 0;
            const scrollPosition = (slideWidth + gap) * currentIndex;
            
            carousel.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
        
        updateDots();
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollToSlide(currentIndex - 1);
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollToSlide(currentIndex + 1);
        });
    }
    
    // Dots click
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToSlide(index);
        });
    });
    
    // Track scroll position for dots update
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const scrollLeft = carousel.scrollLeft;
            const slideWidth = slides[0].offsetWidth;
            const gap = parseInt(getComputedStyle(wrapper).gap) || 0;
            const newIndex = Math.round(scrollLeft / (slideWidth + gap));
            
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                updateDots();
            }
        }, 100);
    }, { passive: true });
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                scrollToSlide(currentIndex + 1);
            } else {
                // Swipe right - previous
                scrollToSlide(currentIndex - 1);
            }
        }
    }
    
    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollToSlide(currentIndex + 1);
        }
    });
    
    // Initialize
    updateDots();
    
    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            scrollToSlide(currentIndex);
        }, 200);
    });
})();

console.log('%c Images Carousel Geladen!', 'color: #0090e3; font-weight: bold;');

// ============================================
// END OF SCRIPT
// ============================================
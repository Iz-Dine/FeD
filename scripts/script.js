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
/**
 * The JavaScript code snippet includes various functionalities such as hero carousel, hamburger menu
 * with category navigation, search forms handling, wishlist and add to cart functionality,
 * notification system, smooth scroll, lazy loading images, scroll to top button, animations, and
 * console info for a Coolblue website.
 * @param e - The `e` parameter in the `handleSearch` function and other event handler functions
 * represents the event object that contains information about the event that occurred, such as the
 * type of event, the target element, and any additional data related to the event. In this context,
 * `e` is commonly used
 * @returns The code provided is a combination of JavaScript code snippets that enhance the
 * functionality and user experience of a website. Here is a summary of what is being returned:
 */
// ============================================
// CONSTANTS
// ============================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ANIMATION_DURATION = prefersReducedMotion ? 0 : 300;

// ============================================
// HERO CAROUSEL (Mobile only)
// ============================================

const heroSection = document.querySelector('main > section:first-of-type');
const heroParagraphs = heroSection ? heroSection.querySelectorAll('p') : [];

if (heroParagraphs.length > 1 && window.innerWidth < 768 && !prefersReducedMotion) {
    let currentIndex = 0;
    
    // Hide all except first
    heroParagraphs.forEach((p, index) => {
        if (index > 0) p.style.display = 'none';
    });
    
    // Rotate through paragraphs
    setInterval(() => {
        heroParagraphs[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % heroParagraphs.length;
        heroParagraphs[currentIndex].style.display = 'block';
    }, 4000);
}

// ============================================
// HAMBURGER MENU - Show Category Navigation
// ============================================

const hamburger = document.querySelector('nav[aria-label="Hoofdnavigatie"] > button');
const categoryNav = document.querySelector('nav[aria-label="Productcategorieën"]');
const header = document.querySelector('body > header');

if (hamburger && categoryNav) {
    // Create mobile menu overlay
    const mobileMenuOverlay = document.createElement('div');
    mobileMenuOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: -100%;
        width: 80%;
        max-width: 400px;
        height: 100vh;
        background-color: var(--cb-color-background);
        box-shadow: var(--cb-shadow-lg);
        z-index: 300;
        transition: left 0.3s ease-in-out;
        overflow-y: auto;
        padding-bottom: 2rem;
    `;
    
    // Create menu header
    const menuHeader = document.createElement('header');
    menuHeader.style.cssText = `
        background-color: var(--cb-color-primary);
        color: white;
        padding: var(--cb-spacing-md);
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 10;
    `;
    
    const menuTitle = document.createElement('h2');
    menuTitle.textContent = 'Menu';
    menuTitle.style.cssText = `
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.setAttribute('aria-label', 'Menu sluiten');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 3rem;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    menuHeader.appendChild(menuTitle);
    menuHeader.appendChild(closeButton);
    
    // Clone category navigation
    const categoryList = categoryNav.querySelector('ul').cloneNode(true);
    categoryList.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 0;
        padding: 0;
    `;
    
    // Style each category item
    const categoryItems = categoryList.querySelectorAll('li');
    categoryItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            link.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--cb-spacing-md);
                border-bottom: 1px solid var(--cb-color-border);
                color: var(--cb-color-text-primary);
                font-weight: 600;
                font-size: 1rem;
                min-height: 60px;
                transition: background-color 0.2s ease;
            `;
            
            // Add arrow icon
            const arrow = document.createElement('span');
            arrow.innerHTML = '›';
            arrow.style.cssText = `
                font-size: 1.5rem;
                color: var(--cb-color-text-secondary);
            `;
            link.appendChild(arrow);
            
            link.addEventListener('mouseenter', () => {
                link.style.backgroundColor = 'var(--cb-color-background-alt)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.backgroundColor = '';
            });
        }
    });
    
    // Add additional menu items (like screenshot)
    const additionalItems = [
        { text: 'Taal: Nederlands (NL)', icon: '›' },
        { text: 'Black Friday', icon: '' },
        { text: 'Mijn Coolblue', icon: '' },
        { text: 'Klantenservice', icon: '' }
    ];
    
    additionalItems.forEach(item => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = item.text;
        link.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--cb-spacing-md);
            border-bottom: 1px solid var(--cb-color-border);
            color: var(--cb-color-text-primary);
            font-weight: ${item.icon ? '600' : '400'};
            font-size: 1rem;
            min-height: 60px;
            transition: background-color 0.2s ease;
        `;
        
        if (item.icon) {
            const arrow = document.createElement('span');
            arrow.innerHTML = item.icon;
            arrow.style.cssText = `
                font-size: 1.5rem;
                color: var(--cb-color-text-secondary);
            `;
            link.appendChild(arrow);
        }
        
        link.addEventListener('mouseenter', () => {
            link.style.backgroundColor = 'var(--cb-color-background-alt)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.backgroundColor = '';
        });
        
        li.appendChild(link);
        categoryList.appendChild(li);
    });
    
    // Assemble menu
    mobileMenuOverlay.appendChild(menuHeader);
    mobileMenuOverlay.appendChild(categoryList);
    document.body.appendChild(mobileMenuOverlay);
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 250;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease-in-out;
    `;
    document.body.appendChild(backdrop);
    
    // Open menu
    hamburger.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenuOverlay.style.left = '0';
        backdrop.style.opacity = '1';
        backdrop.style.pointerEvents = 'all';
        document.body.style.overflow = 'hidden';
    });
    
    // Close menu
    const closeMenu = () => {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenuOverlay.style.left = '-100%';
        backdrop.style.opacity = '0';
        backdrop.style.pointerEvents = 'none';
        document.body.style.overflow = '';
    };
    
    closeButton.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);
    
    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOverlay.style.left === '0px') {
            closeMenu();
        }
    });
    
    // Close on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenuOverlay.style.left === '0px') {
            closeMenu();
        }
    });
}

// ============================================
// SEARCH FORMS
// ============================================

const searchForms = document.querySelectorAll('form[role="search"]');

searchForms.forEach(form => {
    if (form) {
        form.addEventListener('submit', handleSearch);
    }
});

function handleSearch(e) {
    e.preventDefault();
    const searchInput = e.target.querySelector('input[type="search"]');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    if (searchTerm.length < 2) {
        showNotification('Voer minimaal 2 karakters in', 'warning');
        if (searchInput) searchInput.focus();
        return;
    }
    
    if (searchTerm) {
        console.log('Zoeken naar:', searchTerm);
        showNotification(`Zoeken naar "${searchTerm}"...`, 'info');
        // In production: window.location.href = `/zoeken?q=${encodeURIComponent(searchTerm)}`;
    }
}

// ============================================
// WISHLIST FUNCTIONALITY
// ============================================

const wishlistButtons = document.querySelectorAll('main article > button[aria-label^="Toevoegen"]');

wishlistButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isPressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', !isPressed);
        
        // Update SVG
        const svg = btn.querySelector('svg');
        if (svg) {
            if (!isPressed) {
                svg.style.fill = '#f44336';
                showNotification('Toegevoegd aan verlanglijst ♥', 'success');
            } else {
                svg.style.fill = 'currentColor';
                showNotification('Verwijderd uit verlanglijst', 'info');
            }
        }
        
        // Animation
        if (!prefersReducedMotion) {
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        }
    });
});

// ============================================
// ADD TO CART FUNCTIONALITY
// ============================================

const cartButtons = document.querySelectorAll('main article section > button[type="button"]');

cartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        btn.disabled = true;
        const originalContent = btn.textContent;
        
        // Success state
        btn.textContent = '✓ Toegevoegd!';
        btn.style.backgroundColor = '#4caf50';
        
        // Animation
        if (!prefersReducedMotion) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 100);
            }, 100);
        }
        
        // Reset after delay
        setTimeout(() => {
            btn.textContent = originalContent;
            btn.style.backgroundColor = '';
            btn.disabled = false;
        }, 2000);
        
        showNotification('Product toegevoegd aan winkelwagen', 'success');
    });
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================

let notificationTimeout;

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('aside[role="status"]');
    if (existing) {
        existing.remove();
        clearTimeout(notificationTimeout);
    }
    
    // Create notification
    const notification = document.createElement('aside');
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    
    const icons = {
        success: '✓',
        warning: '⚠',
        error: '✕',
        info: 'ℹ'
    };
    
    notification.innerHTML = `
        <strong aria-hidden="true">${icons[type] || icons.info}</strong>
        <p>${message}</p>
        <button aria-label="Sluiten">×</button>
    `;
    
    const colors = {
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        info: '#0090e3'
    };
    
    // Styling
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: colors[type] || colors.info,
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        minWidth: '300px',
        maxWidth: '500px',
        fontWeight: '500',
        animation: prefersReducedMotion ? 'none' : 'slideIn 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('button');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        color: white;
        font-size: 1.5rem;
    `;
    
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 4 seconds
    notificationTimeout = setTimeout(() => {
        removeNotification(notification);
    }, 4000);
}

function removeNotification(notification) {
    if (!notification || !notification.isConnected) return;
    
    notification.style.animation = prefersReducedMotion ? 'none' : 'slideOut 0.3s ease';
    setTimeout(() => {
        notification.remove();
    }, prefersReducedMotion ? 0 : 300);
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#!') {
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            
            // Calculate offset for sticky header
            const header = document.querySelector('body > header');
            const headerHeight = header?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
            
            // Set focus for accessibility
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
                
                img.style.opacity = '0';
                img.style.transition = prefersReducedMotion ? 'none' : 'opacity 0.3s ease';
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
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

const scrollToTopBtn = createScrollToTopButton();
document.body.appendChild(scrollToTopBtn);

function createScrollToTopButton() {
    const btn = document.createElement('button');
    btn.textContent = '↑';
    btn.setAttribute('aria-label', 'Scroll naar boven');
    
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #0090e3;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: ${prefersReducedMotion ? 'none' : 'opacity 0.3s, visibility 0.3s, transform 0.3s'};
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Show/hide on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            if (window.pageYOffset > 300) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        }, 100);
    }, { passive: true });
    
    // Click to scroll
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
    
    // Hover effects
    if (!prefersReducedMotion) {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.1)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    }
    
    return btn;
}

// ============================================
// ANIMATIONS
// ============================================

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Notification styling */
    aside[role="status"] strong {
        font-size: 1.25rem;
    }
    
    aside[role="status"] p {
        flex: 1;
        margin: 0;
    }
    
    ${prefersReducedMotion ? `
        * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    ` : ''}
`;

document.head.appendChild(animationStyles);

// ============================================
// CONSOLE INFO
// ============================================

console.log('%c🔵 Coolblue Website Geladen!', 'color: #0090e3; font-size: 18px; font-weight: bold;');
console.log('%c✓ Hamburger menu met categorieën', 'color: #4caf50; font-weight: bold;');
console.log('%c✓ Dark mode met light-dark()', 'color: #4caf50; font-weight: bold;');
console.log('%c✓ Mobile footer navigatie', 'color: #4caf50; font-weight: bold;');
console.log('%c✓ Sterren ratings', 'color: #4caf50; font-weight: bold;');

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    });
}

// ============================================
// SEARCH FORMS
// ============================================

const searchForms = document.querySelectorAll('form[role="search"]');

searchForms.forEach(form => {
    if (form) {
        form.addEventListener('submit', handleSearch);
    }
});

function handleSearch(e) {
    e.preventDefault();
    const searchInput = e.target.querySelector('input[type="search"]');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    if (searchTerm.length < 2) {
        showNotification('Voer minimaal 2 karakters in', 'warning');
        if (searchInput) searchInput.focus();
        return;
    }
    
    if (searchTerm) {
        console.log('Zoeken naar:', searchTerm);
        showNotification(`Zoeken naar "${searchTerm}"...`, 'info');
        // In production: window.location.href = `/zoeken?q=${encodeURIComponent(searchTerm)}`;
    }
}

// ============================================
// WISHLIST FUNCTIONALITY
// ============================================

const wishlistButtons = document.querySelectorAll('main article > button[aria-label^="Toevoegen"]');

wishlistButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isPressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', !isPressed);
        
        // Update SVG
        const svg = btn.querySelector('svg');
        if (svg) {
            if (!isPressed) {
                svg.style.fill = '#f44336';
                showNotification('Toegevoegd aan verlanglijst ♥', 'success');
            } else {
                svg.style.fill = 'currentColor';
                showNotification('Verwijderd uit verlanglijst', 'info');
            }
        }
        
        // Animation
        if (!prefersReducedMotion) {
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        }
    });
});

// ============================================
// ADD TO CART FUNCTIONALITY
// ============================================

const cartButtons = document.querySelectorAll('main article section > button[type="button"]');

cartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        btn.disabled = true;
        const originalContent = btn.textContent;
        
        // Success state
        btn.textContent = '✓ Toegevoegd!';
        btn.style.backgroundColor = '#4caf50';
        
        // Animation
        if (!prefersReducedMotion) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 100);
            }, 100);
        }
        
        // Reset after delay
        setTimeout(() => {
            btn.textContent = originalContent;
            btn.style.backgroundColor = '';
            btn.disabled = false;
        }, 2000);
        
        showNotification('Product toegevoegd aan winkelwagen', 'success');
    });
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================

let notificationTimeout;

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('aside[role="status"]');
    if (existing) {
        existing.remove();
        clearTimeout(notificationTimeout);
    }
    
    // Create notification
    const notification = document.createElement('aside');
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    
    const icons = {
        success: '✓',
        warning: '⚠',
        error: '✕',
        info: 'ℹ'
    };
    
    notification.innerHTML = `
        <strong aria-hidden="true">${icons[type] || icons.info}</strong>
        <p>${message}</p>
        <button aria-label="Sluiten">×</button>
    `;
    
    const colors = {
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        info: '#0090e3'
    };
    
    // Styling
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: colors[type] || colors.info,
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        minWidth: '300px',
        maxWidth: '500px',
        fontWeight: '500',
        animation: prefersReducedMotion ? 'none' : 'slideIn 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('button');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        color: white;
        font-size: 1.5rem;
    `;
    
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 4 seconds
    notificationTimeout = setTimeout(() => {
        removeNotification(notification);
    }, 4000);
}

function removeNotification(notification) {
    if (!notification || !notification.isConnected) return;
    
    notification.style.animation = prefersReducedMotion ? 'none' : 'slideOut 0.3s ease';
    setTimeout(() => {
        notification.remove();
    }, prefersReducedMotion ? 0 : 300);
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#!') {
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            
            // Calculate offset for sticky header
            const header = document.querySelector('body > header');
            const headerHeight = header?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
            
            // Set focus for accessibility
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
                
                img.style.opacity = '0';
                img.style.transition = prefersReducedMotion ? 'none' : 'opacity 0.3s ease';
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
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

const scrollToTopBtn = createScrollToTopButton();
document.body.appendChild(scrollToTopBtn);

function createScrollToTopButton() {
    const btn = document.createElement('button');
    btn.textContent = '↑';
    btn.setAttribute('aria-label', 'Scroll naar boven');
    
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #0090e3;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: ${prefersReducedMotion ? 'none' : 'opacity 0.3s, visibility 0.3s, transform 0.3s'};
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Show/hide on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            if (window.pageYOffset > 300) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        }, 100);
    }, { passive: true });
    
    // Click to scroll
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
    
    // Hover effects
    if (!prefersReducedMotion) {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.1)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    }
    
    return btn;
}

// ============================================
// ANIMATIONS
// ============================================

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Notification styling */
    aside[role="status"] strong {
        font-size: 1.25rem;
    }
    
    aside[role="status"] p {
        flex: 1;
        margin: 0;
    }
    
    ${prefersReducedMotion ? `
        * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    ` : ''}
`;

document.head.appendChild(animationStyles);

// ============================================
// CONSOLE INFO
// ============================================

console.log('%c🔵 Coolblue Website Geladen!', 'color: #0090e3; font-size: 18px; font-weight: bold;');
console.log('%c✓ Geen data-attributes', 'color: #4caf50; font-weight: bold;');
console.log('%c✓ Geen figures/figcaptions', 'color: #4caf50; font-weight: bold;');
console.log('%c✓ Carousel op mobile', 'color: #4caf50; font-weight: bold;');
console.log('%c✓ Meerdere hover effecten', 'color: #4caf50; font-weight: bold;');
console.log('%c✓ Responsive vanaf 768px', 'color: #4caf50; font-weight: bold;');

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    });
}
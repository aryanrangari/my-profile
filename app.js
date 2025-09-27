// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main application initialization
function initializeApp() {
    // Remove loading overlay after a short delay
    setTimeout(() => {
        hideLoadingOverlay();
    }, 1500);

    // Initialize features
    initializeAnimations();
    initializeCopyButtons();
    initializeToast();
    initializeScrollAnimations();
    initializeInteractiveEffects();
}

// Loading overlay functionality
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        
        // Start main animations after loading is hidden
        setTimeout(() => {
            startMainAnimations();
        }, 600);
    }
}

// Start main page animations
function startMainAnimations() {
    // Animate cards with staggered timing
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate');
        }, index * 200);
    });
    
    // Trigger scroll animations
    triggerScrollAnimations();
}

// Initialize scroll-based animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Trigger scroll animations immediately (for initial load)
function triggerScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('aos-animate');
        }, index * 300);
    });
}

// Initialize copy to clipboard functionality
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', handleCopyClick);
        
        // Add loading state on click
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.1)';
        });
    });
}

// Handle copy button clicks
async function handleCopyClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget;
    const textToCopy = button.getAttribute('data-copy');
    
    if (!textToCopy) return;
    
    try {
        // Modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
        } else {
            // Fallback for older browsers
            await fallbackCopyTextToClipboard(textToCopy);
        }
        
        showToast(`Copied: ${textToCopy}`, 'success');
        animateCopySuccess(button);
        
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showToast('Failed to copy text', 'error');
        animateCopyError(button);
    }
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text) {
    return new Promise((resolve, reject) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                resolve();
            } else {
                reject(new Error('Copy command failed'));
            }
        } catch (err) {
            document.body.removeChild(textArea);
            reject(err);
        }
    });
}

// Animate copy success
function animateCopySuccess(button) {
    const originalHTML = button.innerHTML;
    
    // Show checkmark
    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
        </svg>
    `;
    
    button.style.background = 'var(--color-success)';
    button.style.color = 'white';
    
    // Reset after animation
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
        button.style.color = '';
    }, 1500);
}

// Animate copy error
function animateCopyError(button) {
    button.style.background = 'var(--color-error)';
    button.style.color = 'white';
    
    setTimeout(() => {
        button.style.background = '';
        button.style.color = '';
    }, 1000);
}

// Toast notification system
let toastTimeout;

function initializeToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // Hide toast on click
    toast.addEventListener('click', hideToast);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    if (!toast || !toastMessage) return;
    
    // Clear existing timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    
    // Set message and type
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    // Auto hide after 3 seconds
    toastTimeout = setTimeout(() => {
        hideToast();
    }, 3000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
    }
}

// Initialize interactive effects
function initializeInteractiveEffects() {
    // Add ripple effect to contact and social items
    const interactiveItems = document.querySelectorAll('.contact-item, .social-item');
    
    interactiveItems.forEach(item => {
        item.addEventListener('click', createRippleEffect);
        item.addEventListener('mouseenter', handleItemHover);
        item.addEventListener('mouseleave', handleItemLeave);
    });
    
    // Add magnetic effect to copy buttons
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('mousemove', handleMagneticEffect);
        button.addEventListener('mouseleave', resetMagneticEffect);
    });
    
    // Initialize parallax scrolling for hero section
    initializeParallaxScrolling();
}

// Create ripple effect on click
function createRippleEffect(event) {
    const item = event.currentTarget;
    const rect = item.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
        z-index: 1;
    `;
    
    item.style.position = 'relative';
    item.style.overflow = 'hidden';
    item.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Handle item hover effects
function handleItemHover(event) {
    const item = event.currentTarget;
    const icon = item.querySelector('.contact-icon, .social-icon');
    
    if (icon) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
    }
}

function handleItemLeave(event) {
    const item = event.currentTarget;
    const icon = item.querySelector('.contact-icon, .social-icon');
    
    if (icon) {
        icon.style.transform = '';
    }
}

// Magnetic effect for copy buttons
function handleMagneticEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (event.clientX - centerX) * 0.2;
    const deltaY = (event.clientY - centerY) * 0.2;
    
    button.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
}

function resetMagneticEffect(event) {
    const button = event.currentTarget;
    button.style.transform = '';
}

// Initialize parallax scrolling
function initializeParallaxScrolling() {
    const heroSection = document.querySelector('.hero-section');
    
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        heroSection.style.transform = `translateY(${rate}px)`;
    });
}

// Initialize general animations
function initializeAnimations() {
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
}

// Utility function to handle link clicks with analytics (optional)
function trackLinkClick(platform, action) {
    // This would be where you'd send analytics data
    console.log(`User clicked ${action} for ${platform}`);
    
    // Add visual feedback
    showToast(`Opening ${platform}...`, 'info');
}

// Add click tracking to social and contact links
document.addEventListener('click', function(event) {
    const link = event.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    if (href && href.startsWith('tel:')) {
        trackLinkClick('Phone', 'call');
    } else if (href && href.includes('wa.me')) {
        trackLinkClick('WhatsApp', 'chat');
    } else if (href && href.startsWith('mailto:')) {
        trackLinkClick('Email', 'send');
    } else if (href && href.includes('instagram.com')) {
        trackLinkClick('Instagram', 'visit');
    } else if (href && href.includes('snapchat.com')) {
        trackLinkClick('Snapchat', 'visit');
    } else if (href && href.includes('t.me')) {
        trackLinkClick('Telegram', 'chat');
    }
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations
        document.body.style.animationPlayState = 'paused';
    } else {
        // Page is visible, resume animations
        document.body.style.animationPlayState = 'running';
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Handle escape key to hide toast
    if (event.key === 'Escape') {
        hideToast();
    }
    
    // Handle enter key on copy buttons
    if (event.key === 'Enter' || event.key === ' ') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('copy-btn')) {
            event.preventDefault();
            activeElement.click();
        }
    }
});

// Performance optimization: Debounced scroll handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Any scroll-based animations or calculations
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Error handling for async operations
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('Something went wrong. Please try again.', 'error');
});
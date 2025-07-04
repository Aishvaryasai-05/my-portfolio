// Utility Functions
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const backToTopBtn = document.getElementById('back-to-top');
const typingText = document.getElementById('typing-text');
const cursor = document.getElementById('cursor');
const contactForm = document.getElementById('contact-form');
const currentYearSpan = document.getElementById('current-year');

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Navbar Scroll Effect
const handleNavbarScroll = throttle(() => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', handleNavbarScroll);

// Active Navigation Link
const updateActiveNavLink = throttle(() => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', updateActiveNavLink);

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Typing Effect
const typeWriter = () => {
    const text = 'Aishwarya sai';
    let i = 0;
    
    const type = () => {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        } else {
            cursor.style.animation = 'blink 1s infinite';
        }
    };
    
    // Start typing after a short delay
    setTimeout(type, 500);
};

// Initialize typing effect when page loads
window.addEventListener('load', typeWriter);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Add staggered animation delay for grid items
            if (entry.target.classList.contains('skill-card') || 
                entry.target.classList.contains('project-card') ||
                entry.target.classList.contains('education-card')) {
                const siblings = Array.from(entry.target.parentElement.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Observe elements for animation
const observeElements = () => {
    const elements = document.querySelectorAll('.skill-card, .timeline-item, .project-card, .education-card');
    elements.forEach(el => observer.observe(el));
};

// Initialize observations when DOM is loaded
document.addEventListener('DOMContentLoaded', observeElements);

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (filterValue === 'all' || cardCategory === filterValue) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                // Animate card in
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Back to Top Button
const handleBackToTop = throttle(() => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}, 100);

window.addEventListener('scroll', handleBackToTop);

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Basic validation
    const name = formObject.name.trim();
    const email = formObject.email.trim();
    const subject = formObject.subject.trim();
    const message = formObject.message.trim();
    
    if (!name || !email || !subject || !message) {
        showAlert('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        showAlert('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Clear form validation states
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.classList.remove('valid');
        });
    }, 2000);
});

// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Alert System
const showAlert = (message, type = 'info') => {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </span>
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add alert styles
    const alertStyles = `
        <style>
            .alert {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                padding: 1rem;
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                backdrop-filter: blur(var(--blur-strength));
                -webkit-backdrop-filter: blur(var(--blur-strength));
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                box-shadow: 0 10px 30px var(--shadow-dark);
            }
            
            .alert-success {
                border-left: 4px solid #10b981;
            }
            
            .alert-error {
                border-left: 4px solid #ef4444;
            }
            
            .alert-info {
                border-left: 4px solid #3b82f6;
            }
            
            .alert-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .alert-icon {
                font-weight: bold;
                font-size: 1.2rem;
            }
            
            .alert-success .alert-icon {
                color: #10b981;
            }
            
            .alert-error .alert-icon {
                color: #ef4444;
            }
            
            .alert-info .alert-icon {
                color: #3b82f6;
            }
            
            .alert-message {
                flex: 1;
                color: var(--text-primary);
            }
            
            .alert-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: 1.5rem;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .alert-close:hover {
                color: var(--text-primary);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .alert {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        </style>
    `;
    
    if (!document.querySelector('.alert-styles')) {
        const styleSheet = document.createElement('div');
        styleSheet.className = 'alert-styles';
        styleSheet.innerHTML = alertStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
};

// Form Input Validation Visual Feedback
const formInputs = document.querySelectorAll('.form-input');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim()) {
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
        }
    });
    
    input.addEventListener('input', () => {
        if (input.type === 'email' && input.value.trim()) {
            if (isValidEmail(input.value)) {
                input.classList.add('valid');
                input.classList.remove('invalid');
            } else {
                input.classList.add('invalid');
                input.classList.remove('valid');
            }
        }
    });
});

// Parallax Effect for Background Blobs
const parallaxElements = document.querySelectorAll('.blob');

const handleParallax = throttle(() => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.3;
        element.style.transform = `translateY(${rate * speed}px)`;
    });
}, 16);

window.addEventListener('scroll', handleParallax);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Enter key on buttons
    if (e.key === 'Enter' && e.target.matches('button, .btn')) {
        e.target.click();
    }
});

// Set Current Year in Footer
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Lazy Loading for Images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Performance Optimization: Reduce animations on low-end devices
const reduceAnimationsForLowEndDevices = () => {
    if (navigator.hardwareConcurrency <= 2) {
        document.body.classList.add('reduced-motion');
    }
};

// Call on page load
window.addEventListener('load', () => {
    reduceAnimationsForLowEndDevices();
    
    // Remove loading class if it exists
    document.body.classList.remove('loading');
    
    // Initialize any additional features that require full page load
    handleNavbarScroll();
    updateActiveNavLink();
    handleBackToTop();
});

// Error Handling for Images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn(`Failed to load image: ${this.src}`);
    });
});

// Service Worker Registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Accessibility Improvements
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Trap focus in mobile menu when open
const trapFocus = (element) => {
    const focusableEls = element.querySelectorAll(focusableElements);
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus();
                    e.preventDefault();
                }
            }
        }
    });
};

// Initialize focus trap for mobile menu
const mobileMenu = document.getElementById('nav-menu');
if (mobileMenu) {
    trapFocus(mobileMenu);
}

// Add skip to main content link for screen readers
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-gradient);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10001;
    transition: top 0.3s;
`;

skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

// Add main landmark if it doesn't exist
const main = document.querySelector('main');
if (!main) {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.setAttribute('id', 'main');
        heroSection.setAttribute('role', 'main');
    }
}

console.log('Portfolio website initialized successfully! 🚀');

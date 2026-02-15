// ===== Smooth Scroll pour les ancres =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Animations au scroll (Intersection Observer) =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            // Une fois l'animation déclenchée, on arrête d'observer cet élément
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer tous les éléments avec la classe 'fade-in'
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});

// ===== Navigation sticky avec changement d'apparence au scroll =====
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Ajouter une ombre à la nav quand on scroll
    if (currentScroll > 100) {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===== Animation du compteur (pour les stats si besoin) =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ===== Gestion du menu mobile (si ajouté plus tard) =====
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// ===== Ajout d'effets parallax légers =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== Tracking des clics sur les CTA (Analytics) =====
document.querySelectorAll('.cta-primary, .nav-cta, .pricing-cta').forEach(button => {
    button.addEventListener('click', function(e) {
        // Ici vous pouvez ajouter votre code de tracking
        // Exemple: gtag('event', 'cta_click', { cta_location: this.classList[0] });
        console.log('CTA clicked:', this.textContent.trim());
    });
});

// ===== Gestion du focus pour l'accessibilité =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ===== Lazy loading des images (si images ajoutées) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Fonction pour afficher un toast de confirmation =====
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ===== Prévention du spam sur les formulaires (si ajoutés) =====
let isSubmitting = false;

function handleFormSubmit(e) {
    if (isSubmitting) {
        e.preventDefault();
        return false;
    }
    
    isSubmitting = true;
    setTimeout(() => {
        isSubmitting = false;
    }, 3000);
    
    return true;
}

// ===== Easter Egg - Konami Code =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.style.animation = 'rainbow 2s ease-in-out';
        showToast('Code secret activé !');
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// ===== Log de bienvenue dans la console =====
console.log('%cBienvenue sur PlanFlow', 'font-size: 20px; color: #667EEA; font-weight: bold;');
console.log('%cVous êtes curieux ? Nous aussi', 'font-size: 14px; color: #4A5568;');
console.log('%cRejoignez-nous: hello@planflow.app', 'font-size: 12px; color: #718096;');

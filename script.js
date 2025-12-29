
document.addEventListener('DOMContentLoaded', () => {
    const seasonLink = document.getElementById("summerwinter");

    const now = new Date();
    const m = now.getMonth();
    const d = now.getDate();

    const isWinter =
    (m === 10 && d >= 20) || m === 11 || m <= 1 || (m === 2 && d < 20);


    seasonLink.href = isWinter ? "winter.css" : "summer.css";

    if (isWinter){
        document.getElementById('slide1').src = "img/winter fotos/winter 1.jpeg";
        document.getElementById('slide2').src = "img/winter fotos/winter 2.jpeg";
        document.getElementById('slide3').src = "img/winter fotos/winter 3.jpeg";
        document.getElementById('slide4').src = "img/winter fotos/winter 4.jpeg";
    }else{
        document.getElementById('slide1').src = "img/summer fotos/summer 2.jpeg";
        document.getElementById('slide2').src = "img/summer fotos/summer 3.jpeg";
        document.getElementById('slide3').src = "img/summer fotos/summer 4.jpeg";
        document.getElementById('slide4').src = "img/summer fotos/summer 5.jpeg";        
    }


    const languageSwitcher = document.querySelector('.language-switcher');
    const currentLangText = document.getElementById('current-lang-text');
    const langDropdown = document.querySelector('.lang-dropdown');

    let translations = {};
    let typingAnimationStarted = false;
    
    // Hide overlay h5 immediately to prevent flash of text
    const overlayH5 = document.querySelector('header .overlay h5');
    if (overlayH5) {
        overlayH5.classList.remove('typing-active');
    }

    // Fetch translations from the JSON file
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            // Set initial language based on browser language or default to English
            const userLang = navigator.language.split('-')[0];
            const initialLang = translations[userLang] ? userLang : 'en';
            setLanguage(initialLang);
        })
        .catch(error => console.error('Error loading translations:', error));

    // Function to update the content based on the selected language
    function setLanguage(lang) {
        if (!translations[lang]) return;

        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        // Update the current language display
        const langOption = langDropdown.querySelector(`[data-lang="${lang}"]`);
        if (langOption) {
            currentLangText.textContent = lang.toUpperCase();
        }

        // Update the page title
        if (translations[lang]['title']) {
            document.title = translations[lang]['title'];
        }

        // Apply typing effect to overlay h5 after language is set
        const overlayH5 = document.querySelector('header .overlay h5');
        if (overlayH5 && translations[lang]['overlay_h5']) {
            // Clear previous content and restart typing animation
            overlayH5.innerHTML = '';
            overlayH5.classList.remove('typing-active');
            typingAnimationStarted = false;
            
            setTimeout(() => {
                typeWriter(overlayH5, translations[lang]['overlay_h5'], 80);
                typingAnimationStarted = true;
            }, 1000);
        }
    }

    // Event listener for the language dropdown
    langDropdown.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.target.closest('a')?.dataset.lang;
        if (lang) {
            setLanguage(lang);
        }
    });

    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinksMobile = document.querySelector('.nav-links-mobile');

    if (hamburgerMenu && navLinksMobile) {
        hamburgerMenu.addEventListener('click', () => {
            navLinksMobile.classList.toggle('active');
            hamburgerMenu.classList.toggle('active'); 
        });

        // Close mobile menu when a link is clicked
        navLinksMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksMobile.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            });
        });
    }

    // Slideshow functionality
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        currentSlide = (currentSlide + 1) % slides.length;
    }

    // Initial slide display and start interval
    if (slides.length > 0) {
        showSlide();
        setInterval(showSlide, 5000); // Change slide every 5 seconds
    }

    // ===== COOL ANIMATIONS JAVASCRIPT =====

    // 1. Scroll-based animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for child elements
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations (excluding .abtb div elements)
    const animateElements = document.querySelectorAll('.gallery img, .catalog .box, .faq h3, .faq span');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        observer.observe(el);
    });

    // 5. Smooth scroll for navigation links
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

    // 6. Typing effect for overlay text
    function typeWriter(element, text, speed = 80) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i === 0) {
                // Make element visible when first character is about to be typed
                element.classList.add('typing-active');
            }
            
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // 7. Ripple effect for buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // 8. Dynamic gradient animation
    let gradientAngle = 0;
    setInterval(() => {
        gradientAngle += 1;
        document.documentElement.style.setProperty('--dynamic-gradient', 
            `linear-gradient(${gradientAngle}deg, var(--bg-light), var(--bg-lighter))`);
    }, 100);

    // 9. Loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Stagger animation for page elements
        const elements = document.querySelectorAll('header .overlay > *, .abtb div, .gallery > *');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });

    // 10. Enhanced mobile touch interactions
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback
        document.querySelectorAll('.catalog .box, .gallery img, .abtb div').forEach(el => {
            el.addEventListener('touchstart', () => {
                el.style.transform = 'scale(0.95)';
            });
            
            el.addEventListener('touchend', () => {
                el.style.transform = 'scale(1)';
            });
        });
    }
});

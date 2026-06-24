document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Preloader Page Loading Effect
    // ==========================================================================
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        });
        
        // Backup safety timeout
        setTimeout(() => {
            if (loader.style.display !== 'none') {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }
        }, 3000);
    }

    // ==========================================================================
    // Typing Animation Effect
    // ==========================================================================
    const typingText = document.getElementById('typing-text');
    const words = ["MERN Stack Applications.", "Robust RESTful APIs.", "Scalable Web Platforms."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeDelay = 1500; // Hold word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeDelay = 500; // Pause before next word
        }

        setTimeout(type, typeDelay);
    }
    
    if (typingText) {
        setTimeout(type, 1000);
    }

    // ==========================================================================
    // Navbar Scroll Background & Active Navigation Links
    // ==========================================================================
    const header = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Class toggle for scroll appearance
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active page link tracking
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').substring(1) === current) {
                a.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // Mobile Hamburger Menu Trigger
    // ==========================================================================
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('mobile-open');
            
            // Adjust body scroll if menu is open
            if (navMenu.classList.contains('mobile-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu on links clicks
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('mobile-open');
                document.body.style.overflow = '';
            });
        });
    }

    // Add CSS dynamic styling for mobile-open state directly
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @media (max-width: 768px) {
            .nav-links {
                position: fixed;
                top: 0;
                right: -100%;
                width: 75%;
                height: 100vh;
                background: rgba(17, 24, 39, 0.98);
                backdrop-filter: blur(15px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2.5rem;
                transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                border-left: 1px solid var(--card-border);
                box-shadow: -10px 0 30px rgba(0,0,0,0.5);
                z-index: 999;
            }
            .nav-links.mobile-open {
                right: 0;
            }
            .mobile-nav-toggle.active .bar:nth-child(1) {
                transform: translateY(8px) rotate(45deg);
            }
            .mobile-nav-toggle.active .bar:nth-child(2) {
                opacity: 0;
            }
            .mobile-nav-toggle.active .bar:nth-child(3) {
                transform: translateY(-8px) rotate(-45deg);
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // ==========================================================================
    // EmailJS Contact Form Integration
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // UI state loading feedback
            submitBtn.disabled = true;
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            // Send via EmailJS (Public key: 3QuX8btTaQ5nWIoYn, Template ID: template_xnsroei)
            // Service ID: default_service is normally set on the dashboard.
            emailjs.sendForm('default_service', 'template_xnsroei', contactForm)
                .then(() => {
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                })
                .catch((err) => {
                    console.error('EmailJS Error:', err);
                    formStatus.textContent = 'Failed to send message. Please try again later.';
                    formStatus.classList.add('error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                });
        });
    }

    // ==========================================================================
    // Intersection Observer for Animation on Scroll
    // ==========================================================================
    const cards = document.querySelectorAll('.card');
    
    // Set initial animation properties
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s';
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                observer.unobserve(card);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        animateObserver.observe(card);
    });
});

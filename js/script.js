/**
 * Premium Portfolio Main Application Logic
 * Coordinates scroll behaviours, typing animations, scroll-reveals,
 * stats counting, skill progress loads, mobile navigation, and form validation.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Mobile Menu Toggle & Navigation Backdrop
       ========================================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const navbar = document.getElementById('navbar');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Sticky navbar dynamic class and scroll progress indicator
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Sticky blur effect toggle
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Calculate and update scroll progress bar
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            if (scrollProgress) {
                scrollProgress.style.width = `${progress}%`;
            }
        }
    });

    /* ==========================================================================
       2. Custom Smooth Scrolling
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // height of navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       3. Active Navbar Link Highlighter on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');

    const highlightActiveSection = () => {
        const scrollPosition = window.scrollY + 120; // offset for detection

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav__menu a[href*=${sectionId}]`);

            if (scrollPosition > sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                if (correspondingLink) {
                    navLinks.forEach(link => link.classList.remove('active-link'));
                    correspondingLink.classList.add('active-link');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightActiveSection);

    /* ==========================================================================
       4. Hero Section Typing Effect
       ========================================================================== */
    const textElement = document.getElementById('typing-text');
    if (textElement) {
        const roles = [
            "Data Analyst",
            "Power BI Developer",
            "SQL Analyst",
            "BI Enthusiast"
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                // Delete text
                textElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // faster deletion
            } else {
                // Type text
                textElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 120; // steady typing
            }

            // Word completed
            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500; // Pause before typing next word
            }

            setTimeout(type, typingSpeed);
        };

        // Start typing
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       5. Stats Increment Animation (About Section)
       ========================================================================== */
    const statsSection = document.querySelector('.about__stats');
    const statNumbers = document.querySelectorAll('.stat__number');
    let statsAnimated = false;

    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isFloat = stat.getAttribute('data-float') === 'true';
            const duration = 2000; // milliseconds
            const startTime = performance.now();

            const updateCount = (timestamp) => {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing curve (easeOutQuad)
                const easedProgress = progress * (2 - progress);

                let currentVal = easedProgress * target;

                if (isFloat) {
                    stat.textContent = currentVal.toFixed(2);
                } else {
                    stat.textContent = Math.floor(currentVal);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    // Make sure final number is exact
                    stat.textContent = isFloat ? target.toFixed(2) : target;
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    /* ==========================================================================
       6. Skill Bars Animation
       ========================================================================== */
    const skillsContainer = document.querySelector('.skills__container');
    const progressLines = document.querySelectorAll('.skills__progress-bar');
    let skillsAnimated = false;

    const animateSkills = () => {
        progressLines.forEach(bar => {
            const percent = bar.getAttribute('data-percent');
            bar.style.width = percent;
        });
    };

    /* ==========================================================================
       7. Scroll-Reveal Observer Setup
       ========================================================================== */
    const scrollRevealElements = document.querySelectorAll('.reveal');

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Specific handles for stats and skills
                if (entry.target.classList.contains('about__stats') && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
                if (entry.target.classList.contains('skills__container') && !skillsAnimated) {
                    animateSkills();
                    skillsAnimated = true;
                }

                // Stop observing after action completes to optimize performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    scrollRevealElements.forEach(el => elementObserver.observe(el));

    // Fallback: If elements are in viewport immediately, activate them
    setTimeout(() => {
        scrollRevealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
                el.classList.add('active');
                if (el.classList.contains('about__stats') && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
                if (el.classList.contains('skills__container') && !skillsAnimated) {
                    animateSkills();
                    skillsAnimated = true;
                }
            }
        });
    }, 300);

    /* ==========================================================================
       8. Back-To-Top Button Functionality
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       9. Form Float Labels and Form Submission Validation
       ========================================================================== */
    const form = document.getElementById('contact-form');
    const formBtn = document.getElementById('form-submit-btn');

    if (form) {
        const formInputs = form.querySelectorAll('input, textarea');

        // Initial setup for existing browser autofills
        formInputs.forEach(input => {
            if (input.value !== '') {
                input.parentElement.classList.add('focused');
            }

            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (input.value === '') {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        // Form Validation & Submit Simulator
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();
            let isValid = true;

            // Clear previous errors
            form.querySelectorAll('.error-msg').forEach(el => el.remove());
            formInputs.forEach(input => input.classList.remove('input-error'));

            // Helper to render error text
            const showError = (inputEl, text) => {
                inputEl.classList.add('input-error');
                const err = document.createElement('span');
                err.className = 'error-msg';
                err.innerText = text;
                inputEl.parentElement.appendChild(err);
                isValid = false;
            };

            // Validations
            if (name.length < 2) {
                showError(document.getElementById('form-name'), 'Please enter a name (at least 2 letters)');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError(document.getElementById('form-email'), 'Please enter a valid email address');
            }

            if (message.length < 10) {
                showError(document.getElementById('form-message'), 'Please enter a message (at least 10 letters)');
            }

            if (!isValid) return;

            // Visual submission state trigger
            formBtn.disabled = true;
            const originalBtnText = formBtn.innerHTML;
            formBtn.innerHTML = `<span>Sending...</span><div class="spinner"></div>`;

            // Mock successful network post delayed by 1.5 seconds
            setTimeout(() => {
                // Reset form state
                form.reset();
                formInputs.forEach(input => input.parentElement.classList.remove('focused'));
                formBtn.disabled = false;
                formBtn.innerHTML = originalBtnText;

                // Fire custom toast alert
                showToast("Message Sent! Thank you, Dheeraj will reach out shortly.");
            }, 1500);
        });
    }

    // Dynamic Toast Alert Creator
    const showToast = (message) => {
        // Remove existing toast if present
        const oldToast = document.querySelector('.toast-notification');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-content">
                <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${message}</span>
            </div>
            <div class="toast-progress"></div>
        `;
        document.body.appendChild(toast);

        // Slide animation delay
        setTimeout(() => toast.classList.add('active'), 10);

        // Clear after 4 seconds
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 400); // Allow fadeout animation time
        }, 4000);
    };
});

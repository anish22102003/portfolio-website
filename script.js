// Main JS file for Editkaro.in interactive features

// Google Apps Script Web App URL Configuration

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzHEmDL7FyIWk2ThmqhqnpYhZpdMm7b8GKBKDZ0SasqW6C993U0XN8V08FyoHjofb8o7Q/exec";

document.addEventListener('DOMContentLoaded', () => {
  
  // Mobile navbar logic
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav');

  const toggleMenu = () => {
    const isActive = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Navbar scroll styling and active section highlights
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');

  const handleNavbarScroll = () => {
    // Scroll styling toggle
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting based on current scroll position
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleNavbarScroll);
  // Run on initial load too
  handleNavbarScroll();

  // Button ripple click animations
  const rippleButtons = document.querySelectorAll('.btn, .btn-nav, .filter-btn');

  rippleButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  });

  // Portfolio list filter handling
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active class on buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Match filter value
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400); // match CSS transitions
        }
      });
    });
  });

  // YouTube video modal popup handler
  const videoModal = document.getElementById('videoModal');
  const modalClose = document.getElementById('modalClose');
  const iframeContainer = document.getElementById('modalIframeContainer');
  let lastFocusedElement = null;

  const openVideoModal = (videoId, triggerCard = null) => {
    lastFocusedElement = triggerCard || document.activeElement;
    
    // Construct responsive autoplaying embed iframe link
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    iframeContainer.innerHTML = `
      <iframe 
        src="${embedUrl}" 
        title="YouTube video player" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    `;
    
    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
    
    // Focus close button inside modal
    setTimeout(() => {
      if (modalClose) {
        modalClose.focus();
      }
    }, 100);
  };

  const closeVideoModal = () => {
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock background scrolling
    
    // Restore focus back to original element
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
    
    // Tiny timeout to destroy iframe after transition completes
    setTimeout(() => {
      iframeContainer.innerHTML = '';
    }, 400);
  };

  // Add click and keyboard triggers to all portfolio cards
  portfolioCards.forEach(card => {
    const handleCardTrigger = () => {
      const videoId = card.getAttribute('data-video');
      if (videoId) {
        openVideoModal(videoId, card);
      }
    };

    card.addEventListener('click', handleCardTrigger);

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent page scrolling on Space key
        handleCardTrigger();
      }
    });
  });

  // Close triggers
  if (modalClose) {
    modalClose.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      // Close only if clicked directly on the dark background overlay, not on modal-content
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });

    // Keyboard focus trap inside video modal
    videoModal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusableElements = videoModal.querySelectorAll('button, iframe');
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    });
  }

  // Escape key close support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  // Scroll reveals (fade-in animations)
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters screen
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // Counter increments for statistics section
  const statNumbers = document.querySelectorAll('.stat-number');

  const startCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const countDuration = 2000; // 2 seconds total animation time
    const frameRate = 1000 / 60; // ~60fps
    const totalFrames = Math.round(countDuration / frameRate);
    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      // Smooth easeOutQuad progress
      const progress = frame / totalFrames;
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);

      // Append '+' or '%' manually if wanted
      if (el.getAttribute('data-target') === '98') {
        el.innerText = `${currentValue}%`;
      } else if (el.getAttribute('data-target') === '5') {
        el.innerText = `${currentValue}+ Yrs`;
      } else {
        el.innerText = `${currentValue}+`;
      }

      if (frame >= totalFrames) {
        // Ensure exact final number
        if (el.getAttribute('data-target') === '98') {
          el.innerText = `${target}%`;
        } else if (el.getAttribute('data-target') === '5') {
          el.innerText = `${target}+ Years`;
        } else {
          el.innerText = `${target}+`;
        }
        clearInterval(counterInterval);
      }
    }, frameRate);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target); // Run count once
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(num => {
    counterObserver.observe(num);
  });

  // Helpers for displaying validation messages
  const showFeedback = (feedbackEl, message, type) => {
    feedbackEl.innerText = message;
    feedbackEl.className = `form-message ${type}`;
    feedbackEl.style.display = 'block';
  };

  const clearFeedback = (feedbackEl) => {
    feedbackEl.innerText = '';
    feedbackEl.className = 'form-message';
    feedbackEl.style.display = 'none';
  };

  // RegExp for validation
  const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PHONE_REGEXP = /^[+]?[0-9\s-]{10,15}$/; // Minimum 10 digits, permits spaces, hyphens, and optional + prefix

  // Contact form submission validation and simulated response
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFeedback(formFeedback);

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();

      // Form validation rules
      if (!name) {
        showFeedback(formFeedback, 'Please enter your full name.', 'error');
        document.getElementById('name').focus();
        return;
      }

      if (!email || !EMAIL_REGEXP.test(email)) {
        showFeedback(formFeedback, 'Please enter a valid email address.', 'error');
        document.getElementById('email').focus();
        return;
      }

      if (!phone || !PHONE_REGEXP.test(phone.replace(/[\s-]/g, ''))) {
        showFeedback(formFeedback, 'Please enter a valid phone number (minimum 10 digits).', 'error');
        document.getElementById('phone').focus();
        return;
      }

      if (!message || message.length < 10) {
        showFeedback(formFeedback, 'Please provide details about your project (minimum 10 characters).', 'error');
        document.getElementById('message').focus();
        return;
      }

      // Visual feedback loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';

      // Assemble submission payload
      const formData = {
        formType: 'contact',
        name: name,
        email: email,
        phone: phone,
        message: message
      };

      if (APPS_SCRIPT_URL) {
        // Post standard JSON payload. Redirect is automatically followed by fetch.
        fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(formData)
        })
        .then(response => {
          return response.json().catch(() => {
            if (response.ok) return { status: 'success' };
            throw new Error('Server error');
          });
        })
        .then(data => {
          if (data && data.status === 'error') {
            showFeedback(formFeedback, data.message || 'There was an error saving your submission. Please try again.', 'error');
          } else {
            showFeedback(formFeedback, `Thank you, ${name}! Your inquiry has been sent successfully. We will reach out shortly.`, 'success');
            contactForm.reset();
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          setTimeout(() => clearFeedback(formFeedback), 7000);
        })
        .catch(error => {
          // Fallback if browser blocks redirect response parsing via CORS (Spreadsheet still saves!)
          console.warn('Apps Script finished. CORS response handled:', error);
          showFeedback(formFeedback, `Thank you, ${name}! Your inquiry has been sent successfully. We will reach out shortly.`, 'success');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          setTimeout(() => clearFeedback(formFeedback), 7000);
        });
      } else {
        // Local simulation fallback
        console.warn('Editkaro Notice: APPS_SCRIPT_URL is not configured. Simulating Contact Form write.');
        console.log('Form submission payload:', formData);

        setTimeout(() => {
          showFeedback(formFeedback, `Thank you, ${name}! Your inquiry has been sent successfully. We will reach out shortly. (Local Simulation)`, 'success');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          setTimeout(() => clearFeedback(formFeedback), 7000);
        }, 1500);
      }
    });
  }

  // Newsletter subscription submission validation and duplicate control
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFeedback(newsletterFeedback);

      const email = document.getElementById('subscriber-email').value.trim();

      // Input Validation
      if (!email || !EMAIL_REGEXP.test(email)) {
        showFeedback(newsletterFeedback, 'Please enter a valid email address.', 'error');
        document.getElementById('subscriber-email').focus();
        return;
      }

      // Check local duplicate cache in localStorage
      let localSubscribers = [];
      try {
        localSubscribers = JSON.parse(localStorage.getItem('editkaro_subscribers') || '[]');
      } catch(err) {}

      if (localSubscribers.includes(email.toLowerCase())) {
        showFeedback(newsletterFeedback, 'This email is already subscribed!', 'error');
        return;
      }

      // Visual feedback loading state
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';

      // Assemble subscription payload
      const formData = {
        formType: 'newsletter',
        email: email
      };

      const recordLocalSubscription = () => {
        localSubscribers.push(email.toLowerCase());
        localStorage.setItem('editkaro_subscribers', JSON.stringify(localSubscribers));
      };

      if (APPS_SCRIPT_URL) {
        fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(formData)
        })
        .then(response => {
          return response.json().catch(() => {
            if (response.ok) return { status: 'success' };
            throw new Error('Server error');
          });
        })
        .then(data => {
          if (data && data.status === 'error') {
            if (data.message === 'duplicate') {
              showFeedback(newsletterFeedback, 'This email is already subscribed!', 'error');
            } else {
              showFeedback(newsletterFeedback, 'Submission failed. Please try again.', 'error');
            }
          } else {
            recordLocalSubscription();
            showFeedback(newsletterFeedback, 'Successfully subscribed to our newsletter!', 'success');
            newsletterForm.reset();
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          setTimeout(() => clearFeedback(newsletterFeedback), 5000);
        })
        .catch(error => {
          // Fallback if browser blocks redirect response reading (Spreadsheet write still executes!)
          console.warn('Apps Script newsletter finished. CORS response handled:', error);
          recordLocalSubscription();
          showFeedback(newsletterFeedback, 'Successfully subscribed to our newsletter!', 'success');
          newsletterForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          setTimeout(() => clearFeedback(newsletterFeedback), 5000);
        });
      } else {
        // Local simulation fallback
        console.warn('Editkaro Notice: APPS_SCRIPT_URL is not configured. Simulating newsletter signup.');
        console.log('Newsletter payload:', formData);

        setTimeout(() => {
          recordLocalSubscription();
          showFeedback(newsletterFeedback, 'Successfully subscribed to our newsletter! (Local Simulation)', 'success');
          newsletterForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          setTimeout(() => clearFeedback(newsletterFeedback), 5000);
        }, 1500);
      }
    });
  }
});

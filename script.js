// Main JS file for Editkaro.in interactive features

document.addEventListener('DOMContentLoaded', () => {
  
  // Mobile navbar logic
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  };

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
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

  const openVideoModal = (videoId) => {
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
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  };

  const closeVideoModal = () => {
    videoModal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scrolling
    
    // Tiny timeout to destroy iframe after transition completes
    setTimeout(() => {
      iframeContainer.innerHTML = '';
    }, 400);
  };

  // Add click listener to all portfolio cards
  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.getAttribute('data-video');
      if (videoId) {
        openVideoModal(videoId);
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

  // Contact form submission validation and simulated response
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation check
      if (!name || !email || !message) {
        formFeedback.innerText = 'Please fill in all details.';
        formFeedback.className = 'form-message error';
        return;
      }

      // Visual feedback loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message <i class="fa-solid fa-spinner fa-spin"></i>';

      // Simulate network request delay (1.5 seconds)
      setTimeout(() => {
        formFeedback.innerText = `Thank you, ${name}! Your inquiry has been sent successfully. We will reach out shortly.`;
        formFeedback.className = 'form-message success';
        
        // Reset form
        contactForm.reset();
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        // Fade away success message after 5 seconds
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }
});

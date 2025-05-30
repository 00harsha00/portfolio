const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const sections = document.querySelectorAll('.section');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Check if required elements exist
  if (!toggleButton || !sections.length) {
    console.warn('Required elements not found in DOM');
    return;
  }

  // Initial theme setup
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    body.classList.add('dark-theme');
    toggleButton.innerHTML = '<i class="bx bx-sun"></i>';
  } else {
    body.classList.add('light-theme');
    toggleButton.innerHTML = '<i class="bx bx-moon"></i>';
  }

  // Theme toggle functionality
  toggleButton.addEventListener('click', handleThemeToggle);

  // System theme change listener
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);

  // Initialize all sections
  sections.forEach(section => {
    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    const stateIcon = section.querySelector('.state-icon');
    if (header && content && stateIcon) {
      header.addEventListener('click', () => toggleSection(section));
      content.style.display = 'block'; // Initially open
      section.classList.add('active');
      stateIcon.classList.add('bx-chevron-down');
      stateIcon.classList.remove('bx-chevron-up');
    }
  });

  // Initialize project carousel
  initializeProjectCarousel();

  // Initialize code editors for all sections
  initializeCodeEditors();

  // Initialize 3D hover effect for code and output areas
  initializeCodeEditorHover();
}

function handleThemeToggle() {
  body.classList.toggle('light-theme');
  body.classList.toggle('dark-theme');
  
  if (body.classList.contains('light-theme')) {
    toggleButton.innerHTML = '<i class="bx bx-moon"></i>';
  } else {
    toggleButton.innerHTML = '<i class="bx bx-sun"></i>';
  }
}

function handleSystemThemeChange(e) {
  body.classList.toggle('light-theme', !e.matches);
  body.classList.toggle('dark-theme', e.matches);
  toggleButton.innerHTML = e.matches ? '<i class="bx bx-sun"></i>' : '<i class="bx bx-moon"></i>';
}

function toggleSection(section) {
  const content = section.querySelector('.section-content');
  const stateIcon = section.querySelector('.state-icon');
  if (content && stateIcon) {
    if (content.style.display === 'none') {
      content.style.display = 'block';
      section.classList.add('active');
      stateIcon.classList.add('bx-chevron-down');
      stateIcon.classList.remove('bx-chevron-up');
    } else {
      content.style.display = 'none';
      section.classList.remove('active');
      stateIcon.classList.add('bx-chevron-up');
      stateIcon.classList.remove('bx-chevron-down');
    }
  }
}

function initializeProjectCarousel() {
  const carousel = document.querySelector('.project-grid');
  if (!carousel) return;

  // Adjust carousel behavior based on screen width
  const updateCarousel = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      carousel.style.display = 'flex';
      carousel.style.flexDirection = 'column';
      carousel.style.width = '100%';
      carousel.style.animation = 'none';
      carousel.style.overflowX = 'hidden';
      carousel.style.transform = 'translateX(0)';
    } else {
      carousel.style.display = 'flex';
      carousel.style.flexWrap = 'nowrap';
      carousel.style.gap = '1rem';
      carousel.style.width = '100%';
      carousel.style.overflowX = 'hidden'; // Prevent scroll-based interaction
      carousel.style.animation = 'none';
      carousel.style.transform = 'translateX(0)';
    }
  };

  // Initial setup
  updateCarousel();

  // Update on resize
  window.addEventListener('resize', updateCarousel);

  // Mouse drag support for tablet and large screens
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  carousel.addEventListener('mousedown', (e) => {
    if (window.innerWidth > 600) {
      isDragging = true;
      startX = e.clientX;
      prevTranslate = currentTranslate;
      carousel.style.cursor = 'grabbing';
      carousel.style.userSelect = 'none';
    }
  });

  carousel.addEventListener('mousemove', (e) => {
    if (isDragging && window.innerWidth > 600) {
      const deltaX = e.clientX - startX;
      currentTranslate = prevTranslate + deltaX;
      carousel.style.transform = `translateX(${currentTranslate}px)`;
    }
  });

  carousel.addEventListener('mouseup', () => {
    if (isDragging && window.innerWidth > 600) {
      isDragging = false;
      carousel.style.cursor = 'grab';
      // Snap to nearest card
      const cardWidth = carousel.querySelector('.project-card').offsetWidth + 20;
      const snapPosition = Math.round(currentTranslate / cardWidth) * cardWidth;
      currentTranslate = snapPosition;
      prevTranslate = snapPosition;
      carousel.style.transition = 'transform 0.3s ease';
      carousel.style.transform = `translateX(${snapPosition}px)`;
      setTimeout(() => {
        carousel.style.transition = 'none';
      }, 300);
    }
  });

  carousel.addEventListener('mouseleave', () => {
    if (isDragging && window.innerWidth > 600) {
      isDragging = false;
      carousel.style.cursor = 'grab';
      // Snap to nearest card
      const cardWidth = carousel.querySelector('.project-card').offsetWidth + 20;
      const snapPosition = Math.round(currentTranslate / cardWidth) * cardWidth;
      currentTranslate = snapPosition;
      prevTranslate = snapPosition;
      carousel.style.transition = 'transform 0.3s ease';
      carousel.style.transform = `translateX(${snapPosition}px)`;
      setTimeout(() => {
        carousel.style.transition = 'none';
      }, 300);
    }
  });

  // Keyboard support for tablet and large screens
  document.addEventListener('keydown', (e) => {
    if (window.innerWidth > 600) {
      const cardWidth = carousel.querySelector('.project-card').offsetWidth + 20;
      if (e.key === 'ArrowLeft') {
        currentTranslate += cardWidth; // Move right
        prevTranslate = currentTranslate;
        carousel.style.transition = 'transform 0.3s ease';
        carousel.style.transform = `translateX(${currentTranslate}px)`;
        setTimeout(() => {
          carousel.style.transition = 'none';
        }, 300);
      } else if (e.key === 'ArrowRight') {
        currentTranslate -= cardWidth; // Move left
        prevTranslate = currentTranslate;
        carousel.style.transition = 'transform 0.3s ease';
        carousel.style.transform = `translateX(${currentTranslate}px)`;
        setTimeout(() => {
          carousel.style.transition = 'none';
        }, 300);
      }
    }
  });

  // Touch support for all devices
  let touchStartX = 0;
  let touchPrevTranslate = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchPrevTranslate = currentTranslate;
  });

  carousel.addEventListener('touchmove', (e) => {
    if (window.innerWidth > 600) {
      const touchX = e.changedTouches[0].screenX;
      const deltaX = touchX - touchStartX;
      currentTranslate = touchPrevTranslate + deltaX;
      carousel.style.transform = `translateX(${currentTranslate}px)`;
    }
  });

  carousel.addEventListener('touchend', () => {
    if (window.innerWidth > 600) {
      const cardWidth = carousel.querySelector('.project-card').offsetWidth + 20;
      const snapPosition = Math.round(currentTranslate / cardWidth) * cardWidth;
      currentTranslate = snapPosition;
      touchPrevTranslate = snapPosition;
      carousel.style.transition = 'transform 0.3s ease';
      carousel.style.transform = `translateX(${snapPosition}px)`;
      setTimeout(() => {
        carousel.style.transition = 'none';
      }, 300);
    }
  });
}

function startCarouselAnimation() {
  // Removed animation logic to keep projects static
}

function initializeCodeEditors() {
  document.querySelectorAll('.code-editor').forEach(editor => {
    const outputArea = editor.querySelector('.output-area');
    const button = editor.querySelector('.execute-btn');
    
    if (!outputArea || !button) return;

    // Ensure output area is visible and initialized
    outputArea.style.display = 'block';

    // Add click event to refresh output with a fade animation
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      outputArea.classList.add('refresh');
      setTimeout(() => {
        outputArea.classList.remove('refresh');
      }, 300);
    });
  });
}

function initializeCodeEditorHover() {
  const codeEditors = document.querySelectorAll('.code-editor');

  codeEditors.forEach(editor => {
    const codeArea = editor.querySelector('.code-area');
    const outputArea = editor.querySelector('.output-area');

    if (!codeArea || !outputArea) return;

    editor.addEventListener('mousemove', (e) => {
      const rect = editor.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 10;
      const rotateX = -((y - centerY) / centerY) * 10;

      // Apply synchronized transform to both code and output areas
      codeArea.style.transform = `translateZ(20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      outputArea.style.transform = `translateZ(20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      codeArea.style.boxShadow = `0 15px 30px rgba(0, 0, 0, ${0.3 + Math.abs(rotateX + rotateY) / 40})`;
      outputArea.style.boxShadow = `0 15px 30px rgba(0, 0, 0, ${0.3 + Math.abs(rotateX + rotateY) / 40})`;
    });

    editor.addEventListener('mouseenter', () => {
      codeArea.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
      outputArea.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
    });

    editor.addEventListener('mouseleave', () => {
      codeArea.style.transform = 'translateZ(0) rotateX(0deg) rotateY(0deg)';
      outputArea.style.transform = 'translateZ(0) rotateX(0deg) rotateY(0deg)';
      codeArea.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
      outputArea.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
      codeArea.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      outputArea.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
  });
}

// Cleanup function for when the page is unloaded
window.addEventListener('beforeunload', () => {
  const carousel = document.querySelector('.project-grid');
  if (carousel) {
    carousel.style.animationPlayState = 'paused';
  }
});
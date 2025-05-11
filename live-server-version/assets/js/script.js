// Store panel data for easy access
const panelData = {
  workshops: {
    title: "Workshops",
    description: "Join hands-on workshops led by industry experts",
    color: "#1e40af",
    template: "workshops-content"
  },
  lectures: {
    title: "Guest Lectures",
    description: "Hear from top thought leaders in technology",
    color: "#6366f1",
    template: "lectures-content"
  },
  theme: {
    title: "Theme",
    description: "Digital Horizons: Exploring the Future",
    color: "#0e7490",
    template: "theme-content"
  },
  sponsors: {
    title: "Sponsors",
    description: "Meet our partners supporting this event",
    color: "#7e22ce",
    template: "sponsors-content"
  }
};

// DOM elements
const panels = document.querySelectorAll('.panel');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalExtraContent = document.getElementById('modal-extra-content');
const closeButtons = document.querySelectorAll('.modal-close-btn, .modal-close-btn-text');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Set up panel hover effects and rotations with slight perspective
  panels.forEach(panel => {
    const panelId = panel.dataset.id;
    
    // Apply random subtle rotation
    const randomRotationY = (Math.random() * 10 - 5);
    panel.style.setProperty('--panel-rotation', `${randomRotationY}deg`);
    
    // Click event listener
    panel.addEventListener('click', () => {
      openModal(panelId);
    });
    
    // Mouse interaction for desktop
    panel.addEventListener('mousemove', (e) => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate rotation based on mouse position (subtle effect)
      const rotateX = -y * 0.05;
      const rotateY = x * 0.05;
      
      panel.style.transform = `translate(var(--panel-left), var(--panel-top)) 
                               rotateX(${rotateX}deg) 
                               rotateY(${rotateY + randomRotationY}deg)`;
    });
    
    // Reset transform on mouse leave
    panel.addEventListener('mouseleave', () => {
      panel.style.transform = `translate(var(--panel-left), var(--panel-top)) 
                               rotateY(${randomRotationY}deg)`;
    });
  });
  
  // Close modal on button click
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });
  
  // Close modal when clicking outside of it
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
  
  // Handle ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }
  
  // Add interactive animation to stars
  animateStars();
});

// Function to open modal with panel content
function openModal(panelId) {
  const panel = panelData[panelId];
  if (!panel) return;
  
  // Set modal content
  modalTitle.textContent = panel.title;
  modalTitle.style.color = panel.color;
  modalDescription.textContent = panel.description;
  
  // Load template content if available
  if (panel.template) {
    const template = document.getElementById(panel.template);
    if (template) {
      modalExtraContent.innerHTML = '';
      const content = template.content.cloneNode(true);
      modalExtraContent.appendChild(content);
    }
  }
  
  // Show modal with animation
  modalOverlay.classList.add('active');
  
  // Apply color theme to modal
  document.documentElement.style.setProperty('--color-accent', panel.color);
}

// Function to close modal
function closeModal() {
  modalOverlay.classList.remove('active');
  // Reset modal content after animation completes
  setTimeout(() => {
    modalExtraContent.innerHTML = '';
  }, 300);
}

// Function to animate stars
function animateStars() {
  const starsLayers = document.querySelectorAll('.stars-layer');
  
  // Parallax effect on mouse move
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    starsLayers.forEach((layer, index) => {
      const speed = (index + 1) * 0.01;
      const offsetX = (0.5 - x) * speed * 100;
      const offsetY = (0.5 - y) * speed * 100;
      
      layer.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${layer.dataset.rotation || 0}deg)`;
    });
  });
  
  // Start rotation animations
  starsLayers.forEach((layer, index) => {
    const rotation = Math.random() * 360;
    layer.dataset.rotation = rotation;
    layer.style.transform = `rotate(${rotation}deg)`;
  });
}

// Add animation to central orb
function initOrbAnimation() {
  const orb = document.querySelector('.event-orb');
  if (!orb) return;
  
  // Random pulse effect
  setInterval(() => {
    const intensity = 0.4 + Math.random() * 0.6;
    orb.style.boxShadow = `0 0 30px ${intensity * 10}px rgba(59, 130, 246, ${intensity * 0.6})`;
  }, 2000);
}

// Initialize orb animation
initOrbAnimation();

// Add a subtle parallax effect to the entire scene
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  const platform = document.querySelector('.central-platform');
  if (platform) {
    const offsetX = (0.5 - x) * 20;
    const offsetY = (0.5 - y) * 20;
    
    platform.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
  }
});

// Add some interactive animations to panels on load
window.addEventListener('load', () => {
  // Animate panels in with a slight delay between each
  panels.forEach((panel, index) => {
    setTimeout(() => {
      panel.style.opacity = '0';
      panel.style.transform = 'translate(var(--panel-left), calc(var(--panel-top) - 50px)) rotateY(var(--panel-rotation, 0deg))';
      
      setTimeout(() => {
        panel.style.transition = 'all 0.8s cubic-bezier(0.17, 0.84, 0.44, 1.05)';
        panel.style.opacity = '1';
        panel.style.transform = 'translate(var(--panel-left), var(--panel-top)) rotateY(var(--panel-rotation, 0deg))';
      }, 50);
    }, index * 150);
  });
  
  // Animate in the central platform
  const centralPlatform = document.querySelector('.central-platform');
  if (centralPlatform) {
    centralPlatform.style.opacity = '0';
    centralPlatform.style.transform = 'translate(-50%, -50%) scale(0.8)';
    
    setTimeout(() => {
      centralPlatform.style.transition = 'all 1s cubic-bezier(0.17, 0.84, 0.44, 1.05)';
      centralPlatform.style.opacity = '1';
      centralPlatform.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 300);
  }
});
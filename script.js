/* ============================================
   DORKSENSE CHAOS - INTERACTIVE MADNESS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // MOUSE TRAIL - Colored Circles on Move
  // ============================================
  const colors = [
    "#ff00ff",
    "#00ffff",
    "#ccff00",
    "#ffff00",
    "#ff0000",
    "#9900ff",
  ];
  let lastTrailTime = 0;
  const trailThrottle = 50; // 50ms throttle

  document.addEventListener("mousemove", function (e) {
    const now = Date.now();
    if (now - lastTrailTime < trailThrottle) return;
    lastTrailTime = now;

    const trail = document.createElement("div");
    trail.className = "mouse-trail";
    trail.style.left = e.pageX + "px";
    trail.style.top = e.pageY + "px";
    trail.style.background = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(trail);

    setTimeout(() => {
      trail.remove();
    }, 800);
  });

  // ============================================
  // SCROLL REVEAL - Fade in with Rotation
  // ============================================
  const revealElements = document.querySelectorAll(
    ".about-description, .education-card, .timeline-item, .project-card, .certification-card, .skill-item, .activity-card, .contact-item"
  );

  revealElements.forEach((el) => {
    el.classList.add("scroll-reveal");
  });

  function checkScroll() {
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight * 0.85) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", checkScroll);
  checkScroll(); // Initial check

  // ============================================
  // 3D TILT EFFECT on Cards
  // ============================================
  const tiltCards = document.querySelectorAll(
    ".project-card, .education-card, .certification-card"
  );

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  // ============================================
  // BUTTON EXPLOSION - Color Flash on Click
  // ============================================
  const buttons = document.querySelectorAll(
    ".btn, .primary-btn, .secondary-btn"
  );

  buttons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const explosionColors = [
        "#ff0000",
        "#ffff00",
        "#ccff00",
        "#00ffff",
        "#ff00ff",
        "#9900ff",
        "#ff0000",
        "#ffff00",
        "#ccff00",
        "#00ffff",
      ];
      let colorIndex = 0;

      const explosion = setInterval(() => {
        btn.style.backgroundColor = explosionColors[colorIndex];
        colorIndex++;

        if (colorIndex >= explosionColors.length) {
          clearInterval(explosion);
          btn.style.backgroundColor = "";
        }
      }, 50);
    });
  });

  // ============================================
  // TYPED TEXT EFFECT - Dynamic Header
  // ============================================
  const typedTextSpan = document.querySelector(".typed-text");
  const cursor = document.querySelector(".cursor");

  const textArray = [
    "LINUX DESTROYER",
    // "CODE DEMON",
    "CYBER WARRIOR",
    "FULL-STACK CHAOS",
    "DOCKER MASTER",
    "CTF CHAMPION",
    "FLAG HUNTER",
  ];

  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 2000;
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(
        0,
        charIndex - 1
      );
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingDelay + 1100);
    }
  }

  if (typedTextSpan) {
    setTimeout(type, newTextDelay + 250);
  }

  // ============================================
  // EXPLODING CIRCLES Animation (Hero Section)
  // ============================================
  function createExplodingCircle() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const circle = document.createElement("div");
    circle.className = "explode-circle";
    circle.style.left = Math.random() * 100 + "%";
    circle.style.top = Math.random() * 100 + "%";
    circle.style.borderColor =
      colors[Math.floor(Math.random() * colors.length)];

    hero.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 2000);
  }

  // Create exploding circles every 800ms
  setInterval(createExplodingCircle, 800);

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ============================================
  // SCROLL DOWN BUTTON
  // ============================================
  const scrollDownBtn = document.querySelector(".scroll-down");

  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", function () {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL for Navigation Links
  // ============================================
  const navLinks = document.querySelectorAll(".nav-link, .footer-links a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // ============================================
  // GLITCH EFFECT on Hero Title
  // ============================================
  const heroTitle = document.querySelector(".hero-title");

  if (heroTitle) {
    setInterval(() => {
      heroTitle.style.animation = "none";
      setTimeout(() => {
        heroTitle.style.animation = "";
      }, 10);
    }, 3000);
  }

  // ============================================
  // RANDOM ROTATION on Skill Items on Hover
  // ============================================
  const skillItems = document.querySelectorAll(".skill-item");

  skillItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      const randomRotation = Math.random() * 20 - 10;
      const randomScale = 1.1 + Math.random() * 0.2;
      this.style.transform = `rotate(${randomRotation}deg) scale(${randomScale})`;
    });
  });

  // ============================================
  // THEME TOGGLE (Disabled in Chaos Mode)
  // ============================================
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.style.display = "none";
  }

  // ============================================
  // MOBILE MENU (Hide in Chaos Mode)
  // ============================================
  const menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.style.display = "none";
  }

  // ============================================
  // CONTACT FORM Enhancement
  // ============================================
  const contactForm = document.querySelector(".contact-form form");

  if (contactForm) {
    const inputs = contactForm.querySelectorAll("input, textarea");

    inputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.style.transform = "scale(1.02) rotate(-1deg)";
      });

      input.addEventListener("blur", function () {
        this.style.transform = "";
      });
    });
  }

  // ============================================
  // FLOATING ANIMATION for Social Links
  // ============================================
  const socialLinks = document.querySelectorAll(
    ".social-links a, .footer-social a"
  );

  socialLinks.forEach((link, index) => {
    link.style.animation = `float ${2 + index * 0.3}s ease-in-out infinite`;
    link.style.animationDelay = `${index * 0.2}s`;
  });

  // ============================================
  // Add Floating Animation Keyframes
  // ============================================
  const style = document.createElement("style");
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(5deg); }
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // CHAOS METER (Easter Egg)
  // ============================================
  let chaosLevel = 0;
  let chaosClicks = 0;

  document.addEventListener("click", function () {
    chaosClicks++;
    chaosLevel = Math.min(100, chaosClicks);

    if (chaosLevel === 100) {
      document.body.style.animation = "hue-rotate 2s linear infinite";
      setTimeout(() => {
        document.body.style.animation = "";
        chaosClicks = 0;
        chaosLevel = 0;
      }, 5000);
    }
  });

  // ============================================
  // STROBE MODE (Secret: Press 'S' key)
  // ============================================
  let strobeActive = false;

  document.addEventListener("keydown", function (e) {
    if (e.key === "s" || e.key === "S") {
      strobeActive = !strobeActive;

      if (strobeActive) {
        document.body.classList.add("strobe");
      } else {
        document.body.classList.remove("strobe");
      }
    }
  });

  // ============================================
  // SCREEN SHAKE on Certain Interactions
  // ============================================
  function shakeScreen() {
    document.body.style.animation = "shake 0.5s ease";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 500);
  }

  // Add shake keyframes
  const shakeStyle = document.createElement("style");
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // Shake on footer click
  const footer = document.querySelector("footer");
  if (footer) {
    footer.addEventListener("click", shakeScreen);
  }

  // ============================================
  // KONAMI CODE Easter Egg (↑↑↓↓←→←→BA)
  // ============================================
  let konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiIndex = 0;

  document.addEventListener("keydown", function (e) {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;

      if (konamiIndex === konamiCode.length) {
        // ULTRA CHAOS MODE
        document.body.style.animation =
          "hue-rotate 1s linear infinite, shake 0.2s ease infinite";

        // Create massive explosions
        for (let i = 0; i < 50; i++) {
          setTimeout(() => {
            createExplodingCircle();
          }, i * 100);
        }

        setTimeout(() => {
          document.body.style.animation = "";
          konamiIndex = 0;
        }, 10000);
      }
    } else {
      konamiIndex = 0;
    }
  });

  // ============================================
  // CHAOS BADGE - Click to Toggle Ultra Chaos
  // ============================================
  const chaosBadge = document.querySelector(".chaos-badge");
  let ultraChaosActive = false;

  if (chaosBadge) {
    chaosBadge.addEventListener("click", function () {
      ultraChaosActive = !ultraChaosActive;

      if (ultraChaosActive) {
        // Activate ultra chaos
        document.body.style.animation = "hue-rotate 3s linear infinite";
        chaosBadge.textContent = "💀 ULTRA CHAOS 💀";
        chaosBadge.style.background = "var(--red-chaos)";

        // Spawn many circles
        for (let i = 0; i < 20; i++) {
          setTimeout(() => createExplodingCircle(), i * 100);
        }
      } else {
        // Deactivate
        document.body.style.animation = "";
        chaosBadge.textContent = "⚡ CHAOS MODE ⚡";
        chaosBadge.style.background = "var(--black-chaos)";
      }
    });
  }

  // ============================================
  // INITIALIZE - Log Chaos Message
  // ============================================
  console.log(`
  ██████╗  ██████╗ ██████╗ ██╗  ██╗███████╗███████╗███╗   ██╗███████╗███████╗
  ██╔══██╗██╔═══██╗██╔══██╗██║ ██╔╝██╔════╝██╔════╝████╗  ██║██╔════╝██╔════╝
  ██║  ██║██║   ██║██████╔╝█████╔╝ ███████╗█████╗  ██╔██╗ ██║███████╗█████╗  
  ██║  ██║██║   ██║██╔══██╗██╔═██╗ ╚════██║██╔══╝  ██║╚██╗██║╚════██║██╔══╝  
  ██████╔╝╚██████╔╝██║  ██║██║  ██╗███████║███████╗██║ ╚████║███████║███████╗
  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝
  
  CHAOS MODE ACTIVATED - WELCOME TO THE MADNESS
  
  SECRET COMMANDS:
  - Press 'S' for STROBE MODE
  - Try the Konami Code for ULTRA CHAOS
  - Click 100 times for HUE ROTATION
  
  Professional content in chaotic presentation. That's DORKSENSE.
  `);
});

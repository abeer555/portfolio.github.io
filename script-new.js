/* ============================================
   PROFESSIONAL PORTFOLIO - INTERACTIVE EFFECTS
   Senior-level implementation
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // 1. PRELOADER
  // ============================================
  window.addEventListener("load", () => {
    setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.classList.add("loaded");
      }
      ScrollTrigger.refresh();
    }, 1000);
  });

  // ============================================
  // 2. GENERATIVE CANVAS BACKGROUND
  // ============================================
  const canvas = document.getElementById("fluid");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fill();
      }
    }

    function initCanvas() {
      resize();
      for (let i = 0; i < 50; i++) particles.push(new Particle());
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 2000})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateCanvas);
    }

    window.addEventListener("resize", resize);
    initCanvas();
    animateCanvas();
  }

  // ============================================
  // 3. SMOOTH SCROLL (Lenis)
  // ============================================
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with ScrollTrigger if available
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ============================================
  // 4. INTERACTIVE CURSOR
  // ============================================
  const cursor = document.getElementById("cursor");
  const grid = document.getElementById("grid");
  if (cursor) {
    const cursorDot = cursor.querySelector(".cursor-dot");
    const cursorText = cursor.querySelector(".cursor-text");
    let mouseX = 0,
      mouseY = 0;
    let cursorX = 0,
      cursorY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Grid Ripple Effect
      if (grid) {
        const x = (mouseX / window.innerWidth) * 100;
        const y = (mouseY / window.innerHeight) * 100;
        grid.style.backgroundPosition = `${x}px ${y}px`;
      }
    });

    function animateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;

      cursorX += dx * 0.2;
      cursorY += dy * 0.2;

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor Hovers - Updated to support hover-trigger class
    const interactiveElements = document.querySelectorAll(
      "a, button, .img-reveal-wrapper, .project-card, .skill-item, .hover-trigger"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("hovered");
        if (cursorDot) cursorDot.classList.add("active");
        const text = el.getAttribute("data-cursor");
        if (text && cursorText) cursorText.innerText = text;
        else if (cursorText) cursorText.innerText = "VIEW";
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("hovered");
        if (cursorDot) cursorDot.classList.remove("active");
        if (cursorText) cursorText.innerText = "";
      });
    });
  }

  // ============================================
  // 5. SCROLL TRIGGERS (GSAP)
  // ============================================
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Hero text reveal - Trigger immediately on load
    const heroTexts = document.querySelectorAll(".clip-text");
    if (heroTexts.length > 0) {
      gsap.to(heroTexts, {
        y: 0,
        opacity: 1,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.5, // Wait for preloader
      });
    }

    // Image Reveal Logic
    const images = document.querySelectorAll(".img-reveal-wrapper");
    images.forEach((wrapper) => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top 80%",
        onEnter: () => wrapper.classList.add("in-view"),
      });

      // Parallax Effect for Images
      const img = wrapper.querySelector("img");
      if (img) {
        gsap.to(img, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll(".fade-in-up");
    fadeElements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => el.classList.add("visible"),
      });
    });

    // Horizontal Scroll Logic for Projects
    const horizontalSection = document.querySelector(".horizontal-outer");
    const horizontalInner = document.querySelector(".horizontal-scroll-inner");

    if (horizontalSection && horizontalInner) {
      // Refresh ScrollTrigger on window resize
      window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
      });

      gsap.to(horizontalInner, {
        x: () => -Math.max(0, horizontalInner.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalSection,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    // Text skew on scroll - REMOVED for smoother performance
    /*
    let proxy = { skew: 0 },
      skewSetter = gsap.quickSetter("section", "skewY", "deg"),
      clamp = gsap.utils.clamp(-2, 2);

    ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -300);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3",
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew),
          });
        }
      },
    });
    */
  }

  // ============================================
  // 5. TYPED TEXT EFFECT
  // ============================================
  const typedTextSpan = document.querySelector(".typed-text");
  if (typedTextSpan) {
    const textArray = [
      "LINUX SPECIALIST",
      "CYBERSECURITY EXPERT",
      "FULL-STACK DEVELOPER",
      "DOCKER ENTHUSIAST",
      "CTF COMPETITOR",
    ];

    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent +=
          textArray[textArrayIndex].charAt(charIndex);
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

    setTimeout(type, newTextDelay + 250);
  }

  // ============================================
  // 6. SMOOTH NAV LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ============================================
  // 7. BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ============================================
  // 8. NAVBAR SCROLL EFFECT
  // ============================================
  const navbar = document.getElementById("navbar");
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }
      lastScroll = currentScroll;
    });
  }

  // ============================================
  // 9. PROJECT CARD TILT EFFECT
  // ============================================
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // ============================================
  // 10. FORM VALIDATION
  // ============================================
  const contactForm = document.querySelector(".contact-form form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      if (!name || !email || !message) {
        e.preventDefault();
        alert("Please fill in all fields.");
      }
    });
  }

  // ============================================
  // 11. LAZY LOAD IMAGES
  // ============================================
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
});

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate On Scroll) - Fast for skimming
  AOS.init({
    duration: 400,
    once: false,
    mirror: true,
    offset: 100,
    easing: "ease-in-out-cubic",
    disable: window.innerWidth < 768 ? true : false, // Disable on mobile for better performance
  });

  // Variables
  const header = document.querySelector("header");
  const menuBtn = document.querySelector(".menu-btn");
  const navbar = document.querySelector("#navbar ul");
  const themeToggle = document.querySelector(".theme-toggle");
  const backToTopBtn = document.getElementById("back-to-top");
  const scrollDownBtn = document.querySelector(".scroll-down");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  const contactForm = document.getElementById("contactForm");
  const lastUpdatedElement = document.querySelector(".last-updated");

  // Create scroll progress indicator
  const scrollProgress = document.createElement("div");
  scrollProgress.className = "scroll-progress";
  document.body.appendChild(scrollProgress);

  // Set last updated date
  if (lastUpdatedElement) {
    lastUpdatedElement.textContent = "Last Updated: 2025-03-09 23:02:48";
  }

  // Check for saved theme preference or use dark by default
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }

  // Enhanced scroll effects
  let ticking = false;

  function updateScrollEffects() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;

    // Update progress bar
    document.querySelector(".scroll-progress").style.width =
      scrollProgress + "%";

    // Header scroll effect
    if (scrollTop > 50) {
      header.classList.add("scrolled");
      backToTopBtn.classList.add("show");
    } else {
      header.classList.remove("scrolled");
      backToTopBtn.classList.remove("show");
    }

    // Parallax effects
    const parallaxElements = document.querySelectorAll(".parallax-element");
    parallaxElements.forEach((element) => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrollTop * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  }

  // Optimized scroll event with requestAnimationFrame
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }

  // Add scroll event listener
  window.addEventListener("scroll", onScroll);

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Add stagger effect for skill items
        if (entry.target.classList.contains("skills-grid")) {
          const skillItems = entry.target.querySelectorAll(".skill-item");
          skillItems.forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  const fadeElements = document.querySelectorAll(
    ".fade-in-up, .fade-in-left, .fade-in-right, .skills-grid"
  );
  fadeElements.forEach((el) => observer.observe(el));

  // Smooth scroll for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Interactive cursor follow effect
  const cursor = document.createElement("div");
  cursor.className = "cursor-follower";
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: rgba(99, 102, 241, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: all 0.1s ease;
    opacity: 0;
  `;
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX - 10 + "px";
    cursor.style.top = e.clientY - 10 + "px";
    cursor.style.opacity = "1";
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  // Enhanced back to top with smooth scroll
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Mobile menu toggle
  menuBtn.addEventListener("click", function () {
    this.classList.toggle("open");
    navbar.classList.toggle("show");
    document.body.classList.toggle("no-scroll");
  });

  // Close mobile menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      menuBtn.classList.remove("open");
      navbar.classList.remove("show");
      document.body.classList.remove("no-scroll");
    });
  });

  // Theme toggle
  themeToggle.addEventListener("click", function () {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      this.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      this.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });

  // Back to top button
  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Scroll down button
  scrollDownBtn.addEventListener("click", function () {
    const aboutSection = document.getElementById("about");
    aboutSection.scrollIntoView({ behavior: "smooth" });
  });

  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // Basic validation
      if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
      }

      // Here you would typically send the form data to a server
      // For now, we'll just simulate a successful submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        this.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 3000);
      }, 2000);
    });
  }

  // Typing animation
  const typedTextSpan = document.querySelector(".typed-text");
  const cursorSpan = document.querySelector(".cursor");

  const textArray = [
    "Intern @ C9Labs",
    "Competitive Programmer @ CodeChef",
    "Technical Team Member @ LUG VITC",
  ];
  const typingDelay = 100;
  const erasingDelay = 20;
  const newTextDelay = 200; // Delay between current and next text
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      if (!cursorSpan.classList.contains("typing"))
        cursorSpan.classList.add("typing");
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      cursorSpan.classList.remove("typing");
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      if (!cursorSpan.classList.contains("typing"))
        cursorSpan.classList.add("typing");
      typedTextSpan.textContent = textArray[textArrayIndex].substring(
        0,
        charIndex - 1
      );
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      cursorSpan.classList.remove("typing");
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingDelay + 1100);
    }
  }

  if (textArray.length) setTimeout(type, newTextDelay + 250);

  // Enhance project cards with subtle hover interactions
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const image = card.querySelector(".project-image img");

    card.addEventListener("mouseenter", function () {
      image.style.transform = "scale(1.1)";
    });

    card.addEventListener("mouseleave", function () {
      image.style.transform = "scale(1)";
    });
  });

  // Add subtle animation to skill icons
  const skillIcons = document.querySelectorAll(".skill-icon");

  skillIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.2) rotate(10deg)";
      this.style.color = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--accent-1");
    });

    icon.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) rotate(0deg)";
      this.style.color = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--primary-color");
    });
  });

  // Console log for user info
  console.log(
    `Portfolio loaded at: 2025-03-09 23:02:48 UTC by user: abeergupta0continue`
  );
});

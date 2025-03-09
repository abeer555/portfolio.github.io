// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    once: false,
    mirror: true,
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

  // Header scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
      backToTopBtn.classList.add("show");
    } else {
      header.classList.remove("scrolled");
      backToTopBtn.classList.remove("show");
    }

    // Update active navigation link based on scroll position
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
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
    "Linux Enthusiast",
    "Competitive Programmer",
    "Docker Expert",
    "Technical Team Member @ LUG VITC",
  ];
  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 2000; // Delay between current and next text
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

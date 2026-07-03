// script.js
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const revealElements = document.querySelectorAll(".reveal");
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroDotsContainer = document.querySelector(".hero-dots");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalClose = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const currentYear = document.getElementById("currentYear");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll);

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.classList.toggle("active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu");
      });
    });

    document.addEventListener("click", (event) => {
      const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);

      if (!isClickInsideNav) {
        navMenu.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu");
      }
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  let activeHeroSlide = 0;
  let heroTimer;

  const showHeroSlide = (index) => {
    heroSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });

    if (heroDotsContainer) {
      heroDotsContainer.querySelectorAll("button").forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    activeHeroSlide = index;
  };

  const startHeroCarousel = () => {
    if (heroSlides.length < 2) return;

    heroDotsContainer.innerHTML = "";

    heroSlides.forEach((_, index) => {
      const dotButton = document.createElement("button");
      dotButton.type = "button";
      dotButton.setAttribute("aria-label", `Exibir imagem ${index + 1}`);
      dotButton.addEventListener("click", () => {
        showHeroSlide(index);
        clearInterval(heroTimer);
        heroTimer = window.setInterval(() => {
          showHeroSlide((activeHeroSlide + 1) % heroSlides.length);
        }, 5000);
      });
      heroDotsContainer.appendChild(dotButton);
    });

    showHeroSlide(0);
    clearInterval(heroTimer);
    heroTimer = window.setInterval(() => {
      showHeroSlide((activeHeroSlide + 1) % heroSlides.length);
    }, 5000);
  };

  startHeroCarousel();

  const sections = document.querySelectorAll("main section[id]");
  const activateNavLink = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const currentLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (!currentLink) return;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"));
        currentLink.classList.add("active");
      }
    });
  };

  activateNavLink();
  window.addEventListener("scroll", activateNavLink);

  const openModal = (imageSrc, imageAlt) => {
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    modalImage.src = "";
    document.body.style.overflow = "";
  };

  portfolioItems.forEach((item) => {
    const detailButton = item.querySelector(".portfolio-detail-btn");
    const backArea = item.querySelector(".portfolio-card-back");
    const quoteButton = item.querySelector(".quote-btn");
    const whatsappButton = item.querySelector(".whatsapp-btn");
    const actionGroup = item.querySelector(".portfolio-back-actions");

    const toggleFlip = () => {
      item.classList.toggle("is-flipped");
    };

    const showWhatsApp = () => {
      if (actionGroup) {
        actionGroup.classList.add("show-whatsapp");
      }
    };

    const hideWhatsApp = () => {
      if (actionGroup) {
        actionGroup.classList.remove("show-whatsapp");
      }
    };

    if (detailButton) {
      detailButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleFlip();
      });
    }

    if (backArea) {
      backArea.addEventListener("click", (event) => {
        if (event.target.closest(".quote-btn") || event.target.closest(".whatsapp-btn")) {
          return;
        }
        event.stopPropagation();
        toggleFlip();
      });
    }

    if (quoteButton) {
      quoteButton.addEventListener("mouseenter", showWhatsApp);
      quoteButton.addEventListener("focus", showWhatsApp);
      quoteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        showWhatsApp();
        const contatoSection = document.getElementById("contato");
        if (contatoSection) {
          contatoSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    if (actionGroup) {
      actionGroup.addEventListener("mouseleave", hideWhatsApp);
      actionGroup.addEventListener("focusout", (event) => {
        if (!actionGroup.contains(event.relatedTarget)) {
          hideWhatsApp();
        }
      });
    }

    if (whatsappButton) {
      whatsappButton.addEventListener("mouseenter", showWhatsApp);
      whatsappButton.addEventListener("focus", showWhatsApp);
      whatsappButton.addEventListener("click", (event) => {
        event.stopPropagation();
        showWhatsApp();
        const whatsappUrl = event.currentTarget.getAttribute("data-whatsapp");
        if (whatsappUrl) {
          window.open(whatsappUrl, "_blank");
        }
      });
    }
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      const nome = document.getElementById("nome").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const servico = document.getElementById("servico").value.trim();
      const mensagem = document.getElementById("mensagem").value.trim();

      if (!nome || !telefone || !servico || !mensagem) {
        event.preventDefault();
        formStatus.textContent = "Preencha todos os campos antes de enviar.";
        return;
      }

      formStatus.textContent = "Solicitação enviada com sucesso. Em breve entraremos em contato.";
    });
  }
});

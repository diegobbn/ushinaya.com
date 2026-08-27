(() => {
  const initLightbox = () => {
    if (document.body.dataset.lightbox !== "project") {
      return;
    }

    const images = [...document.querySelectorAll(".photo-series .photo-block img")];

    if (!images.length) {
      return;
    }

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image viewer");
    lightbox.innerHTML = `
      <div class="lightbox__backdrop"></div>
      <div class="lightbox__panel">
        <div class="lightbox__toolbar">
          <p class="lightbox__counter"></p>
          <button class="lightbox__close" type="button" aria-label="Close image">×</button>
        </div>
        <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image">←</button>
        <figure class="lightbox__figure">
          <img class="lightbox__image" alt="" />
          <figcaption class="lightbox__caption">
            <span class="lightbox__title"></span>
          </figcaption>
        </figure>
        <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image">→</button>
      </div>`;

    document.body.appendChild(lightbox);

    const viewerImage = lightbox.querySelector(".lightbox__image");
    const viewerTitle = lightbox.querySelector(".lightbox__title");
    const viewerCounter = lightbox.querySelector(".lightbox__counter");
    const closeButton = lightbox.querySelector(".lightbox__close");
    const previousButton = lightbox.querySelector(".lightbox__nav--prev");
    const nextButton = lightbox.querySelector(".lightbox__nav--next");
    const backdrop = lightbox.querySelector(".lightbox__backdrop");
    let activeIndex = -1;
    let previousFocus = null;
    let closeTimer;

    const getFullSource = (image) => {
      const source = image.dataset.full || image.getAttribute("src");

      return source.replace(/-web-2400\.jpg$/, ".jpg");
    };

    const getCaption = (image) => {
      const caption = image.closest(".photo-block")?.querySelector(".caption-text");

      return caption?.textContent.trim() || image.alt;
    };

    const showImage = (index) => {
      activeIndex = (index + images.length) % images.length;
      const source = images[activeIndex];

      viewerImage.src = getFullSource(source);
      viewerImage.alt = source.alt;
      viewerTitle.textContent = getCaption(source);
      viewerCounter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
      previousButton.hidden = images.length < 2;
      nextButton.hidden = images.length < 2;
    };

    const open = (index) => {
      window.clearTimeout(closeTimer);
      previousFocus = document.activeElement;
      showImage(index);
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      window.requestAnimationFrame(() => lightbox.classList.add("is-open"));
      closeButton.focus();
    };

    const close = () => {
      if (lightbox.hidden) {
        return;
      }

      lightbox.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      closeTimer = window.setTimeout(() => {
        lightbox.hidden = true;
        viewerImage.removeAttribute("src");

        if (previousFocus && typeof previousFocus.focus === "function") {
          previousFocus.focus();
        }
      }, 180);
    };

    images.forEach((image, index) => {
      image.classList.add("is-zoomable");
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `Open image ${index + 1} enlarged`);

      image.addEventListener("click", () => open(index));
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(index);
        }
      });
    });

    closeButton.addEventListener("click", close);
    previousButton.addEventListener("click", () => showImage(activeIndex - 1));
    nextButton.addEventListener("click", () => showImage(activeIndex + 1));
    backdrop.addEventListener("click", close);

    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) {
        return;
      }

      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showImage(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showImage(activeIndex + 1);
      }
    });
  };

  initLightbox();

  const navContainer = document.getElementById("nav-container");

  if (!navContainer) {
    return;
  }

  fetch(new URL("nav.html", document.baseURI))
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Navigation request failed: ${response.status}`);
      }

      return response.text();
    })
    .then((navigation) => {
      navContainer.innerHTML = navigation;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const menuButton = document.querySelector(".menu-toggle");
      const sideNavigation = document.querySelector(".sidenav");

      document.querySelectorAll(".sidenav__projects a, .sidenav__meta a").forEach((link) => {
        const linkPage = new URL(link.href, document.baseURI).pathname.split("/").pop() || "index.html";

        if (linkPage === currentPage) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      });

      if (!menuButton || !sideNavigation) {
        return;
      }

      const setMenuState = (isOpen) => {
        sideNavigation.classList.toggle("open", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        menuButton.textContent = isOpen ? "×" : "☰";
      };

      menuButton.addEventListener("click", () => {
        setMenuState(!sideNavigation.classList.contains("open"));
      });

      sideNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          setMenuState(false);
        }
      });
    })
    .catch((error) => {
      console.error("Unable to load navigation", error);
    });
})();

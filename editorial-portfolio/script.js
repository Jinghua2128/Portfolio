const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageOverlay = document.createElement("div");
const drawerBackdrop = document.createElement("div");

pageOverlay.id = "page-overlay";
pageOverlay.className = "is-entering";
document.body.prepend(pageOverlay);
document.body.classList.add("is-loading");

drawerBackdrop.className = "drawer-backdrop";
drawerBackdrop.hidden = true;
document.body.appendChild(drawerBackdrop);

// Display names belong to account creation, not sign-in.
document.querySelectorAll(".auth-form").forEach((form) => {
    const mode = form.querySelector('select[id$="auth-mode"]');
    const nameInput = form.querySelector('input[id$="auth-name"]');
    if (!mode || !nameInput) return;

    const syncNameVisibility = () => {
        const isRegistering = mode.value === "register";
        nameInput.hidden = !isRegistering;
        nameInput.disabled = !isRegistering;
        Array.from(nameInput.labels || []).forEach((label) => {
            label.hidden = !isRegistering;
        });
    };

    mode.addEventListener("change", syncNameVisibility);
    // Reset fires before the browser restores the select's default value.
    form.addEventListener("reset", () => queueMicrotask(syncNameVisibility));
    window.addEventListener("pageshow", syncNameVisibility);
    syncNameVisibility();
});


window.addEventListener("pageshow", () => {
    pageOverlay.className = "is-entering";
    window.setTimeout(() => {
        pageOverlay.classList.remove("is-entering");
        document.body.classList.remove("is-loading");
    }, reducedMotion ? 0 : 540);
});

function closeMobileMenu() {
    mobileMenu?.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburger?.setAttribute("aria-label", "Open menu");
}

hamburger?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.toggle("open") || false;
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));

document.addEventListener("click", (event) => {
    if (mobileMenu?.classList.contains("open") && !mobileMenu.contains(event.target) && !hamburger?.contains(event.target)) closeMobileMenu();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) closeMobileMenu();
});

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
let activeDrawer = null;
let lastFocusedElement = null;

function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(focusableSelector)).filter((element) => element.getClientRects().length > 0);
}

function setBackgroundInert(isInert) {
    document.querySelectorAll("nav, main, footer, .mobile-menu, .skip-link").forEach((element) => {
        if (isInert) element.setAttribute("inert", "");
        else element.removeAttribute("inert");
    });
}

function openDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (!drawer) return;
    closeDrawer(false, true);
    lastFocusedElement = document.activeElement;
    activeDrawer = drawer;
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.hidden = false;
    drawerBackdrop.hidden = false;
    document.body.classList.add("drawer-open");
    setBackgroundInert(true);
    requestAnimationFrame(() => {
        drawer.classList.add("is-open");
        drawerBackdrop.classList.add("is-open");
        drawer.querySelector("[data-autofocus], button, input, select, textarea, a[href]")?.focus();
    });
}

function closeDrawer(restoreFocus = true, immediate = false) {
    if (!activeDrawer) return;
    const closingDrawer = activeDrawer;
    activeDrawer = null;
    closingDrawer.classList.remove("is-open");
    closingDrawer.removeAttribute("role");
    closingDrawer.removeAttribute("aria-modal");
    drawerBackdrop.classList.remove("is-open");
    document.body.classList.remove("drawer-open");
    setBackgroundInert(false);
    window.setTimeout(() => {
        closingDrawer.hidden = true;
        if (!activeDrawer) drawerBackdrop.hidden = true;
        if (restoreFocus) lastFocusedElement?.focus?.();
    }, immediate || reducedMotion ? 0 : 450);
}

drawerBackdrop.addEventListener("click", () => closeDrawer());

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (activeDrawer) closeDrawer();
        else closeMobileMenu();
    }
    if (event.key === "Tab" && activeDrawer) {
        const focusable = getFocusableElements(activeDrawer);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
});

document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-drawer-open]");
    if (opener) { event.preventDefault(); openDrawer(opener.dataset.drawerOpen); return; }
    if (event.target.closest("[data-drawer-close]")) { event.preventDefault(); closeDrawer(); }
});

window.PortfolioUI = { openDrawer, closeDrawer };

document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isExternal = link.target === "_blank" || /^(https?:|mailto:|tel:)/i.test(href);
    const isSamePageAnchor = href.startsWith("#");
    if (isExternal || isSamePageAnchor || link.hasAttribute("download")) return;
    link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        closeMobileMenu();
        pageOverlay.className = "is-leaving";
        window.setTimeout(() => { window.location.href = href; }, reducedMotion ? 0 : 340);
    });
});

const focusPanels = {
    interactive: { label: "Interactive Development", title: "Playable systems, web tools, and AR ideas.", copy: "I enjoy building experiences where people can click, explore, test, and respond instead of only watching from the outside.", tools: ["Unity", "Firebase", "JavaScript", "C#"] },
    motion: { label: "Motion & Video", title: "Edited stories with rhythm, timing, and polish.", copy: "I shape motion pieces, video edits, logo animation, and compositing work so the visuals feel clear and intentional.", tools: ["After Effects", "Premiere Pro", "Compositing", "Storyboards"] },
    threeD: { label: "3D Design", title: "Scenes, assets, and real-time walkthroughs.", copy: "I work with 3D environments, modular assets, materials, and camera walkthroughs for interactive and media experiences.", tools: ["Blender", "Maya", "Substance", "Unity"] },
    ux: { label: "UI/UX Thinking", title: "Research-led interfaces that people can understand.", copy: "I use personas, empathy maps, wireframes, and usability testing to make creative ideas easier to use.", tools: ["Figma", "Wireframes", "Usability", "Prototypes"] },
};

const skillPanels = {
    frontend: { label: "Frontend Development", title: "Responsive websites and interactive UI.", copy: "Clean layouts, UI states, and Firebase-connected features for desktop and mobile.", tools: ["HTML", "CSS", "JavaScript", "Firebase", "GitHub"] },
    game: { label: "Game Development", title: "Unity prototypes and gameplay interaction.", copy: "Playable flows, scene logic, and small systems that make ideas testable.", tools: ["Unity", "C#", "Python", "Gameplay", "AR"] },
    motion: { label: "Video & Motion Graphics", title: "Motion, editing, and compositing.", copy: "Timing, rhythm, transitions, and polish for video and motion work.", tools: ["After Effects", "Premiere Pro", "Compositing", "Editing", "Storytelling"] },
    threeD: { label: "3D Design", title: "3D scenes, assets, and real-time presentation.", copy: "Modelling, materials, composition, modular assets, and walkthrough capture.", tools: ["Blender", "Maya", "Substance Painter", "Shader Graph", "PureRef"] },
    ux: { label: "UI/UX & Design Tools", title: "Research, wireframes, and clear interfaces.", copy: "Research and prototypes that make interfaces easier to understand.", tools: ["Figma", "Wireframes", "Personas", "Empathy Maps", "Usability Testing"] },
    soft: { label: "Soft Skills", title: "Leadership, planning, and storytelling.", copy: "Event planning, cultural activities, teamwork, and clear communication.", tools: ["Leadership", "Event Planning", "Teamwork", "Communication", "Storytelling"] },
};

function renderInlineTags(container, tags) {
    if (!container) return;
    container.replaceChildren(...tags.map((tag) => { const item = document.createElement("span"); item.textContent = tag; return item; }));
}

function setupTabs(buttons, onActivate) {
    const activate = (button, moveFocus = false) => {
        buttons.forEach((item) => {
            const active = item === button;
            item.classList.toggle("is-active", active);
            item.setAttribute("aria-selected", String(active));
            item.tabIndex = active ? 0 : -1;
        });
        onActivate(button);
        if (moveFocus) button.focus();
    };
    buttons.forEach((button, index) => {
        button.addEventListener("click", () => activate(button));
        button.addEventListener("keydown", (event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            let nextIndex = index;
            if (event.key === "ArrowLeft") nextIndex = (index - 1 + buttons.length) % buttons.length;
            if (event.key === "ArrowRight") nextIndex = (index + 1) % buttons.length;
            if (event.key === "Home") nextIndex = 0;
            if (event.key === "End") nextIndex = buttons.length - 1;
            activate(buttons[nextIndex], true);
        });
    });
}

document.querySelectorAll("[data-focus-lab]").forEach((lab) => {
    const buttons = Array.from(lab.querySelectorAll("[data-focus-key]"));
    setupTabs(buttons, (button) => {
        const panel = focusPanels[button.dataset.focusKey];
        if (!panel) return;
        lab.querySelector("[data-focus-label]").textContent = panel.label;
        lab.querySelector("[data-focus-title]").textContent = panel.title;
        lab.querySelector("[data-focus-copy]").textContent = panel.copy;
        renderInlineTags(lab.querySelector("[data-focus-tools]"), panel.tools);
        lab.querySelector("[role='tabpanel']")?.setAttribute("aria-labelledby", button.id);
    });
});

document.querySelectorAll("[data-skills-console]").forEach((consoleElement) => {
    const buttons = Array.from(consoleElement.querySelectorAll("[data-skill-key]"));
    setupTabs(buttons, (button) => {
        const panel = skillPanels[button.dataset.skillKey];
        if (!panel) return;
        consoleElement.querySelector("[data-skill-label]").textContent = panel.label;
        consoleElement.querySelector("[data-skill-title]").textContent = panel.title;
        consoleElement.querySelector("[data-skill-copy]").textContent = panel.copy;
        renderInlineTags(consoleElement.querySelector("[data-skill-tools]"), panel.tools);
        consoleElement.querySelector("[role='tabpanel']")?.setAttribute("aria-labelledby", button.id);
    });
});

document.querySelectorAll("[data-life-carousel]").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll("[data-life-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-life-dot]"));
    const counter = carousel.querySelector("[data-life-counter]");
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let timer = null;
    const setSlide = (nextIndex, focusDot = false) => {
        activeIndex = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => { const active = index === activeIndex; slide.classList.toggle("is-active", active); slide.setAttribute("aria-hidden", String(!active)); });
        dots.forEach((dot, index) => { const active = index === activeIndex; dot.classList.toggle("is-active", active); dot.setAttribute("aria-selected", String(active)); dot.tabIndex = active ? 0 : -1; });
        if (counter) counter.textContent = `${activeIndex + 1} / ${slides.length}`;
        if (focusDot) dots[activeIndex]?.focus();
    };
    const stop = () => { if (timer) window.clearInterval(timer); timer = null; };
    const start = () => { if (reducedMotion || timer || slides.length < 2) return; timer = window.setInterval(() => { if (!document.hidden) setSlide(activeIndex + 1); }, 7000); };
    carousel.querySelector("[data-life-prev]")?.addEventListener("click", () => setSlide(activeIndex - 1));
    carousel.querySelector("[data-life-next]")?.addEventListener("click", () => setSlide(activeIndex + 1));
    dots.forEach((dot, index) => { dot.addEventListener("click", () => setSlide(index)); dot.addEventListener("keydown", (event) => { if (event.key === "ArrowLeft") { event.preventDefault(); setSlide(activeIndex - 1, true); } if (event.key === "ArrowRight") { event.preventDefault(); setSlide(activeIndex + 1, true); } }); });
    carousel.addEventListener("mouseenter", stop); carousel.addEventListener("mouseleave", start); carousel.addEventListener("focusin", stop); carousel.addEventListener("focusout", start);
    setSlide(activeIndex); start();
});

document.querySelectorAll(".contact-links a[data-contact-label]").forEach((link) => {
    const panel = link.closest(".contact-panel");
    const links = Array.from(panel?.querySelectorAll(".contact-links a[data-contact-label]") || []);
    const setPreview = () => {
        links.forEach((item) => item.classList.toggle("is-selected", item === link));
        const label = panel?.querySelector("#contact-preview-label");
        const copy = panel?.querySelector("#contact-preview-copy");
        if (label) label.textContent = link.dataset.contactLabel || "Contact";
        if (copy) copy.textContent = link.dataset.contactCopy || "Open to creative and technical opportunities.";
    };
    link.addEventListener("mouseenter", setPreview); link.addEventListener("focus", setPreview);
});

if ("IntersectionObserver" in window && !reducedMotion) {
    const revealTargets = document.querySelectorAll(".home-project-row, .hero-lab-card, .life-carousel, .skill-detail, .showcase-feature-card, .project-card, .blog-card, .contact-panel");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.animate([{ opacity: 0.35, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "none" });
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    revealTargets.forEach((target) => observer.observe(target));
}

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.createElement("div");
const drawerBackdrop = document.createElement("div");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = motionPreference.matches;
motionPreference.addEventListener("change", (event) => { reducedMotion = event.matches; });
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const drawerTimers = new WeakMap();
const backgroundInert = new Map();

overlay.id = "page-overlay";
overlay.className = "";
document.body.prepend(overlay);
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


let activeDrawer = null;
let lastFocusedElement = null;

window.addEventListener("pageshow", () => {
    // Only play the wipe when the visitor navigated inside the site. A direct
    // load or reload gets the page immediately, so the entrance never repeats.
    let arrivingFromSite = false;
    try {
        arrivingFromSite = sessionStorage.getItem("lgx-page-transition") === "pending";
    } catch { /* storage can be blocked; treat as direct load */ }
    if (!arrivingFromSite) {
        document.body.classList.remove("is-loading");
        return;
    }
    try { sessionStorage.removeItem("lgx-page-transition"); } catch { /* ignore */ }
    overlay.className = "is-entering";
    setTimeout(() => {
        overlay.classList.remove("is-entering");
        document.body.classList.remove("is-loading");
    }, reducedMotion ? 0 : 520);
});

if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("open");
        hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("open");
            hamburger.setAttribute("aria-expanded", "false");
        });
    });
}

if (hamburger && mobileMenu) {
    document.addEventListener("click", (event) => {
        if (mobileMenu.classList.contains("open") && !mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
            mobileMenu.classList.remove("open");
            hamburger.setAttribute("aria-expanded", "false");
        }
    });

    window.addEventListener("resize", () => {
        if (mobileMenu.classList.contains("open") && window.innerWidth > 1024) {
            mobileMenu.classList.remove("open");
            hamburger.setAttribute("aria-expanded", "false");
        }
    });
}

document.querySelectorAll(".hero-grid").forEach((grid) => {
    for (let i = 0; i < 40; i += 1) {
        grid.appendChild(document.createElement("span"));
    }
});

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(focusableSelector)).filter((element) => element.getClientRects().length > 0);
}

function openDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (!drawer) {
        return;
    }

    const focusOrigin = activeDrawer ? lastFocusedElement : document.activeElement;
    closeDrawer(false);
    clearTimeout(drawerTimers.get(drawer));
    lastFocusedElement = focusOrigin;
    activeDrawer = drawer;
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    const drawerHeading = drawer.querySelector("h2");
    if (drawerHeading && !drawer.hasAttribute("aria-label")) {
        drawer.setAttribute("aria-label", drawerHeading.textContent.trim() || "Dialog");
    }
    drawer.hidden = false;
    Array.from(document.body.children).forEach((element) => {
        if (element !== drawer && element !== drawerBackdrop && !element.matches("script, style")) {
            backgroundInert.set(element, element.inert);
            element.inert = true;
        }
    });
    drawerBackdrop.hidden = false;
    document.body.classList.add("drawer-open");

    requestAnimationFrame(() => {
        if (activeDrawer !== drawer) return;
        drawer.classList.add("is-open");
        drawerBackdrop.classList.add("is-open");
        const focusTarget = drawer.querySelector("[data-autofocus], button, input, select, textarea, a[href]");
        focusTarget?.focus();
    });
}

function closeDrawer(restoreFocus = true) {
    if (!activeDrawer) {
        return;
    }

    activeDrawer.classList.remove("is-open");
    drawerBackdrop.classList.remove("is-open");
    document.body.classList.remove("drawer-open");

    const closingDrawer = activeDrawer;
    const focusToRestore = lastFocusedElement;
    activeDrawer = null;
    backgroundInert.forEach((wasInert, element) => { element.inert = wasInert; });
    backgroundInert.clear();
    if (closingDrawer) {
        closingDrawer.removeAttribute("role");
        closingDrawer.removeAttribute("aria-modal");
    }

    drawerTimers.set(closingDrawer, setTimeout(() => {
        if (activeDrawer === closingDrawer) return;
        closingDrawer.hidden = true;
        if (!activeDrawer) {
            drawerBackdrop.hidden = true;
        }
        if (restoreFocus && !activeDrawer) {
            focusToRestore?.focus?.();
        }
    }, reducedMotion ? 0 : 260));
}

drawerBackdrop.addEventListener("click", () => closeDrawer());

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu?.classList.contains("open") && !activeDrawer) {
        mobileMenu.classList.remove("open");
        hamburger?.setAttribute("aria-expanded", "false");
        hamburger?.focus();
    }
    if (event.key === "Escape" && activeDrawer) {
        closeDrawer();
    }

    if (event.key === "Tab" && activeDrawer) {
        const focusable = getFocusableElements(activeDrawer);
        if (!focusable.length) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});

document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-drawer-open]");
    if (opener) {
        event.preventDefault();
        openDrawer(opener.dataset.drawerOpen);
        return;
    }

    const closer = event.target.closest("[data-drawer-close]");
    if (closer) {
        event.preventDefault();
        closeDrawer();
    }
});

window.PortfolioUI = {
    openDrawer,
    closeDrawer,
};

document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    const isExternal = link.target === "_blank" || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
    const isSamePageAnchor = href.startsWith("#");
    const isDownload = link.hasAttribute("download");

    if (isExternal || isSamePageAnchor || isDownload) {
        return;
    }

    link.addEventListener("click", (event) => {
        if (event.defaultPrevented || reducedMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
            return;
        }

        event.preventDefault();
        mobileMenu?.classList.remove("open");
        hamburger?.setAttribute("aria-expanded", "false");
        try { sessionStorage.setItem("lgx-page-transition", "pending"); } catch { /* ignore */ }
        overlay.className = "is-leaving";
        setTimeout(() => {
            window.location.href = href;
    }, 260);
    });
});

const focusPanels = {
    interactive: {
        label: "Interactive Development",
        title: "Playable systems, web tools and AR experiences.",
        copy: "I build interfaces and interactive systems that let people explore, practise and respond.",
        tools: ["Unity", "Firebase", "JavaScript", "C#"],
    },
    motion: {
        label: "Motion & Video",
        title: "Edited stories with rhythm, timing, and polish.",
        copy: "I shape motion pieces, video edits, logo animation, and compositing work so the visuals feel clear and intentional.",
        tools: ["After Effects", "Premiere Pro", "Compositing", "Storyboards"],
    },
    threeD: {
        label: "3D Design",
        title: "Scenes, assets, and real-time walkthroughs.",
        copy: "I work with 3D environments, modular assets, materials, and camera walkthroughs for interactive and media experiences.",
        tools: ["Blender", "Maya", "Substance", "Unity"],
    },
    ux: {
        label: "UI/UX Thinking",
        title: "Research-led interfaces that people can understand.",
        copy: "I use personas, empathy maps, wireframes, and usability testing to make creative ideas easier to use.",
        tools: ["Figma", "Wireframes", "Usability", "Prototypes"],
    },
};

const skillPanels = {
    frontend: {
        label: "Frontend Development",
        title: "Responsive websites and interactive UI.",
        copy: "Clean layouts, UI states, and Firebase-connected features for desktop and mobile.",
        tools: ["HTML", "CSS", "JavaScript", "Firebase", "GitHub"],
    },
    game: {
        label: "Game Development",
        title: "Unity prototypes and gameplay interaction.",
        copy: "Playable flows, scene logic, and small systems that make ideas testable.",
        tools: ["Unity", "C#", "Python", "Gameplay", "AR"],
    },
    motion: {
        label: "Video & Motion Graphics",
        title: "Motion, editing, and compositing.",
        copy: "Timing, rhythm, transitions, and polish for video and motion work.",
        tools: ["After Effects", "Premiere Pro", "Compositing", "Editing", "Storytelling"],
    },
    threeD: {
        label: "3D Design",
        title: "3D scenes, assets, and real-time presentation.",
        copy: "Modelling, materials, composition, modular assets, and walkthrough capture.",
        tools: ["Blender", "Maya", "Substance Painter", "Shader Graph", "PureRef"],
    },
    ux: {
        label: "UI/UX & Design Tools",
        title: "Research, wireframes, and clear interfaces.",
        copy: "Research and prototypes that make interfaces easier to understand.",
        tools: ["Figma", "Wireframes", "Personas", "Empathy Maps", "Usability Testing"],
    },
    soft: {
        label: "Soft Skills",
        title: "Leadership, planning, and storytelling.",
        copy: "Event planning, cultural activities, teamwork, and clear communication.",
        tools: ["Leadership", "Event Planning", "Teamwork", "Communication", "Storytelling"],
    },
};

function renderInlineTags(container, tags) {
    if (!container) {
        return;
    }
    container.innerHTML = "";
    tags.forEach((tag) => {
        const item = document.createElement("span");
        item.textContent = tag;
        container.appendChild(item);
    });
}

function activateButtonGroup(buttons, activeButton) {
    buttons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
    });
}

document.querySelectorAll("[data-focus-lab]").forEach((lab) => {
    const buttons = Array.from(lab.querySelectorAll("[data-focus-key]"));
    const label = lab.querySelector("[data-focus-label]");
    const title = lab.querySelector("[data-focus-title]");
    const copy = lab.querySelector("[data-focus-copy]");
    const tabPanel = lab.querySelector('[role="tabpanel"]');
    const tools = lab.querySelector("[data-focus-tools]");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const panel = focusPanels[button.dataset.focusKey];
            if (!panel) {
                return;
            }
            activateButtonGroup(buttons, button);
            label.textContent = panel.label;
            title.textContent = panel.title;
            copy.textContent = panel.copy;
            tabPanel?.setAttribute("aria-labelledby", button.id);
            renderInlineTags(tools, panel.tools);
        });
    });
});

document.querySelectorAll("[data-skills-console]").forEach((consoleEl) => {
    const buttons = Array.from(consoleEl.querySelectorAll("[data-skill-key]"));
    const label = consoleEl.querySelector("[data-skill-label]");
    const title = consoleEl.querySelector("[data-skill-title]");
    const copy = consoleEl.querySelector("[data-skill-copy]");
    const tools = consoleEl.querySelector("[data-skill-tools]");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const panel = skillPanels[button.dataset.skillKey];
            if (!panel) {
                return;
            }
            activateButtonGroup(buttons, button);
            label.textContent = panel.label;
            title.textContent = panel.title;
            copy.textContent = panel.copy;
            renderInlineTags(tools, panel.tools);
        });
    });
});

// Tab groups support arrows and Home/End without adding extra tab stops.
document.querySelectorAll('[role="tablist"]').forEach((group) => {
    const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
    const syncTabs = () => tabs.forEach((tab) => { tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1; });
    group.addEventListener("click", () => queueMicrotask(syncTabs));
    group.addEventListener("keydown", (event) => {
        const index = tabs.indexOf(event.target);
        if (index < 0 || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        tabs[next].click();
        tabs[next].focus();
        syncTabs();
    });
    syncTabs();
});

document.querySelectorAll("[data-life-carousel]").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll("[data-life-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-life-dot]"));
    const previousButton = carousel.querySelector("[data-life-prev]");
    const nextButton = carousel.querySelector("[data-life-next]");
    const counter = carousel.querySelector("[data-life-counter]");
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let autoplayTimer = null;
    let userPaused = false;
    const pauseButton = document.createElement("button");
    pauseButton.type = "button";
    pauseButton.className = "text-action carousel-pause";
    pauseButton.textContent = "Pause slideshow";
    pauseButton.setAttribute("aria-pressed", "false");
    carousel.appendChild(pauseButton);

    if (!slides.length) {
        return;
    }

    const setSlide = (nextIndex) => {
        activeIndex = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => {
            const isActive = index === activeIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });
        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-selected", String(isActive));
        });
        if (counter) {
            counter.textContent = `${activeIndex + 1} / ${slides.length}`;
        }
    };

    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    const startAutoplay = () => {
        if (reducedMotion || userPaused || document.hidden || carousel.matches(":hover, :focus-within") || autoplayTimer || slides.length < 2) {
            return;
        }
        autoplayTimer = setInterval(() => {
            if (!document.hidden) {
                setSlide(activeIndex + 1);
            }
        }, 6500);
    };

    previousButton?.addEventListener("click", () => setSlide(activeIndex - 1));
    nextButton?.addEventListener("click", () => setSlide(activeIndex + 1));
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => setSlide(index));
    });

    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            setSlide(activeIndex - 1);
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            setSlide(activeIndex + 1);
        }
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);
    pauseButton.addEventListener("click", () => {
        userPaused = !userPaused;
        pauseButton.textContent = userPaused ? "Play slideshow" : "Pause slideshow";
        pauseButton.setAttribute("aria-pressed", String(userPaused));
        stopAutoplay();
        startAutoplay();
    });
    motionPreference.addEventListener("change", () => { stopAutoplay(); startAutoplay(); });
    document.addEventListener("visibilitychange", () => { stopAutoplay(); startAutoplay(); });
    pauseButton.hidden = slides.length < 2;

    setSlide(activeIndex);
    startAutoplay();
});

{
    document.querySelectorAll(".hero-grid").forEach((grid) => {
        let lastLit = null;
        const lightTile = (tile) => {
            lastLit?.classList.remove("is-lit");
            lastLit = tile;
            lastLit?.classList.add("is-lit");
        };

        const pointerTarget = grid.closest(".hero") || grid;
        pointerTarget.addEventListener("pointermove", (event) => {
            if (reducedMotion || !finePointer.matches) return;
            if (event.target.closest(".hero-cta, .hero-lab, .btn, button, a")) {
                lastLit?.classList.remove("is-lit");
                lastLit = null;
                return;
            }

            const tiles = Array.from(grid.children);
            if (!tiles.length) {
                return;
            }
            const styles = window.getComputedStyle(grid);
            const columns = styles.gridTemplateColumns.split(" ").filter(Boolean).length || 1;
            const rect = grid.getBoundingClientRect();
            const x = Math.max(0, Math.min(columns - 1, Math.floor(((event.clientX - rect.left) / rect.width) * columns)));
            const rows = Math.ceil(tiles.length / columns);
            const y = Math.max(0, Math.min(rows - 1, Math.floor(((event.clientY - rect.top) / rect.height) * rows)));
            lightTile(tiles[y * columns + x]);
        });

        setInterval(() => {
            const tiles = Array.from(grid.children);
            if (!tiles.length || document.hidden || reducedMotion || grid.getBoundingClientRect().bottom < 0) {
                return;
            }
            lightTile(tiles[Math.floor(Math.random() * tiles.length)]);
        }, 1800);
    });
}

document.querySelectorAll(".contact-links a[data-contact-label]").forEach((link) => {
    const panel = link.closest(".contact-panel");
    const label = panel?.querySelector("#contact-preview-label");
    const copy = panel?.querySelector("#contact-preview-copy");
    const links = Array.from(panel?.querySelectorAll(".contact-links a[data-contact-label]") || []);

    const setPreview = () => {
        links.forEach((item) => item.classList.toggle("is-selected", item === link));
        if (label) {
            label.textContent = link.dataset.contactLabel || "Contact";
        }
        if (copy) {
            copy.textContent = link.dataset.contactCopy || "Open to creative and technical opportunities.";
        }
    };

    link.addEventListener("mouseenter", setPreview);
    link.addEventListener("focus", setPreview);
});

const revealTargets = document.querySelectorAll(".info-card, .project-card, .blog-card, .contact-panel, .featured-projects-panel, .skills-console, .life-carousel, .home-featured-card, .hero-lab");
const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Visible by default; a missed callback cannot hide real content.
                if (!reducedMotion && entry.target.animate) {
                    entry.target.animate([{ opacity: 0.55, translate: "0 14px" }, { opacity: 1, translate: "0 0" }], {
                        duration: 460, delay: Math.min(Array.from(entry.target.parentElement.children).indexOf(entry.target), 4) * 35,
                        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                    });
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 }) : null;
revealTargets.forEach((target) => revealObserver?.observe(target));

// Lightweight motion layer: scroll position, one responsive hero moment,
// restrained section choreography, and pointer feedback on project surfaces.
const scrollProgress = document.createElement("div");
const scrollProgressFill = document.createElement("span");
scrollProgress.className = "scroll-progress";
scrollProgress.setAttribute("aria-hidden", "true");
scrollProgress.appendChild(scrollProgressFill);
document.body.appendChild(scrollProgress);

const navbar = document.querySelector("#navbar");
const motionHero = document.querySelector(".hero");
let scrollFrame = 0;

const updateScrollMotion = () => {
    scrollFrame = 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scrollTop / scrollRange));

    scrollProgressFill.style.transform = `scaleX(${progress})`;
    navbar?.classList.toggle("is-scrolled", scrollTop > 18);

    if (motionHero && !reducedMotion) {
        motionHero.style.setProperty("--hero-grid-scroll", `${Math.min(52, scrollTop * 0.075)}px`);
    }
};

const requestScrollMotion = () => {
    if (!scrollFrame) {
        scrollFrame = window.requestAnimationFrame(updateScrollMotion);
    }
};

window.addEventListener("scroll", requestScrollMotion, { passive: true });
window.addEventListener("resize", requestScrollMotion);
updateScrollMotion();

if (motionHero) {
    let heroFrame = 0;
    let latestHeroPointer = null;

    const paintHeroPointer = () => {
        heroFrame = 0;
        if (!latestHeroPointer || reducedMotion || !finePointer.matches) {
            return;
        }

        const rect = motionHero.getBoundingClientRect();
        const x = Math.min(rect.width, Math.max(0, latestHeroPointer.clientX - rect.left));
        const y = Math.min(rect.height, Math.max(0, latestHeroPointer.clientY - rect.top));
        const xRatio = x / Math.max(1, rect.width) - 0.5;
        const yRatio = y / Math.max(1, rect.height) - 0.5;

        motionHero.style.setProperty("--hero-pointer-x", `${x}px`);
        motionHero.style.setProperty("--hero-pointer-y", `${y}px`);
        motionHero.style.setProperty("--hero-grid-x", `${xRatio * -10}px`);
        motionHero.style.setProperty("--hero-grid-y", `${yRatio * -8}px`);
    };

    motionHero.addEventListener("pointermove", (event) => {
        if (reducedMotion || !finePointer.matches) return;
        latestHeroPointer = event;
        motionHero.classList.add("is-pointer-active");
        if (!heroFrame) {
            heroFrame = window.requestAnimationFrame(paintHeroPointer);
        }
    });

    motionHero.addEventListener("pointerleave", () => {
        latestHeroPointer = null;
        motionHero.classList.remove("is-pointer-active");
        motionHero.style.setProperty("--hero-pointer-x", "50%");
        motionHero.style.setProperty("--hero-pointer-y", "44%");
        motionHero.style.setProperty("--hero-grid-x", "0px");
        motionHero.style.setProperty("--hero-grid-y", "0px");
    });
}

const motionSections = document.querySelectorAll("main > section");
motionSections.forEach((section) => section.classList.add("motion-section"));

if ("IntersectionObserver" in window && !reducedMotion) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-motion-visible");
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    motionSections.forEach((section) => sectionObserver.observe(section));
} else {
    motionSections.forEach((section) => section.classList.add("is-motion-visible"));
}

revealTargets.forEach((target) => {
    const siblings = Array.from(target.parentElement?.children || []).filter((item) => item.matches?.(".info-card, .project-card, .blog-card"));
    const siblingIndex = Math.max(0, siblings.indexOf(target));
    target.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 5) * 55}ms`);
});

const motionCardSelector = ".project-card, .blog-card, .info-card, .showcase-feature-card, .home-featured-card, .journal-card";
const prepareMotionCards = (root = document) => {
    const cards = root.matches?.(motionCardSelector)
        ? [root]
        : Array.from(root.querySelectorAll?.(motionCardSelector) || []);

    cards.forEach((card) => {
        if (card.dataset.motionDepthReady === "true") {
            return;
        }

        card.dataset.motionDepthReady = "true";
        card.classList.add("motion-depth");
        revealObserver?.observe(card);

        let cardFrame = 0;
        let cardPointer = null;

        const paintCardDepth = () => {
            cardFrame = 0;
            if (!cardPointer || reducedMotion || !finePointer.matches) {
                return;
            }

            const rect = card.getBoundingClientRect();
            const xRatio = (cardPointer.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
            const yRatio = (cardPointer.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
            card.style.setProperty("--motion-rotate-x", `${yRatio * -4.2}deg`);
            card.style.setProperty("--motion-rotate-y", `${xRatio * 4.2}deg`);
            card.style.setProperty("--motion-glow-x", `${(xRatio + 0.5) * 100}%`);
            card.style.setProperty("--motion-glow-y", `${(yRatio + 0.5) * 100}%`);
            card.style.setProperty("--motion-image-x", `${xRatio * -10}px`);
            card.style.setProperty("--motion-image-y", `${yRatio * -8}px`);
        };

        card.addEventListener("pointermove", (event) => {
            if (reducedMotion || !finePointer.matches) return;
            cardPointer = event;
            if (!cardFrame) {
                cardFrame = window.requestAnimationFrame(paintCardDepth);
            }
        });

        card.addEventListener("pointerleave", () => {
            cardPointer = null;
            card.style.setProperty("--motion-rotate-x", "0deg");
            card.style.setProperty("--motion-rotate-y", "0deg");
            card.style.setProperty("--motion-glow-x", "50%");
            card.style.setProperty("--motion-glow-y", "50%");
            card.style.setProperty("--motion-image-x", "0px");
            card.style.setProperty("--motion-image-y", "0px");
        });
    });
};

prepareMotionCards();

const motionMutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
                prepareMotionCards(node);
            }
        });
    });
});

motionMutationObserver.observe(document.body, { childList: true, subtree: true });

motionPreference.addEventListener("change", (event) => {
    reducedMotion = event.matches;
    if (!reducedMotion) return;
    document.getAnimations().forEach((animation) => animation.cancel());
    motionHero?.style.setProperty("--hero-grid-scroll", "0px");
    motionHero?.classList.remove("is-pointer-active");
    document.querySelectorAll(".hero-grid .is-lit").forEach((tile) => tile.classList.remove("is-lit"));
    document.querySelectorAll(".motion-depth").forEach((card) => {
        card.style.setProperty("--motion-rotate-x", "0deg");
        card.style.setProperty("--motion-rotate-y", "0deg");
    });
});

/* ---------------------------------------------------------------------------
   Motion layer 2 — entrance choreography, floating previews and small pointer
   rewards. Everything here is progressive enhancement: without it the page is
   still complete and readable.
   --------------------------------------------------------------------------- */
(() => {
    const pointerFine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const canAnimate = () => !reducedMotion && pointerFine();

    // 1. Hero entrance: the page wipe hides the first frame, then the title and
    //    supporting copy settle in while the grid takes over.
    const heroContent = document.querySelector(".hero-content");
    if (heroContent && !reducedMotion) {
        heroContent.style.animation = "none";
        heroContent.style.opacity = "1";
        const title = heroContent.querySelector(".hero-title");
        const rest = Array.from(heroContent.children).filter((child) => child !== title);
        window.setTimeout(() => {
            if (title) {
                // One clean mask reveal for the name; the rest of the page uses
                // quieter fades so the entrance does not repeat itself.
                title.animate([
                    { clipPath: "inset(0 0 100% 0)", transform: "translateY(24px)" },
                    { clipPath: "inset(0 0 0 0)", transform: "translateY(0)" },
                ], { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" });
            }
            rest.forEach((element, index) => {
                element.animate([
                    { opacity: 0, transform: "translateY(14px)" },
                    { opacity: 1, transform: "translateY(0)" },
                ], { duration: 640, delay: 190 + index * 80, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" });
            });
        }, 90);
    }

    // 2. Section headings reveal with a clip wipe. A timeout guarantees that a
    //    missed observer can never leave a heading invisible.
    const headings = Array.from(document.querySelectorAll(".page-title"));
    if (headings.length && !reducedMotion && "IntersectionObserver" in window) {
        const clearHeading = (element) => {
            element.style.clipPath = "";
            element.style.transform = "";
            element.style.opacity = "";
        };
        headings.forEach((element) => {
            // Do not pre-hide with clip-path: IntersectionObserver treats a
            // clipped element as not intersecting, so it would never reveal.
            element.style.transform = "translateY(16px)";
            element.style.opacity = "0";
        });
        const headingObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                headingObserver.unobserve(entry.target);
                const animation = entry.target.animate([
                    { clipPath: "inset(0 0 100% 0)", transform: "translateY(16px)", opacity: 0 },
                    { clipPath: "inset(0 0 0 0)", transform: "translateY(0)", opacity: 1 },
                ], { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" });
                const finish = () => {
                    animation.cancel();
                    clearHeading(entry.target);
                };
                animation.finished.then(finish).catch(finish);
            });
        }, { threshold: 0.4 });
        headings.forEach((element) => headingObserver.observe(element));
        // Only rescue headings that should already be visible; off-screen
        // headings keep waiting so their reveal still plays when scrolled to.
        window.setTimeout(() => {
            headings.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
                if (inViewport && getComputedStyle(element).opacity === "0") {
                    clearHeading(element);
                }
            });
        }, 3000);
    }

    // 3. Floating project preview. Hovering a project card pulls a larger copy
    //    of its cover out to the pointer; cards without photography show their
    //    monogram plate instead, so the interaction works for every project.
    if (canAnimate()) {
        const preview = document.createElement("div");
        preview.className = "cursor-preview";
        preview.setAttribute("aria-hidden", "true");
        preview.innerHTML = `
            <div class="cursor-preview-media"></div>
            <div class="cursor-preview-body">
                <span class="cursor-preview-tag"></span>
                <p class="cursor-preview-title"></p>
                <p class="cursor-preview-copy"></p>
            </div>`;
        document.body.appendChild(preview);

        const media = preview.querySelector(".cursor-preview-media");
        const tag = preview.querySelector(".cursor-preview-tag");
        const previewTitle = preview.querySelector(".cursor-preview-title");
        const previewCopy = preview.querySelector(".cursor-preview-copy");
        let visible = false;
        let activeCard = null;

        const place = (event) => {
            const width = 380;
            const height = Math.max(290, preview.offsetHeight || 0) + 24;
            const x = Math.min(Math.max(event.clientX + 26, 12), window.innerWidth - width - 12);
            const y = Math.min(Math.max(event.clientY - 40, 12), window.innerHeight - height - 12);
            preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        };

        const show = (card) => {
            if (card.classList.contains("journal-card")) {
                const source = card.querySelector(".journal-card-media");
                if (!source) return;
                media.innerHTML = source.innerHTML;
                media.className = "cursor-preview-media is-journal";
                const topic = card.querySelector(".journal-card-topic")?.textContent?.trim() || "";
                const date = card.querySelector(".journal-card-footer span")?.textContent?.trim() || "";
                tag.textContent = [topic, date].filter(Boolean).join(" · ");
                previewTitle.textContent = card.querySelector("h3")?.textContent?.trim() || "";
                previewCopy.textContent = card.querySelector(".journal-card-excerpt")?.textContent?.trim() || "";
                preview.classList.add("is-journal", "is-visible");
                visible = true;
                return;
            }

            const source = card.querySelector(".card-thumb, .showcase-feature-media, .home-featured-media");
            if (!source) return;
            media.innerHTML = source.innerHTML;
            media.className = "cursor-preview-media" + (source.classList.contains("has-image") ? " has-image" : " is-monogram");
            const title = card.querySelector(".card-title, h3");
            tag.textContent = title ? title.textContent.trim() : "";
            previewTitle.textContent = "";
            previewCopy.textContent = "";
            preview.classList.remove("is-journal");
            preview.classList.add("is-visible");
            visible = true;
        };

        const hide = () => {
            if (!visible) return;
            preview.classList.remove("is-visible");
            visible = false;
            activeCard = null;
        };

        document.addEventListener("pointermove", (event) => {
            if (!canAnimate()) return;
            const card = event.target.closest(".project-card, .journal-card");
            if (!card) {
                hide();
                return;
            }
            if (card.classList.contains("project-card") && event.target.closest("a, button")) {
                hide();
                return;
            }
            if (card !== activeCard) {
                activeCard = card;
                show(card);
            }
            if (visible) place(event);
        });

        document.addEventListener("pointerout", (event) => {
            const card = event.target.closest(".project-card, .journal-card");
            if (!card) return;
            if (event.relatedTarget && card.contains(event.relatedTarget)) return;
            hide();
        });

        window.addEventListener("scroll", hide, { passive: true });
        window.addEventListener("blur", hide);
    }

    // 4. Magnetic primary buttons: a few pixels of pull, no layout shift.
    if (canAnimate()) {
        document.querySelectorAll(".btn-primary").forEach((button) => {
            button.addEventListener("pointermove", (event) => {
                if (!canAnimate()) return;
                const rect = button.getBoundingClientRect();
                const x = (event.clientX - rect.left - rect.width / 2) / Math.max(1, rect.width / 2);
                const y = (event.clientY - rect.top - rect.height / 2) / Math.max(1, rect.height / 2);
                button.style.setProperty("--magnet-x", `${x * 4}px`);
                button.style.setProperty("--magnet-y", `${y * 3}px`);
            });
            button.addEventListener("pointerleave", () => {
                button.style.setProperty("--magnet-x", "0px");
                button.style.setProperty("--magnet-y", "0px");
            });
        });
    }

    // 5. Tab panels crossfade after their copy swaps.
    document.addEventListener("click", (event) => {
        const tab = event.target.closest("[data-focus-key], [data-skill-key]");
        if (!tab || reducedMotion) return;
        const container = tab.closest("[data-focus-lab], [data-skills-console]");
        const panel = container?.querySelector('[role="tabpanel"], .skill-detail');
        if (!panel) return;
        window.requestAnimationFrame(() => {
            panel.animate([
                { opacity: 0.35, transform: "translateY(7px)" },
                { opacity: 1, transform: "translateY(0)" },
            ], { duration: 360, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
        });
    });
})();

/* Site-wide reactive background: the body grid gains interactive nodes.
   Static under reduced motion; pauses off-screen and when the tab is hidden. */
(() => {
    const canvas = document.querySelector("[data-site-canvas]");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const spacing = 70;
    const state = {
        width: 0,
        height: 0,
        dots: [],
        ripples: [],
        pointer: { x: -9999, y: -9999, vx: 0, vy: 0, last: null },
        visible: true,
        frame: 0,
    };

    const build = () => {
        state.width = window.innerWidth;
        state.height = window.innerHeight;
        canvas.width = state.width * Math.min(2, window.devicePixelRatio || 1);
        canvas.height = state.height * Math.min(2, window.devicePixelRatio || 1);
        const ratio = Math.min(2, window.devicePixelRatio || 1);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const cols = Math.ceil(state.width / spacing) + 2;
        const rows = Math.ceil(state.height / spacing) + 3;
        state.dots = [];
        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < cols; col += 1) {
                state.dots.push({ bx: 35 + col * spacing, by: 35 + row * spacing, ox: 0, oy: 0, vx: 0, vy: 0 });
            }
        }
    };

    const scrollOffset = () => window.scrollY % spacing;

    const step = () => {
        const pointer = state.pointer;
        const offset = scrollOffset();
        const now = performance.now();
        state.ripples = state.ripples.filter((ripple) => now - ripple.start < 1100);
        for (const dot of state.dots) {
            dot.vx += -dot.ox * 0.09;
            dot.vy += -dot.oy * 0.09;
            const sx = dot.bx + dot.ox;
            const sy = dot.by - offset + dot.oy;
            const dx = sx - pointer.x;
            const dy = sy - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 190 && dist > 0.1) {
                const force = (1 - dist / 190) ** 2;
                dot.vx += (pointer.x - sx) / dist * force * 1.1;
                dot.vy += (pointer.y - sy) / dist * force * 1.1;
                dot.vx += pointer.vx * force * 0.16;
                dot.vy += pointer.vy * force * 0.16;
            }
            dot.vx *= 0.9;
            dot.vy *= 0.9;
            dot.ox += dot.vx * 0.72;
            dot.oy += dot.vy * 0.72;
            if (Math.abs(dot.ox) > 34) dot.ox = Math.sign(dot.ox) * 34;
            if (Math.abs(dot.oy) > 34) dot.oy = Math.sign(dot.oy) * 34;
        }
        pointer.vx *= 0.85;
        pointer.vy *= 0.85;
    };

    const draw = (time) => {
        const offset = scrollOffset();
        const pointer = state.pointer;
        context.clearRect(0, 0, state.width, state.height);
        if (pointer.x > -999) {
            const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 240);
            glow.addColorStop(0, "rgba(229, 231, 235, 0.05)");
            glow.addColorStop(1, "rgba(229, 231, 235, 0)");
            context.fillStyle = glow;
            context.fillRect(pointer.x - 240, pointer.y - 240, 480, 480);
        }
        for (const dot of state.dots) {
            const y = dot.by - offset + dot.oy;
            const x = dot.bx + dot.ox;
            if (y < -40 || y > state.height + 40) continue;
            const energy = Math.min(1, Math.hypot(dot.ox, dot.oy) / 26);
            context.beginPath();
            context.arc(x, y, 1.35 + energy * 1.9, 0, Math.PI * 2);
            context.fillStyle = energy > 0.02
                ? `rgba(229, 231, 235, ${0.15 + energy * 0.7})`
                : "rgba(229, 231, 235, 0.15)";
            context.fill();
        }
        for (const ripple of state.ripples) {
            const progress = Math.min(1, (time - ripple.start) / 1000);
            context.beginPath();
            context.arc(ripple.x, ripple.y, 28 + progress * 380, 0, Math.PI * 2);
            context.strokeStyle = `rgba(229, 231, 235, ${(1 - progress) ** 2 * 0.26})`;
            context.lineWidth = 1;
            context.stroke();
        }
    };

    const needsFrame = () => state.ripples.length > 0 || state.dots.some((dot) =>
        Math.abs(dot.ox) > 0.35 || Math.abs(dot.oy) > 0.35 ||
        Math.abs(dot.vx) > 0.35 || Math.abs(dot.vy) > 0.35
    );

    const tick = (time) => {
        state.frame = 0;
        if (!state.visible) return;
        step();
        draw(time);
        if (needsFrame()) state.frame = window.requestAnimationFrame(tick);
    };

    const kick = () => {
        if (!state.frame && state.visible && !reducedMotion) state.frame = window.requestAnimationFrame(tick);
    };

    build();
    draw(0);
    if (reducedMotion) return;

    window.addEventListener("pointermove", (event) => {
        const now = performance.now();
        const pointer = state.pointer;
        if (pointer.last) {
            const dt = Math.max(8, now - pointer.last.time);
            pointer.vx = Math.max(-26, Math.min(26, ((event.clientX - pointer.last.x) / dt) * 15));
            pointer.vy = Math.max(-26, Math.min(26, ((event.clientY - pointer.last.y) / dt) * 15));
        }
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.last = { x: event.clientX, y: event.clientY, time: now };
        kick();
    }, { passive: true });

    window.addEventListener("click", (event) => {
        if (event.target.closest("a, button, input, textarea, select, [role='tab'], [data-drawer-close]")) return;
        state.ripples.push({ x: event.clientX, y: event.clientY, start: performance.now() });
        const offset = scrollOffset();
        for (const dot of state.dots) {
            const dx = dot.bx + dot.ox - event.clientX;
            const dy = dot.by - offset + dot.oy - event.clientY;
            const dist = Math.hypot(dx, dy);
            if (dist > 340 || dist < 1) continue;
            const force = (1 - dist / 340) ** 2 * 5.5;
            dot.vx += (dx / dist) * force;
            dot.vy += (dy / dist) * force;
        }
        kick();
    });

    window.addEventListener("scroll", () => { draw(performance.now()); kick(); }, { passive: true });

    if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
            state.visible = entries[0].isIntersecting;
            if (state.visible) kick();
        }, { threshold: 0 }).observe(canvas);
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            state.visible = false;
        } else {
            state.visible = true;
            kick();
        }
    });

    let resizeTimer = 0;
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => { build(); draw(0); kick(); }, 160);
    });
})();

/* About timeline: reveal each stage as it enters, with a little stagger. */
(() => {
    const items = Array.from(document.querySelectorAll(".timeline-item"));
    if (!items.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            entry.target.animate([
                { opacity: 0, transform: "translateY(18px)" },
                { opacity: 1, transform: "translateY(0)" },
            ], { duration: 640, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" });
        });
    }, { threshold: 0.2 });
    items.forEach((item) => observer.observe(item));
})();

/* Home: Draft 02 split headings, rotating phrase and spotlight cards */
(() => {
    if (!document.body || !document.querySelector(".home-featured")) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Split-word section headings */
    const headings = Array.from(document.querySelectorAll(".split-title"));
    if (headings.length && !reduce) {
        headings.forEach((heading) => {
            const words = heading.textContent.trim().split(/\s+/);
            heading.textContent = "";
            words.forEach((word, index) => {
                const wrap = document.createElement("span");
                wrap.className = "split-word";
                wrap.style.setProperty("--split-delay", `${index * 42}ms`);
                const inner = document.createElement("span");
                inner.textContent = word;
                wrap.append(inner);
                heading.append(wrap);
                if (index < words.length - 1) heading.append(document.createTextNode(" "));
            });
        });
        if ("IntersectionObserver" in window) {
            const headingObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-revealed");
                    headingObserver.unobserve(entry.target);
                });
            }, { threshold: 0.35 });
            headings.forEach((heading) => headingObserver.observe(heading));
            window.setTimeout(() => {
                headings.forEach((heading) => {
                    const rect = heading.getBoundingClientRect();
                    if (rect.top < window.innerHeight) heading.classList.add("is-revealed");
                });
            }, 2200);
        } else {
            headings.forEach((heading) => heading.classList.add("is-revealed"));
        }
    } else {
        headings.forEach((heading) => heading.classList.add("is-revealed"));
    }

    /* Rotating hero phrase */
    document.querySelectorAll("[data-rotator]").forEach((element) => {
        if (reduce) return;
        let words = [];
        try { words = JSON.parse(element.dataset.rotator || "[]"); } catch { return; }
        if (words.length < 2) return;
        const original = element.textContent.trim();
        element.textContent = "";
        const items = words.map((word, index) => {
            const span = document.createElement("span");
            span.className = "rotator-word" + (index === 0 ? " is-active" : " is-out");
            span.textContent = word;
            span.setAttribute("aria-hidden", "true");
            element.append(span);
            return span;
        });
        element.classList.add("hero-rotator");
        element.setAttribute("aria-label", original);
        let index = 0;
        let timer = 0;
        const setWidth = (item) => { element.style.width = `${Math.ceil(item.offsetWidth)}px`; };
        const start = () => {
            window.clearInterval(timer);
            if (document.hidden) return;
            timer = window.setInterval(() => {
                const current = items[index];
                index = (index + 1) % items.length;
                const next = items[index];
                setWidth(next);
                current.classList.remove("is-active");
                current.classList.add("is-out");
                next.classList.remove("is-out");
                next.classList.add("is-in");
                next.getBoundingClientRect();
                window.requestAnimationFrame(() => {
                    next.classList.remove("is-in");
                    next.classList.add("is-active");
                });
            }, 3000);
        };
        setWidth(items[0]);
        document.fonts?.ready.then(() => setWidth(items[index]));
        window.addEventListener("resize", () => setWidth(items[index]));
        start();
        document.addEventListener("visibilitychange", start);
    });

    /* Spotlight cards */
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    document.querySelectorAll(".spot-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
            card.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
        });
        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--mx", "50%");
            card.style.setProperty("--my", "40%");
        });
    });
})();

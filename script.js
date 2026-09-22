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
overlay.className = "is-entering";
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
        overlay.className = "is-leaving";
        setTimeout(() => {
            window.location.href = href;
    }, 260);
    });
});

const focusPanels = {
    interactive: {
        label: "Interactive Development",
        title: "Playable systems, web tools, and AR ideas.",
        copy: "I enjoy building experiences where people can click, explore, test, and respond instead of only watching from the outside.",
        meter: "86%",
        tools: ["Unity", "Firebase", "JavaScript", "C#"],
    },
    motion: {
        label: "Motion & Video",
        title: "Edited stories with rhythm, timing, and polish.",
        copy: "I shape motion pieces, video edits, logo animation, and compositing work so the visuals feel clear and intentional.",
        meter: "84%",
        tools: ["After Effects", "Premiere Pro", "Compositing", "Storyboards"],
    },
    threeD: {
        label: "3D Design",
        title: "Scenes, assets, and real-time walkthroughs.",
        copy: "I work with 3D environments, modular assets, materials, and camera walkthroughs for interactive and media experiences.",
        meter: "80%",
        tools: ["Blender", "Maya", "Substance", "Unity"],
    },
    ux: {
        label: "UI/UX Thinking",
        title: "Research-led interfaces that people can understand.",
        copy: "I use personas, empathy maps, wireframes, and usability testing to make creative ideas easier to use.",
        meter: "82%",
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
    const meter = lab.querySelector("[data-focus-meter]");
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
            meter.style.width = panel.meter;
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

const revealTargets = document.querySelectorAll(".info-card, .project-card, .blog-card, .contact-panel, .featured-projects-panel, .skills-console, .life-carousel");
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

const motionCardSelector = ".project-card, .blog-card, .info-card, .showcase-feature-card";
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
            card.style.setProperty("--motion-rotate-x", `${yRatio * -2.4}deg`);
            card.style.setProperty("--motion-rotate-y", `${xRatio * 2.4}deg`);
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

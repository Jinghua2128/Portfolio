const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.createElement("div");

overlay.id = "page-overlay";
overlay.className = "is-entering";
document.body.prepend(overlay);
document.body.classList.add("is-loading");

window.addEventListener("pageshow", () => {
    overlay.className = "is-entering";
    setTimeout(() => overlay.classList.remove("is-entering"), 520);
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

document.querySelectorAll(".hero-grid").forEach((grid) => {
    for (let i = 0; i < 40; i += 1) {
        grid.appendChild(document.createElement("span"));
    }
});

document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    const isExternal = link.target === "_blank" || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
    const isSamePageAnchor = href.startsWith("#");

    if (isExternal || isSamePageAnchor) {
        return;
    }

    link.addEventListener("click", (event) => {
        event.preventDefault();
        mobileMenu?.classList.remove("open");
        hamburger?.setAttribute("aria-expanded", "false");
        overlay.className = "is-leaving";
        setTimeout(() => {
            window.location.href = href;
        }, 410);
    });
});

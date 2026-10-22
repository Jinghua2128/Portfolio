/* Public journal presentation. Firebase and owner editing remain in blog-firebase.js. */
(() => {
    "use strict";

    const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
    }[character]));
    const topic = (post) => String(post.category || "Journal").trim() || "Journal";
    const readingTime = (post) => `${Math.max(1, Math.ceil(String(post.body || post.excerpt || "").trim().split(/\s+/).length / 200))} min read`;

    function dateLabel(post) {
        const date = window.PortfolioContentOrder.date(post, "post");
        return date ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date) : "";
    }

    function guardImages(container) {
        container.querySelectorAll("img").forEach((image) => {
            const hideBrokenImage = () => {
                image.hidden = true;
                image.closest(".journal-card-media")?.classList.add("is-image-unavailable");
            };
            image.addEventListener("error", hideBrokenImage, { once: true });
            if (image.complete && !image.naturalWidth) hideBrokenImage();
        });
    }

    function create({ onRead, onLeave, resolveImage }) {
        const index = document.querySelector("#blog-index");
        if (!index) return null;
        const reader = document.querySelector("#blog-article");
        const list = document.querySelector("#blog-list");
        const topics = document.querySelector("#blog-topics");
        const search = document.querySelector("#blog-search");
        const heading = document.querySelector("#blog-read-title");
        const content = document.querySelector("#blog-read-content");
        const resultCount = document.querySelector("#blog-result-count");
        const empty = document.querySelector("#blog-empty");
        const sourceNote = document.querySelector("#blog-source-note");
        const copyButton = document.querySelector("#blog-copy-link");
        const copyStatus = document.querySelector("#blog-link-status");
        let posts = [];
        let settled = false;
        let renderedPost = "";
        let lastPostId = "";
        let indexScroll = 0;

        function route() {
            const params = new URLSearchParams(location.search);
            return { id: params.get("post"), category: params.get("topic") || "", query: params.get("q") || "" };
        }

        function articleURL(id) {
            const url = new URL(location.href);
            url.searchParams.set("post", id);
            url.hash = "";
            return `${url.pathname}${url.search}`;
        }

        function renderIndex() {
            const { category, query } = route();
            search.value = query;
            const counts = new Map();
            posts.forEach((post) => counts.set(topic(post), (counts.get(topic(post)) || 0) + 1));
            // Retain a stale linked topic so its empty state can still be understood/reset.
            if (category && !counts.has(category)) counts.set(category, 0);
            const filters = [["", posts.length], ...Array.from(counts).sort(([a], [b]) => a.localeCompare(b))];
            topics.innerHTML = filters.map(([name, count]) => `<button type="button" data-topic="${escape(name)}" aria-pressed="${name === category}"><span>${escape(name || "All entries")}</span><span class="journal-topic-count">${count}</span></button>`).join("");
            const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
            const visible = posts.filter((post) => (!category || topic(post) === category) && words.every((word) =>
                [post.title, post.excerpt, post.body, topic(post)].filter(Boolean).join(" ").toLocaleLowerCase().includes(word)));
            resultCount.textContent = `${visible.length} ${visible.length === 1 ? "entry" : "entries"}`;
            empty.hidden = visible.length !== 0;
            list.hidden = visible.length === 0;
            list.innerHTML = visible.map((post, position) => {
                const image = resolveImage(post);
                const date = dateLabel(post);
                return `<article class="journal-card" data-post-id="${escape(post.id)}">
                    <a class="journal-card-link" href="${escape(articleURL(post.id))}" data-read-post="${escape(post.id)}" aria-labelledby="journal-card-title-${position}">
                        <div class="journal-card-media${image ? "" : " is-image-unavailable"}">
                            <span class="journal-media-placeholder" aria-hidden="true"><span>// journal</span>${escape(topic(post))}</span>
                            ${image ? `<img src="${escape(image)}" alt="" loading="lazy" decoding="async" />` : ""}
                        </div>
                        <div class="journal-card-body">
                            <p class="journal-card-topic">${escape(topic(post))}</p>
                            <h3 id="journal-card-title-${position}">${escape(post.title || "Untitled Post")}</h3>
                            <p class="journal-card-excerpt">${escape(post.excerpt || post.body || "")}</p>
                            <div class="journal-card-footer"><span>${escape(date)}${date ? " · " : ""}${readingTime(post)}</span><span class="journal-read-arrow" aria-hidden="true">↗</span></div>
                        </div>
                    </a>
                </article>`;
            }).join("");
            guardImages(list);
        }

        function renderRoute({ focus = false, scroll = false } = {}) {
            const { id } = route();
            index.hidden = Boolean(id);
            reader.hidden = !id;
            copyStatus.textContent = "";
            if (!id) {
                if (renderedPost) onLeave();
                renderedPost = "";
                document.title = "Blog | Liu GuangXuan";
                renderIndex();
                if (focus) {
                    const origin = Array.from(list.querySelectorAll("[data-read-post]")).find((link) => link.dataset.readPost === lastPostId);
                    (origin || document.querySelector("#journal-title")).focus({ preventScroll: true });
                }
                if (scroll) window.scrollTo({ top: indexScroll, behavior: "instant" });
                return;
            }
            lastPostId = id;
            const post = posts.find((item) => item.id === id);
            copyButton.hidden = !post;
            const signature = post ? JSON.stringify(post) : `${id}:${settled}`;
            if (signature !== renderedPost) {
                onLeave();
                renderedPost = signature;
                if (post) {
                    onRead(post);
                    document.title = `${post.title || "Journal entry"} | Liu GuangXuan`;
                } else {
                    heading.textContent = settled ? "This entry isn’t available." : "Loading article…";
                    content.innerHTML = `<p class="journal-unavailable">${settled ? "The link may be outdated, or this entry may not be published. Browse all entries to find something else to read." : "Checking the journal for this entry. You can also browse the entries already available."}</p>`;
                    document.title = `${settled ? "Entry unavailable" : "Loading article"} | Liu GuangXuan`;
                }
            }
            if (focus) heading.focus({ preventScroll: true });
            if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
        }

        function updateFilters() {
            const url = new URL(location.href);
            const value = search.value;
            if (value) url.searchParams.set("q", value);
            else url.searchParams.delete("q");
            history.replaceState(history.state, "", `${url.pathname}${url.search}`);
            renderIndex();
        }

        search.addEventListener("input", updateFilters);
        topics.addEventListener("click", (event) => {
            const button = event.target.closest("[data-topic]");
            if (!button) return;
            const category = button.dataset.topic;
            const url = new URL(location.href);
            if (category) url.searchParams.set("topic", category);
            else url.searchParams.delete("topic");
            history.replaceState(history.state, "", `${url.pathname}${url.search}`);
            renderIndex();
            Array.from(topics.querySelectorAll("button")).find((item) => item.dataset.topic === category)?.focus({ preventScroll: true });
        });
        document.querySelector("#blog-clear-filters").addEventListener("click", () => {
            const url = new URL(location.href);
            url.searchParams.delete("topic");
            url.searchParams.delete("q");
            history.replaceState(history.state, "", `${url.pathname}${url.search}`);
            renderIndex();
            search.focus();
        });
        list.addEventListener("click", (event) => {
            const link = event.target.closest("[data-read-post]");
            if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            indexScroll = window.scrollY;
            history.pushState(null, "", link.href);
            renderRoute({ focus: true, scroll: true });
        });
        document.querySelector("#blog-back").addEventListener("click", () => {
            const url = new URL(location.href);
            url.searchParams.delete("post");
            history.pushState(null, "", `${url.pathname}${url.search}`);
            renderRoute({ focus: true, scroll: true });
        });
        copyButton.addEventListener("click", async () => {
            const url = new URL(location.href);
            url.searchParams.delete("q");
            url.searchParams.delete("topic");
            try {
                await navigator.clipboard.writeText(url.href);
                copyStatus.textContent = "Article link copied.";
            } catch {
                copyStatus.textContent = "Copy the article URL from your browser’s address bar.";
            }
        });
        window.addEventListener("popstate", () => renderRoute({ focus: true }));
        return {
            setPosts(nextPosts, options = {}) {
                posts = nextPosts;
                settled = Boolean(options.settled);
                sourceNote.hidden = !options.offline;
                sourceNote.textContent = options.offline ? "Showing local entries. Recent updates may be unavailable." : "";
                renderRoute();
            },
        };
    }

    window.PortfolioBlogPage = { create, dateLabel, readingTime, guardImages };
})();

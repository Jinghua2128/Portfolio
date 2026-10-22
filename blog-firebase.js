const defaultPosts = [
    {
        id: "echoworks-singapore-red-cross-playbook",
        day: "05",
        month: "Aug 2026",
        category: "Capstone / Pitch",
        title: "EchoWorks: Singapore Red Cross Playbook Pitch",
        excerpt: "Wrapped up our final EchoWorks pitch with my groupmate, presenting the finished solution for the Singapore Red Cross playbook.",
        body: "Today we finished pitching our final EchoWorks solution with my groupmate for the Singapore Red Cross playbook. We walked through the full solution, showed how the interactive training scenarios support workplace communication, and closed out the pitch with a Q&A session. It was a strong finish to the capstone journey: the planning, prototyping, and refinement all came together in one clear presentation.",
        coverImage: "imgs/Blogs/EchoWorks/photo.JPG",
        imageUrls: ["imgs/Blogs/EchoWorks/photo.JPG"],
        link: "",
    },
    {
        id: "shenzhen-oip",
        day: "05",
        month: "Sep 2024",
        category: "Overseas Learning",
        title: "Shenzhen Overseas Immersion Programme",
        excerpt: "A short reflection on overseas learning, collaboration, and cultural exposure in Shenzhen.",
        body: "The Shenzhen OIP gave me a chance to experience learning in a different environment and understand student life overseas. Through classes, activities, and cultural exposure, I gained a wider perspective on collaboration and creative practice.",
        coverImage: "imgs/Blogs/OIP/OIP_grp_photo.jpg",
        imageUrls: ["imgs/Blogs/OIP/OIP_grp_photo.jpg"],
        link: "",
    },
    {
        id: "ggf-china-booth",
        day: "08",
        month: "Nov 2024",
        category: "Cultural Storytelling",
        title: "GGF China Booth",
        excerpt: "A cultural booth experience combining Chinese culture, games, presentation, and media storytelling.",
        body: "I hosted the China booth and introduced attendees to Chinese culture and Black Myth: Wukong. The booth combined cultural sharing with modern game-related media, helping visitors connect with the topic in an engaging way.",
        coverImage: "imgs/Blogs/GGF/GGF_grp_photo.jpg",
        imageUrls: ["imgs/Blogs/GGF/GGF_grp_photo.jpg"],
        link: "",
    },
];

const authForm = document.querySelector("#auth-form");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const authName = document.querySelector("#auth-name");
const authMode = document.querySelector("#auth-mode");
const logoutButton = document.querySelector("#logout-button");
const authStatus = document.querySelector("#auth-status");
const authHint = document.querySelector("#auth-hint");
const blogList = document.querySelector("#blog-list");
const adminPanel = document.querySelector("#admin-panel");
const openPostDrawerButton = document.querySelector("#open-post-drawer");
const postForm = document.querySelector("#post-form");
const postIdInput = document.querySelector("#post-id");
const postTitleInput = document.querySelector("#post-title");
const postCategoryInput = document.querySelector("#post-category");
const postDayInput = document.querySelector("#post-day");
const postMonthInput = document.querySelector("#post-month");
const postCoverImageInput = document.querySelector("#post-cover-image");
const postImageUrlsInput = document.querySelector("#post-image-urls");
const postLinkInput = document.querySelector("#post-link");
const postExcerptInput = document.querySelector("#post-excerpt");
const postBodyInput = document.querySelector("#post-body");
const resetPostButton = document.querySelector("#reset-post-form");
const readDrawerContent = document.querySelector("#blog-read-content");
const readDrawerTitle = document.querySelector("#blog-read-title");
const managementPage = Boolean(postForm);

let currentUser = null;
let isAdmin = false;
let unsubscribePosts = null;
let activeCommentsUnsubscribe = null;
let activePost = null;
let latestPosts = [];
const postEditor = managementPage ? PortfolioEditor.mount(postForm, "post") : null;
const postImageUploads = managementPage ? PortfolioImageUpload.mount({ form: postForm, kind: "post" }) : null;
const blogPage = !managementPage && window.PortfolioBlogPage ? PortfolioBlogPage.create({
    onRead: openPost,
    onLeave: () => {
        activeCommentsUnsubscribe?.();
        activeCommentsUnsubscribe = null;
        activePost = null;
    },
    resolveImage: (post) => PortfolioEditor.safeURL(resolveBlogImage(post.coverImage || firstImage(post.imageUrls))),
}) : null;

function isConfiguredAdmin(user) {
    if (!managementPage || !user) {
        return false;
    }

    const uidList = Array.isArray(ADMIN_UIDS) ? ADMIN_UIDS : [];
    return !ALLOW_ANY_SIGNED_IN_USER_TO_EDIT && uidList.includes(user.uid);
}

function getDisplayName(user) {
    return user?.displayName || user?.email || "Signed-in visitor";
}

function setMessage(message, type = "") {
    if (!authStatus) return;
    authStatus.textContent = message;
    authStatus.className = `auth-status ${type}`.trim();
}

function formatPostData(doc) {
    return {
        id: doc.id,
        ...doc.data(),
    };
}

function fallbackPosts() {
    return defaultPosts.map((post, index) => ({ ...post, source: "fallback", sortOrder: index + 1 }));
}

function mergePosts(firebasePosts = []) {
    const postMap = new Map();

    fallbackPosts().forEach((post) => {
        postMap.set(post.id, post);
    });

    firebasePosts.forEach((post, index) => {
        const existing = postMap.get(post.id) || {};
        postMap.set(post.id, {
            ...existing,
            ...post,
            source: "firebase",
            sortOrder: post.sortOrder || 100 + index,
        });
    });

    return PortfolioContentOrder.newest(Array.from(postMap.values()), "post");
}

function renderPosts(posts, options = {}) {
    posts = PortfolioContentOrder.newest(posts.filter((post) => post.publicationState !== "draft" && post.state !== "draft"), "post");
    latestPosts = posts;
    if (blogPage) {
        blogPage.setPosts(posts, options);
        return;
    }
    blogList.innerHTML = "";

    posts.forEach((post) => {
        const article = document.createElement("article");
        article.className = "blog-card";
        article.dataset.postId = post.id;

        article.innerHTML = `
            <button class="blog-card-media" type="button" aria-label="Read ${escapeHtml(post.title || "blog post")}">
                ${renderCoverImage(post)}
            </button>
            <div class="blog-card-body">
                <div class="blog-card-meta">
                    <span>${escapeHtml(post.category || "Journal")}</span>
                    <span>${escapeHtml([post.day, post.month].filter(Boolean).join(" "))}</span>
                </div>
                <h2 class="card-title">${escapeHtml(post.title || "Untitled Post")}</h2>
                <p class="card-desc">${escapeHtml(post.excerpt || post.body || "")}</p>
                <div class="post-actions">
                    <button class="text-action read-post" type="button">Read more</button>
                </div>
            </div>
        `;

        article.querySelector(".read-post").addEventListener("click", () => openPost(post));
        article.querySelector(".blog-card-media").addEventListener("click", () => openPost(post));
        blogList.appendChild(article);
    });
}

function resolveBlogImage(image) {
    if (typeof image !== "string") return image;
    const match = image.match(/^(?:\.\/|\.\.\/|\/)?imgs\/(.+)$/);
    const moved = {
        "EchoWorks/photo.JPG": "Blogs/EchoWorks/photo.JPG",
        "OIP_grp_photo.jpg": "Blogs/OIP/OIP_grp_photo.jpg",
        "GGF_grp_photo.jpg": "Blogs/GGF/GGF_grp_photo.jpg",
        "EmpireAI/photo.JPG": "Blogs/empire-ai/empire-code-reception.jpg",
    };
    const path = match?.[1];
    const current = Object.hasOwn(moved, path) ? moved[path] : (Object.values(moved).includes(path) ? path : "");
    return current ? `imgs/${current}` : image;
}

function renderCoverImage(post) {
    const image = PortfolioEditor.safeURL(resolveBlogImage(post.coverImage || firstImage(post.imageUrls)));
    if (!image) {
        return `<span>${escapeHtml((post.category || "Post").slice(0, 2).toUpperCase())}</span>`;
    }

    return `<img src="${escapeHtml(image)}" alt="${escapeHtml(post.title || "Blog cover image")}" loading="lazy" />`;
}

function openPost(post) {
    activePost = post;
    readDrawerTitle.textContent = post.title || "Post Details";
    renderReadDrawer(post);
    if (!blogPage) PortfolioUI.openDrawer("blog-read-drawer");
    watchComments(post.id);
}

function renderReadDrawer(post) {
    let images = normalizeImageList(post.imageUrls).map(resolveBlogImage).filter(PortfolioEditor.safeURL);
    const coverImage = PortfolioEditor.safeURL(resolveBlogImage(post.coverImage));
    const body = post.body || post.excerpt || "";
    // Public reading shows each photo once; the owner/editor layout is unchanged.
    if (blogPage) images = [...new Set(images)].filter((image) => image !== coverImage);
    const publicMeta = blogPage ? `<div class="journal-post-meta"><span>${escapeHtml(post.category || "Journal")}</span><span>${escapeHtml(PortfolioBlogPage.dateLabel(post))}</span></div>` : "";

    readDrawerContent.innerHTML = `
        <article class="${blogPage ? "journal-post" : "drawer-post"}">
            ${publicMeta}
            ${blogPage && post.excerpt && post.excerpt !== body ? `<p class="journal-post-intro">${escapeHtml(post.excerpt)}</p>` : ""}
            ${coverImage ? `<img class="drawer-cover" src="${escapeHtml(coverImage)}" alt="${escapeHtml(post.title || "Blog cover image")}" loading="lazy" />` : ""}
            ${!blogPage ? `<p class="post-category">${escapeHtml(post.category || "Journal")}</p>
            <h3>${escapeHtml(post.title || "Untitled Post")}</h3>
            <p class="drawer-date">${escapeHtml([post.day, post.month].filter(Boolean).join(" "))}</p>` : ""}
            ${blogPage ? `<div class="journal-prose">${renderPostBody(body)}</div>` : renderPostBody(body)}
            ${PortfolioEditor.safeURL(post.link) ? `<a class="btn btn-secondary drawer-link" href="${escapeHtml(post.link)}" target="_blank" rel="noopener noreferrer">Open Link</a>` : ""}
            ${PortfolioEditor.safeURL(post.relatedProject) ? `<a class="btn btn-secondary drawer-link" href="${escapeHtml(post.relatedProject)}">Related project</a>` : ""}
            ${images.length ? `<div class="content-image-grid">${images.map((image, index) => `<img src="${escapeHtml(image)}" alt="${escapeHtml(post.title || "Blog image")} ${index + 1}" loading="lazy" />`).join("")}</div>` : ""}
            <div class="post-actions admin-post-actions"></div>
            <section class="comments-block" aria-label="Comments">
                <div class="comments-header">
                    ${blogPage ? "<h2>Comments</h2>" : "<h3>Comments</h3>"}
                    <span class="comment-count">Loading...</span>
                </div>
                <div class="comment-list"></div>
                <div class="comment-entry"></div>
            </section>
        </article>
    `;
    if (blogPage) PortfolioBlogPage.guardImages(readDrawerContent);

    const adminActions = readDrawerContent.querySelector(".admin-post-actions");
    if (isAdmin) {
        const editButton = document.createElement("button");
        editButton.className = "text-action";
        editButton.type = "button";
        editButton.textContent = "Edit post";
        editButton.addEventListener("click", () => fillPostForm(post));
        adminActions.appendChild(editButton);
        if (post.source === "firebase") {
            const deleteButton = document.createElement("button"); deleteButton.type = "button"; deleteButton.className = "text-action danger";
            deleteButton.textContent = defaultPosts.some((item) => item.id === post.id) ? "Reset saved changes" : "Delete post";
            deleteButton.addEventListener("click", () => deletePost(post)); adminActions.append(deleteButton);
        }
    }

    renderCommentEntry(post.id);
}

function renderCommentEntry(postId) {
    const entry = readDrawerContent.querySelector(".comment-entry");
    if (!entry) {
        return;
    }

    if (!currentUser) {
        entry.innerHTML = `
            <div class="login-hint">
                <p>Please log in to leave a comment.</p>
                <button class="btn btn-secondary" type="button" data-drawer-open="blog-login-drawer">Log in to comment</button>
            </div>
        `;
        return;
    }

    entry.innerHTML = `
        <form class="comment-form" data-post-id="${escapeHtml(postId)}">
            <textarea name="comment" rows="3" maxlength="2000" placeholder="Write a thoughtful comment" required="required"></textarea>
            <button class="btn btn-primary" type="submit">Post Comment</button>
        </form>
    `;

    entry.querySelector(".comment-form").addEventListener("submit", handleCommentSubmit);
}

function watchPosts() {
    if (unsubscribePosts) {
        unsubscribePosts();
    }

    // Keep the existing journal entries visible while Firestore connects.
    renderPosts(mergePosts(), { settled: !db, offline: !db });

    if (!db) {
        setMessage("Firebase is unavailable. Showing local blog content.", "error");
        return;
    }

    unsubscribePosts = db.collection("posts").onSnapshot((snapshot) => {
        const firebasePosts = snapshot.empty ? [] : snapshot.docs.map(formatPostData);
        const posts = mergePosts(firebasePosts);
        renderPosts(posts, { settled: true });
        if (activePost && !blogPage) {
            const refreshed = posts.find((post) => post.id === activePost.id);
            if (refreshed) {
                activePost = refreshed;
                renderReadDrawer(refreshed);
                watchComments(refreshed.id);
            }
        }
    }, () => {
        renderPosts(mergePosts(), { settled: true, offline: true });
        setMessage("Could not load Firebase posts. Showing local blog content.", "error");
    });
}

function watchComments(postId) {
    if (activeCommentsUnsubscribe) {
        activeCommentsUnsubscribe();
    }

    const commentList = readDrawerContent.querySelector(".comment-list");
    const commentCount = readDrawerContent.querySelector(".comment-count");
    if (!commentList || !commentCount) {
        return;
    }

    if (!db) {
        commentCount.textContent = "Comments unavailable";
        return;
    }

    activeCommentsUnsubscribe = db.collection("posts").doc(postId).collection("comments")
        .orderBy("createdAt", "asc")
        .onSnapshot((snapshot) => {
            commentList.innerHTML = "";
            commentCount.textContent = `${snapshot.size} comment${snapshot.size === 1 ? "" : "s"}`;

            snapshot.forEach((doc) => {
                const comment = { id: doc.id, ...doc.data() };
                commentList.appendChild(createCommentElement(postId, comment));
            });
        }, () => {
            commentCount.textContent = "Comments unavailable";
        });
}

function createCommentElement(postId, comment) {
    const item = document.createElement("div");
    item.className = "comment-item";
    const canEdit = currentUser && isAdmin;

    item.innerHTML = `
        <div class="comment-meta">
            <strong>${escapeHtml(comment.authorName || "Visitor")}</strong>
            <span>${formatTimestamp(comment.createdAt)}</span>
        </div>
        <p class="comment-text">${escapeHtml(comment.text || "")}</p>
        <div class="comment-actions"></div>
    `;

    if (canEdit) {
        const actions = item.querySelector(".comment-actions");
        const editButton = document.createElement("button");
        editButton.className = "text-action";
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editComment(postId, comment));

        const deleteButton = document.createElement("button");
        deleteButton.className = "text-action danger";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteComment(postId, comment.id));

        actions.append(editButton, deleteButton);
    }

    return item;
}

async function handleCommentSubmit(event) {
    event.preventDefault();

    if (!currentUser) {
        PortfolioUI.openDrawer("blog-login-drawer");
        return;
    }

    const form = event.currentTarget;
    const textarea = form.elements.comment;
    const text = textarea.value.trim();

    if (!text) {
        return;
    }

    await db.collection("posts").doc(form.dataset.postId).collection("comments").add({
        text,
        uid: currentUser.uid,
        authorName: getDisplayName(currentUser),
        authorEmail: currentUser.email || "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    textarea.value = "";
}

async function editComment(postId, comment) {
    const updated = window.prompt("Edit comment:", comment.text || "");
    if (updated === null) {
        return;
    }

    const text = updated.trim();
    if (!text) {
        return;
    }

    await db.collection("posts").doc(postId).collection("comments").doc(comment.id).update({
        text,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

async function deleteComment(postId, commentId) {
    if (!window.confirm("Delete this comment?")) {
        return;
    }

    await db.collection("posts").doc(postId).collection("comments").doc(commentId).delete();
}

function fillPostForm(post) {
    if (!isAdmin || !postEditor.load({
        ...post, date: post.date || legacyPostDate(post), "cover-image": post.coverImage,
        "image-urls": normalizeImageList(post.imageUrls), "related-project": post.relatedProject,
    })) return;
    PortfolioUI.openDrawer("blog-post-drawer");
    postTitleInput.focus();
}

function resetPostForm() {
    postEditor.clear();
}

function legacyPostDate(post) {
    const match = String(post.month || "").match(/^([A-Za-z]{3})\s+(\d{4})$/);
    const month = match ? ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(match[1].toLowerCase()) + 1 : 0;
    return month && /^\d{1,2}$/.test(post.day) ? `${match[2]}-${String(month).padStart(2, "0")}-${String(post.day).padStart(2, "0")}` : "";
}

async function deletePost(post) {
    if (!isAdmin || !db) return;
    const isDefault = defaultPosts.some((item) => item.id === post.id);
    if (!confirm(isDefault ? `Reset saved changes to “${post.title}”? The original built-in post and its comments will remain.` : `Delete “${post.title}”? This cannot be undone here. Its comments will remain stored in Firebase.`)) return;
    try { await db.collection("posts").doc(post.id).delete(); activePost = null; activeCommentsUnsubscribe?.(); PortfolioUI.closeDrawer(); }
    catch (error) { window.alert(`Could not delete this post. ${error.message}`); }
}

async function savePost(event) {
    event.preventDefault();

    if (!isAdmin || postEditor.isBusy()) {
        postEditor.message("Only the configured admin can edit posts.", true);
        return;
    }
    if (postEditor.values().publication === "draft") { postEditor.saveDraft(); return; }
    if (!postEditor.validate()) return;
    if (!db) { postEditor.message("Firebase is unavailable. Save a local draft and try again later.", true); return; }
    const data = postEditor.values();
    const existing = latestPosts.find((item) => item.id === data.id);
    const docRef = data.id ? db.collection("posts").doc(data.id) : db.collection("posts").doc();
    const savingUID = currentUser.uid;
    postEditor.saveDraft();
    let day = postDayInput.value.trim(), month = postMonthInput.value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        const [year, monthNumber, date] = data.date.split("-"); day = date;
        month = `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(monthNumber) - 1]} ${year}`;
    }
    postEditor.setBusy(true);
    try {
        await docRef.set({
        title: postTitleInput.value.trim(),
        category: postCategoryInput.value.trim(),
        day, month, date: data.date, relatedProject: data["related-project"], publicationState: "published",
        coverImage: postCoverImageInput.value.trim(),
        imageUrls: parseCommaList(postImageUrlsInput.value),
        link: postLinkInput.value.trim(),
        excerpt: postExcerptInput.value.trim(),
        body: postBodyInput.value.trim(),
        sortOrder: existing?.sortOrder || Date.now(),
        ...(!existing ? { createdAt: firebase.firestore.FieldValue.serverTimestamp() } : {}),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

        if (currentUser?.uid === savingUID) postEditor.saved();
    } catch (error) { if (currentUser?.uid === savingUID) postEditor.message(`Could not publish. Your draft is still in the editor. ${error.message}`, true); }
    finally { postEditor.setBusy(false); }
}

authForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!auth) {
        setMessage("Firebase login is temporarily unavailable. Local posts are still visible.", "error");
        return;
    }
    setMessage("Checking account...");

    try {
        if (authMode.value === "register") {
            const credential = await auth.createUserWithEmailAndPassword(authEmail.value, authPassword.value);
            if (authName.value.trim()) {
                await credential.user.updateProfile({ displayName: authName.value.trim() });
            }
            setMessage("Account created. You can comment now.", "success");
        } else {
            await auth.signInWithEmailAndPassword(authEmail.value, authPassword.value);
            setMessage("Logged in successfully.", "success");
        }
        authForm.reset();
    } catch (error) {
        setMessage(error.message, "error");
    }
});

logoutButton?.addEventListener("click", () => {
    auth?.signOut();
});

postForm?.addEventListener("submit", savePost);
resetPostButton?.addEventListener("click", resetPostForm);
openPostDrawerButton?.addEventListener("click", (event) => {
    event.preventDefault(); event.stopPropagation();
    if (isAdmin && postEditor.startNew()) PortfolioUI.openDrawer("blog-post-drawer");
});

function applyBlogAuthState(user) {
    currentUser = user;
    isAdmin = isConfiguredAdmin(user);
    postImageUploads?.setUser(isAdmin ? user : null);
    postEditor?.setUser(isAdmin ? user : null);
    if (!isAdmin && document.querySelector("#blog-post-drawer.is-open")) PortfolioUI.closeDrawer();
    if (isAdmin && db) {
        const listedChoices = (projects) => projects
            .map((project) => window.PortfolioProjectPolicy?.prepare(project) || project)
            .filter((project) => window.PortfolioProjectPolicy?.isListed(project) !== false)
            .filter((project) => project.publicationState !== "draft" && project.state !== "draft" && project.title);
        postEditor.setProjectChoices(listedChoices(window.PortfolioProjectCatalog || []));
        db.collection("projects").get().then((snapshot) => {
            const choices = new Map((window.PortfolioProjectCatalog || []).map((project) => [project.id, project]));
            snapshot.docs.forEach((doc) => choices.set(doc.id, { ...doc.data(), id: doc.id }));
            if (isAdmin) postEditor.setProjectChoices(listedChoices(Array.from(choices.values())));
        }).catch(() => { /* Pasting a related project URL remains available offline. */ });
    }

    if (user) {
        if (authHint) authHint.textContent = isAdmin
            ? `Logged in as admin: ${getDisplayName(user)}`
            : `Logged in as ${getDisplayName(user)}. You can comment on posts.`;
        if (logoutButton) logoutButton.hidden = false;
    } else {
        if (authHint) authHint.textContent = "Login or create an account to comment on posts.";
        if (logoutButton) logoutButton.hidden = true;
    }

    if (adminPanel) adminPanel.hidden = !isAdmin;
    if (openPostDrawerButton) openPostDrawerButton.hidden = !isAdmin;
    // Keep the public subscription stable across auth changes so an open article
    // and its draft comment are not replaced by the temporary fallback list.
    if (!blogPage || !unsubscribePosts) watchPosts();

    if (activePost) {
        if (blogPage) renderCommentEntry(activePost.id);
        else {
            renderReadDrawer(activePost);
            watchComments(activePost.id);
        }
    }
}

if (auth && db) {
    auth.onAuthStateChanged(applyBlogAuthState);
} else {
    applyBlogAuthState(null);
}

function firstImage(images) {
    return normalizeImageList(images)[0] || "";
}

function normalizeImageList(images) {
    if (Array.isArray(images)) {
        return images.filter(Boolean);
    }

    if (typeof images === "string") {
        return parseCommaList(images);
    }

    return [];
}

function parseCommaList(value) {
    return String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function renderPostBody(body) {
    const paragraphs = String(body || "").split(/\n{2,}/).map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, " ").trim())}</p>`);
    return paragraphs.join("");
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatTimestamp(timestamp) {
    if (!timestamp || typeof timestamp.toDate !== "function") {
        return "Just now";
    }

    return timestamp.toDate().toLocaleString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

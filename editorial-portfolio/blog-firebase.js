const defaultPosts = [
    {
        id: "echoworks-singapore-red-cross-playbook",
        day: "05",
        month: "Aug 2026",
        category: "Capstone / Pitch",
        title: "EchoWorks: Singapore Red Cross Playbook Pitch",
        excerpt: "Wrapped up our final EchoWorks pitch with my groupmate, presenting the finished solution for the Singapore Red Cross playbook.",
        body: "Today we finished pitching our final EchoWorks solution with my groupmate for the Singapore Red Cross playbook. We walked through the full solution, showed how the interactive training scenarios support workplace communication, and closed out the pitch with a Q&A session. It was a strong finish to the capstone journey: the planning, prototyping, and refinement all came together in one clear presentation.",
        coverImage: "../imgs/Blogs/EchoWorks/photo.JPG",
        imageUrls: ["../imgs/Blogs/EchoWorks/photo.JPG"],
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
        coverImage: "../imgs/Blogs/OIP/OIP_grp_photo.jpg",
        imageUrls: ["../imgs/Blogs/OIP/OIP_grp_photo.jpg"],
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
        coverImage: "../imgs/Blogs/GGF/GGF_grp_photo.jpg",
        imageUrls: ["../imgs/Blogs/GGF/GGF_grp_photo.jpg"],
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

let currentUser = null;
let isAdmin = false;
let unsubscribePosts = null;
let activeCommentsUnsubscribe = null;
let activePost = null;
let latestPosts = [];
const postImageUpload = window.PortfolioImageUpload?.mount({ form: postForm, kind: "post" });
let loadedPostDate = "", loadedPostDay = "", loadedPostMonth = "";
postForm.addEventListener("reset", () => { loadedPostDate = loadedPostDay = loadedPostMonth = ""; });

function isConfiguredAdmin(user) {
    if (!user) {
        return false;
    }

    if (ALLOW_ANY_SIGNED_IN_USER_TO_EDIT) {
        return true;
    }

    const emailList = Array.isArray(ADMIN_EMAILS) ? ADMIN_EMAILS : [];
    const uidList = Array.isArray(ADMIN_UIDS) ? ADMIN_UIDS : [];

    return emailList.includes(user.email) || uidList.includes(user.uid);
}

function getDisplayName(user) {
    return user?.displayName || user?.email || "Signed-in visitor";
}

function setMessage(message, type = "") {
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

function renderPosts(posts) {
    posts = PortfolioContentOrder.newest(posts.filter(post => post.publicationState !== "draft" && post.state !== "draft"), "post");
    latestPosts = posts;
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
    };
    const path = match?.[1];
    const current = Object.hasOwn(moved, path) ? moved[path] : (Object.values(moved).includes(path) ? path : "");
    return current ? `../imgs/${current}` : image;
}

function renderCoverImage(post) {
    const image = resolveBlogImage(post.coverImage || firstImage(post.imageUrls));
    if (!image) {
        return `<span>${escapeHtml((post.category || "Post").slice(0, 2).toUpperCase())}</span>`;
    }

    return `<img src="${escapeHtml(image)}" alt="${escapeHtml(post.title || "Blog cover image")}" loading="lazy" />`;
}

function openPost(post) {
    activePost = post;
    readDrawerTitle.textContent = post.title || "Post Details";
    renderReadDrawer(post);
    PortfolioUI.openDrawer("blog-read-drawer");
    watchComments(post.id);
}

function renderReadDrawer(post) {
    const images = normalizeImageList(post.imageUrls).map(resolveBlogImage);
    const coverImage = resolveBlogImage(post.coverImage);
    const body = post.body || post.excerpt || "";

    readDrawerContent.innerHTML = `
        <article class="drawer-post">
            ${coverImage ? `<img class="drawer-cover" src="${escapeHtml(coverImage)}" alt="${escapeHtml(post.title || "Blog cover image")}" loading="lazy" />` : ""}
            <p class="post-category">${escapeHtml(post.category || "Journal")}</p>
            <h3>${escapeHtml(post.title || "Untitled Post")}</h3>
            <p class="drawer-date">${escapeHtml([post.day, post.month].filter(Boolean).join(" "))}</p>
            ${renderPostBody(body)}
            ${post.link ? `<a class="btn btn-secondary drawer-link" href="${escapeHtml(post.link)}" target="_blank" rel="noreferrer">Open Link</a>` : ""}
            ${images.length ? `<div class="content-image-grid">${images.map((image, index) => `<img src="${escapeHtml(image)}" alt="${escapeHtml(post.title || "Blog image")} ${index + 1}" loading="lazy" />`).join("")}</div>` : ""}
            <div class="post-actions admin-post-actions"></div>
            <section class="comments-block" aria-label="Comments">
                <div class="comments-header">
                    <h3>Comments</h3>
                    <span class="comment-count">Loading...</span>
                </div>
                <div class="comment-list"></div>
                <div class="comment-entry"></div>
            </section>
        </article>
    `;

    const adminActions = readDrawerContent.querySelector(".admin-post-actions");
    if (isAdmin) {
        const editButton = document.createElement("button");
        editButton.className = "text-action";
        editButton.type = "button";
        editButton.textContent = "Edit post";
        editButton.addEventListener("click", () => fillPostForm(post));
        adminActions.appendChild(editButton);
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
            <textarea name="comment" rows="3" placeholder="Write a thoughtful comment" required="required"></textarea>
            <button class="btn btn-primary" type="submit">Post Comment</button>
        </form>
    `;

    entry.querySelector(".comment-form").addEventListener("submit", handleCommentSubmit);
}

function watchPosts() {
    if (unsubscribePosts) {
        unsubscribePosts();
    }

    // Keep the journal useful while Firestore connects. The live collection
    // remains the source of truth and replaces these existing local entries.
    renderPosts(mergePosts());

    if (!db) {
        setMessage("Firebase is unavailable. Showing local blog content.", "error");
        return;
    }

    unsubscribePosts = db.collection("posts").onSnapshot((snapshot) => {
        const firebasePosts = snapshot.empty ? [] : snapshot.docs.map(formatPostData);
        const posts = mergePosts(firebasePosts);
        renderPosts(posts);
        if (activePost) {
            const refreshed = posts.find((post) => post.id === activePost.id);
            if (refreshed) {
                activePost = refreshed;
                renderReadDrawer(refreshed);
                watchComments(refreshed.id);
            }
        }
    }, () => {
        renderPosts(mergePosts());
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
    const canEdit = currentUser && (isAdmin || comment.uid === currentUser.uid);

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
    if (!isAdmin) return;
    postImageUpload?.reset();
    postIdInput.value = post.id;
    postTitleInput.value = post.title || "";
    postCategoryInput.value = post.category || "";
    postDayInput.value = post.day || "";
    postMonthInput.value = post.month || "";
    loadedPostDate = post.date || "";
    loadedPostDay = postDayInput.value; loadedPostMonth = postMonthInput.value;
    postCoverImageInput.value = post.coverImage || "";
    postImageUrlsInput.value = normalizeImageList(post.imageUrls).join(", ");
    postLinkInput.value = post.link || "";
    postExcerptInput.value = post.excerpt || "";
    postBodyInput.value = post.body || "";
    PortfolioUI.openDrawer("blog-post-drawer");
    postTitleInput.focus();
}

function resetPostForm() {
    postForm.reset();
    postIdInput.value = "";
}

async function savePost(event) {
    event.preventDefault();

    if (!isAdmin) {
        setMessage("Only the configured admin can edit posts.", "error");
        return;
    }

    const id = (postIdInput.value || slugify(postTitleInput.value)).trim();
    if (!id) {
        setMessage("Please add a post title first.", "error");
        return;
    }

    await db.collection("posts").doc(id).set({
        title: postTitleInput.value.trim(),
        category: postCategoryInput.value.trim(),
        day: postDayInput.value.trim(),
        month: postMonthInput.value.trim(),
        date: postDayInput.value === loadedPostDay && postMonthInput.value === loadedPostMonth ? loadedPostDate : (() => {
            const stamp = PortfolioContentOrder.date({ day: postDayInput.value.trim(), month: postMonthInput.value.trim() }, "post");
            return stamp ? new Date(stamp).toISOString().slice(0, 10) : "";
        })(),
        coverImage: postCoverImageInput.value.trim(),
        imageUrls: parseCommaList(postImageUrlsInput.value),
        link: postLinkInput.value.trim(),
        excerpt: postExcerptInput.value.trim(),
        body: postBodyInput.value.trim(),
        sortOrder: latestPosts.find(post => post.id === id)?.sortOrder || Date.now(),
        ...(!latestPosts.some(post => post.id === id) ? { createdAt: firebase.firestore.FieldValue.serverTimestamp() } : {}),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    resetPostForm();
    setMessage("Post saved to Firebase.", "success");
    PortfolioUI.closeDrawer();
}

authForm.addEventListener("submit", async (event) => {
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

logoutButton.addEventListener("click", () => {
    auth?.signOut();
});

postForm.addEventListener("submit", savePost);
resetPostButton.addEventListener("click", resetPostForm);

function applyBlogAuthState(user) {
    currentUser = user;
    isAdmin = isConfiguredAdmin(user);
    postImageUpload?.setUser(isAdmin ? user : null);

    if (user) {
        authHint.textContent = isAdmin
            ? `Logged in as admin: ${getDisplayName(user)}`
            : `Logged in as ${getDisplayName(user)}. You can comment on posts.`;
        logoutButton.hidden = false;
    } else {
        authHint.textContent = "Login or create an account to comment on posts.";
        logoutButton.hidden = true;
    }

    adminPanel.hidden = !isAdmin;
    openPostDrawerButton.hidden = !isAdmin;
    const editorDrawer = document.querySelector("#blog-post-drawer");
    if (!isAdmin && editorDrawer?.getAttribute("aria-modal") === "true") {
        PortfolioUI.closeDrawer();
    }
    watchPosts();

    if (activePost) {
        renderReadDrawer(activePost);
        watchComments(activePost.id);
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
    if (!timestamp || !timestamp.toDate) {
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

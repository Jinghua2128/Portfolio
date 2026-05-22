const defaultPosts = [
    {
        id: "shenzhen-oip",
        day: "05",
        month: "Sep 2024",
        category: "Overseas Learning",
        title: "Shenzhen Overseas Immersion Programme",
        excerpt: "The Shenzhen OIP gave me a chance to experience learning in a different environment and understand student life overseas. Through classes, activities, and cultural exposure, I gained a wider perspective on collaboration and creative practice.",
    },
    {
        id: "ggf-china-booth",
        day: "08",
        month: "Nov 2024",
        category: "Cultural Storytelling",
        title: "GGF China Booth",
        excerpt: "I hosted the China booth and introduced attendees to Chinese culture and Black Myth: Wukong. The booth combined cultural sharing with modern game-related media, helping visitors connect with the topic in an engaging way.",
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
const postForm = document.querySelector("#post-form");
const postIdInput = document.querySelector("#post-id");
const postTitleInput = document.querySelector("#post-title");
const postCategoryInput = document.querySelector("#post-category");
const postDayInput = document.querySelector("#post-day");
const postMonthInput = document.querySelector("#post-month");
const postExcerptInput = document.querySelector("#post-excerpt");
const resetPostButton = document.querySelector("#reset-post-form");

let currentUser = null;
let isAdmin = false;
let unsubscribePosts = null;
const unsubscribeComments = new Map();

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
    return defaultPosts.map((post) => ({ ...post, source: "fallback" }));
}

function renderPosts(posts) {
    blogList.innerHTML = "";
    unsubscribeComments.forEach((unsubscribe) => unsubscribe());
    unsubscribeComments.clear();

    posts.forEach((post) => {
        const article = document.createElement("article");
        article.className = "blog-post-card blog-post-interactive";
        article.dataset.postId = post.id;

        article.innerHTML = `
            <div class="post-date-block">
                <div class="post-day">${escapeHtml(post.day || "")}</div>
                <div class="post-month">${escapeHtml(post.month || "")}</div>
            </div>
            <div class="post-body">
                <p class="post-category">${escapeHtml(post.category || "Blog")}</p>
                <h2 class="post-title">${escapeHtml(post.title || "Untitled Post")}</h2>
                <p class="post-excerpt">${escapeHtml(post.excerpt || "")}</p>
                <div class="post-actions"></div>
                <section class="comments-block" aria-label="Comments for ${escapeHtml(post.title || "post")}">
                    <div class="comments-header">
                        <h3>Comments</h3>
                        <span class="comment-count">Loading...</span>
                    </div>
                    <div class="comment-list"></div>
                    <form class="comment-form" data-post-id="${escapeHtml(post.id)}">
                        <textarea name="comment" rows="3" placeholder="Log in to leave a comment" ${currentUser ? "" : "disabled"} required></textarea>
                        <button class="btn btn-primary" type="submit" ${currentUser ? "" : "disabled"}>${currentUser ? "Post Comment" : "Login Required"}</button>
                    </form>
                </section>
            </div>
        `;

        const actions = article.querySelector(".post-actions");
        if (isAdmin) {
            const editButton = document.createElement("button");
            editButton.className = "text-action";
            editButton.type = "button";
            editButton.textContent = "Edit post";
            editButton.addEventListener("click", () => fillPostForm(post));
            actions.appendChild(editButton);
        }

        article.querySelector(".comment-form").addEventListener("submit", handleCommentSubmit);
        blogList.appendChild(article);
        watchComments(post.id, article);
    });
}

function watchPosts() {
    if (unsubscribePosts) {
        unsubscribePosts();
    }

    unsubscribePosts = db.collection("posts").orderBy("sortOrder", "asc").onSnapshot((snapshot) => {
        const posts = snapshot.empty ? fallbackPosts() : snapshot.docs.map(formatPostData);
        renderPosts(posts);
    }, () => {
        renderPosts(fallbackPosts());
        setMessage("Could not load Firebase posts. Showing local blog content.", "error");
    });
}

function watchComments(postId, article) {
    const commentList = article.querySelector(".comment-list");
    const commentCount = article.querySelector(".comment-count");

    const unsubscribe = db.collection("posts").doc(postId).collection("comments")
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

    unsubscribeComments.set(postId, unsubscribe);
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
        setMessage("Please log in before commenting.", "error");
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
    postIdInput.value = post.id;
    postTitleInput.value = post.title || "";
    postCategoryInput.value = post.category || "";
    postDayInput.value = post.day || "";
    postMonthInput.value = post.month || "";
    postExcerptInput.value = post.excerpt || "";
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
        excerpt: postExcerptInput.value.trim(),
        sortOrder: Date.now(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    resetPostForm();
    setMessage("Post saved to Firebase.", "success");
}

authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
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
    auth.signOut();
});

postForm.addEventListener("submit", savePost);
resetPostButton.addEventListener("click", resetPostForm);

auth.onAuthStateChanged((user) => {
    currentUser = user;
    isAdmin = isConfiguredAdmin(user);

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
    watchPosts();
});

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

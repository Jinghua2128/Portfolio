const defaultProjects = [
    {
        id: "sundrop-farm",
        number: "01",
        category: "Game Development",
        title: "Sundrop Farm",
        description: "A farming simulation game focused on strategy, planning, and creative decision-making. It helped me practise game logic, player flow, and simple interactive systems.",
        tags: ["Python", "Game Systems", "Simulation"],
    },
    {
        id: "money-pit-mayhem",
        number: "02",
        category: "Board Game Design",
        title: "Money Pit Mayhem",
        description: "A strategy board game using event-driven mechanics to create changing conditions for players, exploring resource management, risk, planning, and decision-making.",
        tags: ["Game Design", "Prototyping", "Systems Thinking"],
    },
    {
        id: "youtube-shorts-revamp",
        number: "03",
        category: "UI/UX Design",
        title: "YouTube Shorts Revamp",
        description: "A UI/UX redesign concept for improving navigation, viewing flow, wireframes, and clearer interaction patterns in the YouTube Shorts experience.",
        tags: ["Figma", "Wireframes", "UX Thinking"],
    },
    {
        id: "procedural-chess-pieces",
        number: "04",
        category: "3D & Texturing",
        title: "Procedural Chess Pieces",
        description: "A 3D texturing study focused on materials, surface detail, and presentation, strengthening my control over form, finish, and visual clarity.",
        tags: ["Substance Painter", "3D Art", "Texturing"],
    },
];

const projectAuthForm = document.querySelector("#project-auth-form");
const projectAuthName = document.querySelector("#project-auth-name");
const projectAuthEmail = document.querySelector("#project-auth-email");
const projectAuthPassword = document.querySelector("#project-auth-password");
const projectAuthMode = document.querySelector("#project-auth-mode");
const projectLogoutButton = document.querySelector("#project-logout-button");
const projectAuthStatus = document.querySelector("#project-auth-status");
const projectAuthHint = document.querySelector("#project-auth-hint");
const projectAdminPanel = document.querySelector("#project-admin-panel");
const projectsGrid = document.querySelector("#projects-grid");
const projectForm = document.querySelector("#project-form");
const projectIdInput = document.querySelector("#project-id");
const projectNumberInput = document.querySelector("#project-number");
const projectTitleInput = document.querySelector("#project-title");
const projectCategoryInput = document.querySelector("#project-category");
const projectDescriptionInput = document.querySelector("#project-description");
const projectTagsInput = document.querySelector("#project-tags");
const resetProjectButton = document.querySelector("#reset-project-form");

let projectUser = null;
let projectIsAdmin = false;
let unsubscribeProjects = null;

function isProjectAdmin(user) {
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

function setProjectMessage(message, type = "") {
    projectAuthStatus.textContent = message;
    projectAuthStatus.className = `auth-status ${type}`.trim();
}

function renderProjects(projects) {
    projectsGrid.innerHTML = "";

    projects.forEach((project) => {
        const card = document.createElement("article");
        card.className = "project-card";
        card.innerHTML = `
            <div class="card-thumb">${escapeHtml(project.number || "")}</div>
            <div class="card-body">
                <p class="card-tag">${escapeHtml(project.category || "Project")}</p>
                <h2 class="card-title">${escapeHtml(project.title || "Untitled Project")}</h2>
                <p class="card-desc">${escapeHtml(project.description || "")}</p>
                <div class="tag-list">${renderTags(project.tags)}</div>
                <div class="post-actions"></div>
            </div>
        `;

        const actions = card.querySelector(".post-actions");
        if (projectIsAdmin && project.source !== "fallback") {
            const editButton = document.createElement("button");
            editButton.className = "text-action";
            editButton.type = "button";
            editButton.textContent = "Edit project";
            editButton.addEventListener("click", () => fillProjectForm(project));

            const deleteButton = document.createElement("button");
            deleteButton.className = "text-action danger";
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteProject(project.id));

            actions.append(editButton, deleteButton);
        }

        projectsGrid.appendChild(card);
    });
}

function watchProjects() {
    if (unsubscribeProjects) {
        unsubscribeProjects();
    }

    unsubscribeProjects = db.collection("projects").orderBy("sortOrder", "asc").onSnapshot((snapshot) => {
        const projects = snapshot.empty
            ? defaultProjects.map((project) => ({ ...project, source: "fallback" }))
            : snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        renderProjects(projects);
    }, () => {
        renderProjects(defaultProjects.map((project) => ({ ...project, source: "fallback" })));
        setProjectMessage("Could not load Firebase projects. Showing local project cards.", "error");
    });
}

function fillProjectForm(project) {
    projectIdInput.value = project.id;
    projectNumberInput.value = project.number || "";
    projectTitleInput.value = project.title || "";
    projectCategoryInput.value = project.category || "";
    projectDescriptionInput.value = project.description || "";
    projectTagsInput.value = Array.isArray(project.tags) ? project.tags.join(", ") : "";
    projectTitleInput.focus();
}

function resetProjectForm() {
    projectForm.reset();
    projectIdInput.value = "";
}

async function saveProject(event) {
    event.preventDefault();

    if (!projectIsAdmin) {
        setProjectMessage("Login first before editing projects.", "error");
        return;
    }

    const id = (projectIdInput.value || slugify(projectTitleInput.value)).trim();
    if (!id) {
        setProjectMessage("Please add a project title first.", "error");
        return;
    }

    await db.collection("projects").doc(id).set({
        number: projectNumberInput.value.trim(),
        title: projectTitleInput.value.trim(),
        category: projectCategoryInput.value.trim(),
        description: projectDescriptionInput.value.trim(),
        tags: projectTagsInput.value.split(",").map((tag) => tag.trim()).filter(Boolean),
        sortOrder: Number(projectNumberInput.value.trim()) || Date.now(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    resetProjectForm();
    setProjectMessage("Project saved to Firebase.", "success");
}

async function deleteProject(projectId) {
    if (!window.confirm("Delete this project?")) {
        return;
    }

    await db.collection("projects").doc(projectId).delete();
}

projectAuthForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setProjectMessage("Checking account...");

    try {
        if (projectAuthMode.value === "register") {
            const credential = await auth.createUserWithEmailAndPassword(projectAuthEmail.value, projectAuthPassword.value);
            if (projectAuthName.value.trim()) {
                await credential.user.updateProfile({ displayName: projectAuthName.value.trim() });
            }
            setProjectMessage("Account created. You can manage projects now.", "success");
        } else {
            await auth.signInWithEmailAndPassword(projectAuthEmail.value, projectAuthPassword.value);
            setProjectMessage("Logged in successfully.", "success");
        }
        projectAuthForm.reset();
    } catch (error) {
        setProjectMessage(error.message, "error");
    }
});

projectLogoutButton.addEventListener("click", () => {
    auth.signOut();
});

projectForm.addEventListener("submit", saveProject);
resetProjectButton.addEventListener("click", resetProjectForm);

auth.onAuthStateChanged((user) => {
    projectUser = user;
    projectIsAdmin = isProjectAdmin(user);

    if (user) {
        projectAuthHint.textContent = projectIsAdmin
            ? `Logged in as editor: ${user.displayName || user.email}`
            : `Logged in as ${user.displayName || user.email}.`;
        projectLogoutButton.hidden = false;
    } else {
        projectAuthHint.textContent = "Login to add, edit, or delete project cards saved in Firebase.";
        projectLogoutButton.hidden = true;
    }

    projectAdminPanel.hidden = !projectIsAdmin;
    watchProjects();
});

function renderTags(tags) {
    const tagList = Array.isArray(tags) ? tags : [];
    return tagList.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

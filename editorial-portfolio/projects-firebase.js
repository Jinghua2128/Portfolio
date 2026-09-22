const defaultProjects = window.PortfolioProjectCatalog;
const projectCopyProfiles = [
    {
        terms: ["stickar"],
        title: "StickAR",
        description: "Unity and Firebase app with real-time CRUD data synchronization.",
    },
    {
        terms: ["labrats", "lab rats"],
        title: "LabRats",
        description: "Unity AR learning app for physics experiments and interactive feedback.",
    },
    {
        terms: ["echoworks", "echo works"],
        title: "EchoWorks",
        description: "Website revamp for a browser-based workplace feedback-learning platform.",
    },
    {
        terms: ["yl clothes", "tailor"],
        title: "YL Clothes",
        description: "Tailor shop website focused on service showcases and customer engagement.",
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
const openProjectDrawerButton = document.querySelector("#open-project-drawer");
const featuredProjects = document.querySelector("#featured-projects");
const projectsGrid = document.querySelector("#projects-grid");
const projectForm = document.querySelector("#project-form");
const projectIdInput = document.querySelector("#project-id");
const projectNumberInput = document.querySelector("#project-number");
const projectTitleInput = document.querySelector("#project-title");
const projectCategoryInput = document.querySelector("#project-category");
const projectRoleInput = document.querySelector("#project-role");
const projectDescriptionInput = document.querySelector("#project-description");
const projectOutcomeInput = document.querySelector("#project-outcome");
const projectTagsInput = document.querySelector("#project-tags");
const projectLinkInput = document.querySelector("#project-link");
const projectImageInput = document.querySelector("#project-image");
const projectFeaturedInput = document.querySelector("#project-featured");
const projectVisibleInput = document.querySelector("#project-portfolio-visible");
const resetProjectButton = document.querySelector("#reset-project-form");
const projectFilterButtons = document.querySelectorAll("[data-project-filter]");
const projectSearchInput = document.querySelector("#project-search");
const projectResultCount = document.querySelector("#project-result-count");
const projectDetailContent = document.querySelector("#project-detail-content");
const projectDetailTitle = document.querySelector("#project-detail-title");

let projectUser = null;
let projectIsAdmin = false;
let unsubscribeProjects = null;
let latestProjects = [];
let activeProjectFilter = "all";
let projectSearchTerm = "";
let hasOpenedHashedProject = false;
const projectImageUpload = window.PortfolioImageUpload?.mount({ form: projectForm, kind: "project" });
const projectHighlights = PortfolioHighlights.mount(featuredProjects, renderFeaturedProjects);
const dateStatusFields = document.createElement("div");
dateStatusFields.className = "project-date-status-fields";
dateStatusFields.innerHTML = '<label for="project-date">Project date (for Latest)<input id="project-date" type="date" /></label><label for="project-status">Project status<select id="project-status"><option value="">Not specified</option><option value="in-progress">In progress</option><option value="completed">Completed</option><option value="launched">Launched</option><option value="archived">Archived</option></select></label>';
projectImageInput.before(dateStatusFields);
const projectDateInput = dateStatusFields.querySelector("#project-date");
const projectStatusInput = dateStatusFields.querySelector("#project-status");
let loadedProjectDate = "";
let projectDateTouched = false;
projectDateInput.addEventListener("input", () => { projectDateTouched = true; });
projectForm.addEventListener("reset", () => { loadedProjectDate = ""; projectDateTouched = false; });

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

function getStarterProjects() {
    return defaultProjects.map((project, index) => ({
        ...PortfolioProjectPolicy.prepare(project),
        source: "fallback",
        sortOrder: Number(project.number) || index + 1,
    }));
}

function isRemovedProject(project) {
    const text = `${project?.id || ""} ${project?.title || ""}`.toLowerCase();
    return text.includes("echo-gx") || text.includes("echo gx") || text.includes("echogx");
}
function mergeProjects(firebaseProjects = []) {
    const projectMap = new Map();

    getStarterProjects().forEach((project) => {
        if (!isRemovedProject(project)) {
            projectMap.set(project.id, project);
        }
    });

    firebaseProjects.forEach((project, index) => {
        if (isRemovedProject(project)) {
            return;
        }

        const existing = projectMap.get(project.id) || {};
        const legacyEchoCopy = project.id === "echoworks-training-platform" && project.description === "Unity training platform for Singapore Red Cross workplace communication scenarios.";
        const approvedEchoFields = legacyEchoCopy ? { description: existing.description, category: existing.category, tags: existing.tags, link: existing.link } : {};
        projectMap.set(project.id, PortfolioProjectPolicy.prepare({
            ...existing,
            ...project,
            imageUrl: project.imageUrl || project.coverImage || existing.imageUrl || existing.coverImage || "",
            ...approvedEchoFields,
            source: "firebase",
            sortOrder: project.sortOrder || Number(project.number) || 100 + index,
        }));
    });

    return dedupeProjects(Array.from(projectMap.values())).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

function dedupeProjects(projects) {
    const uniqueProjects = new Map();

    projects.forEach((project) => {
        const key = getProjectDedupeKey(project);
        const existing = uniqueProjects.get(key);
        if (!existing || project.source === "firebase") {
            uniqueProjects.set(key, project);
        }
    });

    return Array.from(uniqueProjects.values());
}

function getProjectDedupeKey(project) {
    const profile = getProjectCopyProfile(project);
    return slugify(profile?.title || project.title || project.id || "project");
}
const projectFilterTerms = {
    interactive: ["interactive", "immersive", "web", "website", "ar", "vr", "unity", "firebase", "game", "gameplay", "c#", "portfolio", "tailor"],
    "3d": ["3d", "maya", "blender", "substance", "shader", "environment", "modular", "whitebox", "asset"],
    motion: ["motion", "after effects", "premiere", "video", "compositing", "logo", "animation", "blu-ray"],
    ux: ["ux", "ui", "figma", "persona", "empathy", "usability", "research", "interface"],
    branding: ["branding", "brand", "campaign", "newsletter", "social", "identity"],
};

function getProjectSearchText(project) {
    return [
        project.id,
        project.number,
        project.category,
        project.title,
        project.description,
        project.role,
        project.outcome,
        Array.isArray(project.tags) ? project.tags.join(" ") : "",
    ].join(" ").toLowerCase();
}

function matchesProjectFilter(project) {
    const text = getProjectSearchText(project);
    const filterTerms = projectFilterTerms[activeProjectFilter] || [];
    const matchesFilter = activeProjectFilter === "all" || filterTerms.some((term) => text.includes(term));
    const matchesSearch = !projectSearchTerm || text.includes(projectSearchTerm);
    return matchesFilter && matchesSearch;
}

function getVisibleProjects(projects) {
    return projects.filter(matchesProjectFilter);
}

function updateProjectCount(count, total) {
    if (!projectResultCount) {
        return;
    }

    const label = count === 1 ? "1 work shown" : `${count} works shown`;
    projectResultCount.textContent = count === total ? label : `${label} / ${total}`;
}

function renderProjects(projects) {
    latestProjects = projects;
    window.PortfolioProjectManagement?.refresh({ projects: latestProjects, isAdmin: projectIsAdmin, user: projectUser, db, edit: fillProjectForm });
    projects = projects.filter(PortfolioProjectPolicy.isListed);
    const featured = chooseFeaturedProjects(projects);
    projectHighlights.update(projects);
    renderProjectGrid(projects, featured);
    if (!hasOpenedHashedProject && window.location.hash.startsWith("#project-")) {
        const projectId = decodeURIComponent(window.location.hash.replace("#project-", ""));
        const matchedProject = projects.find((project) => project.id === projectId);
        if (matchedProject) {
            hasOpenedHashedProject = true;
            window.setTimeout(() => openProjectDetails(matchedProject), 0);
        }
    }
}

function chooseFeaturedProjects(projects) {
    return projects.filter(project => project.featured).slice(0, 3);
}

function renderFeaturedProjects(projects) {
    featuredProjects.innerHTML = "";

    if (!projects.length) {
        featuredProjects.innerHTML = `<p class="card-desc">No featured projects yet.</p>`;
        return;
    }

    const showcase = document.createElement("div");
    showcase.className = "showcase-feature-grid";

    projects.forEach((project) => {
        const card = document.createElement("article");
        card.className = "showcase-feature-card";
        card.innerHTML = `
            ${renderProjectPreview(project, "showcase-feature-media")}
            <div class="showcase-feature-copy">
                <p class="card-tag">${escapeHtml(portfolioCopy(project.category || "Project"))}</p>
                <h3>${escapeHtml(getProjectDisplayTitle(project))}</h3>
                <p>${escapeHtml(getProjectCardDescription(project))}</p>
                ${Array.isArray(project.tags) && project.tags.length ? `<div class="showcase-feature-meta">${project.tags.slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
            </div>
            ${renderProjectAction(project, "btn btn-secondary")}
        `;

        bindProjectOpeners(card, project);
        showcase.appendChild(card);
    });

    featuredProjects.appendChild(showcase);
}

function renderProjectGrid(projects, featured) {
    projectsGrid.innerHTML = "";
    const filteredProjects = getVisibleProjects(projects);
    updateProjectCount(filteredProjects.length, projects.length);

    if (!filteredProjects.length) {
        projectsGrid.innerHTML = `
            <div class="project-empty-state">
                <h2 class="card-title">No work found.</h2>
                <p class="card-desc">Try another filter or search term.</p>
            </div>
        `;
        return;
    }

    const featuredIds = new Set(featured.map((project) => project.id));

    filteredProjects.forEach((project) => {
        const card = document.createElement("article");
        card.className = `project-card is-filtered-in${featuredIds.has(project.id) ? " is-featured" : ""}`;
        card.id = `project-${project.id}`;
        card.innerHTML = `
            ${renderProjectPreview(project)}
            <div class="card-body">
                <h2 class="card-title">${escapeHtml(getProjectDisplayTitle(project))}</h2>
                <p class="project-card-category">${escapeHtml(portfolioCopy(project.category || "Project"))}</p>
                <div class="project-card-tools">${(Array.isArray(project.tags) ? project.tags.slice(0, 4) : []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
                <div class="post-actions project-card-actions">
                    ${renderProjectAction(project, "btn btn-secondary project-view-button")}
                </div>
            </div>
        `;

        const actions = card.querySelector(".post-actions");
        bindProjectOpeners(card, project);

        if (projectIsAdmin) {
            const editButton = document.createElement("button");
            editButton.className = "text-action";
            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => fillProjectForm(project));
            actions.appendChild(editButton);

            if (project.source !== "fallback") {
                const deleteButton = document.createElement("button");
                deleteButton.className = "text-action danger";
                deleteButton.type = "button";
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", () => deleteProject(project.id));
                actions.appendChild(deleteButton);
            }
        }

        projectsGrid.appendChild(card);
    });
}
function watchProjects() {
    if (unsubscribeProjects) {
        unsubscribeProjects();
    }

    // Show the existing real-project dataset while Firestore connects. A live
    // snapshot replaces it as soon as the remote collection is available.
    renderProjects(getStarterProjects());

    if (!db) {
        setProjectMessage("Firebase is unavailable. Showing local project cards.", "error");
        return;
    }

    unsubscribeProjects = db.collection("projects").onSnapshot((snapshot) => {
        const firebaseProjects = snapshot.empty
            ? []
            : snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        renderProjects(mergeProjects(firebaseProjects));
    }, () => {
        renderProjects(getStarterProjects());
        setProjectMessage("Could not load Firebase projects. Showing local project cards.", "error");
    });
}

function fillProjectForm(project) {
    if (!projectIsAdmin) return;
    projectImageUpload?.reset();
    loadedProjectDate = project.date || ""; projectDateTouched = false;
    projectDateInput.value = loadedProjectDate;
    const savedStatus = String(project.status || "");
    if (![...projectStatusInput.options].some(option => option.value === savedStatus)) projectStatusInput.add(new Option(savedStatus, savedStatus));
    projectStatusInput.value = savedStatus;
    projectIdInput.value = project.id;
    projectNumberInput.value = project.number || "";
    projectTitleInput.value = project.title || "";
    projectCategoryInput.value = project.category || "";
    if (projectRoleInput) projectRoleInput.value = project.role || "";
    projectDescriptionInput.value = project.description || "";
    if (projectOutcomeInput) projectOutcomeInput.value = project.outcome || "";
    projectTagsInput.value = Array.isArray(project.tags) ? project.tags.join(", ") : "";
    projectLinkInput.value = project.link || "";
    projectImageInput.value = project.imageUrl || project.coverImage || "";
    projectFeaturedInput.checked = Boolean(project.featured);
    if (projectVisibleInput) projectVisibleInput.checked = PortfolioProjectPolicy.isListed(project);
    PortfolioUI.openDrawer("project-editor-drawer");
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
        role: projectRoleInput?.value.trim() || "",
        description: projectDescriptionInput.value.trim(),
        outcome: projectOutcomeInput?.value.trim() || "",
        tags: projectTagsInput.value.split(",").map((tag) => tag.trim()).filter(Boolean),
        link: projectLinkInput.value.trim(),
        imageUrl: projectImageInput.value.trim(),
        featured: projectFeaturedInput.checked,
        date: projectDateTouched ? projectDateInput.value : loadedProjectDate || projectDateInput.value,
        status: projectStatusInput.value,
        ...(!latestProjects.some(project => project.id === id) ? { createdAt: firebase.firestore.FieldValue.serverTimestamp() } : {}),
        portfolioVisible: projectVisibleInput ? projectVisibleInput.checked : PortfolioProjectPolicy.isListed(latestProjects.find((project) => project.id === id) || {}),
        sortOrder: Number(projectNumberInput.value.trim()) || Date.now(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    resetProjectForm();
    setProjectMessage("Project saved to Firebase.", "success");
    PortfolioUI.closeDrawer();
}

async function deleteProject(projectId) {
    if (!window.confirm("Delete this project?")) {
        return;
    }

    await db.collection("projects").doc(projectId).delete();
}

projectAuthForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!auth) {
        setProjectMessage("Firebase login is temporarily unavailable. Local projects are still visible.", "error");
        return;
    }
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
    auth?.signOut();
});

projectForm.addEventListener("submit", saveProject);
resetProjectButton.addEventListener("click", resetProjectForm);

projectFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeProjectFilter = button.dataset.projectFilter || "all";
        projectFilterButtons.forEach((item) => {
            const isActive = item === button;
            item.classList.toggle("is-active", isActive);
            item.setAttribute("aria-selected", String(isActive));
        });
        renderProjects(latestProjects);
    });
});

projectSearchInput?.addEventListener("input", () => {
    projectSearchTerm = projectSearchInput.value.trim().toLowerCase();
    renderProjects(latestProjects);
});

function applyProjectAuthState(user) {
    projectUser = user;
    projectIsAdmin = isProjectAdmin(user);
    projectImageUpload?.setUser(projectIsAdmin ? user : null);

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
    openProjectDrawerButton.hidden = !projectIsAdmin;
    const editorDrawer = document.querySelector("#project-editor-drawer");
    if (!projectIsAdmin && editorDrawer?.getAttribute("aria-modal") === "true") {
        PortfolioUI.closeDrawer();
    }
    watchProjects();
}

if (auth && db) {
    auth.onAuthStateChanged(applyProjectAuthState);
} else {
    applyProjectAuthState(null);
}

function openProjectDetails(project) {
    if (!projectDetailContent || !projectDetailTitle) {
        return;
    }

    const title = getProjectDisplayTitle(project);
    const body = portfolioCopy(project.description || getProjectCardDescription(project));
    const tags = Array.isArray(project.tags) ? project.tags : [];
    const tools = Array.isArray(project.tools) && project.tools.length ? project.tools : tags;
    const role = String(project.role || "").trim();
    const outcome = String(project.outcome || "").trim();
    const credits = String(project.credits || "").trim();
    const projectLink = project.link === "editorial-portfolio/index.html" ? "index.html" : project.link;

    projectDetailTitle.textContent = title;
    projectDetailContent.innerHTML = `
        <article class="drawer-post project-drawer-post">
            ${renderProjectPreview(project, "drawer-cover project-detail-cover")}
            <p class="post-category">${escapeHtml(portfolioCopy(project.category || "Project"))}</p>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(body)}</p>
            <dl class="project-detail-meta">
                <div><dt>Field</dt><dd>${escapeHtml(portfolioCopy(project.category || "Project"))}</dd></div>
                ${role ? `<div><dt>Role</dt><dd>${escapeHtml(role)}</dd></div>` : ""}
                ${tools.length ? `<div><dt>Tools</dt><dd>${escapeHtml(tools.join(", "))}</dd></div>` : ""}
                ${credits ? `<div><dt>Collaborators & credits</dt><dd>${escapeHtml(credits)}</dd></div>` : ""}
                ${outcome ? `<div><dt>Outcome</dt><dd>${escapeHtml(outcome)}</dd></div>` : ""}
            </dl>
            ${projectLink ? `<a class="btn btn-secondary drawer-link" href="${escapeHtml(projectLink)}" target="_blank" rel="noreferrer">Open Project</a>` : ""}
        </article>
    `;
    PortfolioUI.openDrawer("project-detail-drawer");
}

function bindProjectOpeners(card, project) {
    card.querySelectorAll("[data-project-open]").forEach((button) => {
        button.addEventListener("click", () => openProjectDetails(project));
    });
}

function renderProjectAction(project, className) {
    return `<button class="${className}" type="button" data-project-open="${escapeHtml(project.id)}">View details</button>`;
}

function renderProjectPreview(project, className = "card-thumb") {
    const image = PortfolioProjectPolicy.imageURL(project.imageUrl || project.coverImage || "");
    if (image) {
        return `<div class="${className} has-image"><img src="${escapeHtml(image)}" alt="${escapeHtml(getProjectDisplayTitle(project))} preview" loading="lazy" /></div>`;
    }

    return `<div class="${className}"><span>${escapeHtml(getProjectInitials(project))}</span></div>`;
}

function getProjectCopyProfile(project) {
    const text = `${project?.id || ""} ${project?.title || ""}`.toLowerCase();
    return projectCopyProfiles.find((profile) => profile.terms.some((term) => text.includes(term)));
}

function getProjectDisplayTitle(project) {
    const profile = getProjectCopyProfile(project);
    return portfolioCopy(profile?.title || project.title || "Untitled Project").trim();
}

function getProjectCardDescription(project) {
    const profile = getProjectCopyProfile(project);
    return trimProjectSentence(portfolioCopy(profile?.description || project.description || ""));
}

function trimProjectSentence(value) {
    const cleaned = String(value || "").replace(/\s+/g, " ").trim();
    if (!cleaned) {
        return "Creative media project focused on clear interaction and visual execution.";
    }

    const firstSentence = cleaned.match(/^.*?[.!?](?=\s|$)/)?.[0] || cleaned;
    if (firstSentence.length <= 112) {
        return firstSentence;
    }

    return `${firstSentence.slice(0, 109).trim().replace(/[\s,;:.-]+$/, "")}...`;
}

function getProjectInitials(project) {
    const words = getProjectDisplayTitle(project).match(/[A-Za-z0-9]+/g) || [];
    if (!words.length) {
        return String(project.number || "P").slice(0, 2).toUpperCase();
    }

    return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}
function portfolioCopy(value) {
    return String(value || "")
        .replace(/\bschool projects\b/gi, "projects")
        .replace(/\bschool project\b/gi, "project")
        .replace(/\bassignments\b/gi, "projects")
        .replace(/\bassignment\b/gi, "project")
        .replace(/\bcoursework\b/gi, "portfolio work")
        .replace(/\bcourse submissions\b/gi, "finished pieces")
        .replace(/\bcourse submission\b/gi, "finished piece")
        .replace(/\bsubmissions\b/gi, "finished pieces")
        .replace(/\bsubmission\b/gi, "finished piece")
        .replace(/\bsubmitted\b/gi, "completed")
        .replace(/\bASGs\b/g, "projects")
        .replace(/\bASG\b/g, "project")
        .replace(/\bCAs\b/g, "projects")
        .replace(/\bCA\d*\b/g, "project")
        .replace(/\bcourse-based\b/gi, "portfolio")
        .replace(/\bcourse-level\b/gi, "portfolio")
        .replace(/\bproject project\b/gi, "project");
}

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

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
const projectDescriptionInput = document.querySelector("#project-description");
const projectTagsInput = document.querySelector("#project-tags");
const projectLinkInput = document.querySelector("#project-link");
const projectImageInput = document.querySelector("#project-image");
const projectFeaturedInput = document.querySelector("#project-featured");
const resetProjectButton = document.querySelector("#reset-project-form");
const projectFilterButtons = document.querySelectorAll("[data-project-filter]");
const projectSearchInput = document.querySelector("#project-search");
const projectResultCount = document.querySelector("#project-result-count");
const projectDetailContent = document.querySelector("#project-detail-content");
const projectDetailTitle = document.querySelector("#project-detail-title");
const managementPage = Boolean(projectForm);

let projectUser = null;
let projectIsAdmin = false;
let unsubscribeProjects = null;
let latestProjects = [];
let activeProjectFilter = "all";
let projectSearchTerm = "";
const projectEditor = managementPage ? PortfolioEditor.mount(projectForm, "project") : null;
const projectImageUploads = managementPage ? PortfolioImageUpload.mount({ form: projectForm, kind: "project" }) : null;
const projectHighlights = PortfolioHighlights.mount(featuredProjects, renderFeaturedProjects);

function isProjectAdmin(user) {
    if (!managementPage || !user) {
        return false;
    }

    const uidList = Array.isArray(ADMIN_UIDS) ? ADMIN_UIDS : [];
    return !ALLOW_ANY_SIGNED_IN_USER_TO_EDIT && uidList.includes(user.uid);
}

function setProjectMessage(message, type = "") {
    if (!projectAuthStatus) return;
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
        // Correct only the known old built-in attribution; never overwrite custom edited copy.
        const legacyEchoCopy = project.id === "echoworks-training-platform" && project.description === "Unity training platform for Singapore Red Cross workplace communication scenarios.";
        const approvedEchoFields = legacyEchoCopy ? Object.fromEntries(["description", "category", "role", "credits", "tools", "tags", "link", "githubUrl", "liveUrl"].map((key) => [key, existing[key]])) : {};
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
        ...PortfolioEditor.list(project.tools),
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

function projectDisplayRank(project) {
    if (project.id === "multilingual-questionnaire-platform") return 0;
    if (getProjectDedupeKey(project) === "echoworks") return 1;
    if (project.id === "politeload-course-download-utility") return 2;
    return 3;
}

function enrichProjectForDisplay(project) {
    if (getProjectDedupeKey(project) !== "echoworks") return project;
    const approved = defaultProjects.find((item) => item.id === "echoworks-training-platform");
    if (!approved) return project;
    const vagueDescription = /^currently working on it[.!]?$/i.test(String(project.description || "").trim());
    return {
        ...project,
        description: vagueDescription ? approved.description : project.description,
        role: project.role || approved.role,
        tools: PortfolioEditor.list(project.tools).length ? project.tools : approved.tools,
        imageUrl: project.imageUrl || project.coverImage || approved.imageUrl,
        caseStudyUrl: project.caseStudyUrl || approved.caseStudyUrl,
        featured: true,
    };
}

// On arrival from Home, async project cards can move the case-study anchor.
// Keep that initial destination aligned only until the visitor takes control.
const initialCaseStudy = /^#case-study-(questionnaire|echoworks|politeload)$/.test(window.location.hash)
    ? document.getElementById(window.location.hash.slice(1)) : null;
let keepInitialCaseStudyAligned = Boolean(initialCaseStudy);

function alignInitialCaseStudy() {
    if (!keepInitialCaseStudyAligned) return;
    window.requestAnimationFrame(() => {
        if (keepInitialCaseStudyAligned) {
            initialCaseStudy.scrollIntoView({ behavior: "instant", block: "start" });
        }
    });
}

if (initialCaseStudy) {
    const releaseInitialAnchor = () => { keepInitialCaseStudyAligned = false; };
    ["wheel", "touchstart", "pointerdown", "keydown", "hashchange"].forEach((event) => {
        window.addEventListener(event, releaseInitialAnchor, { once: true, passive: true });
    });
    window.addEventListener("load", alignInitialCaseStudy, { once: true });
    document.fonts?.ready.then(alignInitialCaseStudy);
}

function renderProjects(projects) {
    latestProjects = projects;
    window.PortfolioProjectManagement?.refresh({ projects: latestProjects, isAdmin: projectIsAdmin, user: projectUser, db, edit: fillProjectForm });
    projects = projects.filter(PortfolioProjectPolicy.isListed).map(enrichProjectForDisplay)
        .sort((a, b) => projectDisplayRank(a) - projectDisplayRank(b));
    const featured = chooseFeaturedProjects(projects);
    projectHighlights.update(projects);
    renderProjectGrid(projects, featured);
    alignInitialCaseStudy();
}

function chooseFeaturedProjects(projects) {
    return [...projects].sort((a, b) => projectDisplayRank(a) - projectDisplayRank(b))
        .filter(project => project.featured).slice(0, 3);
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
                <h3>${escapeHtml(getProjectDisplayTitle(project))}</h3>
                <p>${escapeHtml(getProjectCardDescription(project))}</p>
            </div>
            ${renderProjectAction(project, "btn btn-primary")}
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
        const explicitTools = PortfolioEditor.list(project.tools);
        const cardTools = explicitTools.length ? explicitTools : PortfolioEditor.list(project.tags).slice(0, 4);
        const card = document.createElement("article");
        card.className = `project-card is-filtered-in${featuredIds.has(project.id) ? " is-featured" : ""}`;
        card.id = `project-${project.id}`;
        card.innerHTML = `
            ${renderProjectPreview(project)}
            <div class="card-body">
                <h2 class="card-title">${escapeHtml(getProjectDisplayTitle(project))}</h2>
                <p class="card-desc">${escapeHtml(getProjectCardDescription(project))}</p>
                ${project.role ? `<p class="project-card-meta"><strong>Role:</strong> ${escapeHtml(project.role)}</p>` : ""}
                ${cardTools.length ? `<p class="project-card-meta"><strong>${explicitTools.length ? "Technologies" : "Tools &amp; focus"}:</strong> ${escapeHtml(cardTools.join(" · "))}</p>` : ""}
                <div class="post-actions project-card-actions">
                    ${renderProjectAction(project, "btn btn-secondary project-view-button")}
                    ${PortfolioEditor.safeURL(project.link) ? `<button class="text-action" type="button" data-project-open>Details</button>` : ""}
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
                deleteButton.textContent = defaultProjects.some((item) => item.id === project.id) ? "Reset saved changes" : "Delete";
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

    // Keep the real local project list visible while Firestore connects.
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
    if (!projectIsAdmin || !projectEditor.load({
        ...project, image: project.imageUrl || project.coverImage || "",
        "github-url": project.githubUrl, "live-url": project.liveUrl,
        "portfolio-url": project.portfolioUrl, "model-url": project.modelUrl,
        "portfolio-visible": PortfolioProjectPolicy.isListed(project),
    })) return;
    PortfolioUI.openDrawer("project-editor-drawer");
    projectTitleInput.focus();
}

function resetProjectForm() {
    projectEditor.clear();
}

async function saveProject(event) {
    event.preventDefault();

    if (!projectIsAdmin || projectEditor.isBusy()) {
        projectEditor.message("Login as the configured admin before editing projects.", true);
        return;
    }
    if (projectEditor.values().publication === "draft") { projectEditor.saveDraft(); return; }
    if (!projectEditor.validate()) return;
    if (!db) { projectEditor.message("Firebase is unavailable. Save a local draft and try again later.", true); return; }
    const data = projectEditor.values();
    const existing = latestProjects.find((item) => item.id === data.id);
    const docRef = data.id ? db.collection("projects").doc(data.id) : db.collection("projects").doc();
    const savingUID = projectUser.uid;
    projectEditor.saveDraft();
    projectEditor.setBusy(true);
    try {
        await docRef.set({
        number: projectNumberInput.value.trim(),
        title: projectTitleInput.value.trim(),
        category: projectCategoryInput.value.trim(),
        description: projectDescriptionInput.value.trim(),
        tags: projectTagsInput.value.split(",").map((tag) => tag.trim()).filter(Boolean),
        link: projectLinkInput.value.trim(),
        imageUrl: projectImageInput.value.trim(),
        featured: projectFeaturedInput.checked,
        role: data.role, outcome: data.outcome, credits: data.credits, tools: PortfolioEditor.list(data.tools),
        date: data.date, status: data.status,
        githubUrl: data["github-url"], liveUrl: data["live-url"], portfolioUrl: data["portfolio-url"], modelUrl: data["model-url"],
        publicationState: "published",
        ...(!existing ? { createdAt: firebase.firestore.FieldValue.serverTimestamp() } : {}),
        portfolioVisible: data["portfolio-visible"],
        sortOrder: Number(projectNumberInput.value.trim()) || existing?.sortOrder || Math.max(0, ...latestProjects.map((item) => Number(item.sortOrder) || 0)) + 1,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
        if (projectUser?.uid === savingUID) projectEditor.saved();
    } catch (error) {
        if (projectUser?.uid === savingUID) projectEditor.message(`Could not publish. Your draft is still in the editor. ${error.message}`, true);
    } finally { projectEditor.setBusy(false); }
}

async function deleteProject(projectId) {
    if (!projectIsAdmin || !db) return;
    const project = latestProjects.find((item) => item.id === projectId);
    const isDefault = defaultProjects.some((item) => item.id === projectId);
    if (!window.confirm(isDefault ? `Reset saved changes to “${project?.title}”? The original built-in project will remain visible.` : `Delete “${project?.title}” from Firebase? This cannot be undone here.`)) {
        return;
    }
    try { await db.collection("projects").doc(projectId).delete(); }
    catch (error) { window.alert(`Could not delete the saved project. ${error.message}`); }
}

projectAuthForm?.addEventListener("submit", async (event) => {
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

projectLogoutButton?.addEventListener("click", () => {
    auth?.signOut();
});

projectForm?.addEventListener("submit", saveProject);
resetProjectButton?.addEventListener("click", resetProjectForm);
openProjectDrawerButton?.addEventListener("click", (event) => {
    event.preventDefault(); event.stopPropagation();
    if (projectIsAdmin && projectEditor.startNew()) PortfolioUI.openDrawer("project-editor-drawer");
});

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
    projectImageUploads?.setUser(projectIsAdmin ? user : null);
    projectEditor?.setUser(projectIsAdmin ? user : null);
    if (!projectIsAdmin && document.querySelector("#project-editor-drawer.is-open")) PortfolioUI.closeDrawer();

    if (user) {
        if (projectAuthHint) projectAuthHint.textContent = projectIsAdmin
            ? `Logged in as editor: ${user.displayName || user.email}`
            : `Logged in as ${user.displayName || user.email}.`;
        if (projectLogoutButton) projectLogoutButton.hidden = false;
    } else {
        if (projectAuthHint) projectAuthHint.textContent = "Only the site owner can manage projects. Sign in on the Blog to comment.";
        if (projectLogoutButton) projectLogoutButton.hidden = true;
    }

    if (projectAdminPanel) projectAdminPanel.hidden = !projectIsAdmin;
    if (openProjectDrawerButton) openProjectDrawerButton.hidden = !projectIsAdmin;
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
    const body = project.description || getProjectCardDescription(project);
    const tags = Array.isArray(project.tags) ? project.tags : [];

    projectDetailTitle.textContent = title;
    projectDetailContent.innerHTML = `
        <article class="drawer-post project-drawer-post">
            ${renderProjectPreview(project, "drawer-cover project-detail-cover")}
            <p class="post-category">${escapeHtml(portfolioCopy(project.category || "Project"))}</p>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(body)}</p>
            <dl class="project-facts">${[["Role", project.role], ["Tools", PortfolioEditor.list(project.tools).join(", ")], ["Date", project.date], ["Status", project.status], ["Outcome", project.outcome], ["Credits", project.credits]].filter(([, value]) => value).map(([label, value]) => `<dt>${label}</dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl>
            ${tags.length ? `<div class="tag-list detail-tags">${renderTags(tags)}</div>` : ""}
            <div class="post-actions">${[["Case Study", project.caseStudyUrl], ["Open Project", project.link], ["GitHub", project.githubUrl], ["Live site", project.liveUrl], ["Portfolio", project.portfolioUrl], ["Model", project.modelUrl]].filter(([, url]) => PortfolioEditor.safeURL(url)).map(([label, url]) => `<a class="btn btn-secondary drawer-link" href="${escapeHtml(url)}"${/^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`).join("")}</div>
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
    if (PortfolioEditor.safeURL(project.caseStudyUrl)) {
        return `<a class="${className}" href="${escapeHtml(project.caseStudyUrl)}">View Case Study</a>`;
    }
    if (PortfolioEditor.safeURL(project.link)) {
        return `<a class="${className}" href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer">View Project</a>`;
    }

    return `<button class="${className}" type="button" data-project-open="${escapeHtml(project.id)}">View Project</button>`;
}

function renderProjectPreview(project, className = "card-thumb") {
    const image = PortfolioEditor.safeURL(PortfolioProjectPolicy.imageURL(project.imageUrl || project.coverImage || ""));
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
    return String(project.source === "firebase" ? project.title || profile?.title || "Untitled Project" : profile?.title || project.title || "Untitled Project").trim();
}

function getProjectCardDescription(project) {
    const profile = getProjectCopyProfile(project);
    return trimProjectSentence(project.source === "firebase" ? project.description || "" : portfolioCopy(profile?.description || project.description || ""));
}

function trimProjectSentence(value) {
    const cleaned = String(value || "").replace(/\s+/g, " ").trim();
    if (!cleaned) {
        return "Creative media project focused on clear interaction and visual execution.";
    }

    const firstSentence = cleaned.match(/^.*?[.!?](?=\s|$)/)?.[0] || cleaned;
    // Let the card's CSS line clamp handle layout without cutting a word in half.
    return firstSentence;
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

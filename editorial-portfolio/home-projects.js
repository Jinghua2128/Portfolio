const homeProjectFallbacks = [
    { id: "stickar-ar-firebase", number: "01", title: "StickAR", category: "Immersive / Web App", featured: true, link: "https://stickar-36faf.web.app/" },
    { id: "labrats-vr-learning-concept", number: "02", title: "LabRats", category: "AR / Education", featured: true, link: "https://github.com/Jinghua2128/LabRats" },
    { id: "echoworks-training-platform", number: "03", title: "EchoWorks", category: "Web / Interactive Training", featured: true, link: "https://echoworks-e3b4d.web.app/" },
];
const homeFeaturedProjects = document.querySelector("#home-featured-projects");
function escapeHomeProject(value) { return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function chooseHomeProjects(firebaseProjects = []) {
    const merged = new Map(homeProjectFallbacks.map((project) => [project.id, project]));
    firebaseProjects.forEach((project) => merged.set(project.id, { ...(merged.get(project.id) || {}), ...project }));
    const projects = Array.from(merged.values()).map(PortfolioProjectPolicy.prepare).filter(PortfolioProjectPolicy.isListed);
    const featured = projects.filter((project) => project.featured).slice(0, 3);
    return [...featured, ...projects.filter((project) => !featured.some((item) => item.id === project.id))].slice(0, 3);
}
function renderHomeProjects(projects) { if (!homeFeaturedProjects) return; homeFeaturedProjects.innerHTML = projects.map((project, index) => { const href = (project.link === "editorial-portfolio/index.html" ? "index.html" : project.link) || `projects.html#project-${encodeURIComponent(project.id)}`; const external = /^https?:/i.test(href); return `<a class="home-project-row" href="${escapeHomeProject(href)}"${external ? ' target="_blank" rel="noreferrer"' : ""}><span class="home-project-number">${escapeHomeProject(project.number || String(index + 1).padStart(2, "0"))}</span><h3>${escapeHomeProject(project.title || "Untitled project")}</h3><span class="home-project-category">${escapeHomeProject(project.category || "Project")}</span><span class="row-arrow" aria-hidden="true">→</span></a>`; }).join(""); }
renderHomeProjects(chooseHomeProjects());
if (typeof db !== "undefined" && db) { db.collection("projects").orderBy("sortOrder", "asc").onSnapshot((snapshot) => { renderHomeProjects(chooseHomeProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))); }, () => renderHomeProjects(chooseHomeProjects())); }

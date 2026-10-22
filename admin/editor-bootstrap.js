/* Mount owner tools only after Firebase Auth confirms the configured owner UID. */
(() => {
    const status = document.querySelector("#admin-editor-status");
    const host = document.querySelector("#admin-editor-host");
    const template = document.querySelector("#admin-editor-template");
    const kind = document.body.dataset.adminEditor;
    const common = ["script.js", "editor-tools.js", "image-upload.js", "content-order.js"];
    const scripts = kind === "projects"
        ? [...common, "project-highlights.js", "project-catalog.js", "project-management.js", "projects-firebase.js"]
        : [...common, "project-catalog.js", "blog-firebase.js"];
    const assetVersion = "20261007-2";
    let mounted = false;
    let mountedDrawers = [];

    function allowed(user) {
        return Boolean(user && !ALLOW_ANY_SIGNED_IN_USER_TO_EDIT
            && Array.isArray(ADMIN_UIDS) && ADMIN_UIDS.includes(user.uid));
    }

    function loadScript(path) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = `${path}?v=${assetVersion}`;
            script.onload = resolve;
            script.onerror = reject;
            document.body.append(script);
        });
    }

    if (!auth || !db) {
        status.textContent = "Firebase is unavailable in this checkout. Public pages remain available.";
        return;
    }

    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.replace("admin/index.html");
            return;
        }
        if (!allowed(user)) {
            window.location.replace("admin/index.html");
            return;
        }
        if (mounted) return;
        mounted = true;
        status.textContent = "Loading editor…";
        host.append(template.content.cloneNode(true));
        // Shared drawer focus management marks <main> inert while a drawer is open.
        // Keep admin drawers as body siblings so they remain interactive.
        mountedDrawers = Array.from(host.querySelectorAll(".side-drawer"));
        mountedDrawers.forEach((drawer) => document.body.append(drawer));
        try {
            for (const path of scripts) await loadScript(path);
            status.hidden = true;
            window.dispatchEvent(new Event("pageshow"));
        } catch (_) {
            mountedDrawers.forEach((drawer) => drawer.remove());
            mountedDrawers = [];
            host.replaceChildren();
            status.hidden = false;
            status.textContent = "The editor could not load. Your content was not changed. Please reload.";
        }
    });
})();

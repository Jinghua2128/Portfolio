// Only the three user-approved embeds. No thumbnails or invented descriptions.
const models = [
    { id: "6fbc704037754126ae66f0604db4d62b", title: "Chess pices - Knight", tools: ["Maya", "Substance Painter"] },
    { id: "30e4d2f5ffda42718012338c096c9cc5", title: "hologram", tools: ["Maya", "Substance Painter"] },
    { id: "9daa1337b6704d8cb0d3a6ce90513fea", title: "Crystals", tools: ["Maya", "Substance Painter", "ZBrush"] },
];
const byId = (id) => document.getElementById(id);
const list = byId("model-list"), host = byId("model-frame-host"), placeholder = byId("model-placeholder");
const loadButton = byId("model-load"), stopButton = byId("model-stop"), cameraTools = byId("model-camera");
const motion = matchMedia("(prefers-reduced-motion: reduce)");
let currentIndex = 0, generation = 0, api = null, homeCamera = null, timeout = 0, sdkPromise = null;
const status = (text) => { byId("model-status").textContent = text; };

function release() {
    generation += 1;
    clearTimeout(timeout);
    api = null; homeCamera = null;
    host.replaceChildren();
    host.removeAttribute("aria-busy");
    placeholder.hidden = false;
    stopButton.hidden = true; cameraTools.hidden = true; byId("model-instructions").hidden = true;
    loadButton.hidden = false; loadButton.disabled = false; loadButton.textContent = "Load 3D view";
}

function select(index, updateHash = true) {
    release();
    currentIndex = (index + models.length) % models.length;
    const model = models[currentIndex];
    list.querySelectorAll("button").forEach((button, position) => button.setAttribute("aria-pressed", String(position === currentIndex)));
    byId("model-title").textContent = model.title;
    byId("model-tools").textContent = model.tools.join(" · ");
    byId("model-position").textContent = `${currentIndex + 1} / ${models.length}`;
    byId("model-source").href = `https://sketchfab.com/3d-models/${model.id}`;
    if (updateHash) history.replaceState(null, "", `#${model.id}`);
    status(motion.matches ? "Reduced motion is on. The 3D view is optional; camera buttons move instantly." : "Ready when you are. Load one model at a time, or open the original on Sketchfab.");
}

function loadSDK() {
    if (window.Sketchfab) return Promise.resolve();
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
        script.async = true;
        const deadline = setTimeout(() => { script.remove(); reject(new Error("Viewer library timed out")); }, 15000);
        script.onload = () => { clearTimeout(deadline); resolve(); };
        script.onerror = () => { clearTimeout(deadline); script.remove(); reject(new Error("Viewer library unavailable")); };
        document.head.append(script);
    }).catch((error) => { sdkPromise = null; throw error; });
    return sdkPromise;
}

async function loadModel() {
    release();
    const token = generation, model = models[currentIndex];
    loadButton.disabled = true; loadButton.textContent = "Loading…";
    stopButton.hidden = false;
    host.setAttribute("aria-busy", "true");
    status(`Connecting to Sketchfab for ${model.title}…`);
    const fail = () => {
        if (token !== generation) return;
        release(); status("The 3D view could not load. Retry, or use the original Sketchfab link below. Model information is still available.");
        loadButton.textContent = "Retry 3D view";
    };
    timeout = setTimeout(fail, 45000);
    try {
        await loadSDK();
        if (token !== generation) return;
        const iframe = document.createElement("iframe");
        iframe.title = `${model.title} — interactive Sketchfab model`;
        // No autoplay permission: media is user-initiated, with no automatic spin.
        iframe.allow = "fullscreen; xr-spatial-tracking; autoplay 'none'";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        host.append(iframe);
        new window.Sketchfab("1.12.1", iframe).init(model.id, {
            autostart: 1, autospin: 0, animation_autoplay: 0, ui_sound: 0,
            success(viewer) {
                if (token !== generation) return;
                api = viewer;
                viewer.addEventListener("viewerready", () => {
                    if (token !== generation) return;
                    clearTimeout(timeout); host.removeAttribute("aria-busy"); placeholder.hidden = true;
                    viewer.pause();
                    viewer.getCameraLookAt((error, camera) => {
                        if (token !== generation || error) return;
                        homeCamera = camera; cameraTools.hidden = false;
                    });
                    byId("model-instructions").hidden = false;
                    status(`${model.title} is ready. Automatic rotation and animation are off.`);
                });
                viewer.start();
            },
            error: fail,
        });
    } catch { fail(); }
}

function moveCamera(action) {
    if (!api || !homeCamera) return;
    const token = generation, viewer = api;
    viewer.getCameraLookAt((error, camera) => {
        if (error || token !== generation) return;
        let target = camera.target, position = camera.position;
        if (action === "reset") { position = homeCamera.position; target = homeCamera.target; }
        else {
            const offset = position.map((value, i) => value - target[i]);
            if (action === "left" || action === "right") {
                const angle = (action === "left" ? 1 : -1) * Math.PI / 12;
                const [x, y] = offset;
                offset[0] = x * Math.cos(angle) - y * Math.sin(angle);
                offset[1] = x * Math.sin(angle) + y * Math.cos(angle);
            } else {
                const homeDistance = Math.hypot(...homeCamera.position.map((value, i) => value - homeCamera.target[i]));
                const distance = Math.hypot(...offset);
                const nextDistance = Math.max(homeDistance * .25, Math.min(homeDistance * 4, distance * (action === "in" ? .8 : 1.25)));
                offset.forEach((value, i) => { offset[i] = value * nextDistance / Math.max(distance, .0001); });
            }
            position = offset.map((value, i) => value + target[i]);
        }
        viewer.setCameraLookAt(position, target, motion.matches ? 0 : .18);
    });
}

list.replaceChildren();
models.forEach((model, index) => {
    const button = document.createElement("button"); button.type = "button"; button.textContent = model.title;
    button.setAttribute("aria-pressed", "false"); button.setAttribute("aria-controls", "model-viewport");
    button.addEventListener("click", () => select(index)); list.append(button);
});
loadButton.addEventListener("click", loadModel);
stopButton.addEventListener("click", () => { release(); status("3D view closed. Model information and links remain available."); loadButton.focus(); });
byId("model-previous").addEventListener("click", () => select(currentIndex - 1));
byId("model-next").addEventListener("click", () => select(currentIndex + 1));
cameraTools.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => moveCamera(button.dataset.camera)));
byId("model-navigation").hidden = false;
motion.addEventListener("change", () => { if (motion.matches) { release(); status("Reduced motion is now on. The 3D view was closed; you can reopen it when ready."); } });
document.addEventListener("visibilitychange", () => {
    if (document.hidden && host.childElementCount) { release(); status("3D view paused while this page was away. Load it again when ready."); }
});
window.addEventListener("pagehide", release);
window.addEventListener("hashchange", () => select(Math.max(0, models.findIndex((model) => model.id === location.hash.slice(1))), false));
select(Math.max(0, models.findIndex((model) => model.id === location.hash.slice(1))), false);

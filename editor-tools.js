/* Shared, framework-free editor UI. Drafts never go to public Firestore collections. */
(() => {
    const list = (value) => Array.isArray(value) ? value : String(value || "").split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
    const safeURL = (value) => {
        const text = String(value || "").trim();
        if (!text || /[\u0000-\u0020\\]/.test(text)) return "";
        try {
            const url = new URL(text, location.href);
            return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? text : "";
        } catch { return ""; }
    };
    const node = (tag, text, className) => {
        const element = document.createElement(tag);
        if (text) element.textContent = text;
        if (className) element.className = className;
        return element;
    };

    function mount(form, kind) {
        const prefix = kind === "project" ? "project" : "post";
        const project = kind === "project";
        const fields = new Map();
        const chips = [];
        let uid = "", baseline = "", pendingDraft = null, dirty = false, busy = false;
        let draftTimer = 0;
        let initialValues = {};
        const touched = new Set();
        const original = new Map(Array.from(form.querySelectorAll("input, textarea, select")).map((input) => [input.id, input]));
        const actions = form.querySelector(".auth-actions");
        const submit = actions.querySelector('[type="submit"]');
        const reset = actions.querySelector('[type="button"]');
        form.replaceChildren();
        form.classList.add("managed-editor");
        form.noValidate = true;
        reset.textContent = "New / clear";
        const status = node("p", "", "editor-status");
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        const recovery = node("div", "", "draft-recovery");
        recovery.hidden = true;
        const recoveryText = node("p");
        const restore = node("button", "Restore local draft", "text-action");
        const discard = node("button", "Discard local draft", "text-action");
        restore.type = discard.type = "button";
        recovery.append(recoveryText, restore, discard);
        form.append(recovery, status);

        const message = (text, error = false) => {
            status.textContent = text;
            status.classList.toggle("error", error);
        };
        const section = (title, help) => {
            const fieldset = node("fieldset", "", "editor-section");
            fieldset.append(node("legend", title));
            if (help) fieldset.append(node("p", help, "editor-help"));
            form.append(fieldset);
            return fieldset;
        };
        const field = (group, name, label, type = "text", help = "", options = null) => {
            const id = `${prefix}-${name}`;
            const input = original.get(id) || node(type === "textarea" ? "textarea" : options ? "select" : "input");
            input.id = id;
            if (input.tagName === "INPUT") input.type = type === "chips" ? "hidden" : type;
            if (options) options.forEach(([value, label]) => {
                const option = node("option", label); option.value = value; input.append(option);
            });
            if (input.tagName === "TEXTAREA") input.rows = name === "body" ? 9 : 3;
            input.removeAttribute("placeholder");
            if (type !== "checkbox") input.maxLength = name === "body" ? 100000 : 4000;
            const wrapper = node("div", "", "editor-field");
            const labelElement = node("label", label + (input.required ? " (required)" : ""));
            labelElement.htmlFor = id;
            wrapper.append(labelElement, input);
            if (help) {
                const hint = node("p", help, "editor-help"); hint.id = `${id}-help`;
                input.setAttribute("aria-describedby", hint.id); wrapper.append(hint);
            }
            group.append(wrapper);
            fields.set(name, input);
            if (type === "chips") {
                const values = node("div", "", "editor-chips");
                const entry = node("input"); entry.type = "text"; entry.id = `${id}-entry`;
                entry.placeholder = "Type one item, then press Enter";
                entry.setAttribute("aria-describedby", `${id}-help`);
                labelElement.htmlFor = entry.id;
                const add = node("button", "Add", "text-action"); add.type = "button";
                const row = node("div", "", "editor-chip-entry"); row.append(entry, add);
                wrapper.insertBefore(values, input); wrapper.insertBefore(row, input);
                const paint = () => {
                    values.replaceChildren();
                    list(input.value).forEach((tag, index) => {
                        const remove = node("button", `${tag} ×`, "editor-chip"); remove.type = "button";
                        remove.setAttribute("aria-label", `Remove ${tag}`);
                        remove.addEventListener("click", () => {
                            input.value = list(input.value).filter((_, position) => position !== index).join(", ");
                            paint(); changed(); entry.focus();
                        });
                        values.append(remove);
                    });
                };
                const commit = () => {
                    input.value = [...new Set([...list(input.value), ...list(entry.value)])].join(", ");
                    entry.value = ""; paint();
                };
                add.addEventListener("click", () => { commit(); changed(); entry.focus(); });
                entry.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") { event.preventDefault(); commit(); changed(); }
                });
                entry.addEventListener("blur", () => { if (entry.value.trim()) { commit(); changed(); } });
                chips.push({ paint, commit, input, entry, name });
            }
            return input;
        };

        const basics = section(project ? "Project overview" : "Post overview", "Required fields are marked. Everything else can be left blank.");
        field(basics, "title", "Title");
        field(basics, "category", "Category");
        if (project) {
            field(basics, "role", "Your role", "text", "Describe only your contribution.");
            field(basics, "description", "Short description", "textarea");
            field(basics, "outcome", "Outcome", "textarea", "What was made or learned. No metrics are required.");
            field(basics, "credits", "Collaborators & credits", "textarea", "Credit work contributed by teammates or collaborators.");
        } else {
            field(basics, "excerpt", "Excerpt", "textarea", "A short summary for the Blog card.");
            field(basics, "body", "Body", "textarea", "Write in plain text. Blank lines create paragraphs; no Markdown or HTML needed.");
        }
        const details = section(project ? "Details & tools" : "Date & connections");
        field(details, "date", project ? "Project date" : "Post date", "date", project ? "Used for Latest projects. Existing dates stay unchanged unless you choose a new date." : "Posts appear newest first using this date. Existing dates stay unchanged unless you choose a new date.");
        if (project) {
            const number = field(details, "number", "Display order", "number", "Lower numbers appear first. Leave blank for the next position.");
            number.required = false; number.min = "1";
            number.parentElement.querySelector("label").textContent = "Display order";
            field(details, "status", "Project status", "select", "", [["", "Not specified"], ["in-progress", "In progress"], ["completed", "Completed"], ["launched", "Launched"], ["archived", "Archived"]]);
            field(details, "tags", "Tags", "chips", "Add items individually. Existing tags are preserved.");
            field(details, "tools", "Tools", "chips", "Only list tools you used for this project.");
            field(details, "featured", "Featured project", "checkbox", "Included in the existing featured selection (up to three cards).");
            field(details, "portfolio-visible", "Show in public portfolio", "checkbox", "Turn off to keep the project record without listing it publicly. This is display visibility, not private storage.");
        } else {
            field(details, "related-project", "Related project link", "text", "Paste a project URL, or choose an existing project below.");
            const choices = field(details, "related-choice", "Choose an existing project", "select", "Optional; selecting a project fills the link above.", [["", "None selected"]]);
            choices.addEventListener("change", () => {
                if (choices.value) fields.get("related-project").value = choices.value;
                changed();
            });
        }
        const links = section("Links & media", "Use an image URL or choose a photo below. Upload first, then save your changes. Media is not added to the 3D gallery automatically.");
        field(links, "link", "Primary project / external link", "text", "https://… or a relative page path such as projects.html");
        if (project) {
            field(links, "github-url", "GitHub URL", "text");
            field(links, "live-url", "Live URL", "text");
            field(links, "portfolio-url", "External portfolio URL", "text");
            field(links, "image", "Project image URL", "text", "Use a URL/local path or upload below. Leave empty to use the existing default preview.");
            field(links, "model-url", "Authorised model URL", "text", "GLB/GLTF or Sketchfab page URL. Stored as a link only; gallery approval is separate.");
        } else {
            field(links, "cover-image", "Cover image URL", "text", "Use a URL/local path or upload below, e.g. imgs/Blogs/EchoWorks/photo.JPG");
            field(links, "image-urls", "Body image URLs", "chips", "Add one existing image URL at a time. Legacy comma-separated values are preserved.");
        }
        const publishing = section("Save & publish", "Drafts stay in this browser for this admin account, not in Firebase. Avoid sensitive content on shared devices. Drafting changes to a published item does not unpublish it.");
        field(publishing, "publication", "Save destination", "select", "", [["draft", "Local draft — not published"], ["published", "Publish to website"]]);
        ["id", ...(!project ? ["day", "month"] : [])].forEach((name) => {
            const input = original.get(`${prefix}-${name}`);
            input.type = "hidden"; input.required = false; fields.set(name, input); form.append(input);
        });
        const preview = node("details", "", "editor-preview");
        preview.append(node("summary", "Preview text & links"));
        const previewBody = node("div"); preview.append(previewBody);
        form.append(preview, actions);

        function values() {
            const data = Object.fromEntries(Array.from(fields, ([name, input]) => [name, input.type === "checkbox" ? input.checked : input.value.trim()]));
            // Include unfinished chip input in drafts without interrupting typing.
            chips.forEach(({ name, input, entry }) => {
                data[name] = [...new Set([...list(input.value), ...list(entry.value)])].join(", ");
            });
            if (!touched.has("date") && initialValues.date) data.date = initialValues.date;
            return data;
        }
        function renderPreview() {
            const data = values();
            previewBody.replaceChildren(node("p", data.category, "editor-help"), node("h3", data.title || "Untitled draft"), node("p", data.description || data.excerpt || "No summary yet."));
            if (data.body) previewBody.append(node("p", data.body, "editor-preview-body"));
            if (data.role) previewBody.append(node("p", `Role: ${data.role}`));
            if (data.tools) previewBody.append(node("p", `Tools: ${data.tools}`));
            if (data.credits) previewBody.append(node("p", `Credits: ${data.credits}`));
            if (safeURL(data.link)) {
                const link = node("a", "Open primary link"); link.href = safeURL(data.link); link.target = "_blank"; link.rel = "noopener noreferrer"; previewBody.append(link);
            }
            submit.textContent = data.publication === "published" ? (data.id ? "Publish changes" : "Publish to website") : "Save local draft";
        }
        const key = () => `portfolio-editor:v1:${kind}:${uid}`;
        function stash(explicit = false) {
            clearTimeout(draftTimer);
            if (!uid || busy || (!dirty && !explicit) || pendingDraft) return false;
            try {
                localStorage.setItem(key(), JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), values: values() }));
                message("Draft saved on this browser. These edits have not been published.");
                return true;
            } catch {
                message("Browser storage is unavailable or full. Keep this editor open and copy your text before leaving.", true);
                return false;
            }
        }
        function changed(event) {
            if (event?.target?.id === `${prefix}-date`) touched.add("date");
            form.querySelectorAll("[aria-invalid]").forEach((input) => input.removeAttribute("aria-invalid"));
            dirty = JSON.stringify(values()) !== baseline;
            renderPreview();
            clearTimeout(draftTimer);
            if (dirty) draftTimer = setTimeout(stash, 700);
        }
        function removeDraft() {
            clearTimeout(draftTimer);
            try { if (uid) localStorage.removeItem(key()); } catch { /* An unavailable store is reported on the next save. */ }
            pendingDraft = null; recovery.hidden = true;
        }
        function load(data = {}, publication = "draft") {
            form.reset();
            initialValues = { ...data }; touched.clear();
            const heading = form.closest(".side-drawer")?.querySelector("h2");
            if (heading) heading.textContent = `${data.id ? "Edit" : "New"} ${project ? "Project" : "Blog Post"}`;
            fields.forEach((input, name) => {
                const value = data[name] ?? (name === "publication" ? publication : name === "portfolio-visible" ? true : "");
                if (input.type === "checkbox") input.checked = Boolean(value);
                else input.value = Array.isArray(value) ? value.join(", ") : String(value);
                // Preserve unfamiliar legacy select values without silently deleting them.
                if (input.tagName === "SELECT" && input.value !== String(value)) {
                    const option = node("option", String(value)); option.value = String(value); input.append(option); input.value = String(value);
                }
            });
            chips.forEach((chip) => chip.paint());
            form.querySelector(".editor-legacy-date")?.remove();
            if (data.date && !fields.get("date").value) {
                fields.get("date").parentElement.append(node("p", `Existing date: ${data.date}. Kept unchanged unless you choose a new date.`, "editor-help editor-legacy-date"));
            }
            baseline = JSON.stringify(values()); dirty = false; renderPreview();
        }
        const canReplace = () => !busy && (!(dirty || pendingDraft) || confirm("Replace the current local draft? Copy anything you want to keep first. Published content is unchanged."));
        restore.addEventListener("click", () => {
            if (!pendingDraft || busy) return;
            const data = pendingDraft.values; pendingDraft = null; recovery.hidden = true;
            load(data); dirty = true; message("Local draft restored. Review it before publishing."); fields.get("title").focus();
        });
        discard.addEventListener("click", () => {
            if (confirm("Discard the saved local draft? Published content will not change.")) { removeDraft(); message("Local draft discarded."); }
        });
        form.addEventListener("input", changed);
        form.addEventListener("change", changed);
        form.addEventListener("portfolio:image-uploaded", () => { chips.forEach(chip => chip.paint()); changed(); });
        window.addEventListener("beforeunload", (event) => {
            stash();
            if (dirty || busy) { event.preventDefault(); event.returnValue = ""; }
        });
        document.addEventListener("visibilitychange", () => { if (document.hidden) stash(); });
        load();

        return {
            values, message, saveDraft: () => {
                if (pendingDraft) { message("Restore or discard your saved draft first.", true); restore.focus(); return false; }
                chips.forEach((chip) => chip.commit()); dirty = true; return stash(true);
            },
            load(data, publication = "published") {
                if (!canReplace()) return false;
                removeDraft(); load(data, publication); message("Editing a saved item. Changes are not live until you publish."); return true;
            },
            clear() {
                if (!canReplace()) return false;
                removeDraft(); load(); message("New draft. Nothing has been published."); return true;
            },
            startNew() {
                // On return, offer recovery before replacing an existing browser draft.
                if (pendingDraft) return !busy;
                if (!canReplace()) return false;
                removeDraft(); load(); message("New draft. Nothing has been published."); return true;
            },
            saved() { removeDraft(); load(); message("Published successfully. Your local draft was cleared."); },
            setUser(user) {
                const nextUID = user?.uid || "";
                if (uid === nextUID) return;
                stash(); uid = nextUID; pendingDraft = null; recovery.hidden = true; load(); message("");
                if (!uid) return;
                try {
                    const saved = JSON.parse(localStorage.getItem(key()) || "null");
                    if (saved?.version === 1 && saved.values && typeof saved.values === "object") {
                        pendingDraft = saved; recovery.hidden = false;
                        recoveryText.textContent = `A local draft is available: ${saved.values.title || "Untitled"}. Restore or discard it before editing another item.`;
                    }
                } catch { message("The saved draft could not be read. Published content is unaffected.", true); }
            },
            setBusy(value) {
                busy = value;
                form.setAttribute("aria-busy", String(value));
                form.querySelectorAll("input, textarea, select, button").forEach((input) => { input.disabled = value; });
                if (value) message("Publishing… Please keep this page open.");
            },
            isBusy: () => busy,
            validate() {
                if (pendingDraft) { message("Restore or discard your saved draft first.", true); restore.focus(); return false; }
                chips.forEach((chip) => chip.commit());
                let invalid = null;
                fields.forEach((input, name) => {
                    const target = chips.find((chip) => chip.input === input)?.entry || input;
                    target.setCustomValidity("");
                    const value = input.value.trim();
                    if (input.required && !value) target.setCustomValidity("Please fill in this field.");
                    const isURL = /(^link$|url$|^image$|^cover-image$|^related-project$)/.test(name);
                    if (value && isURL && !safeURL(value)) target.setCustomValidity("Use an HTTP(S) URL or a relative site path, without spaces.");
                    if (name === "image-urls" && list(value).some((url) => !safeURL(url))) target.setCustomValidity("Check each image URL.");
                    if (!target.checkValidity()) { target.setAttribute("aria-invalid", "true"); invalid ||= target; }
                });
                if (invalid) { message("Please check the highlighted field before publishing.", true); invalid.reportValidity(); invalid.focus(); return false; }
                return true;
            },
            setProjectChoices(projects) {
                const select = fields.get("related-choice"); if (!select) return;
                const previous = select.value;
                select.replaceChildren(new Option("None selected", ""));
                projects.forEach((item) => select.append(new Option(item.title, `projects.html#project-${encodeURIComponent(item.id)}`)));
                select.value = previous;
            },
        };
    }
    window.PortfolioEditor = { mount, safeURL, list };
})();

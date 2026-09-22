// Admin-only access to the full catalog, including projects hidden from the public grid.
(() => {
    let state = null;
    let panel = null;
    let select = null;
    let note = null;
    let editButton = null;

    function refresh(next) {
        state = next;
        const host = document.querySelector("#project-admin-panel");
        if (!host) return;
        if (!next.isAdmin) {
            panel?.remove();
            panel = select = note = editButton = null;
            return;
        }
        if (!panel) {
            panel = document.createElement("details");
            panel.id = "project-record-manager";
            panel.className = "editor-preview";
            const summary = document.createElement("summary");
            summary.textContent = "Manage all projects, including hidden work";
            const fields = document.createElement("div");
            fields.className = "drawer-form";
            const label = document.createElement("label");
            label.htmlFor = "project-record-choice";
            label.textContent = "Choose a project record";
            select = document.createElement("select");
            select.id = "project-record-choice";
            note = document.createElement("p");
            note.className = "drawer-note";
            note.setAttribute("aria-live", "polite");
            editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "btn btn-secondary";
            editButton.textContent = "Edit selected project";
            editButton.addEventListener("click", () => {
                if (!state?.isAdmin) return;
                const project = state.projects.find((item) => item.id === select.value);
                if (project) state.edit(project);
            });
            select.addEventListener("change", describeSelection);
            fields.append(label, select, note, editButton);
            panel.append(summary, fields);
            host.prepend(panel);
        }
        const previous = select.value;
        select.replaceChildren(new Option("Choose a project", ""));
        next.projects.forEach((project) => {
            const hidden = !window.PortfolioProjectPolicy.isListed(project);
            select.append(new Option(`${project.title || "Untitled project"}${hidden ? " — hidden" : ""}`, project.id));
        });
        select.value = previous;
        if (select.selectedIndex < 0) select.value = "";
        describeSelection();
    }

    function describeSelection() {
        const project = state?.projects.find((item) => item.id === select.value);
        editButton.disabled = !project;
        note.textContent = !project
            ? "Hidden work stays available here. Display visibility does not delete a Firebase record."
            : project.source === "firebase"
                ? "Loaded from Firebase. Use the editor to change details or public visibility."
                : "Built-in copy. Saving through the editor stores it in Firebase; cloud storage is not yet confirmed for this record.";
    }

    window.PortfolioProjectManagement = { refresh };
})();

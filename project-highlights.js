/* Three compact views within the existing featured-project area. */
(() => {
    function mount(container, render) {
        let projects = [], active = 'featured';
        const groups = [
            ['featured', 'Featured', 'Featured Work', 'Choose up to three highlights using Featured project in the editor.'],
            ['progress', 'In Progress', 'In Progress', 'No public projects are marked In progress yet.'],
            ['latest', 'Latest', 'Latest Projects', 'No dated projects yet. Add a project date in the editor to include it here.'],
        ];
        const host = container.closest('.project-feature-stage, .featured-projects-section');
        const heading = host?.querySelector('h2');
        const description = host?.querySelector('.featured-copy p, .section-heading-row span');
        const tabs = document.createElement('div'); tabs.className = 'project-highlight-tabs'; tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Project highlights');
        const buttons = groups.map(([key, label]) => {
            const button = document.createElement('button'); button.type = 'button'; button.id = `highlight-${key}`;
            button.className = 'filter-chip'; button.dataset.highlight = key;
            button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', container.id);
            button.addEventListener('click', () => { active = key; paint(); });
            button.addEventListener('keydown', event => {
                const index = buttons.indexOf(button);
                const next = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : -1;
                if (next < 0) return;
                event.preventDefault(); buttons[next].click(); buttons[next].focus();
            });
            button.textContent = label; tabs.append(button); return button;
        });
        if (host?.querySelector('.featured-copy')) host.querySelector('.featured-copy').append(tabs);
        else container.before(tabs);
        container.setAttribute('role', 'tabpanel'); container.tabIndex = 0;
        function select(key) {
            if (key === 'featured') return projects.filter(p => p.featured).slice(0,3);
            const sorted = PortfolioContentOrder.newest(projects, 'project');
            return sorted.filter(key === 'progress' ? PortfolioContentOrder.inProgress : p => PortfolioContentOrder.date(p, 'project') > 0).slice(0,3);
        }
        function paint() {
            const [, , title, empty] = groups.find(([key]) => key === active);
            buttons.forEach((button, index) => {
                const key = groups[index][0], selected = active === key;
                button.textContent = `${groups[index][1]} (${select(key).length})`;
                button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
                button.classList.toggle('is-active', selected);
            });
            if (heading) heading.textContent = title;
            if (description) description.textContent = active === 'latest' ? 'Up to three projects, newest dated work first.' : active === 'progress' ? 'Up to three projects currently marked In progress.' : 'Up to three selected highlights.';
            container.setAttribute('aria-labelledby', `highlight-${active}`);
            const items = select(active);
            render(items);
            if (!items.length) { const note = document.createElement('p'); note.className = 'card-desc'; note.textContent = empty; container.replaceChildren(note); }
        }
        return { update(items) { projects = items; paint(); } };
    }
    window.PortfolioHighlights = Object.freeze({ mount });
})();

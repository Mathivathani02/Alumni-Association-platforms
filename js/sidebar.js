// Injects the logged-in app shell sidebar + topbar into any dashboard-style page.
// Usage: <div id="sidebar-root"></div> then include this script, then call renderSidebar('dashboard')

function renderSidebar(active) {
    const root = document.getElementById('sidebar-root');
    if (!root) return;

    const user = getUser() || {};
    const links = [
        { id: 'dashboard', href: 'dashboard.html', icon: 'fa-gauge', label: 'Dashboard' },
        { id: 'profile', href: 'profile.html', icon: 'fa-user', label: 'My Profile' },
        { id: 'search', href: 'search.html', icon: 'fa-magnifying-glass', label: 'Find Alumni' },
        { id: 'events', href: 'events.html', icon: 'fa-calendar-days', label: 'Events' },
        { id: 'jobs', href: 'jobs.html', icon: 'fa-briefcase', label: 'Jobs' },
        { id: 'network', href: 'network.html', icon: 'fa-people-arrows', label: 'Network' },
        { id: 'contact', href: 'contact.html', icon: 'fa-envelope', label: 'Contact' },
    ];

    root.innerHTML = `
    <div class="app-shell">
        <aside class="sidebar" id="sidebar">
            <div class="logo"><i class="fa-solid fa-graduation-cap"></i> Alumni Connect</div>
            <nav>
                ${links.map(l => `<a href="${l.href}" class="${l.id === active ? 'active' : ''}"><i class="fa-solid ${l.icon}"></i> ${l.label}</a>`).join('')}
                <a href="#" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
            </nav>
        </aside>
        <div class="main-content">
            <div class="topbar">
                <div style="display:flex;align-items:center;gap:14px;">
                    <button class="sidebar-toggle" id="sidebarToggle"><i class="fa-solid fa-bars"></i></button>
                    <h1 id="pageTitle"></h1>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-weight:600;font-size:0.9rem;">${user.fullName || 'Alumni'}</span>
                    <div class="avatar" style="width:38px;height:38px;font-size:0.9rem;">${initials(user.fullName)}</div>
                </div>
            </div>
            <div class="content-wrap" id="pageContent"></div>
        </div>
    </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

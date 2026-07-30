requireAuth();
renderSidebar('dashboard');
document.getElementById('pageTitle').textContent = 'Dashboard';

const content = document.getElementById('pageContent');
content.innerHTML = `<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading dashboard...</div>`;

(async () => {
    try {
        const data = await apiFetch('/dashboard');

        content.innerHTML = `
        <div class="grid grid-3" style="margin-bottom:28px;">
            <div class="card stat-card">
                <div class="icon-circle"><i class="fa-solid fa-users"></i></div>
                <div><div class="num">${data.totalAlumni}</div><div class="label">Total Alumni</div></div>
            </div>
            <div class="card stat-card">
                <div class="icon-circle"><i class="fa-solid fa-calendar-days"></i></div>
                <div><div class="num">${data.upcomingEventsCount}</div><div class="label">Upcoming Events</div></div>
            </div>
            <div class="card stat-card">
                <div class="icon-circle"><i class="fa-solid fa-briefcase"></i></div>
                <div><div class="num">${data.latestJobsCount}</div><div class="label">Total Jobs Posted</div></div>
            </div>
        </div>

        <div class="grid grid-4" style="margin-bottom:36px;">
            <a href="search.html" class="card" style="text-align:center;">
                <div class="icon-circle" style="margin:0 auto 12px;"><i class="fa-solid fa-magnifying-glass"></i></div>
                <h3 style="font-size:1rem;">Find Alumni</h3>
            </a>
            <a href="events.html" class="card" style="text-align:center;">
                <div class="icon-circle" style="margin:0 auto 12px;"><i class="fa-solid fa-calendar-days"></i></div>
                <h3 style="font-size:1rem;">Events</h3>
            </a>
            <a href="jobs.html" class="card" style="text-align:center;">
                <div class="icon-circle" style="margin:0 auto 12px;"><i class="fa-solid fa-briefcase"></i></div>
                <h3 style="font-size:1rem;">Job Portal</h3>
            </a>
            <a href="network.html" class="card" style="text-align:center;">
                <div class="icon-circle" style="margin:0 auto 12px;"><i class="fa-solid fa-people-arrows"></i></div>
                <h3 style="font-size:1rem;">My Network</h3>
            </a>
        </div>

        <div class="grid grid-2" style="align-items:start;">
            <div>
                <h3 style="color:var(--primary);margin-bottom:14px;">Upcoming Events</h3>
                ${data.upcomingEvents.length ? data.upcomingEvents.map(ev => `
                    <a href="eventDetails.html?id=${ev._id}" class="card event-card" style="display:block;margin-bottom:14px;">
                        <span class="date-badge">${new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <h3 style="font-size:1.05rem;">${ev.title}</h3>
                        <p style="color:var(--text-light);font-size:0.9rem;">${ev.location || 'Location TBA'}</p>
                    </a>`).join('') : `<div class="empty-state"><i class="fa-regular fa-calendar"></i><p>No upcoming events</p></div>`}
            </div>
            <div>
                <h3 style="color:var(--primary);margin-bottom:14px;">Latest Jobs</h3>
                ${data.latestJobs.length ? data.latestJobs.map(job => `
                    <a href="jobs.html" class="card job-card" style="display:block;margin-bottom:14px;">
                        <h3 style="font-size:1.05rem;">${job.position}</h3>
                        <div class="company">${job.company}</div>
                        <div class="meta"><span><i class="fa-solid fa-location-dot"></i> ${job.location || 'Remote'}</span></div>
                    </a>`).join('') : `<div class="empty-state"><i class="fa-regular fa-briefcase"></i><p>No jobs posted yet</p></div>`}
            </div>
        </div>

        <h3 style="color:var(--primary);margin:36px 0 14px;">Recently Joined Alumni</h3>
        <div class="grid grid-4">
            ${data.recentAlumni.map(a => `
                <div class="card alumni-card">
                    <div class="avatar">${initials(a.fullName)}</div>
                    <h3 style="font-size:1rem;">${a.fullName}</h3>
                    <p style="color:var(--text-light);font-size:0.85rem;">${a.department || 'Department not set'}</p>
                </div>`).join('')}
        </div>
        `;
    } catch (err) {
        content.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
    }
})();

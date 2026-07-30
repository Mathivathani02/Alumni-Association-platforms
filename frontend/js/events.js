requireAuth();
renderSidebar('events');
document.getElementById('pageTitle').textContent = 'Events';

const content = document.getElementById('pageContent');
const me = getUser();

content.innerHTML = `
<div class="flex-between" style="margin-bottom:20px;">
    <p style="color:var(--text-light);">Discover and register for upcoming alumni events</p>
    <button class="btn btn-sm" id="newEventBtn"><i class="fa-solid fa-plus"></i> Create Event</button>
</div>

<div class="card" id="createBox" style="display:none;margin-bottom:26px;">
    <h3 style="margin-bottom:16px;">Create New Event</h3>
    <div class="error-msg" id="createError"></div>
    <form id="createForm">
        <div class="form-row">
            <div class="form-group"><label>Title</label><input type="text" id="title" required></div>
            <div class="form-group"><label>Location</label><input type="text" id="location"></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label>Date</label><input type="date" id="date" required></div>
            <div class="form-group"><label>Time</label><input type="time" id="time"></div>
        </div>
        <div class="form-group"><label>Description</label><textarea id="description" rows="3" required></textarea></div>
        <div style="display:flex;gap:12px;">
            <button type="submit" class="btn btn-sm">Publish Event</button>
            <button type="button" class="btn btn-outline btn-sm" id="cancelCreate">Cancel</button>
        </div>
    </form>
</div>

<div id="eventsGrid" class="grid grid-3"></div>
`;

document.getElementById('newEventBtn').addEventListener('click', () => {
    document.getElementById('createBox').style.display = 'block';
});
document.getElementById('cancelCreate').addEventListener('click', () => {
    document.getElementById('createBox').style.display = 'none';
});

document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('createError');
    hideMsg(errorEl);
    try {
        await apiFetch('/events', {
            method: 'POST',
            body: JSON.stringify({
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                location: document.getElementById('location').value,
            }),
        });
        document.getElementById('createBox').style.display = 'none';
        document.getElementById('createForm').reset();
        loadEvents();
    } catch (err) {
        showError(errorEl, err.message);
    }
});

async function loadEvents() {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = `<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading events...</div>`;
    try {
        const events = await apiFetch('/events');
        if (!events.length) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-regular fa-calendar"></i><p>No events yet. Be the first to create one!</p></div>`;
            return;
        }
        grid.innerHTML = events.map(ev => `
            <div class="card event-card">
                <span class="date-badge">${new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}${ev.time ? ' · ' + ev.time : ''}</span>
                <h3>${ev.title}</h3>
                <p style="color:var(--text-light);font-size:0.9rem;margin:8px 0;">${ev.description.slice(0, 90)}${ev.description.length > 90 ? '...' : ''}</p>
                <p style="color:var(--text-light);font-size:0.85rem;"><i class="fa-solid fa-location-dot"></i> ${ev.location || 'TBA'}</p>
                <p style="color:var(--text-light);font-size:0.8rem;margin-top:4px;">Organized by ${ev.organizer ? ev.organizer.fullName : 'Unknown'}</p>
                <a href="eventDetails.html?id=${ev._id}" class="btn btn-sm btn-block mt-20">View Details</a>
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><p>${err.message}</p></div>`;
    }
}

loadEvents();

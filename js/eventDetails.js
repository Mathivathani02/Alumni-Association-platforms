requireAuth();
renderSidebar('events');
document.getElementById('pageTitle').textContent = 'Event Details';

const content = document.getElementById('pageContent');
const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');
const me = getUser();

if (!eventId) {
    content.innerHTML = `<div class="empty-state"><p>No event specified.</p></div>`;
} else {
    load();
}

async function load() {
    content.innerHTML = `<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>`;
    try {
        const ev = await apiFetch(`/events/${eventId}`);
        const isOrganizer = ev.organizer && ev.organizer._id === me._id;
        const alreadyRegistered = ev.registeredUsers.some(u => u._id === me._id);

        content.innerHTML = `
        <a href="events.html" style="color:var(--text-light);font-size:0.9rem;"><i class="fa-solid fa-arrow-left"></i> Back to events</a>
        <div class="card" style="max-width:800px;margin-top:16px;">
            <span class="date-badge">${new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}${ev.time ? ' · ' + ev.time : ''}</span>
            <h2 style="color:var(--primary);margin:12px 0 6px;">${ev.title}</h2>
            <p style="color:var(--text-light);font-size:0.9rem;margin-bottom:16px;"><i class="fa-solid fa-location-dot"></i> ${ev.location || 'TBA'} &nbsp;·&nbsp; Organized by ${ev.organizer ? ev.organizer.fullName : 'Unknown'}</p>
            <p style="margin-bottom:22px;">${ev.description}</p>

            <div style="display:flex;gap:12px;flex-wrap:wrap;">
                ${isOrganizer
                    ? `<button class="btn btn-danger btn-sm" id="deleteEventBtn"><i class="fa-solid fa-trash"></i> Delete Event</button>`
                    : `<button class="btn btn-sm" id="registerBtn" ${alreadyRegistered ? 'disabled' : ''}>
                        <i class="fa-solid fa-check"></i> ${alreadyRegistered ? 'Already Registered' : 'Register for Event'}
                       </button>`
                }
            </div>

            <hr style="margin:22px 0;border:none;border-top:1px solid var(--border);">
            <h3 style="font-size:1rem;color:var(--primary);margin-bottom:12px;">${ev.registeredUsers.length} Registered</h3>
            <div style="display:flex;flex-wrap:wrap;gap:10px;">
                ${ev.registeredUsers.length ? ev.registeredUsers.map(u => `<span class="badge">${u.fullName}</span>`).join('') : '<p style="color:var(--text-light);font-size:0.9rem;">No one has registered yet.</p>'}
            </div>
        </div>
        `;

        const regBtn = document.getElementById('registerBtn');
        if (regBtn) {
            regBtn.addEventListener('click', async () => {
                regBtn.disabled = true;
                try {
                    await apiFetch(`/events/${eventId}/register`, { method: 'POST' });
                    load();
                } catch (err) {
                    alert(err.message);
                    regBtn.disabled = false;
                }
            });
        }

        const delBtn = document.getElementById('deleteEventBtn');
        if (delBtn) {
            delBtn.addEventListener('click', async () => {
                if (!confirm('Delete this event?')) return;
                try {
                    await apiFetch(`/events/${eventId}`, { method: 'DELETE' });
                    window.location.href = 'events.html';
                } catch (err) {
                    alert(err.message);
                }
            });
        }
    } catch (err) {
        content.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
    }
}

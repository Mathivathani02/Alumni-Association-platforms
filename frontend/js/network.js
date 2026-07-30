requireAuth();
renderSidebar('network');
document.getElementById('pageTitle').textContent = 'My Network';

const content = document.getElementById('pageContent');
const me = getUser();

content.innerHTML = `
<div style="display:flex;gap:10px;margin-bottom:24px;">
    <button class="btn btn-sm tab-btn active" data-tab="accepted">Connected</button>
    <button class="btn btn-outline btn-sm tab-btn" data-tab="incoming">Pending Requests</button>
    <button class="btn btn-outline btn-sm tab-btn" data-tab="sent">Sent Requests</button>
</div>
<div id="listGrid" class="grid grid-3"></div>
`;

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('btn'); b.classList.add('btn-outline'); });
        btn.classList.remove('btn-outline'); btn.classList.add('btn');
        load(btn.dataset.tab);
    });
});

async function respond(id, action, btn) {
    btn.disabled = true;
    try {
        await apiFetch(`/connections/${id}/${action}`, { method: 'PUT' });
        load('incoming');
    } catch (err) {
        alert(err.message);
        btn.disabled = false;
    }
}

async function load(tab) {
    const grid = document.getElementById('listGrid');
    grid.innerHTML = `<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>`;

    try {
        let connections;
        if (tab === 'accepted') {
            connections = await apiFetch('/connections?status=accepted');
        } else {
            connections = await apiFetch('/connections?status=pending');
        }

        let items = [];
        if (tab === 'accepted') {
            items = connections.map(c => ({
                person: c.requester._id === me._id ? c.recipient : c.requester,
                connectionId: c._id,
                type: 'accepted',
            }));
        } else if (tab === 'incoming') {
            items = connections.filter(c => c.recipient._id === me._id)
                .map(c => ({ person: c.requester, connectionId: c._id, type: 'incoming' }));
        } else {
            items = connections.filter(c => c.requester._id === me._id)
                .map(c => ({ person: c.recipient, connectionId: c._id, type: 'sent' }));
        }

        if (!items.length) {
            const emptyText = { accepted: 'No connections yet. Find alumni to connect with!', incoming: 'No pending requests.', sent: 'You haven\'t sent any requests yet.' };
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-people-arrows"></i><p>${emptyText[tab]}</p></div>`;
            return;
        }

        grid.innerHTML = items.map(item => `
            <div class="card alumni-card">
                <div class="avatar">${initials(item.person.fullName)}</div>
                <h3 style="font-size:1rem;">${item.person.fullName}</h3>
                <p style="color:var(--text-light);font-size:0.85rem;">${item.person.department || ''} ${item.person.currentCompany ? '· ' + item.person.currentCompany : ''}</p>
                ${item.type === 'incoming' ? `
                    <div style="display:flex;gap:8px;margin-top:14px;">
                        <button class="btn btn-sm" style="flex:1;" onclick="respond('${item.connectionId}', 'accept', this)">Accept</button>
                        <button class="btn btn-outline btn-sm" style="flex:1;" onclick="respond('${item.connectionId}', 'reject', this)">Reject</button>
                    </div>` : ''}
                ${item.type === 'sent' ? `<span class="badge mt-20" style="display:inline-block;">Pending</span>` : ''}
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><p>${err.message}</p></div>`;
    }
}

load('accepted');

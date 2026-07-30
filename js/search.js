requireAuth();
renderSidebar('search');
document.getElementById('pageTitle').textContent = 'Find Alumni';

const content = document.getElementById('pageContent');
let currentPage = 1;

content.innerHTML = `
<div class="filter-bar">
    <div class="filter-grid">
        <input type="text" id="fName" placeholder="Name">
        <input type="text" id="fDept" placeholder="Department">
        <input type="number" id="fYear" placeholder="Grad. Year">
        <input type="text" id="fCompany" placeholder="Company">
        <input type="text" id="fLocation" placeholder="Location">
    </div>
    <div style="margin-top:14px;display:flex;gap:12px;">
        <button class="btn btn-sm" id="searchBtn"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
        <button class="btn btn-outline btn-sm" id="clearBtn">Clear Filters</button>
    </div>
</div>
<div id="resultsGrid" class="grid grid-4"></div>
<div class="pagination" id="pagination"></div>
`;

async function runSearch(page = 1) {
    currentPage = page;
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = `<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Searching...</div>`;

    const params = new URLSearchParams();
    const name = document.getElementById('fName').value;
    const department = document.getElementById('fDept').value;
    const graduationYear = document.getElementById('fYear').value;
    const company = document.getElementById('fCompany').value;
    const location = document.getElementById('fLocation').value;
    if (name) params.set('name', name);
    if (department) params.set('department', department);
    if (graduationYear) params.set('graduationYear', graduationYear);
    if (company) params.set('company', company);
    if (location) params.set('location', location);
    params.set('page', page);
    params.set('limit', 8);

    try {
        const data = await apiFetch(`/search?${params.toString()}`);
        if (!data.results.length) {
            resultsGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-user-slash"></i><p>No alumni found matching your filters</p></div>`;
            document.getElementById('pagination').innerHTML = '';
            return;
        }
        resultsGrid.innerHTML = data.results.map(a => `
            <div class="card alumni-card">
                <div class="avatar">${initials(a.fullName)}</div>
                <h3 style="font-size:1rem;">${a.fullName}</h3>
                <p style="color:var(--text-light);font-size:0.85rem;">${a.department || 'Dept N/A'} ${a.graduationYear ? '· ' + a.graduationYear : ''}</p>
                <p style="color:var(--text-light);font-size:0.8rem;margin:6px 0;">${a.jobRole || ''} ${a.currentCompany ? 'at ' + a.currentCompany : ''}</p>
                <button class="btn btn-sm btn-block mt-20" onclick="sendConnect('${a._id}', this)"><i class="fa-solid fa-user-plus"></i> Connect</button>
            </div>
        `).join('');

        renderPagination(data.page, data.totalPages);
    } catch (err) {
        resultsGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><p>${err.message}</p></div>`;
    }
}

function renderPagination(page, totalPages) {
    const pag = document.getElementById('pagination');
    if (totalPages <= 1) { pag.innerHTML = ''; return; }
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === page ? 'active' : ''}" onclick="runSearch(${i})">${i}</button>`;
    }
    pag.innerHTML = html;
}

async function sendConnect(recipientId, btn) {
    btn.disabled = true;
    try {
        await apiFetch('/connections', { method: 'POST', body: JSON.stringify({ recipientId }) });
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Request Sent';
    } catch (err) {
        btn.disabled = false;
        alert(err.message);
    }
}

document.getElementById('searchBtn').addEventListener('click', () => runSearch(1));
document.getElementById('clearBtn').addEventListener('click', () => {
    ['fName', 'fDept', 'fYear', 'fCompany', 'fLocation'].forEach(id => document.getElementById(id).value = '');
    runSearch(1);
});

runSearch(1);

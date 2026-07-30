requireAuth();
renderSidebar('jobs');
document.getElementById('pageTitle').textContent = 'Job Portal';

const content = document.getElementById('pageContent');
const me = getUser();

content.innerHTML = `
<div class="flex-between" style="margin-bottom:20px;">
    <p style="color:var(--text-light);">Opportunities shared by alumni across companies</p>
    <button class="btn btn-sm" id="newJobBtn"><i class="fa-solid fa-plus"></i> Post a Job</button>
</div>

<div class="card" id="createBox" style="display:none;margin-bottom:26px;">
    <h3 style="margin-bottom:16px;">Post a New Job</h3>
    <div class="error-msg" id="createError"></div>
    <form id="createForm">
        <div class="form-row">
            <div class="form-group"><label>Company</label><input type="text" id="company" required></div>
            <div class="form-group"><label>Position</label><input type="text" id="position" required></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label>Salary</label><input type="text" id="salary" placeholder="e.g. 6-8 LPA"></div>
            <div class="form-group"><label>Location</label><input type="text" id="location"></div>
        </div>
        <div class="form-group"><label>Last Date to Apply</label><input type="date" id="lastDate" required></div>
        <div class="form-group"><label>Description</label><textarea id="description" rows="3" required></textarea></div>
        <div style="display:flex;gap:12px;">
            <button type="submit" class="btn btn-sm">Post Job</button>
            <button type="button" class="btn btn-outline btn-sm" id="cancelCreate">Cancel</button>
        </div>
    </form>
</div>

<div id="jobsGrid" class="grid grid-3"></div>
`;

document.getElementById('newJobBtn').addEventListener('click', () => {
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
        await apiFetch('/jobs', {
            method: 'POST',
            body: JSON.stringify({
                company: document.getElementById('company').value,
                position: document.getElementById('position').value,
                salary: document.getElementById('salary').value,
                location: document.getElementById('location').value,
                lastDate: document.getElementById('lastDate').value,
                description: document.getElementById('description').value,
            }),
        });
        document.getElementById('createBox').style.display = 'none';
        document.getElementById('createForm').reset();
        loadJobs();
    } catch (err) {
        showError(errorEl, err.message);
    }
});

async function applyJob(id, btn) {
    btn.disabled = true;
    try {
        await apiFetch(`/jobs/${id}/apply`, { method: 'POST' });
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Applied';
    } catch (err) {
        btn.disabled = false;
        alert(err.message);
    }
}

async function deleteJob(id) {
    if (!confirm('Delete this job posting?')) return;
    try {
        await apiFetch(`/jobs/${id}`, { method: 'DELETE' });
        loadJobs();
    } catch (err) {
        alert(err.message);
    }
}

async function loadJobs() {
    const grid = document.getElementById('jobsGrid');
    grid.innerHTML = `<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading jobs...</div>`;
    try {
        const jobs = await apiFetch('/jobs');
        if (!jobs.length) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-regular fa-briefcase"></i><p>No jobs posted yet. Share the first opportunity!</p></div>`;
            return;
        }
        grid.innerHTML = jobs.map(job => {
            const isOwner = job.postedBy && job.postedBy._id === me._id;
            const alreadyApplied = job.applicants.includes(me._id);
            const expired = new Date(job.lastDate) < new Date();
            return `
            <div class="card job-card">
                <h3>${job.position}</h3>
                <div class="company">${job.company}</div>
                <div class="meta">
                    <span><i class="fa-solid fa-location-dot"></i> ${job.location || 'Remote'}</span>
                    ${job.salary ? `<span><i class="fa-solid fa-indian-rupee-sign"></i> ${job.salary}</span>` : ''}
                </div>
                <p style="color:var(--text-light);font-size:0.88rem;margin:8px 0;">${job.description.slice(0, 100)}${job.description.length > 100 ? '...' : ''}</p>
                <p style="font-size:0.8rem;color:${expired ? 'var(--danger)' : 'var(--text-light)'};margin-bottom:12px;">
                    <i class="fa-regular fa-clock"></i> Apply by ${new Date(job.lastDate).toLocaleDateString('en-IN')}
                </p>
                ${isOwner
                    ? `<button class="btn btn-danger btn-sm btn-block" onclick="deleteJob('${job._id}')"><i class="fa-solid fa-trash"></i> Delete Posting</button>`
                    : `<button class="btn btn-sm btn-block" ${(alreadyApplied || expired) ? 'disabled' : ''} onclick="applyJob('${job._id}', this)">
                        ${alreadyApplied ? '<i class="fa-solid fa-check"></i> Applied' : expired ? 'Applications Closed' : 'Apply Now'}
                       </button>`
                }
            </div>`;
        }).join('');
    } catch (err) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><p>${err.message}</p></div>`;
    }
}

loadJobs();

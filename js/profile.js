requireAuth();
renderSidebar('profile');
document.getElementById('pageTitle').textContent = 'My Profile';

const content = document.getElementById('pageContent');
content.innerHTML = `<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading profile...</div>`;

function photoTag(user) {
    if (user.profilePhoto) {
        return `<img src="http://localhost:5000${user.profilePhoto}" class="avatar" style="object-fit:cover;">`;
    }
    return `<div class="avatar">${initials(user.fullName)}</div>`;
}

async function load() {
    try {
        const user = await apiFetch('/profile');
        content.innerHTML = `
        <div class="card" style="max-width:720px;">
            <div style="display:flex;gap:22px;align-items:center;flex-wrap:wrap;">
                ${photoTag(user)}
                <div style="flex:1;min-width:200px;">
                    <h2 style="color:var(--primary);">${user.fullName}</h2>
                    <p style="color:var(--text-light);">${user.jobRole || 'Role not set'} ${user.currentCompany ? 'at ' + user.currentCompany : ''}</p>
                    <p style="color:var(--text-light);font-size:0.9rem;margin-top:4px;"><i class="fa-solid fa-envelope"></i> ${user.email}</p>
                </div>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <a href="editProfile.html" class="btn btn-sm"><i class="fa-solid fa-pen"></i> Edit Profile</a>
                    <label class="btn btn-outline btn-sm" style="cursor:pointer;">
                        <i class="fa-solid fa-camera"></i> Change Photo
                        <input type="file" id="photoInput" accept="image/*" style="display:none;">
                    </label>
                </div>
            </div>

            <hr style="margin:22px 0;border:none;border-top:1px solid var(--border);">

            <div class="grid grid-2">
                <p><strong>Department:</strong><br>${user.department || '—'}</p>
                <p><strong>Graduation Year:</strong><br>${user.graduationYear || '—'}</p>
                <p><strong>Location:</strong><br>${user.location || '—'}</p>
                <p><strong>Skills:</strong><br>${(user.skills && user.skills.length) ? user.skills.map(s => `<span class="badge">${s}</span>`).join('') : '—'}</p>
            </div>

            <div style="margin-top:18px;">
                <strong>Bio</strong>
                <p style="color:var(--text-light);margin-top:6px;">${user.bio || 'No bio added yet.'}</p>
            </div>

            <div style="margin-top:18px;display:flex;gap:16px;">
                ${user.linkedin ? `<a href="${user.linkedin}" target="_blank" class="btn btn-sm btn-outline"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
                ${user.github ? `<a href="${user.github}" target="_blank" class="btn btn-sm btn-outline"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
            </div>

            <div style="margin-top:30px;border-top:1px solid var(--border);padding-top:18px;">
                <button class="btn btn-danger btn-sm" id="deleteBtn"><i class="fa-solid fa-trash"></i> Delete My Account</button>
            </div>
        </div>
        `;

        document.getElementById('photoInput').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const fd = new FormData();
            fd.append('profilePhoto', file);
            try {
                await apiFetch('/profile/photo', { method: 'PUT', body: fd });
                load();
            } catch (err) {
                alert(err.message);
            }
        });

        document.getElementById('deleteBtn').addEventListener('click', async () => {
            if (!confirm('This will permanently delete your account. Are you sure?')) return;
            try {
                await apiFetch('/profile', { method: 'DELETE' });
                logout();
            } catch (err) {
                alert(err.message);
            }
        });
    } catch (err) {
        content.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
    }
}

load();

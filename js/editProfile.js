requireAuth();
renderSidebar('profile');
document.getElementById('pageTitle').textContent = 'Edit Profile';

const content = document.getElementById('pageContent');
content.innerHTML = `<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>`;

(async () => {
    try {
        const user = await apiFetch('/profile');

        content.innerHTML = `
        <div class="form-box wide" style="margin:0;">
            <h2>Edit your profile</h2>
            <p class="subtitle">Keep your information up to date</p>
            <div class="error-msg" id="errorMsg"></div>
            <div class="success-msg" id="successMsg"></div>

            <form id="editForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="fullName" value="${user.fullName || ''}">
                    </div>
                    <div class="form-group">
                        <label>Department</label>
                        <input type="text" id="department" value="${user.department || ''}" placeholder="e.g. Computer Science">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Graduation Year</label>
                        <input type="number" id="graduationYear" value="${user.graduationYear || ''}" placeholder="e.g. 2027">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" id="location" value="${user.location || ''}" placeholder="City, Country">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Current Company</label>
                        <input type="text" id="currentCompany" value="${user.currentCompany || ''}">
                    </div>
                    <div class="form-group">
                        <label>Job Role</label>
                        <input type="text" id="jobRole" value="${user.jobRole || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Skills (comma-separated)</label>
                    <input type="text" id="skills" value="${(user.skills || []).join(', ')}" placeholder="React, Node.js, MongoDB">
                </div>
                <div class="form-group">
                    <label>Bio</label>
                    <textarea id="bio" rows="4" placeholder="Tell us about yourself">${user.bio || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>LinkedIn URL</label>
                        <input type="text" id="linkedin" value="${user.linkedin || ''}" placeholder="https://linkedin.com/in/...">
                    </div>
                    <div class="form-group">
                        <label>GitHub URL</label>
                        <input type="text" id="github" value="${user.github || ''}" placeholder="https://github.com/...">
                    </div>
                </div>
                <div style="display:flex;gap:14px;">
                    <button type="submit" class="btn" id="submitBtn">Save Changes</button>
                    <a href="profile.html" class="btn btn-outline">Cancel</a>
                </div>
            </form>
        </div>
        `;

        const form = document.getElementById('editForm');
        const errorMsg = document.getElementById('errorMsg');
        const successMsg = document.getElementById('successMsg');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMsg(errorMsg); hideMsg(successMsg);
            submitBtn.disabled = true; submitBtn.textContent = 'Saving...';

            try {
                const skillsArr = document.getElementById('skills').value
                    .split(',').map(s => s.trim()).filter(Boolean);

                const updated = await apiFetch('/profile', {
                    method: 'PUT',
                    body: JSON.stringify({
                        fullName: document.getElementById('fullName').value,
                        department: document.getElementById('department').value,
                        graduationYear: document.getElementById('graduationYear').value || null,
                        location: document.getElementById('location').value,
                        currentCompany: document.getElementById('currentCompany').value,
                        jobRole: document.getElementById('jobRole').value,
                        skills: skillsArr,
                        bio: document.getElementById('bio').value,
                        linkedin: document.getElementById('linkedin').value,
                        github: document.getElementById('github').value,
                    }),
                });

                // keep localStorage name in sync for sidebar/topbar
                const currentUser = getUser();
                currentUser.fullName = updated.fullName;
                localStorage.setItem('user', JSON.stringify(currentUser));

                successMsg.textContent = 'Profile updated successfully!';
                successMsg.style.display = 'block';
                setTimeout(() => window.location.href = 'profile.html', 900);
            } catch (err) {
                showError(errorMsg, err.message);
                submitBtn.disabled = false; submitBtn.textContent = 'Save Changes';
            }
        });
    } catch (err) {
        content.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>${err.message}</p></div>`;
    }
})();

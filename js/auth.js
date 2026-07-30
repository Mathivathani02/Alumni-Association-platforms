// ===== Shared auth helpers =====

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
}

function saveSession(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Call at the top of any page that requires login
function requireAuth() {
    if (!getToken()) {
        window.location.href = 'login.html';
    }
}

// Call at the top of login/register pages to skip if already logged in
function redirectIfLoggedIn() {
    if (getToken()) {
        window.location.href = 'dashboard.html';
    }
}

// Generic authenticated fetch wrapper
async function apiFetch(endpoint, options = {}) {
    const headers = options.headers || {};
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    let data = null;
    try { data = await res.json(); } catch (e) { /* no body */ }

    if (!res.ok) {
        throw new Error((data && data.message) || 'Something went wrong');
    }
    return data;
}

function initials(name) {
    if (!name) return '?';
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

function showError(el, msg) {
    el.textContent = msg;
    el.style.display = 'block';
}

function hideMsg(el) {
    el.style.display = 'none';
}

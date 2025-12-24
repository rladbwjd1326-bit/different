/* auth_check.js - Handle User Session & UI */

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token && user.nickname) {
        updateUIForLogin(user);
    } else {
        updateUIForLogout();
    }
}

function updateUIForLogin(user) {
    const nickname = user.nickname;

    // 1. Desktop Top Nav Right
    const rightNav = document.querySelector('.top-nav-right');
    if (rightNav) {
        // Clear existing buttons
        rightNav.innerHTML = `
            <div class="user-profile-menu" style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <div class="profile-icon" style="width: 32px; height: 32px; background: #ddd; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #555;">
                    ${nickname.charAt(0).toUpperCase()}
                </div>
                <!-- <span class="user-name" style="font-weight: 600;">${nickname}</span> -->
                <button id="logoutBtn" style="font-size: 14px; color: #888;">Log Out</button>
            </div>
            <div class="top-search">
                 <input type="text" placeholder="Search Koreanize" class="search-input">
                 <button class="search-btn">
                     <img src="${getRelativePath()}images/search.svg" alt="Search" class="search-icon">
                 </button>
            </div>
        `;

        // Attach Logout Event
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
    }

    // 2. Mobile Menu
    const mobileLinks = document.querySelectorAll('.mobile-only-link');
    if (mobileLinks.length > 0) {
        // Hide Login/Signup
        mobileLinks.forEach(link => link.style.display = 'none');

        // Add Profile Info to Menu if not already present
        const menu = document.querySelector('.top-menu');
        if (menu && !document.getElementById('mobileProfile')) {
            const profileItem = document.createElement('div');
            profileItem.id = 'mobileProfile';
            profileItem.style.padding = '15px 0';
            profileItem.style.borderBottom = '1px solid #f0f0f0';
            profileItem.style.width = '100%';
            profileItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <div style="width: 40px; height: 40px; background: #eee; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">
                        ${nickname.charAt(0).toUpperCase()}
                    </div>
                    <span style="font-weight: 700; font-size: 18px;">${nickname}</span>
                </div>
                <button id="mobileLogoutBtn" style="color: #FF4444; font-weight: 600;">Log Out</button>
            `;
            // Insert at top
            menu.insertBefore(profileItem, menu.firstChild);

            const mLogout = document.getElementById('mobileLogoutBtn');
            if (mLogout) mLogout.addEventListener('click', logout);
        }
    }
}

function updateUIForLogout() {
    // Rely on default HTML structure for logged out state.
    // If we are dynamically injecting, we might need to restore it. 
    // Since pages reload mostly, default HTML is fine. 
    // If single page app behavior, we would need to restore.
    // For now, reload on logout ensures clean state.
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    alert('Logged out successfully.');
    window.location.href = getRelativePath() + 'index.html'; // Redirect to home
}

// Helper to handle "../" paths based on current location
function getRelativePath() {
    // Simple check: if we are in /html/, we need ../
    if (window.location.pathname.includes('/html/')) {
        return '../';
    }
    return '';
}

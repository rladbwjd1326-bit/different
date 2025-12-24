/* common.js - Shared Navigation Logic & Mobile Menu */

document.addEventListener('DOMContentLoaded', () => {
    initBottomNav();
    initMobileMenu();
});

function initBottomNav() {
    const bottomNav = document.getElementById('bottomNav');
    const topNav = document.querySelector('.top-nav');

    if (bottomNav) {
        const checkVisibility = () => {
            const innerHeight = window.innerHeight;
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollY = window.scrollY;

            // Logic:
            // 1. Mobile: Always Show (handled by CSS, but good to keep logic consistent or minimal)
            // But wait, CSS handles the 'override'. JS adds 'show' class.
            // If I rely on CSS !important for mobile, JS logic mainly affects Desktop.

            // 2. Desktop:
            // "Show when Top Nav disappears" -> Top Nav is at top, height ~80px.
            // So if scrollY > 80, show Bottom Nav.

            const navHeight = topNav ? topNav.offsetHeight : 80;
            const isTopNavHidden = scrollY > navHeight;

            const isShortPage = scrollHeight <= innerHeight + 150;
            const isNearBottom = (scrollY + innerHeight) >= (scrollHeight - 50);

            // Added: isTopNavHidden is the primary trigger for "Scroll down -> Nav appears"
            if (isTopNavHidden || isShortPage || isNearBottom) {
                bottomNav.classList.add('show');
            } else {
                bottomNav.classList.remove('show');
            }
        };

        window.addEventListener('scroll', checkVisibility, { passive: true });
        window.addEventListener('resize', checkVisibility);

        const observer = new MutationObserver(checkVisibility);
        observer.observe(document.body, { childList: true, subtree: true });

        checkVisibility();
        setTimeout(checkVisibility, 500);
    }
}

function initMobileMenu() {
    const header = document.querySelector('.top-nav');
    if (!header) return;

    // Create Hamburger Button
    if (!document.querySelector('.mobile-menu-btn')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-btn';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        toggleBtn.setAttribute('aria-label', 'Menu');
        header.appendChild(toggleBtn);

        // Toggle Logic
        toggleBtn.addEventListener('click', () => {
            header.classList.toggle('mobile-open');
            const icon = toggleBtn.querySelector('i');
            if (header.classList.contains('mobile-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && header.classList.contains('mobile-open')) {
                header.classList.remove('mobile-open');
                const icon = toggleBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Run Auth Check
    checkAuth();
}


// --- Auth Logic (Integrated) ---
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token && user.nickname) {
        updateUIForLogin(user);
    }
}

function updateUIForLogin(user) {
    const nickname = user.nickname;
    const email = user.email || '';

    // 1. Desktop Top Nav Right
    const rightNav = document.querySelector('.top-nav-right');
    if (rightNav) {
        const profileImgHtml = user.profileImage
            ? `<img src="${user.profileImage}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">`
            : nickname.charAt(0).toUpperCase();

        rightNav.innerHTML = `
            <div class="user-profile-menu" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <!-- Profile Image -->
                <div style="width: 32px; height: 32px; background: #2a2a2a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff; overflow:hidden; flex-shrink: 0;">
                    ${profileImgHtml}
                </div>
                <!-- Nickname -->
                <span class="user-nickname" style="font-weight: 700; font-size: 14px; color: #333;">${nickname}</span>
                
                <!-- Divider (optional) -->
                <span style="width: 1px; height: 12px; background: #ddd; margin: 0 4px;"></span>

                <!-- Logout Button -->
                <button id="logoutBtn" style="font-size: 14px; color: #cd4242; font-weight:600; white-space: nowrap;">Log Out</button>
            </div>
        `;
        document.getElementById('logoutBtn')?.addEventListener('click', logout);
    }


    // 2. Mobile Menu
    const mobileLinks = document.querySelectorAll('.mobile-only-link');
    mobileLinks.forEach(link => link.style.display = 'none');

    const topMenu = document.querySelector('.top-menu');
    if (topMenu && !document.getElementById('mobileProfile')) {
        const profileImgHtml = user.profileImage
            ? `<img src="${user.profileImage}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;">`
            : nickname.charAt(0).toUpperCase();

        const profileDiv = document.createElement('div');
        profileDiv.id = 'mobileProfile';
        profileDiv.style.cssText = 'width: 100%; padding: 10px 0; border-bottom: 1px solid #eee; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;';
        profileDiv.innerHTML = `
             <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; background: #2a2a2a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; overflow:hidden;">
                    ${profileImgHtml}
                </div>
                <span style="font-weight: 700;">${nickname}</span>
             </div>
             <button id="mobileLogoutBtn" style="color: #C1272D; font-weight: 600; font-size: 14px;">Log Out</button>
        `;
        topMenu.insertBefore(profileDiv, topMenu.firstChild);
        document.getElementById('mobileLogoutBtn')?.addEventListener('click', logout);
    }


    // 3. Update MyPage Specific UI
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = nickname;

        // Update Profile Image if exists
        const profileImg = document.getElementById('profileImg');
        if (profileImg && user.profileImage) {
            profileImg.src = user.profileImage;
            profileImg.style.opacity = '1';
        }
    }
}


function logout() {
    if (!confirm('Do you want to log out?')) {
        return;
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    alert('Logged out.');

    // Redirect to index
    const pathPrefix = window.location.pathname.includes('/html/') ? '../' : '';
    window.location.href = pathPrefix + 'index.html';
}



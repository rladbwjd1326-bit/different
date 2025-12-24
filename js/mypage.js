const ITEMS_PER_PAGE_MYPAGE = 5;

document.addEventListener('DOMContentLoaded', () => {
    initMyPage();
});

let mypageState = {
    allBookmarks: [],
    currentPage: 1
};

async function initMyPage() {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!localUser.id) {
        alert('Please log in.');
        window.location.href = 'login.html';
        return;
    }

    // 1. Fetch Latest User Data (for Points/Rank)
    try {
        const res = await fetch(`/api/user/${localUser.id}`);
        if (res.ok) {
            const freshUser = await res.json();
            // Update UI
            updateProfileUI(freshUser);
            // Sync with LocalStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            Object.assign(storedUser, {
                points: freshUser.points,
                profileImage: freshUser.profile_image,
                nickname: freshUser.nickname
            });
            localStorage.setItem('user', JSON.stringify(storedUser));
        }
    } catch (e) {
        console.error('Failed to sync user data', e);
    }

    // 2. Load Bookmarks
    loadMyBookmarks(localUser.id);

    // 3. Profile Image Upload Setup
    setupProfileUpload(localUser.id);

    // 4. Pagination Listeners
    setupPaginationListeners(localUser.id);

    // 5. Account Deletion
    setupAccountDeletion(localUser.id);
}

function updateProfileUI(user) {
    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.textContent = user.nickname;

    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
        const rank = getRankName(user.points || 0);
        let iconName = rank.toLowerCase();
        let filter = '';

        // Technical fallback using CSS filters for missing icons
        if (iconName === 'silver') {
            iconName = 'platinum';
            filter = 'grayscale(1) brightness(1.2)';
        } else if (iconName === 'emerald') {
            iconName = 'diamond';
            filter = 'hue-rotate(70deg) saturate(1.5)';
        } else if (iconName === 'master') {
            iconName = 'diamond';
            filter = 'hue-rotate(240deg) saturate(1.2) brightness(0.8)';
        }

        const iconPath = `../images/ranks/${iconName}.png`;

        profileInfo.innerHTML = `
            <h2 id="userName">${user.nickname}</h2>
            <div class="rank-container" style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                <img src="${iconPath}" alt="${rank}" class="rank-icon" style="width: 32px; height: 32px; object-fit: contain; filter: ${filter};">
                <div class="profile-rank" style="margin-top: 0;">${rank}</div>
            </div>
            <div class="profile-points">${user.points || 0} LP</div>
        `;
    }

    const profileImg = document.getElementById('profileImg');
    if (profileImg && user.profile_image) {
        profileImg.src = user.profile_image;
        profileImg.style.opacity = '1';
    }
}



function getRankName(pts) {
    if (pts >= 150) return 'Grandmaster';
    if (pts >= 125) return 'Master';
    if (pts >= 100) return 'Diamond';
    if (pts >= 50) return 'Emerald';
    if (pts >= 40) return 'Platinum';
    if (pts >= 30) return 'Silver';
    if (pts >= 20) return 'Silver'; // User requested 10,20,30,40,50...
    if (pts >= 10) return 'Bronze';
    return 'Iron';
}


async function loadMyBookmarks(userId) {
    const bookmarkCountLabel = document.getElementById('bookmarkCount');

    try {
        const response = await fetch(`/api/bookmarks/details?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch bookmarks');

        const spots = await response.json();
        mypageState.allBookmarks = spots;
        if (bookmarkCountLabel) bookmarkCountLabel.textContent = spots.length;

        renderPaginatedBookmarks();

    } catch (error) {
        console.error('Error loading bookmarks:', error);
    }
}

function renderPaginatedBookmarks() {
    const bookmarkList = document.getElementById('bookmarkList');
    const pagination = document.getElementById('bookmarkPagination');
    const indicator = document.getElementById('bookmarkPageIndicator');
    const prevBtn = document.getElementById('prevBookmarkBtn');
    const nextBtn = document.getElementById('nextBookmarkBtn');

    if (!bookmarkList) return;

    if (mypageState.allBookmarks.length === 0) {
        bookmarkList.innerHTML = '<div class="empty-msg">No bookmarks yet.</div>';
        if (pagination) pagination.style.display = 'none';
        return;
    }

    const totalPages = Math.ceil(mypageState.allBookmarks.length / ITEMS_PER_PAGE_MYPAGE);
    if (mypageState.currentPage > totalPages) mypageState.currentPage = totalPages;
    if (mypageState.currentPage < 1) mypageState.currentPage = 1;

    // slice data
    const start = (mypageState.currentPage - 1) * ITEMS_PER_PAGE_MYPAGE;
    const end = start + ITEMS_PER_PAGE_MYPAGE;
    const pageItems = mypageState.allBookmarks.slice(start, end);

    bookmarkList.innerHTML = pageItems.map(spot => {
        let imageSrc = spot.image;
        if (imageSrc) {
            imageSrc = imageSrc.replace(/\\/g, '/');
            const searchStr = 'images/travel/';
            const index = imageSrc.indexOf(searchStr);
            if (index !== -1) {
                imageSrc = '../' + imageSrc.substring(index);
            }
        } else {
            imageSrc = '../images/placeholder.png';
        }

        return `
            <div class="bookmark-item" data-id="${spot.id}">
                <img src="${imageSrc}" alt="${spot.name}" class="bookmark-img" onerror="this.src='../images/placeholder.png';">
                <div class="bookmark-content">
                    <h4>${spot.name}</h4>
                    <span>${spot.address || ''}</span>
                </div>
            </div>
        `;
    }).join('');

    // Update Pagination UI
    if (pagination) pagination.style.display = totalPages > 1 ? 'flex' : 'none';
    if (indicator) indicator.textContent = `${mypageState.currentPage} / ${totalPages}`;
    if (prevBtn) prevBtn.disabled = mypageState.currentPage === 1;
    if (nextBtn) nextBtn.disabled = mypageState.currentPage === totalPages;

    // Events
    bookmarkList.querySelectorAll('.bookmark-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            window.location.href = `local.html?id=${id}`;
        });
    });
}

function setupPaginationListeners(userId) {
    const prevBtn = document.getElementById('prevBookmarkBtn');
    const nextBtn = document.getElementById('nextBookmarkBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (mypageState.currentPage > 1) {
                mypageState.currentPage--;
                renderPaginatedBookmarks();
                window.scrollTo({ top: document.getElementById('bookmarkList').offsetTop - 100, behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(mypageState.allBookmarks.length / ITEMS_PER_PAGE_MYPAGE);
            if (mypageState.currentPage < totalPages) {
                mypageState.currentPage++;
                renderPaginatedBookmarks();
                window.scrollTo({ top: document.getElementById('bookmarkList').offsetTop - 100, behavior: 'smooth' });
            }
        });
    }
}


function setupProfileUpload(userId) {
    const editBtn = document.getElementById('editProfileBtn');
    const profileInput = document.getElementById('profileInput');
    const profileImg = document.getElementById('profileImg');

    if (!editBtn || !profileInput) return;

    editBtn.addEventListener('click', () => {
        profileInput.click();
    });

    profileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);
        formData.append('userId', userId);

        try {
            const response = await fetch('/api/user/profile-image', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                // Update Image in UI
                profileImg.src = result.profileImage;
                profileImg.style.opacity = '1';

                // Update LocalStorage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.profileImage = result.profileImage;
                localStorage.setItem('user', JSON.stringify(user));

                // Update Header
                if (typeof updateUIForLogin === 'function') {
                    updateUIForLogin(user);
                }

                alert('Profile image updated!');
            } else {
                alert('Upload failed: ' + result.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading file.');
        }
    });
}

function setupAccountDeletion(userId) {
    const deleteBtn = document.getElementById('deleteAccountBtn');
    if (!deleteBtn) return;

    deleteBtn.addEventListener('click', async () => {
        const confirmed = confirm("정말로 탈퇴하시겠습니까?\n모든 정보와 북마크가 삭제되며, 이 작업은 되돌릴 수 없습니다.");
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/user/${userId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (result.success) {
                alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
                // Clear state and logout
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '../index.html';
            } else {
                alert('탈퇴 처리 중 오류가 발생했습니다: ' + (result.error || '알 수 없는 오류'));
            }
        } catch (error) {
            console.error('Account deletion error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        }
    });
}

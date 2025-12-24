/* local.js - Travel Spots Logic with Mock Data Fallback */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const API_BASE_URL = '/api/places';
    const ITEMS_PER_PAGE = 12; // Grid 3x3

    const REGION_TAGS = [
        '서울', '부산', '제주', '경기', '강원', '경상', '광주',
        '대구', '대전', '울산', '인천', '전라', '충청', '세종'
    ];

    const CATEGORIES = [
        { value: '', label: 'all' },
        { value: '1', label: 'food' },
        { value: '2', label: 'Cafe' },
        { value: '3', label: 'Landmark' },
        { value: '4', label: 'Nature' },
        { value: '5', label: 'Shopping' },
        { value: '6', label: 'Entertainment' },
        { value: '7', label: 'Activity' },
    ];

    // --- State ---
    let state = {
        travelSpots: [],
        currentPage: 1,
        totalCount: 0,
        activeTags: [], // Single selection primarily
        searchTerm: '',
        selectedCategory: '',
        bookmarkedIds: [],
        recentSpots: [],
        isLoading: false
    };

    // --- DOM Elements ---
    const els = {
        listContainer: document.getElementById('localTripList'),
        paginationControls: document.getElementById('localPaginationControls'),
        prevBtn: document.getElementById('prevPageBtn'),
        nextBtn: document.getElementById('nextPageBtn'),
        pageIndicator: document.getElementById('pageIndicator'),
        searchInput: document.getElementById('localContentSearchInput'),
        searchBtn: document.getElementById('localContentSearchBtn'),
        categorySelect: document.getElementById('localCategoryDropdown'),
        tagFilters: document.getElementById('localTagFilters'),
        loading: document.getElementById('localLoading'),
        error: document.getElementById('localError'),
        recentList: document.getElementById('recentSpotsList'),
        modal: document.getElementById('localModal'),
        modalClose: document.getElementById('localModalClose'),
        modalImg: document.getElementById('localModalImg'),
        modalTitle: document.getElementById('localModalTitle'),
        modalAddress: document.getElementById('localModalAddress'),
        modalDesc: document.getElementById('localModalDesc'),
        modalTags: document.getElementById('localModalTags'),
        modalLinkBtn: document.getElementById('localModalLinkBtn')
    };

    // --- Initialization ---
    init();

    async function init() {
        populateCategories();
        loadLocalStorage();
        renderTags();
        await loadBookmarksFromServer();
        await fetchTravelSpots(1);
        renderRecentSpots();
        setupEventListeners();

        const urlParams = new URLSearchParams(window.location.search);
        const spotId = urlParams.get('id');
        if (spotId) {
            handleAutoOpen(spotId);
        }
    }

    async function handleAutoOpen(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            if (response.ok) {
                const spot = await response.json();
                openModal(spot);
            }
        } catch (error) {
            console.error('Auto-open failed:', error);
        }
    }

    function populateCategories() {
        if (!els.categorySelect) return;
        els.categorySelect.innerHTML = CATEGORIES.map(cat =>
            `<option value="${cat.value}">${cat.label}</option>`
        ).join('');
    }

    function loadLocalStorage() {
        try {
            state.bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedSpots')) || [];
            state.recentSpots = JSON.parse(localStorage.getItem('recentSpots')) || [];
        } catch (e) {
            console.error('Local storage parse error', e);
        }
    }

    function setupEventListeners() {
        if (els.searchBtn) els.searchBtn.addEventListener('click', handleSearch);
        if (els.searchInput) els.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSearch();
        });

        if (els.categorySelect) els.categorySelect.addEventListener('change', (e) => {
            state.selectedCategory = e.target.value;
            fetchTravelSpots(1);
        });

        if (els.prevBtn) els.prevBtn.addEventListener('click', () => {
            if (state.currentPage > 1) fetchTravelSpots(state.currentPage - 1);
        });
        if (els.nextBtn) els.nextBtn.addEventListener('click', () => {
            const maxPage = Math.ceil(state.totalCount / ITEMS_PER_PAGE);
            if (state.currentPage < maxPage) fetchTravelSpots(state.currentPage + 1);
        });

        if (els.modalClose) els.modalClose.addEventListener('click', closeModal);
        if (els.modal) els.modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('local-modal-overlay')) closeModal();
        });

        // [수정사항] 네이버 검색 연결 로직 (지역+상호명)
        if (els.modalLinkBtn) {
            els.modalLinkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const name = els.modalTitle.textContent;
                const fullAddress = els.modalAddress.textContent;

                if (!name || !fullAddress || fullAddress === '주소 정보 없음') {
                    alert('정보가 부족하여 검색 페이지로 이동할 수 없습니다.');
                    return;
                }

                // 주소의 앞 두 단어 추출 (시/도 + 시/군/구)
                const addressMatch = fullAddress.match(/^([^\s]+\s+[^\s]+)/);
                const region = addressMatch ? addressMatch[0] : "";
                const searchQuery = `${region} ${name}`.trim();
                const naverSearchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(searchQuery)}`;
                
                window.open(naverSearchUrl, '_blank');
            });
        }
    }

    // --- Fetch Logic ---
    async function fetchTravelSpots(page) {
        state.isLoading = true;
        state.currentPage = page;
        renderLoading(true);

        try {
            const queryParams = new URLSearchParams({
                page: page,
                limit: ITEMS_PER_PAGE
            });

            if (state.searchTerm) queryParams.append('search', state.searchTerm);
            if (state.selectedCategory) queryParams.append('category', state.selectedCategory);
            
            // ★ 지역 태그 검색 시 주소 기반 필터링 파라미터 전송
            if (state.activeTags.length > 0) {
                queryParams.append('region', state.activeTags[0]);
                queryParams.append('tag', state.activeTags[0]);
            }

            const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
            if (!response.ok) throw new Error(`API Connection Failed`);

            const data = await response.json();
            state.travelSpots = data.spots || [];
            state.totalCount = data.total || 0;

            renderList();
            updatePagination();

        } catch (err) {
            console.warn("Backend API unavailable.", err);
            // Fallback 로직 필요시 여기에 구현
        } finally {
            state.isLoading = false;
            renderLoading(false);
            window.scrollTo(0, 0);
        }
    }

    function handleSearch() {
        state.searchTerm = els.searchInput.value.trim();
        fetchTravelSpots(1);
    }

    // --- Rendering ---
    function renderLoading(isLoading) {
        if (els.loading) els.loading.style.display = isLoading ? 'block' : 'none';
        if (els.listContainer) els.listContainer.style.display = isLoading ? 'none' : 'grid';
    }

    // [수정사항] 지역 태그 생성 및 분류 로직 (주소 첫 단어 기준)
    function renderTags() {
        if (!els.tagFilters) return;

        let html = `<button class="local-tag-button ${state.activeTags.length === 0 ? 'active' : ''}" data-tag="">ALL</button>`;
        REGION_TAGS.forEach(tag => {
            const isActive = state.activeTags.includes(tag);
            html += `<button class="local-tag-button ${isActive ? 'active' : ''}" data-tag="${tag}">#${tag}</button>`;
        });
        els.tagFilters.innerHTML = html;

        els.tagFilters.querySelectorAll('.local-tag-button').forEach(btn => {
            btn.addEventListener('click', () => {
                const tag = btn.dataset.tag;
                if (tag === '') {
                    state.activeTags = [];
                } else {
                    state.activeTags = state.activeTags.includes(tag) ? [] : [tag];
                }
                renderTags();
                fetchTravelSpots(1);
            });
        });
    }

    function renderList() {
        if (!els.listContainer) return;

        // 1. [데이터 필터링 추가] 
        // 서버에서 가져온 데이터 중, 현재 선택된 지역 태그와 주소 앞부분이 일치하는 것만 필터링합니다.
        const filteredSpots = state.travelSpots.filter(spot => {
            // 선택된 태그가 없으면(ALL) 모든 데이터를 보여줍니다.
            if (state.activeTags.length === 0) return true;

            const selectedRegion = state.activeTags[0]; // 사용자가 클릭한 태그 (예: '부산')
            const firstWord = spot.address ? spot.address.split(' ')[0] : ''; // 주소의 첫 단어 (예: '부산광역시')

            // 주소 첫 단어에 선택한 태그가 포함되어 있는지 확인 ('부산광역시'에 '부산'이 있는지)
            return firstWord.includes(selectedRegion);
        });

        // 2. 필터링된 결과가 없을 경우 처리
        if (filteredSpots.length === 0) {
            els.listContainer.innerHTML = '<p class="no-results">결과가 없습니다.</p>';
            return;
        }

        // 3. state.travelSpots 대신 filteredSpots를 사용하여 화면을 그립니다.
        els.listContainer.innerHTML = filteredSpots.map(spot => {
            const imageSrc = getWebImagePath(spot.image);
            const isBookmarked = state.bookmarkedIds.includes(Number(spot.id));
            
            // 주소 첫 단어를 기준으로 태그 추출
            const firstWord = spot.address ? spot.address.split(' ')[0] : '';
            const displayTag = REGION_TAGS.find(t => firstWord.includes(t)) || '';

            return `
                <div class="local-trip-card" data-id="${spot.id}">
                    <button class="local-bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${spot.id}">
                        <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                    <div class="local-card-image">
                        <img src="${imageSrc}" alt="${spot.name}" loading="lazy" 
                            onerror="this.src='../images/placeholder.png';">
                    </div>
                    <div class="local-card-content">
                        <div class="local-card-tag-row">
                            ${displayTag ? `<span class="card-region-tag">#${displayTag}</span>` : ''}
                        </div>
                        <h3 class="local-card-title">${spot.name}</h3>
                        <p class="local-card-address">${spot.address || ''}</p>
                    </div>
                </div>
            `;
        }).join('');

        attachCardEvents();
    

        function attachCardEvents() {
            els.listContainer.querySelectorAll('.local-trip-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.local-bookmark-btn')) return;
                    const id = card.dataset.id;
                    const spot = state.travelSpots.find(s => String(s.id) === String(id));
                    if (spot) {
                        openModal(spot);
                        saveRecentSpot(spot);
                    }
                });
            });

            els.listContainer.querySelectorAll('.local-bookmark-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    toggleBookmark(id);
                });
            });
        }
    }

    function getWebImagePath(dbPath) {
        if (!dbPath) return '../images/placeholder.png';
        let path = dbPath.replace(/\\/g, '/');
        const searchStr = 'images/travel/';
        const index = path.indexOf(searchStr);
        return index !== -1 ? '../' + path.substring(index) : path;
    }

    function updatePagination() {
        if (!els.pageIndicator) return;
        const maxPage = Math.max(1, Math.ceil(state.totalCount / ITEMS_PER_PAGE));
        els.pageIndicator.textContent = `${state.currentPage} / ${maxPage} 페이지`;
        if (els.prevBtn) els.prevBtn.disabled = state.currentPage <= 1;
        if (els.nextBtn) els.nextBtn.disabled = state.currentPage >= maxPage;
    }

    function getSafeTagsArray(tagsData) {
        if (!tagsData) return [];
        if (Array.isArray(tagsData)) return tagsData;
        if (typeof tagsData === 'string') {
            try {
                const parsed = JSON.parse(tagsData);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                return tagsData.split(',').map(tag => tag.trim()).filter(t => t.length > 0);
            }
        }
        return [];
    }

    // --- Modal Logic ---
    function openModal(spot) {
        if (!spot) return;
        const webImage = getWebImagePath(spot.image);

        if (els.modalImg) {
            els.modalImg.src = webImage;
            els.modalImg.alt = spot.name;
            els.modalImg.onerror = () => { els.modalImg.src = '../images/placeholder.png'; };
        }

        if (els.modalTitle) els.modalTitle.textContent = spot.name;
        if (els.modalAddress) els.modalAddress.textContent = spot.address || '주소 정보 없음';
        if (els.modalDesc) {
            els.modalDesc.textContent = spot.content || '상세 설명이 없습니다.';
        }

        const tags = getSafeTagsArray(spot.tags);
        if (els.modalTags) els.modalTags.innerHTML = tags.map(tag => `<span class="local-modal-tag">#${tag}</span>`).join('');

        document.body.classList.add('local-modal-open-no-scroll');
        els.modal.classList.add('visible');
    }

    function closeModal() {
        if (!els.modal) return;
        els.modal.classList.remove('visible');
        document.body.classList.remove('local-modal-open-no-scroll');
    }

    async function loadBookmarksFromServer() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;
        if (!userId) return;

        try {
            const response = await fetch(`/api/bookmarks?userId=${userId}`);
            if (response.ok) {
                state.bookmarkedIds = await response.json();
                renderList();
            }
        } catch (error) {
            console.error('북마크 로드 실패:', error);
        }
    }

    async function toggleBookmark(placeId) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;

        if (!userId) {
            alert('Please log in to use bookmarks.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch(`/api/bookmarks/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, placeId: Number(placeId) })
            });

            const result = await response.json();
            if (result.success) {
                if (result.isBookmarked) {
                    if (!state.bookmarkedIds.includes(Number(placeId))) state.bookmarkedIds.push(Number(placeId));
                } else {
                    state.bookmarkedIds = state.bookmarkedIds.filter(id => id !== Number(placeId));
                }
                renderList();
            }
        } catch (error) {
            console.error('북마크 에러:', error);
        }
    }

    function saveRecentSpot(spot) {
        let list = [...state.recentSpots];
        list = list.filter(item => String(item.id) !== String(spot.id));
        list.unshift({
            id: spot.id,
            name: spot.name,
            image: getWebImagePath(spot.image)
        });
        if (list.length > 4) list = list.slice(0, 4);
        state.recentSpots = list;
        localStorage.setItem('recentSpots', JSON.stringify(list));
        renderRecentSpots();
    }

    function renderRecentSpots() {
        if (!els.recentList) return;
        if (state.recentSpots.length === 0) {
            els.recentList.innerHTML = '<p style="font-size:0.8em; color:#777; text-align:center;">최근 본 장소가 없습니다.</p>';
            return;
        }

        els.recentList.innerHTML = state.recentSpots.map(spot => `
            <div class="local-recent-item" data-id="${spot.id}">
                <img src="${spot.image}" alt="${spot.name}" onerror="this.src='../images/placeholder.png'">
                <div class="local-recent-text"><h4>${spot.name}</h4></div>
            </div>
        `).join('');

        els.recentList.querySelectorAll('.local-recent-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                fetch(`${API_BASE_URL}/${id}`).then(res => res.json()).then(data => openModal(data));
            });
        });
    }

    // --- Top Search Sync ---
    const topSearchInput = document.getElementById('topSearchInput');
    const topSearchBtn = document.getElementById('topSearchBtn');

    if (topSearchInput && topSearchBtn) {
        const doTopSearch = () => {
            const term = topSearchInput.value.trim();
            if (term) {
                state.searchTerm = term;
                if (els.searchInput) els.searchInput.value = term;
                fetchTravelSpots(1);
            }
        };
        topSearchBtn.addEventListener('click', doTopSearch);
        topSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doTopSearch(); });
    }
});
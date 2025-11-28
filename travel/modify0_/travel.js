// 1. 여행지 데이터 (실제 데이터는 더 상세하게 채울 수 있습니다.)
const travelSpots = [
    {
        id: 1,
        name: "홍대 코인 노래방 투어",
        location: "서울 홍대/신촌",
        description: "친구들과 1000원으로 K-POP 최신곡을 신나게 부르는 한국식 유흥 문화!",
        tags: ["아이돌편테마", "쇼핑테마", "로컬바이브", "음악", "저예산", "노래방"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDAyMTVfMjcy%2FMDAxNzA4MDA2NTY1NTc0.7npQWKCVlbBBk28smuOobUG6FBXURNjHD_0P5bk7htEg.-wrb7AP5sB4NglqjNdTOLm0e7-GYHvD0Fg2taDSZcy4g.PNG.v1gm7fi6%2F1.png&type=sc960_832",
    },
    {
        id: 2,
        name: "뜨끈한 돼지국밥 & 깍두기",
        location: "부산 서면",
        description: "한국인들의 소울푸드. 든든한 국물과 고기로 해장과 식사를 동시에! 김치와 깍두기 필수.",
        tags: ["식도락여행테마", "로컬바이브", "국밥", "부산", "맛집"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA5MjRfMTky%2FMDAxNzU4NjkxMTkzNTI5.y_HI27jm_hE0gzcKyzyaW0mKrU0fW3J2wkO9vJsKFqgg.uT36qqyQJKRjOnmpPc_kPEXrmcMekC_AXokVh5tzi9kg.JPEG%2FP20250912_113050947_FA60B7A6-4AE0-457E-9BF5-8FCECA1756EB.JPG&type=a340",
    },
    {
        id: 3,
        name: "강남 방탈출 카페 - K-POP 아이돌 콘셉트",
        location: "서울 강남역",
        description: "머리를 써서 제한 시간 내에 방을 탈출하는 미션 게임. 친구들과 팀워크를 즐겨보세요.",
        tags: ["아이돌편테마", "로컬바이브", "실내놀이", "테마카페"],
        image: "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fi.namu.wiki%2Fi%2Fz7daGwnyG4XZTW0ZtbTHwQUwR8vmFwqh3CEfk8lg32xdlwjJ37daboKgEdorUiKndajVRqLfTFFsEQC5qfyiOA.webp&type=sc960_832",
    },
    {
        id: 4,
        name: "힙스터 감성 '말차' 전문 카페",
        location: "서울 성수동",
        description: "트렌디한 인테리어와 고급 말차 디저트, 음료를 즐기는 카페투어의 정점.",
        tags: ["커피투어테마", "말차테마", "식도락여행테마", "카페"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTA4MDRfMjI3%2FMDAxNzU0MjgwMjM4NjUx.1s8si4VOVbc6t4C3dPm_RDuemuQaB1G_WubgxBIfdlIg.cktx0fhcIi0G316koUO6PXyMopKEv4FWZRQwO_bX5H0g.JPEG%2FSnapshot_21.JPG&type=a340",
    },
    {
        id: 5,
        name: "가로수길 로드샵 & 디자이너 브랜드 쇼핑",
        location: "서울 가로수길",
        description: "한국 신진 디자이너 브랜드와 트렌디한 패션 아이템을 구매하기 좋은 곳.",
        tags: ["쇼핑테마", "패션", "강남", "로컬바이브"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA1MjdfMjIz%2FMDAxNjg1MTcwNjUzNDI1.zBKkS2Bqg_Ljxc1MQa2AMMKueq9tEJgOOajyPHKL7ZYg.M38TVO88hekWxy5LXaK3ZjAXvPPXd2KSR2wTwHFrD_8g.JPEG.eastlight0301%2FIMG_7924.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjEyMDhfNjUg%2FMDAxNjcwNDU5NTQ2MjEz.fOn1sI8BFiwRAGz379aZI0ciGAzPFZkNnSYY3VfRWl0g.MoBD_RnKGy0IMOsGmhWevickFPCNY91L2uHc-kZiw_4g.JPEG.minjoo901010%2F1670459541734.jpg&type=a340",
    },

];

// 2. DOM 요소 선택
const tripListEl = document.getElementById('tripList');
const searchInputEl = document.getElementById('searchInput');
const tagFiltersEl = document.getElementById('tagFilters');
const searchButtonEl = document.getElementById('searchButton');
const modalEl = document.getElementById('detailsModal');
const modalContentEl = document.getElementById('modalContent');
const modalCloseBtn = document.querySelector('.modal-close'); // X 버튼
const recentlyViewedEl = document.getElementById('recentlyViewed');

let activeTags = [];

// 로컬 스토리지에서 북마크 ID 목록을 로드하거나 새 배열을 만듭니다.
let bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedSpots')) || [];



// 3. 여행지 카드 생성 함수
function createTripCard(spot) {
    const card = document.createElement('div');
    card.className = 'trip-card';

    // 현재 장소가 북마크 되었는지 확인
    const isBookmarked = bookmarkedIds.includes(spot.id);
    const btnClass = isBookmarked ? 'active' : '';
    const iconClass = 'fas fa-bookmark';



    // 카드 내부 HTML 구성
    const tagsHtml = spot.tags.map(tag => `<span>#${tag}</span>`).join('');

    card.innerHTML = `
        <div class="card-image">
            <img src="${spot.image}" alt="${spot.name}">  </div>


        <button class="bookmark-btn ${btnClass}" data-id="${spot.id}">
            <i class="${iconClass}"></i>
        </button>

        <div class="card-content">
            <h3>${spot.name}</h3>
            <p>📍 ${spot.location}</p>
            <p>${spot.description}</p>
            <div class="card-tags">${tagsHtml}</div>
        </div>
    `;

    // ⭐️ 카드 자체에 클릭 이벤트 추가 (팝업을 띄우는 역할)
    card.addEventListener('click', () => {

        showModal(spot); // 장소 상세정보 모달

        saveRecentSpot(spot); // 최근 본 장소 저장        
    });


    const bookmarkButton = card.querySelector('.bookmark-btn');
    bookmarkButton.addEventListener('click', (event) => {
        // 이벤트 버블링 방지 (나중에 카드를 클릭했을 때 다른 이벤트가 발생하는 것을 방지)
        event.stopPropagation();
        toggleBookmark(spot.id, bookmarkButton);
    });

    return card;
}

// 4. 여행지 목록 렌더링 함수
function renderTripList(spots) {
    tripListEl.innerHTML = ''; // 기존 목록 초기화

    if (spots.length === 0) {
        tripListEl.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 50px;">검색 결과가 없습니다. 다른 키워드나 태그를 선택해주세요.</p>';
        return;
    }

    spots.forEach(spot => {
        tripListEl.appendChild(createTripCard(spot));
    });
}

// 북마크 상태를 토글하고 로컬 스토리지에 저장하는 함수
function toggleBookmark(spotId, buttonEl) {
    const id = parseInt(spotId);
    const index = bookmarkedIds.indexOf(id);

    if (index > -1) {
        // 이미 북마크 되어 있으면 -> 제거
        bookmarkedIds.splice(index, 1);
        buttonEl.classList.remove('active');
        // buttonEl.querySelector('i').className = 'far fa-bookmark'; // 빈 별

    } else {
        // 북마크 되어 있지 않으면 -> 추가
        bookmarkedIds.push(id);
        buttonEl.classList.add('active');
        // buttonEl.querySelector('i').className = 'fas fa-bookmark'; // 채워진 별
    }

    // 로컬 스토리지 업데이트
    localStorage.setItem('bookmarkedSpots', JSON.stringify(bookmarkedIds));
}



// 5. 검색 및 필터링 로직
function filterSpots() {
    const searchTerm = searchInputEl.value.toLowerCase().trim();

    const filtered = travelSpots.filter(spot => {
        // 1) 검색어 필터링
        const searchMatch = !searchTerm ||
            spot.name.toLowerCase().includes(searchTerm) ||
            spot.location.toLowerCase().includes(searchTerm) ||
            spot.description.toLowerCase().includes(searchTerm);

        // 2) 태그 필터링
        const tagMatch = activeTags.length === 0 || activeTags.every(tag => spot.tags.includes(tag));

        return searchMatch && tagMatch;
    });

    renderTripList(filtered);
}

// 6. 태그 버튼 생성 및 이벤트 리스너 설정
function setupTagFilters() {
    // 모든 유니크한 태그 추출
    const allTags = new Set();
    travelSpots.forEach(spot => {
        spot.tags.forEach(tag => allTags.add(tag));
    });

    // 주요 테마 태그를 먼저 보여주기 위해 순서 지정
    const orderedTags = ["아이돌편테마", "식도락여행테마", "커피투어테마", "말차테마", "쇼핑테마"];
    const otherTags = Array.from(allTags).filter(tag => !orderedTags.includes(tag));
    const finalTags = orderedTags.concat(otherTags.sort()); // 나머지 태그는 알파벳 순 정렬

    // '전체 보기' 버튼 추가
    const allButton = document.createElement('button');
    allButton.textContent = 'ALL';
    allButton.className = 'tag-button active';
    allButton.dataset.tag = '';
    allButton.addEventListener('click', handleTagClick);
    tagFiltersEl.appendChild(allButton);


    finalTags.forEach(tag => {
        const button = document.createElement('button');
        button.textContent = `#${tag}`;
        button.className = 'tag-button';
        button.dataset.tag = tag;
        button.addEventListener('click', handleTagClick);
        tagFiltersEl.appendChild(button);
    });
}

function handleTagClick(event) {
    const clickedButton = event.target;
    
    if (!clickedButton.classList.contains('tag-button')) {
        clickedButton = clickedButton.closest('.tag-button');
    }

    if (!clickedButton) return; // 버튼을 찾지 못했으면 함수 중단

    const tag = clickedButton.dataset.tag; // ''는 ALL 태그를 의미 
    const allButton = document.querySelector('.tag-filters button[data-tag=""]'); // 'ALL' 버튼 요소 
    if (tag === '') { // 1. 'ALL' 버튼 클릭 처리: 단독 선택 // 이미 'ALL'만 활성화된 상태라면 무시 
        if (activeTags.length === 0 && clickedButton.classList.contains('active')) { return; } activeTags = []; // 모든 활성 태그 초기화 // 모든 태그 버튼에서 active 클래스 제거 
        document.querySelectorAll('.tag-button').forEach(btn => { btn.classList.remove('active'); }); // 'ALL' 버튼에만 active 클래스 추가 
        allButton.classList.add('active');
    } else { // 2. 일반 태그 버튼 클릭 처리: 중복 선택 토글 // 만약 'ALL'이 활성화되어 있었다면, 'ALL'을 비활성화 
        if (activeTags.length === 0 && allButton.classList.contains('active')) { allButton.classList.remove('active'); } // 현재 클릭한 태그의 상태 토글 
        const index = activeTags.indexOf(tag); if (index > -1) { // 이미 활성화된 태그를 다시 클릭 -> 제거 
            activeTags.splice(index, 1); clickedButton.classList.remove('active');
        } else { // 비활성화된 태그를 클릭 -> 추가 
            activeTags.push(tag); clickedButton.classList.add('active');
        } // 모든 태그가 비활성화되면 'ALL'을 자동 활성화 
        if (activeTags.length === 0) { allButton.classList.add('active'); }
    } filterSpots(); // 필터링 실행 
}


// 7. 이벤트 리스너 등록 및 초기 실행
window.onload = () => {


    searchButtonEl.addEventListener('click', filterSpots);

    // 사용자가 검색 입력 필드에서 Enter 키를 눌렀을 때도 검색 실행
    searchInputEl.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            // Enter 키가 눌렸을 때, 버튼 클릭 이벤트를 강제로 발생시키는 것도 좋습니다.
            // 하지만 filterSpots()를 직접 호출해도 동일하게 작동합니다.
            filterSpots();
            // Enter 키를 눌러도 폼 제출 등의 기본 동작을 방지
            event.preventDefault();
        }
    });

    // 태그 필터 초기화
    setupTagFilters();

    //  모달 닫기 이벤트 리스너 등록
    modalCloseBtn.addEventListener('click', hideModal);

    //  모달 바깥 영역 클릭 시 닫기
    modalEl.addEventListener('click', (event) => {
        // 이벤트 타겟이 모달 배경(modalEl)일 때만 닫기
        if (event.target === modalEl) {
            hideModal();
        }
    });



    // 초기 목록 렌더링 (모든 여행지 표시)
    renderTripList(travelSpots);

    // 페이지 로드 시 최근 본 장소 위젯도 렌더링
    renderRecentlyViewed();
};

// 8. 모달 표시 함수 (새로 추가)
function showModal(spot) {
    // 태그를 HTML로 변환
    const tagsHtml = spot.tags.map(tag => `<span class="modal-tag">#${tag}</span>`).join('');

    // 모달 내용 구성
    modalContentEl.innerHTML = `
        <div class="modal-image-wrapper">
            <img src="${spot.image}" alt="${spot.name}">
        </div>
        <div class="modal-text-content">
            <h2>${spot.name}</h2>
            <p class="modal-location">📍 ${spot.location}</p>
            <hr>
            <p class="modal-description">${spot.description}</p>
            <div class="modal-tags-container">${tagsHtml}</div>
            
            <a href="#" class="modal-link-btn" onclick="alert('상품 상세 페이지로 이동합니다.'); return false;">
                상세 정보 페이지로 이동 (링크 미연결)
            </a>
        </div>
    `;

    // 모달 보이게 설정
    modalEl.classList.add('visible');
    document.body.classList.add('modal-open-no-scroll');
}

// 9. 모달 숨김 함수
function hideModal() {
    modalEl.classList.remove('visible');
    document.body.classList.remove('modal-open-no-scroll');
}

// 10. 최근 본 장소를 localStorage에 저장하는 함수
function saveRecentSpot(spot) {
    // 저장할 핵심 정보만 추출
    const spotInfo = {
        id: spot.id,
        name: spot.name,
        image: spot.image,
        location: spot.location
    };

    // 로컬 스토리지에서 기존 목록을 불러옴 (없으면 빈 배열)
    let recentList = JSON.parse(localStorage.getItem('recentSpots')) || [];

    // 1. 중복 제거: 이미 목록에 있는 항목이면 기존 것을 제거
    recentList = recentList.filter(item => item.id !== spot.id);

    // 2. 새 항목을 목록의 맨 앞에 추가
    recentList.unshift(spotInfo);

    // 3. 목록 크기 제한 (최대 5개)
    if (recentList.length > 4) {
        recentList = recentList.slice(0, 4);
    }

    // 4. 로컬 스토리지에 저장
    localStorage.setItem('recentSpots', JSON.stringify(recentList));

    // 5. 위젯 업데이트
    renderRecentlyViewed();
}


// ⭐️ 11. 최근 본 장소 위젯을 렌더링하는 함수
function renderRecentlyViewed() {
    const recentList = JSON.parse(localStorage.getItem('recentSpots')) || [];

    // 위젯 제목 추가
    let html = '<h3>최근 본 장소</h3>';

    if (recentList.length === 0) {
        html += '<p>최근 본 장소가 없습니다.</p>';
    } else {
        html += '<div class="recent-list">';
        recentList.forEach(spot => {
            // 참고: 실제 웹에서는 이 링크를 상세 페이지 URL로 연결해야 합니다.
            html += `
                <a href="#" class="recent-item" title="${spot.name} (${spot.location})" onclick="alert('${spot.name} 상세 페이지로 이동합니다. (링크 미연결)'); return false;">
                    <img src="${spot.image}" alt="${spot.name}">
                    <div class="recent-text">
                    </div>
                </a>
            `;
        });
        html += '</div>';
    }

    recentlyViewedEl.innerHTML = html;
}
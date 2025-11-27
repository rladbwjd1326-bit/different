// 1. 여행지 데이터 (실제 데이터는 더 상세하게 채울 수 있습니다.)
const travelSpots = [
    {
        id: 1,
        name: "홍대 코인 노래방 투어",
        location: "서울 홍대/신촌",
        description: "친구들과 1000원으로 K-POP 최신곡을 신나게 부르는 한국식 유흥 문화!",
        tags: ["아이돌편테마", "쇼핑테마", "로컬바이브", "음악", "저예산", "노래방"],
        image: "",
    },
    {
        id: 2,
        name: "뜨끈한 돼지국밥 & 깍두기",
        location: "부산 서면",
        description: "한국인들의 소울푸드. 든든한 국물과 고기로 해장과 식사를 동시에! 김치와 깍두기 필수.",
        tags: ["식도락여행테마", "로컬바이브", "국밥", "부산", "맛집"],
        image: "",
    },
    {
        id: 3,
        name: "강남 방탈출 카페 - K-POP 아이돌 콘셉트",
        location: "서울 강남역",
        description: "머리를 써서 제한 시간 내에 방을 탈출하는 미션 게임. 친구들과 팀워크를 즐겨보세요.",
        tags: ["아이돌편테마", "로컬바이브", "실내놀이", "테마카페"],
        image: "",
    },
    {
        id: 4,
        name: "힙스터 감성 '말차' 전문 카페",
        location: "서울 성수동",
        description: "트렌디한 인테리어와 고급 말차 디저트, 음료를 즐기는 카페투어의 정점.",
        tags: ["커피투어테마", "말차테마", "식도락여행테마", "카페"],
        image: "",
    },
    {
        id: 5,
        name: "가로수길 로드샵 & 디자이너 브랜드 쇼핑",
        location: "서울 가로수길",
        description: "한국 신진 디자이너 브랜드와 트렌디한 패션 아이템을 구매하기 좋은 곳.",
        tags: ["쇼핑테마", "패션", "강남", "로컬바이브"],
        image: "",
    },
    {
        id: 6,
        name: "드립커피 장인의 로스팅 카페",
        location: "서울 연남동",
        description: "산미와 풍미가 살아있는 특별한 드립커피를 맛볼 수 있는 전문 로스터리.",
        tags: ["커피투어테마", "카페", "연남동", "로스터리"],
        image: "",
    },
    // 더 많은 여행지를 추가할 수 있습니다.
];

// 2. DOM 요소 선택
const tripListEl = document.getElementById('tripList');
const searchInputEl = document.getElementById('searchInput');
const tagFiltersEl = document.getElementById('tagFilters');
// const searchButtonEl = document.getElementById('searchButton');

let activeTag = null; // 현재 활성화된 태그

// 3. 여행지 카드 생성 함수
function createTripCard(spot) {
    const card = document.createElement('div');
    card.className = 'trip-card';

    // 카드 내부 HTML 구성
    const tagsHtml = spot.tags.map(tag => `<span>#${tag}</span>`).join('');

    card.innerHTML = `
        <div class="card-image">${spot.image}</div>
        <div class="card-content">
            <h3>${spot.name}</h3>
            <p>📍 ${spot.location}</p>
            <p>${spot.description}</p>
            <div class="card-tags">${tagsHtml}</div>
        </div>
    `;

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
        const tagMatch = !activeTag || spot.tags.includes(activeTag);

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
    allButton.textContent = 'ALL 🗺️';
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
    const tag = clickedButton.dataset.tag;

    // 현재 활성화된 태그 상태 업데이트
    if (activeTag === tag || tag === '') {
        // 이미 활성화된 태그를 다시 클릭하거나 'ALL'을 클릭한 경우
        activeTag = null; // 'ALL'은 null로 처리하여 모든 태그 포함
    } else {
        activeTag = tag;
    }

    // 버튼의 active 클래스 업데이트
    document.querySelectorAll('.tag-button').forEach(btn => {
        btn.classList.remove('active');
    });

    if (activeTag) {
        clickedButton.classList.add('active');
    } else {
        // 'ALL' 버튼을 찾아 active 클래스 추가 (초기 버튼이 '' 태그를 가지고 있음)
        document.querySelector('.tag-filters button[data-tag=""]').classList.add('active');
    }

    filterSpots(); // 필터링 실행
}


// 7. 이벤트 리스너 등록 및 초기 실행
window.onload = () => {
    // (키 입력 시 바로 검색)
    searchInputEl.addEventListener('input', filterSpots);

    // 검색 버튼 클릭
    // searchButtonEl.addEventListener('click', filterSpots);

    // 사용자가 검색 입력 필드에서 Enter 키를 눌렀을 때도 검색되도록 추가
    searchInputEl.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            filterSpots();
        }
    });

    // 태그 필터 초기화
    setupTagFilters();

    // 초기 목록 렌더링 (모든 여행지 표시)
    renderTripList(travelSpots);
};
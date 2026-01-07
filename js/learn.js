/* learn.js - Merged Logic for Media & Mini Games */

let playlistAutoCloseTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initGame(); // K-Quiz
    initMedia(); // Media Page Logic
});


/* ================================
   TAB NAVIGATION (Folder Style)
================================ */
function initTabs() {
    const tabs = document.querySelectorAll('.tab-folder-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Reset tab states
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => {
                p.style.display = 'none';
                p.classList.remove('active');
            });

            // Activate selected tab
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);

            if (targetPane) {
                targetPane.style.display = 'block';
                targetPane.classList.add('active');
            }

            // Resize trigger for canvas / draggable layout (Hangul Builder)
            if (targetId === 'builder') {
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 50);
            }
        });
    });
}

/* ================================
   K-QUIZ GAME LOGIC
================================ */
function initGame() {
    const gameCard = document.getElementById('gameCard');
    const startBtn = document.getElementById('startBtn');

    // Load quiz data
    let questions = [];
    if (typeof MOCK_QUIZ_DATA !== 'undefined') {
        questions = MOCK_QUIZ_DATA;
    } else {
        // Fallback data
        questions = [
            {
                question: "대한민국의 수도는 어디일까요?",
                options: ["부산", "서울", "제주", "인천"],
                answer: 1
            }
        ];
    }

    let currentQ = 0;
    let score = 0;

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            loadQuestion(0);
        });
    }

    function loadQuestion(index) {
        currentQ = index;
        const qData = questions[currentQ];

        gameCard.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'quiz-content fade-in';

        container.innerHTML = `
            <div class="round-indicator">Round ${currentQ + 1} / ${questions.length}</div>
            <div class="question-text">${qData.question}</div>
            <div class="options-list"></div>
        `;

        const optionsList = container.querySelector('.options-list');

        qData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => handleAnswer(idx, btn, optionsList);
            optionsList.appendChild(btn);
        });

        gameCard.appendChild(container);
    }

    function handleAnswer(selectedIndex, selectedBtn, listContainer) {
        const allBtns = listContainer.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.disabled = true);

        const correctIndex = questions[currentQ].answer;

        if (selectedIndex === correctIndex) {
            score++;
            selectedBtn.classList.add('correct');
        } else {
            selectedBtn.classList.add('wrong');
            allBtns[correctIndex].classList.add('correct');
        }

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                loadQuestion(currentQ + 1);
            } else {
                showResult();
            }
        }, 1000);
    }

    function showResult() {
        gameCard.innerHTML = `
            <div class="result-screen fade-in">
                <h3>Game Over!</h3>
                <p>당신의 점수는 <strong>${score} / ${questions.length}</strong> 입니다.</p>
                <button class="action-btn" id="restartBtn">처음으로 돌아가기</button>
            </div>
        `;

        document.getElementById('restartBtn').addEventListener('click', () => {
            score = 0;
            loadQuestion(0);
        });
    }
}

/* ================================
   MEDIA LOGIC
================================ */
function initMedia() {
    // 1. Convert URL to Embed (보강)
    function convertToEmbed(url) {
        if (!url) return url;
        if (url.includes("embed")) return url;

        // youtu.be 지원
        if (url.includes("youtu.be/")) {
            const id = url.split("youtu.be/")[1].split("?")[0].split("&")[0];
            return "https://www.youtube.com/embed/" + id;
        }

        // shorts 지원
        if (url.includes("shorts")) {
            const id = url.split("/shorts/")[1].split("?")[0].split("&")[0];
            return "https://www.youtube.com/embed/" + id;
        }

        // watch?v= 지원
        if (url.includes("watch?v=")) {
            const id = url.split("watch?v=")[1].split("&")[0];
            return "https://www.youtube.com/embed/" + id;
        }

        return url;
    }

    function extractVideoId(url) {
        try {
            const u = new URL(url);

            // 일반 watch?v=
            if (u.searchParams.get("v")) return u.searchParams.get("v");

            // youtu.be/ID 형태
            if (u.hostname.includes("youtu.be")) {
                return u.pathname.replace("/", "");
            }

            // /embed/ID 형태
            if (u.pathname.includes("/embed/")) {
                return u.pathname.split("/embed/")[1].split("?")[0];
            }
        } catch (e) { }
        return null;
    }

    function buildThumbUrl(videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    function setMainVideo(videoId, titleText, categoryKey, descriptionHtml) {
        const iframe = document.getElementById("mainVideo");
        const title = document.getElementById("videoTitle");
        const desc = document.getElementById("videoDesc");
        const detail = document.getElementById("contentToToggle");
        const toggleBtn = document.getElementById("toggleButton");

        if (!iframe) return;

        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
        if (title && titleText) title.textContent = titleText;
        if (desc) desc.textContent = categoryKey ? `${categoryKey} videos` : "선택한 영상";

        if (detail) {
            detail.innerHTML = descriptionHtml || "";
            detail.classList.add("hidden");
        }
        if (toggleBtn) toggleBtn.textContent = "자세히 보기 ▼";
    }

    function renderVerticalList(categoryKey, videos) {
        const listEl = document.getElementById("categoryVideoList");
        if (!listEl) return;

        listEl.innerHTML = "";

        videos.forEach((v, idx) => {
            const id = extractVideoId(v.url) || v.id; // 호환
            if (!id) return;

            const item = document.createElement("div");
            item.className = "v-item";
            item.dataset.videoId = id;

            const thumb = document.createElement("div");
            thumb.className = "v-thumb";
            thumb.style.backgroundImage = `url("${buildThumbUrl(id)}")`;

            const meta = document.createElement("div");
            meta.className = "v-meta";

            const title = document.createElement("div");
            title.className = "v-title";
            title.textContent = v.title || `${categoryKey.toUpperCase()} #${idx + 1}`;

            const sub = document.createElement("div");
            sub.className = "v-sub";
            sub.textContent = "Click to play";

            meta.appendChild(title);
            meta.appendChild(sub);

            item.appendChild(thumb);
            item.appendChild(meta);

            // item.addEventListener("click", () => {
            //     document.querySelectorAll("#categoryVideoList .v-item").forEach(el => el.classList.remove("active"));
            //     item.classList.add("active");

            //     setMainVideo(id, title.textContent, categoryKey, v.description || "");

            //     // ✅ 영상 선택하면 재생목록 접기 + 타이머 정리
            //     if (playlistAutoCloseTimer) {
            //         clearTimeout(playlistAutoCloseTimer);
            //         playlistAutoCloseTimer = null;
            //     }
            //     collapsePlaylist();
            // });

            item.addEventListener("click", () => {
                document.querySelectorAll("#categoryVideoList .v-item").forEach(el => el.classList.remove("active"));
                item.classList.add("active");

                setMainVideo(id, title.textContent, categoryKey, v.description || "");

                // ✅ 닫기/타이머 관련 코드 없음 (영상 선택해도 안 닫힘)
            });

            listEl.appendChild(item);
        });

        // 첫 번째 자동 선택
        const first = listEl.querySelector(".v-item");
        if (first) first.click();
    }

    /* =========================================================
       2. 영상 데이터 (카테고리 통합)
    ========================================================= */

    const travelSpotDescMap = {
        "pYzX7cqK_JQ": `
            <h3>전통과 현재가 공존하는 대한민국 (한국관광공사TV)</h3>
            <p><strong>[English]</strong> This video showcases the unique landscape where traditional Korean architecture and modern skyscrapers coexist through stunning cinematography. It offers a glimpse into Korea's dynamic nature—valuing its past while rapidly advancing toward the future.</p>
            <p><strong>[한글]</strong> 이 영상은 한국의 전통 건축물과 현대적인 고층 빌딩이 공존하는 독특한 풍경을 감각적인 영상미로 담아냈습니다. 과거를 소중히 여기면서도 미래를 향해 빠르게 발전하는 한국의 역동적인 모습을 한눈에 이해할 수 있습니다.</p>
        `,

        "CcCjvSZQ-Xc": `
    <h3>한국에서 꼭 방문해야 할 놀라운 장소들 (Joyous Travel)</h3>

    <p><strong>[English]</strong><br>
    This is a travel guide introducing various Korean cities beyond Seoul, including Andong, Yeosu, Busan, and Gyeongju.
    From UNESCO World Heritage sites like Bulguksa Temple in Gyeongju and Hahoe Folk Village in Andong
    to the charm of the modern coastal city Busan, this video provides a deep dive into Korea's history and nature.</p>

    <p><strong>[한글]</strong><br>
    서울뿐만 아니라 안동, 여수, 부산, 경주 등 한국의 다양한 도시를 소개하는 가이드입니다.<br>
    유네스코 세계문화유산인 경주의 불국사와 안동의 하회마을부터
    현대적인 해안 도시 부산의 매력까지, 한국의 역사와 자연을 깊이 있게 이해할 수 있는 영상입니다.</p>
  `,

        "lVPCJYWamJE": `
    <h3>서울에서 꼭 가봐야 할 장소 Top 10 (The City Discovery)</h3>

    <p><strong>[English]</strong><br>
    This video highlights the top 10 landmarks in Seoul, the heart of Korea.
    From Gyeongbokgung Palace, the main royal palace of the Joseon Dynasty,
    and Bukchon Hanok Village with its preserved traditional houses,
    to bustling shopping and food districts like Myeongdong and Hongdae,
    it captures both Seoul's traditional charm and its youthful, vibrant energy.</p>

    <p><strong>[한글]</strong><br>
    한국의 수도이자 트렌드의 중심지인 서울의 핵심 명소를 정리했습니다.<br>
    조선 시대의 법궁인 경복궁과 전통 가옥이 보존된 북촌 한옥마을,
    그리고 쇼핑과 먹거리의 중심지인 명동과 홍대까지,
    서울이 가진 전통적인 매력과 젊고 활기찬 에너지를 동시에 느낄 수 있습니다.</p>
  `,

        "oqWDJoE43Fg": `
    <h3>빠니보틀 - 한국 관광의 문제는 무엇일까? (경주 편)</h3>

    <p><strong>[English]</strong><br>
    Famous Korean travel YouTuber Pani Bottle explores Gyeongju, often called an “outdoor museum,”
    with his friend Anthony from Uganda.
    The video honestly portrays challenges foreigners may face, such as language barriers and transportation issues,
    while also highlighting the charm of Gyeongju including Hanok cafés, Gyeongju World,
    and the beautiful night views of Donggung Palace and Wolji Pond.</p>

    <p><strong>[한글]</strong><br>
    한국의 유명 여행 유튜버 빠니보틀이 우간다에서 온 친구 안소니와 함께
    ‘지붕 없는 박물관’이라 불리는 경주를 여행합니다.<br>
    외국인 입장에서 느낄 수 있는 언어 장벽이나 교통 시스템의 불편함을 솔직하게 보여주며,
    황리단길 한옥 카페, 경주월드, 동궁과 월지의 야경 등
    경주만의 매력도 현실적으로 소개하는 여행 가이드 영상입니다.</p>
  `,

        "SlaFtUE6sqI": `
    <h3>외국인이 좋아하는 한국 여행지 TOP 20 (랭킹티비)</h3>

    <p><strong>[English]</strong><br>
    Where do foreigners visit most when they come to Korea?
    Based on official statistics, this video introduces the top 20 destinations
    from Seoul and Busan to Jeju Island.
    Places that offer everyday Korean life, food, shopping,
    and easy public transportation access rank higher than scenic-only locations.</p>

    <p><strong>[한글]</strong><br>
    통계 자료를 바탕으로 외국인 관광객들이 실제로 가장 많이 방문하고 만족해하는 장소들을 정리했습니다.<br>
    서울(명동, 홍대, 강남), 부산(해운대, 자갈치시장), 제주도까지,
    풍경보다도 한국인의 일상을 체험하고 쇼핑과 먹거리가 풍부한 장소들이
    높은 순위를 차지한다는 점을 알 수 있습니다.</p>
  `,

        "xYALZ9KejoY": `
    <h3>제주도 가볼 만한 곳 베스트 33 (여행정보 여정)</h3>

    <p><strong>[English]</strong><br>
    This video is a comprehensive guide to Jeju Island,
    divided into North, South, East, and West regions.
    It introduces natural wonders like Seongsan Ilchulbong and Hyeopjae Beach,
    as well as cultural experiences such as Dongmun Market and Osulloc Tea Museum.
    A perfect starting point for foreigners planning their first trip to Jeju.</p>

    <p><strong>[한글]</strong><br>
    한국인과 외국인 모두에게 사랑받는 제주도를
    북부, 남부, 동부, 서부 네 구역으로 나누어 상세히 소개합니다.<br>
    성산 일출봉, 협재 해수욕장 같은 자연 경관과
    동문시장, 오설록 티 뮤지엄 등 먹거리와 체험까지
    제주 여행을 처음 계획하는 외국인에게 가장 좋은 가이드 영상입니다.</p>
  `,

        "iV6Cx5QPxQM": `
    <h3>가평 여행 베스트 10 (Gapyeong Best 10)</h3>

    <p><strong>[English]</strong><br>
    Explore Gapyeong, a top getaway near Seoul where nature meets European-style theme parks.
    From the famous Nami Island to peaceful botanical gardens,
    this video shows how Koreans enjoy relaxing weekend trips.</p>

    <p><strong>[한글]</strong><br>
    가평은 서울 근교에서 가장 사랑받는 휴양지 중 하나입니다.<br>
    남이섬과 같은 유명 관광지부터 아름다운 수목원까지,
    자연과 테마파크가 어우러진 한국의 여유로운 여행 문화를 소개합니다.</p>
  `,

        "h6aJ8ds0g9A": `
    <h3>겨울 당일치기 여행지 Best 8</h3>

    <p><strong>[English]</strong><br>
    Experience the vibrant and romantic side of Korean winter.
    This video highlights modern landmarks and dazzling light festivals near Seoul,
    showing how Korea transforms into a glowing winter wonderland.</p>

    <p><strong>[한글]</strong><br>
    한국의 겨울은 춥지만 화려합니다.<br>
    서울 근교의 현대적인 쇼핑몰과 조명 축제 등을 통해
    겨울에만 느낄 수 있는 세련되고 로맨틱한 한국의 분위기를 담았습니다.</p>
  `,

        "87aWGz-A3_c": `
    <h3>가장 이국적인 국내 여행지 Part 1</h3>

    <p><strong>[English]</strong><br>
    Discover the exotic side of Korea that looks just like Europe.
    These hidden gems reveal the diverse and globalized charm of modern Korean travel destinations.</p>

    <p><strong>[한글]</strong><br>
    한국 안에서 유럽을 만날 수 있는 이색적인 장소들입니다.<br>
    전통적인 한국의 모습뿐만 아니라
    다양한 문화를 수용하고 즐기는 한국 여행지의 색다른 매력을 발견할 수 있습니다.</p>
  `,

        "01E06alp6N4": `
    <h3>잘 알려지지 않은 이국적인 여행지 Part 2</h3>

    <p><strong>[English]</strong><br>
    This video explores Korea’s history, diverse religions,
    and unique landscapes such as sand dunes.
    It introduces hidden spots where the past and present coexist
    with surprisingly exotic scenery.</p>

    <p><strong>[한글]</strong><br>
    단순한 관광지를 넘어 한국의 역사, 종교, 독특한 자연 지형을 함께 보여줍니다.<br>
    구룡포 일본인 가옥거리 같은 역사적 장소부터
    예상치 못한 이국적인 풍경까지,
    한국의 입체적인 모습을 경험할 수 있는 여행 제안입니다.</p>
  `
    };

    // ✅ [ADD] Korea Food - description map (videoId 기준)
    const koreaFoodDescMap = {
        "zPuLGkluoTY": `
    <h3>한국 길거리 음식 먹방</h3>

    <p><strong>[한글]</strong><br>
    이 영상은 한국의 대표 길거리 음식을 먹방 형식으로 소개합니다.<br>
    떡볶이, 오뎅, 순대, 튀김 등 다양한 간식을 실제로 맛보며 한국 길거리 음식의 맛과 분위기를 자연스럽게 보여줍니다.<br>
    한국 음식 문화를 이해하는 데 좋은 영상입니다!</p>

    <p><strong>[English]</strong><br>
    This video introduces Korea’s popular street foods in a mukbang style.<br>
    You can see and hear the creator tasting various Korean snacks such as tteokbokki (spicy rice cakes),
    odeng (fish cake), sundae (Korean blood sausage), and fried foods.</p>

    <p>By watching this video, viewers can naturally experience the flavors, atmosphere, and street food culture of Korea.<br>
    It’s a great way for foreigners to understand how Koreans enjoy street food in everyday life.</p>
  `,

        "nxrgOqNzBcg": `
    <h3>영국 학생들이 반한 한국의 학교 급식!</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 영국 학생들이 반한 한국의 학교 급식!<br><br>
    이 영상은 영국 학생들이 한국의 학교 급식을 처음 먹어보는 반응을 담고 있습니다.</p>

    <ul>
      <li><strong>영양 가득한 한 상:</strong> 밥, 국, 반찬(김치 등)이 어우러진 균형 잡힌 식단을 보여줍니다.</li>
      <li><strong>새로운 맛의 발견:</strong> 도토리묵, 깻잎 같은 한국만의 독특하고 건강한 식재료를 소개합니다.</li>
      <li><strong>매콤달콤한 풍미:</strong> 제육볶음의 매운맛과 한국 배, 붕어빵 아이스크림 같은 달콤한 디저트가 인상적입니다.</li>
    </ul>

    <p>한국의 건강하고 맛있는 학교 식문화를 짧고 재미있게 이해할 수 있는 영상입니다!</p>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British Students Love Korean School Lunch!<br><br>
    Watch these British students experience a typical Korean school meal for the first time!</p>

    <ul>
      <li><strong>Balanced Meal:</strong> It shows a nutritious tray with rice, soup, and various side dishes like Kimchi.</li>
      <li><strong>Unique Ingredients:</strong> Discover healthy, unique Korean ingredients like acorn jelly and perilla leaves.</li>
      <li><strong>Sweet &amp; Spicy:</strong> Enjoy their reactions to spicy pork and iconic desserts like Korean pears and fish-shaped ice cream.</li>
    </ul>

    <p>A fun and quick look at the high-quality food culture in Korean schools!</p>
  `,

        "VgFA7K-4kn4": `
    <h3>영국 고등학생들을 놀라게 한 한국의 분식 파티!</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 영국 고등학생들을 놀라게 한 한국의 분식 파티!<br><br>
    이 영상은 영국 학생들이 한국 어디서나 쉽게 볼 수 있는 '분식집' 메뉴들을 처음 맛보는 장면을 보여줍니다.</p>

    <ul>
      <li><strong>가성비와 다양성:</strong> 김밥, 돈가스, 쫄면, 떡볶이 등 저렴한 가격에 즐길 수 있는 엄청난 양과 종류의 음식에 놀라워합니다.</li>
      <li><strong>새로운 식감과 조합:</strong> 김밥을 떡볶이 소스나 돈가스 소스에 찍어 먹는 한국인만의 독특한 ‘먹조합’을 직접 체험합니다.</li>
      <li><strong>다채로운 풍미:</strong> 건강한 김밥의 조화부터 매콤한 쫄면과 떡볶이의 강렬한 맛까지, 한국 분식의 매력을 생생하게 전달합니다.</li>
    </ul>

    <p>한국의 학생들이 방과 후에 친구들과 즐겨 먹는 친숙하고 대중적인 음식 문화를 이해하기에 가장 좋은 영상입니다!</p>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British Students Blown Away by Korean Bunsik (Snack Food)!<br><br>
    This video features British students trying a variety of popular Korean snack foods often found at casual local diners.</p>

    <ul>
      <li><strong>Variety &amp; Value:</strong> They are amazed by the huge variety and generous portions of affordable dishes like Kimbap, Tonkatsu (pork cutlet), Jjolmyeon (spicy chewy noodles), and Tteokbokki.</li>
      <li><strong>Flavorful Combinations:</strong> Watch them discover the classic Korean "pro-tip" of dipping Kimbap into Tteokbokki or Tonkatsu sauce for an extra burst of flavor.</li>
      <li><strong>A Palette of Tastes:</strong> From the healthy balance of Kimbap to the fiery kick of Tteokbokki, they experience the wide range of flavors that define Korean casual food culture.</li>
    </ul>

    <p>A perfect introduction to the delicious and affordable comfort food that Korean students love to enjoy with friends!</p>
  `,

        "DlYfPtPcvaE": `
    <h3>한국 치킨의 매력에 푹 빠진 영국 고등학생들!</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 한국 치킨의 매력에 푹 빠진 영국 고등학생들!<br>
    영국 학생들이 한국의 다양한 양념 치킨을 처음 맛보며 감탄하는 영상입니다.</p>

    <ul>
      <li><strong>바삭함의 끝판왕:</strong> 오리지널 후라이드 치킨의 엄청난 바삭함과 육즙에 놀라워합니다.</li>
      <li><strong>다채로운 양념:</strong> 달콤한 양념치킨, 짭조름한 간장마늘 치킨, 그리고 화끈한 매운맛의 볼케이노 치킨까지 한국 치킨의 다양한 풍미를 경험합니다.</li>
      <li><strong>최고의 조합:</strong> 치킨 무와 함께 먹는 한국식 '치킨 문화'를 즐기며, 왜 한국 치킨이 세계적으로 유명한지 보여줍니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British Students Fall in Love with Korean Fried Chicken!<br><br>
    Watch British students try various flavors of Korean fried chicken for the first time!</p>

    <ul>
      <li><strong>Ultimate Crunch:</strong> They are amazed by the incredible crispiness and juiciness of the original fried chicken.</li>
      <li><strong>Diverse Flavors:</strong> From sweet seasoned chicken and savory soy garlic to the fiery "Volcano" chicken, they experience a wide range of unique Korean flavors.</li>
      <li><strong>The Perfect Pairing:</strong> By enjoying chicken with pickled radish, they get a true taste of Korea’s famous chicken culture.</li>
    </ul>
  `,

        "Ei0gSKJza4k": `
    <h3>한국 길거리 간식, 핫도그와 떡볶이에 반한 영국 중학생들!</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 한국 길거리 간식, 핫도그와 떡볶이에 반한 영국 중학생들!<br>
    영국 중학생들이 한국의 인기 길거리 음식인 '명랑핫도그' 스타일의 핫도그와 떡볶이를 체험합니다.</p>

    <ul>
      <li><strong>단짠의 조화:</strong> 설탕을 뿌린 핫도그에 케첩을 얹어 먹는 한국식 '단짠' 조합에 신선한 충격을 받습니다.</li>
      <li><strong>치즈 폭포:</strong> 쭉 늘어나는 모짜렐라 치즈 핫도그와 감자가 붙은 감자 핫도그의 비주얼과 맛에 열광합니다.</li>
      <li><strong>환상의 짝꿍:</strong> 매콤한 떡볶이 국물에 핫도그를 찍어 먹는 완벽한 조합을 발견하며 한국 분식의 매력을 만끽합니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British Students Surprised by Korean Hot Dogs and Tteokbokki!<br>
    British students try famous Korean street foods, including trendy corn dogs and spicy rice cakes.</p>

    <ul>
      <li><strong>Sweet &amp; Salty:</strong> They are pleasantly shocked by the "sweet and salty" combination of sugar-coated hot dogs with ketchup.</li>
      <li><strong>Cheese &amp; Crunch:</strong> They love the epic cheese pull from mozzarella hot dogs and the extra crunch of potato-crusted ones.</li>
      <li><strong>The Best Combo:</strong> Discovering the joy of dipping hot dogs into spicy Tteokbokki sauce, they fully enjoy the charms of Korean snack food.</li>
    </ul>
  `,

        "8jbKNVCaTjw": `
    <h3>한국식 프리미엄 소고기(한우) 구이를 처음 맛본 영국 학생들!</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 한국식 프리미엄 소고기(한우) 구이를 처음 맛본 영국 학생들!<br>
    졸업을 앞둔 영국 고등학생들이 한국식 숯불 소고기 구이를 맛보며 인생 최고의 식사를 경험합니다.</p>

    <ul>
      <li><strong>입에서 녹는 맛:</strong> 차돌박이와 마블링이 예술인 '꽃등심'이 입안에서 사르르 녹는 식감에 감동합니다.</li>
      <li><strong>독특한 부위:</strong> 우설(소 혀)과 같은 평소 접하기 힘든 부위의 의외의 맛에 놀라움을 금치 못합니다.</li>
      <li><strong>정성스러운 양념:</strong> 달콤하고 짭조름한 양념 갈비와 다양한 쌈 문화(쌈장, 기름장 등)를 통해 한국 고기구이의 진수를 배웁니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British High Schoolers Try Luxury Korean Beef BBQ for the First Time!<br>
    British students celebrating their upcoming graduation have the meal of their lives with premium Korean charcoal-grilled beef.</p>

    <ul>
      <li><strong>Melts in Your Mouth:</strong> They are deeply moved by the tender texture of thinly sliced brisket and highly marbled ribeye that literally melts away.</li>
      <li><strong>Unique Cuts:</strong> The students are surprised by the delicious taste of unique cuts like ox tongue, which they hadn't tried before.</li>
      <li><strong>Exquisite Marinades:</strong> Through sweet and savory marinated ribs and the "Ssam" (wrapping) culture, they experience the essence of Korean BBQ.</li>
    </ul>
  `,

        "oaeEIzS1Gms": `
    <h3>한국 과자를 처음 먹어보고 깜짝 놀란 영국 중학생들!</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 한국 과자를 처음 먹어보고 깜짝 놀란 영국 중학생들!<br>
    영국 학생들이 새우깡, 고구마깡, 홈런볼 등 한국의 대표적인 과자들을 시식하며 솔직한 반응을 보입니다.</p>

    <ul>
      <li><strong>해산물의 풍미:</strong> 새우깡의 바삭함과 실제 새우 맛이 나는 점에 놀라며, 특히 해산물을 좋아하는 학생들에게 큰 인기를 얻습니다.</li>
      <li><strong>새로운 식감:</strong> 겉은 부드럽고 안은 초코로 가득 찬 홈런볼과 겹겹이 바삭한 꼬북칩의 독특한 식감에 감탄합니다.</li>
      <li><strong>창의적인 맛:</strong> 고래밥처럼 귀여운 모양의 과자와 초코파이 같은 클래식한 간식을 즐기며 한국 과자 특유의 다양성을 경험합니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British High Schoolers Blown Away by Korean Snacks!<br>
    Watch British students try iconic Korean snacks like Shrimp Crackers, Home Run Ball, and Turtle Chips.</p>

    <ul>
      <li><strong>Seafood Flavors:</strong> They are surprised by the crunchy texture and authentic shrimp taste of "Saewookkang," especially a hit with seafood lovers.</li>
      <li><strong>Unique Textures:</strong> The students are amazed by the soft, chocolatey "Home Run Ball" and the multi-layered crunch of "Turtle Chips."</li>
      <li><strong>Creative Variety:</strong> </li>
    </ul>
  `,

        "AZxZIUQHx5Q": `
    <h3>한국 분식 '풀세트'를 처음 경험한 영국 고등학생들!</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 한국 분식 '풀세트'를 처음 경험한 영국 고등학생들!<br>
    영국 학생들이 떡볶이, 튀김, 순대, 어묵 등 한국 고등학교 앞 분식집의 인기 메뉴들을 정복합니다.</p>

    <ul>
      <li><strong>치즈의 유혹:</strong> 설탕과 케첩을 곁들인 치즈 핫도그의 엄청난 '치즈 늘어남'과 맛의 조화에 열광합니다.</li>
      <li><strong>매콤한 도전:</strong> 떡볶이의 매운맛에 땀을 흘리면서도 김말이와 튀김을 소스에 찍어 먹는 매력에 푹 빠집니다.</li>
      <li><strong>의외의 발견:</strong> 처음엔 순대의 비주얼에 당황하지만, 맛을 본 후에는 영국식 '블랙 푸딩'과 비슷하다며 의외로 긍정적인 반응을 보입니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British High Schoolers Conquer a Full Course of Korean Street Food!<br>
    Students dive into popular Korean "Bunsik" dishes like Tteokbokki, Tempura, Sundae (blood sausage), and Fish Cakes.</p>

    <ul>
      <li><strong>Cheese Pull Magic:</strong> They go crazy for the epic cheese pull and the sweet-salty combo of Korean-style corn dogs.</li>
      <li><strong>Spicy but Addictive:</strong> Despite the heat from Tteokbokki, they love dipping "Gimmari" (seaweed rolls) and mandu into the spicy sauce.</li>
    </ul>
  `,

        "QzDZGR5KuHs": `
    <h3>영국 고등학교 전체에 한국 치킨 파티가 열린다면?!</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 영국 고등학교 전체에 한국 치킨 파티가 열린다면?!<br>
    영국남자 팀이 한국의 유명 치킨 브랜드 전문가들과 함께 영국 고등학교 전교생에게 갓 튀긴 한국 치킨을 대접하는 대규모 이벤트 영상입니다.</p>

    <ul>
      <li><strong>압도적인 반응:</strong> 전교생이 줄을 서서 치킨을 기다리고, 갓 튀겨낸 바삭한 치킨 맛에 학교 전체가 열광의 도가니가 됩니다.</li>
      <li><strong>다양한 소스:</strong> 허니 갈릭, 양념 등 달콤하고 짭짤한 한국식 소스 맛이 영국 학생들의 입맛을 완벽하게 사로잡습니다.</li>
      <li><strong>문화적 교류:</strong> 단순한 시식을 넘어 한국의 치킨 문화를 대규모로 공유하며 학생들에게 잊지 못할 추억을 선사합니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: We Threw a Korean Fried Chicken Party for a WHOLE British High School!<br>
    The Korean Englishman team partners with a top Korean chicken brand to serve freshly fried chicken to an entire British high school.</p>

    <ul>
      <li><strong>Incredible Hype:</strong> The whole school lines up in excitement, and the reaction to the crispy, high-quality chicken is absolutely explosive.</li>
      <li><strong>Flavor Explosion:</strong> The signature Korean sauces, like Honey Garlic and Yangnyeom, prove to be a massive hit with the students and staff.</li>
      <li><strong>Cultural Connection:</strong> </li>
    </ul>
  `,

        "m3npKv7tjIs": `
    <h3>영국 고등학생들의 좌충우돌 한국 마트 쇼핑 도전기!</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 영국 고등학생들의 좌충우돌 한국 마트 쇼핑 도전기!<br>
    영국 학생들이 런던의 한국 마트에서 제한된 예산으로 각자 좋아하는 한국 음식과 물건들을 직접 골라 담는 쇼핑 대결을 펼칩니다.</p>

    <ul>
      <li><strong>취향 존중:</strong> 영상에서 먹어본 음료수(밀키스), 과자, 컵라면 등을 찾으며 마트 곳곳을 누빕니다.</li>
      <li><strong>새로운 발견:</strong> 처음 보는 한국 과일(배)이나 독특한 생활용품, 방탄소년단(BTS) 관련 굿즈 등을 보며 신기해합니다.</li>
      <li><strong>예산과의 싸움:</strong> 정해진 금액 안에서 최고의 '꿀조합'을 찾기 위해 고군분투하며 한국 마트의 다양한 매력을 보여줍니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British High Schoolers’ Chaotic Korean Supermarket Challenge!<br>
    The students head to a Korean supermarket in London with a limited budget to shop for their favorite Korean snacks and items.</p>

    <ul>
      <li><strong>Fan Favorites:</strong> They hunt for items they’ve tried before, like "Milkis" soda, snacks, and instant noodles, navigating the aisles with excitement.</li>
      <li><strong>New Discoveries:</strong> They are fascinated by large Korean pears, unique household items, and even BTS-themed products.</li>
      <li><strong>Budget Battles:</strong> The challenge of picking the best "haul" within their budget highlights the incredible variety of products available in a Korean mart.</li>
    </ul>
  `,

        "xnI1QBVKJEI": `
    <h3>삼겹살 구이와 치즈 김치볶음밥에 감동한 영국 고등학생들!</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 삼겹살 구이와 치즈 김치볶음밥에 감동한 영국 고등학생들!<br>
    한국의 '소울 푸드'인 삼겹살을 숯불에 구워 먹고, 남은 기름에 김치볶음밥까지 만들어 먹는 풀코스를 체험합니다.</p>

    <ul>
      <li><strong>삼겹살의 풍미:</strong> 두툼한 삼겹살이 구워지는 소리와 쌈장에 찍어 먹는 고소한 맛에 완전히 매료됩니다.</li>
      <li><strong>쌈 문화 체험:</strong> 깻잎과 상추에 고기, 마늘, 김치를 얹어 한입 가득 먹는 한국 특유의 '쌈' 문화를 즐겁게 배웁니다.</li>
      <li><strong>화룡점정 볶음밥:</strong> 고기를 먹은 후 치즈를 듬뿍 얹은 김치볶음밥의 맛에 "인생 최고의 맛"이라며 극찬을 아끼지 않습니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British Students Blown Away by Pork Belly BBQ and Cheese Kimchi Fried Rice!<br>
    The students experience a classic Korean BBQ course: grilled "Samgyeopsal" followed by the legendary "K-dessert," fried rice.</p>

    <ul>
      <li><strong>The Sizzle of BBQ:</strong> They are mesmerized by the sound of thick pork belly grilling and the savory flavor when dipped in "Ssamjang" sauce.</li>
      <li><strong>Art of the Wrap:</strong> They learn the Korean way of making "Ssam," wrapping meat, garlic, and kimchi in perilla leaves and lettuce for a perfect bite.</li>
      <li><strong>The Grand Finale:</strong> The meal ends with kimchi fried rice topped with melted cheese, which they describe as one of the best things they've ever eaten.</li>
    </ul>
  `,

        "o0yDvUbfVzs": `
    <h3>인생 첫 육회 먹어본 영국 고등학생들의 반응!?</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 인생 첫 육회 먹어본 영국 고등학생들의 반응!?<br>
    영국 학생들이 한국 식당에서 잡채, 해물파전, 김치전 등 다양한 음식을 코스로 즐기며 메인 요리인 육회와 부대찌개에 도전합니다.</p>

    <ul>
      <li><strong>육회의 충격:</strong> 생고기와 날달걀 노른자, 배의 조합에 처음엔 당황하지만, 한 입 먹어본 후에는 그 신선함과 달콤함에 매료됩니다.</li>
      <li><strong>부대찌개의 역사:</strong> 한국 전쟁 이후 미군 부대의 재료로 만들어진 부대찌개의 유래를 들으며 스팸, 소시지, 치즈가 들어간 독특한 맛을 즐깁니다.</li>
      <li><strong>다양한 전 요리:</strong> 겉바속촉 해물파전과 매콤한 김치전의 매력에 푹 빠져 젓가락질을 멈추지 못합니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British High Schoolers Try Raw Beef for the First Time!<br>
    The students enjoy a full course meal including Japchae and various Korean pancakes (Jeon), leading up to the main events: Yukhoe and Budae-jjigae.</p>

    <ul>
      <li><strong>Yukhoe Surprise:</strong> Initially shocked by the raw beef and egg yolk, they are quickly won over by the fresh, sweet flavor of the dish.</li>
      <li><strong>Army Stew History:</strong> They learn about the history of "Budae-jjigae" and enjoy the fusion of spam, sausages, and cheese in a spicy broth.</li>
      <li><strong>Pancake Love:</strong> The crispy seafood and kimchi pancakes are huge hits, with the students praising the variety of textures.</li>
    </ul>
  `,

        "HICNKK-nEKc": `
    <h3>편의점 꿀조합을 처음 먹어본 영국 고등학생들의 반응!? (짜파구리, 마크정식)</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 편의점 꿀조합을 처음 먹어본 영국 고등학생들의 반응!? (짜파구리, 마크정식)<br>
    편의점 음식을 조합해 새로운 요리를 만드는 한국의 '모디슈머' 문화를 체험하며 짜파구리와 마크정식을 맛봅니다.</p>

    <ul>
      <li><strong>간편함의 극치:</strong> 뜨거운 물과 마이크로웨이브만으로 훌륭한 한 끼가 완성되는 한국 편의점 시스템에 감탄합니다.</li>
      <li><strong>마크정식의 맛:</strong> 떡볶이, 스파게티 컵라면, 치즈, 소시지를 섞은 '마크정식'의 화려한 비주얼과 맛에 "최고의 맛"이라며 열광합니다.</li>
      <li><strong>음료의 신세계:</strong> 밀키스와 칠성사이다의 청량함에 놀라며, 왜 영국에는 이런 음료가 없는지 아쉬워합니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British Students Try Famous Korean Convenience Store Hacks!<br>
    The students dive into Korea's unique convenience store culture, trying legendary combos like Jjapaguri and the "Mark Meal."</p>

    <ul>
      <li><strong>Pinnacle of Convenience:</strong> They are amazed that a gourmet-level meal can be prepared instantly using just a microwave and hot water.</li>
      <li><strong>The Mark Meal:</strong> A mix of Tteokbokki, spaghetti noodles, cheese, and sausages blows their minds, with some calling it the best thing they've ever had.</li>
      <li><strong>Refreshing Drinks:</strong> They fall in love with Milkis and Chilsung Cider, questioning why these refreshing drinks aren't available in the UK.</li>
    </ul>
  `,

        "P5zouxkguEM": `
    <h3>길거리 토스트 처음 먹어본 영국 고등학생들의 반응!?</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 길거리 토스트 처음 먹어본 영국 고등학생들의 반응!?<br>
    한국의 대표적인 길거리 간식인 '이삭토스트' 스타일의 토스트를 맛보며 한국식 토스트의 독특한 단짠 매력을 경험합니다.</p>

    <ul>
      <li><strong>이색적인 재료:</strong> 토스트 안에 양배추, 달걀, 햄뿐만 아니라 설탕과 달콤한 소스가 들어가는 점에 흥미를 느낍니다.</li>
      <li><strong>단짠의 조화:</strong> 짭짤한 재료와 달콤한 소스의 조화가 완벽하다며, 아침 식사로 매일 먹고 싶다는 반응을 보입니다.</li>
      <li><strong>김치 치즈 토스트:</strong> 김치와 치즈가 들어간 토스트를 먹으며 "김치에 대한 편견이 깨졌다"고 극찬합니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British High Schoolers Try Korean Street Toast for the First Time!<br>
    The students explore the world of Korean-style street toast, known for its addictive sweet and savory flavor profile.</p>

    <ul>
      <li><strong>Surprising Ingredients:</strong> They are intrigued by the combination of cabbage, ham, eggs, and the secret sweet sauce.</li>
      <li><strong>Sweet &amp; Savory:</strong> They praise the perfect balance of flavors, with some saying it’s the ultimate breakfast sandwich.</li>
      <li><strong>Kimchi Cheese Toast:</strong> Trying a kimchi and cheese version, many students change their minds about kimchi, finding it delicious when toasted with cheese.</li>
    </ul>
  `,

        "JdZ77-3Z4VI": `
    <h3>망고 빙수 처음 먹어본 영국 고등학생들의 반응!?</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 망고 빙수 처음 먹어본 영국 고등학생들의 반응!?<br>
    여름철 최고의 디저트인 빙수를 맛보며, 눈꽃처럼 부드러운 우유 얼음과 화려한 토핑에 감탄합니다.</p>

    <ul>
      <li><strong>천국의 맛:</strong> 생망고가 듬뿍 올라간 망고 빙수를 먹으며 "천국에서 먹는 음식 같다"고 극찬합니다.</li>
      <li><strong>눈꽃 식감:</strong> 입안에서 사르르 녹는 우유 얼음의 식감이 일반적인 아이스크림과는 차원이 다르다며 놀라워합니다.</li>
      <li><strong>다양한 맛:</strong> 클래식한 팥빙수부터 오레오, 녹차 빙수까지 다양한 종류를 섭렵하며 한국 디저트의 매력을 만끽합니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: British Students Try Korean Mango Bingsu for the First Time!<br>
    The students cool down with Bingsu, a Korean shaved ice dessert, marveling at the snow-like texture and fresh toppings.</p>

    <ul>
      <li><strong>A Taste of Heaven:</strong> The Mango Bingsu is an instant favorite, with students describing the experience as "Zen-like" and "heavenly."</li>
      <li><strong>Snow-like Texture:</strong> They are fascinated by how the milky ice melts instantly on the tongue, unlike any ice cream they've had before.</li>
      <li><strong>Variety of Flavors:</strong> From the traditional red bean (Pat-bingsu) to Oreo and Matcha, they enjoy exploring the diverse world of Bingsu.</li>
    </ul>
  `,

        "-k_1rRdtI2U": `
    <h3>한국의 화려한 빵과 디저트 (별내 무노베이커리)</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 한국의 화려한 빵과 디저트 (별내 무노베이커리)<br>
    한국 베이커리에서 만들어지는 수많은 종류의 창의적인 빵과 디저트들을 시각적으로 보여주는 영상입니다.</p>

    <ul>
      <li><strong>압도적인 비주얼:</strong> 케이크, 타르트, 소금빵 등 화려한 비주얼의 디저트들이 끊임없이 등장합니다.</li>
      <li><strong>장인의 손길:</strong> 정성스럽게 빵을 굽고 디저트를 완성하는 과정을 통해 한국 베이커리 문화의 수준을 보여줍니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: Incredible Variety of Breads and Desserts in Korea!<br>
    This video showcases the stunning array of creative breads and desserts found in a high-end Korean bakery.</p>

    <ul>
      <li><strong>Visual Feast:</strong> A continuous parade of beautifully crafted cakes, tarts, and trendy breads like salt bread.</li>
      <li><strong>Artisanship:</strong> Highlights the meticulous process of baking and decorating, reflecting the high standards of Korean bakery culture.</li>
    </ul>
  `,

        "YV4Z94DvWdA": `
    <h3>광주 44년 전통 시장 불고기 백반 먹방 (tzuyang쯔양)</h3>

    <p><strong>[한글 버전]</strong><br>
    제목: 광주 44년 전통 시장 불고기 백반 먹방 (tzuyang쯔양)<br>
    유튜버 쯔양이 광주 양동시장을 방문하여 44년 전통의 불고기 백반을 즐기는 영상입니다.</p>

    <ul>
      <li><strong>푸짐한 인심:</strong> 1인분 12,000원이라는 가격에 상다리가 휘어질 정도로 나오는 수많은 반찬과 불고기의 양에 놀랍니다.</li>
      <li><strong>집밥 같은 맛:</strong> 자극적이지 않고 깊은 맛의 불고기와 정갈한 전라도식 밑반찬(파김치, 콩나물 등)의 조화가 일품입니다.</li>
      <li><strong>시장 분위기:</strong> 사장님의 따뜻한 정과 활기찬 전통시장의 분위기 속에서 즐기는 진정한 한국의 맛을 보여줍니다.</li>
    </ul>

    <hr>

    <p><strong>[English Version]</strong><br>
    Title: Tzuyang’s 44-Year Tradition Bulgogi Feast in Gwangju!<br>
    Famous mukbanger Tzuyang visits Gwangju's Yangdong Market to try a legendary Bulgogi set meal.</p>

    <ul>
      <li><strong>Incredible Value:</strong> She is shocked by the massive amount of Bulgogi and side dishes provided for such an affordable price.</li>
      <li><strong>Authentic Flavors:</strong> The meal features mild yet deep-flavored Bulgogi paired with authentic Gwangju-style side dishes like green onion kimchi.</li>
      <li><strong>Market Warmth:</strong> The video captures the heartwarming hospitality of the owner and the vibrant energy of a traditional Korean market.</li>
    </ul>
  `
    };

    // ✅ [ADD] Kpop - description map (videoId 기준)
    const kpopDescMap = {
        "tOAB3uH3KQQ": `
    <h3>Understanding Modern Korea Through the Energy of K-POP</h3>

    <p><strong>[English Version]</strong><br>
    <strong>Title:</strong> Understanding Modern Korea Through the Energy of K-POP</p>

    <p>1. This video features a live performance by the global sensation BLACKPINK, providing a glimpse into the cultural powerhouse that is modern-day South Korea.</p>
    <p>2. <strong>Modern Sophistication:</strong> Beyond its deep traditions, Korea leads the world in trendy music, fashion, and performance. BLACKPINK embodies the confidence and "hip" sensibility of Korea's younger generation.</p>
    <p>3. <strong>Perfectionism and Passion:</strong> The flawless choreography and powerful live vocals reflect the core Korean values of passion and hard work. The high-quality stage production, honed through years of rigorous training, explains why Korean content is celebrated worldwide.</p>
    <p><strong>Global Connectivity:</strong> You’ll notice the members communicating in Korean, English, and Japanese to connect with fans. This highlights Korea’s identity as an open, globally-minded nation that bridges different cultures through art.</p>

    <p><strong>[한글 버전]</strong><br>
    <strong>제목:</strong> K-POP을 통해 본 현대 한국의 에너지와 글로벌 문화</p>

    <p>이 영상은 세계적인 걸그룹 <strong>블랙핑크(BLACKPINK)</strong>의 콘서트 실황으로, 오늘날 한국이 가진 문화적 역량을 잘 보여줍니다.</p>
    <p><strong>세련된 현대 문화:</strong> 한국은 전통뿐만 아니라 트렌디한 음악, 패션, 퍼포먼스에서 세계를 선도하고 있습니다. 이 영상 속 블랙핑크의 모습은 현대 한국 젊은 세대의 자신감과 세련미를 상징합니다.</p>
    <p><strong>완벽주의와 열정:</strong> K-POP 아티스트들의 완벽한 군무와 라이브 실력은 한국 특유의 '열정'과 '노력'의 가치를 보여줍니다. 수년간의 훈련을 통해 만들어진 높은 수준의 무대는 한국 콘텐츠가 전 세계에서 사랑받는 이유입니다.</p>
    <p><strong>글로벌 연결고리:</strong> 영상 속에서 멤버들은 한국어뿐만 아니라 영어, 일본어로 소통하며 전 세계 팬들과 교감합니다. 이는 한국이 얼마나 개방적이고 글로벌한 문화를 지향하는지를 잘 나타냅니다.</p>
  `,

        "WpW2MlGOgfU": `
    <h3>NewJeans (뉴진스) - 2024 Music Bank Global Festival</h3>

    <p><strong>[English]</strong><br>
    NewJeans represents the latest trend in K-POP: "naturalism" and "sophisticated retro vibes."
    Moving away from highly stylized idol images, they rebrand teenage energy and 90s nostalgia for the modern era.
    This video showcases the 'Y2K' trend popular among Korea's youth and the charm of "easy-listening" K-POP that anyone can enjoy.</p>

    <p><strong>[한글]</strong><br>
    이 영상은 K-POP의 최신 트렌드인 '자연스러움'과 '세련된 레트로 감성'을 보여줍니다.<br>
    뉴진스는 정형화된 아이돌의 모습에서 벗어나, 10대들의 자연스러운 에너지와 90년대 레트로 감성을 현대적으로 재해석한 그룹입니다.
    이 영상을 통해 한국의 젊은 세대가 열광하는 'Y2K' 트렌드와 누구나 편하게 즐길 수 있는 이지리스닝(Easy-listening) K-POP의 매력을 느낄 수 있습니다.</p>
  `,

        "Z1oeUV45EsA": `
    <h3>EXO (엑소) - MMA 2025 Special Stage</h3>

    <p><strong>[English]</strong><br>
    EXO is a legendary group that led K-POP's global expansion with powerful synchronized choreography and unique storytelling (like their superpower concept).
    This video compiles their hits from debut to present, perfectly illustrating the overwhelming stage presence and the high level of performance perfection that Korean idol groups strive for.</p>

    <p><strong>[한글]</strong><br>
    이 영상은 K-POP의 정석이라 불리는 '강렬한 퍼포먼스'와 '세계관 스토리텔링'을 상징합니다.<br>
    엑소는 강력한 군무와 멤버별 초능력 설정 같은 독특한 세계관으로 K-POP의 글로벌 확장을 이끈 전설적인 그룹입니다.
    이 영상은 그들의 데뷔 초부터 현재까지의 히트곡을 묶은 것으로,
    한국 아이돌 그룹이 보여줄 수 있는 압도적인 무대 장악력과 완벽한 퍼포먼스 수준을 잘 보여줍니다.</p>
  `,

        "prNrCKE_Chk": `
    <h3>G-DRAGON (지드래곤) - MMA 2025 Comeback Stage</h3>

    <p><strong>[English]</strong><br>
    G-DRAGON is more than just a singer; he is a cultural icon with immense influence on fashion and art.
    This comeback stage, following a long hiatus, proves why he is called the "Idol of Idols."
    Through his free-spirited stage presence that defies conventional norms, you can witness the creativity and artistic depth of Korean pop culture.</p>

    <p><strong>[한글]</strong><br>
    이 영상은 한국 대중문화의 '아이콘'이자 '개성'과 '예술성'의 정점을 보여줍니다.<br>
    지드래곤은 단순한 가수를 넘어 패션과 예술계에 막대한 영향을 끼치는 아티스트입니다.
    오랜 공백기 끝에 돌아온 이 무대는 그가 왜 '아이돌의 아이돌'이라 불리는지 증명합니다.
    정해진 틀에 얽매이지 않는 자유로운 무대 매너를 통해 한국 문화의 창의성과 예술적 깊이를 이해할 수 있습니다.</p>
  `,

        "qPoTrGxOOEA": `
    <h3>IVE (아이브) - 2025 Lollapalooza Berlin</h3>

    <p><strong>[English]</strong><br>
    This video of IVE perfectly captures the energy of K-POP at major international festivals like Lollapalooza Berlin.
    It shows how Korea's sophisticated music and dazzling performances transcend language barriers,
    creating a festive atmosphere where European audiences sing along and celebrate together.</p>

    <p><strong>[한글]</strong><br>
    이 영상은 K-POP이 전 세계 페스티벌 무대에서 어떻게 관객을 하나로 만드는지 보여줍니다.<br>
    아이브의 이 영상은 베를린 롤라팔루자 같은 대형 해외 페스티벌에서 K-POP이 가진 에너지를 잘 보여줍니다.
    한국의 세련된 음악과 화려한 퍼포먼스가 언어를 넘어 유럽 관객들에게 어떻게 전달되고,
    함께 떼창하며 즐기는 축제 분위기를 체감할 수 있습니다.</p>
  `,

        "7pou55AvSTM": `
    <h3>BTS (방탄소년단) - Every Performance at Golden Disc (2014-2022)</h3>

    <p><strong>[English]</strong><br>
    Documenting eight years of BTS, this video traces their journey to becoming global icons.
    Their lyrics about the struggles of youth and their achievement of topping the Billboard charts with Korean songs symbolize the pride of Korean culture.
    You can witness their evolution from hip-hop roots to mastering diverse musical genres.</p>

    <p><strong>[한글]</strong><br>
    이 영상은 K-POP 역사상 가장 영향력 있는 그룹인 BTS의 성장 과정과 한국적인 정서를 보여줍니다.<br>
    BTS의 8년간의 기록을 담은 이 영상은 그들이 어떻게 세계적인 아티스트로 성장했는지 보여줍니다.
    특히 가사에 담긴 청춘에 대한 고민과 한국어 노래로 빌보드 정상에 오른 성과는 한국 문화의 자부심을 상징합니다.
    힙합에서 시작해 다양한 장르를 섭렵한 그들의 변천사를 한눈에 볼 수 있습니다.</p>
  `,

        "fwdr13TLT5Y": `
    <h3>PSY (싸이) - MCOUNTDOWN IN FRANCE (All Moments)</h3>

    <p><strong>[English]</strong><br>
    PSY is the artist who brought K-POP to the global mainstream with the "Gangnam Style" phenomenon.
    His performance in France, where he gets the entire audience jumping and interacting,
    is the ultimate display of the unique Korean sense of "Shinmyeong" (excitement and joy) and passionate energy.
    It highlights the power of music that everyone can enjoy, regardless of nationality.</p>

    <p><strong>[한글]</strong><br>
    이 영상은 한국의 공연 문화인 '신명'과 '에너지'의 끝판왕을 보여줍니다.<br>
    싸이는 전 세계에 '강남스타일' 열풍을 일으키며 K-POP의 대중적 인지도를 넓힌 아티스트입니다.
    프랑스 관객들과 소통하며 모두를 제자리에서 뛰게 만드는 그의 무대는
    한국 특유의 '신명'과 열정적인 에너지를 가장 직관적으로 보여줍니다.
    국적에 상관없이 모두가 즐길 수 있는 음악의 힘을 느낄 수 있습니다.</p>
  `,

        "FQZhehVRSXQ": `
    <h3>원밀리언(1MILLION) - 스트릿 우먼 파이터 2 메가 크루 미션</h3>

    <p><strong>[English]</strong><br>
    This video is a highlight from 'Street Woman Fighter 2,' a dance survival show that became a cultural phenomenon in Korea.
    Led by world-renowned choreographer Lia Kim, the '1MILLION' crew delivers overwhelming energy by combining disciplined group choreography
    with a modern reinterpretation of traditional Korean aesthetics.
    It perfectly demonstrates the intensity and high artistic standards of Korea's contemporary dance scene.</p>

    <p><strong>[한글]</strong><br>
    한국의 현대 무용과 댄스 스튜디오 문화의 정점을 보여주는 영상입니다.<br>
    이 영상은 한국에서 큰 신드롬을 일으킨 댄스 서바이벌 프로그램 '스트릿 우먼 파이터 2'의 한 장면입니다.
    세계적인 안무가 리아킴이 이끄는 '원밀리언' 크루는
    절도 있는 군무와 한국적인 선의 아름다움을 현대적으로 재해석하여 압도적인 에너지를 전달합니다.
    한국의 댄스 문화가 얼마나 치열하고 예술적으로 높은 수준에 와 있는지 잘 보여줍니다.</p>
  `,

        "_xOnGP_Js1A": `
    <h3>범접(BUMSUP) - WSWF 메가 크루 미션</h3>

    <p><strong>[English]</strong><br>
    This performance by the 'BUMSUP' crew emphasizes the powerful energy and sophisticated formations characteristic of Korean male dancers.
    True to their name, which means "inaccessible/unmatchable skill," this mega-crew performance features many dancers moving as one,
    showcasing the exceptional teamwork and creative directing capabilities of Korean artists.</p>

    <p><strong>[한글]</strong><br>
    한국의 남성 댄서들이 보여주는 힘과 창의적인 퍼포먼스를 상징합니다.<br>
    '범접' 크루의 이 무대는 한국 남성 댄서 특유의 파워풀한 에너지와 정교한 대형 변화를 강조합니다.
    '범접할 수 없는 실력'이라는 팀 이름의 의미처럼,
    많은 인원이 마치 한 몸처럼 움직이는 메가 크루 퍼포먼스를 통해
    한국인들의 뛰어난 협동심과 창의적인 연출력을 엿볼 수 있습니다.</p>
  `,

        "Ccck76OtemU": `
    <h3>APEC 경주 정상회의 갈라 디너 - K-POP 퍼포먼스</h3>

    <p><strong>[English]</strong><br>
    This is a performance from the APEC Leaders’ Gala Dinner held in Gyeongju, an ancient capital with a thousand-year history.
    The harmony between traditional Korean architecture, advanced lighting technology, and vibrant K-POP performances
    vividly illustrates the "fusion of tradition and modernity" in Korea.
    It is a key example of how art expresses national dignity and hospitality at prestigious international events.</p>

    <p><strong>[한글]</strong><br>
    한국의 전통 도시 경주를 배경으로 과거와 현재가 공존하는 한국의 미를 보여줍니다.<br>
    천년 고도 경주에서 열린 APEC 정상회의 갈라 디너 무대입니다.
    한국의 전통 건축물과 조명 기술, 그리고 화려한 K-POP 퍼포먼스가 어우러져
    한국이 가진 '전통과 현대의 조화'를 극명하게 보여줍니다.
    국가적인 행사에서 예술이 어떻게 국가의 품격과 환대를 나타내는지 이해할 수 있는 중요한 영상입니다.</p>
  `,

        "yebNIHKAC4A": `
    <h3>소니 애니메이션 "Golden" (K-Pop Demon Hunters)</h3>

    <p><strong>[English]</strong><br>
    This is the official lyric video for "Golden," a track from Sony Pictures Animation's upcoming film <em>K-Pop: Demon Hunters</em>.
    The movie features a unique premise where K-pop stars double as monster hunters behind the scenes.
    It highlights how K-pop idol culture has evolved beyond a music genre into a massive cultural phenomenon,
    now serving as a primary inspiration for global animation and Hollywood productions.</p>

    <p><strong>[한글]</strong><br>
    K-POP을 소재로 한 글로벌 애니메이션 프로젝트의 사례입니다.<br>
    이 영상은 소니 픽처스 애니메이션에서 제작 중인 영화 <em>K-Pop: Demon Hunters</em>의 삽입곡입니다.
    K-POP 아티스트들이 무대 밖에서는 악귀를 잡는 사냥꾼이라는 흥미로운 설정을 담고 있습니다.
    이는 한국의 아이돌 문화가 이제 단순한 음악 장르를 넘어
    전 세계 애니메이션과 할리우드 영화의 주요 소재가 될 만큼 거대한 문화적 현상이 되었음을 보여줍니다.</p>
  `,

        "rybqfwGzuVg": `
    <h3>BTS (방탄소년단) "SODA POP" MV</h3>

    <p><strong>[English]</strong><br>
    Featuring the world's leading group BTS, this video showcases the signature bright, refreshing energy and trendy visual aesthetics of K-pop.
    It represents how K-pop integrates with various brands—ranging from fashion and animation to food and beverage—
    becoming a part of daily life for people worldwide.
    You can feel both the positive message and the immense mainstream influence of BTS.</p>

    <p><strong>[한글]</strong><br>
    K-POP 아티스트의 브랜드 파워와 트렌디한 영상미를 보여줍니다.<br>
    세계 최고의 그룹 BTS의 곡을 활용한 이 영상은
    K-POP 특유의 밝고 청량한 에너지와 감각적인 영상미를 보여줍니다.
    특히 K-POP이 패션, 애니메이션, 음료 등 다양한 브랜드와 결합하여
    전 세계 사람들의 일상에 스며들어 있는 모습을 상징합니다.
    방탄소년단이 가진 긍정적인 메시지와 대중적인 영향력을 동시에 느낄 수 있습니다.</p>
  `,

        "xMJ45IzhSzg": `
    <h3>TWICE (트와이스) - 2025 빅토리아 시크릿 패션쇼</h3>

    <p><strong>[English]</strong><br>
    This video features TWICE, one of Korea's representative girl groups, performing at the world-renowned Victoria’s Secret Fashion Show.
    It proves that K-pop groups are no longer just singers but have established themselves as icons leading global fashion trends.
    Their confident stage presence and sophisticated style showcase the immense power and influence of modern Korean female artists.</p>

    <p><strong>[한글]</strong><br>
    한국을 대표하는 걸그룹 트와이스가 세계적인 패션쇼인 '빅토리아 시크릿' 무대에서 공연하는 모습입니다.<br>
    K-POP 그룹들이 단순히 노래만 하는 가수를 넘어,
    전 세계 패션 트렌드를 주도하는 아이콘으로 자리 잡았음을 증명합니다.
    당당한 무대 매너와 세련된 스타일을 통해
    현대 한국 여성 아티스트들의 강력한 파워를 확인할 수 있습니다.</p>
  `
    };

    // ✅ [ADD] Korea Makeup - description map (videoId 기준)
    const makeupDescMap = {
        "sZY68nPL35s": `
    <h3>Kpop Girl Group Makeup (한국 걸그룹 아이돌 메이크업)</h3>

    <p><strong>[한글]</strong><br>
    이 영상은 속눈썹과 화려한 섀도우를 활용해 이목구비를 강조하는 전형적인 아이돌 메이크업을 보여줍니다.</p>

    <p><strong>베이스:</strong> 쿨링감이 있는 쿠션을 사용해 피부를 정돈하고, 루나 컨실러로 잡티를 커버합니다.</p>

    <p><strong>아이 메이크업:</strong></p>
    <p><strong>눈썹:</strong> 한국 아이돌 특유의 일자 눈썹으로 그려줍니다.</p>
    <p><strong>음영:</strong> 다이소 브러쉬를 이용해 코와 눈가에 음영을 준 뒤, 샴페인 색상의 다이아 파우더로 블링블링함을 더합니다.</p>
    <p><strong>속눈썹:</strong> 화려한 윗 속눈썹과 자연스러운 언더 속눈썹을 함께 붙여 눈을 크게 강조합니다.</p>

    <p><strong>립:</strong> 시원한 색상의 틴트로 그라데이션 립을 연출합니다.</p>

    <p><strong>[English]</strong><br>
    This video focuses on defining the eyes using false lashes and bold glitter, typical of the classic K-pop stage look.</p>

    <p><strong>Base:</strong> Uses a cooling cushion to prep the skin and hides imperfections with a high-coverage concealer.</p>
    <p><strong>Brows:</strong> Shapes the brows into the iconic "Korean straight brow" style for a youthful appearance.</p>

    <p><strong>Eyes:</strong></p>
    <p>* Applies contour to the nose and eye sockets using affordable tools (Daiso brushes).</p>
    <p>Adds intense sparkle using champagne-toned diamond powder on the eyelids.</p>

    <p><strong>Lashes:</strong> Pairs dramatic upper lashes with natural-looking under-eye lashes to maximize eye size.</p>
    <p><strong>Lips:</strong> Creates a vibrant "gradient lip" look using a lip tint.</p>
  `,

        "5aq0xcMi9kI": `
    <h3>이사배의 2025 새내기 메이크업 (가성비 화장품 활용)</h3>

    <p><strong>[한글]</strong><br>
    새내기들을 위해 투명하고 맑은 피부 표현과 자연스러운 이목구비 확장에 집중한 메이크업입니다.</p>

    <p><strong>베이스 믹싱:</strong> 쿠션과 톤업 크림을 1:1로 섞어 바르면 양을 줄이면서도 뽀샤시한 피부를 연출할 수 있습니다.</p>
    <p><strong>터치 기법:</strong> 팡팡 두드리지 말고 '도도도도' 하듯 섬세하게 밀착시키는 것이 중요합니다.</p>
    <p><strong>음영 스틱 활용:</strong> 립 쉐이퍼(토프 컬러)를 눈 밑 트임, 코 음영, 오버립 가이드로 다양하게 활용하여 자연스러운 그림자를 만듭니다.</p>
    <p><strong>자연스러운 눈매:</strong> 아이라인을 길게 뺀 뒤 면봉으로 경계를 풀어 섀도우와 연결하면 과하지 않게 눈이 길어 보입니다.</p>

    <p><strong>[English]</strong><br>
    A guide for beginners focusing on a clear, "glass skin" base and natural facial contouring to enhance features subtly.</p>

    <p><strong>Base Mixing:</strong> Mixes cushion foundation with tone-up cream (1:1 ratio) to achieve a bright yet thin and natural layer.</p>
    <p><strong>The "Tap" Technique:</strong> Instead of heavy patting, she uses a delicate "do-do-do" (light tapping) motion to ensure perfect skin adhesion.</p>
    <p><strong>Multi-use Shadow Sticks:</strong> Uses a taupe-colored lip shaper to create natural shadows for under-eye widening (Aegyo-sal), nose contouring, and over-lining lips.</p>
    <p><strong>Extended Eyeliner:</strong> Draws a long wing and blurs the edges with a cotton swab to connect it naturally with eyeshadow.</p>
  `,

        "qXl7wH3fA5Y": `
    <h3>인보라의 지젤 스타일 청순 화려 메이크업</h3>

    <p><strong>[한글]</strong><br>
    지젤의 바뀐 메이크업 특징인 '밑트임'과 '뒷트임'을 데일리하게 풀어낸 화장법입니다.</p>

    <p><strong>눈썹 정돈:</strong> 컨실러로 눈썹 아랫 라인을 깔끔하게 잡아 이목구비를 또렷하게 만듭니다.</p>

    <p><strong>트임 기술:</strong></p>
    <p>아이라인을 아래로 살짝 내려 그린 뒤, 삼각존 음영이 아이라인과 만나도록 채워 뒤트임 효과를 줍니다.</p>
    <p>컨실러 펜슬로 애교살 앞부분만 밝혀 볼륨감을 줍니다.</p>

    <p><strong>하이라이팅:</strong> 코 끝을 쉐딩으로 한 번 끊어준 뒤 하이라이터를 동글게 얹어 코를 짧고 오똑하게 표현합니다.</p>
    <p><strong>복숭아 치크:</strong> 앞볼 위주로 넓게 복숭아 빛 블러셔를 바르고, 밤 제형 하이라이터로 광택을 더합니다.</p>

    <p><strong>[English]</strong><br>
    Focuses on the "Lower &amp; Outer Corner Extension" (Back/Under-eye wing) technique popularized by aespa's Giselle.</p>

    <p><strong>Clean Brow Lines:</strong> Uses concealer to sharpen the bottom line of the brows, making the overall facial features look more distinct.</p>

    <p><strong>Widening Techniques:</strong></p>
    <p>* Extends the eyeliner downwards and fills the "triangle zone" (outer corner) so the shadow meets the liner, creating a "back-slit" effect.</p>
    <p>Uses a concealer pencil only on the inner part of the Aegyo-sal to add volume without looking cakey.</p>

    <p><strong>Highlighting:</strong> Contours the tip of the nose to make it look shorter and sharper, then adds a "dot" of highlighter for a cute, trendy look.</p>
    <p><strong>Peach Cheeks:</strong> Applies peach-toned blush broadly on the front cheeks and adds a dewy glow with a balm-type highlighter.</p>
  `,

        "ucgxYYi9Ju4": `
    <h3>안다 x 다윤쌤의 4세대 여돌 무대 메이크업</h3>

    <p><strong>[한글]</strong><br>
    아이브 담당 메이크업 아티스트가 전수하는 땀에도 무너지지 않는 화려한 무대용 메이크업입니다.</p>

    <p><strong>철벽 베이스:</strong> 기초 단계에서 수분막을 겹겹이 쌓고, 세미 매트한 파데를 얇게 여러 번 밀착시켜 고정력을 높입니다.</p>

    <p><strong>무대용 눈매:</strong></p>
    <p>아이라인을 선명하게 잡고 섀도우로 스머징하여 멀리서도 또렷하게 보이게 합니다.</p>

    <p><strong>네일 글리터 활용:</strong> 메이크업용보다 반짝임이 강한 네일 글리터를 눈두덩이에 올려 극강의 화려함을 연출합니다.</p>

    <p><strong>언더 속눈썹:</strong> 가닥 속눈썹을 언더에 붙일 때, 눈꼬리 쪽은 살짝 내려서 붙여 눈이 더 확장되어 보이게 합니다.</p>

    <p><strong>파츠 포인트:</strong> 콧등에 파츠를 붙여 무대 조명 아래서 빛나는 포인트를 줍니다.</p>

    <p><strong>[English]</strong><br>
    A professional tutorial on long-lasting, sweat-proof stage makeup used by 4th generation girl groups like IVE.</p>

    <p><strong>Bulletproof Base:</strong> Builds thin layers of moisture first, followed by a semi-matte foundation pressed firmly into the skin for maximum durability against sweat.</p>

    <p><strong>Stage Eye Definition:</strong></p>
    <p>* Lines the eyes sharply and smudges with dark shadow to ensure the eyes pop even from a distance.</p>

    <p><strong>Nail Glitter Secret:</strong> Uses nail art glitter instead of makeup glitter for a much more reflective and "blinding" sparkle under stage lights.</p>

    <p><strong>Under-lash Placement:</strong> Places individual under-lashes slightly lower than the actual lash line towards the outer corner to dramatically enlarge the eyes.</p>

    <p><strong>Face Gems:</strong> Adds a tiny gemstone on the bridge of the nose or near the eyes for a signature "idol" point.</p>
  `,

        "BVbKS6fJQOU": `
    <h3>1. (여자)아이들 미연의 찐 화장품 정보 공유 GRWM</h3>

    <p><strong>[한국어 요약]</strong></p>
    <p><strong>베이스:</strong> 스파츌라를 이용해 얇고 균일하게 펴 바른 뒤, 광택보다는 매트하고 깔끔한 표현을 선호합니다.</p>
    <p><strong>눈썹:</strong> 본연의 눈썹 모양이 예뻐서 펜슬로 빈 곳만 가볍게 채워줍니다.</p>
    <p><strong>눈화장:</strong> 샵 선생님들의 스킬을 따라 하기 위해 직접 구매한 속눈썹 가닥들을 하나씩 붙이며 눈을 확장시킵니다.</p>
    <p><strong>립 &amp; 블러셔:</strong> 한 가지 색상보다는 3~4가지를 섞어 깊이감을 주는 것을 좋아하며, 최근에는 촉촉한 '유리알 립'에 빠져 있습니다.</p>

    <p><strong>[English Summary]</strong></p>
    <p><strong>Base:</strong> She prefers a matte and clean finish over a glossy look, applying foundation thinly and evenly using a spatula.</p>
    <p><strong>Brows:</strong> Since she has a good natural brow shape, she lightly fills in any gaps with a pencil.</p>
    <p><strong>Eyes:</strong> To replicate professional styles, she uses individual false lash clusters to widen and define her eyes.</p>
    <p><strong>Lips &amp; Blush:</strong> Miyeon loves mixing 3–4 different shades to create depth and is currently obsessed with a "glass-like" glossy lip finish.</p>
  `,

        "KIWxML762no": `
    <h3>2. 르세라핌, 레드벨벳 담당 이슬쌤의 K-POP 아이돌 메이크업</h3>

    <p><strong>[한국어 요약]</strong></p>
    <p><strong>베이스 철학:</strong> 눈화장을 먼저 한 뒤 베이스를 하는데, 이는 가루 날림을 방지하고 피부 화장의 지속력을 높이기 위함입니다.</p>
    <p><strong>유분 제거:</strong> 파운데이션을 바를 때 스펀지의 마른 면을 활용해 불필요한 유분을 꾹꾹 눌러 빼주면 무너짐 없는 피부가 완성됩니다.</p>
    <p><strong>아이 메이크업:</strong> 아이라인을 그린 후 중간 톤 섀도우로 라인 끝까지 스머징해주면 눈이 자연스럽게 길어 보입니다.</p>
    <p><strong>비밀 병기:</strong> 무대 조명에서 빛나기 위해 입자가 큰 글리터를 사용하며, 립 위에 투명 글로스를 얹어 지속력을 높입니다.</p>

    <p><strong>[English Summary]</strong></p>
    <p><strong>Base Philosophy:</strong> Doing eye makeup first prevents fallout from ruining the base and ensures the skin makeup stays fresh longer.</p>
    <p><strong>Oil Control:</strong> Pressing the skin with the clean, dry side of a sponge helps remove excess oil for a "bulletproof" base.</p>
    <p><strong>Eye Technique:</strong> Smudging the eyeliner with a mid-tone shadow out to the tip of the wing makes the eyes look naturally elongated.</p>
    <p><strong>Secret Items:</strong> Large-particle glitters are used for stage presence, and a clear gloss is layered over the lips to lock in the color.</p>
  `,

        "BJOEa0LjLYw": `
    <h3>허성범의 초간단 남자 메이크업 (호박에 줄긋기)</h3>

    <p><strong>[한국어 요약]</strong><br>
    초보 남성들도 10분 만에 따라 할 수 있는 자연스러운 '꾸안꾸' 메이크업 가이드입니다.</p>

    <p><strong>자연스러운 베이스:</strong> 파운데이션에 그린 코렉터를 섞어 붉은기를 잡고, 물 먹인 쿠션을 사용해 얇게 밀착시킵니다.</p>
    <p><strong>입체감 쉐딩:</strong> 콧대와 턱선에 붉은기 없는 쉐딩을 사용하여 얼굴이 부어 보이지 않게 음영을 줍니다.</p>
    <p><strong>눈매 교정:</strong> 눈 끝 삼각형 존에 아주 연한 섀도우로 음영을 주어 시원한 눈매를 만듭니다 (자신 있는 분만 추천).</p>
    <p><strong>마무리:</strong> 땀이 많은 여름철에는 피니시 파우더로 유분기를 잡아 번들거림을 방지합니다.</p>

    <p><strong>[English Summary]</strong></p>
    <p><strong>Natural Base:</strong> Mixes foundation with a green corrector to neutralize redness and uses a damp puff for thin, seamless adhesion.</p>
    <p><strong>Contouring:</strong> Uses a non-reddish shading powder on the nose bridge and jawline to create dimension without looking artificial.</p>
    <p><strong>Eye Correction:</strong> Applying a subtle shadow to the outer "triangle zone" of the eye helps create a more defined look.</p>
    <p><strong>Finishing:</strong> Uses a setting powder to control oil and sweat, especially important for a clean look during summer.</p>
  `,

        "NVd2zHX5W-I": `
    <h3>구독자 메이크오버 남자 메이크업 편 (JUNGSAEMMOOL)</h3>

    <p><strong>[한국어 요약]</strong><br>
    이 영상은 메이크업 아티스트 정샘물이 일반인 구독자를 대상으로 사진이 잘 나오는 '눈썹 미남' 메이크업을 선보입니다.<br>
    깨끗한 피부 표현과 이목구비를 살리는 음영 작업에 집중합니다.
    특히 남자의 인상을 결정짓는 눈썹을 자연스럽고 또렷하게 교정하여 사진에서 입체감이 살도록 연출하는 법을 상세히 보여줍니다.</p>

    <p><strong>[English Summary]</strong><br>
    Makeup artist Jung Saem-mool transforms a subscriber with a focus on 'photogenic' makeup.
    It emphasizes clean skin expression and natural eyebrow grooming to enhance facial structure and definition for the camera.</p>
  `,

        "WGH3X-mMC0I": `
    <h3>티 안 나는 남자 메이크업 (박쿠쿠 kookoo)</h3>

    <p><strong>[한국어 요약]</strong><br>
    현직 헤어 디자이너가 일상에서 부담 없이 할 수 있는 아주 자연스러운 메이크업 루틴을 소개합니다.<br>
    기초 케어의 중요성을 강조하며, 비레디 쿠션을 활용해 피부 톤을 균일하게 맞춥니다.
    다이소 제품들을 활용해 쉐딩, 애교살, 아이라인 등을 티 나지 않게 터치하여
    인상을 또렷하게 만드는 실용적인 팁을 공유합니다.</p>

    <p><strong>[English Summary]</strong><br>
    A hairstylist shares a "no-makeup" makeup routine for men.
    He covers essential skincare, using cushions for an even skin tone, and practical tips for natural shading and subtle eye definition using affordable products.</p>
  `,

        "D5kG1va7MyI": `
    <h3>이젠 남자도 메이크업하는 시대! (JUNGSAEMMOOL)</h3>

    <p><strong>[한국어 요약]</strong><br>
    초보자도 쉽게 따라 할 수 있는 손쉬운 남자 메이크업 가이드를 제공합니다.<br>
    복잡한 과정 대신 단계별로 따라 하기 쉬운 베이스 메이크업과 자연스러운 생기를 주는 립밤 사용법 등을 다룹니다.
    남성들이 흔히 고민하는 잡티 커버와 깔끔한 인상을 주는 법에 초점을 맞춥니다.</p>

    <p><strong>[English Summary]</strong><br>
    This video provides an easy-to-follow guide for men's makeup.
    It focuses on simple base application, blemish coverage, and using tinted lip balms to achieve a neat and refreshed look without complexity.</p>
  `,

        "JXRzntMvgm0": `
    <h3>화장품 회사 다니는 남자의 주말 일상 (션님 SHAWN)</h3>

    <p><strong>[한국어 요약]</strong><br>
    화장품 업계 종사자의 현실적인 주말 외출용 메이크업과 일상을 보여줍니다.<br>
    외출 전 선크림과 프라이머로 모공을 커버하고,
    파운데이션과 파우더를 활용해 유지력이 좋은 피부 화장을 완성합니다.
    쉐딩과 눈썹 정리를 통해 자연스럽게 정돈된 느낌을 주는 과정을 브이로그 형식으로 담았습니다.</p>

    <p><strong>[English Summary]</strong><br>
    A professional in the cosmetics industry shows his weekend grooming routine.
    He uses primer to blur pores and layered base products for long-lasting coverage, finishing with natural contouring and eyebrow styling in a vlog format.</p>
  `
    };

    // ✅ [ADD] Korea Conversation - description map (videoId 기준)
    const conversationDescMap = {
        "dM1dWUQm3uE": `
    <h3>세종 한국어 회화 1 (제1과: 자기소개)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video introduces the culture of first impressions in Korea. It teaches how to greet someone with 'Annyeonghaseyo' and introduce your name, nationality, and occupation. It's perfect for understanding the basic etiquette Koreans follow when meeting someone for the first time.</p>

    <p><strong>[한글 설명]</strong><br>
    한국에서 처음 만난 사람과 어떻게 인사를 나누고 자신을 소개하는지 보여주는 영상입니다.<br>
    한국의 첫인사 문화를 배울 수 있는 영상입니다. 처음 만난 사람에게 '안녕하세요'라고 인사하며 이름, 국적, 직업을 소개하는 방법을 알려줍니다. 한국인들이 처음 관계를 맺을 때 예의를 갖추는 기본 형식을 이해하기 좋습니다.</p>
  `,

        "bQF4umz6YCE": `
    <h3>세종 한국어 회화 1 (제2과: 장소 이름)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video covers the names of various locations and expressions for asking about destinations. Through drama scenes featuring offices, hotels, and schools, it provides a glimpse into modern Korean life and the culture of navigating through the city.</p>

    <p><strong>[한글 설명]</strong><br>
    장소를 묻고 답하는 표현을 통해 한국의 일상적인 배경을 소개합니다.<br>
    한국의 다양한 장소 명칭과 목적지를 묻는 표현을 다룹니다. 드라마 속 장면을 통해 회사, 호텔, 학교 등 실제 한국 생활에서 자주 쓰이는 장소들을 보여주어, 한국의 현대적인 풍경과 길 찾기 문화를 이해하는 데 도움을 줍니다.</p>
  `,

        "yNJs_o69RHM": `
    <h3>세종 한국어 회화 1 (제3과: 숫자와 전화번호)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video explains the Korean numbering system and how to ask for phone numbers or prices. Set against the backdrop of events like the Itaewon Global Village Festival, it captures Korea's dynamic festival culture and the practical use of numbers in everyday situations.</p>

    <p><strong>[한글 설명]</strong><br>
    한국의 숫자 체계와 실생활에서의 활용(가격, 전화번호 등)을 설명합니다.<br>
    한국에서 숫자를 읽는 방법과 전화번호, 물건 가격을 묻는 법을 소개합니다. 이태원 지구촌 축제와 같은 배경을 통해 한국의 역동적인 축제 문화와 실생활에서 숫자가 어떻게 쓰이는지 흥미롭게 보여줍니다.</p>
  `,

        "_7d_wAQfB3A": `
    <h3>세종 한국어 회화 1 (제4과: 위치와 소유)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video teaches how to describe the location of objects and express ownership through everyday Korean conversations. You can see how Koreans politely refer to their belongings (e.g., 'my room', 'my wallet'), which helps in understanding the polite forms used in the Korean language.</p>

    <p><strong>[한글 설명]</strong><br>
    한국에서 물건의 위치를 설명하거나 소유 관계를 말할 때의 표현을 다룹니다.<br>
    한국인의 일상적인 대화를 통해 물건이 어디에 있는지(위치)와 누구의 것인지(소유)를 배우는 영상입니다. 특히 한국인들이 '제 방', '제 지갑'과 같이 자신의 물건을 정중하게 표현하는 방식을 엿볼 수 있어, 한국어의 예의 표현을 이해하는 데 도움이 됩니다.</p>
  `,

        "opf0kP-F8Sw": `
    <h3>세종 한국어 회화 1 (제5과: 쇼핑과 물건 사기)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video focuses on shopping at stores or pharmacies in Korea. It introduces unique Korean counting units (e.g., for objects, people, animals) and the essential phrase for asking prices, 'Eolmayeyo?' (How much is it?). It provides practical tips for shopping at Korean markets or supermarkets.</p>

    <p><strong>[한글 설명]</strong><br>
    한국의 가게나 약국에서 물건을 사고 가격을 묻는 실전 표현을 소개합니다.<br>
    한국의 가게나 약국에서 쇼핑하는 방법을 다룹니다. 한국어의 독특한 숫자 세기 단위(개, 명, 마리 등)와 가격을 묻는 '얼마예요?'라는 핵심 표현을 배웁니다. 한국의 시장이나 마트에서 실제로 물건을 구매할 때 유용한 정보를 제공합니다.</p>
  `,

        "VnWLxtyyjEE": `
    <h3>세종 한국어 회화 1 (제6과: 음식과 식당)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video introduces representative Korean dishes like Bibimbap, Bulgogi, and Naengmyeon, and teaches how to order at a restaurant. It helps you understand Korean dining culture better by teaching phrases for expressing preferences (e.g., 'Please leave out the meat') or describing tastes (e.g., 'It’s not spicy').</p>

    <p><strong>[한글 설명]</strong><br>
    한국의 대표적인 음식들과 식당에서 주문할 때 사용하는 표현을 보여줍니다.<br>
    비빔밥, 불고기, 냉면 등 대표적인 한국 음식을 소개하고 식당에서 주문하는 법을 배웁니다. 특히 '고기를 빼 주세요'처럼 자신의 기호를 말하거나 '안 매워요'와 같이 맛을 표현하는 방법을 통해 한국의 식외식 문화를 더 깊이 이해할 수 있습니다.</p>
  `,

        "qb6NRKeGcyg": `
    <h3>세종 한국어 회화 1 (제7과: 시간과 날짜)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video covers how to express time and dates in Korean. By observing how Koreans ask about weekend plans, recommend movies (e.g., 'Please watch Train to Seoul'), and make appointments, you can understand Korean concepts of time and how they make suggestions. It also explains the use of the particle '-e' after time-related nouns.</p>

    <p><strong>[한글 설명]</strong><br>
    한국에서 날짜와 요일을 묻고 답하며, 일정을 잡을 때의 표현을 다룹니다.<br>
    한국의 시간과 날짜 표현 방식을 배우는 영상입니다. 특히 한국인들이 주말 계획을 묻고 서로에게 영화를 추천(예: '서울행을 보세요')하거나 약속을 잡는 과정을 통해, 한국인의 시간 개념과 제안하는 문화를 이해할 수 있습니다. 또한, 시간 명사 뒤에 붙는 '에'의 사용법을 익힐 수 있습니다.</p>
  `,

        "1C3kiySLOIA": `
    <h3>세종 한국어 회화 1 (제8과: 과거의 경험)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video teaches how to describe past experiences (using '~asseoyo/eosseoyo') and the locations where actions take place (using '~eseo'). Through the dialogues, you can see how Koreans share their daily leisure activities, such as riding bicycles in a park or reading Korean novels at a library over the weekend.</p>

    <p><strong>[한글 설명]</strong><br>
    과거에 했던 일이나 장소에서의 활동을 설명하는 표현을 소개합니다.<br>
    과거에 있었던 일을 말하는 방법('~았어요/었어용')과 동작이 일어나는 장소('~에서')를 표현하는 법을 배웁니다. 영상 속 대화를 통해 한국인들이 주말에 공원에서 자전거를 타거나 도서관에서 한국 소설을 읽는 등 일상적인 여가 활동을 어떻게 공유하는지 엿볼 수 있습니다.</p>
  `,

        "ynPudrUEVD4": `
    <h3>세종 한국어 회화 1 (제9과: 취미와 운동)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video focuses on Korean hobby and sports culture, teaching how to discuss future plans (using '~eul geoyeyo') and frequency adverbs (always, often, sometimes). It helps in understanding the communal aspect of Korean culture, where people build friendships by suggesting activities together, such as 'Let’s go play soccer together.'</p>

    <p><strong>[한글 설명]</strong><br>
    한국인들의 다양한 취미 생활과 미래의 계획을 이야기하는 방법을 다룹니다.<br>
    한국인의 취미와 운동 문화를 다루며, 미래의 계획을 말하는 '~을 거예요'와 빈도 부사(항상, 자주, 가끔)의 사용법을 배웁니다. 한국인들이 '같이 축구 하러 가요'처럼 함께 활동하는 것을 제안하며 친목을 도모하는 공동체적인 면모를 이해하는 데 도움이 됩니다.</p>
  `,

        "Jk-6nlU3e7g": `
    <h3>세종 한국어 회화 1 (제10과: 가족)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video introduces Korea's complex yet interesting family titles and honorific culture. Koreans use different titles like 'Hyeong,' 'Nuna,' 'Oppa,' or 'Eonni' depending on age and gender. They also use honorifics like 'kkeseo' instead of 'ga' and 'haseyo' instead of 'haeyo' to show respect to elders. This will help you understand the family-oriented values and respect for seniors in Korean society.</p>

    <p><strong>[한글 설명]</strong><br>
    한국의 가족 호칭과 웃어른을 공경하는 높임말 문화를 배울 수 있는 영상입니다.<br>
    한국의 복잡하지만 흥미로운 가족 호칭과 높임말 문화를 소개합니다. 한국인들은 나이에 따라 형, 누나, 오빠, 언니처럼 부르는 명칭이 다르며, 어르신께는 '가' 대신 '께서', '해요' 대신 '하세요'와 같은 높임말을 사용하여 예의를 갖춥니다. 이 영상을 통해 한국인의 가족 중심 사고와 경로사상을 이해할 수 있습니다.</p>
  `,

        "KbOBHJ-oDNY": `
    <h3>세종 한국어 회화 1 (제11과: 약속)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video covers useful expressions for making appointments with Korean friends, such as '~eulkkayo?' (making a suggestion) and '~go sipda' (expressing a wish). You can learn how Koreans socialize by going to concerts or movies together and the etiquette of politely asking for someone's opinion. It also offers a glimpse into Korean pop culture, like K-pop concerts.</p>

    <p><strong>[한글 설명]</strong><br>
    한국인들이 친구와 약속을 정하고 의사를 묻는 소통 방식을 보여줍니다.<br>
    한국 친구와 약속을 잡을 때 유용한 표현인 '~을까요?'(제안)와 '~고 싶다'(희망)를 다룹니다. 영상 속 대화를 통해 한국인들이 함께 콘서트를 가거나 영화를 보는 등 친목을 도모하는 방식과 상대방의 의견을 정중하게 묻는 약속 예절을 배울 수 있습니다. 특히 K-팝 콘서트와 같은 한국의 대중문화적 요소도 함께 엿볼 수 있습니다.</p>
  `,

        "_WV4pRD6HPk": `
    <h3>세종 한국어 회화 1 (제12과: 날씨)</h3>

    <p><strong>[English Explanation]</strong><br>
    This video explains the distinct four seasons of Korea and how to use expressions for guessing the weather ('~eul geoyeyo'). Since Korea has four clear seasons, clothing and preparations change accordingly. By listening to conversations about winter cold and snow, you can understand both the Korean climate and the warm sentiment of caring for others.</p>

    <p><strong>[한글 설명]</strong><br>
    한국의 뚜렷한 사계절과 날씨에 따른 일상의 변화를 설명합니다.<br>
    한국의 사계절 특성과 날씨 추측 표현('~을 거예요')을 배웁니다. 한국은 사계절이 뚜렷하여 계절마다 옷차림이나 준비물이 달라집니다. 특히 겨울의 추위와 눈에 대해 이야기하며 서로를 챙겨주는 대화를 통해, 한국의 기후와 더불어 타인을 배려하는 한국인의 정서도 느낄 수 있습니다.</p>
  `
    };

    const videosByCategory = {
        food: [
            "https://www.youtube.com/watch?v=zPuLGkluoTY",
            "https://www.youtube.com/watch?v=nxrgOqNzBcg&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=1",
            "https://www.youtube.com/watch?v=VgFA7K-4kn4&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=2",
            "https://www.youtube.com/watch?v=DlYfPtPcvaE&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=3",
            "https://www.youtube.com/watch?v=Ei0gSKJza4k&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=4",
            "https://www.youtube.com/watch?v=8jbKNVCaTjw&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=5",
            "https://www.youtube.com/watch?v=oaeEIzS1Gms&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=6",
            "https://www.youtube.com/watch?v=AZxZIUQHx5Q&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=7",
            "https://www.youtube.com/watch?v=QzDZGR5KuHs&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=8",
            "https://www.youtube.com/watch?v=m3npKv7tjIs&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=9",
            "https://www.youtube.com/watch?v=xnI1QBVKJEI&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=10",
            "https://www.youtube.com/watch?v=o0yDvUbfVzs&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=14",
            "https://www.youtube.com/watch?v=HICNKK-nEKc&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=15",
            "https://www.youtube.com/watch?v=P5zouxkguEM&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=16",
            "https://www.youtube.com/watch?v=JdZ77-3Z4VI&list=TLGG4ZjJwT13LIoyOTEyMjAyNQ&index=18",
            "https://www.youtube.com/watch?v=-k_1rRdtI2U",
            "https://www.youtube.com/watch?v=YV4Z94DvWdA"
        ].map((url, i) => {
            const id = extractVideoId(url);
            return {
                title: `Korea Food #${i + 1}`,
                url,
                description: (id && koreaFoodDescMap[id]) ? koreaFoodDescMap[id] : ""
            };
        }),

        kpop: [
            "https://www.youtube.com/watch?v=tOAB3uH3KQQ",
            "https://www.youtube.com/watch?v=WpW2MlGOgfU",
            "https://www.youtube.com/watch?v=Z1oeUV45EsA",
            "https://www.youtube.com/watch?v=prNrCKE_Chk",
            "https://www.youtube.com/watch?v=qPoTrGxOOEA",
            "https://www.youtube.com/watch?v=7pou55AvSTM&t=4388s",
            "https://www.youtube.com/watch?v=fwdr13TLT5Y",
            "https://www.youtube.com/watch?v=FQZhehVRSXQ",
            "https://www.youtube.com/watch?v=_xOnGP_Js1A",
            "https://www.youtube.com/watch?v=Ccck76OtemU",
            "https://www.youtube.com/watch?v=yebNIHKAC4A",
            "https://www.youtube.com/watch?v=rybqfwGzuVg",
            "https://www.youtube.com/watch?v=xMJ45IzhSzg"
        ].map((url, i) => {
            const id = extractVideoId(url);
            return {
                    title: `Kpop #${i + 1}`,
                    url,
                    description: (id && kpopDescMap[id]) ? kpopDescMap[id] : ""
            };
        }),

        travel: [
            "https://www.youtube.com/watch?v=pYzX7cqK_JQ",
            "https://www.youtube.com/watch?v=CcCjvSZQ-Xc",
            "https://www.youtube.com/watch?v=lVPCJYWamJE",
            "https://www.youtube.com/watch?v=oqWDJoE43Fg",
            "https://www.youtube.com/watch?v=SlaFtUE6sqI",
            "https://www.youtube.com/watch?v=xYALZ9KejoY",
            "https://www.youtube.com/watch?v=iV6Cx5QPxQM",
            "https://www.youtube.com/watch?v=h6aJ8ds0g9A",
            "https://www.youtube.com/watch?v=87aWGz-A3_c",
            "https://www.youtube.com/watch?v=01E06alp6N4"
        ].map((url, i) => {
            const id = extractVideoId(url);
            return {
                title: `Travel Spot #${i + 1}`,
                url,
                description: (id && travelSpotDescMap[id]) ? travelSpotDescMap[id] : ""
            };
        }),

        makeup: [
            "https://www.youtube.com/watch?v=sZY68nPL35s",
            "https://www.youtube.com/watch?v=5aq0xcMi9kI",
            "https://www.youtube.com/watch?v=qXl7wH3fA5Y",
            "https://www.youtube.com/watch?v=ucgxYYi9Ju4",
            "https://www.youtube.com/watch?v=BVbKS6fJQOU",
            "https://www.youtube.com/watch?v=KIWxML762no",
            "https://www.youtube.com/watch?v=BJOEa0LjLYw&t=86s",
            "https://www.youtube.com/watch?v=NVd2zHX5W-I",
            "https://www.youtube.com/watch?v=WGH3X-mMC0I",
            "https://www.youtube.com/watch?v=D5kG1va7MyI",
            "https://www.youtube.com/watch?v=JXRzntMvgm0"
        ].map((url, i) => {
            const id = extractVideoId(url);
            return {
                title: `Korea Makeup #${i + 1}`,
                url,
                description: (id && makeupDescMap[id]) ? makeupDescMap[id] : ""
            };
        }),

        conversation: [
            "https://www.youtube.com/watch?v=dM1dWUQm3uE&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC",
            "https://www.youtube.com/watch?v=bQF4umz6YCE&t=35s",
            "https://www.youtube.com/watch?v=yNJs_o69RHM&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC&index=3",
            "https://www.youtube.com/watch?v=_7d_wAQfB3A&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC&index=4",
            "https://www.youtube.com/watch?v=opf0kP-F8Sw&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC&index=5",
            "https://www.youtube.com/watch?v=VnWLxtyyjEE&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC&index=6",
            "https://www.youtube.com/watch?v=qb6NRKeGcyg&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC&index=7",
            "https://www.youtube.com/watch?v=1C3kiySLOIA&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC&index=8",
            "https://www.youtube.com/watch?v=ynPudrUEVD4&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC&index=9",
            "https://www.youtube.com/watch?v=Jk-6nlU3e7g&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC&index=10",
            "https://www.youtube.com/watch?v=KbOBHJ-oDNY&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC&index=11",
            "https://www.youtube.com/watch?v=_WV4pRD6HPk&list=PLInPGbDZkjSRJ2GN7Ba481NdJGifY_lvC&index=12"
        ].map((url, i) => {
            const id = extractVideoId(url);
            return {
                title: `Korea Conversation #${i + 1}`,
                url,
                description: (id && conversationDescMap[id]) ? conversationDescMap[id] : ""
            };
        })
    };

    /* ================================
       [ADD] mainContent DOM 캐시
       - 클릭해도 초기 구조(video-frame 등) 유지
    ================================ */
    const cache = {
        iframe: null,
        titleEl: null,
        descEl: null,
        toggleBtn: null,
        detailEl: null
    };

    function ensureMediaNodes() {
        if (cache.iframe && cache.titleEl && cache.descEl && cache.toggleBtn && cache.detailEl) return true;

        const main = document.getElementById("mainContent");
        if (!main) return false;

        // id가 있으면 id 우선, 없으면 기존 구조도 호환
        cache.iframe =
            document.getElementById("mainVideo") ||
            main.querySelector(".video-frame iframe") ||
            main.querySelector("iframe");

        cache.titleEl =
            document.getElementById("videoTitle") ||
            main.querySelector(".info h2");

        cache.descEl =
            document.getElementById("videoDesc") ||
            main.querySelector(".info p");

        cache.toggleBtn = document.getElementById("toggleButton") || main.querySelector("#toggleButton");
        cache.detailEl = document.getElementById("contentToToggle") || main.querySelector("#contentToToggle");

        return !!(cache.iframe && cache.titleEl && cache.descEl && cache.toggleBtn && cache.detailEl);
    }

    // 3. Play Video Function (수정: innerHTML 제거, 값만 업데이트)
    window.playVideo = function (url, title, description) {
        const embedUrl = convertToEmbed(url);

        if (!ensureMediaNodes()) return;

        cache.iframe.src = embedUrl;
        cache.titleEl.textContent = title;
        cache.descEl.textContent = "선택한 영상";

        cache.detailEl.innerHTML = description || "";
        cache.detailEl.classList.add("hidden");
        cache.toggleBtn.textContent = "자세히 보기 ▼";

        setupDetailToggle();
    };

    // 4. Toggle Details (안전하게 onclick 설정)
    function setupDetailToggle() {
        if (!ensureMediaNodes()) return;

        cache.toggleBtn.onclick = () => {
            cache.detailEl.classList.toggle("hidden");
            cache.toggleBtn.textContent = cache.detailEl.classList.contains("hidden")
                ? "자세히 보기 ▼"
                : "숨기기 ▲";
        };
    }

    // 5. Load List
    function loadCategory(key) {
        const container = document.getElementById("relatedList");
        if (!container) return;
        container.innerHTML = "";

        // (기존 로직 유지용: 필요하면 나중에 culture 데이터를 다시 붙이면 됨)
    }

    // 6. Drag Scroll
    function enableDragScroll(containerId) {
        const slider = document.getElementById(containerId);
        if (!slider) return;

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        slider.addEventListener("mousedown", (e) => {
            isDown = true;
            slider.style.cursor = "grabbing";
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener("mouseleave", () => {
            isDown = false;
            slider.style.cursor = "grab";
        });

        slider.addEventListener("mouseup", () => {
            isDown = false;
            slider.style.cursor = "grab";
        });

        slider.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    // Initialize Media
    if (document.getElementById("relatedList")) {
        loadCategory("culture");
        enableDragScroll("relatedList");
        setupDetailToggle(); // 초기 화면 토글도 정상
    }

    function openPlaylist() {
        const listEl = document.getElementById("categoryVideoList");
        const toggle = document.getElementById("playlistToggle");
        if (listEl) listEl.classList.remove("is-collapsed");
        if (toggle) {
            toggle.setAttribute("aria-expanded", "true");
            toggle.textContent = "▼";
        }
    }

    function scheduleAutoClosePlaylist() {
        // 이전 타이머가 있으면 취소 (연속 클릭 대비)
        if (playlistAutoCloseTimer) {
            clearTimeout(playlistAutoCloseTimer);
            playlistAutoCloseTimer = null;
        }

        // 3초 후 자동 닫기
        playlistAutoCloseTimer = setTimeout(() => {
            collapsePlaylist();
            playlistAutoCloseTimer = null;
        }, 3000);
    }

    function collapsePlaylist() {
        const listEl = document.getElementById("categoryVideoList");
        const toggle = document.getElementById("playlistToggle");
        if (listEl) listEl.classList.add("is-collapsed");
        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
            toggle.textContent = "▶";
        }
    }

    const toggleBtn = document.getElementById("playlistToggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const listEl = document.getElementById("categoryVideoList");
            if (!listEl) return;

            const isCollapsed = listEl.classList.contains("is-collapsed");
            if (isCollapsed) openPlaylist();
            else collapsePlaylist();
        });
    }

    // ✅ 왼쪽 카테고리 버튼 클릭 이벤트
    const catButtons = document.querySelectorAll("#media .cat-item");
    catButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            catButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // ✅ 카테고리 바꿀 때마다 재생목록을 자동으로 "열기"
            openPlaylist();

            // ✅ (선택) 열리고 3초 뒤 자동으로 닫히게 유지하고 싶으면 켜기
            // scheduleAutoClosePlaylist();

            const key = btn.dataset.cat;
            const list = videosByCategory[key] || [];
            renderVerticalList(key, list);
        });
    });

    // ✅ 기본: Travel Spot 자동 로드 (첫 영상 = pYzX7cqK_JQ)
    const defaultBtn = document.querySelector('#media .cat-item[data-cat="travel"]');
    if (defaultBtn) {
        const key = defaultBtn.dataset.cat;

        catButtons.forEach(b => b.classList.remove("active"));
        defaultBtn.classList.add("active");

        renderVerticalList(key, videosByCategory[key] || []);
        collapsePlaylist(); // ✅ 첫 로드는 접힌 상태
    }
}

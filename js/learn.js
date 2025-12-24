/* learn.js - Merged Logic for Media & Mini Games */

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
    // 1. Convert URL to Embed
    function convertToEmbed(url) {
        if (url.includes("embed")) return url;
        if (url.includes("shorts")) {
            const id = url.split("/shorts/")[1].split("?")[0];
            return "https://www.youtube.com/embed/" + id;
        }
        if (url.includes("watch?v=")) {
            const id = url.split("watch?v=")[1].split("&")[0];
            return "https://www.youtube.com/embed/" + id;
        }
        return url;
    }

    /* =========================================================
   2. 영상 데이터
========================================================= */
    const videos = {
        culture: [
            {
                title: "외국인이 한국에 와서 가장 놀란다는 9가지",
                url: "https://www.youtube.com/embed/v-RnT9-pcRs",
                description: `
                <p>외국인이 한국에서 놀란다는 9가지 특징</p>
                <p>1.공중 화장실의 청결도 및 무료 이용:많은 나라와 달리 공중 화장실이 무료이며 [00:29], 공원, 지하철역 등 거의 모든 곳에서 깔끔하게 관리되고 휴지, 비누 등이 기본적으로 갖춰져 있음 [00:40]</p>
                <p>2.믿을 수 없을 만큼 빠른 음식 서비스:식당에 들어가 주문하면 5분 안에 음식이 나오는 경우가 많고 [00:59], 벨을 눌러 직원을 호출하는 시스템이 편리함 [01:17]</p>
                <p>3.귀중품을 두고 자리를 비워도 되는 높은 치안:카페나 도서관에서 노트북, 핸드폰 등 귀중품을 자리에 두고 자리를 비워도 도난 걱정이 거의 없어 [01:47] 외국인들에게 충격적으로 다가옴 [01:37]</p>
                <p>4.잘 되어 있는 지하철 시스템:노선도가 색깔별로 보기 쉽고, 한글 외 다국어 안내 시스템이 제공되며 [02:18], 환승이 간편하고 배차 간격이 짧음 [02:28]</p>
                <p>5.도심에서도 쉽게 즐길 수 있는 자연 (등산):서울 같은 대도시에서 지하철로 20~30분만 이동하면 등산로 입구에 도착하는 것이 신기하며 [02:48], 등산로 정비가 잘 되어 있어 초보자도 오르기 쉬움 [02:59]</p>
                <p>6.새벽에도 움직이는 도시의 속도감:새벽 시간에도 시장 상인이나 배달 기사들이 바쁘게 움직이고, 편의점은 24시간, 카페도 아침 일찍부터 문을 여는 등 생활 속도감이 압도적임 [03:28]</p>
                <p>7.편의점 하나로 해결되는 생활 편의:음식, 생필품은 물론 택배, 휴대폰 충전, ATM, 공공요금 납부까지 가능하여 작은 생활센터 수준임 [04:01]. 편의점 음식의 품질도 높음 [04:14]</p>
                <p>8.다양하고 평균 퀄리티가 높은 음식 종류:한식 외 양식, 중식, 일식 등 선택지가 다양하고 [04:34], 작은 식당이나 배달 음식조차도 맛의 기본 수준이 높음 [04:44]</p>
                <p>9.빠르고 저렴한 의료 시스템:병원 대기 시간이 짧고 진료부터 처방까지 한자리에서 가능하며 [05:06], 건강보험 적용 시 병원비가 매우 저렴함 [05:06]</p>
            `
            },
            {
                title: "외국과 다른 한국집만의 독특한 문화",
                url: "https://www.youtube.com/watch?v=Y0abWIClAO8",
                description: `
            <p>한국 주거 문화의 특징을 설명하는 영상입니다.</p>
            <p>1.바닥 문화(Floor Culture)온돌과 장판: 한국은 수천 년 역사의 온돌 문화를 자랑하며 [00:37], 바닥에 이불을 깔고 잠을 자거나 밥상을 펴 식사하는 경우가 많습니다. 또한, 서양처럼 카펫 대신 장판이 깔려 있어 [00:55] 외국인들에게는 신기한 모습입니다.실내 신발 금지:집안에 들어갈 때 신발을 벗는 것이 외국인에게는 가장 놀라운 모습 중 하나인데 [01:27], 외국에서는 집안에서도 편하게 신발을 신는 경우가 흔하기 때문입니다. 외국인들은 한국의 신발 문화가 훨씬 깨끗하고 위생적이라고 평가하기도 합니다 [01:57].</p>
            <p>2.환한 형광등 조명:백색 형광등: 한국 가정집에서 흔히 볼 수 있는 환한 백색 형광등 조명에 외국인들이 깜짝 놀랍니다 [02:10].서양과의 차이: 미국이나 유럽은 따뜻한 느낌을 주는 노란빛의 간접 조명을 사용하며 [02:21], 침실 등에는 작은 스탠드 조명을 사용하는 경우가 많아 [02:35] 한국의 환한 조명을 부자연스럽게 느낍니다 [02:59].</p>
            <p>3.분리되지 않은 욕실과 화장실(습식 문화): 일체형 구조: 한국 가정집은 보통 욕실과 화장실이 같은 공간에 배치된 일체형 구조입니다 (습식) [03:23].외국과의 차이: 서양권에서는 욕실과 화장실이 분리되어 있고, 바닥에 물 빠지는 구멍이 없는 건식인 경우가 흔합니다 [03:33]. 외국인들은 다른 사람이 욕실을 쓰는 동안 화장실을 쓸 수 없는 점이나, 샤워할 때 물이 사방으로 튀는 것에 충격을 받습니다 [04:21].</p>
            <p>4.빨래를 널어 말리는 문화: 건조대 사용: 한국에서는 빨래를 빨래집게나 건조대에 널어 말리는 것이 일반적입니다 [04:56].서양과의 차이: 미국이나 유럽에서는 세탁기 옆에 건조기(Dryer)가 기본적으로 설치되어 있어 [05:27], 빨래를 직접 널어 말리는 한국의 방식이 새로운 문화로 느껴집니다 [05:10]. 다만, 자연 건조 방식이 옷이 상하지 않아 좋다는 반응도 있습니다 [05:52].</p>
            <p>5.딱딱한 침대 사용: 단단한 매트리스:서양권의 푹신하고 출렁거리는 매트리스와 달리 [06:17], 한국에서는 비교적 단단한 매트리스를 사용하는 편입니다 [06:26].돌침대 충격: 특히 돌침대는 온돌 문화를 침대에 접목한 방식으로 [06:41], 외국인들은 이렇게 딱딱한 곳에서 어떻게 자냐며 경악하기도 합니다 [07:00].</p>
            <p>6.전기장판 생활화: 따뜻함:한국에서는 전기장판을 기본적으로 1개 이상 가지고 있어 [07:12], 뜨끈뜨끈한 온돌방과 비슷한 느낌을 낼 수 있습니다 [07:23].외국과의 차이: 외국에서는 히터나 벽난로를 주로 사용하며, 특히 뜨거운 물을 넣는 하포트(Hot water bottle)를 이불 속에 넣어 자는 경우가 흔합니다 [07:40]. 전기세가 비싼 나라에서는 하포트를 더 선호하기도 합니다 [08:02].</p>
            <p>7.거실에 걸린 결혼사진: 커다란 결혼 사진: 한국 신혼집에서는 거실에 커다란 결혼 사진을 거는 것이 흔한 모습입니다 [08:21].일본인의 충격: 외국인 중 특히 일본 사람들은 이를 보고 한국인에게 '과시 문화'가 있다는 생각을 한다고 합니다. 지나친 겸손을 미덕으로 여기는 일본 문화에서는 거실에 결혼 사진을 거는 것 자체가 과시로 여겨지기 때문입니다 [08:33].</p>
            <p>8.전세 문화: 한국만의 시스템: 집주인에게 보증금을 맡기고 월 추가 비용 없이 집을 빌려 쓰는 전세는 한국에서만 볼 수 있는 독특한 문화입니다 [09:01].외국인의 반응: 월세(Rent)나 플랫(Flat, 방 공유) 문화가 주류인 외국인들은, "월세 없이 공짜로 살다가 나갈 때 돈을 돌려받는" 이 시스템에 대해 상당히 큰 충격과 궁금증을 느낀다고 합니다 [09:32].</p>
            `
            },
            {
                title: "한국은 안 훔쳐가",
                url: "https://www.youtube.com/watch?v=5rjiSkFuKOI",
                description: `
            <p>상황1) 카페에서 자리를 비울때 노트북등 고가의 짐을 두고가는 상황</p>
            <p>이 행동은 “아무 생각 없는 위험한 행동”이 아니라, 이 자리는 누군가 사용 중이라는 신호이자 한국 사회의 비교적 높은 공공 신뢰도를 전제로 한 행동입니다. 다른 사람이 해당 물건을 만지는 것은 매우 무례하게 여겨지며, 도난이 발생할 경우 주변 사람들도 적극적으로 도와주는 문화가 있습니다. 카페에서 노트북을 두는 행동 = 신뢰 + 자리 표시</p>

            <p>상황2) 택배온거 현관문앞에 두는 상황</p>
            <p>수취인이 집에 없어도 “문 앞에 두세요”라는 요청은 일반적이며, 이 역시 도난 위험이 상대적으로 낮다는 사회적 인식 위에서 운영됩니다. 대부분의 아파트·주택에는 CCTV가 설치되어 있습니다. 고가 물품이나 중요한 서류는 별도 보안 배송을 이용하기도 합니다. 현관 앞 택배 = 편리함 + 공동체 신뢰</p>

            `

            },
            {

                title: "의외로 모르는 사람들이 많은 한국 식예절!?!!?",
                url: "https://www.youtube.com/shorts/swY3cU18NmY",
                description: `
            <p>상황1) 윗사람이 상석에 앉고 먼저 숟가락을 들어야 아랫사람도 식사를 시작하는 상황</p>
            <p>한국의 식사 자리에서는 보통 연장자나 직급이 높은 사람이 상석(가장 안쪽이나 편한 자리)에 앉고, 그 사람이 먼저 숟가락을 들어야 다른 사람들도 식사를 시작하는 것이 예의로 여겨집니다. 특히 가족 모임, 회사 회식, 공식적인 초대 자리에서 자주 나타납니다. 일상적인 친구 식사에서는 자연스럽게 무시되기도 합니다. 하지만 어른이 함께 있는 자리에서 먼저 먹기 시작하면 “성급하다”거나 “예의가 없다”는 인상을 줄 수 있습니다.</p>
            `
            },


            {
                title: "한국의 술자리 예절 문화에 놀라는 외국인들",
                url: "https://www.youtube.com/shorts/oHIhc7neraQ",
                description: `
            <p>상황1)윗사람이 술따를때 양손으로 받고 양손으로 따라주는 상황</p>
            <p>한국 술자리에서 가장 잘 알려진 예절 중 하나는 술을 받을 때도, 따라줄 때도 두 손을 사용하는 것입니다. 한 손으로 받을 경우 건방하거나 무성의하다고 보일 수 있습니다. 친해질수록 이런 형식은 점점 느슨해집니다. 두 손을 쓰는 행동은 복잡한 규칙이 아니라 존중의 제스처입니다.</p>

            <p>상황2) 짠할때 아랫쪽에서 짠하고 돌아서 마시는 상황</p>
            <p>한국 음주 문화에서는 아랫사람이 잔을 윗사람보다 낮게 들어 ‘짠’ 하고 술을 마실 때 고개를 살짝 돌리는 행동을 자주 볼 수 있습니다. 이 행동은 “나보다 위다”라는 위계 인식의 표현이 아니라, 상대방에게 직접적으로 보이지 않는 방식으로 예의를 지키는 문화적 제스처입니다.</p>
            `
            },



            {

                title: "한국에만 있는 특별한 문화",
                url: "https://www.youtube.com/shorts/17B8pw2uX_4",
                description: `
            <p>상황1) 식탁위에서 음식을 가위로 자르는 문화 (삼겹살등)</p>
            <p>한국에서는 고기, 김치, 반찬 등을 식탁 위에서 가위로 직접 자르는 장면이 매우 흔합니다. 이것은 비위생적이거나 무례한 행동이 아니라, 공동 식사에서 가장 빠르고 효율적인 방식으로 자리 잡은 문화입니다. 특히 삼겹살처럼 불판 위에서 바로 익혀 먹는 음식에서는 가위가 칼보다 훨씬 실용적입니다. 서양에서는 주방에서 음식을 자르는 것이 일반적이어서 낯설게 느껴질 수 있습니다. 한국에서는 “함께 나눠 먹기”를 전제로 한 도구입니다. </p>
            `

            },
            {

                title: "외국인이 한국에서 생긴 밥 사주는 습관",
                url: "https://www.youtube.com/shorts/TsO3uERgbLQ",
                description: `
            <p>국가별 결제 문화 비교: 일본은 자기가 먹은 것을 각자 계산하는 '더치페이' 문화가 일반적이며, 이는 유럽의 문화와도 비슷하다고 언급합니다.   [00:05]</p>
            <p>한국에서의 변화:   한국에 거주하면서 친구들에게 기꺼이 밥을 사는 문화가 생겼습니다. 특히 오랜만에 만난 친구에게 "내가 쏠게!"라고 말하는 습관이 생겼다고 합니다. [00:13]</p>
            <p>한국식 '정'의 문화: 여유가 될 때 친구에게 밥을 사주는 것 자체는 긍정적이고 기분 좋은 문화라고 생각합니다. [00:19]</p>
            <p>문화적 부담감: 하지만 경제적으로 여유가 없을 때는 이 문화가 부담으로 다가오기도 합니다. 친구의 생일에 밥을 사주고 싶은데 돈이 없을 때, 만나는 것 자체가 실례처럼 느껴지거나 미안한 마음이 드는 고충을 토로합니다. [00:25]</p>
            `
            },
            {

                title: "여름에도 뜨거운 국물을 먹어? 한국의 이열치열 문화가 신기한 외국인들",
                url: "https://www.youtube.com/shorts/LZAfLi6svWM",
                description: `
            <p>한국의 국물 문화: 한국은 겨울이 매우 추워 따뜻한 국물 요리가 발달했지만, 여름에도 뜨거운 국물을 즐기는 모습이 외국인들에게는 매우 인상적입니다.   [00:00]</p>
            <p>그리스와의 차이: 그리스에서는 보통 겨울에만 수프(국물 요리)를 먹고 여름에는 차가운 음식을 선호합니다. 반면 한국은 여름에도 뜨거운 국물 요리를 필수적으로 즐긴다는 점이 그리스 문화와 정반대라고 느낍니다. [00:14]</p>
            <p>이열치열(以熱治熱): '열은 열로써 다스린다'는 한국의 이열치열 정신이 소개됩니다. 한여름에도 팔팔 끓는 뚝배기 요리를 먹으며 더위를 이겨내는 한국인의 식습관을 조명합니다.   [00:11, 00:31]</p>
            <p>사계절 국물 요리: 한국에서는 여름이든 겨울이든 국물 요리가 늘 선택지에 있으며, 친구들은 이러한 한국의 식문화가 매우 신기하면서도 흥미롭다는 반응을 보입니다.   [00:20, 00:41]</p>
             `
            },

            {
                title: "한국에선 게임하고 있으면 음식을 가져다준대...외국인들의 첫 한국 PC방 방문기 모음! ",
                url: "https://www.youtube.com/watch?v=UqYDf3HRb_4",
                description: `
            <p>1. PC방의 압도적인 시설과 문화</p>
            <p>최첨단 장비: 외국인들은 PC방의 고성능 컴퓨터, 게이밍 마우스, 편안한 의자 등에 크게 놀랍니다.</p>
            <p>문화적 차이: 스웨덴 친구들은 고향(팔룬)에는 이런 장소가 없다며, 스웨덴에서는 보통 집에서 친구들과 모여 게임을 하는 'LAN 파티' 문화가 일반적이라고 설명합니다.</p>
            <p>e스포츠의 위상: 한국이 e스포츠의 성지임을 언급하며, '페이커(Faker)'를 즐라탄 이브라히모비치에 비유할 정도로 대단한 존재(Gud)로 여기는 모습도 나옵니다.</p>

            <p>2. 게임에 몰입하는 모습</p>
            <p>다양한 게임 시도: 친구들은 배틀그라운드(PUBG), 오버워치, 리그 오브 레전드(LoL), 카운터 스트라이크 등 다양한 게임을 즐깁니다.</p>
            <p>승부욕: 게임이 시작되자 키보드와 마우스 소리만 들릴 정도로 진지하게 몰입하며, 팀워크를 발휘하거나 서로 장난을 치며 즐거워합니다.</p>
            <p>온라인 친구와의 만남: 평소 온라인으로만 함께 게임을 하던 한국인 친구와 웨일즈 친구들이 실제로 PC방에서 만나 나란히 앉아 게임을 하는 감동적인 장면도 포함되어 있습니다.</p>

            <p>3. PC방 음식 서비스: "앉아서 주문하면 음식이 온다"</p>
            <p>혁신적인 시스템: 자리에서 일어나지 않고 마우스 클릭 몇 번으로 음식을 주문할 수 있다는 사실에 매우 신기해합니다.</p>
            <p>다양한 메뉴: 망고 주스, 딸기 주스 같은 음료부터 라면, 소시지 등 식사류까지 서빙되는 모습에 "신세계"라며 감탄합니다.</p>
            <p>맛과 편의성: 게임을 하면서 맛있는 음식을 먹을 수 있는 한국 PC방 특유의 편의성에 대해 "최고의 경험"이라고 평가합니다.</p>
             `
            },
            {

                title: "'엉뜨' 의자, 주방 가위, 김치냉장고...외국인들이 놀란 한국 문화 모음! ",
                url: "https://www.youtube.com/watch?v=LwdCoyku0uo",
                description: `
            <p>버스정류장 온열 의자: 겨울철 버스정류장의 발열 의자(엉뜨 의자)를 보고 "대박이다", "정말 좋다"며 감탄합니다. 센서가 작동해 일정 온도 이하에서 자동으로 따뜻해지는 기술에 놀라워합니다.   [00:35]</p>
            <p>주방 가위 활용: 식재료(떡, 고기 등)를 가위로 자르는 모습을 보고 처음에는 당황하지만, 직접 해본 뒤 "칼보다 훨씬 편하고 깔끔하다"며 주방의 '게임 체인저'라고 극찬합니다.   [03:56]</p>
            <p>'서비스' 문화: 식당에서 주문하지 않은 메뉴가 '서비스'로 나오는 것에 큰 감동을 받습니다. 이는 한국의 정을 느끼게 하며 환영받는 기분을 들게 한다고 말합니다.   [07:31]</p>
            <p>빠른 안경 제작: 핀란드에서는 안경을 맞추는 데 며칠에서 몇 주가 걸리기도 하지만, 한국에서는 15~20분 만에 시력 검사부터 제작까지 완료되는 속도와 디테일에 경악합니다.   [11:45]</p>
            <p>정직한 시민 의식: 택시에 두고 내린 휴대폰을 기사님이 안전하게 보관했다가 돌려주시는 경험을 통해 한국의 안전함과 정직함에 안도하며 깊은 감사를 표합니다.   [16:47]</p>
            <p>푸짐한 음식 코스: 끝없이 나오는 한국의 코스 요리(육해공 VIP 코스 등)에 배가 불러 망연자실하면서도, 음식을 남기지 않으려 노력하며 한국 음식의 다양성과 양에 놀랍니다.   [19:28]</p>
            <p>김치냉장고 & 김치 종류: 마트에서 엄청난 크기의 김치냉장고를 보고 놀라며, 포기김치, 백김치, 총각김치, 파김치 등 수많은 김치의 종류와 그 차이점에 대해 흥미로워합니다.[24:38]</p>
             `
            },
        ],
    };

    // 3. Play Video Function
    window.playVideo = function (url, title, description) {
        const main = document.getElementById("mainContent");
        main.innerHTML = `
            <iframe src="${url}" allowfullscreen></iframe>
            <div class="info">
                <h2>${title}</h2>
                <p>선택한 영상</p>
            </div>
            <button id="toggleButton">자세히 보기 ▼</button>
            <div id="contentToToggle" class="hidden">
                ${description}
            </div>
        `;
        setupDetailToggle();
    };

    // 4. Toggle Details
    function setupDetailToggle() {
        const toggleButton = document.getElementById("toggleButton");
        const content = document.getElementById("contentToToggle");
        if (!toggleButton || !content) return;

        toggleButton.onclick = () => {
            content.classList.toggle("hidden");
            toggleButton.textContent = content.classList.contains("hidden")
                ? "자세히 보기 ▼"
                : "숨기기 ▲";
        };
    }

    // 5. Load List
    function loadCategory(key) {
        const container = document.getElementById("relatedList");
        if (!container) return;
        container.innerHTML = "";

        videos[key].forEach(video => {
            const embed = convertToEmbed(video.url);
            const id = embed.split("/embed/")[1];
            const thumb = id
                ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                : "";

            const item = document.createElement("div");
            item.className = "h-item";
            item.innerHTML = `
                <div class="h-thumb" style="background-image:url('${thumb}')"></div>
                <div class="h-title">${video.title}</div>
            `;
            item.addEventListener("click", () => {
                window.playVideo(embed, video.title, video.description);
            });
            container.appendChild(item);
        });
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
        setupDetailToggle(); // For initial static content if any
    }
}

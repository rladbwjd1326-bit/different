/* mock_data.js - Shared Data for Koreanize V2 */

// 1. Local Travel Spots Data (Used in Local & MyPage Bookmarks)
const MOCK_TRAVEL_SPOTS = [
    { id: 1, name: "경주 성동시장", location: "경상북도 경주시", tags: ["경상", "시장", "먹거리"], image: "../images/travel/경주_성동시장_1_공공1유형.jpg", description: "경주를 대표하는 전통시장으로 다양한 먹거리가 가득합니다." },
    { id: 2, name: "강릉 중앙시장", location: "강원도 강릉시", tags: ["강원", "시장", "해산물"], image: "../images/travel/강릉_중앙시장_1_공공3유형.jpg", description: "동해안의 싱싱한 해산물과 닭강정이 유명한 시장입니다." },
    { id: 3, name: "부산 자갈치시장", location: "부산광역시 중구", tags: ["부산", "시장", "회"], image: "../images/travel/부산_자유도매시장_1_공공1유형.jpg", description: "한국 최대의 수산물 시장으로 활기 넘치는 부산을 느낄 수 있습니다." },
    { id: 4, name: "제주 동문시장", location: "제주특별자치도 제주시", tags: ["제주", "시장", "감귤"], image: "../images/travel/제주_중앙지하상가_1_공공3유형.jpg", description: "제주 공항 근처에 위치하여 여행 선물 사기에 좋습니다." },
    { id: 5, name: "전주 한옥마을", location: "전북 전주시", tags: ["전라", "문화", "한옥"], image: "../images/travel/전나무식당_1_공공3유형.jpg", description: "아름다운 한옥과 맛있는 길거리 음식이 있는 곳." },
    { id: 6, name: "서울 광장시장", location: "서울특별시 종로구", tags: ["서울", "시장", "육회"], image: "../images/travel/서울_약령시장_1_공공1유형.jpg", description: "빈대떡과 육회 등 다양한 한국 음식을 맛볼 수 있는 명소." },
    { id: 7, name: "안동 하회마을", location: "경북 안동시", tags: ["경상", "문화", "탈춤"], image: "../images/travel/안의갈비탕_1_공공3유형.JPG", description: "유네스코 세계문화유산으로 지정된 전통 마을." },
    { id: 8, name: "여수 낭만포차", location: "전남 여수시", tags: ["전라", "야경", "바다"], image: "../images/travel/여수수산시장_1_공공3유형.jpg", description: "여수 밤바다를 보며 즐기는 낭만적인 포장마차 거리에." },
    { id: 9, name: "대구 서문시장", location: "대구광역시 중구", tags: ["대구", "시장", "납작만두"], image: "../images/travel/대구_서문시장_&_서문시장_야시장_1_공공3유형.jpg", description: "낮에는 쇼핑, 밤에는 야시장으로 변신하는 대구의 핫플레이스." },
    { id: 10, name: "속초 관광수산시장", location: "강원도 속초시", tags: ["강원", "시장", "닭강정"], image: "../images/travel/속초관광수산시장_1_공공1유형.jpg", description: "속초 여행의 필수 코스, 다양한 먹거리가 기다립니다." },
    { id: 11, name: "남이섬", location: "강원도 춘천시", tags: ["강원", "자연", "휴식"], image: "../images/travel/남이섬밥플렉스_1_공공3유형.jpg", description: "아름다운 숲길을 걸으며 힐링할 수 있는 섬." },
    { id: 12, name: "해운대 전통시장", location: "부산광역시 해운대구", tags: ["부산", "시장", "꼼장어"], image: "../images/travel/해운대시장_1_공공3유형.JPG", description: "해운대 바다 근처에서 즐기는 싱싱한 해산물." }
];

// 2. K-Lingo Slang Data
const MOCK_SLANG_LIST = [
  { id: 1, term: "JMT (Jon-mat-taeng)", meaning: "Extremely delicious" },
  { id: 2, term: "헐 (Heol)", meaning: "An exclamation of surprise or shock" },
  { id: 3, term: "ㄱㅊ (Geon-chan-a)", meaning: "Short for 'It's okay'" },
  { id: 4, term: "ㅇㅋ (OK)", meaning: "Okay" },
  { id: 5, term: "ㄷㄷ (Deol-deol)", meaning: "Expresses fear or amazement" },
  { id: 6, term: "ㅋㅋ (Kekeke)", meaning: "Laughing expression" },
  { id: 7, term: "ㅊㅊ (Choo-choo)", meaning: "Recommendation" },
  { id: 8, term: "ㅁㅊ (Mi-cheot-da)", meaning: "Crazy; extremely good or shocking" },
  { id: 9, term: "ㅅㅂ (Si-bal)", meaning: "Strong swear word expressing anger or frustration" },
  { id: 10, term: "ㄹㅇ (Real)", meaning: "For real; seriously" },
  { id: 11, term: "ㅇㅈ (In-jeong)", meaning: "Acknowledgement or agreement" },
  { id: 12, term: "ㅂㅂ (Bye-bye)", meaning: "Goodbye" },
  { id: 13, term: "ㄱㄱ (Go-go)", meaning: "Let's go" },
  { id: 14, term: "ㄴㄴ (No-no)", meaning: "No" },
  { id: 15, term: "ㅎㅇ (Hi)", meaning: "Hi; hello" },
  { id: 16, term: "TMI", meaning: "Too Much Information" },
  { id: 17, term: "OOTD", meaning: "Outfit Of The Day" },
  { id: 18, term: "MBTI", meaning: "Personality type indicator" },
  { id: 19, term: "썸 (Sseom)", meaning: "An ambiguous pre-dating relationship" },
  { id: 20, term: "스불재 (Seu-bul-jae)", meaning: "A problem caused by one's own actions" },
  { id: 21, term: "만반잘부 (Man-ban-jal-bu)", meaning: "Nice to meet you, please take care of me" },
  { id: 22, term: "인싸 (In-ssa)", meaning: "A socially active and popular person" },
  { id: 23, term: "아싸 (A-ssa)", meaning: "Someone who prefers being alone; outsider" },
  { id: 24, term: "존버 (Jon-beo)", meaning: "Enduring patiently until the end" },
  { id: 25, term: "갑분싸 (Gap-bun-ssa)", meaning: "Suddenly awkward atmosphere" },
  { id: 26, term: "갓생 (Gat-saeng)", meaning: "Living a highly disciplined and productive life" },
  { id: 27, term: "킹받네 (King-badne)", meaning: "Extremely annoying or anger-inducing" },
  { id: 28, term: "플렉스 (Flex)", meaning: "Showing off wealth or spending freely" },
  { id: 29, term: "야근 (Ya-geun)", meaning: "Working overtime" },
  { id: 30, term: "칼퇴 (Kal-toe)", meaning: "Leaving work exactly on time" },
  { id: 31, term: "번아웃 (Burn-out)", meaning: "Mental and physical exhaustion" },
  { id: 32, term: "워라벨 (Work-life balance)", meaning: "Balance between work and personal life" },
  { id: 33, term: "멘붕 (Men-boong)", meaning: "Mental breakdown" },
  { id: 34, term: "갑질 (Gap-jil)", meaning: "Abuse of power by a superior" },
  { id: 35, term: "월급루팡 (Wol-geup-lu-pang)", meaning: "Getting paid while barely working" },
  { id: 36, term: "캐리 (Carry)", meaning: "Leading a team to victory" },
  { id: 37, term: "버프 (Buff)", meaning: "Ability enhancement" },
  { id: 38, term: "너프 (Nerf)", meaning: "Ability reduction" },
  { id: 39, term: "탱커 (Tanker)", meaning: "Damage-absorbing role in games" },
  { id: 40, term: "힐러 (Healer)", meaning: "Support role that restores health" },
  { id: 41, term: "딜러 (Dealer)", meaning: "Damage dealer" },
  { id: 42, term: "메타 (Meta)", meaning: "Most effective strategy or trend" },
  { id: 43, term: "OP", meaning: "Overpowered; too strong" },
  { id: 44, term: "금수저 (Geum-su-jeo)", meaning: "Born into a wealthy family" },
  { id: 45, term: "흙수저 (Heuk-su-jeo)", meaning: "Born into a poor family" },
  { id: 46, term: "손절 (Son-jeol)", meaning: "Cutting off a relationship" },
  { id: 47, term: "노쇼 (No-show)", meaning: "Failing to show up despite a reservation" },
  { id: 48, term: "개이득 (Gae-i-deuk)", meaning: "Huge benefit or profit" },
  { id: 49, term: "최애 (Choi-ae)", meaning: "Absolute favorite" },
  { id: 50, term: "덕질 (Deok-jil)", meaning: "Actively supporting or fangirling over something" }
];


// 3. Mini Game Quiz Data
const MOCK_QUIZ_DATA = [
    {
        question: "대한민국의 수도는 어디일까요?",
        options: ["부산", "서울", "제주", "인천"],
        answer: 1
    },
    {
        question: "비빔밥으로 유명한 도시는?",
        options: ["전주", "경주", "광주", "대구"],
        answer: 0
    },
    {
        question: "한국의 전통 난방 방식은?",
        options: ["다다미", "라디에이터", "온돌", "벽난로"],
        answer: 2
    },
    {
        question: "제주도의 특산물이 아닌 것은?",
        options: ["귤", "흑돼지", "한라봉", "대게"],
        answer: 3
    },
    {
        question: "BTS가 탄생한 나라는?",
        options: ["미국", "일본", "한국", "중국"],
        answer: 2
    }
];

// 4. Mock Chat Responses
const MOCK_CHAT_RESPONSES = {
    "default": "That's an interesting question! Could you ask something specific about Korean language or travel?",
    "hello": "Annyeonghaseyo! How can I help you with your Korean studies today?",
    "hi": "Hi there! Ready to learn some Korean?",
    "thank": "You're welcome! Or as we say in Korean, 'Cheonmaneyo' (천만에요)!",
    "slang": "Korean slang changes fast! Check out the 'Slang Dictionary' tab for the latest ones.",
    "food": "Korean food is amazing! Bibimbap, Kimchi, and Bulgogi are must-tries.",
    "local": "You can find great local spots in the 'Local' page. Try visiting a traditional market!",
    // Responses for specific slang terms based on pattern matching
    "jmt": "'JMT' stands for 'Jon-Mat-Taeng', which means it tastes super delicious!",
    "daebak": "'Daebak' is used when something is awesome or shocking.",
    "some": "'Some' describes the ambiguous stage of dating before it's official."
};

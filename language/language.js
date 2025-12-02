/* ================================
   0. 전역 상태
================================ */
let pickedPiece = null;      // 현재 들고 있는 "글자 그룹"
let mouseMoveHandler = null; // 마우스 이동 이벤트
let eraserMode = false;      // 지우개 모드 ON/OFF

/* ================================
   1. 반응형 스케일
================================ */
function applyScale(wrapperId, baseWidth) {
    const wrapper = document.querySelector(wrapperId);
    if (!wrapper) return;

    const container = wrapper.querySelector(".scale-container");
    if (!container) return;

    const wrapperWidth = wrapper.clientWidth;
    const scale = Math.min(wrapperWidth / baseWidth, 1);
    container.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", () => {
    applyScale("#consonant-wrapper", 680);
    applyScale("#vowel-wrapper", 780);
});

/* ================================
   2. stroke & circle 생성
================================ */
function createAndInitialize(containerSelector, data) {
    const box = $(containerSelector).empty();

    data.forEach(st => {
        // ● circle 타입
        if (st.type === "circle") {
            const $circle = $("<div>")
                .addClass("circle")
                .attr("id", st.id)
                .css({
                    left: st.initial.left,
                    top: st.initial.top,
                    width: st.final.size + "px",
                    height: st.final.size + "px",
                    color: st.color
                });
            box.append($circle);
            return;
        }

        // ● stroke 타입
        const width = st.final.width || 40;
        const height = 11;

        const $stroke = $("<div>")
            .addClass("stroke")
            .attr("id", st.id)
            .css({
                left: st.initial.left,
                top: st.initial.top,
                width: width + "px",
                height: height + "px",
                backgroundColor: st.color,
                transform: `rotate(${st.initial.rotate || 0}deg)`
            });

        box.append($stroke);
    });
}

/* ================================
   3. 애니메이션
================================ */
const ANIMATION_DURATION = 500;

function startAnimation(data) {
    data.forEach(st => {
        const target = $("#" + st.id);
        target
            .delay(st.delay)
            .animate({ opacity: 1 }, 20)
            .animate(
                {
                    left: st.final.left,
                    top: st.final.top
                },
                ANIMATION_DURATION,
                "swing",
                function () {
                    if (st.type !== "circle") {
                        $(this).css({
                            transform: `rotate(${st.final.rotate || 0}deg)`
                        });
                    }
                }
            );
    });
}

/* ================================
   4. 자음 데이터 (동일)
================================ */
const CONSONANT_STROKES = [
    /* ㄱ */
    { id:'g1', color:'#E57373', final:{left:48, top:55, rotate:0},  initial:{left:-200, top:20},  delay:500 },
    { id:'g2', color:'#E57373', final:{left:88, top:60, rotate:90}, initial:{left:800,  top:20},  delay:100 },

    /* ㄴ */
    { id:'n1', color:'#FFB74D', final:{left:131, top:55, rotate:90}, initial:{left:-200, top:80}, delay:300 },
    { id:'n2', color:'#FFB74D', final:{left:120, top:90, rotate:0},  initial:{left:800,  top:80}, delay:700 },

    /* ㄷ */
    { id:'d1', color:'#FFEE58', final:{left:192, top:52, rotate:0},  initial:{left:-200, top:-50}, delay:200 },
    { id:'d2', color:'#FFEE58', final:{left:203, top:55, rotate:90}, initial:{left:800,  top:-50}, delay:0   },
    { id:'d3', color:'#FFEE58', final:{left:192, top:90, rotate:0},  initial:{left:-200, top:150}, delay:800 },

    /* ㄹ */
    { id:'r1', color:'#A5D6A7', final:{left:268, top:50, rotate:0, width:33},  initial:{left:-200, top:-20}, delay:600 },
    { id:'r2', color:'#A5D6A7', final:{left:306, top:50, rotate:90, width:31}, initial:{left:800,  top:-20}, delay:400 },
    { id:'r3', color:'#A5D6A7', final:{left:268, top:70, rotate:0, width:33},  initial:{left:-200, top:120}, delay:300 },
    { id:'r4', color:'#A5D6A7', final:{left:278, top:70, rotate:90, width:31}, initial:{left:800,  top:120}, delay:500 },
    { id:'r5', color:'#A5D6A7', final:{left:273, top:90, rotate:0, width:33},  initial:{left:-200, top:10},  delay:0   },

    /* ㅁ */
    { id:'m1', color:'#80CBC4', final:{left:340, top:52, rotate:0, width:47},  initial:{left:-200, top:40}, delay:800 },
    { id:'m2', color:'#80CBC4', final:{left:351, top:53, rotate:90, width:47}, initial:{left:800,  top:40}, delay:100 },
    { id:'m3', color:'#80CBC4', final:{left:340, top:89, rotate:0, width:47},  initial:{left:-200, top:100},delay:200 },
    { id:'m4', color:'#80CBC4', final:{left:387, top:53, rotate:90, width:47}, initial:{left:800,  top:100},delay:700 },

    /* ㅂ */
    { id:'b1', color:'#64B5F6', final:{left:420, top:67, rotate:0}, initial:{left:-200, top:40}, delay:400 },
    { id:'b2', color:'#64B5F6', final:{left:420, top:90, rotate:0}, initial:{left:800,  top:20}, delay:600 },
    { id:'b3', color:'#64B5F6', final:{left:426, top:50, rotate:90, width:51}, initial:{left:-200, top:180},delay:0   },
    { id:'b4', color:'#64B5F6', final:{left:464, top:50, rotate:90, width:51}, initial:{left:800,  top:180},delay:100 },

    /* ㅅ */
    { id:'s1', color:'#9575CD', final:{left:480, top:94, rotate:-45, width:55}, initial:{left:-300, top:40},delay:500 },
    { id:'s2', color:'#9575CD', final:{left:513, top:68, rotate:45,  width:40}, initial:{left:900,  top:40},delay:800 },

    /* ㅇ */
    { id:'o_circle', type:'circle', color:'#FF8A65',
      final:{ left:47, top:149, size:45 }, initial:{ left:-200, top:-200 }, delay:300 },

    /* ㅈ */
    { id:'j1', color:'#F48FB1', final:{left:116, top:150, rotate:0, width:46},  initial:{left:-200, top:10}, delay:700 },
    { id:'j2', color:'#F48FB1', final:{left:110, top:185, rotate:-45, width:38},initial:{left:800,  top:100},delay:200 },
    { id:'j3', color:'#F48FB1', final:{left:141, top:158, rotate:45,  width:38},initial:{left:-200, top:150},delay:0   },

    /* ㅊ */
    { id:'c1', color:'#A1887F', final:{left:195, top:145, rotate:0, width:32}, initial:{left:-200, top:10}, delay:400 },
    { id:'c2', color:'#A1887F', final:{left:188, top:160, rotate:0, width:46}, initial:{left:800,  top:20}, delay:600 },
    { id:'c3', color:'#A1887F', final:{left:187, top:186, rotate:-45,width:33}, initial:{left:-200, top:100},delay:800 },
    { id:'c4', color:'#A1887F', final:{left:212, top:163, rotate:45, width:33}, initial:{left:800,  top:150},delay:100 },

    /* ㅋ */
    { id:'k1', color:'#FFCC80', final:{left:265, top:150, rotate:0}, initial:{left:-200, top:40}, delay:300 },
    { id:'k2', color:'#FFCC80', final:{left:306, top:150, rotate:90, width:45}, initial:{left:800, top:60}, delay:500 },
    { id:'k3', color:'#FFCC80', final:{left:265, top:170, rotate:0}, initial:{left:-200, top:120},delay:700 },

    /* ㅌ */
    { id:'t1', color:'#4FC3F7', final:{left:344, top:150, rotate:0}, initial:{left:-200, top:20}, delay:200 },
    { id:'t2', color:'#4FC3F7', final:{left:350, top:150, rotate:90, width:45}, initial:{left:800,  top:0}, delay:0   },
    { id:'t3', color:'#4FC3F7', final:{left:344, top:167, rotate:0}, initial:{left:-200, top:180},delay:800 },
    { id:'t4', color:'#4FC3F7', final:{left:344, top:184, rotate:0}, initial:{left:800,  top:180},delay:600 },

    /* ㅍ */
    { id:'p1', color:'#DCE775', final:{left:416, top:150, rotate:0, width:45}, initial:{left:-200, top:40}, delay:400 },
    { id:'p2', color:'#DCE775', final:{left:416, top:184, rotate:0, width:45}, initial:{left:800,  top:20}, delay:100 },
    { id:'p3', color:'#DCE775', final:{left:436, top:156, rotate:90,width:30}, initial:{left:-200, top:160},delay:700 },
    { id:'p4', color:'#DCE775', final:{left:453, top:156, rotate:90,width:30}, initial:{left:800,  top:150},delay:300 },

    /* ㅎ */
    { id:'h_circle', type:'circle', color:'#BDBDBD',
      final:{ left:496, top:166, size:30 }, initial:{ left:-200, top:-200 }, delay:0 },
    { id:'h_line1', color:'#BDBDBD', final:{ left:489, top:155, rotate:0, width:44 }, initial:{ left:800, top:150 }, delay:600 },
    { id:'h_line2', color:'#BDBDBD', final:{ left:496, top:141, rotate:0, width:30 }, initial:{ left:800, top:150 }, delay:400 }
];

/* ================================
   5. 모음 데이터
================================ */
const VOWEL_STROKES = [
    /* ㅏ */
    { id:'a1',  color:'#EF9A9A', final:{left:76,  top:80,  rotate:90, width:60}, initial:{left:-200, top:0},   delay:700 },
    { id:'a2',  color:'#EF9A9A', final:{left:72,  top:100, rotate:0,  width:25}, initial:{left:800,  top:20},  delay:200 },

    /* ㅑ */
    { id:'ya1', color:'#C5E1A5', final:{left:148, top:80,  rotate:90, width:60}, initial:{left:-200, top:40}, delay:0   },
    { id:'ya2', color:'#C5E1A5', final:{left:144, top:92,  rotate:0,  width:25}, initial:{left:800,  top:0},  delay:500 },
    { id:'ya3', color:'#C5E1A5', final:{left:144, top:112, rotate:0,  width:25}, initial:{left:-200, top:150},delay:400 },

    /* ㅓ */
    { id:'eo1', color:'#FFCC80', final:{left:228, top:80,  rotate:90, width:60}, initial:{left:-200, top:20}, delay:600 },
    { id:'eo2', color:'#FFCC80', final:{left:200, top:100, rotate:0,  width:25}, initial:{left:800,  top:20}, delay:100 },

    /* ㅕ */
    { id:'yeo1', color:'#FF8A65', final:{left:298, top:80,  rotate:90, width:60}, initial:{left:-200, top:0},  delay:300 },
    { id:'yeo2', color:'#FF8A65', final:{left:266, top:92,  rotate:0,  width:25}, initial:{left:800,  top:100},delay:800 },
    { id:'yeo3', color:'#FF8A65', final:{left:266, top:112, rotate:0,  width:25}, initial:{left:-200, top:120},delay:500 },

    /* ㅗ */
    { id:'o_v1', color:'#A1887F', final:{left:318, top:116, rotate:0, width:60}, initial:{left:-200, top:60}, delay:0   },
    { id:'o_v2', color:'#A1887F', final:{left:353, top:90,  rotate:90,width:30}, initial:{left:800,  top:10}, delay:400 },

    /* ㅛ */
    { id:'yo1', color:'#81D4FA', final:{left:400, top:116, rotate:0, width:60}, initial:{left:-200, top:40}, delay:200 },
    { id:'yo2', color:'#81D4FA', final:{left:424, top:90,  rotate:90,width:30}, initial:{left:800,  top:0},  delay:600 },
    { id:'yo3', color:'#81D4FA', final:{left:446, top:90,  rotate:90,width:30}, initial:{left:-200, top:100},delay:100 },

    /* ㅜ */
    { id:'u1',  color:'#BA68C8', final:{left:472, top:94,  rotate:0, width:60}, initial:{left:-200, top:20}, delay:800 },
    { id:'u2',  color:'#BA68C8', final:{left:507, top:101, rotate:90,width:30}, initial:{left:800,  top:100},delay:300 },

    /* ㅠ */
    { id:'yu1', color:'#80CBC4', final:{left:544, top:94,  rotate:0, width:60}, initial:{left:-200, top:40}, delay:500 },
    { id:'yu2', color:'#80CBC4', final:{left:568, top:101, rotate:90,width:30}, initial:{left:800,  top:0},  delay:700 },
    { id:'yu3', color:'#80CBC4', final:{left:590, top:101, rotate:90,width:30}, initial:{left:-200, top:150},delay:200 },

    /* ㅡ */
    { id:'eu1', color:'#F48FB1', final:{left:616, top:105, rotate:0, width:60}, initial:{left:-200, top:10}, delay:400 },

    /* ㅣ */
    { id:'i1',  color:'#9575CD', final:{left:704, top:80,  rotate:90,width:60}, initial:{left:800,  top:20}, delay:0   }
];

/* ------------------------------------------------------------
   5. stroke id → groupKey (자모)
------------------------------------------------------------ */
const LETTER_GROUPS = {
    g: ["g1", "g2"],
    n: ["n1", "n2"],
    d: ["d1", "d2", "d3"],
    r: ["r1", "r2", "r3", "r4", "r5"],
    m: ["m1", "m2", "m3", "m4"],
    b: ["b1", "b2", "b3", "b4"],
    s: ["s1", "s2"],
    o: ["o_circle"],
    j: ["j1", "j2", "j3"],
    c: ["c1", "c2", "c3", "c4"],
    k: ["k1", "k2", "k3"],
    t: ["t1", "t2", "t3", "t4"],
    p: ["p1", "p2", "p3", "p4"],
    h: ["h_circle", "h_line1", "h_line2"],

    // 모음
    a: ["a1", "a2"],
    ya: ["ya1", "ya2", "ya3"],
    eo: ["eo1", "eo2"],
    yeo: ["yeo1", "yeo2", "yeo3"],
    ov: ["o_v1", "o_v2"],
    yo: ["yo1", "yo2", "yo3"],
    u: ["u1", "u2"],
    yu: ["yu1", "yu2", "yu3"],
    eu: ["eu1"],
    i: ["i1"]
};

/* id → 어느 그룹(key)인지 찾기 위한 역매핑 */
const ID_TO_GROUP_KEY = (() => {
    const map = {};
    Object.entries(LETTER_GROUPS).forEach(([key, ids]) => {
        ids.forEach(id => map[id] = key);
    });
    return map;
})();

/* ================================
   6. 클릭 → 그룹 복제 → 한 글자 보드 배치
================================ */
function enableClickCloneMovement() {
    pickedPiece = null;
    mouseMoveHandler = null;

    // A) 자음/모음 클릭 → 그룹 복제해서 들기
    $("#consonant-container, #vowel-container").on("click", ".stroke, .circle", function (e) {
        if (eraserMode) return;

        if (pickedPiece) {
            pickedPiece.remove();
            $(document).off("mousemove", mouseMoveHandler);
        }

        const clickedId = this.id;
        const groupKey = ID_TO_GROUP_KEY[clickedId];
        if (!groupKey) return;

        const idList = LETTER_GROUPS[groupKey];

        const elems = idList
            .map(id => $("#" + id))
            .filter($el => $el.length);

        let minLeft = Infinity, minTop = Infinity;
        elems.forEach($el => {
            const left = parseFloat($el.css("left"));
            const top = parseFloat($el.css("top"));
            if (left < minLeft) minLeft = left;
            if (top < minTop) minTop = top;
        });

        const $group = $("<div>")
            .addClass("letter-group placed-piece floating-piece")
            .attr("data-group-key", groupKey)
            .css({
                position: "fixed",
                pointerEvents: "none",
                opacity: 0.9,
                zIndex: 99999
            });

        elems.forEach($orig => {
            const clone = $orig.clone().removeAttr("id");

            const left = parseFloat($orig.css("left"));
            const top = parseFloat($orig.css("top"));

            clone.css({
                left: left - minLeft + "px",
                top: top - minTop + "px",
                opacity: 1
            });

            $group.append(clone);
        });

        $("body").append($group);
        pickedPiece = $group;

        mouseMoveHandler = ev => {
            pickedPiece.css({
                left: ev.clientX - pickedPiece.width() / 2 + "px",
                top: ev.clientY - pickedPiece.height() / 2 + "px"
            });
        };
        $(document).on("mousemove", mouseMoveHandler);

        e.stopPropagation();
    });

    // B) 보드 위 조각 클릭 → 다시 들기 or 삭제
    $("#workspace").on("click", ".placed-piece", function (e) {
        if (eraserMode) {
            $(this).remove();
            recognizeWordFromBoard();
            e.stopPropagation();
            return;
        }

        if (pickedPiece) {
            pickedPiece.remove();
            $(document).off("mousemove", mouseMoveHandler);
        }

        pickedPiece = $(this)
            .addClass("floating-piece")
            .css({
                position: "fixed",
                pointerEvents: "none",
                opacity: 0.9,
                zIndex: 99999
            });

        mouseMoveHandler = ev => {
            pickedPiece.css({
                left: ev.clientX - pickedPiece.width() / 2 + "px",
                top: ev.clientY - pickedPiece.height() / 2 + "px"
            });
        };
        $(document).on("mousemove", mouseMoveHandler);
        e.stopPropagation();
    });

    // C) 보드 클릭 → 조각 내려놓기 (한 글자 보드 안)
    $("#workspace").on("click", function (e) {
        if (!pickedPiece) return;

        const offset = $(this).offset();
        const x = e.pageX - offset.left - pickedPiece.width() / 2;
        const y = e.pageY - offset.top - pickedPiece.height() / 2;

        pickedPiece
            .removeClass("floating-piece")
            .css({
                position: "absolute",
                left: x + "px",
                top: y + "px",
                pointerEvents: "auto",
                opacity: 1,
                zIndex: ""
            });

        $(this).append(pickedPiece);

        $(document).off("mousemove", mouseMoveHandler);
        pickedPiece = null;

        $("#workspace-hint").hide();   // 무언가 올라오면 안내 문구 숨김
        recognizeWordFromBoard();      // 🔥 항상 한 글자 인식
    });

    // Esc → 들고 있는 조각 취소
    $(document).on("keydown", e => {
        if (e.key === "Escape" && pickedPiece) {
            pickedPiece.remove();
            $(document).off("mousemove", mouseMoveHandler);
            pickedPiece = null;
        }
    });

    // 전체 삭제
    $("#clearWorkspace").on("click", function () {
        $("#workspace").empty();
        $("#workspace-hint").show();
        pickedPiece = null;
        $(document).off("mousemove", mouseMoveHandler);
        recognizeWordFromBoard();
    });
}

/* ================================
   7. 지우개 모드 버튼 기능
================================ */
function setupEraserAndCursorButtons() {
    $("#eraserButton").on("click", function () {
        eraserMode = true;
        $("body").addClass("eraser-mode");

        $("#eraserButton").addClass("active");
        $("#cursorButton").removeClass("active");
    });

    $("#cursorButton").on("click", function () {
        eraserMode = false;
        $("body").removeClass("eraser-mode");

        $("#cursorButton").addClass("active");
        $("#eraserButton").removeClass("active");
    });
}

/* ============================================================
   8.🔥 한 글자 전용 인식 (복합받침 + 자모 단독 지원)
============================================================ */

/* 자모 key 테이블 */
const CHO_KEYS  = ["g","n","d","r","m","b","s","o","j","c","k","t","p","h"];
const JUNG_KEYS = ["a","ya","eo","yeo","ov","yo","u","yu","eu","i"];

/* 종성 테이블 (유니코드용) */
const FINAL_TABLE = [
    "", "g","gg","gs","n","nj","nh","d","r",
    "rg","rm","rb","rs","rt","rp","rh","m","b","bs",
    "s","ss","ng","j","c","k","t","p","h"
];

/* 복합받침으로 허용되는 조합 */
const COMPLEX_JONG_SET = new Set([
    "gs","nj","nh","rg","rm","rb","rs","rt","rp","rh","bs"
]);

/* 자모 → 단독 자모 글자 */
const ROMA_TO_CONSONANT = {
    g:"\u3131", // ㄱ
    n:"\u3134", // ㄴ
    d:"\u3137", // ㄷ
    r:"\u3139", // ㄹ
    m:"\u3141", // ㅁ
    b:"\u3142", // ㅂ
    s:"\u3145", // ㅅ
    o:"\u3147", // ㅇ
    j:"\u3148", // ㅈ
    c:"\u314A", // ㅊ
    k:"\u314B", // ㅋ
    t:"\u314C", // ㅌ
    p:"\u314D", // ㅍ
    h:"\u314E"  // ㅎ
};

const ROMA_TO_VOWEL = {
    a:"\u314F",   // ㅏ
    ya:"\u3151",  // ㅑ
    eo:"\u3153",  // ㅓ
    yeo:"\u3155", // ㅕ
    ov:"\u3157",  // ㅗ
    yo:"\u315B",  // ㅛ
    u:"\u315C",   // ㅜ
    yu:"\u3160",  // ㅠ
    eu:"\u3161",  // ㅡ
    i:"\u3163"    // ㅣ
};

function isConsonantKey(k) { return CHO_KEYS.includes(k); }
function isVowelKey(k)     { return JUNG_KEYS.includes(k); }

/* 초/중/종으로 완성형 한 글자 만들기 */
function makeHangulSyllable(choKey, jungKey, jongStr) {
    const ci = CHO_KEYS.indexOf(choKey);
    const vi = JUNG_KEYS.indexOf(jungKey);
    const fi = FINAL_TABLE.indexOf(jongStr || "");

    if (ci < 0 || vi < 0 || fi < 0) return "";

    const code = 0xAC00 + ci * 21 * 28 + vi * 28 + fi;
    return String.fromCharCode(code);
}

/* trailing 자음들로 받침 하나 결정 */
function deriveFinalJong(trailing) {
    if (!trailing || trailing.length === 0) return "";

    if (trailing.length === 1) return trailing[0];

    const pair = trailing[0] + trailing[1];
    if (COMPLEX_JONG_SET.has(pair)) return pair;

    return trailing[0]; // 나머지는 첫 자음만 받침으로
}

/* 한 글자 보드 안의 자모 시퀀스 → 한 글자 or 자모 */
function buildHangulFromSingleBoard(keys) {
    if (!keys || keys.length === 0) return "";

    // 1) 모음이 하나도 없으면 → 자음/모음 자모 그대로 출력
    const hasVowel = keys.some(k => isVowelKey(k));
    if (!hasVowel) {
        return keys.map(k =>
            ROMA_TO_CONSONANT[k] || ROMA_TO_VOWEL[k] || ""
        ).join("");
    }

    // 2) 첫 번째 모음 위치 찾기
    const vIdx = keys.findIndex(k => isVowelKey(k));
    const jung = keys[vIdx];

    // 3) 모음 앞에서 가장 오른쪽의 자음 하나를 초성으로 사용
    let cho = null;
    for (let i = vIdx - 1; i >= 0; i--) {
        if (isConsonantKey(keys[i])) {
            cho = keys[i];
            break;
        }
    }
    if (!cho) cho = "o"; // 초성이 없으면 ㅇ으로 자동 보정

    // 4) 모음 뒤에 오는 자음들 → 받침 후보
    const trailing = [];
    for (let i = vIdx + 1; i < keys.length; i++) {
        if (isConsonantKey(keys[i])) trailing.push(keys[i]);
    }
    const jong = deriveFinalJong(trailing);

    // 5) 완성형 글자 만들기
    const syllable = makeHangulSyllable(cho, jung, jong);
    if (!syllable) {
        // 혹시라도 조합 실패하면 자모 그대로
        return keys.map(k =>
            ROMA_TO_CONSONANT[k] || ROMA_TO_VOWEL[k] || ""
        ).join("");
    }

    // 6) 모음 앞의 나머지 자모(초성으로 쓰이지 않은 것들)는 자모 그대로
    const prefix = [];
    for (let i = 0; i < vIdx; i++) {
        if (keys[i] === cho && isConsonantKey(keys[i])) continue;
        prefix.push(keys[i]);
    }

    const prefixStr = prefix.map(k =>
        ROMA_TO_CONSONANT[k] || ROMA_TO_VOWEL[k] || ""
    ).join("");

    return prefixStr + syllable;
}

/* 결과 박스 업데이트 */
function updateRecognitionOutput(text) {
    $("#recognized-text").text(text && text.length > 0 ? text : "-");
}

/* ---------------------------------------------------------
   🔥 한 글자 전용 인식
   보드 안에 있는 조각들 = 항상 한 글자를 구성한다고 가정
--------------------------------------------------------- */
function recognizeWordFromBoard() {
    const pieces = Array.from(document.querySelectorAll("#workspace .letter-group"));
    if (pieces.length === 0) {
        updateRecognitionOutput("");
        return;
    }

    // 1) x좌표 기준으로 정렬 (초 → 중 → 종 순서)
    const sorted = pieces
        .map(el => {
            const rect = el.getBoundingClientRect();
            return {
                key: el.dataset.groupKey,
                x: rect.left + rect.width / 2
            };
        })
        .sort((a, b) => a.x - b.x);

    const jamos = sorted.map(x => x.key);

    let cho = null, jung = null, jong = null;

    jamos.forEach(j => {
        const t = classifyJamo(j);
        if (!t) return;

        if (t.type === "cho") {
            if (!cho) cho = j;
            else if (!jong) jong = j;             // 중성 이후라면 종성
        }
        else if (t.type === "jung") {
            jung = j;
        }
        else if (t.type === "jong") {
            if (!jong) jong = j;
            else {
                const combo = combineJong(jong, j);
                if (combo) jong = combo;
            }
        }
    });

    // 초성 + 중성 필수
    if (cho && jung) {
        updateRecognitionOutput(makeHangulSyllable(cho, jung, jong));
    } else {
        updateRecognitionOutput("-");
    }
}


/* ================================
   9. 실행
================================ */
$(document).ready(() => {
    // 자음/모음 생성 + 애니메이션
    createAndInitialize("#consonant-container", CONSONANT_STROKES);
    createAndInitialize("#vowel-container", VOWEL_STROKES);

    startAnimation(CONSONANT_STROKES);
    startAnimation(VOWEL_STROKES);

    // 반응형 초기 적용
    applyScale("#consonant-wrapper", 680);
    applyScale("#vowel-wrapper", 780);

    // 클릭 복제/배치 기능
    enableClickCloneMovement();

    // 지우개/마우스 모드
    setupEraserAndCursorButtons();

    // 초기 인식
    recognizeWordFromBoard();
});

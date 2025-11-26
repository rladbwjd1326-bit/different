/* ============================================================
   0. 전역 상태
============================================================ */
let pickedPiece = null;
let mouseMoveHandler = null;
let eraserMode = false;
let groupMode = true;   // true = 자음/모음 "그룹 모드", false = "획 모드"

/* ============================================================
   1. 반응형 스케일
============================================================ */
function applyScale(wrapperId, baseWidth) {
    const wrapper = document.querySelector(wrapperId);
    const container = wrapper.querySelector(".scale-container");
    const wrapperWidth = wrapper.clientWidth;
    const scale = Math.min(wrapperWidth / baseWidth, 1);
    container.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", () => {
    applyScale("#consonant-wrapper", 700);
    applyScale("#vowel-wrapper", 700);
});

/* ============================================================
   2. stroke & circle 요소 생성
============================================================ */
function createAndInitialize(container, data) {
    const box = $(container).empty();

    data.forEach(st => {

        // ● circle (도넛)
        if (st.type === "circle") {
            const $circle = $("<div>")
                .addClass("circle piece")
                .attr("id", st.id)
                .attr("data-id", st.id)
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

        // ● stroke
        const width = st.final.width || 40;
        const height = 11;

        const $stroke = $("<div>")
            .addClass("stroke piece")
            .attr("id", st.id)
            .attr("data-id", st.id)
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

/* ============================================================
   3. 애니메이션
============================================================ */
const ANIMATION_DURATION = 500;

function startAnimation(data) {
    data.forEach(st => {
        const target = $("#" + st.id);

        target.delay(st.delay)
            .animate({ opacity: 1 }, 20)
            .animate({
                left: st.final.left,
                top: st.final.top
            }, ANIMATION_DURATION, "swing", function () {

                if (st.type !== "circle") {
                    $(this).css({
                        transform: `rotate(${st.final.rotate || 0}deg)`
                    });
                }

            });
    });
}

/*
* 참고: Math.floor(Math.random() * 9) * 100는 0, 100, 200, ..., 800 중 하나의 값을 생성합니다.
* 새로운 차분하고 밝은 톤 팔레트 (예: Material Design 300-400 레벨의 색상, 명도는 유지하고 채도를 낮춤)
* ㄱ: #E57373 (Soft Red), ㄴ: #FFB74D (Soft Orange), ㄷ: #FFEE58 (Light Yellow)
* ㄹ: #A5D6A7 (Soft Green), ㅁ: #80CBC4 (Soft Teal), ㅂ: #64B5F6 (Soft Blue)
* ㅅ: #9575CD (Soft Deep Purple), ㅇ: #FF8A65 (Soft Deep Orange)
* ㅈ: #F48FB1 (Soft Pink), ㅊ: #A1887F (Soft Brown)
* ㅋ: #FFCC80 (Light Amber), ㅌ: #4FC3F7 (Light Cyan)
* ㅍ: #DCE775 (Light Lime), ㅎ: #BDBDBD (Light Gray)
*
* ㅏ: #EF9A9A (Light Red), ㅑ: #C5E1A5 (Light Lime), ㅓ: #FFCC80 (Light Amber)
* ㅕ: #FF8A65 (Soft Deep Orange), ㅗ: #A1887F (Soft Brown), ㅛ: #81D4FA (Light Blue)
* ㅜ: #BA68C8 (Soft Purple), ㅠ: #80CBC4 (Soft Teal), ㅡ: #F48FB1 (Soft Pink), ㅣ: #9575CD (Soft Deep Purple)
*/

/* ================================
   4. 자음 데이터 (랜덤 딜레이, 차분한 밝은 톤 통일) - 그룹별 간격 4px 감소
================================ */
const CONSONANT_STROKES = [

/* 1행 — ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ */

/* ㄱ - Soft Red: #E57373 (Offset: 0px) */
{ id:'g1', color:'#E57373', final:{left:48, top:55, rotate:0}, initial:{left:-200, top:20}, delay:500 },
{ id:'g2', color:'#E57373', final:{left:88, top:60, rotate:90}, initial:{left:800, top:20}, delay:100 },

/* ㄴ - Soft Orange: #FFB74D (Offset: -4px) */
{ id:'n1', color:'#FFB74D', final:{left:131, top:55, rotate:90}, initial:{left:-200, top:80}, delay:300 }, // 135 -> 131
{ id:'n2', color:'#FFB74D', final:{left:120, top:90, rotate:0}, initial:{left:800, top:80}, delay:700 }, // 124 -> 120

/* ㄷ - Light Yellow: #FFEE58 (Offset: -8px) */
{ id:'d1', color:'#FFEE58', final:{left:192, top:52, rotate:0}, initial:{left:-200, top:-50}, delay:200 }, // 200 -> 192
{ id:'d2', color:'#FFEE58', final:{left:203, top:55, rotate:90}, initial:{left:800, top:-50}, delay:0 }, // 211 -> 203
{ id:'d3', color:'#FFEE58', final:{left:192, top:90, rotate:0}, initial:{left:-200, top:150}, delay:800 }, // 200 -> 192

/* ㄹ - Soft Green: #A5D6A7 (Offset: -12px) */
{ id:'r1', color:'#A5D6A7', final:{left:268, top:50, rotate:0, width:33}, initial:{left:-200, top:-20}, delay:600 }, // 280 -> 268
{ id:'r2', color:'#A5D6A7', final:{left:306, top:50, rotate:90, width:31}, initial:{left:800, top:-20}, delay:400 }, // 318 -> 306
{ id:'r3', color:'#A5D6A7', final:{left:268, top:70, rotate:0, width:33}, initial:{left:-200, top:120}, delay:300 }, // 280 -> 268
{ id:'r4', color:'#A5D6A7', final:{left:278, top:70, rotate:90, width:31}, initial:{left:800, top:120}, delay:500 }, // 290 -> 278
{ id:'r5', color:'#A5D6A7', final:{left:273, top:90, rotate:0, width:33}, initial:{left:-200, top:10}, delay:0 }, // 285 -> 273

/* ㅁ - Soft Teal: #80CBC4 (Offset: -16px) */
{ id:'m1', color:'#80CBC4', final:{left:340, top:52, rotate:0, width:47}, initial:{left:-200, top:40}, delay:800 }, // 356 -> 340
{ id:'m2', color:'#80CBC4', final:{left:351, top:53, rotate:90, width:47}, initial:{left:800, top:40}, delay:100 }, // 367 -> 351
{ id:'m3', color:'#80CBC4', final:{left:340, top:89, rotate:0, width:47}, initial:{left:-200, top:100}, delay:200 }, // 356 -> 340
{ id:'m4', color:'#80CBC4', final:{left:387, top:53, rotate:90, width:47}, initial:{left:800, top:100}, delay:700 }, // 403 -> 387

/* ㅂ - Soft Blue: #64B5F6 (Offset: -20px) */
{ id:'b1', color:'#64B5F6', final:{left:420, top:67, rotate:0}, initial:{left:-200, top:40}, delay:400 }, // 440 -> 420
{ id:'b2', color:'#64B5F6', final:{left:420, top:90, rotate:0}, initial:{left:800, top:20},  delay:600 }, // 440 -> 420
{ id:'b3', color:'#64B5F6', final:{left:426, top:50, rotate:90, width:51}, initial:{left:-200, top:180}, delay:0 }, // 446 -> 426
{ id:'b4', color:'#64B5F6', final:{left:464, top:50, rotate:90, width:51}, initial:{left:800, top:180}, delay:100 }, // 484 -> 464

/* ㅅ - Soft Deep Purple: #9575CD (Offset: -24px) */
{ id:'s1', color:'#9575CD', final:{left:480, top:94, rotate:-45, width:55}, initial:{left:-300, top:40}, delay:500 }, // 504 -> 480
{ id:'s2', color:'#9575CD', final:{left:513, top:68, rotate:45, width:40}, initial:{left:900, top:40}, delay:800 }, // 537 -> 513


/* 2행 — ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ */

/* ㅇ - Soft Deep Orange: #FF8A65 (Offset: 0px) — 도넛 */
{
    id:'o_circle', type:'circle',
    color:'#FF8A65',
    final:{ left:47, top:149, size:45 },
    initial:{ left:-200, top:-200 },
    delay:300
},

/* ㅈ - Soft Pink: #F48FB1 (Offset: -4px) */
{ id:'j1', color:'#F48FB1', final:{left:116, top:150, rotate:0, width:46}, initial:{left:-200, top:10}, delay:700 }, // 120 -> 116
{ id:'j2', color:'#F48FB1', final:{left:110, top:185, rotate:-45, width:38}, initial:{left:800, top:100}, delay:200 }, // 114 -> 110
{ id:'j3', color:'#F48FB1', final:{left:141, top:158, rotate:45, width:38}, initial:{left:-200, top:150}, delay:0 }, // 145 -> 141

/* ㅊ - Soft Brown: #A1887F (Offset: -8px) */
{ id:'c1', color:'#A1887F', final:{left:195, top:145, rotate:0, width:32}, initial:{left:-200, top:10}, delay:400 }, // 203 -> 195
{ id:'c2', color:'#A1887F', final:{left:188, top:160, rotate:0, width:46}, initial:{left:800, top:20}, delay:600 }, // 196 -> 188
{ id:'c3', color:'#A1887F', final:{left:187, top:186, rotate:-45, width:33}, initial:{left:-200, top:100}, delay:800 }, // 195 -> 187
{ id:'c4', color:'#A1887F', final:{left:212, top:163, rotate:45, width:33}, initial:{left:800, top:150}, delay:100 }, // 220 -> 212

/* ㅋ - Light Amber: #FFCC80 (Offset: -12px) */
{ id:'k1', color:'#FFCC80', final:{left:265, top:150, rotate:0}, initial:{left:-200, top:40}, delay:300 }, // 277 -> 265
{ id:'k2', color:'#FFCC80', final:{left:306, top:150, rotate:90, width:45}, initial:{left:800, top:60}, delay:500 }, // 318 -> 306
{ id:'k3', color:'#FFCC80', final:{left:265, top:170, rotate:0}, initial:{left:-200, top:120}, delay:700 }, // 277 -> 265

/* ㅌ - Light Cyan: #4FC3F7 (Offset: -16px) */
{ id:'t1', color:'#4FC3F7', final:{left:344, top:150, rotate:0}, initial:{left:-200, top:20}, delay:200 }, // 360 -> 344
{ id:'t2', color:'#4FC3F7', final:{left:350, top:150, rotate:90, width:45}, initial:{left:800, top:0}, delay:0 }, // 366 -> 350
{ id:'t3', color:'#4FC3F7', final:{left:344, top:167, rotate:0}, initial:{left:-200, top:180}, delay:800 }, // 360 -> 344
{ id:'t4', color:'#4FC3F7', final:{left:344, top:184, rotate:0}, initial:{left:800, top:180}, delay:600 }, // 360 -> 344

/* ㅍ - Light Lime: #DCE775 (Offset: -20px) */
{ id:'p1', color:'#DCE775', final:{left:416, top:150, rotate:0, width:45}, initial:{left:-200, top:40}, delay:400 }, // 436 -> 416
{ id:'p2', color:'#DCE775', final:{left:416, top:184, rotate:0, width:45}, initial:{left:800, top:20}, delay:100 }, // 436 -> 416
{ id:'p3', color:'#DCE775', final:{left:436, top:156, rotate:90, width:30}, initial:{left:-200, top:160}, delay:700 }, // 456 -> 436
{ id:'p4', color:'#DCE775', final:{left:453, top:156, rotate:90, width:30}, initial:{left:800, top:150}, delay:300 }, // 473 -> 453

/* ㅎ - Light Gray: #BDBDBD (Offset: -24px) */
{
    id:'h_circle', type:'circle',
    color:'#BDBDBD',
    final:{ left:496, top:166, size:30 }, // 520 -> 496
    initial:{ left:-200, top:-200 },
    delay:0
},
{
    id:'h_line1', color:'#BDBDBD',
    final:{ left:489, top:155, rotate:0, width:44 }, // 513 -> 489
    initial:{ left:800, top:150 },
    delay:600
},
{
    id:'h_line2', color:'#BDBDBD',
    final:{ left:496, top:141, rotate:0, width:30 }, // 520 -> 496
    initial:{ left:800, top:150 },
    delay:400
}
];

/* ================================
   5. 모음 데이터 (랜덤 딜레이, 차분한 밝은 톤 통일) - 그룹별 간격 8px 감소
================================ */
const VOWEL_STROKES = [

/* 모음 1줄 — ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ */

/* ㅏ - Light Red: #EF9A9A (Offset: 0px) */
{ id:'a1', color:'#EF9A9A', final:{left:76, top:80, rotate:90, width:60}, initial:{left:-200, top:0}, delay:700 },
{ id:'a2', color:'#EF9A9A', final:{left:72, top:100, rotate:0, width:25}, initial:{left:800, top:20}, delay:200},

/* ㅑ - Light Lime: #C5E1A5 (Offset: -8px) */
{ id:'ya1', color:'#C5E1A5', final:{left:148, top:80, rotate:90, width:60}, initial:{left:-200, top:40}, delay:0 }, // 124 -> 116
{ id:'ya2', color:'#C5E1A5', final:{left:144, top:92, rotate:0, width:25}, initial:{left:800, top:0}, delay:500 }, // 120 -> 112
{ id:'ya3', color:'#C5E1A5', final:{left:144, top:112, rotate:0, width:25}, initial:{left:-200, top:150}, delay:400 }, // 120 -> 112

/* ㅓ - Light Amber: #FFCC80 (Offset: -16px) */
{ id:'eo1', color:'#FFCC80', final:{left:228, top:80, rotate:90, width:60}, initial:{left:-200, top:20}, delay:600 }, // 212 -> 196
{ id:'eo2', color:'#FFCC80', final:{left:200, top:100, rotate:0, width:25}, initial:{left:800, top:20}, delay:100 }, // 184 -> 168

/* ㅕ - Soft Deep Orange: #FF8A65 (Offset: -24px) */
{ id:'yeo1', color:'#FF8A65', final:{left:298, top:80, rotate:90, width:60}, initial:{left:-200, top:0}, delay:300 }, // 296 -> 272
{ id:'yeo2', color:'#FF8A65', final:{left:266, top:92, rotate:0, width:25}, initial:{left:800, top:100}, delay:800 }, // 264 -> 240
{ id:'yeo3', color:'#FF8A65', final:{left:266, top:112, rotate:0, width:25}, initial:{left:-200, top:120}, delay:500 }, // 264 -> 240

/* ㅗ - Soft Brown: #A1887F (Offset: -32px) */
{ id:'o_v1', color:'#A1887F', final:{left:318, top:116, rotate:0, width:60}, initial:{left:-200, top:60}, delay:0 }, // 350 -> 318
{ id:'o_v2', color:'#A1887F', final:{left:353, top:90, rotate:90, width:30}, initial:{left:800, top:10}, delay:400 }, // 385 -> 353

/* ㅛ - Light Blue: #81D4FA (Offset: -40px) */
{ id:'yo1', color:'#81D4FA', final:{left:400, top:116, rotate:0, width:60}, initial:{left:-200, top:40}, delay:200 }, // 440 -> 400
{ id:'yo2', color:'#81D4FA', final:{left:424, top:90, rotate:90, width:30}, initial:{left:800, top:0}, delay:600 }, // 464 -> 424
{ id:'yo3', color:'#81D4FA', final:{left:446, top:90, rotate:90, width:30}, initial:{left:-200, top:100}, delay:100 }, // 486 -> 446

/* ㅜ - Soft Purple: #BA68C8 (Offset: -48px) */
{ id:'u1', color:'#BA68C8', final:{left:472, top:94, rotate:0, width:60}, initial:{left:-200, top:20}, delay:800 }, // 520 -> 472
{ id:'u2', color:'#BA68C8', final:{left:507, top:101, rotate:90, width:30}, initial:{left:800, top:100}, delay:300 }, // 555 -> 507

/* ㅠ - Soft Teal: #80CBC4 (Offset: -56px) */
{ id:'yu1', color:'#80CBC4', final:{left:544, top:94, rotate:0, width:60}, initial:{left:-200, top:40}, delay:500 }, // 600 -> 544
{ id:'yu2', color:'#80CBC4', final:{left:568, top:101, rotate:90, width:30}, initial:{left:800, top:0}, delay:700 }, // 624 -> 568
{ id:'yu3', color:'#80CBC4', final:{left:590, top:101, rotate:90, width:30}, initial:{left:-200, top:150}, delay:200 }, // 646 -> 590

/* ㅡ - Soft Pink: #F48FB1 (Offset: -64px) */
{ id:'eu1', color:'#F48FB1', final:{left:616, top:105, rotate:0, width:60}, initial:{left:-200, top:10}, delay:400 }, // 680 -> 616

/* ㅣ - Soft Deep Purple: #9575CD (Offset: -72px) */
{ id:'i1', color:'#9575CD', final:{left:704, top:80, rotate:90, width:60}, initial:{left:800, top:20}, delay:0 } // 776 -> 704

];

/* ============================================================
   6. 헬퍼: 공통 floating 시작 함수
============================================================ */
function startFloatingPiece($elem) {
    if (pickedPiece) {
        pickedPiece.remove();
        $(document).off("mousemove", mouseMoveHandler);
    }

    pickedPiece = $elem.addClass("floating-piece").css({
        position: "fixed",
        pointerEvents: "none",
        opacity: 0.9,
        zIndex: 99999
    });

    mouseMoveHandler = e => {
        pickedPiece.css({
            left: e.clientX - pickedPiece.width() / 2 + "px",
            top: e.clientY - pickedPiece.height() / 2 + "px"
        });
    };

    $(document).on("mousemove", mouseMoveHandler);
}

/* ============================================================
   7. 그룹 단위 픽업 (자음/모음 전체)
============================================================ */
function pickLetterGroupFromSource($elem) {
    if (eraserMode) return;

    const id = $elem.attr("id") || $elem.data("id");
    if (!id) return;

    // ✔ prefix를 _ 기준으로 구분 → ㄱ,ㄴ,ㄷ,ㅎ,ㅏ,ㅑ 모두 정확
    const key = id.includes("_") ? id.split("_")[0] : id.replace(/[0-9]/g, "");

    const $container = $elem.closest("#consonant-container, #vowel-container");

    // ✔ 해당 key로 시작하는 stroke 전체 자동 선택
    const $parts = $container.find(`.piece[id^="${key}"]`);

    if ($parts.length === 0) {
        pickSingleStrokeFromSource($elem);
        return;
    }

    // ===== 그룹 박스 경계 계산 =====
    let minLeft = Infinity, minTop = Infinity;
    let maxRight = -Infinity, maxBottom = -Infinity;

    $parts.each(function () {
        const $p = $(this);
        const left = parseFloat($p.css("left"));
        const top = parseFloat($p.css("top"));
        const w = $p.outerWidth();
        const h = $p.outerHeight();

        minLeft = Math.min(minLeft, left);
        minTop = Math.min(minTop, top);
        maxRight = Math.max(maxRight, left + w);
        maxBottom = Math.max(maxBottom, top + h);
    });

    const groupWidth = maxRight - minLeft;
    const groupHeight = maxBottom - minTop;

    // ===== wrapper 생성 =====
    const $wrapper = $("<div>")
        .addClass("letter-group placed-piece")
        .css({
            width: groupWidth + "px",
            height: groupHeight + "px"
        });

    // ===== 내부 stroke/원 복제 =====
    $parts.each(function () {
        const $p = $(this);
        const left = parseFloat($p.css("left"));
        const top = parseFloat($p.css("top"));

        const clone = $p.clone()
            .removeClass("piece")
            .css({
                left: (left - minLeft) + "px",
                top: (top - minTop) + "px"
            });

        $wrapper.append(clone);
    });

    $("body").append($wrapper);
    startFloatingPiece($wrapper);
}


/* ============================================================
   8. 단일 stroke / circle 픽업
============================================================ */
function pickSingleStrokeFromSource($elem) {
    if (eraserMode) return;

    const original = $elem;

    const clone = original.clone()
        .removeClass("piece")
        .addClass("placed-piece");

    $("body").append(clone);
    startFloatingPiece(clone);
}

/* ============================================================
   9. 클릭 → 복제/이동 + 보드 내 이동 + 삭제 + 모드
============================================================ */
function enableClickCloneMovement() {

    pickedPiece = null;
    mouseMoveHandler = null;

    /* 1) palette 영역의 .piece 클릭 */
    $(document).on("click", ".piece", function () {
        if (eraserMode) return;

        const $this = $(this);

        if (groupMode) {
            pickLetterGroupFromSource($this);
        } else {
            pickSingleStrokeFromSource($this);
        }
    });

    /* 2) 보드 위 .placed-piece 클릭 → 다시 들기 (복사 X) */
    $("#workspace").on("click", ".placed-piece", function (e) {
        if (eraserMode) {
            // 지우개 모드에서는 여기서 삭제
            $(this).remove();
            e.stopPropagation();
            return;
        }

        // 보드 위 조각을 그대로 다시 집어 듦
        startFloatingPiece($(this));
        e.stopPropagation();
    });

    /* 3) 보드 빈 공간 클릭 → 들고 있는 조각 내려놓기 */
    $("#workspace").on("click", function (e) {
        if (!pickedPiece || eraserMode) return;

        const offset = $(this).offset();

        pickedPiece.removeClass("floating-piece").css({
            position: "absolute",
            left: e.pageX - offset.left - pickedPiece.width() / 2 + "px",
            top: e.pageY - offset.top - pickedPiece.height() / 2 + "px",
            pointerEvents: "auto",
            opacity: 1,
            zIndex: ""
        });

        $(this).append(pickedPiece);

        $(document).off("mousemove", mouseMoveHandler);
        pickedPiece = null;
    });

    /* 4) ESC → 현재 들고 있는 조각 취소 */
    $(document).on("keydown", e => {
        if (e.key === "Escape" && pickedPiece) {
            pickedPiece.remove();
            $(document).off("mousemove", mouseMoveHandler);
            pickedPiece = null;
        }
    });
}

/* ============================================================
   10. 실행부
============================================================ */
$(document).ready(() => {
    // 자음/모음 생성 + 애니메이션
    createAndInitialize("#consonant-container", CONSONANT_STROKES);
    createAndInitialize("#vowel-container", VOWEL_STROKES);

    startAnimation(CONSONANT_STROKES);
    startAnimation(VOWEL_STROKES);

    applyScale("#consonant-wrapper", 700);
    applyScale("#vowel-wrapper", 700);

    enableClickCloneMovement();

    /* 모드 토글 버튼 */
    $("#groupModeButton").on("click", function () {
        groupMode = true;
        $("#groupModeButton").addClass("active");
        $("#strokeModeButton").removeClass("active");
    });

    $("#strokeModeButton").on("click", function () {
        groupMode = false;
        $("#strokeModeButton").addClass("active");
        $("#groupModeButton").removeClass("active");
    });

    /* 지우개 / 커서 버튼 */
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

    /* 전체 삭제 버튼 */
    $("#clearWorkspace").on("click", function () {
        $("#workspace").empty();

        if (pickedPiece) {
            pickedPiece.remove();
            pickedPiece = null;
            $(document).off("mousemove", mouseMoveHandler);
        }
    });
});

/* ============================================================
   0. 전역 상태
============================================================ */
let pickedPiece = null;
let mouseMoveHandler = null;
let eraserMode = false;

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

        // ● circle
        if (st.type === "circle") {
            const $circle = $("<div>")
                .addClass("circle piece")
                .attr("id", st.id)            // ★ 반드시 필요!
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
            .attr("id", st.id)              // ★ 반드시 필요!
            .attr("data-id", st.id)
            .css({
                left: st.initial.left,
                top: st.initial.top,
                width: width + "px",
                height: height + "px",
                backgroundColor: st.color,
                transform: `rotate(${st.initial.rotate || 0}deg)`  // ★ 초기 rotate 복원
            });

        box.append($stroke);
    });
}

/* ============================================================
   3. 애니메이션
============================================================ */
const ANIMATION_DURATION = 800;

function startAnimation(data) {
    data.forEach(st => {
        const target = $("#" + st.id);

        target.delay(st.delay)
            .animate({ opacity: 1 }, 20)
            .animate({
                left: st.final.left,
                top: st.final.top
            }, ANIMATION_DURATION, "swing", function () {

                if (st.type !== "circle")
                    $(this).css({
                        transform: `rotate(${st.final.rotate || 0}deg)` // ★ 최종 rotate
                    });

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
   4. 자음 데이터 (랜덤 딜레이, 차분한 밝은 톤 통일)
================================ */
const CONSONANT_STROKES = [

/* 1행 — ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ */

/* ㄱ - Soft Red: #E57373 */
{ id:'g1', color:'#E57373', final:{left:42, top:50, rotate:0}, initial:{left:-200, top:20}, delay:500 },
{ id:'g2', color:'#E57373', final:{left:88, top:58, rotate:90}, initial:{left:800, top:20}, delay:100 },

/* ㄴ - Soft Orange: #FFB74D */
{ id:'n1', color:'#FFB74D', final:{left:132, top:52, rotate:90}, initial:{left:-200, top:80}, delay:300 },
{ id:'n2', color:'#FFB74D', final:{left:124, top:90, rotate:0}, initial:{left:800, top:80}, delay:700 },

/* ㄷ - Light Yellow: #FFEE58 */
{ id:'d1', color:'#FFEE58', final:{left:200, top:50, rotate:0}, initial:{left:-200, top:-50}, delay:200 },
{ id:'d2', color:'#FFEE58', final:{left:206, top:55, rotate:90}, initial:{left:800, top:-50}, delay:0 },
{ id:'d3', color:'#FFEE58', final:{left:200, top:90, rotate:0}, initial:{left:-200, top:150}, delay:800 },

/* ㄹ - Soft Green: #A5D6A7 */
{ id:'r1', color:'#A5D6A7', final:{left:280, top:50, rotate:0, width:30}, initial:{left:-200, top:-20}, delay:600 },
{ id:'r2', color:'#A5D6A7', final:{left:318, top:50, rotate:90, width:30}, initial:{left:800, top:-20}, delay:400 },
{ id:'r3', color:'#A5D6A7', final:{left:280, top:70, rotate:0, width:30}, initial:{left:-200, top:120}, delay:300 },
{ id:'r4', color:'#A5D6A7', final:{left:290, top:70, rotate:90, width:30}, initial:{left:800, top:120}, delay:500 },
{ id:'r5', color:'#A5D6A7', final:{left:288, top:90, rotate:0, width:30}, initial:{left:-200, top:10}, delay:0 },

/* ㅁ - Soft Teal: #80CBC4 */
{ id:'m1', color:'#80CBC4', final:{left:360, top:50, rotate:0}, initial:{left:-200, top:40}, delay:800 },
{ id:'m2', color:'#80CBC4', final:{left:366, top:55, rotate:90}, initial:{left:800, top:40}, delay:100 },
{ id:'m3', color:'#80CBC4', final:{left:360, top:90, rotate:0}, initial:{left:-200, top:100}, delay:200 },
{ id:'m4', color:'#80CBC4', final:{left:405, top:55, rotate:90}, initial:{left:800, top:100}, delay:700 },

/* ㅂ - Soft Blue: #64B5F6 */
{ id:'b1', color:'#64B5F6', final:{left:440, top:67, rotate:0}, initial:{left:-200, top:40}, delay:400 },
{ id:'b2', color:'#64B5F6', final:{left:440, top:90, rotate:0}, initial:{left:800, top:20},  delay:600 },
{ id:'b3', color:'#64B5F6', final:{left:446, top:50, rotate:90, width:46}, initial:{left:-200, top:180}, delay:0 },
{ id:'b4', color:'#64B5F6', final:{left:484, top:50, rotate:90, width:46}, initial:{left:800, top:180}, delay:100 },

/* ㅅ - Soft Deep Purple: #9575CD */
{ id:'s1', color:'#9575CD', final:{left:504, top:94, rotate:-45, width:58}, initial:{left:-300, top:40}, delay:500 },
{ id:'s2', color:'#9575CD', final:{left:537, top:68, rotate:45, width:40}, initial:{left:900, top:40}, delay:800 },


/* 2행 — ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ */

/* ㅇ - Soft Deep Orange: #FF8A65 — 도넛 */
{
    id:'o_circle', type:'circle',
    color:'#FF8A65',
    final:{ left:47, top:149, size:45 },
    initial:{ left:-200, top:-200 },
    delay:300
},

/* ㅈ - Soft Pink: #F48FB1 */
{ id:'j1', color:'#F48FB1', final:{left:120, top:150, rotate:0, width:46}, initial:{left:-200, top:10}, delay:700 },
{ id:'j2', color:'#F48FB1', final:{left:114, top:186, rotate:-45, width:40}, initial:{left:800, top:100}, delay:200 },
{ id:'j3', color:'#F48FB1', final:{left:145, top:159, rotate:45, width:40}, initial:{left:-200, top:150}, delay:0 },

/* ㅊ - Soft Brown: #A1887F */
{ id:'c1', color:'#A1887F', final:{left:203, top:145, rotate:0, width:32}, initial:{left:-200, top:10}, delay:400 },
{ id:'c2', color:'#A1887F', final:{left:197, top:160, rotate:0, width:46}, initial:{left:800, top:20}, delay:600 },
{ id:'c3', color:'#A1887F', final:{left:197, top:185, rotate:-45, width:33}, initial:{left:-200, top:100}, delay:800 },
{ id:'c4', color:'#A1887F', final:{left:221, top:163, rotate:45, width:33}, initial:{left:800, top:150}, delay:100 },

/* ㅋ - Light Amber: #FFCC80 */
{ id:'k1', color:'#FFCC80', final:{left:277, top:150, rotate:0}, initial:{left:-200, top:40}, delay:300 },
{ id:'k2', color:'#FFCC80', final:{left:318, top:150, rotate:90, width:45}, initial:{left:800, top:60}, delay:500 },
{ id:'k3', color:'#FFCC80', final:{left:277, top:170, rotate:0}, initial:{left:-200, top:120}, delay:700 },

/* ㅌ - Light Cyan: #4FC3F7 */
{ id:'t1', color:'#4FC3F7', final:{left:360, top:150, rotate:0}, initial:{left:-200, top:20}, delay:200 },
{ id:'t2', color:'#4FC3F7', final:{left:366, top:150, rotate:90, width:45}, initial:{left:800, top:0}, delay:0 },
{ id:'t3', color:'#4FC3F7', final:{left:360, top:167, rotate:0}, initial:{left:-200, top:180}, delay:800 },
{ id:'t4', color:'#4FC3F7', final:{left:360, top:184, rotate:0}, initial:{left:800, top:180}, delay:600 },

/* ㅍ - Light Lime: #DCE775 */
{ id:'p1', color:'#DCE775', final:{left:436, top:150, rotate:0, width:45}, initial:{left:-200, top:40}, delay:400 },
{ id:'p2', color:'#DCE775', final:{left:436, top:184, rotate:0, width:45}, initial:{left:800, top:20}, delay:100 },
{ id:'p3', color:'#DCE775', final:{left:456, top:156, rotate:90, width:30}, initial:{left:-200, top:160}, delay:700 },
{ id:'p4', color:'#DCE775', final:{left:473, top:156, rotate:90, width:30}, initial:{left:800, top:150}, delay:300 },

/* ㅎ - Light Gray: #BDBDBD */
{
    id:'h_circle', type:'circle',
    color:'#BDBDBD',
    final:{ left:520, top:166, size:30 },
    initial:{ left:-200, top:-200 },
    delay:0
},
{
    id:'h_line1', color:'#BDBDBD',
    final:{ left:514, top:155, rotate:0, width:44 },
    initial:{ left:800, top:150 },
    delay:600
},
{
    id:'h_line2', color:'#BDBDBD',
    final:{ left:520, top:141, rotate:0, width:30 },
    initial:{ left:800, top:150 },
    delay:400
}
];

/* ================================
   5. 모음 데이터 (랜덤 딜레이, 차분한 밝은 톤 통일)
================================ */
const VOWEL_STROKES = [

/* 모음 1줄 — ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ */

/* ㅏ - Light Red: #EF9A9A */
{ id:'a1', color:'#EF9A9A', final:{left:40, top:80, rotate:90, width:60}, initial:{left:-200, top:0}, delay:700 },
{ id:'a2', color:'#EF9A9A', final:{left:40, top:100, rotate:0, width:25}, initial:{left:800, top:20}, delay:200},

/* ㅑ - Light Lime: #C5E1A5 */
{ id:'ya1', color:'#C5E1A5', final:{left:120, top:80, rotate:90, width:60}, initial:{left:-200, top:40}, delay:0 },
{ id:'ya2', color:'#C5E1A5', final:{left:120, top:92, rotate:0, width:25}, initial:{left:800, top:0}, delay:500 },
{ id:'ya3', color:'#C5E1A5', final:{left:120, top:112, rotate:0, width:25}, initial:{left:-200, top:150}, delay:400 },

/* ㅓ - Light Amber: #FFCC80 */
{ id:'eo1', color:'#FFCC80', final:{left:220, top:80, rotate:90, width:60}, initial:{left:-200, top:20}, delay:600 },
{ id:'eo2', color:'#FFCC80', final:{left:184, top:100, rotate:0, width:25}, initial:{left:800, top:20}, delay:100 },

/* ㅕ - Soft Deep Orange: #FF8A65 */
{ id:'yeo1', color:'#FF8A65', final:{left:300, top:80, rotate:90, width:60}, initial:{left:-200, top:0}, delay:300 },
{ id:'yeo2', color:'#FF8A65', final:{left:264, top:92, rotate:0, width:25}, initial:{left:800, top:100}, delay:800 },
{ id:'yeo3', color:'#FF8A65', final:{left:264, top:112, rotate:0, width:25}, initial:{left:-200, top:120}, delay:500 },

/* ㅗ - Soft Brown: #A1887F */
{ id:'o_v1', color:'#A1887F', final:{left:350, top:120, rotate:0, width:60}, initial:{left:-200, top:60}, delay:0 },
{ id:'o_v2', color:'#A1887F', final:{left:385, top:90, rotate:90, width:30}, initial:{left:800, top:10}, delay:400 },

/* ㅛ - Light Blue: #81D4FA */
{ id:'yo1', color:'#81D4FA', final:{left:440, top:120, rotate:0, width:60}, initial:{left:-200, top:40}, delay:200 },
{ id:'yo2', color:'#81D4FA', final:{left:464, top:90, rotate:90, width:30}, initial:{left:800, top:0}, delay:600 },
{ id:'yo3', color:'#81D4FA', final:{left:486, top:90, rotate:90, width:30}, initial:{left:-200, top:100}, delay:100 },

/* ㅜ - Soft Purple: #BA68C8 */
{ id:'u1', color:'#BA68C8', final:{left:520, top:90, rotate:0, width:60}, initial:{left:-200, top:20}, delay:800 },
{ id:'u2', color:'#BA68C8', final:{left:555, top:101, rotate:90, width:30}, initial:{left:800, top:100}, delay:300 },

/* ㅠ - Soft Teal: #80CBC4 */
{ id:'yu1', color:'#80CBC4', final:{left:600, top:90, rotate:0, width:60}, initial:{left:-200, top:40}, delay:500 },
{ id:'yu2', color:'#80CBC4', final:{left:624, top:101, rotate:90, width:30}, initial:{left:800, top:0}, delay:700 },
{ id:'yu3', color:'#80CBC4', final:{left:646, top:101, rotate:90, width:30}, initial:{left:-200, top:150}, delay:200 },

/* ㅡ - Soft Pink: #F48FB1 */
{ id:'eu1', color:'#F48FB1', final:{left:680, top:105, rotate:0, width:60}, initial:{left:-200, top:10}, delay:400 },

/* ㅣ - Soft Deep Purple: #9575CD */
{ id:'i1', color:'#9575CD', final:{left:776, top:80, rotate:90, width:60}, initial:{left:800, top:20}, delay:0 }

];

/* ============================================================
   4. 드래그 + 복제 + 보드 이동 + 교체 기능
============================================================ */
function enableClickCloneMovement() {

    pickedPiece = null;
    mouseMoveHandler = null;

    /* --------------------------------------------------------
       1) 원본(piece)을 클릭하면 → 복제된 조각을 집어 듦
    -------------------------------------------------------- */
    $(document).on("click", ".piece", function () {

        // 이미 들고 있다면 교체
        if (pickedPiece) {
            pickedPiece.remove();
            $(document).off("mousemove", mouseMoveHandler);
        }

        const original = $(this);

        pickedPiece = original.clone()
            .removeClass("piece")
            .addClass("placed-piece floating-piece")
            .css({
                position: "fixed",
                pointerEvents: "none",
                opacity: 0.9,
                zIndex: 99999,
                transform: original.css("transform")
            });

        $("body").append(pickedPiece);

        mouseMoveHandler = e => {
            pickedPiece.css({
                left: e.clientX - pickedPiece.width() / 2 + "px",
                top: e.clientY - pickedPiece.height() / 2 + "px"
            });
        };

        $(document).on("mousemove", mouseMoveHandler);
    });

    /* --------------------------------------------------------
       2) 보드 안의 조각 클릭 → 그대로 다시 집어 듦(복사 X)
    -------------------------------------------------------- */
    $("#workspace").on("click", ".placed-piece", function (e) {

        if (eraserMode) return; // 지우개 모드에서는 삭제 우선

        // 이미 들고 있다면 교체
        if (pickedPiece) {
            pickedPiece.remove();
            $(document).off("mousemove", mouseMoveHandler);
        }

        const elem = $(this);

        pickedPiece = elem
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

    /* --------------------------------------------------------
       3) 보드 클릭 → floating-piece를 내려놓음
    -------------------------------------------------------- */
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

    /* --------------------------------------------------------
       4) 지우개 모드에서 클릭 → 요소 삭제
    -------------------------------------------------------- */
    $("#workspace").on("click", ".placed-piece", function (e) {
        if (eraserMode) {
            $(this).remove();
            e.stopPropagation();
        }
    });

    /* --------------------------------------------------------
       5) ESC → 취소
    -------------------------------------------------------- */
    $(document).on("keydown", e => {
        if (e.key === "Escape" && pickedPiece) {
            pickedPiece.remove();
            $(document).off("mousemove", mouseMoveHandler);
            pickedPiece = null;
        }
    });
}

/* ============================================================
   5. 지우개 모드 버튼 이벤트
============================================================ */

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

/* ============================================================
   6. 전체 삭제
============================================================ */
$("#clearWorkspace").on("click", function () {
    $("#workspace").empty();
});

/* ============================================================
   7. 실행
============================================================ */
$(document).ready(() => {
    createAndInitialize("#consonant-container", CONSONANT_STROKES);
    createAndInitialize("#vowel-container", VOWEL_STROKES);

    startAnimation(CONSONANT_STROKES);
    startAnimation(VOWEL_STROKES);

    applyScale("#consonant-wrapper", 700);
    applyScale("#vowel-wrapper", 700);

    enableClickCloneMovement();
});
/* ==========================================================
   Hangul Builder - language.js
   자유 조합 & 구조 탐색 전용
========================================================== */

// ======================================
// Disable inner scrollbars during intro animation
// ======================================
document.body.classList.add('no-inner-scroll');

setTimeout(() => {
    document.body.classList.remove('no-inner-scroll');
}, 1200); // ← 애니메이션 실제 시간에 맞게


/* ================================
   0. GLOBAL STATE
================================ */
let pickedPiece = null;
let mouseMoveHandler = null;
let eraserMode = false;

const SNAP_DISTANCE = 30; // 스냅 허용 거리(px)

const SLOT_TYPES = {
    INITIAL: 'initial', // 초성
    MEDIAL: 'medial',   // 중성
    FINAL: 'final'      // 종성
};


/* ================================
   STEP 2: Vowel Direction Map
================================ */
const VOWEL_DIRECTION = {
    a: "right",
    ya: "right",
    eo: "right",
    yeo: "right",
    i: "right",

    ov: "bottom",   // ㅗ
    yo: "bottom",
    u: "bottom",
    yu: "bottom",
    eu: "bottom"
};

function getActiveGuides() {
    return Array.from(document.querySelectorAll('.combine-guide')).map(g => {
        const rect = g.getBoundingClientRect();
        return {
            el: g,
            cls: g.classList.contains('vowel-right') ? 'right'
                : g.classList.contains('vowel-bottom') ? 'bottom'
                    : 'final',
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    });
}

function findSnapPosition(pieceEl) {
    const pieceRect = pieceEl.getBoundingClientRect();
    const pieceCenter = {
        x: pieceRect.left + pieceRect.width / 2,
        y: pieceRect.top + pieceRect.height / 2
    };

    const guides = getActiveGuides();

    for (const g of guides) {
        const dist = Math.hypot(pieceCenter.x - g.x, pieceCenter.y - g.y);
        if (dist < SNAP_DISTANCE) {
            return g;
        }
    }
    return null;
}

function getPieceSlotType(pieceEl) {
    const groupKey = pieceEl.dataset.group;

    // 모음이면 무조건 중성
    if (VOWEL_DIRECTION[groupKey]) {
        return SLOT_TYPES.MEDIAL;
    }

    // 자음이면 초성 or 종성 (위치로 판단)
    const rect = pieceEl.getBoundingClientRect();
    const workspaceRect = document.getElementById('workspace').getBoundingClientRect();

    const relativeY = rect.top - workspaceRect.top;

    // 아래쪽에 있으면 종성 취급
    if (relativeY > workspaceRect.height * 0.6) {
        return SLOT_TYPES.FINAL;
    }

    return SLOT_TYPES.INITIAL;
}

function validateHangulStructure() {
    const pieces = Array.from(document.querySelectorAll('#workspace .placed-piece'));

    let hasInitial = false;
    let hasMedial = false;
    let hasFinal = false;

    pieces.forEach(p => {
        const slot = getPieceSlotType(p);
        if (slot === SLOT_TYPES.INITIAL) hasInitial = true;
        if (slot === SLOT_TYPES.MEDIAL) hasMedial = true;
        if (slot === SLOT_TYPES.FINAL) hasFinal = true;
    });

    // ❌ 중성 없이 초성만 있는 경우
    if (hasInitial && !hasMedial) {
        return { valid: false, reason: "중성이 필요합니다" };
    }

    // ❌ 종성만 있는 경우
    if (!hasInitial && hasFinal) {
        return { valid: false, reason: "초성이 필요합니다" };
    }

    return { valid: true };
}



/* ================================
   1. RESPONSIVE SCALE
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
    applyScale("#consonant-wrapper", 720);
    applyScale("#vowel-wrapper", 820);
});

/* ================================
   2. CREATE STROKES
================================ */
function createAndInitialize(containerSelector, data) {
    const box = $(containerSelector).empty();

    data.forEach(st => {
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

        const width = st.final.width || 40;

        const $stroke = $("<div>")
            .addClass("stroke")
            .attr("id", st.id)
            .css({
                left: st.initial.left,
                top: st.initial.top,
                width: width + "px",
                backgroundColor: st.color,
                transform: `rotate(${st.initial.rotate || 0}deg)`
            });

        box.append($stroke);
    });
}

/* ================================
   3. INTRO ANIMATION
================================ */
const ANIMATION_DURATION = 500;

function startAnimation(data) {
    data.forEach(st => {
        const $el = $("#" + st.id);
        $el
            .delay(st.delay || 0)
            .animate({ opacity: 1 }, 30)
            .animate(
                { left: st.final.left, top: st.final.top },
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
    { id: 'g1', color: '#E57373', final: { left: 48, top: 55, rotate: 0 }, initial: { left: -200, top: 20 }, delay: 500 },
    { id: 'g2', color: '#E57373', final: { left: 88, top: 60, rotate: 90 }, initial: { left: 800, top: 20 }, delay: 100 },

    /* ㄴ */
    { id: 'n1', color: '#FFB74D', final: { left: 131, top: 55, rotate: 90 }, initial: { left: -200, top: 80 }, delay: 300 },
    { id: 'n2', color: '#FFB74D', final: { left: 120, top: 90, rotate: 0 }, initial: { left: 800, top: 80 }, delay: 700 },

    /* ㄷ */
    { id: 'd1', color: '#FFEE58', final: { left: 192, top: 52, rotate: 0 }, initial: { left: -200, top: -50 }, delay: 200 },
    { id: 'd2', color: '#FFEE58', final: { left: 203, top: 55, rotate: 90 }, initial: { left: 800, top: -50 }, delay: 0 },
    { id: 'd3', color: '#FFEE58', final: { left: 192, top: 90, rotate: 0 }, initial: { left: -200, top: 150 }, delay: 800 },

    /* ㄹ */
    { id: 'r1', color: '#A5D6A7', final: { left: 268, top: 50, rotate: 0, width: 33 }, initial: { left: -200, top: -20 }, delay: 600 },
    { id: 'r2', color: '#A5D6A7', final: { left: 306, top: 50, rotate: 90, width: 31 }, initial: { left: 800, top: -20 }, delay: 400 },
    { id: 'r3', color: '#A5D6A7', final: { left: 268, top: 70, rotate: 0, width: 33 }, initial: { left: -200, top: 120 }, delay: 300 },
    { id: 'r4', color: '#A5D6A7', final: { left: 278, top: 70, rotate: 90, width: 31 }, initial: { left: 800, top: 120 }, delay: 500 },
    { id: 'r5', color: '#A5D6A7', final: { left: 273, top: 90, rotate: 0, width: 33 }, initial: { left: -200, top: 10 }, delay: 0 },

    /* ㅁ */
    { id: 'm1', color: '#80CBC4', final: { left: 340, top: 52, rotate: 0, width: 47 }, initial: { left: -200, top: 40 }, delay: 800 },
    { id: 'm2', color: '#80CBC4', final: { left: 351, top: 53, rotate: 90, width: 47 }, initial: { left: 800, top: 40 }, delay: 100 },
    { id: 'm3', color: '#80CBC4', final: { left: 340, top: 89, rotate: 0, width: 47 }, initial: { left: -200, top: 100 }, delay: 200 },
    { id: 'm4', color: '#80CBC4', final: { left: 387, top: 53, rotate: 90, width: 47 }, initial: { left: 800, top: 100 }, delay: 700 },

    /* ㅂ */
    { id: 'b1', color: '#64B5F6', final: { left: 420, top: 67, rotate: 0 }, initial: { left: -200, top: 40 }, delay: 400 },
    { id: 'b2', color: '#64B5F6', final: { left: 420, top: 90, rotate: 0 }, initial: { left: 800, top: 20 }, delay: 600 },
    { id: 'b3', color: '#64B5F6', final: { left: 426, top: 50, rotate: 90, width: 51 }, initial: { left: -200, top: 180 }, delay: 0 },
    { id: 'b4', color: '#64B5F6', final: { left: 464, top: 50, rotate: 90, width: 51 }, initial: { left: 800, top: 180 }, delay: 100 },

    /* ㅅ */
    { id: 's1', color: '#9575CD', final: { left: 480, top: 94, rotate: -45, width: 55 }, initial: { left: -300, top: 40 }, delay: 500 },
    { id: 's2', color: '#9575CD', final: { left: 513, top: 68, rotate: 45, width: 40 }, initial: { left: 900, top: 40 }, delay: 800 },

    /* ㅇ */
    {
        id: 'o_circle', type: 'circle', color: '#FF8A65',
        final: { left: 47, top: 149, size: 45 }, initial: { left: -200, top: -200 }, delay: 300
    },

    /* ㅈ */
    { id: 'j1', color: '#F48FB1', final: { left: 116, top: 150, rotate: 0, width: 46 }, initial: { left: -200, top: 10 }, delay: 700 },
    { id: 'j2', color: '#F48FB1', final: { left: 110, top: 185, rotate: -45, width: 38 }, initial: { left: 800, top: 100 }, delay: 200 },
    { id: 'j3', color: '#F48FB1', final: { left: 141, top: 158, rotate: 45, width: 38 }, initial: { left: -200, top: 150 }, delay: 0 },

    /* ㅊ */
    { id: 'c1', color: '#A1887F', final: { left: 195, top: 145, rotate: 0, width: 32 }, initial: { left: -200, top: 10 }, delay: 400 },
    { id: 'c2', color: '#A1887F', final: { left: 188, top: 160, rotate: 0, width: 46 }, initial: { left: 800, top: 20 }, delay: 600 },
    { id: 'c3', color: '#A1887F', final: { left: 187, top: 186, rotate: -45, width: 33 }, initial: { left: -200, top: 100 }, delay: 800 },
    { id: 'c4', color: '#A1887F', final: { left: 212, top: 163, rotate: 45, width: 33 }, initial: { left: 800, top: 150 }, delay: 100 },

    /* ㅋ */
    { id: 'k1', color: '#FFCC80', final: { left: 265, top: 150, rotate: 0 }, initial: { left: -200, top: 40 }, delay: 300 },
    { id: 'k2', color: '#FFCC80', final: { left: 306, top: 150, rotate: 90, width: 45 }, initial: { left: 800, top: 60 }, delay: 500 },
    { id: 'k3', color: '#FFCC80', final: { left: 265, top: 170, rotate: 0 }, initial: { left: -200, top: 120 }, delay: 700 },

    /* ㅌ */
    { id: 't1', color: '#4FC3F7', final: { left: 344, top: 150, rotate: 0 }, initial: { left: -200, top: 20 }, delay: 200 },
    { id: 't2', color: '#4FC3F7', final: { left: 350, top: 150, rotate: 90, width: 45 }, initial: { left: 800, top: 0 }, delay: 0 },
    { id: 't3', color: '#4FC3F7', final: { left: 344, top: 167, rotate: 0 }, initial: { left: -200, top: 180 }, delay: 800 },
    { id: 't4', color: '#4FC3F7', final: { left: 344, top: 184, rotate: 0 }, initial: { left: 800, top: 180 }, delay: 600 },

    /* ㅍ */
    { id: 'p1', color: '#DCE775', final: { left: 416, top: 150, rotate: 0, width: 45 }, initial: { left: -200, top: 40 }, delay: 400 },
    { id: 'p2', color: '#DCE775', final: { left: 416, top: 184, rotate: 0, width: 45 }, initial: { left: 800, top: 20 }, delay: 100 },
    { id: 'p3', color: '#DCE775', final: { left: 436, top: 156, rotate: 90, width: 30 }, initial: { left: -200, top: 160 }, delay: 700 },
    { id: 'p4', color: '#DCE775', final: { left: 453, top: 156, rotate: 90, width: 30 }, initial: { left: 800, top: 150 }, delay: 300 },

    /* ㅎ */
    {
        id: 'h_circle', type: 'circle', color: '#BDBDBD',
        final: { left: 496, top: 166, size: 30 }, initial: { left: -200, top: -200 }, delay: 0
    },
    { id: 'h_line1', color: '#BDBDBD', final: { left: 489, top: 155, rotate: 0, width: 44 }, initial: { left: 800, top: 150 }, delay: 600 },
    { id: 'h_line2', color: '#BDBDBD', final: { left: 496, top: 141, rotate: 0, width: 30 }, initial: { left: 800, top: 150 }, delay: 400 }
];

/* ================================
   5. 모음 데이터
================================ */
const VOWEL_STROKES = [
    /* ㅏ */
    { id: 'a1', color: '#EF9A9A', final: { left: 76, top: 80, rotate: 90, width: 60 }, initial: { left: -200, top: 0 }, delay: 700 },
    { id: 'a2', color: '#EF9A9A', final: { left: 72, top: 100, rotate: 0, width: 25 }, initial: { left: 800, top: 20 }, delay: 200 },

    /* ㅑ */
    { id: 'ya1', color: '#C5E1A5', final: { left: 148, top: 80, rotate: 90, width: 60 }, initial: { left: -200, top: 40 }, delay: 0 },
    { id: 'ya2', color: '#C5E1A5', final: { left: 144, top: 92, rotate: 0, width: 25 }, initial: { left: 800, top: 0 }, delay: 500 },
    { id: 'ya3', color: '#C5E1A5', final: { left: 144, top: 112, rotate: 0, width: 25 }, initial: { left: -200, top: 150 }, delay: 400 },

    /* ㅓ */
    { id: 'eo1', color: '#FFCC80', final: { left: 228, top: 80, rotate: 90, width: 60 }, initial: { left: -200, top: 20 }, delay: 600 },
    { id: 'eo2', color: '#FFCC80', final: { left: 200, top: 100, rotate: 0, width: 25 }, initial: { left: 800, top: 20 }, delay: 100 },

    /* ㅕ */
    { id: 'yeo1', color: '#FF8A65', final: { left: 298, top: 80, rotate: 90, width: 60 }, initial: { left: -200, top: 0 }, delay: 300 },
    { id: 'yeo2', color: '#FF8A65', final: { left: 266, top: 92, rotate: 0, width: 25 }, initial: { left: 800, top: 100 }, delay: 800 },
    { id: 'yeo3', color: '#FF8A65', final: { left: 266, top: 112, rotate: 0, width: 25 }, initial: { left: -200, top: 120 }, delay: 500 },

    /* ㅗ */
    { id: 'o_v1', color: '#A1887F', final: { left: 318, top: 116, rotate: 0, width: 60 }, initial: { left: -200, top: 60 }, delay: 0 },
    { id: 'o_v2', color: '#A1887F', final: { left: 353, top: 90, rotate: 90, width: 30 }, initial: { left: 800, top: 10 }, delay: 400 },

    /* ㅛ */
    { id: 'yo1', color: '#81D4FA', final: { left: 400, top: 116, rotate: 0, width: 60 }, initial: { left: -200, top: 40 }, delay: 200 },
    { id: 'yo2', color: '#81D4FA', final: { left: 424, top: 90, rotate: 90, width: 30 }, initial: { left: 800, top: 0 }, delay: 600 },
    { id: 'yo3', color: '#81D4FA', final: { left: 446, top: 90, rotate: 90, width: 30 }, initial: { left: -200, top: 100 }, delay: 100 },

    /* ㅜ */
    { id: 'u1', color: '#BA68C8', final: { left: 472, top: 94, rotate: 0, width: 60 }, initial: { left: -200, top: 20 }, delay: 800 },
    { id: 'u2', color: '#BA68C8', final: { left: 507, top: 101, rotate: 90, width: 30 }, initial: { left: 800, top: 100 }, delay: 300 },

    /* ㅠ */
    { id: 'yu1', color: '#80CBC4', final: { left: 544, top: 94, rotate: 0, width: 60 }, initial: { left: -200, top: 40 }, delay: 500 },
    { id: 'yu2', color: '#80CBC4', final: { left: 568, top: 101, rotate: 90, width: 30 }, initial: { left: 800, top: 0 }, delay: 700 },
    { id: 'yu3', color: '#80CBC4', final: { left: 590, top: 101, rotate: 90, width: 30 }, initial: { left: -200, top: 150 }, delay: 200 },

    /* ㅡ */
    { id: 'eu1', color: '#F48FB1', final: { left: 616, top: 105, rotate: 0, width: 60 }, initial: { left: -200, top: 10 }, delay: 400 },

    /* ㅣ */
    { id: 'i1', color: '#9575CD', final: { left: 704, top: 80, rotate: 90, width: 60 }, initial: { left: 800, top: 20 }, delay: 0 }
];

/* ------------------------------------------------------------
   6. stroke id → groupKey (자모)
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

/* 역매핑 */
const ID_TO_GROUP_KEY = (() => {
    const map = {};
    Object.entries(LETTER_GROUPS).forEach(([key, ids]) => {
        ids.forEach(id => map[id] = key);
    });
    return map;
})();

/* ================================
   5. DRAG & DROP LOGIC
================================ */
function enableDragInteraction() {

    $(document).on("dragstart", e => e.preventDefault());

    /* A. PICK FROM SOURCE */
    $("#consonant-container, #vowel-container").on("click", ".stroke, .circle", function (e) {
        if (eraserMode) return;

        if (pickedPiece) {
            pickedPiece.remove();
            $(document).off("mousemove", mouseMoveHandler);
        }

        const groupKey = ID_TO_GROUP_KEY[this.id];
        if (!groupKey) return;

        /* ================================
           STEP 1: 자음 기준 결합 가이드
        ================================ */
        const isConsonant = !["a", "ya", "eo", "yeo", "ov", "yo", "u", "yu", "eu", "i"].includes(groupKey);

        const ids = LETTER_GROUPS[groupKey];
        const elements = ids.map(id => $("#" + id)).filter($e => $e.length);

        let minX = Infinity, minY = Infinity;
        elements.forEach($el => {
            minX = Math.min(minX, parseFloat($el.css("left")));
            minY = Math.min(minY, parseFloat($el.css("top")));
        });

        const $group = $("<div>")
            .addClass("letter-group floating-piece")
            .attr("data-group", groupKey)
            .css({
                position: "fixed",
                pointerEvents: "none",
                opacity: 0.95,
                zIndex: 9999
            });

        elements.forEach($el => {
            const clone = $el.clone().removeAttr("id");
            clone.css({
                left: parseFloat($el.css("left")) - minX,
                top: parseFloat($el.css("top")) - minY,
                opacity: 1
            });
            $group.append(clone);
        });

        $("body").append($group);
        pickedPiece = $group;

        // ⭐ STEP 2 가이드 표시 (정확한 위치)
        showCombineGuides(pickedPiece[0]);

        mouseMoveHandler = ev => {
            pickedPiece.css({
                left: ev.clientX - pickedPiece.width() / 2,
                top: ev.clientY - pickedPiece.height() / 2
            });
        };

        $(document).on("mousemove", mouseMoveHandler);
        e.stopPropagation();
    });

    /* B. PLACE ON WORKSPACE */
    $("#workspace").on("click", function (e) {
        if (!pickedPiece) return;

        const offset = $(this).offset();

        let x = e.pageX - offset.left - pickedPiece.width() / 2;
        let y = e.pageY - offset.top - pickedPiece.height() / 2;

        /* ===== STEP 3: SNAP 판정 ===== */
        const snapGuide = findSnapPosition(pickedPiece[0]);

        if (snapGuide) {
            const wRect = this.getBoundingClientRect();
            x = snapGuide.x - wRect.left - pickedPiece.width() / 2;
            y = snapGuide.y - wRect.top - pickedPiece.height() / 2;
        }

        pickedPiece
            .removeClass("floating-piece")
            .addClass("placed-piece")
            .css({
                position: "absolute",
                left: x,
                top: y,
                pointerEvents: "auto",
                zIndex: ""
            });

        $(this).append(pickedPiece);
        pickedPiece = null;

        $(document).off("mousemove", mouseMoveHandler);
        removeCombineGuides();
        $("#workspace-hint").hide();
    });

    const result = validateHangulStructure();

    if (!result.valid) {
        showInvalidMessage(result.reason);
    } else {
        hideInvalidMessage();
    }

    /* C. ERASE */
    $("#workspace").on("click", ".placed-piece", function (e) {
        if (!eraserMode) return;
        $(this).remove();

        if ($("#workspace .placed-piece").length === 0) {
            $("#workspace-hint").show();
        }
        e.stopPropagation();
    });

    /* ESC CANCEL */
    $(document).on("keydown", e => {
        if (e.key === "Escape" && pickedPiece) {
            pickedPiece.remove();
            pickedPiece = null;
            $(document).off("mousemove", mouseMoveHandler);
            removeCombineGuides();
        }
    });

    /* CLEAR */
    $("#clearWorkspace").on("click", () => {
        $("#workspace").empty();
        $("#workspace-hint").show();
        pickedPiece = null;
        $(document).off("mousemove", mouseMoveHandler);
        removeCombineGuides();
    });
}

/* ================================
   6. TOOL BUTTONS
================================ */
function setupToolButtons() {
    $("#eraserButton").on("click", () => {
        eraserMode = true;
        $("body").addClass("eraser-mode");
        $("#eraserButton").addClass("active");
        $("#cursorButton").removeClass("active");
    });

    $("#cursorButton").on("click", () => {
        eraserMode = false;
        $("body").removeClass("eraser-mode");
        $("#cursorButton").addClass("active");
        $("#eraserButton").removeClass("active");
    });
}

/* ================================
   7. INIT
================================ */
$(document).ready(() => {

    createAndInitialize("#consonant-container", CONSONANT_STROKES);
    createAndInitialize("#vowel-container", VOWEL_STROKES);

    startAnimation(CONSONANT_STROKES);
    startAnimation(VOWEL_STROKES);

    applyScale("#consonant-wrapper", 720);
    applyScale("#vowel-wrapper", 820);

    enableDragInteraction();
    setupToolButtons();
});

function removeCombineGuides() {
    document.querySelectorAll('.combine-guide').forEach(el => el.remove());
}

function showCombineGuides(target) {
    removeCombineGuides();

    const workspace = document.getElementById('workspace');
    if (!workspace) return;

    const tRect = target.getBoundingClientRect();
    const wRect = workspace.getBoundingClientRect();

    // 기본은 자음 상태 → 모음 방향 둘 다 허용
    let allowRight = true;
    let allowBottom = true;

    // 만약 마지막에 집은 조각이 모음이면 방향 제한
    const groupKey = target.dataset.group;
    if (groupKey && VOWEL_DIRECTION[groupKey]) {
        allowRight = VOWEL_DIRECTION[groupKey] === "right";
        allowBottom = VOWEL_DIRECTION[groupKey] === "bottom";
    }

    const guides = [];

    if (allowRight) {
        guides.push({
            cls: 'vowel-right',
            left: tRect.right - wRect.left + 6,
            top: tRect.top - wRect.top
        });
    }

    if (allowBottom) {
        guides.push({
            cls: 'vowel-bottom',
            left: tRect.left - wRect.left,
            top: tRect.bottom - wRect.top + 6
        });
    }

    // 종성은 STEP 2에서도 항상 보여줌
    guides.push({
        cls: 'final-bottom',
        left: tRect.right - wRect.left + 6,
        top: tRect.bottom - wRect.top + 6
    });

    guides.forEach(g => {
        const div = document.createElement('div');
        div.className = `combine-guide ${g.cls} show`;
        div.style.left = `${g.left}px`;
        div.style.top = `${g.top}px`;
        workspace.appendChild(div);
    });
}

function showInvalidMessage(msg) {
    let box = document.getElementById('hangul-warning');
    if (!box) {
        box = document.createElement('div');
        box.id = 'hangul-warning';
        box.innerText = msg;
        document.getElementById('workspace').appendChild(box);
    }
    box.innerText = msg;
    box.classList.add('show');
}

function hideInvalidMessage() {
    const box = document.getElementById('hangul-warning');
    if (box) box.remove();
}
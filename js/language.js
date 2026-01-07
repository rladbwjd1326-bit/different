/* ==========================================================
   Hangul Builder - language.js
   FREE BUILD MODE (NO RECOGNITION / NO SLOTS)
========================================================== */

/* ======================================
   Disable inner scrollbars during intro
====================================== */
document.body.classList.add('no-inner-scroll');
setTimeout(() => {
    document.body.classList.remove('no-inner-scroll');
}, 1200);

/* ================================
   GLOBAL STATE
================================ */
let isMoveMode = false;
let pickedPiece = null;
let pickedCustom = null;
let mouseMoveHandler = null;
let eraserMode = false;
let isCustomMode = false;
let selectedCustomElement = null;
let customEraserMode = false;
let customOpacity = 1;
let sheetBgColor = "#ffffff";
let sheetBgOpacity = 1;
let isCropMode = false;

let draggingCustom = null;
let customOffsetX = 0;
let customOffsetY = 0;


function rgbToHex(rgb) {
    if (!rgb) return "#000000";
    const m = rgb.match(/\d+/g);
    if (!m) return "#000000";
    return (
        "#" +
        m.slice(0, 3)
            .map(x => ("0" + parseInt(x).toString(16)).slice(-2))
            .join("")
    );
}

function hexToRgb(hex) {
    let h = hex.replace("#", "").trim();
    if (h.length === 3) h = h.split("").map(c => c + c).join("");

    const bigint = parseInt(h, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function applySheetBackground() {
    const { r, g, b } = hexToRgb(sheetBgColor);
    $("#workspace").css(
        "backgroundColor",
        `rgba(${r}, ${g}, ${b}, ${sheetBgOpacity})`
    );
}

function syncCustomPanel(el) {
    if (!el) return;

    const fillHex = rgbToHex(el.css("background-color"));
    const strokeHex = rgbToHex(el.css("border-color"));

    $("#customFillColor").val(fillHex);
    $("#customFillHex").val(fillHex);

    $("#customStrokeColor").val(strokeHex);
    $("#customStrokeHex").val(strokeHex);

    $("#borderWidthInput").val(parseInt(el.css("border-width")) || 0);
    $("#sizeXInput").val(el.outerWidth());
    $("#sizeYInput").val(el.outerHeight());

    let deg = 0;
    const t = el.css("transform");
    if (t && t !== "none") {
        const v = t.match(/matrix\(([^)]+)\)/);
        if (v) {
            const m = v[1].split(",");
            deg = Math.round(Math.atan2(m[1], m[0]) * (180 / Math.PI));
        }
    }
    $("#rotateInput").val(deg);
}

/* ================================
   THEME SYSTEM
================================ */
let currentTheme = "colorful";



const TETRIS_COLORS = [
    "#00E5FF", // I (cyan)
    "#2979FF", // J (blue)
    "#FF9100", // L (orange)
    "#FFD600", // O (yellow)
    "#00E676", // S (green)
    "#D500F9", // T (purple)
    "#FF1744"  // Z (red)
];

let tetrisIndex = 0;



function resetPieceStyle(el) {
    el
        .removeClass("lego-bar")
        .find(".lego-stud").remove();

    el.css({
        backgroundColor: "transparent",
        backgroundImage: "none",
        backgroundSize: "auto",
        backgroundRepeat: "repeat",
        backgroundPosition: "0 0",
        border: "none",
        borderRadius: "",
        boxShadow: "none",
        position: ""
    });
}

const THEMES = {
    /* 🎨 알록달록 */
    colorful: {
        stroke(el, baseColor) {
            el.css({
                backgroundColor: baseColor,
                borderRadius: "12px",
                backgroundImage: "none",
                boxShadow: "none"
            });
        },
        circle(el, baseColor) {
            el.css({
                backgroundColor: baseColor,   // 🔥 반드시 색을 채운다
                borderRadius: "50%",           // 🔥 원 보장
                border: "none",
                backgroundImage: "none",
                boxShadow: "none"
            });
        }
    },

    /* 🖌 붓글씨 */
    ink: {
        stroke(el) {
            el.css({
                backgroundColor: "transparent",
                backgroundImage: "url('/images/ink-stroke.svg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%"
            });
        },
        circle(el) {
            el.css({
                backgroundColor: "transparent",
                backgroundImage: "url('/images/ink-circle.svg')",
                backgroundSize: "cover",          // ⭐ 핵심
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                border: "none",
                borderRadius: "50%"
            });
        }
    },

    /* 🌳 나무 */
    wood: {
        stroke(el) {
            el.css({
                backgroundColor: "#c99d75ff",
                backgroundImage: "url('/images/wood.svg')",
                backgroundBlendMode: "multiply",
                borderRadius: "0"
            });
        },
        circle(el) {
            el.css({
                backgroundColor: "#c99d75ff",
                backgroundImage: "url('/images/wood.svg')",
                backgroundSize: "cover",          // ⭐ 핵심
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                border: "none",
                borderRadius: "50%"
            });
        }
    },

    /* 🧲 메탈 */
    metal: {
        stroke(el) {
            el.css({
                background:
                    "linear-gradient(90deg, #9ea7ad 0%, #e6ecef 40%, #9ea7ad 100%)",
                borderRadius: "0",
                boxShadow:
                    "inset 1px 1px 2px rgba(255,255,255,0.7), inset -1px -1px 2px rgba(0,0,0,0.35)"
            });
        },
        circle(el) {
            el.css({
                background:
                    "radial-gradient(circle at 30% 30%, #ffffff 0%, #cfd8dc 40%, #8e9aa0 100%)",
                borderRadius: "50%",
                boxShadow:
                    "inset -2px -2px 3px rgba(0,0,0,0.4), inset 2px 2px 3px rgba(255,255,255,0.6)"
            });
        }
    },


    /* 🧱 테트리스 */
    tetris: {
        stroke(el) {
            const color = TETRIS_COLORS[tetrisIndex++ % TETRIS_COLORS.length];

            el.css({
                backgroundColor: color,

                /* 🔥 블록 분할 핵심 */
                backgroundImage: `
                repeating-linear-gradient(
                    90deg,
                    transparent 0,
                    transparent 12px,
                    rgba(0,0,0,0.18) 12px,
                    rgba(0,0,0,0.18) 14px
                ),
                repeating-linear-gradient(
                    180deg,
                    transparent 0,
                    transparent 12px,
                    rgba(255,255,255,0.25) 12px,
                    rgba(255,255,255,0.25) 14px
                )
            `,

                backgroundSize: "14px 14px",
                borderRadius: "0",

                boxShadow: `
                inset -2px -2px 0 rgba(0,0,0,0.25),
                inset 2px 2px 0 rgba(255,255,255,0.35)
            `
            });
        },

        circle(el) {
            const color = TETRIS_COLORS[tetrisIndex++ % TETRIS_COLORS.length];

            el.css({
                backgroundColor: color,               // ✅ 색상 적용
                borderRadius: "50%",
                border: "2px solid rgba(0,0,0,0.35)",
                boxShadow:
                    "inset -2px -2px 0 rgba(0,0,0,0.25), inset 2px 2px 0 rgba(255,255,255,0.35)"
            });
        }
    },


    /* 🎛 커스텀 (다음 단계) */
    custom: {
        stroke(el, baseColor) {
            el.css({
                backgroundColor: baseColor
            });
        },
        circle(el, baseColor) {
            el.css({
                backgroundColor: "transparent",
                borderColor: baseColor
            });
        }
    }
};


/* ================================
   APPLY THEME
================================ */
function applyTheme(themeKey) {
    const theme = THEMES[themeKey];
    if (!theme) return;

    currentTheme = themeKey;

    /* 🔥 추가: workspace에 테마 표식 */
    $("#workspace")
        .removeClass("theme-colorful theme-ink theme-wood theme-metal theme-tetris")
        .addClass(`theme-${themeKey}`);


    // 자음/모음 stroke
    $("#consonant-container .stroke, #vowel-container .stroke").each(function () {
        const baseColor = $(this).data("base-color");

        resetPieceStyle($(this));     // ⭐ 핵심
        theme.stroke($(this), baseColor);
    });

    // 자음/모음 circle
    $("#consonant-container .circle, #vowel-container .circle").each(function () {
        const baseColor = $(this).data("base-color");

        resetPieceStyle($(this));     // ⭐ 핵심
        theme.circle($(this), baseColor);
    });
}



/* ================================
   RESPONSIVE SCALE
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
   CREATE STROKES
================================ */
function createAndInitialize(containerSelector, data) {
    const box = $(containerSelector).empty();

    data.forEach(st => {
        if (st.type === "circle") {
            const $circle = $("<div>")
                .addClass("circle")
                .data("base-color", st.color)
                .attr("id", st.id)
                .css({
                    left: st.initial.left,
                    top: st.initial.top,
                    width: st.final.size + "px",
                    height: st.final.size + "px",

                    /* ✅ 핵심 수정 */
                    backgroundColor: "transparent",
                    border: `10px solid ${st.color}`,
                    borderRadius: "50%",
                    boxSizing: "border-box",

                    opacity: 0
                });
            box.append($circle);
            return;
        }

        const width = st.final.width || 40;

        const $stroke = $("<div>")
            .addClass("stroke")
            .attr("id", st.id)
            .data("base-color", st.color)
            .css({
                left: st.initial.left,
                top: st.initial.top,
                width: width + "px",
                backgroundColor: st.color,
                transform: `rotate(${st.initial.rotate || 0}deg)`,
                opacity: 0
            });

        box.append($stroke);
    });
}

/* ================================
   INTRO ANIMATION
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
   4. 자음 데이터 (그대로 / 누락 없음)
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
   5. 모음 데이터 (전체 / 누락 없음)
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

/* ================================
   LETTER GROUP MAP
================================ */
const LETTER_GROUPS = {
    g: ["g1", "g2"], n: ["n1", "n2"], d: ["d1", "d2", "d3"],
    r: ["r1", "r2", "r3", "r4", "r5"], m: ["m1", "m2", "m3", "m4"],
    b: ["b1", "b2", "b3", "b4"], s: ["s1", "s2"], o: ["o_circle"],
    j: ["j1", "j2", "j3"], c: ["c1", "c2", "c3", "c4"],
    k: ["k1", "k2", "k3"], t: ["t1", "t2", "t3", "t4"],
    p: ["p1", "p2", "p3", "p4"], h: ["h_circle", "h_line1", "h_line2"],
    a: ["a1", "a2"], ya: ["ya1", "ya2", "ya3"], eo: ["eo1", "eo2"],
    yeo: ["yeo1", "yeo2", "yeo3"], ov: ["o_v1", "o_v2"],
    yo: ["yo1", "yo2", "yo3"], u: ["u1", "u2"],
    yu: ["yu1", "yu2", "yu3"], eu: ["eu1"], i: ["i1"]
};

const ID_TO_GROUP_KEY = (() => {
    const map = {};
    Object.entries(LETTER_GROUPS).forEach(([k, ids]) => {
        ids.forEach(id => map[id] = k);
    });
    return map;
})();

/* ================================
   DRAG & DROP (FREE BUILD)
================================ */
function enableDragInteraction() {

    $(document).on("dragstart", e => e.preventDefault());

    $("#consonant-container, #vowel-container").on(
        "click", ".stroke, .circle", function (e) {

            if (isCustomMode) return;

            if (eraserMode) return;

            if (pickedPiece) {
                pickedPiece.remove();
                $(document).off("mousemove", mouseMoveHandler);
            }

            const groupKey = ID_TO_GROUP_KEY[this.id];
            if (!groupKey) return;

            const ids = LETTER_GROUPS[groupKey];
            const elements = ids.map(id => $("#" + id)).filter(el => el.length);

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
                    top: parseFloat($el.css("top")) - minY
                });
                $group.append(clone);
            });

            $("body").append($group);
            pickedPiece = $group;

            mouseMoveHandler = ev => {
                pickedPiece.css({
                    left: ev.clientX - pickedPiece.width() / 2,
                    top: ev.clientY - pickedPiece.height() / 2
                });
            };

            $(document).on("mousemove", mouseMoveHandler);
            e.stopPropagation();
        }
    );

    $("#workspace").on("click", function (e) {

        const offset = $(this).offset();

        /* =========================
           1️⃣ 커스텀 도형 내려놓기
        ========================= */
        if (pickedCustom) {
            const x = e.pageX - offset.left - pickedCustom.outerWidth() / 2;
            const y = e.pageY - offset.top - pickedCustom.outerHeight() / 2;

            pickedCustom
                .addClass("placed-piece")
                .css({
                    position: "absolute",
                    left: x,
                    top: y,
                    pointerEvents: "auto",
                    zIndex: 1
                });

            $(this).append(pickedCustom);

            pickedCustom = null;
            mouseMoveHandler = null;
            $(document).off("mousemove");
            $("#workspace-hint").hide();
            return; // ✅ 커스텀 처리 끝
        }

        /* =========================
           2️⃣ 기존 테마 조합 내려놓기
        ========================= */
        if (!pickedPiece) return;

        pickedPiece
            .addClass("placed-piece")
            .css({
                position: "absolute",
                left: e.pageX - offset.left,
                top: e.pageY - offset.top,
                pointerEvents: "auto",
                zIndex: 1
            });

        $(this).append(pickedPiece);

        pickedPiece = null;
        $(document).off("mousemove", mouseMoveHandler);
        $("#workspace-hint").hide();
    });

    $("#workspace").on("click", ".placed-piece", function (e) {

        /* 🧽 지우개 모드 → 삭제 */
        if (eraserMode) {
            $(this).remove();
            if ($("#workspace .placed-piece").length === 0) {
                $("#workspace-hint").show();
            }
            e.stopPropagation();
            return;
        }

        /* ✋ 이미 집고 있으면 무시 */
        if (pickedPiece) return;

        const $piece = $(this);
        const width = $piece.outerWidth();
        const height = $piece.outerHeight();

        // workspace에서 분리
        $piece.detach();

        // ✅ 바로 마우스 기준으로 고정
        $piece
            .removeClass("placed-piece")
            .addClass("floating-piece")
            .css({
                position: "fixed",
                left: e.clientX - width / 2,
                top: e.clientY - height / 2,
                pointerEvents: "none",
                zIndex: 9999
            });

        $("body").append($piece);
        pickedPiece = $piece;

        // 마우스 따라 이동
        mouseMoveHandler = ev => {
            pickedPiece.css({
                left: ev.clientX - width / 2,
                top: ev.clientY - height / 2
            });
        };

        $(document).on("mousemove", mouseMoveHandler);
        e.stopPropagation();
    });

    $(document).on("keydown", e => {
        if (e.key === "Escape") {

            if (pickedCustom) {
                pickedCustom.remove();
                pickedCustom = null;
            }

            if (pickedPiece) {
                pickedPiece.remove();
                pickedPiece = null;
            }

            $(document).off("mousemove", mouseMoveHandler);
        }
    });

    $("#clearWorkspace").on("click", () => {
        $("#workspace").empty();
        $("#workspace-hint").show();

        pickedPiece = null;
        $(document).off("mousemove", mouseMoveHandler);
    });

    $("#customCanvas").on("dblclick", ".custom-shape", function (e) {
        if (!isMoveMode) return;   // 🔥 이동 모드 아니면 무시
        if (pickedCustom) return;

        const $clone = $(this).clone();
        const offset = $(this).offset();

        $clone
            .removeClass("selected")
            .addClass("floating-piece")
            .css({
                position: "fixed",
                left: offset.left,
                top: offset.top,
                pointerEvents: "none",
                zIndex: 9999
            });

        $("body").append($clone);
        pickedCustom = $clone;

        mouseMoveHandler = ev => {
            pickedCustom.css({
                left: ev.clientX - pickedCustom.outerWidth() / 2,
                top: ev.clientY - pickedCustom.outerHeight() / 2
            });
        };

        $(document).on("mousemove", mouseMoveHandler);
        e.stopPropagation();
    });

    $("#customCanvas").on("mousedown", ".custom-shape", function (e) {
        if (isMoveMode) return;        // 이동모드면 복사용(더블클릭)이라 드래그X
        if (customEraserMode) return;  // 지우개면 드래그X

        draggingCustom = $(this);

        // ✅ pageX/pageY는 문서 기준이므로, 캔버스의 offset을 빼서 "캔버스 내부 좌표"로 맞춘다
        const canvasOffset = $("#customCanvas").offset();
        const pos = draggingCustom.position(); // 캔버스 기준 left/top

        customOffsetX = (e.pageX - canvasOffset.left) - pos.left;
        customOffsetY = (e.pageY - canvasOffset.top) - pos.top;

        e.preventDefault();
    });

    $(document).on("mouseup", function () {
        draggingCustom = null;
    });

}


/* ================================
   TOOL BUTTONS
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
   INIT
================================ */
$(document).ready(() => {
    // ✅ 초기 상태 강제 설정
    isCustomMode = false;
    $("#customLayout").hide();

    $("#consonant-wrapper, #vowel-wrapper").show();
    $("#workspace-wrapper").show();

    createAndInitialize("#consonant-container", CONSONANT_STROKES);
    createAndInitialize("#vowel-container", VOWEL_STROKES);

    startAnimation(CONSONANT_STROKES);
    startAnimation(VOWEL_STROKES);

    applyScale("#consonant-wrapper", 720);
    applyScale("#vowel-wrapper", 820);

    enableDragInteraction();
    setupToolButtons();

    $(".theme-btn").on("click", function () {
        $(".theme-btn").removeClass("active");
        $(this).addClass("active");

        const theme = $(this).data("theme");

        if (theme === "custom") {
            isCustomMode = true;

            $("#source-wrapper").hide();      // 자음/모음 숨김
            $("#customLayout").show();        // 커스텀 표시
            $("#board-area").show();          // 조합시트 유지

            return;
        }

        // 일반 테마
        isCustomMode = false;

        $("#customLayout").hide();
        $("#source-wrapper").show();
        $("#board-area").show();

        applyTheme(theme);
    });

    $("#addCustomStroke").on("click", () => {
        const el = $("<div>")
            .addClass("custom-shape stroke")
            .css({
                width: 80,
                height: 12,
                background: $("#customFillColor").val(),
                border: "0px solid #000000",
                opacity: customOpacity,
                position: "absolute",
                left: 120,
                top: 120
            });

        $("#customCanvas").append(el);
        selectedCustomElement = el;
    });

    $("#addCustomCircle").on("click", () => {
        const el = $("<div>")
            .addClass("custom-shape circle")
            .css({
                width: 60,
                height: 60,
                background: $("#customFillColor").val(),
                borderRadius: "50%",
                opacity: customOpacity,
                position: "absolute",
                left: 140,
                top: 140
            });

        $("#customCanvas").append(el);
        selectedCustomElement = el;
    });

    // 🎨 Fill Color Picker → HEX
    $("#customFillColor").on("input", function () {
        const hex = this.value.toUpperCase();
        $("#customFillHex").val(hex);

        if (selectedCustomElement) {
            selectedCustomElement.css("backgroundColor", hex);
        }
    });

    // 🎨 HEX → Color Picker
    $("#customFillHex").on("input", function () {
        let hex = this.value;
        if (!hex.startsWith("#")) hex = "#" + hex;

        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            hex = hex.toUpperCase();
            $("#customFillColor").val(hex);

            if (selectedCustomElement) {
                selectedCustomElement.css("backgroundColor", hex);
            }
        }
    });

    $("#customCanvas").on("click", ".custom-shape", function (e) {

        // 🧽 커스텀 지우개 모드
        if (customEraserMode) {
            $(this).remove();
            selectedCustomElement = null;
            e.stopPropagation();
            return;
        }

        // 🖱️ 일반 선택
        $(".custom-shape").removeClass("selected");
        $(this).addClass("selected");

        selectedCustomElement = $(this);
        syncCustomPanel(selectedCustomElement);

        e.stopPropagation();
    });


    // 🖊 Stroke Color Picker → HEX
    $("#customStrokeColor").on("input", function () {
        const hex = this.value.toUpperCase();
        $("#customStrokeHex").val(hex);

        if (selectedCustomElement) {
            selectedCustomElement.css("border-color", hex);
        }
    });

    // 🖊 HEX → Stroke Color Picker
    $("#customStrokeHex").on("input", function () {
        let hex = this.value;
        if (!hex.startsWith("#")) hex = "#" + hex;

        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            hex = hex.toUpperCase();
            $("#customStrokeColor").val(hex);

            if (selectedCustomElement) {
                selectedCustomElement.css("border-color", hex);
            }
        }
    });


    $("#borderWidthInput").on("input", function () {
        if (!selectedCustomElement) return;

        const v = Math.max(0, Number(this.value));
        const currentColor =
            selectedCustomElement.css("border-color") || "#000";

        selectedCustomElement.css({
            borderWidth: v,
            borderStyle: "solid",
            borderColor: currentColor
        });
    });

    $(".num-btn[data-type='border']").on("click", function () {
        if (!selectedCustomElement) return;

        const input = $("#borderWidthInput");
        const step = Number($(this).data("step"));
        const v = Math.max(0, Number(input.val()) + step);

        input.val(v).trigger("input");
    });

    $("#sizeXInput, #sizeYInput").on("input", () => {
        if (!selectedCustomElement) return;

        selectedCustomElement.css({
            width: $("#sizeXInput").val(),
            height: $("#sizeYInput").val()
        });
    });

    $("#rotateInput").on("input", function () {
        if (!selectedCustomElement) return;
        selectedCustomElement.css("transform", `rotate(${this.value}deg)`);
    });

    $("#rotatePlus10").on("click", () => {
        if (!selectedCustomElement) return;

        const input = $("#rotateInput");
        const v = Number(input.val()) + 10;

        input.val(v).trigger("input");
    });


    $("#moveModeBtn").on("click", function () {
        isMoveMode = !isMoveMode;
        $(this).toggleClass("active", isMoveMode);
    });

    $("#customEraser").on("click", () => {
        customEraserMode = !customEraserMode;
        $("#customEraser").toggleClass("active", customEraserMode);
    });

    $("#clearCustomCanvas").on("click", () => {
        $("#customCanvas").empty();
        selectedCustomElement = null;
    });

    $("#customCanvas").on("click", function () {
        $(".custom-shape").removeClass("selected");
        selectedCustomElement = null;
    });


    $(".section-toggle").on("click", function () {
        const body = $(this).next(".section-body");

        $(this).toggleClass("open");
        body.toggleClass("collapsed");
    });

    $("#customOpacity").on("input", function () {
        customOpacity = Number(this.value);

        // 선택된 도형이 있으면 즉시 반영
        if (selectedCustomElement) {
            selectedCustomElement.css("opacity", customOpacity);
        }
    });

    let wsBgHex = "#ffffff";
    let wsBgAlpha = 1;

    function applyWorkspaceBg() {
        const { r, g, b } = hexToRgb(wsBgHex);
        $("#workspace").css("backgroundColor", `rgba(${r}, ${g}, ${b}, ${wsBgAlpha})`);
    }

    $("#workspaceBgColor").on("input", function () {
        wsBgHex = this.value;
        applyWorkspaceBg();
    });

    $("#workspaceBgOpacity").on("input", function () {
        wsBgAlpha = Number(this.value);
        applyWorkspaceBg();
    });

    // 초기 1회 적용
    applyWorkspaceBg();

    // 색 변경
    $("#sheetColorInput").on("input", function () {
        sheetBgColor = this.value;
        applySheetBackground();

        // 버튼 색도 동기화
        $("#sheetColorBtn").css("backgroundColor", sheetBgColor);
    });

    $("#sheetOpacityBtn").on("click", () => {
        $("#sheetOpacityWrapper").toggle();
        $("#sheetColorPicker").hide();
    });

    $("#sheetOpacityRange").on("input", function () {
        sheetBgOpacity = Number(this.value);
        applySheetBackground();
    });

    $("#sheetColorBtn").css("backgroundColor", sheetBgColor);

    // 컬러 박스 전체 클릭 시 color input 열기
    $(".color-picker-box").on("click", function () {
        $(this).find("input[type='color']")[0].click();
    });

    const customHelpBtn = document.getElementById("customHelpBtn");
    const customHelpBox = document.getElementById("customHelp");

    customHelpBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        customHelpBox.style.display =
            customHelpBox.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", () => {
        customHelpBox.style.display = "none";
    });

});


/* ================================
   CLOSE EDITOR
================================ */
$(document).on("click", "#closeEditorBtn", () => {
    $("#captureEditor").addClass("editor-hidden");
});



/* ================================
   CROP MODE (EDITOR STYLE)
================================ */
$("#cropModeBtn").on("click", () => {
    isCropMode = true; // ✅ 크롭 모드 ON

    $("#cropOverlay").removeClass("editor-hidden");

    // 🔥 여기서 초기 크롭 위치/크기 계산
    setInitialCropBox();

    // (딤드 마스크 쓰는 경우)
    updateCropMask();
});

/* ================================
   CROP BOX MOVE
================================ */
let movingCrop = false;
let cropMoveStartX = 0;
let cropMoveStartY = 0;
let boxStartLeft = 0;
let boxStartTop = 0;

/* ================================
   CROP UTIL FUNCTIONS
================================ */
function setInitialCropBox() {
    const canvas = $(".editor-canvas");

    const canvasW = canvas.width();
    const canvasH = canvas.height();

    const MARGIN = 30;

    const availableW = canvasW - MARGIN * 2;
    const availableH = canvasH - MARGIN * 2;

    const size = Math.min(availableW, availableH);

    const left = (canvasW - size) / 2;
    const top = (canvasH - size) / 2;

    $("#cropBox").css({
        left: left,
        top: top,
        width: size,
        height: size
    });
}

function updateCropMask() {
    const box = $("#cropBox");
    const overlay = $("#cropOverlay");

    const pos = box.position();
    const w = box.outerWidth();
    const h = box.outerHeight();

    const overlayW = overlay.width();
    const overlayH = overlay.height();

    $(".crop-mask.top").css({
        left: 0,
        top: 0,
        width: overlayW,
        height: pos.top
    });

    $(".crop-mask.bottom").css({
        left: 0,
        top: pos.top + h,
        width: overlayW,
        height: overlayH - (pos.top + h)
    });

    $(".crop-mask.left").css({
        left: 0,
        top: pos.top,
        width: pos.left,
        height: h
    });

    $(".crop-mask.right").css({
        left: pos.left + w,
        top: pos.top,
        width: overlayW - (pos.left + w),
        height: h
    });
}

$(document).on("mousedown", "#cropBox", function (e) {
    if ($(e.target).hasClass("handle")) return;

    e.preventDefault();
    e.stopPropagation();

    movingCrop = true;
    cropMoveStartX = e.clientX;
    cropMoveStartY = e.clientY;

    const pos = $(this).position();
    boxStartLeft = pos.left;
    boxStartTop = pos.top;
});

/* ================================
   CROP BOX RESIZE (HANDLES)
================================ */
let resizing = false;
let resizeDir = "";

// crop 전용 변수
let cropStartX, cropStartY;
let cropStartW, cropStartH;
let cropStartL, cropStartT;

$(document).on("mousedown", ".handle", function (e) {
    e.preventDefault();
    e.stopPropagation();

    resizing = true;
    resizeDir = $(this).attr("class").split(" ")[1];

    const box = $("#cropBox");
    const pos = box.position();

    cropStartX = e.clientX;
    cropStartY = e.clientY;
    cropStartW = box.width();
    cropStartH = box.height();
    cropStartL = pos.left;
    cropStartT = pos.top;
});

/* ================================
   GLOBAL MOUSE MOVE
================================ */
$(document).on("mousemove", function (e) {

    /* 크롭 박스 이동 */
    if (movingCrop) {
        const dx = e.clientX - cropMoveStartX;
        const dy = e.clientY - cropMoveStartY;

        const canvas = $(".editor-canvas");
        const maxLeft = canvas.width() - $("#cropBox").width();
        const maxTop = canvas.height() - $("#cropBox").height();

        let newLeft = boxStartLeft + dx;
        let newTop = boxStartTop + dy;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        $("#cropBox").css({
            left: newLeft,
            top: newTop
        });

        updateCropMask();
    }

    if (draggingCustom) {
        const $canvas = $("#customCanvas");
        const canvasOffset = $canvas.offset();

        let x = (e.pageX - canvasOffset.left) - customOffsetX;
        let y = (e.pageY - canvasOffset.top) - customOffsetY;

        const maxX = $canvas.width() - draggingCustom.outerWidth();
        const maxY = $canvas.height() - draggingCustom.outerHeight();

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        draggingCustom.css({
            left: x,
            top: y
        });
    }

    /* ================================
   크롭 박스 리사이즈 (경계 제한)
================================ */
    if (resizing) {
        const dx = e.clientX - cropStartX;
        const dy = e.clientY - cropStartY;

        const box = $("#cropBox");
        const canvas = $(".editor-canvas");

        const canvasW = canvas.width();
        const canvasH = canvas.height();

        let newW = cropStartW;
        let newH = cropStartH;
        let newL = cropStartL;
        let newT = cropStartT;

        if (resizeDir === "se") {
            newW = cropStartW + dx;
            newH = cropStartH + dy;

            newW = Math.min(newW, canvasW - cropStartL);
            newH = Math.min(newH, canvasH - cropStartT);
        }

        if (resizeDir === "nw") {
            newW = cropStartW - dx;
            newH = cropStartH - dy;
            newL = cropStartL + dx;
            newT = cropStartT + dy;

            if (newL < 0) {
                newW += newL;
                newL = 0;
            }
            if (newT < 0) {
                newH += newT;
                newT = 0;
            }
        }

        if (resizeDir === "ne") {
            newW = cropStartW + dx;
            newH = cropStartH - dy;
            newT = cropStartT + dy;

            newW = Math.min(newW, canvasW - cropStartL);
            if (newT < 0) {
                newH += newT;
                newT = 0;
            }
        }

        if (resizeDir === "sw") {
            newW = cropStartW - dx;
            newH = cropStartH + dy;
            newL = cropStartL + dx;

            if (newL < 0) {
                newW += newL;
                newL = 0;
            }
            newH = Math.min(newH, canvasH - cropStartT);
        }

        // 최소 크기 제한
        const MIN_SIZE = 20;

        if (newW >= MIN_SIZE && newH >= MIN_SIZE) {
            box.css({
                width: newW,
                height: newH,
                left: newL,
                top: newT
            });

            updateCropMask();
        }
    }
});

/* ================================
   GLOBAL MOUSE UP
================================ */
$(document).on("mouseup", function () {
    movingCrop = false;
    resizing = false;
    draggingCustom = null;
});

// 🔥 테트리스 레이어 캡쳐용 함수 (위에 한 번만 선언)
async function captureTetrisLayer() {
    const tetrisLayer = document.getElementById("tetrisLayer");
    if (!tetrisLayer) return null;

    const canvas = await html2canvas(tetrisLayer, {
        backgroundColor: null,
        scale: 2
    });

    return canvas.toDataURL("image/png");
}

/* ================================
   CAPTURE → OPEN EDITOR
================================ */
$("#captureButton").on("click", async () => {

    const target = document.getElementById("workspace");
    if (!target) return;

    const computedStyle = window.getComputedStyle(target);
    const originalBgImage = target.style.backgroundImage;
    const originalBgColor = target.style.backgroundColor;

    target.style.backgroundImage = computedStyle.backgroundImage;
    target.style.backgroundColor = computedStyle.backgroundColor;
    target.classList.add("capture-mode");

    const canvas = await html2canvas(target, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
    });

    target.classList.remove("capture-mode");
    target.style.backgroundImage = originalBgImage;
    target.style.backgroundColor = originalBgColor;

    const dataURL = canvas.toDataURL("image/png");
    window.lastCapturedImage = dataURL;

    const img = document.getElementById("capturedImage");
    img.src = dataURL;

    img.onload = () => {
        $("#captureEditor").removeClass("editor-hidden");
        $("#cropOverlay").removeClass("editor-hidden");
        setInitialCropBox();
        updateCropMask();
    };
});


/* =========================
   APPLY TO T-SHIRT (SIDE PANEL)
========================= */
$("#applyToTshirtBtn").on("click", () => {

    if (!window.lastCapturedImage) {
        alert("먼저 캡쳐를 해주세요!");
        return;
    }

    // 티셔츠 디자인 적용
    document.getElementById("tshirt-design").src =
        window.lastCapturedImage;

    // 티셔츠 모달 열기
    $("#tshirtModal").removeClass("editor-hidden");
});

/* =========================
   T-SHIRT PRINT SCALE
========================= */
$("#printScale").on("input", function () {
    $("#tshirt-design").css("width", $(this).val() + "%");
});

$("#closeTshirtBtn").on("click", () => {
    $("#tshirtModal").addClass("editor-hidden");
});

$("#saveTshirtBtn").on("click", async () => {

    const preview = document.querySelector(".tshirt-capture");

    const canvas = await html2canvas(preview, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
    });

    const link = document.createElement("a");
    link.download = "tshirt_result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});



/* ================================
   SAVE IMAGE (PNG DOWNLOAD)
================================ */
$("#saveImageBtn").on("click", () => {

    const img = document.getElementById("capturedImage");
    if (!img.src) return;

    // 캔버스 생성
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // 원본 해상도 기준
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // 이미지 그리기
    ctx.drawImage(img, 0, 0);

    // 다운로드 링크 생성
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "koreanize_result.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

/* ================================
   APPLY REAL CROP
================================ */
$("#applyCropBtn").on("click", () => {

    const img = document.getElementById("capturedImage");
    if (!img.src) return;

    const cropBox = $("#cropBox");
    const canvasWrap = $(".editor-canvas");

    /* 1️⃣ 화면 기준 좌표 */
    const boxPos = cropBox.position();
    const boxW = cropBox.width();
    const boxH = cropBox.height();

    const canvasW = canvasWrap.width();
    const canvasH = canvasWrap.height();

    /* 2️⃣ 이미지 실제 해상도 */
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    /* 3️⃣ 비율 계산 (중요) */
    const scaleX = imgW / canvasW;
    const scaleY = imgH / canvasH;

    /* 4️⃣ 이미지 기준 크롭 좌표 */
    const sx = boxPos.left * scaleX;
    const sy = boxPos.top * scaleY;
    const sw = boxW * scaleX;
    const sh = boxH * scaleY;

    /* 5️⃣ 캔버스로 실제 크롭 */
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
        img,
        sx, sy, sw, sh,   // source (이미지)
        0, 0, sw, sh      // destination (캔버스)
    );

    /* 6️⃣ 이미지 교체 */
    img.src = canvas.toDataURL("image/png");

    /* 7️⃣ 크롭 UI 정리 */
    $("#cropOverlay").addClass("editor-hidden");

    // ✅ 크롭 모드 OFF
    isCropMode = false;
});

/* =========================
   T-SHIRT PRINT DRAG
========================= */
let isDraggingPrint = false;
let startX, startY, startLeft, startTop;

const print = document.getElementById("tshirt-design");

print.addEventListener("mousedown", (e) => {
    isDraggingPrint = true;
    print.classList.add("dragging");

    startX = e.clientX;
    startY = e.clientY;

    const rect = print.getBoundingClientRect();
    const parentRect = print.parentElement.getBoundingClientRect();

    startLeft = rect.left - parentRect.left;
    startTop = rect.top - parentRect.top;

    e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
    if (!isDraggingPrint) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    print.style.left = `${startLeft + dx}px`;
    print.style.top = `${startTop + dy}px`;
    print.style.transform = "none"; // 자유 이동
});

document.addEventListener("mouseup", () => {
    isDraggingPrint = false;
    print.classList.remove("dragging");
});
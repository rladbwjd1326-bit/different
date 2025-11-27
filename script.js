window.onload = () => {

    const titleReveal = document.getElementById("titleReveal");
    const textTitle = document.querySelector(".title-text");

    const startReveal = document.getElementById("startReveal");
    const textStart = document.querySelector(".start-text");

    /* Koreanize 붓 나타나는 효과 */
    setTimeout(() => {
        titleReveal.style.width = "600px";
    }, 350);

    /* Koreanize 글자 페이드 */
    setTimeout(() => {
        textTitle.style.animation = "textFade 1s ease-out forwards";
    }, 1200);

    /* 시작하기 붓 */
    setTimeout(() => {
        startReveal.style.width = "300px";
    }, 1800);

    /* 시작하기 글자 */
    setTimeout(() => {
        textStart.style.animation = "textFade 1s ease-out forwards";
    }, 2600);

    /* 시작하기 클릭 */
    textStart.addEventListener("click", () => {
        document.body.style.opacity = "0";
        document.body.style.transition = "0.6s";
        setTimeout(() => {
            window.location.href = "main.html";
        }, 600);
    });
};

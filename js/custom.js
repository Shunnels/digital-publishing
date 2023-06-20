// @ts-check

const ids = ["main", "sub1", "sub2"];

/** @type {(url: string) => string} */
const urlNavigate = (url) => url.replace(/^#/, "");
/** @type {() => string} */
const getNavigation = () => urlNavigate(location.hash);

// 네비게이션 관리 연결 이벤트
window.addEventListener("DOMContentLoaded", () => {
    // NOTE: 잘못된 네비게이션 접속 시, 메인 페이지로 이동
    if (!ids.includes(getNavigation())) location.hash = "#main";

    // NOTE: 정적 페이지에서 메뉴 접속 바인딩
    // data-href 속성을 가진 엘리먼트는 클릭 시, 해당 링크로 연결되도록 합니다.
    // data-target 속성에 따라 페이지에 접속하는 방식을 결정합니다.
    // - _blank: 새 페이지 생성
    // - _self: 현 페이지에서 URL 변경
    const dataHrefs = [...document.querySelectorAll("[data-href]")];
    dataHrefs.forEach((element) => {
        const dataHref = element.getAttribute("data-href");
        const hrefTarget = element.getAttribute("data-target") || "_blank";
        element.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!(typeof dataHref === "string")) return;
            switch (hrefTarget) {
                case "_blank":
                    window.open(dataHref);
                    break;
                case "_self":
                    location.href = dataHref;
                    break;
                default:
                    window.open(dataHref);
                    break;
            }
        });
    });
});

// 메뉴 이벤트 활성화 처리 할 메뉴 감지 및 처리
// 네비게이션 위치에 따라 특정 메뉴의 배경 색을 변경하기 위한 코드입니다.
window.addEventListener("DOMContentLoaded", () => {
    const containerUpdater = () => {
        const containers = document.querySelectorAll("div.container");
        containers.forEach((element) => {
            const id = element.getAttribute("id");
            if (!id) return;
            if (id === urlNavigate(location.hash)) {
                // @ts-ignore
                element.style.display = "";
            } else {
                // @ts-ignore
                element.style.display = "none";
            }
        });
    };

    const _interval = () => {
        const menuContents = document.querySelectorAll(".menu_content");
        menuContents.forEach((element) => {
            const url = element.getAttribute("data-href");
            if (url === location.hash) {
                if (!element.className.split(" ").includes("active"))
                    element.className = [
                        ...element.className.split(" "),
                        "active",
                    ].join(" ");
            } else {
                element.className = element.className
                    .split(" ")
                    .filter((e) => !(e === "active"))
                    .join(" ");
            }
        });
    };

    setInterval(containerUpdater, 1000 / 30);
    setInterval(_interval, 1000 / 30);
});

// 이미지 슬라이드 구현
window.addEventListener("DOMContentLoaded", () => {
    const slideImage = () => {
        // 이미지 컴포넌트 배열
        const banners = [
            ...document.querySelectorAll(
                "#main > div > div > div:nth-child(1) > div > img"
            ),
        ];
        // 이미지 가로 크기 추출
        const imageWidths = banners.map((element) => element.clientWidth);
        // 이미지 프레임 컴포넌트
        const imageFrame = document.querySelector(
            "#main > div > div > div:nth-child(1) > div"
        );

        if (!imageFrame) return;
        // data-image-index 지정
        const imageIndex =
            Number(imageFrame.getAttribute("data-image-index")) || 0;
        const nextImageIndex = (imageIndex + 1) % banners.length;

        // NOTE: 각각의 이미지를 구분해 밀어낼 공간
        let frameOffset = 0;
        for (let i = 0; i < nextImageIndex; i++) frameOffset += imageWidths[i];

        // @ts-ignore
        imageFrame.style.transform = `translateX(-${frameOffset}px)`;
    };

    // 시간별 슬라이더 적용
    setInterval(slideImage, 1000);
});

// 레이아웃 시프트 방지를 위한 코드
window.addEventListener("DOMContentLoaded", () => {
    const menuDivs = [
        ...document.querySelectorAll(
            "body > div:nth-child(1) > header > article > div"
        ),
    ];

    // 초기 크기를 고정할 수 있도록 아예 초기 로드 후 CSS로 길이 고정
    menuDivs.forEach((element) => {
        // @ts-ignore
        element.style.height = `${element.clientHeight}px`;
    });
});

// "자주 방문하는 페이지" 활성화/비활성화 코드
window.addEventListener("DOMContentLoaded", () => {
    const _interval = () => {
        const menuContents = document.querySelectorAll(
            ".shortcut_list > .shortcut_content"
        );

        menuContents.forEach((element) => {
            const url = element.getAttribute("data-href") || "main";

            if (url == location.hash) {
                if (!element.className.split(" ").includes("active")) {
                    element.className = [
                        ...element.className.split(" "),
                        "active",
                    ].join(" ");
                }
            } else
                element.className = element.className
                    .split(" ")
                    .filter((e) => !(e === "active"))
                    .join(" ");
        });
    };

    _interval();
    setInterval(_interval, 1000 / 30);
});

// 메인 페이지 메뉴 관리 코드
window.addEventListener("DOMContentLoaded", () => {
    const Chapters = document.querySelectorAll(
        "#main > div > article > nav > div.chapters > div"
    );
    const Articles = document.querySelectorAll(
        "#main > div > article > nav > div.articles > article"
    );

    Chapters.forEach((element, index) => {
        element.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            Chapters.forEach((chapter, i) => {
                if (i === index) {
                    if (!chapter.className.split(" ").includes("active"))
                        chapter.className = [
                            ...chapter.className.split(" "),
                            "active",
                        ].join(" ");
                } else {
                    chapter.className = chapter.className
                        .split(" ")
                        .filter((item) => item !== "active")
                        .join(" ");
                }
            });

            Articles.forEach((article, i) => {
                if (i === index) {
                    if (!article.className.split(" ").includes("active"))
                        article.className = [
                            ...article.className.split(" "),
                            "active",
                        ].join(" ");
                } else {
                    article.className = article.className
                        .split(" ")
                        .filter((item) => item !== "active")
                        .join(" ");
                }
            });
        });
    });

    // @ts-ignore
    // NOTE: 기본적으로 첫번째 쳅터를 활성화 시키기 위한 코드
    Chapters[0].click();
});

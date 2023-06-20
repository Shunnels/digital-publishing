// @ts-check

const ids = ["main", "sub1", "sub2"];

// 모달창 관련 설정
const modalWrapperElement = document.querySelector(
    "body > div.image-modal-wrapper"
);
const modalBackgroundElement = document.querySelector(
    "body > div.modal-bg-frame"
);
const modalImgElement = document.querySelector(
    "body > div.image-modal-wrapper > div > article > img"
);
const modalDescElement = document.querySelector(
    "body > div.image-modal-wrapper > div > article > div > span"
);
// 모달창 닫기 버튼 이벤트 바인딩
const modalCloseBtnElement = document.querySelector(
    "body > div.image-modal-wrapper > div > article > div > div > button"
);

/**
 * 모달창의 이미지 URL을 지정하는 함수
 * @type {(url: string) => void}
 */
const setModalImgUrl = (url) => modalImgElement?.setAttribute("src", url);
/**
 * 모달창의 description 항목을 지정하는 함수
 * @type {(desc: string) => void}
 */
const setModalDesc = (desc) =>
    void (modalDescElement && (modalDescElement.innerHTML = desc));

/** @type {(visibility: boolean) => void} */
const setModalVisibleity = (visibility) => {
    if (!(modalWrapperElement && modalBackgroundElement)) return;
    switch (visibility) {
        case true:
            // @ts-ignore
            modalWrapperElement.style.display = "inherit";
            // @ts-ignore
            modalBackgroundElement.style.display = "inherit";
            break;
        case false:
            // @ts-ignore
            modalWrapperElement.style.display = "none";
            // @ts-ignore
            modalBackgroundElement.style.display = "none";
            break;
    }
};
/**
 * 모달창의 시각화 여부를 반환합니다.
 * @description 반환값이 true라면 보임 상태, 반환값이 false라면 숨김 상태입니다.
 * @type {() => boolean}
 */
const getModalVisibility = () =>
    // @ts-ignore
    !(modalWrapperElement?.style.display !== "none");

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

        imageFrame.setAttribute("data-image-index", String(nextImageIndex));
    };

    // 시간별 슬라이더 적용
    setInterval(slideImage, 5000);
});

// 메뉴바의 레이아웃 시프트 방지를 위한 코드
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

// 슬라이더 이미지 높이 고정 코드
// 두번째 flex로 구성된 이미지 레이아웃의 높이를 참조하여 높이 값을 새롭게 계산, 적용합니다.
window.addEventListener("DOMContentLoaded", () => {
    const bannerElement = document.querySelector("#main > div > div");
    const secondBannerElement = document.querySelector(
        "#main > div > div > div:nth-child(2)"
    );

    if (!bannerElement || !secondBannerElement) return;

    const heightSum = [...secondBannerElement.children].reduce(
        (acc, cur) => acc + cur.clientHeight,
        0
    );

    // @ts-ignore
    bannerElement.style.height = `${heightSum}px`;
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

// 모달창 활성화 처리
// data-modal-image-url: 이미지 URL
// data-modal-desc: 모달 내용
// 둘 모두를 가진 엘리먼트에 대해 클릭 시, 자동으로 모달창을 띄우도록 코드를 작성합니다.
window.addEventListener("DOMContentLoaded", () => {
    const modalAttactedElements = [
        ...document.querySelectorAll("[data-modal-image-url][data-modal-desc]"),
    ];

    modalAttactedElements.forEach((element) => {
        const imageUrl = element.getAttribute("data-modal-image-url") || "";
        const desc = element.getAttribute("data-modal-desc") || "";

        element.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            setModalImgUrl(imageUrl);
            setModalDesc(desc);
            setModalVisibleity(true);
        });
    });
});

// 모달창 '닫기' 버튼 클릭 이벤트 바인딩
// + wrapper element 클릭 시, 모달창 비활성화 하도록 바인딩
window.addEventListener("DOMContentLoaded", () => {
    if (!modalCloseBtnElement) return;
    if (!modalWrapperElement) return;

    // 닫기 버튼
    modalCloseBtnElement.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setModalVisibleity(false);
    });

    // 바탕
    modalWrapperElement.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setModalVisibleity(false);
    });
});

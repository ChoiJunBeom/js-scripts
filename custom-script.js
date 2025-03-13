/* 마우스 액션 및 스크롤 이동 */
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".menu-settings br").forEach(br => br.remove());
})
document.addEventListener('DOMContentLoaded', function () {
    const oldMenuItems = document.querySelectorAll('.old .menu-item');
    const newMenuItems = document.querySelectorAll('.new .menu-item');
    const header = document.querySelector('.fixed-header'); // 고정된 헤더 선택
    let headerHeight = header ? header.offsetHeight : 134; // 초기 헤더 높이
    let isScrolling = false; // 스크롤 중인지 체크

    // 헤더 높이 업데이트 함수
    function updateHeaderHeight() {
        headerHeight = header ? header.offsetHeight : 134;
    }

    // 윈도우 리사이즈 시 헤더 높이 재계산
    window.addEventListener('resize', updateHeaderHeight);

    function setActiveMenu(event) {
        if (isScrolling) return;

        const target = event.target;
        if (target.querySelector('del') || target.closest('del')) return;

        const menuName = target.getAttribute('data-menu');
        if (!menuName) return;

        oldMenuItems.forEach(item => item.classList.remove('active'));
        newMenuItems.forEach(item => item.classList.remove('active'));

        oldMenuItems.forEach(item => {
            if (item.getAttribute('data-menu') === menuName && !item.querySelector('del')) {
                item.classList.add('active');
            }
        });

        newMenuItems.forEach(item => {
            if (item.getAttribute('data-menu') === menuName && !item.querySelector('del')) {
                item.classList.add('active');
            }
        });
    }

    function scrollToVisible(element) {
        if (!element) return;

        updateHeaderHeight(); // 최신 헤더 높이 반영

        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        const targetScroll = elementTop - headerHeight - 20; // 헤더 높이 보정

        isScrolling = true;

        let start = window.scrollY;
        let distance = targetScroll - start;
        let duration = 600; // 스크롤 속도
        let startTime = null;

        function smoothScroll(currentTime) {
            if (!startTime) startTime = currentTime;
            let timeElapsed = currentTime - startTime;
            let progress = Math.min(timeElapsed / duration, 1);
            let easeProgress = progress * (2 - progress);

            window.scrollTo(0, start + distance * easeProgress);

            if (timeElapsed < duration) {
                requestAnimationFrame(smoothScroll);
            } else {
                isScrolling = false;
            }
        }

        requestAnimationFrame(smoothScroll);
    }

    function highlightAndScroll(event) {
        if (isScrolling) return;

        const target = event.target;
        const menuName = target.getAttribute('data-menu');
        if (!menuName) return;

        let matchedItem = null;

        oldMenuItems.forEach(item => item.classList.remove('active-clicked'));
        newMenuItems.forEach(item => item.classList.remove('active-clicked'));

        target.classList.add('active-clicked');
        // 현재 클릭한 메뉴가 oldMenu인지 newMenu인지 체크
        if (target.closest('.old')) {
            // 기존(old) 메뉴 클릭 시 → 변경(new) 메뉴로 이동
            newMenuItems.forEach(item => {
                if (item.getAttribute('data-menu') === menuName && !item.querySelector('del')) {
                    matchedItem = item;
                    item.classList.add('active-clicked');
                }
            });
        } else if (target.closest('.new')) {
            // 변경(new) 메뉴 클릭 시 → 기존(old) 메뉴로 이동
            oldMenuItems.forEach(item => {
                if (item.getAttribute('data-menu') === menuName && !item.querySelector('del')) {
                    matchedItem = item;
                    item.classList.add('active-clicked');
                }
            });
        }

        if (matchedItem) scrollToVisible(matchedItem);
    }

    // 마우스 오버 시 active 효과 적용
    oldMenuItems.forEach(item => {
        item.addEventListener('mouseover', setActiveMenu);
        item.addEventListener('touchstart', setActiveMenu); // 모바일 대응
    });
    newMenuItems.forEach(item => {
        item.addEventListener('mouseover', setActiveMenu);
        item.addEventListener('touchstart', setActiveMenu); // 모바일 대응
    });

    // 클릭 시 스크롤 이동
    oldMenuItems.forEach(item => item.addEventListener('click', highlightAndScroll));
    newMenuItems.forEach(item => item.addEventListener('click', highlightAndScroll));
});






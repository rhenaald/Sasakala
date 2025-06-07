function initializePageFunctionality() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    const nav = document.querySelector("nav");
    if (nav) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 100) {
                nav.classList.add("bg-white/95");
                nav.classList.remove("bg-white/90");
            } else {
                nav.classList.add("bg-white/90");
                nav.classList.remove("bg-white/95");
            }
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll(".card-hover").forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(card);
    });
}

function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    let isMenuOpen = false;

    const storiesDropdownButton = document.getElementById('stories-dropdown-button');
    const storiesDropdownMenu = document.getElementById('stories-dropdown-menu');
    const storiesDropdownIcon = document.getElementById('stories-dropdown-icon');
    let isStoriesDropdownOpen = false;

    if (mobileMenuButton && mobileMenu && menuIcon) {
        mobileMenuButton.addEventListener('click', function (e) {
            e.stopPropagation();
            if (isMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        if (storiesDropdownButton && storiesDropdownMenu && storiesDropdownIcon) {
            storiesDropdownButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                toggleStoriesDropdown();
            });
        }

        document.addEventListener('click', function (event) {
            if (isMenuOpen && !mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                closeMobileMenu();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 768 && isMenuOpen) {
                closeMobileMenu();
            }
        });

        function openMobileMenu() {
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
            menuIcon.className = 'fas fa-times text-xl';
            isMenuOpen = true;
        }

        function closeMobileMenu() {
            mobileMenu.style.maxHeight = '0';
            menuIcon.className = 'fas fa-bars text-xl';
            isMenuOpen = false;

            if (isStoriesDropdownOpen) {
                closeStoriesDropdown();
            }
        }

        function toggleStoriesDropdown() {
            if (isStoriesDropdownOpen) {
                closeStoriesDropdown();
            } else {
                openStoriesDropdown();
            }
        }

        function openStoriesDropdown() {
            storiesDropdownMenu.style.maxHeight = storiesDropdownMenu.scrollHeight + 'px';
            storiesDropdownIcon.className = 'fas fa-chevron-up text-xs';
            isStoriesDropdownOpen = true;

            mobileMenu.style.maxHeight = (mobileMenu.scrollHeight + storiesDropdownMenu.scrollHeight) + 'px';
        }

        function closeStoriesDropdown() {
            storiesDropdownMenu.style.maxHeight = '0';
            storiesDropdownIcon.className = 'fas fa-chevron-down text-xs';
            isStoriesDropdownOpen = false;

            mobileMenu.style.maxHeight = (mobileMenu.scrollHeight - storiesDropdownMenu.scrollHeight) + 'px';
        }
    }
}
function loadComponents() {
    const promises = [];

    const navbarPromise = fetch('/components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });

    const footerPromise = fetch('/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });

    promises.push(navbarPromise, footerPromise);

    Promise.all(promises).then(() => {
        setTimeout(() => {
            initializePageFunctionality();
            initializeMobileMenu();
        }, 100);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadComponents();
});
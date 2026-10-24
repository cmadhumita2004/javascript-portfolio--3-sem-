// ---------- Elements ----------
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const photoFrame = document.getElementById("photoFrame");
const profilePhoto = document.getElementById("profilePhoto");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

// ---------- Dark mode ----------
function setTheme(isDark) {
    document.body.classList.toggle("dark-theme", isDark);
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (error) {
        // Storage is not available, so the choice is not remembered.
    }
}

try {
    setTheme(localStorage.getItem("theme") === "dark");
} catch (error) {
    setTheme(false);
}

themeToggle.addEventListener("click", function () {
    setTheme(!document.body.classList.contains("dark-theme"));
});

// ---------- Mobile menu ----------
menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

// ---------- Photo fallback (shows initials if photo.jpg is missing) ----------
function showInitials() {
    photoFrame.classList.add("no-photo");
}

profilePhoto.addEventListener("error", showInitials);

if (profilePhoto.complete && profilePhoto.naturalWidth === 0) {
    showInitials();
}

// ---------- Contact form (opens the visitor's email app) ----------
contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !message) {
        formMessage.textContent = "Please fill in your name and message.";
        return;
    }

    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(message);

    window.location.href = "mailto:your-email@example.com?subject=" + subject + "&body=" + body;
    formMessage.textContent = "Opening your email app...";
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();


// =====================================================
// Interactive extras
// =====================================================
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("header");
const progressBar = document.getElementById("progressBar");
const toTop = document.getElementById("toTop");

// ---------- Scroll progress, header shadow, back-to-top ----------
function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    progressBar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    header.classList.toggle("scrolled", y > 10);
    toTop.classList.toggle("show", y > 500);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

// ---------- Highlight the nav link of the section on screen ----------
if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section[id]");
    const links = document.querySelectorAll(".nav-links a");

    const navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                links.forEach(function (link) {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === "#" + entry.target.id
                    );
                });
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) {
        navObserver.observe(section);
    });
}

// ---------- Reveal elements as they scroll into view ----------
if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(
        ".section h2, .section > p, .card, .chips li, .form"
    );

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach(function (element) {
        element.classList.add("reveal");

        if (element.matches(".card, .chips li")) {
            const index = Array.from(element.parentElement.children).indexOf(element);
            element.style.setProperty("--delay", index * 0.08 + "s");
        }

        revealObserver.observe(element);
    });
}

// ---------- Typing effect in the hero ----------
const typed = document.getElementById("typed");

if (typed && !reduceMotion) {
    const phrases = [
        "Computer Science student",
        "Aspiring data scientist",
        "Lifelong learner"
    ];
    let phraseIndex = 0;
    let charCount = phrases[0].length;
    let deleting = true;

    function typeStep() {
        const phrase = phrases[phraseIndex];
        charCount += deleting ? -1 : 1;
        typed.textContent = phrase.slice(0, charCount);

        let delay = deleting ? 40 : 80;

        if (!deleting && charCount === phrase.length) {
            deleting = true;
            delay = 1800;
        } else if (deleting && charCount === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(typeStep, delay);
    }

    setTimeout(typeStep, 2000);
}

// ---------- 3D tilt on project cards ----------
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
        card.addEventListener("mousemove", function (event) {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            card.style.setProperty("--ry", x * 8 + "deg");
            card.style.setProperty("--rx", -y * 8 + "deg");
        });

        card.addEventListener("mouseleave", function () {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
        });
    });
}

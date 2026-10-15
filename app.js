
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const searchInput = document.getElementById("searchInput");
const filters = document.querySelectorAll(".filter");
const foodCards = document.querySelectorAll(".food-card");
const emptyMessage = document.getElementById("emptyMessage");
const toast = document.getElementById("toast");

let selectedCategory = "all";
let toastTimer;

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

function filterMenu() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    foodCards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name;

        const matchesCategory =
            selectedCategory === "all" || category === selectedCategory;

        const matchesSearch = name.includes(query);
        const visible = matchesCategory && matchesSearch;

        card.hidden = !visible;

        if (visible) visibleCount++;
    });

    emptyMessage.hidden = visibleCount !== 0;
}

filters.forEach(button => {
    button.addEventListener("click", () => {
        filters.forEach(filter => filter.classList.remove("active"));
        button.classList.add("active");

        selectedCategory = button.dataset.category;
        filterMenu();
    });
});

searchInput.addEventListener("input", filterMenu);

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

document.querySelectorAll(".add-button").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        showToast(
            `${name} — ₹${price}. Demo only; no order was placed.`
        );
    });
});


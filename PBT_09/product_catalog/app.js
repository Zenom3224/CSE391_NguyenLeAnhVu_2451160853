const app = document.querySelector("#app");

function makeImage(label, color1, color2) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${color1}"/><stop offset="1" stop-color="${color2}"/></linearGradient></defs><rect width="400" height="260" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="34" font-weight="700" fill="white">${label}</text></svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

const products = [
    { id: 1, name: "iPhone 16", price: 25990000, category: "phone", image: makeImage("iPhone 16", "#2563eb", "#7c3aed"), rating: 4.5, inStock: true },
    { id: 2, name: "Samsung S24", price: 22990000, category: "phone", image: makeImage("S24", "#0f766e", "#22c55e"), rating: 4.4, inStock: true },
    { id: 3, name: "Pixel 9", price: 19990000, category: "phone", image: makeImage("Pixel 9", "#ea580c", "#facc15"), rating: 4.6, inStock: true },
    { id: 4, name: "Xiaomi 14", price: 16990000, category: "phone", image: makeImage("Xiaomi", "#dc2626", "#fb923c"), rating: 4.2, inStock: true },
    { id: 5, name: "MacBook Pro", price: 45990000, category: "laptop", image: makeImage("MacBook", "#334155", "#94a3b8"), rating: 4.8, inStock: true },
    { id: 6, name: "Dell XPS 15", price: 35990000, category: "laptop", image: makeImage("Dell XPS", "#0369a1", "#38bdf8"), rating: 4.7, inStock: true },
    { id: 7, name: "ThinkPad X1", price: 32990000, category: "laptop", image: makeImage("ThinkPad", "#111827", "#ef4444"), rating: 4.5, inStock: true },
    { id: 8, name: "Asus Zenbook", price: 24990000, category: "laptop", image: makeImage("Zenbook", "#4f46e5", "#06b6d4"), rating: 4.3, inStock: false },
    { id: 9, name: "AirPods Pro", price: 6990000, category: "accessory", image: makeImage("AirPods", "#64748b", "#cbd5e1"), rating: 4.3, inStock: true },
    { id: 10, name: "Galaxy Buds", price: 3490000, category: "accessory", image: makeImage("Buds", "#9333ea", "#f472b6"), rating: 4.1, inStock: true },
    { id: 11, name: "Apple Watch", price: 9990000, category: "accessory", image: makeImage("Watch", "#0891b2", "#67e8f9"), rating: 4.6, inStock: true },
    { id: 12, name: "iPad Air", price: 16990000, category: "tablet", image: makeImage("iPad", "#7c2d12", "#fdba74"), rating: 4.6, inStock: false },
    { id: 13, name: "Xiaomi Pad 6", price: 7990000, category: "tablet", image: makeImage("Pad 6", "#15803d", "#86efac"), rating: 4.2, inStock: true },
    { id: 14, name: "Galaxy Tab S9", price: 21990000, category: "tablet", image: makeImage("Tab S9", "#1d4ed8", "#93c5fd"), rating: 4.7, inStock: true }
];

let state = {
    category: "all",
    search: "",
    sort: "default",
    cartCount: 0
};

function formatMoney(number) {
    return number.toLocaleString("vi-VN") + "đ";
}

function buildLayout() {
    app.className = "app-shell";

    const topbar = document.createElement("header");
    topbar.className = "topbar";

    const brand = document.createElement("div");
    brand.className = "brand";
    const title = document.createElement("h1");
    title.textContent = "Product Catalog";
    const subtitle = document.createElement("p");
    subtitle.textContent = "Render sản phẩm hoàn toàn bằng JavaScript";
    brand.append(title, subtitle);

    const topActions = document.createElement("div");
    topActions.className = "top-actions";

    const themeBtn = document.createElement("button");
    themeBtn.className = "theme-btn";
    themeBtn.textContent = "🌙 Dark mode";
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light mode" : "🌙 Dark mode";
    });

    const cart = document.createElement("button");
    cart.className = "cart";
    cart.innerText = "🛒 Giỏ hàng";
    const badge = document.createElement("span");
    badge.id = "cartBadge";
    badge.className = "badge";
    badge.textContent = "0";
    cart.appendChild(badge);
    topActions.append(themeBtn, cart);
    topbar.append(brand, topActions);

    const controls = document.createElement("section");
    controls.className = "controls";
    const search = document.createElement("input");
    search.id = "searchInput";
    search.className = "search-box";
    search.placeholder = "Tìm sản phẩm...";
    search.addEventListener("input", (e) => {
        state.search = e.target.value.toLowerCase();
        renderProducts();
    });

    const sort = document.createElement("select");
    sort.id = "sortSelect";
    sort.className = "sort-select";
    const options = [
        ["default", "Sắp xếp mặc định"],
        ["price-asc", "Giá tăng"],
        ["price-desc", "Giá giảm"],
        ["name-asc", "Tên A-Z"],
        ["rating-desc", "Đánh giá cao nhất"]
    ];
    options.forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        sort.appendChild(option);
    });
    sort.addEventListener("change", (e) => {
        state.sort = e.target.value;
        renderProducts();
    });
    controls.append(search, sort);

    const categoryBar = document.createElement("section");
    categoryBar.className = "category-bar";
    const categories = ["all", "phone", "laptop", "tablet", "accessory"];
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.className = "category-btn";
        if (category === "all") btn.classList.add("active");
        btn.dataset.category = category;
        btn.textContent = category === "all" ? "Tất cả" : category;
        btn.addEventListener("click", () => filterByCategory(category, btn));
        categoryBar.appendChild(btn);
    });

    const grid = document.createElement("section");
    grid.id = "productGrid";
    grid.className = "product-grid";

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "modalOverlay";
    modalOverlay.className = "modal-overlay";
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    app.append(topbar, controls, categoryBar, grid, modalOverlay);
}

function filterByCategory(category, button) {
    state.category = category;
    document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    renderProducts();
}

function searchProducts(list) {
    if (!state.search) return list;
    return list.filter(product => product.name.toLowerCase().includes(state.search));
}

function sortProducts(list) {
    const copied = [...list];
    if (state.sort === "price-asc") copied.sort((a, b) => a.price - b.price);
    if (state.sort === "price-desc") copied.sort((a, b) => b.price - a.price);
    if (state.sort === "name-asc") copied.sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === "rating-desc") copied.sort((a, b) => b.rating - a.rating);
    return copied;
}

function getVisibleProducts() {
    let visible = [...products];
    if (state.category !== "all") {
        visible = visible.filter(product => product.category === state.category);
    }
    visible = searchProducts(visible);
    visible = sortProducts(visible);
    return visible;
}

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;

    const img = document.createElement("img");
    img.className = "product-img";
    img.src = product.image;
    img.alt = product.name;

    const body = document.createElement("div");
    body.className = "card-body";

    const category = document.createElement("span");
    category.className = "category";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatMoney(product.price);

    const muted = document.createElement("p");
    muted.className = "muted";
    muted.textContent = `⭐ ${product.rating} - ${product.inStock ? "Còn hàng" : "Hết hàng"}`;

    const footer = document.createElement("div");
    footer.className = "card-footer";

    const detail = document.createElement("button");
    detail.className = "theme-btn";
    detail.textContent = "Chi tiết";
    detail.addEventListener("click", () => openModal(product));

    const addBtn = document.createElement("button");
    addBtn.className = "add-cart";
    addBtn.textContent = "Thêm giỏ";
    addBtn.disabled = !product.inStock;
    addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.cartCount++;
        document.querySelector("#cartBadge").textContent = state.cartCount;
    });

    footer.append(detail, addBtn);
    body.append(category, name, price, muted, footer);
    card.append(img, body);
    card.addEventListener("click", () => openModal(product));
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter") openModal(product);
    });
    return card;
}

function renderProducts() {
    const grid = document.querySelector("#productGrid");
    grid.textContent = "";
    const visible = getVisibleProducts();

    if (visible.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "Không tìm thấy sản phẩm phù hợp";
        grid.appendChild(empty);
        return;
    }

    visible.forEach(product => grid.appendChild(createProductCard(product)));
}

function openModal(product) {
    const overlay = document.querySelector("#modalOverlay");
    overlay.textContent = "";
    const modal = document.createElement("div");
    modal.className = "modal";

    const close = document.createElement("button");
    close.className = "close-modal";
    close.textContent = "Đóng";
    close.addEventListener("click", closeModal);

    const title = document.createElement("h2");
    title.textContent = product.name;
    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatMoney(product.price);
    const desc = document.createElement("p");
    desc.textContent = `Danh mục: ${product.category}. Đánh giá: ${product.rating}. Tình trạng: ${product.inStock ? "Còn hàng" : "Hết hàng"}.`;

    modal.append(close, title, price, desc);
    overlay.appendChild(modal);
    overlay.classList.add("open");
}

function closeModal() {
    document.querySelector("#modalOverlay").classList.remove("open");
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

buildLayout();
renderProducts();

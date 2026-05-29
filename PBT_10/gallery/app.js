const gallery = document.querySelector("#gallery");
const statusBox = document.querySelector("#status");
const loadIndicator = document.querySelector("#loadIndicator");
const loadTrigger = document.querySelector("#loadTrigger");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const closeLightbox = document.querySelector("#closeLightbox");

let page = 1;
let isLoading = false;
let hasMore = true;

function showStatus(text, isError = false) {
    statusBox.textContent = text;
    statusBox.className = isError ? "status error" : "status";
}

function hideStatus() {
    statusBox.classList.add("hidden");
}

function demoImage(seed) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='280'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%2360a5fa'/><stop offset='1' stop-color='%23c084fc'/></linearGradient></defs><rect width='420' height='280' fill='url(%23g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='34' fill='white'>Photo ${seed}</text></svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function createPhotoCard(photo) {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.tabIndex = 0;

    const img = document.createElement("img");
    img.alt = photo.author || photo.title || "Gallery photo";
    img.loading = "lazy";
    img.dataset.src = photo.download_url || photo.url;
    img.src = demoImage("...");

    const title = document.createElement("h2");
    title.textContent = photo.author || photo.title || `Photo ${photo.id}`;

    card.append(img, title);
    card.addEventListener("click", () => openLightbox(img.dataset.src, title.textContent));
    card.addEventListener("keydown", event => {
        if (event.key === "Enter") openLightbox(img.dataset.src, title.textContent);
    });
    return card;
}

function renderPhotos(photos) {
    const fragment = document.createDocumentFragment();
    photos.forEach(photo => fragment.appendChild(createPhotoCard(photo)));
    gallery.appendChild(fragment);
    observeLazyImages();
}

async function loadMorePhotos() {
    if (isLoading || !hasMore) return;
    isLoading = true;
    loadIndicator.classList.remove("hidden");

    try {
        const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=20`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const photos = await response.json();

        if (photos.length === 0) {
            hasMore = false;
            showStatus("Đã tải hết ảnh.");
            return;
        }

        hideStatus();
        renderPhotos(photos);
        page++;
    } catch (error) {
        showStatus("Không tải được ảnh từ API. Vui lòng thử lại.", true);
    } finally {
        isLoading = false;
        loadIndicator.classList.add("hidden");
    }
}

const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            lazyObserver.unobserve(img);
        }
    });
});

function observeLazyImages() {
    document.querySelectorAll("img[data-src]").forEach(img => lazyObserver.observe(img));
}

const scrollObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) loadMorePhotos();
});

function openLightbox(src, caption) {
    lightboxImage.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.remove("hidden");
}

function closeModal() {
    lightbox.classList.add("hidden");
}

closeLightbox.addEventListener("click", closeModal);
document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
});

function runDemoMode() {
    const mode = new URLSearchParams(location.search).get("demo");
    if (mode === "loading") {
        loadIndicator.classList.remove("hidden");
        showStatus("Đang tải 20 ảnh đầu tiên...");
        return true;
    }
    if (mode === "error") {
        showStatus("Không tải được gallery do lỗi API hoặc mất mạng.", true);
        return true;
    }
    if (mode === "success") {
        const demoPhotos = Array.from({ length: 12 }, (_, index) => ({
            id: index + 1,
            author: `Tác giả ${index + 1}`,
            download_url: demoImage(index + 1)
        }));
        renderPhotos(demoPhotos);
        hideStatus();
        return true;
    }
    return false;
}

if (!runDemoMode()) {
    scrollObserver.observe(loadTrigger);
    loadMorePhotos();
}

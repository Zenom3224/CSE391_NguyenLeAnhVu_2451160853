function makeImage(label, color1, color2) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${color1}"/><stop offset="1" stop-color="${color2}"/></linearGradient></defs><rect width="900" height="520" fill="url(#g)"/><circle cx="700" cy="110" r="90" fill="rgba(255,255,255,.18)"/><circle cx="160" cy="420" r="120" fill="rgba(255,255,255,.14)"/><text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="54" font-weight="800" fill="white">${label}</text></svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

const images = [
    { title: "Ảnh 1 - Blue Mountain", src: makeImage("Blue Mountain", "#2563eb", "#0f172a") },
    { title: "Ảnh 2 - Purple City", src: makeImage("Purple City", "#7c3aed", "#312e81") },
    { title: "Ảnh 3 - Green Forest", src: makeImage("Green Forest", "#16a34a", "#064e3b") },
    { title: "Ảnh 4 - Orange Sunset", src: makeImage("Orange Sunset", "#ea580c", "#7f1d1d") },
    { title: "Ảnh 5 - Pink Sky", src: makeImage("Pink Sky", "#db2777", "#701a75") },
    { title: "Ảnh 6 - Cyan Lake", src: makeImage("Cyan Lake", "#0891b2", "#164e63") },
    { title: "Ảnh 7 - Golden Sand", src: makeImage("Golden Sand", "#ca8a04", "#713f12") },
    { title: "Ảnh 8 - Dark Night", src: makeImage("Dark Night", "#111827", "#475569") },
    { title: "Ảnh 9 - Red Road", src: makeImage("Red Road", "#dc2626", "#450a0a") }
];

let currentIndex = 0;
let playing = false;
let slideTimer = null;
let activeCommandIndex = 0;

const mainImage = document.querySelector("#mainImage");
const imageCaption = document.querySelector("#imageCaption");
const thumbs = document.querySelector("#thumbs");
const imageModal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");
const palette = document.querySelector("#palette");
const commandInput = document.querySelector("#commandInput");
const commandList = document.querySelector("#commandList");
const playBtn = document.querySelector("#playBtn");

const commands = [
    { name: "Next image", action: nextImage },
    { name: "Previous image", action: prevImage },
    { name: "Open image modal", action: openImageModal },
    { name: "Toggle slideshow", action: toggleSlideshow },
    { name: "Go to first image", action: () => showImage(0) },
    { name: "Go to last image", action: () => showImage(images.length - 1) }
];

function showImage(index) {
    currentIndex = (index + images.length) % images.length;
    const image = images[currentIndex];
    mainImage.src = image.src;
    mainImage.alt = image.title;
    imageCaption.textContent = `${currentIndex + 1}/9 - ${image.title}`;

    document.querySelectorAll(".thumb").forEach((thumb, i) => {
        thumb.classList.toggle("active", i === currentIndex);
    });
}

function nextImage() {
    showImage(currentIndex + 1);
}

function prevImage() {
    showImage(currentIndex - 1);
}

function toggleSlideshow() {
    playing = !playing;
    playBtn.textContent = playing ? "⏸ Pause" : "▶ Play";

    if (playing) {
        slideTimer = setInterval(nextImage, 1400);
    } else {
        clearInterval(slideTimer);
    }
}

function openImageModal() {
    modalImage.src = images[currentIndex].src;
    modalImage.alt = images[currentIndex].title;
    imageModal.classList.add("open");
    document.querySelector("#closeImageModal").focus();
}

function closeImageModal() {
    imageModal.classList.remove("open");
    document.querySelector("#openModal").focus();
}

function buildThumbs() {
    images.forEach((image, index) => {
        const btn = document.createElement("button");
        btn.className = "thumb";
        btn.setAttribute("aria-label", `Chọn ${image.title}`);
        const img = document.createElement("img");
        img.src = image.src;
        img.alt = image.title;
        btn.appendChild(img);
        btn.addEventListener("click", () => showImage(index));
        thumbs.appendChild(btn);
    });
}

function openPalette() {
    palette.classList.add("open");
    commandInput.value = "";
    activeCommandIndex = 0;
    renderCommands();
    commandInput.focus();
}

function closePalette() {
    palette.classList.remove("open");
    document.querySelector("#openPalette").focus();
}

function getFilteredCommands() {
    const keyword = commandInput.value.toLowerCase();
    return commands.filter(command => command.name.toLowerCase().includes(keyword));
}

function renderCommands() {
    const filtered = getFilteredCommands();
    commandList.textContent = "";
    if (activeCommandIndex >= filtered.length) activeCommandIndex = 0;

    filtered.forEach((command, index) => {
        const li = document.createElement("li");
        li.className = "command-item";
        li.tabIndex = 0;
        li.textContent = command.name;
        if (index === activeCommandIndex) li.classList.add("active");
        li.addEventListener("click", () => runCommand(index));
        commandList.appendChild(li);
    });
}

function runCommand(index = activeCommandIndex) {
    const filtered = getFilteredCommands();
    if (!filtered[index]) return;
    filtered[index].action();
    closePalette();
}

document.querySelector("#prevBtn").addEventListener("click", prevImage);
document.querySelector("#nextBtn").addEventListener("click", nextImage);
document.querySelector("#playBtn").addEventListener("click", toggleSlideshow);
document.querySelector("#openModal").addEventListener("click", openImageModal);
document.querySelector("#closeImageModal").addEventListener("click", closeImageModal);
document.querySelector("#openPalette").addEventListener("click", openPalette);
commandInput.addEventListener("input", renderCommands);

commandInput.addEventListener("keydown", (e) => {
    const filtered = getFilteredCommands();
    if (e.key === "ArrowDown") {
        e.preventDefault();
        activeCommandIndex = (activeCommandIndex + 1) % filtered.length;
        renderCommands();
    }
    if (e.key === "ArrowUp") {
        e.preventDefault();
        activeCommandIndex = (activeCommandIndex - 1 + filtered.length) % filtered.length;
        renderCommands();
    }
    if (e.key === "Enter") {
        e.preventDefault();
        runCommand();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
        return;
    }

    if (e.key === "Escape") {
        if (palette.classList.contains("open")) closePalette();
        if (imageModal.classList.contains("open")) closeImageModal();
        return;
    }

    if (palette.classList.contains("open")) return;

    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.code === "Space") {
        e.preventDefault();
        toggleSlideshow();
    }

    const number = Number(e.key);
    if (number >= 1 && number <= 9) showImage(number - 1);
});

palette.addEventListener("click", (e) => {
    if (e.target === palette) closePalette();
});

imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) closeImageModal();
});

buildThumbs();
showImage(0);
renderCommands();

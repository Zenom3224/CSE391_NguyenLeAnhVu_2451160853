const form = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#cityInput");
const message = document.querySelector("#message");
const result = document.querySelector("#result");
const historyList = document.querySelector("#historyList");
const weatherIcon = document.querySelector("#weatherIcon");

let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

const weatherMap = {
    0: { text: "Trời quang", icon: "☀️" },
    1: { text: "Ít mây", icon: "🌤️" },
    2: { text: "Mây rải rác", icon: "⛅" },
    3: { text: "Nhiều mây", icon: "☁️" },
    45: { text: "Sương mù", icon: "🌫️" },
    48: { text: "Sương mù đóng băng", icon: "🌫️" },
    51: { text: "Mưa phùn nhẹ", icon: "🌦️" },
    61: { text: "Mưa nhẹ", icon: "🌧️" },
    63: { text: "Mưa vừa", icon: "🌧️" },
    65: { text: "Mưa to", icon: "⛈️" },
    80: { text: "Mưa rào nhẹ", icon: "🌦️" },
    95: { text: "Có dông", icon: "⛈️" }
};

function showLoading() {
    result.classList.add("hidden");
    message.className = "message loading";
    message.innerHTML = '<span class="spinner"></span><span>Đang tải dữ liệu thời tiết...</span>';
}

function showError(text) {
    result.classList.add("hidden");
    message.className = "message error";
    message.textContent = text;
}

function showSuccess(data) {
    message.classList.add("hidden");
    result.classList.remove("hidden");
    const weather = weatherMap[data.code] || { text: "Không xác định", icon: "🌡️" };
    weatherIcon.textContent = weather.icon;
    result.replaceChildren(
        createInfoCard("Thành phố", data.city),
        createInfoCard("Nhiệt độ", `${data.temperature}°C`),
        createInfoCard("Độ ẩm", `${data.humidity}%`),
        createInfoCard("Thời tiết", weather.text),
        createInfoCard("Gió", `${data.wind} km/h`),
        createInfoCard("Cập nhật", data.time)
    );
}

function createInfoCard(label, value) {
    const card = document.createElement("article");
    card.className = "info-card";

    const span = document.createElement("span");
    span.textContent = label;

    const strong = document.createElement("strong");
    strong.textContent = value;

    card.append(span, strong);
    return card;
}

function saveHistory(city) {
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    history.unshift(city);
    history = history.slice(0, 5);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.replaceChildren();

    if (history.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Chưa có lịch sử tìm kiếm.";
        empty.style.color = "#64748b";
        historyList.appendChild(empty);
        return;
    }

    history.forEach(city => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = city;
        btn.addEventListener("click", () => searchWeather(city));
        historyList.appendChild(btn);
    });
}

async function searchWeather(city) {
    const keyword = city.trim();
    if (!keyword) {
        showError("Vui lòng nhập tên thành phố.");
        return;
    }

    showLoading();

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(keyword)}&count=1&language=vi&format=json`;
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) throw new Error(`HTTP ${geoResponse.status}`);

        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Không tìm thấy thành phố.");
        }

        const place = geoData.results[0];
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) throw new Error(`HTTP ${weatherResponse.status}`);

        const weatherData = await weatherResponse.json();
        showSuccess({
            city: `${place.name}, ${place.country}`,
            temperature: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            code: weatherData.current.weather_code,
            wind: weatherData.current.wind_speed_10m,
            time: weatherData.current.time.replace("T", " ")
        });
        saveHistory(keyword);
    } catch (error) {
        showError(error.message || "Không lấy được dữ liệu thời tiết.");
    }
}

form.addEventListener("submit", event => {
    event.preventDefault();
    searchWeather(cityInput.value);
});

function runDemoMode() {
    const mode = new URLSearchParams(location.search).get("demo");
    if (mode === "loading") {
        showLoading();
        return true;
    }
    if (mode === "error") {
        showError("Không thể kết nối API thời tiết. Vui lòng kiểm tra mạng và thử lại.");
        return true;
    }
    if (mode === "success") {
        history = ["Hanoi", "Da Nang", "Ho Chi Minh"];
        renderHistory();
        showSuccess({ city: "Hà Nội, Việt Nam", temperature: 29, humidity: 78, code: 2, wind: 9, time: "2026-05-29 10:00" });
        return true;
    }
    return false;
}

renderHistory();

if (!runDemoMode()) {
    cityInput.value = "Hanoi";
    searchWeather("Hanoi");
}

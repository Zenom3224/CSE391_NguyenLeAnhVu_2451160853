const refreshBtn = document.querySelector("#refreshBtn");
const summary = document.querySelector("#summary");
const widgetElements = Array.from(document.querySelectorAll(".widget"));

function demoImage(seed) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='220'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%230f766e'/><stop offset='1' stop-color='%2367e8f9'/></linearGradient></defs><rect width='300' height='220' fill='url(%23g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'>Dog ${seed}</text></svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

const apiCalls = [
    {
        name: "users",
        fetchData: () => fetch("https://jsonplaceholder.typicode.com/users").then(check).then(res => res.json())
    },
    {
        name: "weather",
        fetchData: () => fetch("https://api.open-meteo.com/v1/forecast?latitude=21.03&longitude=105.85&current=temperature_2m,relative_humidity_2m,wind_speed_10m").then(check).then(res => res.json())
    },
    {
        name: "country",
        fetchData: () => fetch("https://restcountries.com/v3.1/name/vietnam").then(check).then(res => res.json())
    },
    {
        name: "dog",
        fetchData: () => fetch("https://dog.ceo/api/breeds/image/random/5").then(check).then(res => res.json())
    }
];

function check(response) {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
}

function setAllLoading() {
    widgetElements.forEach(widget => {
        widget.querySelector(".widget-content").innerHTML = '<div class="loading-block"></div>';
    });
    summary.textContent = "Đang gọi song song các API...";
}

function renderWidget(index, data) {
    const widget = widgetElements[index];
    const content = widget.querySelector(".widget-content");
    const name = apiCalls[index].name;

    if (name === "users") {
        content.replaceChildren();
        const p = document.createElement("p");
        p.textContent = `Lấy được ${data.length} users từ JSONPlaceholder.`;
        const list = document.createElement("ul");
        data.slice(0, 5).forEach(user => {
            const li = document.createElement("li");
            li.textContent = `${user.name} - ${user.email}`;
            list.appendChild(li);
        });
        content.append(p, list);
    }

    if (name === "weather") {
        const current = data.current;
        content.innerHTML = `
            <span class="stat">${current.temperature_2m}°C</span>
            <span class="stat">${current.relative_humidity_2m}% ẩm</span>
            <span class="stat">${current.wind_speed_10m} km/h</span>
            <p>Thời tiết hiện tại tại Hà Nội.</p>
        `;
    }

    if (name === "country") {
        const country = data[0];
        content.innerHTML = `
            <p><strong>${country.name.common}</strong></p>
            <p>Thủ đô: ${country.capital?.[0] || "Không rõ"}</p>
            <p>Dân số: ${country.population.toLocaleString("vi-VN")}</p>
            <p>Khu vực: ${country.region}</p>
        `;
    }

    if (name === "dog") {
        content.replaceChildren();
        const grid = document.createElement("div");
        grid.className = "dog-grid";
        data.message.forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.alt = "Random dog";
            grid.appendChild(img);
        });
        content.appendChild(grid);
    }
}

function renderWidgetError(index, message) {
    const content = widgetElements[index].querySelector(".widget-content");
    content.innerHTML = `<div class="error">Widget lỗi: ${message}</div>`;
}

async function loadDashboard() {
    const startTime = Date.now();
    setAllLoading();

    const results = await Promise.allSettled(apiCalls.map(item => item.fetchData()));

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            renderWidget(index, result.value);
        } else {
            renderWidgetError(index, result.reason.message);
        }
    });

    summary.textContent = `Data loaded in ${Date.now() - startTime} ms. Thành công: ${results.filter(r => r.status === "fulfilled").length}/${results.length} API.`;
}

refreshBtn.addEventListener("click", loadDashboard);

function runDemoMode() {
    const mode = new URLSearchParams(location.search).get("demo");
    if (mode === "loading") {
        setAllLoading();
        return true;
    }
    if (mode === "error") {
        summary.textContent = "Một số API lỗi nhưng dashboard vẫn hiển thị widget độc lập.";
        widgetElements.forEach((_, index) => renderWidgetError(index, "Network Error"));
        return true;
    }
    if (mode === "success") {
        const start = Date.now();
        renderWidget(0, [
            { name: "Nguyễn Văn Minh", email: "minh@example.com" },
            { name: "Trần Thị Linh", email: "linh@example.com" },
            { name: "Lê Anh Vũ", email: "vu@example.com" },
            { name: "Phạm Quốc An", email: "an@example.com" },
            { name: "Hoàng Gia Huy", email: "huy@example.com" }
        ]);
        renderWidget(1, { current: { temperature_2m: 29, relative_humidity_2m: 78, wind_speed_10m: 9 } });
        renderWidget(2, [{ name: { common: "Vietnam" }, capital: ["Hanoi"], population: 98186856, region: "Asia" }]);
        renderWidget(3, { message: [demoImage(1), demoImage(2), demoImage(3), demoImage(4), demoImage(5)] });
        summary.textContent = `Data loaded in ${Date.now() - start + 180} ms. Thành công: 4/4 API.`;
        return true;
    }
    return false;
}

if (!runDemoMode()) {
    loadDashboard();
}

const api = {
    baseURL: "https://jsonplaceholder.typicode.com",
    async request(path, options = {}) {
        const response = await fetch(this.baseURL + path, {
            headers: { "Content-Type": "application/json" },
            ...options
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    },
    getUsers() {
        return this.request("/users");
    },
    getUser(id) {
        return this.request(`/users/${id}`);
    },
    createUser(data) {
        return this.request("/users", {
            method: "POST",
            body: JSON.stringify(data)
        });
    },
    updateUser(id, data) {
        return this.request(`/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },
    deleteUser(id) {
        return this.request(`/users/${id}`, {
            method: "DELETE"
        });
    }
};

const usersContainer = document.querySelector("#usersContainer");
const searchInput = document.querySelector("#searchInput");
const userForm = document.querySelector("#userForm");
const userId = document.querySelector("#userId");
const nameInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");
const phoneInput = document.querySelector("#phoneInput");
const companyInput = document.querySelector("#companyInput");
const formTitle = document.querySelector("#formTitle");
const cancelBtn = document.querySelector("#cancelBtn");
const reloadBtn = document.querySelector("#reloadBtn");
const toast = document.querySelector("#toast");

let users = [];

const ui = {
    renderUsers(list) {
        usersContainer.replaceChildren();

        if (list.length === 0) {
            const empty = document.createElement("div");
            empty.className = "error-box";
            empty.textContent = "Không có user phù hợp.";
            usersContainer.appendChild(empty);
            return;
        }

        list.forEach(user => {
            const card = document.createElement("article");
            card.className = "user-card";

            const title = document.createElement("h3");
            title.textContent = user.name;

            const email = document.createElement("p");
            email.textContent = `Email: ${user.email}`;

            const phone = document.createElement("p");
            phone.textContent = `Phone: ${user.phone}`;

            const company = document.createElement("p");
            company.textContent = `Company: ${user.company?.name || user.company || "Chưa có"}`;

            const actions = document.createElement("div");
            actions.className = "card-actions";

            const editBtn = document.createElement("button");
            editBtn.className = "edit";
            editBtn.textContent = "Edit";
            editBtn.dataset.action = "edit";
            editBtn.dataset.id = user.id;

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "danger";
            deleteBtn.textContent = "Delete";
            deleteBtn.dataset.action = "delete";
            deleteBtn.dataset.id = user.id;

            actions.append(editBtn, deleteBtn);
            card.append(title, email, phone, company, actions);
            usersContainer.appendChild(card);
        });
    },
    showLoading() {
        usersContainer.replaceChildren();
        for (let i = 0; i < 6; i++) {
            const skeleton = document.createElement("div");
            skeleton.className = "skeleton";
            usersContainer.appendChild(skeleton);
        }
    },
    hideLoading() {},
    showError(message) {
        usersContainer.replaceChildren();
        const box = document.createElement("div");
        box.className = "error-box";
        box.textContent = message;
        usersContainer.appendChild(box);
    },
    showSuccess(message) {
        toast.className = "toast";
        toast.textContent = message;
        setTimeout(() => toast.classList.add("hidden"), 2200);
    },
    showToastError(message) {
        toast.className = "toast error";
        toast.textContent = message;
        setTimeout(() => toast.classList.add("hidden"), 2600);
    }
};

function normalizeUser(data) {
    return {
        id: data.id || Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: typeof data.company === "object" ? data.company : { name: data.company }
    };
}

async function loadUsers() {
    ui.showLoading();
    try {
        users = await api.getUsers();
        ui.renderUsers(users);
    } catch (error) {
        ui.showError("Không tải được danh sách user từ API.");
    }
}

function filterUsers() {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword)
    );
    ui.renderUsers(filtered);
}

function resetForm() {
    userForm.reset();
    userId.value = "";
    formTitle.textContent = "Thêm người dùng";
}

userForm.addEventListener("submit", async event => {
    event.preventDefault();

    const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        company: companyInput.value.trim()
    };

    try {
        if (userId.value) {
            const updated = normalizeUser(await api.updateUser(userId.value, data));
            users = users.map(user => user.id == userId.value ? updated : user);
            ui.showSuccess("Cập nhật user thành công.");
        } else {
            const created = normalizeUser(await api.createUser(data));
            created.id = Date.now();
            users.unshift(created);
            ui.showSuccess("Thêm user thành công.");
        }
        resetForm();
        filterUsers();
    } catch (error) {
        ui.showToastError("Không lưu được user.");
    }
});

usersContainer.addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const user = users.find(item => item.id == id);

    if (button.dataset.action === "edit" && user) {
        userId.value = user.id;
        nameInput.value = user.name;
        emailInput.value = user.email;
        phoneInput.value = user.phone;
        companyInput.value = user.company?.name || user.company || "";
        formTitle.textContent = "Cập nhật người dùng";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (button.dataset.action === "delete") {
        if (!confirm("Bạn có chắc muốn xóa user này?")) return;
        try {
            await api.deleteUser(id);
            users = users.filter(item => item.id != id);
            ui.renderUsers(users);
            ui.showSuccess("Đã xóa user.");
        } catch (error) {
            ui.showToastError("Không xóa được user.");
        }
    }
});

searchInput.addEventListener("input", filterUsers);
cancelBtn.addEventListener("click", resetForm);
reloadBtn.addEventListener("click", loadUsers);

function runDemoMode() {
    const mode = new URLSearchParams(location.search).get("demo");
    if (mode === "loading") {
        ui.showLoading();
        return true;
    }
    if (mode === "error") {
        ui.showError("API đang lỗi hoặc mất kết nối mạng.");
        return true;
    }
    if (mode === "success") {
        users = [
            { id: 1, name: "Nguyễn Văn Minh", email: "minh@example.com", phone: "0901-234-567", company: { name: "TLU Tech" } },
            { id: 2, name: "Trần Thị Linh", email: "linh@example.com", phone: "0902-345-678", company: { name: "Frontend Lab" } },
            { id: 3, name: "Lê Anh Vũ", email: "vu@example.com", phone: "0903-456-789", company: { name: "Web Team" } }
        ];
        ui.renderUsers(users);
        ui.showSuccess("Tải dữ liệu user thành công.");
        return true;
    }
    return false;
}

if (!runDemoMode()) {
    loadUsers();
}

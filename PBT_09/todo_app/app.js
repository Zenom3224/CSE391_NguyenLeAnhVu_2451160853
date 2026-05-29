const form = document.querySelector("#todoForm");
const input = document.querySelector("#todoInput");
const list = document.querySelector("#todoList");
const countText = document.querySelector("#countText");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.querySelector("#clearCompleted");

let todos = JSON.parse(localStorage.getItem("pbt09_todos")) || [
    { id: 1, text: "Học DOM Manipulation", completed: false },
    { id: 2, text: "Làm Todo App", completed: true },
    { id: 3, text: "Chụp màn hình kết quả", completed: false }
];
let currentFilter = "all";

function saveTodos() {
    localStorage.setItem("pbt09_todos", JSON.stringify(todos));
}

function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (todo.completed) li.classList.add("completed");
    li.dataset.id = String(todo.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "toggle-checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", "Đánh dấu hoàn thành");

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;
    span.title = "Click để hoàn thành, double-click để sửa";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "❌";
    deleteBtn.setAttribute("aria-label", "Xóa todo");

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    return li;
}

function shouldShow(todo) {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
}

function renderTodos() {
    list.textContent = "";
    const visibleTodos = todos.filter(shouldShow);

    if (visibleTodos.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "Không có todo phù hợp";
        list.appendChild(empty);
    } else {
        visibleTodos.forEach(todo => list.appendChild(createTodoElement(todo)));
    }

    const activeCount = todos.filter(todo => !todo.completed).length;
    countText.textContent = `${activeCount} items left`;
    saveTodos();
}

function addTodo(text) {
    const newTodo = {
        id: Date.now(),
        text,
        completed: false
    };
    todos.push(newTodo);
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

function editTodo(id, newText) {
    todos = todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo);
    renderTodos();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTodo(text);
    input.value = "";
    input.focus();
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter(todo => !todo.completed);
    renderTodos();
});

list.addEventListener("click", (e) => {
    const item = e.target.closest(".todo-item");
    if (!item) return;
    const id = Number(item.dataset.id);

    if (e.target.classList.contains("delete-btn")) {
        deleteTodo(id);
        return;
    }

    if (e.target.classList.contains("todo-text") || e.target.classList.contains("toggle-checkbox")) {
        toggleTodo(id);
    }
});

list.addEventListener("dblclick", (e) => {
    if (!e.target.classList.contains("todo-text")) return;

    const item = e.target.closest(".todo-item");
    const id = Number(item.dataset.id);
    const oldText = e.target.textContent;

    const editInput = document.createElement("input");
    editInput.className = "edit-input";
    editInput.value = oldText;
    item.replaceChild(editInput, e.target);
    editInput.focus();
    editInput.select();

    function saveEdit() {
        const newText = editInput.value.trim();
        if (newText) editTodo(id, newText);
        else renderTodos();
    }

    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") saveEdit();
        if (event.key === "Escape") renderTodos();
    });

    editInput.addEventListener("blur", saveEdit);
});

renderTodos();

import { useEffect, useState } from "react";
import TodoItem from "../components/todo/TodoItem.jsx";
import TodoFilter from "../components/todo/TodoFilter.jsx";

function getInitialTodos() {
    const savedTodos = localStorage.getItem("react-basics-v2-todos");
    if (!savedTodos) return [];

    try {
        return JSON.parse(savedTodos);
    } catch {
        return [];
    }
}

function Tier7() {
    const [todos, setTodos] = useState(getInitialTodos);
    const [inputValue, setInputValue] = useState("");
    const [filter, setFilter] = useState("all");
    const [message, setMessage] = useState("");

    useEffect(() => {
        localStorage.setItem("react-basics-v2-todos", JSON.stringify(todos));
    }, [todos]);

    function addTodo() {
        if (inputValue.trim() === "") {
            setMessage("Không được thêm công việc trống.");
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: inputValue.trim(),
            done: false,
            createdAt: new Date().toLocaleString("vi-VN")
        };

        setTodos([newTodo, ...todos]);
        setInputValue("");
        setMessage("Đã thêm công việc mới.");
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            addTodo();
        }
    }

    function toggleTodo(id) {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
        ));
    }

    function deleteTodo(id) {
        setTodos(todos.filter(todo => todo.id !== id));
        setMessage("Đã xóa công việc.");
    }

    function updateTodo(id, newText) {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, text: newText } : todo
        ));
        setMessage("Đã sửa công việc.");
    }

    function clearCompleted() {
        setTodos(todos.filter(todo => !todo.done));
        setMessage("Đã xóa các việc hoàn thành.");
    }

    const filteredTodos = todos.filter(todo => {
        if (filter === "active") return !todo.done;
        if (filter === "completed") return todo.done;
        return true;
    });

    const activeCount = todos.filter(todo => !todo.done).length;
    const completedCount = todos.filter(todo => todo.done).length;

    const placeholder =
        filter === "active"
            ? "Thêm việc chưa xong..."
            : filter === "completed"
                ? "Thêm việc mới sau khi đã xong..."
                : "Nhập công việc...";

    return (
        <div className="tier-box">
            <h1 className="tier-title">Tier 7 - Mini Project Todo App</h1>
            <p className="note">
                Tổng hợp Tier 0-6: component, JSX, props, useState, events, list, CRUD và filter.
            </p>

            <div className="todo-wrap">
                <h2 style={{ textAlign: "center" }}>📋 Todo List</h2>

                <div className="todo-input-row">
                    <input
                        className="input-basic"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                    />
                    <button className="primary-btn" onClick={addTodo}>Thêm</button>
                </div>

                {message && <p className="note">{message}</p>}

                <TodoFilter
                    filter={filter}
                    setFilter={setFilter}
                    total={todos.length}
                    activeCount={activeCount}
                    completedCount={completedCount}
                />

                {filteredTodos.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "34px", color: "#999" }}>
                        {todos.length === 0 ? "📝 Chưa có công việc nào" : "Không có công việc phù hợp"}
                    </div>
                ) : (
                    filteredTodos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onUpdate={updateTodo}
                        />
                    ))
                )}

                {todos.length > 0 && (
                    <div className="section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                        <div>
                            <strong>Tổng:</strong> {todos.length} việc<br />
                            <span>{activeCount} việc chưa hoàn thành</span><br />
                            <span>{completedCount} việc đã xong</span>
                        </div>
                        {completedCount > 0 && (
                            <button className="danger-btn" onClick={clearCompleted}>Xóa việc đã xong</button>
                        )}
                    </div>
                )}

                <p className="muted">Mẹo: double-click vào nội dung todo để sửa nhanh. Dữ liệu được lưu vào localStorage.</p>
            </div>
        </div>
    );
}

export default Tier7;

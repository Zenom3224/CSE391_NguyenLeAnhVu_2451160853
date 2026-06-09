import { useState } from "react";

function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    function saveEdit() {
        if (editText.trim() === "") return;
        onUpdate(todo.id, editText.trim());
        setIsEditing(false);
    }

    function cancelEdit() {
        setEditText(todo.text);
        setIsEditing(false);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") saveEdit();
        if (event.key === "Escape") cancelEdit();
    }

    return (
        <div className={todo.done ? "todo-item done" : "todo-item"}>
            <input
                type="checkbox"
                checked={todo.done}
                onChange={() => onToggle(todo.id)}
            />

            {isEditing ? (
                <input
                    className="input-basic"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    style={{ flex: 1 }}
                />
            ) : (
                <div className={todo.done ? "todo-text done" : "todo-text"} onDoubleClick={() => setIsEditing(true)}>
                    <div>{todo.text}</div>
                    <small className="muted">Tạo lúc: {todo.createdAt}</small>
                </div>
            )}

            {isEditing ? (
                <>
                    <button className="success-btn" onClick={saveEdit}>Lưu</button>
                    <button className="gray-btn" onClick={cancelEdit}>Hủy</button>
                </>
            ) : (
                <>
                    <button className="gray-btn" onClick={() => setIsEditing(true)}>Sửa</button>
                    <button className="danger-btn" onClick={() => onDelete(todo.id)}>🗑</button>
                </>
            )}
        </div>
    );
}

export default TodoItem;

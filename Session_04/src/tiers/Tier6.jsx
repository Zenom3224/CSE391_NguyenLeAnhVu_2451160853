import { useEffect, useRef, useState } from "react";

function ListBasics() {
    const [fruits] = useState(["Táo", "Chuối", "Cam", "Nho"]);
    const [students] = useState([
        { id: 1, name: "Minh", age: 20 },
        { id: 2, name: "An", age: 21 },
        { id: 3, name: "Linh", age: 19 }
    ]);
    const averageAge = students.reduce((sum, student) => sum + student.age, 0) / students.length;

    return (
        <div className="card">
            <h2>Bài 6.1 - Render danh sách</h2>
            <h3>Trái cây</h3>
            <ul>
                {fruits.map((fruit, index) => (
                    <li key={index}>{fruit}</li>
                ))}
            </ul>
            <h3>Sinh viên</h3>
            {students.map((student, index) => (
                <div
                    key={student.id}
                    style={{
                        padding: "8px",
                        margin: "5px 0",
                        background: "#f9f9f9",
                        color: student.age >= 20 ? "green" : "black"
                    }}
                >
                    {index + 1}. {student.name} - {student.age} tuổi
                </div>
            ))}
            <p>Tuổi trung bình: {averageAge.toFixed(1)}</p>
        </div>
    );
}

function CreateItem() {
    const [items, setItems] = useState([
        { id: 1, name: "HTML" },
        { id: 2, name: "CSS" }
    ]);
    const [newName, setNewName] = useState("");
    const [message, setMessage] = useState("");
    const inputRef = useRef(null);

    function handleAdd() {
        if (newName.trim() === "") {
            setMessage("Không được thêm tên trống.");
            inputRef.current?.focus();
            return;
        }

        const newItem = {
            id: Date.now(),
            name: newName.trim()
        };

        setItems([...items, newItem]);
        setNewName("");
        setMessage("Đã thêm thành công!");
        inputRef.current?.focus();
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            handleAdd();
        }
    }

    return (
        <div className="card">
            <h2>Bài 6.2 - CREATE</h2>
            <div className="btn-row">
                <input
                    ref={inputRef}
                    className="input-basic"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tên môn học..."
                />
                <button className="primary-btn" onClick={handleAdd}>➕ Thêm</button>
            </div>
            {message && <p className={message.includes("thành công") ? "good" : "bad"}>{message}</p>}
            <h3>Danh sách ({items.length} môn)</h3>
            {items.map(item => (
                <div key={item.id} style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {item.name}
                </div>
            ))}
        </div>
    );
}

function DeleteItem() {
    const [items, setItems] = useState([
        { id: 1, name: "Minh" },
        { id: 2, name: "An" },
        { id: 3, name: "Linh" }
    ]);
    const [lastDeleted, setLastDeleted] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!lastDeleted) return;
        const timer = setTimeout(() => {
            setLastDeleted(null);
            setMessage("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [lastDeleted]);

    function handleDelete(item) {
        const ok = window.confirm("Bạn có chắc muốn xóa " + item.name + "?");
        if (!ok) return;

        setItems(items.filter(currentItem => currentItem.id !== item.id));
        setLastDeleted(item);
        setMessage("Đã xóa " + item.name);
    }

    function undoDelete() {
        if (!lastDeleted) return;
        setItems([...items, lastDeleted]);
        setMessage("Đã hoàn tác xóa " + lastDeleted.name);
        setLastDeleted(null);
    }

    function handleDeleteAll() {
        if (window.confirm("Xóa tất cả?")) {
            setItems([]);
            setLastDeleted(null);
            setMessage("Đã xóa tất cả.");
        }
    }

    return (
        <div className="card">
            <h2>Bài 6.3 - DELETE</h2>
            {items.length > 0 && (
                <button className="danger-btn" onClick={handleDeleteAll}>🗑 Xóa tất cả</button>
            )}
            {message && <p className="note">{message}</p>}
            {lastDeleted && <button className="gray-btn" onClick={undoDelete}>Hoàn tác trong 5 giây</button>}

            {items.length === 0 ? (
                <p className="muted">Danh sách trống</p>
            ) : (
                items.map(item => (
                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", margin: "5px 0", background: "#f9f9f9" }}>
                        <span>{item.name}</span>
                        <button className="danger-btn" onClick={() => handleDelete(item)}>Xóa</button>
                    </div>
                ))
            )}
        </div>
    );
}

function UpdateItem() {
    const [items, setItems] = useState([
        { id: 1, name: "Minh", age: 20 },
        { id: 2, name: "An", age: 21 },
        { id: 3, name: "Linh", age: 19 }
    ]);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editAge, setEditAge] = useState("");
    const [message, setMessage] = useState("");

    function startEdit(item) {
        setEditingId(item.id);
        setEditName(item.name);
        setEditAge(item.age.toString());
        setMessage("");
    }

    function saveEdit() {
        if (editName.trim() === "" || editAge === "") {
            setMessage("Không cho lưu nếu tên hoặc tuổi trống.");
            return;
        }

        setItems(items.map(item =>
            item.id === editingId
                ? { ...item, name: editName.trim(), age: Number(editAge) }
                : item
        ));
        setEditingId(null);
        setMessage("Đã lưu!");
    }

    function cancelEdit() {
        setEditingId(null);
        setMessage("");
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") saveEdit();
        if (event.key === "Escape") cancelEdit();
    }

    return (
        <div className="card">
            <h2>Bài 6.4 - UPDATE</h2>
            {message && <p className={message.includes("Đã") ? "good" : "bad"}>{message}</p>}
            {items.map(item => (
                <div key={item.id} style={{ padding: "10px", margin: "5px 0", background: "#f9f9f9" }}>
                    {editingId === item.id ? (
                        <div className="btn-row">
                            <input
                                className="input-basic"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                style={{ border: "2px solid #3498db" }}
                            />
                            <input
                                className="input-basic"
                                type="number"
                                value={editAge}
                                onChange={(e) => setEditAge(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ width: "90px", border: "2px solid #3498db" }}
                            />
                            <button className="success-btn" onClick={saveEdit}>✓ Lưu</button>
                            <button className="gray-btn" onClick={cancelEdit}>✕ Hủy</button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                            <span>{item.name} - {item.age} tuổi</span>
                            <button className="primary-btn" onClick={() => startEdit(item)}>✏️ Sửa</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function Tier6() {
    return (
        <div className="tier-box">
            <h1 className="tier-title">Tier 6 - Lists & CRUD</h1>
            <p className="note">Trọng tâm: render list, key, thêm, xóa, sửa inline, Enter/Escape.</p>
            <div className="grid-2">
                <ListBasics />
                <CreateItem />
                <DeleteItem />
                <UpdateItem />
            </div>
        </div>
    );
}

export default Tier6;

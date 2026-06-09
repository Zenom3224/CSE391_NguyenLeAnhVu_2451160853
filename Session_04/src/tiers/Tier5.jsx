import { useState } from "react";

function ClickEvents() {
    const [message, setMessage] = useState("Chưa click");
    const [clickCount, setClickCount] = useState(0);
    const [color, setColor] = useState("#f8fafc");
    const [leftCount, setLeftCount] = useState(0);
    const [rightCount, setRightCount] = useState(0);
    const [liked, setLiked] = useState(false);

    const colors = ["#fef3c7", "#dcfce7", "#e0f2fe", "#fce7f3", "#ede9fe"];

    function handleClick() {
        setMessage("Đã click lúc " + new Date().toLocaleTimeString());
        setClickCount(clickCount + 1);
    }

    function changeColor() {
        const index = Math.floor(Math.random() * colors.length);
        setColor(colors[index]);
    }

    return (
        <div className="card" style={{ background: color }}>
            <h2>Click Events</h2>
            <p>{message}</p>
            <p>Số lần click nút chính: {clickCount}</p>
            <div className="btn-row">
                <button className="primary-btn" onClick={handleClick}>Click me!</button>
                <button className="gray-btn" onClick={() => { setMessage("Đã reset!"); setClickCount(0); }}>Reset</button>
                <button className="gray-btn" onClick={changeColor}>Đổi màu ngẫu nhiên</button>
                <button className="gray-btn" onClick={() => setLiked(!liked)}>{liked ? "❤️ Đã like" : "🤍 Like"}</button>
            </div>
            <div className="btn-row">
                <button className="gray-btn" onClick={() => setLeftCount(leftCount + 1)}>Nút trái: {leftCount}</button>
                <button className="gray-btn" onClick={() => setRightCount(rightCount + 1)}>Nút phải: {rightCount}</button>
            </div>
        </div>
    );
}

function InputEvents() {
    const [text, setText] = useState("");
    const [email, setEmail] = useState("");
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    return (
        <div className="card">
            <h2>Input Events</h2>
            <input
                className="input-basic"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập nội dung preview..."
                maxLength={100}
            />
            <p>Ký tự: {text.length}/100</p>
            <p>Số từ: {words}</p>
            <p>Bạn đang nhập: {text || "(chưa nhập)"}</p>
            {text.length > 80 && <p className="bad">⚠️ Sắp hết ký tự!</p>}

            <input
                className="input-basic"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email..."
            />
            {email && (
                <p className={email.includes("@") ? "good" : "bad"}>
                    {email.includes("@") ? "Email hợp lệ" : "Email chưa hợp lệ"}
                </p>
            )}
        </div>
    );
}

function KeyboardEvents() {
    const keys = ["a", "s", "d", "f", "j", "k"];
    const [lastKey, setLastKey] = useState("");
    const [log, setLog] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [targetKey, setTargetKey] = useState("a");
    const [gameMessage, setGameMessage] = useState("Nhấn đúng phím đang yêu cầu.");
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [darkBg, setDarkBg] = useState(false);

    function randomTarget() {
        const index = Math.floor(Math.random() * keys.length);
        setTargetKey(keys[index]);
    }

    function handleKeyDown(event) {
        setLastKey(event.key);
        setLog(prev => [...prev.slice(-4), event.key]);

        if (event.ctrlKey && event.key.toLowerCase() === "d") {
            event.preventDefault();
            setDarkBg(!darkBg);
        }

        if (event.key.toLowerCase() === targetKey) {
            setGameMessage("✅ Đúng rồi! Đổi sang phím mới.");
            randomTarget();
        }

        if (event.key === "ArrowUp") setPosition(pos => ({ ...pos, y: pos.y - 10 }));
        if (event.key === "ArrowDown") setPosition(pos => ({ ...pos, y: pos.y + 10 }));
        if (event.key === "ArrowLeft") setPosition(pos => ({ ...pos, x: pos.x - 10 }));
        if (event.key === "ArrowRight") setPosition(pos => ({ ...pos, x: pos.x + 10 }));
    }

    function handleInputKeyDown(event) {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            alert("Bạn nhập: " + inputValue);
            setInputValue("");
        }

        if (event.key === "Escape") {
            setInputValue("");
        }
    }

    return (
        <div
            className="card"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            style={{ background: darkBg ? "#e2e8f0" : "#fff", outline: "none" }}
        >
            <h2>Keyboard Events</h2>
            <p>Click vào khung này rồi nhấn phím.</p>
            <p>Phím cuối cùng: <strong>{lastKey || "Chưa nhấn"}</strong></p>
            <p>Log: {log.join(" → ")}</p>
            <p>Game đoán phím: nhấn <strong>{targetKey}</strong></p>
            <p>{gameMessage}</p>
            <input
                className="input-basic"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Nhập rồi Enter, Escape để xóa"
            />
            <div style={{ position: "relative", height: "90px", background: "#f8fafc", marginTop: "12px", borderRadius: "8px" }}>
                <div
                    style={{
                        width: "34px",
                        height: "34px",
                        background: "#3498db",
                        position: "absolute",
                        left: 40 + position.x,
                        top: 25 + position.y,
                        borderRadius: "6px"
                    }}
                />
            </div>
            <p className="muted">Dùng phím mũi tên để di chuyển ô vuông, Ctrl+D để đổi nền.</p>
        </div>
    );
}

function FormEvents() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setSubmitted(false);
    }

    function validate() {
        if (formData.name.trim() === "" || formData.email.trim() === "") {
            return "Vui lòng nhập tên và email.";
        }
        if (!formData.email.includes("@")) {
            return "Email phải có ký tự @.";
        }
        if (formData.password.length < 4) {
            return "Mật khẩu tối thiểu 4 ký tự.";
        }
        if (formData.password !== formData.confirmPassword) {
            return "Xác nhận mật khẩu chưa khớp.";
        }
        return "";
    }

    function handleSubmit(event) {
        event.preventDefault();
        const result = validate();
        if (result) {
            setError(result);
            return;
        }
        setError("");
        setSubmitted(true);
    }

    function handleReset() {
        setFormData({ name: "", email: "", password: "", confirmPassword: "", message: "" });
        setSubmitted(false);
        setError("");
    }

    return (
        <div className="card">
            <h2>Form Events</h2>
            <form onSubmit={handleSubmit}>
                <div className="btn-row">
                    <input className="input-basic" name="name" value={formData.name} onChange={handleChange} placeholder="Tên" />
                    <input className="input-basic" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                </div>
                <div className="btn-row">
                    <input className="input-basic" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Mật khẩu" />
                    <input className="input-basic" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Xác nhận mật khẩu" />
                </div>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tin nhắn"
                    rows={4}
                    style={{ width: "100%", padding: "8px" }}
                />
                {error && <p className="bad">{error}</p>}
                {formData.email && !formData.email.includes("@") && <p className="bad">Lỗi realtime: email chưa có @</p>}
                <div className="btn-row">
                    <button className="success-btn" type="submit">Gửi</button>
                    <button className="gray-btn" type="button" onClick={handleReset}>Xóa</button>
                </div>
            </form>

            {submitted && (
                <div className="note">
                    <h3>✅ Đã gửi thành công!</h3>
                    <p>Tên: {formData.name}</p>
                    <p>Email: {formData.email}</p>
                    <p>Tin nhắn: {formData.message || "(không có)"}</p>
                </div>
            )}
        </div>
    );
}

function Tier5() {
    return (
        <div className="tier-box">
            <h1 className="tier-title">Tier 5 - Events cơ bản</h1>
            <p className="note">Trọng tâm: onClick, onChange, onKeyDown, form submit và preventDefault.</p>
            <div className="grid-2">
                <ClickEvents />
                <InputEvents />
                <KeyboardEvents />
                <FormEvents />
            </div>
        </div>
    );
}

export default Tier5;

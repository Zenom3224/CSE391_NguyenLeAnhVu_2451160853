import { useState } from "react";

function NumberState() {
    const [count, setCount] = useState(0);
    const color = count > 0 ? "green" : count < 0 ? "red" : "black";

    return (
        <div className="card" style={{ textAlign: "center" }}>
            <h2 style={{ color }}>Bộ đếm: {count}</h2>
            <p>{count > 0 ? "Số dương" : count < 0 ? "Số âm" : "Bằng 0"}</p>
            <div className="btn-row" style={{ justifyContent: "center" }}>
                <button className="primary-btn" onClick={() => setCount(count + 1)}>Tăng (+1)</button>
                <button className="primary-btn" onClick={() => setCount(count + 5)}>Tăng 5</button>
                <button className="gray-btn" onClick={() => setCount(count - 1)}>Giảm (-1)</button>
                <button className="gray-btn" onClick={() => setCount(count * 2)}>Nhân đôi</button>
                <button className="danger-btn" onClick={() => setCount(0)}>Reset</button>
            </div>
        </div>
    );
}

function StringState() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const isValidEmail = email.includes("@");

    return (
        <div className="card">
            <h2>useState với chuỗi</h2>
            <div className="btn-row">
                <input
                    className="input-basic"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên..."
                    maxLength={100}
                />
                <input
                    className="input-basic"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email..."
                />
            </div>
            <div className="btn-row">
                <input
                    className="input-basic"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                />
                <button className="gray-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Ẩn" : "Hiện"} mật khẩu
                </button>
            </div>
            <p>Ký tự tên: {name.length}/100</p>
            <p>Email: {email || "(chưa nhập)"} {email && (isValidEmail ? <span className="good">hợp lệ</span> : <span className="bad">chưa hợp lệ</span>)}</p>
            {name && <p className="note">Xin chào <strong>{name}</strong>!</p>}
        </div>
    );
}

function BooleanState() {
    const [isVisible, setIsVisible] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [isLightOn, setIsLightOn] = useState(false);

    return (
        <div
            className="card"
            style={{
                background: isDarkMode ? "#333" : "#fff",
                color: isDarkMode ? "#fff" : "#222"
            }}
        >
            <h2>useState với boolean</h2>
            <div className="btn-row">
                <button className="gray-btn" onClick={() => setIsVisible(!isVisible)}>
                    {isVisible ? "Ẩn nội dung" : "Hiện nội dung"}
                </button>
                <button className="gray-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
                    {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
                <button className="gray-btn" onClick={() => setIsLiked(!isLiked)}>
                    {isLiked ? "❤️ Đã thích" : "🤍 Thích"}
                </button>
                <button className="gray-btn" onClick={() => setIsLightOn(!isLightOn)}>
                    {isLightOn ? "💡 Bật" : "⚫ Tắt"}
                </button>
            </div>

            {isVisible && <p className="note">Đây là nội dung có thể ẩn/hiện.</p>}

            <div className="section" style={{ background: isDarkMode ? "#444" : "#fafafa" }}>
                <h3 onClick={() => setIsAccordionOpen(!isAccordionOpen)} style={{ cursor: "pointer" }}>
                    Accordion: click để mở/đóng
                </h3>
                {isAccordionOpen && <p>Nội dung accordion đang được mở.</p>}
            </div>
        </div>
    );
}

function MultipleStates() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [isStudent, setIsStudent] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit() {
        if (name.trim() === "" || age === "" || email.trim() === "") {
            setError("Vui lòng nhập đầy đủ tên, tuổi và email.");
            return;
        }

        if (Number(age) <= 0 || Number(age) >= 100) {
            setError("Tuổi phải lớn hơn 0 và nhỏ hơn 100.");
            return;
        }

        if (!email.includes("@")) {
            setError("Email phải có ký tự @.");
            return;
        }

        setError("");
        setSubmitted(true);
    }

    function handleReset() {
        setName("");
        setAge("");
        setEmail("");
        setIsStudent(false);
        setSubmitted(false);
        setError("");
    }

    return (
        <div className="card">
            <h2>Kết hợp nhiều useState</h2>
            {!submitted ? (
                <div>
                    <div className="btn-row">
                        <input className="input-basic" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên" />
                        <input className="input-basic" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Tuổi" />
                        <input className="input-basic" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    </div>
                    <label>
                        <input type="checkbox" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} />
                        Là sinh viên
                    </label>
                    {name && <p>Xin chào {name}!</p>}
                    {error && <p className="bad">{error}</p>}
                    <div className="btn-row">
                        <button className="success-btn" onClick={handleSubmit}>Đăng ký</button>
                        <button className="gray-btn" onClick={handleReset}>Xóa</button>
                    </div>
                </div>
            ) : (
                <div className="note">
                    <h3>✅ Đăng ký thành công!</h3>
                    <p>Tên: {name}</p>
                    <p>Tuổi: {age}</p>
                    <p>Email: {email}</p>
                    <p>Sinh viên: {isStudent ? "Có" : "Không"}</p>
                    <button className="gray-btn" onClick={handleReset}>Đăng ký lại</button>
                </div>
            )}
        </div>
    );
}

function Tier4() {
    return (
        <div className="tier-box">
            <h1 className="tier-title">Tier 4 - useState cơ bản</h1>
            <p className="note">Trọng tâm: number, string, boolean, controlled input và nhiều state trong một component.</p>
            <div className="grid-2">
                <NumberState />
                <StringState />
                <BooleanState />
                <MultipleStates />
            </div>
        </div>
    );
}

export default Tier4;

import { useState } from "react";

function LifecycleDemo() {
    console.log("1️⃣ Component LifecycleDemo được gọi!");

    return (
        <div className="card" style={{ border: "2px solid #3498db" }}>
            <h2>Lifecycle Demo</h2>
            <p>Mở Console bằng F12 để xem log.</p>
            <p>Component render lần đầu khi xuất hiện trên màn hình.</p>
        </div>
    );
}

function BadCounter() {
    let count = 0;

    function handleClick() {
        count = count + 1;
        console.log("Bad count:", count);
    }

    return (
        <div className="card">
            <h2>❌ Counter dùng biến thường</h2>
            <p>Bộ đếm: {count}</p>
            <button className="danger-btn" onClick={handleClick}>Tăng (+1)</button>
            <p className="bad">Console tăng nhưng UI không cập nhật.</p>
        </div>
    );
}

function GoodCounter() {
    const [count, setCount] = useState(0);
    console.log("🔄 GoodCounter render");

    return (
        <div className="card">
            <h2>✅ Counter dùng useState</h2>
            <p>Bộ đếm: {count}</p>
            <button className="success-btn" onClick={() => setCount(count + 1)}>Tăng (+1)</button>
            <p className="good">Gọi setCount nên React re-render và UI cập nhật.</p>
        </div>
    );
}

function FlowDemo() {
    const [step, setStep] = useState(1);

    function nextStep() {
        if (step >= 4) {
            setStep(1);
        } else {
            setStep(step + 1);
        }
    }

    return (
        <div className="card">
            <h2>Luồng hoạt động</h2>
            <p>Bước hiện tại: {step}</p>
            <div className="btn-row">
                <button className="primary-btn" onClick={nextStep}>Bước tiếp theo →</button>
                <button className="gray-btn" onClick={() => setStep(1)}>Quay lại đầu</button>
            </div>
            <div className="note">
                {step === 1 && <p>👋 Bước 1: Component được gọi.</p>}
                {step === 2 && <p>📖 Bước 2: Component return JSX.</p>}
                {step === 3 && <p>🎯 Bước 3: Người dùng tương tác và setState.</p>}
                {step === 4 && <p>🎉 Bước 4: React re-render và cập nhật UI.</p>}
            </div>
        </div>
    );
}

function Tier1() {
    return (
        <div className="tier-box">
            <h1 className="tier-title">Tier 1 - Hiểu luồng hoạt động của React</h1>
            <p className="note">Trọng tâm: component render lần đầu, biến thường khác useState, setState làm UI cập nhật.</p>

            <div className="grid-2">
                <LifecycleDemo />
                <FlowDemo />
                <BadCounter />
                <GoodCounter />
            </div>
        </div>
    );
}

export default Tier1;

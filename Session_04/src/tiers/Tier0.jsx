function FirstComponent() {
    return (
        <div className="card">
            <h2>Xin chào React!</h2>
            <p>Đây là component đầu tiên của bạn.</p>
            <ul>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>React</li>
            </ul>
        </div>
    );
}

function StudentCard() {
    return (
        <div className="card">
            <img src="https://placehold.co/160x100" alt="Avatar" />
            <h2>Nguyễn Văn Minh</h2>
            <p>Sinh viên năm 3</p>
            <label htmlFor="email-tier0">Email:</label>
            <input id="email-tier0" type="email" className="input-basic" placeholder="minh@example.com" />
        </div>
    );
}

function UserProfile() {
    return (
        <div className="card profile">
            <h2>Hồ sơ cá nhân</h2>
            <img src="https://placehold.co/120x120" alt="Ảnh đại diện" />
            <table>
                <tbody>
                    <tr>
                        <td>Họ tên:</td>
                        <td>Minh</td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td>minh@example.com</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function ProductInfo() {
    return (
        <div className="card product">
            <h2>iPhone 15</h2>
            <p className="price">25.000.000đ</p>
            <ul>
                <li>Màn hình: 6.1 inch</li>
                <li>Camera: 48MP</li>
                <li>Pin: 3349 mAh</li>
            </ul>
            <button className="primary-btn">Mua ngay</button>
        </div>
    );
}

function Tier0() {
    return (
        <div className="tier-box">
            <h1 className="tier-title">Tier 0 - Component đầu tiên</h1>
            <p className="note">
                Mục tiêu: viết component cơ bản, biết className, htmlFor và đóng thẻ như img/input.
            </p>

            <div className="section">
                <h2>Bài 0.1 - App đầu tiên</h2>
                <FirstComponent />
            </div>

            <div className="section">
                <h2>Bài 0.2 - Viết HTML thành JSX</h2>
                <div className="grid-3">
                    <StudentCard />
                    <UserProfile />
                    <ProductInfo />
                </div>
            </div>

            <div className="section">
                <h2>Trả lời nhanh câu hỏi</h2>
                <p><strong>.jsx khác .js:</strong> .jsx thường dùng cho file có viết giao diện JSX.</p>
                <p><strong>export default App:</strong> giúp file khác import component App.</p>
                <p><strong>Xóa export default:</strong> main.jsx sẽ không import được App và trang sẽ lỗi.</p>
            </div>
        </div>
    );
}

export default Tier0;

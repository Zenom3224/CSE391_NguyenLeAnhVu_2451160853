function SimpleVariables() {
    const ten = "Nguyễn Lê Anh Vũ";
    const tuoi = 19;
    const queQuan = "Hà Nội";
    const laSinhVien = true;
    const monHoc = ["HTML", "CSS", "JavaScript", "React"];
    const gio = new Date().getHours();
    const canNang = 60;
    const chieuCao = 1.7;
    const bmi = canNang / (chieuCao * chieuCao);

    const loiChao = gio < 12 ? "Chào buổi sáng" : gio < 18 ? "Chào buổi chiều" : "Chào buổi tối";

    return (
        <div className="card">
            <h2>{loiChao}, {ten}!</h2>
            <p>Tuổi: {tuoi}</p>
            <p>Năm sau: {tuoi + 1}</p>
            <p>Quê quán: {queQuan}</p>
            <p>Sinh viên: {laSinhVien ? "Có" : "Không"}</p>
            <p>Môn học: {monHoc.join(", ")}</p>
            <p>BMI: {bmi.toFixed(2)}</p>
        </div>
    );
}

function ConditionalRendering() {
    const isOnline = true;
    const isLoggedIn = true;
    const stock = 0;
    const score = 8.5;

    return (
        <div className="card">
            <h2>Conditional Rendering</h2>
            <p>Trạng thái: {isOnline ? "🟢 Online" : "🔴 Offline"}</p>
            <p>Kết quả: {score >= 5 ? "Đậu" : "Rớt"}</p>
            <p>Xếp loại: {score >= 9 ? "Xuất sắc" : score >= 8 ? "Giỏi" : score >= 7 ? "Khá" : "Trung bình"}</p>

            {isLoggedIn && (
                <ul className="note">
                    <li>Trang chủ</li>
                    <li>Thông tin cá nhân</li>
                    <li>Đăng xuất</li>
                </ul>
            )}

            {stock === 0 && <p className="bad">Hết hàng</p>}
        </div>
    );
}

function ListRendering() {
    const products = [
        { id: 1, name: "Bàn phím", price: 450000 },
        { id: 2, name: "Màn hình", price: 2200000 },
        { id: 3, name: "Chuột", price: 250000 },
        { id: 4, name: "Tai nghe", price: 1200000 },
        { id: 5, name: "USB", price: 180000 }
    ];

    const total = products.reduce((sum, product) => sum + product.price, 0);

    return (
        <div className="card">
            <h2>Render danh sách sản phẩm</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>{product.name}</td>
                            <td style={{ color: product.price > 1000000 ? "red" : "black" }}>
                                {product.price.toLocaleString("vi-VN")}đ
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p><strong>Tổng giá:</strong> {total.toLocaleString("vi-VN")}đ</p>
        </div>
    );
}

function Tier2() {
    return (
        <div className="tier-box">
            <h1 className="tier-title">Tier 2 - Biến trong JSX</h1>
            <p className="note">Trọng tâm: dùng ngoặc nhọn {}, ternary, && và map để đưa dữ liệu vào giao diện.</p>
            <div className="grid-2">
                <SimpleVariables />
                <ConditionalRendering />
            </div>
            <div className="section">
                <ListRendering />
            </div>
        </div>
    );
}

export default Tier2;

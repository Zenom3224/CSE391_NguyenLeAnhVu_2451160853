function PriceTag({ originalPrice, salePrice }) {
    const discount = originalPrice - salePrice;

    return (
        <div className="card">
            <p>
                Giá gốc: <del>{originalPrice.toLocaleString("vi-VN")}đ</del>
            </p>
            <p style={{ color: "#e74c3c", fontWeight: "bold" }}>
                Giá sale: {salePrice.toLocaleString("vi-VN")}đ
            </p>
            <p>Tiết kiệm: {discount.toLocaleString("vi-VN")}đ</p>
        </div>
    );
}

export default PriceTag;

function ProductCard({ name, price, image }) {
    return (
        <div className="card">
            <img src={image} alt={name} style={{ width: "100%", borderRadius: "8px" }} />
            <h3>{name}</h3>
            <p style={{ color: "#e74c3c", fontWeight: "bold" }}>{price}đ</p>
            <button className="primary-btn">Thêm vào giỏ</button>
        </div>
    );
}

export default ProductCard;

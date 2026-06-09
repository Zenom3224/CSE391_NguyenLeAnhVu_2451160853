import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import ProductCard from "../components/shop/ProductCard.jsx";
import UserCard from "../components/user/UserCard.jsx";
import PriceTag from "../components/user/PriceTag.jsx";

function Tier3() {
    const products = [
        { id: 1, name: "iPhone 15", price: "25.000.000", image: "https://placehold.co/250x140?text=iPhone" },
        { id: 2, name: "Samsung S24", price: "22.000.000", image: "https://placehold.co/250x140?text=Samsung" },
        { id: 3, name: "Xiaomi 14", price: "15.000.000", image: "https://placehold.co/250x140?text=Xiaomi" }
    ];

    const users = [
        { id: 1, name: "Minh", email: "minh@example.com", avatar: "https://placehold.co/90x90?text=M" },
        { id: 2, name: "An", email: "an@example.com", avatar: "https://placehold.co/90x90?text=A" },
        { id: 3, name: "Linh", email: "linh@example.com", avatar: "https://placehold.co/90x90?text=L" }
    ];

    return (
        <div className="tier-box">
            <h1 className="tier-title">Tier 3 - Chia Component</h1>
            <p className="note">
                Giao diện lớn được chia thành Header, Footer, ProductCard, UserCard, PriceTag để dễ sửa và tái sử dụng.
            </p>

            <div className="section">
                <Header />
                <h2>Danh sách sản phẩm</h2>
                <div className="grid-3">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                        />
                    ))}
                </div>
                <Footer />
            </div>

            <div className="section">
                <h2>Thử thách Props</h2>
                <div className="grid-3">
                    {users.map(user => (
                        <UserCard
                            key={user.id}
                            name={user.name}
                            email={user.email}
                            avatar={user.avatar}
                        />
                    ))}
                </div>
                <PriceTag originalPrice={3000000} salePrice={2490000} />
            </div>
        </div>
    );
}

export default Tier3;

function UserCard({ name, email, avatar }) {
    return (
        <div className="card" style={{ textAlign: "center" }}>
            <img
                src={avatar}
                alt={name}
                style={{ width: "90px", height: "90px", borderRadius: "50%" }}
            />
            <h3>{name}</h3>
            <p>{email}</p>
        </div>
    );
}

export default UserCard;

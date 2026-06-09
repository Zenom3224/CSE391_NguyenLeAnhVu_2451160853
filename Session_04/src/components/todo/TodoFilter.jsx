function TodoFilter({ filter, setFilter, total, activeCount, completedCount }) {
    const filters = [
        { key: "all", label: "Tất cả", count: total },
        { key: "active", label: "Chưa xong", count: activeCount },
        { key: "completed", label: "Hoàn thành", count: completedCount }
    ];

    return (
        <div className="filter-row">
            {filters.map(item => (
                <button
                    key={item.key}
                    className={filter === item.key ? "active" : ""}
                    onClick={() => setFilter(item.key)}
                >
                    {item.label} ({item.count})
                </button>
            ))}
        </div>
    );
}

export default TodoFilter;

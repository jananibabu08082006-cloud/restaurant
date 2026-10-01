function MenuCard({ item, onEdit, onDelete }) {
  return (
    <div className="menu-card">
      <div className="menu-card-header">
        <h3>{item.name}</h3>
        <span className={`badge ${item.availability ? "available" : "unavailable"}`}>
          {item.availability ? "Available" : "Unavailable"}
        </span>
      </div>
      <p className="menu-card-category">{item.category}</p>
      <p className="menu-card-price">₹{item.price}</p>
      <div className="menu-card-actions">
        <button className="btn btn-edit" onClick={() => onEdit(item)}>
          Edit
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(item.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default MenuCard;

import MenuCard from "./MenuCard";

function MenuList({ items, loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="status-message">Loading menu items...</p>;
  }

  if (items.length === 0) {
    return <p className="status-message">No menu items found. Add one to get started.</p>;
  }

  return (
    <div className="menu-list">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default MenuList;

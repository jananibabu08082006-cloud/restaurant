import { useState, useEffect } from "react";
import MenuList from "./components/MenuList";
import MenuForm from "./components/MenuForm";
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "./services/menuApi";

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Bonus: search + category filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // FR-01: load menu items on page load
  useEffect(() => {
    loadMenuItems();
  }, []);

  async function loadMenuItems() {
    setLoading(true);
    setError("");
    try {
      const data = await getMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError(
        "Could not load menu items. Make sure JSON Server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    setEditingItem(null);
    setShowForm(true);
  }

  // FR-03: Edit only opens a prefilled form — no PUT is sent here
  function handleEditClick(item) {
    setEditingItem(item);
    setShowForm(true);
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingItem(null);
  }

  // Called only when the user submits the form (Add or Update)
  async function handleSave(formData) {
    setError("");
    try {
      if (editingItem) {
        // FR-03: PUT is sent only now, after user edits and submits
        const updated = await updateMenuItem(editingItem.id, formData);
        setMenuItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? updated : item))
        );
      } else {
        // FR-02: POST a new item
        const created = await addMenuItem(formData);
        setMenuItems((prev) => [...prev, created]);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      setError("Could not save the menu item. Please try again.");
    }
  }

  // FR-04: Delete after confirmation
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );
    if (!confirmed) return;

    setError("");
    try {
      await deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError("Could not delete the menu item. Please try again.");
    }
  }

  // Bonus: derive category list + apply search/filter
  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];
  const visibleItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Restaurant Management</h1>
        <div className="header-actions">
          <button className="btn btn-refresh" onClick={loadMenuItems}>
            Refresh
          </button>
          <button className="btn btn-add" onClick={handleAddClick}>
            + Add Menu Item
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="category-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <MenuList
        items={visibleItems}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {showForm && (
        <MenuForm
          editingItem={editingItem}
          onSave={handleSave}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}

export default App;

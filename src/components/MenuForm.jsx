import { useState, useEffect } from "react";

const emptyItem = {
  name: "",
  category: "",
  price: "",
  availability: true,
};

function MenuForm({ editingItem, onSave, onCancel }) {
  const [formData, setFormData] = useState(emptyItem);
  const [errors, setErrors] = useState({});

  // Prefill the form when an item is selected for editing.
  // This only fills the form — it does NOT call the API.
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        category: editingItem.category,
        price: editingItem.price,
        availability: editingItem.availability,
      });
    } else {
      setFormData(emptyItem);
    }
    setErrors({});
  }, [editingItem]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name cannot be empty";
    if (!formData.category.trim()) newErrors.category = "Category cannot be empty";
    if (formData.price === "" || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Only now — on explicit submit — do we hand the data back to be saved.
    onSave({
      ...formData,
      price: Number(formData.price),
    });
  }

  return (
    <div className="modal-overlay">
      <form className="menu-form" onSubmit={handleSubmit}>
        <h2>{editingItem ? "Update Menu Item" : "Add Menu Item"}</h2>

        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label>
          Category
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          {errors.category && <span className="field-error">{errors.category}</span>}
        </label>

        <label>
          Price
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
          />
          Available
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn-save">
            {editingItem ? "Update Item" : "Add Item"}
          </button>
          <button type="button" className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default MenuForm;

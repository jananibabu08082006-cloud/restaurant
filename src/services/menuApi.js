const BASE_URL = "http://localhost:5000/menuItems";

// Helper to check response and throw a readable error if it fails
async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

// GET /menuItems
export async function getMenuItems() {
  const response = await fetch(BASE_URL);
  return handleResponse(response);
}

// POST /menuItems
export async function addMenuItem(item) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return handleResponse(response);
}

// PUT /menuItems/:id
export async function updateMenuItem(id, item) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return handleResponse(response);
}

// DELETE /menuItems/:id
export async function deleteMenuItem(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}

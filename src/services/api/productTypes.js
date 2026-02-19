import { apiFetch } from "../api";

/**
 * Get all product types
 */
export async function getAllProductTypes() {
  return apiFetch("/product-types");
}

/**
 * Get product type by ID
 */
export async function getProductTypeById(id) {
  return apiFetch(`/product-types/${id}`);
}

/**
 * Get product type by title
 */
export async function getProductTypeByTitle(title) {
  return apiFetch(`/product-types/title/${encodeURIComponent(title)}`);
}

/**
 * Create a new product type
 * @param {Object} data - Product type data
 * @param {string} data.Title - Product type title
 */
export async function createProductType(data) {
  return apiFetch("/product-types", {
    method: "POST",
    body: JSON.stringify({
      Title: data.Title,
    }),
  });
}

/**
 * Update an existing product type
 * @param {Object} data - Product type data
 * @param {number} data.Id - Product type ID
 * @param {string} data.Title - Product type title
 */
export async function updateProductType(data) {
  return apiFetch("/product-types", {
    method: "PUT",
    body: JSON.stringify({
      Id: data.Id,
      Title: data.Title,
    }),
  });
}

/**
 * Delete a product type by ID
 */
export async function deleteProductType(id) {
  return apiFetch(`/product-types/${id}`, {
    method: "DELETE",
  });
}
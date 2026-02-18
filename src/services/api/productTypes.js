import { apiFetch } from "../api";

export async function getAllProductTypes() {
  return apiFetch("/product-types");
}

export async function getProductTypeById(id) {
  return apiFetch(`/product-types/${id}`);
}

export async function getProductTypeByTitle(title) {
  return apiFetch(`/product-types/title/${encodeURIComponent(title)}`);
}

export async function createProductType(data) {
  return apiFetch("/product-types", {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
    }),
  });
}

export async function updateProductType(data) {
  return apiFetch("/product-types", {
    method: "PUT",
    body: JSON.stringify({
      id: data.id,
      title: data.title,
    }),
  });
}

export async function deleteProductType(id) {
  return apiFetch(`/product-types/${id}`, {
    method: "DELETE",
  });
}

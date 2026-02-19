import { apiFetch } from "../api";

export async function getAllProducts() {
  return apiFetch("/products");
}

export async function getProductById(productId) {
  return apiFetch(`/products/${productId}`);
}

export async function getProductsByType(typeId) {
  return apiFetch(`/products/type/${typeId}`);
}

export async function getExpiredProducts() {
  return apiFetch("/products/expired");
}

export async function createProduct(data) {
  return apiFetch("/products", {
    method: "POST",
    body: JSON.stringify({
      typeId: data.typeId,
      name: data.name,
      produced: data.produced,
      expirationDate: data.expirationDate,
      description: data.description,
    }),
  });
}

export async function updateProduct(data) {
  return apiFetch("/products", {
    method: "PUT",
    body: JSON.stringify({
      id: data.id,
      typeId: data.typeId,
      name: data.name,
      produced: data.produced,
      expirationDate: data.expirationDate,
      description: data.description,
    }),
  });
}

export async function deleteProduct(productId) {
  return apiFetch(`/products/${productId}`, {
    method: "DELETE",
  });
}

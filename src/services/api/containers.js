import { apiFetch } from "../api";

export async function getAllContainers() {
  return apiFetch("/containers");
}

export async function getContainerById(containerId) {
  return apiFetch(`/containers/${containerId}`);
}

export async function getContainerByName(name) {
  return apiFetch(`/containers/name/${encodeURIComponent(name)}`);
}

export async function getContainerByCode(code) {
  return apiFetch(`/containers/code/${encodeURIComponent(code)}`);
}

export async function getContainersByType(typeId) {
  return apiFetch(`/containers/type/${typeId}`);
}

export async function getContainersByProduct(productId) {
  return apiFetch(`/containers/product/${productId}`);
}

export async function getContainersByStatus(status) {
  return apiFetch(`/containers/status/${status}`);
}

/**
 * Create a new container
 * @param {Object} data - Container data
 * @param {string} data.Name - Container name
 * @param {number} data.TypeId - Container type ID
 * @param {number} [data.ProductId] - Product ID (optional)
 * @param {number} [data.Quantity] - Quantity (optional)
 * @param {number} [data.UnitId] - Unit ID (optional)
 * @param {string} [data.Notes] - Notes (optional)
 */
export async function createContainer(data) {
  return apiFetch("/containers", {
    method: "POST",
    body: JSON.stringify({
      Name: data.Name,
      TypeId: data.TypeId,
      ProductId: data.ProductId || null,
      Status: data.Status,
      Quantity: data.Quantity ?? null,
      UnitId: data.UnitId || null,
      Notes: data.Notes,
    }),
  });
}

/**
 * Update an existing container
 * @param {Object} data - Container data
 * @param {number} data.Id - Container ID
 * @param {string} data.Name - Container name
 * @param {number} data.TypeId - Container type ID
 * @param {number} [data.ProductId] - Product ID (optional)
 * @param {number} [data.Quantity] - Quantity (optional)
 * @param {number} [data.UnitId] - Unit ID (optional)
 * @param {string} [data.Notes] - Notes (optional)
 */
export async function updateContainer(data) {
  return apiFetch("/containers", {
    method: "PUT",
    body: JSON.stringify({
      Id: data.Id,
      Name: data.Name,
      TypeId: data.TypeId,
      ProductId: data.ProductId,
      Quantity: data.Quantity,
      UnitId: data.UnitId,
      Notes: data.Notes,
    }),
  });
}

/**
 * Delete a container by ID
 */
export async function deleteContainer(containerId) {
  return apiFetch(`/containers/${containerId}`, {
    method: "DELETE",
  });
}

// Export container status enum for convenience
export const ContainerStatus = {
  Default: "Default",
  Active: "Active",
  Inactive: "Inactive",
  Maintenance: "Maintenance",
  Disposed: "Disposed",
};
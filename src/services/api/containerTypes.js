import { apiFetch } from "../api";

/**
 * Get all container types
 */
export async function getAllContainerTypes() {
  return apiFetch("/container-types");
}

/**
 * Get container type by ID
 */
export async function getContainerTypeById(id) {
  return apiFetch(`/container-types/${id}`);
}

/**
 * Get container type by name
 */
export async function getContainerTypeByName(name) {
  return apiFetch(`/container-types/name/${encodeURIComponent(name)}`);
}

/**
 * Get container types by volume
 */
export async function getContainerTypesByVolume() {
  return apiFetch("/container-types/volume");
}

/**
 * Get container types by unit ID
 */
export async function getContainerTypesByUnit(unitId) {
  return apiFetch(`/container-types/unit/${unitId}`);
}

/**
 * Create a new container type
 * @param {Object} data - Container type data
 * @param {string} data.Name - Container type name
 * @param {number} data.Volume - Container volume
 * @param {number} data.UnitId - Unit ID
 * @param {number[]} [data.ProductTypeIds] - Array of product type IDs (optional)
 */
export async function createContainerType(data) {
  return apiFetch("/container-types", {
    method: "POST",
    body: JSON.stringify({
      Name: data.Name,
      Volume: data.Volume,
      UnitId: data.UnitId,
      ProductTypeIds: data.ProductTypeIds || [],
    }),
  });
}

/**
 * Update an existing container type
 * @param {Object} data - Container type data
 * @param {number} data.Id - Container type ID
 * @param {string} data.Name - Container type name
 * @param {number} data.Volume - Container volume
 * @param {number} data.UnitId - Unit ID
 * @param {number[]} [data.ProductTypeIds] - Array of product type IDs (optional)
 */
export async function updateContainerType(data) {
  return apiFetch("/container-types", {
    method: "PUT",
    body: JSON.stringify({
      Id: data.Id,
      Name: data.Name,
      Volume: data.Volume,
      UnitId: data.UnitId,
      ProductTypeIds: data.ProductTypeIds || [],
    }),
  });
}

/**
 * Delete a container type by ID
 */
export async function deleteContainerType(id) {
  return apiFetch(`/container-types/${id}`, {
    method: "DELETE",
  });
}
import { apiFetch } from "../api";

/**
 * Get all units
 */
export async function getAllUnits() {
  return apiFetch("/units");
}

/**
 * Get unit by ID
 */
export async function getUnitById(unitId) {
  return apiFetch(`/units/${unitId}`);
}

/**
 * Create a new unit
 * @param {Object} data - Unit data
 * @param {string} data.Title - Unit title
 * @param {number} data.UnitType - Unit type (0=Default, 1=Mass, 2=Capacity)
 */
export async function createUnit(data) {
  return apiFetch("/units", {
    method: "POST",
    body: JSON.stringify({
      Title: data.Title,
      UnitType: data.UnitType,
    }),
  });
}

/**
 * Update an existing unit
 * @param {Object} data - Unit data
 * @param {number} data.Id - Unit ID
 * @param {string} data.Title - Unit title
 * @param {number} data.UnitType - Unit type (0=Default, 1=Mass, 2=Capacity)
 */
export async function updateUnit(data) {
  return apiFetch("/units", {
    method: "PUT",
    body: JSON.stringify({
      Id: data.Id,
      Title: data.Title,
      UnitType: data.UnitType,
    }),
  });
}

/**
 * Delete a unit by ID
 */
export async function deleteUnit(id) {
  return apiFetch(`/units/${id}`, {
    method: "DELETE",
  });
}

// Export unit type enum for convenience
export const UnitType = {
  Default: 0,
  Mass: 1,
  Capacity: 2,
};


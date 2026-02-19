import { apiFetch } from "../api";

export async function getAllUnits() {
  return apiFetch("/units");
}

export async function getUnitById(unitId) {
  return apiFetch(`/units/${unitId}`);
}

export async function createUnit(data) {
  return apiFetch("/units", {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      unitType: data.unitType,
    }),
  });
}

export async function updateUnit(data) {
  return apiFetch("/units", {
    method: "PUT",
    body: JSON.stringify({
      id: data.id,
      title: data.title,
      unitType: data.unitType,
    }),
  });
}

export async function deleteUnit(id) {
  return apiFetch(`/units/${id}`, {
    method: "DELETE",
  });
}

export const UnitType = {
  Default: 0,
  Mass: 1,
  Capacity: 2,
};

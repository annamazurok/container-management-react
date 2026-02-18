import { apiFetch } from "../api";

export async function getAllContainerTypes() {
  return apiFetch("/container-types");
}

export async function getContainerTypeById(id) {
  return apiFetch(`/container-types/${id}`);
}

export async function getContainerTypeByName(name) {
  return apiFetch(`/container-types/name/${encodeURIComponent(name)}`);
}

export async function getContainerTypesByVolume() {
  return apiFetch("/container-types/volume");
}

export async function getContainerTypesByUnit(unitId) {
  return apiFetch(`/container-types/unit/${unitId}`);
}

export async function createContainerType(data) {
  return apiFetch("/container-types", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      volume: data.volume,
      unitId: data.unitId,
      productTypeIds: data.productTypeIds ?? [],
    }),
  });
}

export async function updateContainerType(data) {
  return apiFetch("/container-types", {
    method: "PUT",
    body: JSON.stringify({
      id: data.id,
      name: data.name,
      volume: data.volume,
      unitId: data.unitId,
      productTypeIds: data.productTypeIds ?? [],
    }),
  });
}

export async function deleteContainerType(id) {
  return apiFetch(`/container-types/${id}`, {
    method: "DELETE",
  });
}

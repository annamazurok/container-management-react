// src/services/api/containers.js

import { apiFetch } from "../api";

/**
 * Отримати всі контейнери
 */
export async function getAllContainers() {
  return apiFetch("/containers");
}

/**
 * Отримати контейнер по ID
 */
export async function getContainerById(containerId) {
  return apiFetch(`/containers/${containerId}`);
}

/**
 * Отримати контейнер по назві
 */
export async function getContainerByName(name) {
  return apiFetch(`/containers/name/${encodeURIComponent(name)}`);
}

/**
 * Отримати контейнер по коду
 */
export async function getContainerByCode(code) {
  return apiFetch(`/containers/code/${encodeURIComponent(code)}`);
}

/**
 * Отримати контейнери по типу
 */
export async function getContainersByType(typeId) {
  return apiFetch(`/containers/type/${typeId}`);
}

/**
 * Отримати контейнери по продукту
 */
export async function getContainersByProduct(productId) {
  return apiFetch(`/containers/product/${productId}`);
}

/**
 * Отримати контейнери по статусу
 * Status values: Default, Active, Inactive, Maintenance, Disposed
 */
export async function getContainersByStatus(status) {
  return apiFetch(`/containers/status/${status}`);
}

/**
 * Створити новий контейнер
 * @param {Object} data - Container data
 * @param {string} data.name - Container name (lowercase!)
 * @param {number} data.typeId - Container type ID
 * @param {number} [data.productId] - Product ID (optional)
 * @param {number} [data.quantity] - Quantity (optional)
 * @param {number} [data.unitId] - Unit ID (optional)
 * @param {string} [data.notes] - Notes (optional)
 */
export async function createContainer(data) {
  return apiFetch("/containers", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,           // lowercase!
      typeId: data.typeId,       // camelCase!
      productId: data.productId ?? null,
      quantity: data.quantity ?? null,
      unitId: data.unitId ?? null,
      notes: data.notes,
    }),
  });
}

/**
 * Оновити існуючий контейнер
 * @param {Object} data - Container data
 * @param {number} data.id - Container ID
 * @param {string} data.name - Container name
 * @param {number} data.typeId - Container type ID
 * @param {number} [data.productId] - Product ID (optional)
 * @param {number} [data.quantity] - Quantity (optional)
 * @param {number} [data.unitId] - Unit ID (optional)
 * @param {string} [data.notes] - Notes (optional)
 */
export async function updateContainer(data) {
  return apiFetch("/containers", {
    method: "PUT",
    body: JSON.stringify({
      id: data.id,               // lowercase!
      name: data.name,
      typeId: data.typeId,
      productId: data.productId,
      quantity: data.quantity,
      unitId: data.unitId,
      notes: data.notes,
    }),
  });
}

/**
 * Видалити контейнер по ID
 */
export async function deleteContainer(containerId) {
  return apiFetch(`/containers/${containerId}`, {
    method: "DELETE",
  });
}

/**
 * Container status enum
 */
export const ContainerStatus = {
  Default: "Default",
  Active: "Active",
  Inactive: "Inactive",
  Maintenance: "Maintenance",
  Disposed: "Disposed",
};
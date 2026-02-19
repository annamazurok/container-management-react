// src/services/api/users.js

import { apiFetch } from "../api";

/**
 * Отримати всіх користувачів (Admin only)
 */
export async function getAllUsers() {
  return apiFetch("/users");
}

/**
 * Отримати користувача по ID (Admin only)
 */
export async function getUserById(userId) {
  return apiFetch(`/users/${userId}`);
}

/**
 * Створити користувача вручну (Admin only)
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.name
 * @param {string} data.surname
 * @param {string} [data.fathersName]
 * @param {number} data.roleId
 */
export async function createUser(data) {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      name: data.name,
      surname: data.surname,
      fathersName: data.fathersName,
      roleId: data.roleId,
    }),
  });
}

/**
 * Підтвердити користувача (Admin only)
 */
export async function confirmUser(userId) {
  return apiFetch(`/users/${userId}/confirm`, {
    method: "POST",
  });
}

/**
 * Змінити роль користувача (Admin only)
 */
export async function changeUserRole(userId, roleId) {
  return apiFetch(`/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ roleId }),
  });
}

/**
 * Видалити користувача (Admin only)
 */
export async function deleteUser(userId) {
  return apiFetch(`/users/${userId}`, {
    method: "DELETE",
  });
}
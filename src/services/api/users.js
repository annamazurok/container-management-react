// src/services/api/users.js

import { apiFetch } from "../api";

export async function getAllUsers() {
  return apiFetch("/users");
}

export async function getUserById(userId) {
  return apiFetch(`/users/${userId}`);
}

export async function getUserByEmail(email) {
  return apiFetch(`/users/email/${email}`);
}

export async function getUsersByRole(roleId) {
  return apiFetch(`/users/role/${roleId}`);
}

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

export async function updateUser(data) {
  return apiFetch("/users", {
    method: "PUT",
    body: JSON.stringify({
      id: data.id,
      email: data.email,
      name: data.name,
      surname: data.surname,
      fathersName: data.fathersName,
      roleId: data.roleId,
    }),
  });
}

export async function deleteUser(userId) {
  return apiFetch(`/users/${userId}`, {
    method: "DELETE",
  });
}

export async function confirmUser(userId) {
  return apiFetch(`/users/${userId}/confirm`, {
    method: "POST",
  });
}
// src/services/api/role.js

import { apiFetch } from "../api";

export async function getAllRoles() {
  return apiFetch("/roles");
}

export async function getRoleById(roleId) {
  return apiFetch(`/roles/${roleId}`);
}

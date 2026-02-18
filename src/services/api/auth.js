// src/services/api/auth.js

import { apiFetch } from "../api";

/**
 * Реєстрація через Google (тільки для першого користувача - адміна)
 */
export async function registerWithGoogle(googleIdToken) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ idToken: googleIdToken }),
  });
}

/**
 * Вхід через Google
 */
export async function loginWithGoogle(googleIdToken) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ idToken: googleIdToken }),
  });
}

/**
 * Отримати дані поточного користувача
 */
export async function getCurrentUser() {
  return apiFetch("/auth/me");
}
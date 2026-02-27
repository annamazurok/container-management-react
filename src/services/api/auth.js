import { apiFetch } from "../api";
import { getUserById, getUserByEmail } from "./users";

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
  // Get basic user info from JWT
  const basicUserInfo = await apiFetch("/auth/me");
  
  // Fetch full user details from Users table to get roleId
  if (basicUserInfo.id) {
    return await getUserById(basicUserInfo.id);
  } else if (basicUserInfo.email) {
    return await getUserByEmail(basicUserInfo.email);
  }
  
  // Fallback to basic info if we can't fetch from table
  return basicUserInfo;
}
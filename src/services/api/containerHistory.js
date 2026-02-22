import { apiFetch } from "../api";

/**
 * HISTORY API
 * ✅ Confirmed by Swagger:
 *   GET /api/History/container/{containerId}
 *
 * Other endpoints below follow the same controller prefix: /api/History/...
 * If any of them returns 404 -> open Swagger and adjust only that path.
 */

/**
 * Get all history records
 * Expected: GET /api/History
 */
export async function getAllContainerHistory() {
  return apiFetch("/api/History");
}

/**
 * Get history record by history ID
 * Expected: GET /api/History/{id}
 */
export async function getContainerHistoryById(id) {
  return apiFetch(`/api/History/${id}`);
}

/**
 * ✅ Get history by container ID (CONFIRMED)
 * Swagger: GET /api/History/container/{containerId}
 */
export async function getContainerHistoryByContainerId(containerId) {
  return apiFetch(`/api/History/container/${containerId}`);
}

/**
 * Get history by product ID
 * Expected: GET /api/History/product/{productId}
 */
export async function getContainerHistoryByProductId(productId) {
  return apiFetch(`/api/History/product/${productId}`);
}

/**
 * Get history by action type
 * Expected: GET /api/History/action-type/{actionType}
 * (sometimes it's: /api/History/actionType/{actionType} or /api/History/action/{actionType})
 */
export async function getContainerHistoryByActionType(actionType) {
  return apiFetch(`/api/History/action-type/${actionType}`);
}

/**
 * Get history by user ID
 * Expected: GET /api/History/user/{userId}
 */
export async function getContainerHistoryByUserId(userId) {
  return apiFetch(`/api/History/user/${userId}`);
}

/**
 * Get recent history records
 * Expected: GET /api/History/recent/{count}
 */
export async function getRecentContainerHistory(count) {
  return apiFetch(`/api/History/recent/${count}`);
}

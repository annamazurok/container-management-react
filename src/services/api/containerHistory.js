import { apiFetch } from "../api";

/**
 * Get all container history records
 */
export async function getAllContainerHistory() {
  return apiFetch("/api/containerhistory");
}

/**
 * Get container history by ID
 */
export async function getContainerHistoryById(id) {
  return apiFetch(`/api/containerhistory/${id}`);
}

/**
 * Get container history by container ID
 */
export async function getContainerHistoryByContainerId(containerId) {
  return apiFetch(`/api/containerhistory/container/${containerId}`);
}

/**
 * Get container history by product ID
 */
export async function getContainerHistoryByProductId(productId) {
  return apiFetch(`/api/containerhistory/product/${productId}`);
}

/**
 * Get container history by action type
 */
export async function getContainerHistoryByActionType(actionType) {
  return apiFetch(`/api/containerhistory/action-type/${actionType}`);
}

/**
 * Get container history by user ID
 */
export async function getContainerHistoryByUserId(userId) {
  return apiFetch(`/api/containerhistory/user/${userId}`);
}

/**
 * Get recent container history records
 */
export async function getRecentContainerHistory(count) {
  return apiFetch(`/api/containerhistory/recent/${count}`);
}

import { apiFetch } from "../api";

export async function getAllContainerHistory() {
  return apiFetch("/api/History");
}

export async function getContainerHistoryById(id) {
  return apiFetch(`/api/History/${id}`);
}

export async function getContainerHistoryByContainerId(containerId) {
  return apiFetch(`/api/History/container/${containerId}`);
}

export async function getContainerHistoryByProductId(productId) {
  return apiFetch(`/api/History/product/${productId}`);
}

export async function getContainerHistoryByActionType(actionType) {
  return apiFetch(`/api/History/action-type/${actionType}`);
}


export async function getContainerHistoryByUserId(userId) {
  return apiFetch(`/api/History/user/${userId}`);
}

export async function getRecentContainerHistory(count) {
  return apiFetch(`/api/History/recent/${count}`);
}

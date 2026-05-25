const adminTokenKey = "admin_token";

export function getAdminToken() {
  return window.sessionStorage.getItem(adminTokenKey);
}

export function setAdminToken(token: string) {
  window.sessionStorage.setItem(adminTokenKey, token);
}

export function clearAdminToken() {
  window.sessionStorage.removeItem(adminTokenKey);
}

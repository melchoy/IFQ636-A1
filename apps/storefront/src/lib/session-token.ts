const sessionTokenKey = "otbt_session_token";

export function getSessionToken() {
  return window.sessionStorage.getItem(sessionTokenKey);
}

export function setSessionToken(token: string) {
  window.sessionStorage.setItem(sessionTokenKey, token);
}

export function clearSessionToken() {
  window.sessionStorage.removeItem(sessionTokenKey);
}

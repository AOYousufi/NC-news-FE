const AVATAR_API_BASE = "https://api.dicebear.com/10.x/initial-face/svg";

export const AVATAR_PLAYGROUND_URL = "https://www.dicebear.com/playground/";

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function generateRandomAvatarUrl(identity = "nc-news-user") {
  const safeIdentity = identity.trim() || "nc-news-user";
  const seed = encodeURIComponent(safeIdentity + "-" + randomId());

  return (
    AVATAR_API_BASE +
    "?seed=" +
    seed +
    "&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf"
  );
}

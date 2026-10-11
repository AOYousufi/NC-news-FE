const AVATAR_BACKGROUNDS = [
  "#4f46e5",
  "#7c3aed",
  "#0891b2",
  "#0f766e",
  "#b45309",
  "#be123c",
];

function getInitials(identity) {
  const cleaned = String(identity || "NC")
    .replace(/[_-]+/g, " ")
    .trim();

  const parts = cleaned.split(/\s+/).filter(Boolean);
  const initials =
    parts.length > 1
      ? parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
      : cleaned.slice(0, 2);

  return initials.replace(/[^A-Za-z0-9]/g, "").toUpperCase() || "NC";
}

function randomBackground() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const value = new Uint32Array(1);
    crypto.getRandomValues(value);
    return AVATAR_BACKGROUNDS[value[0] % AVATAR_BACKGROUNDS.length];
  }

  return AVATAR_BACKGROUNDS[
    Math.floor(Math.random() * AVATAR_BACKGROUNDS.length)
  ];
}

export function generateRandomAvatarUrl(identity = "NC News") {
  const initials = getInitials(identity);
  const background = randomBackground();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="30" fill="${background}" />
      <text
        x="64"
        y="70"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        font-size="48"
        font-weight="800"
        fill="#ffffff"
      >${initials}</text>
    </svg>
  `;

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

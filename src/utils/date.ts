export function formatToISO8601(date: Date): string {
  const locale = navigator.language;

  const d = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  return `${d.replaceAll("/", "-")}T${time}`;
}

export function getHomeDirectory(): string {
  const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
  if (homeDir === undefined) {
    throw new Error("Unable to determine the home directory.");
  }
  return homeDir;
}

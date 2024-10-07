export function getHomeDirectory(): string {
  const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
  if (!homeDir) {
    throw new Error("Unable to determine the home directory.");
  }
  return homeDir;
}

import * as path from "@std/path";
import { APP_DIR, CONFIG_FILE_NAME } from "../const/app.ts";

export function getHomeDir(): string {
  const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
  if (!homeDir) {
    throw new Error("Unable to determine the home directory.");
  }
  return homeDir;
}

export function getAppDir(): string {
  const homeDir = getHomeDir();
  const appDir = path.resolve(homeDir, APP_DIR);
  return appDir;
}

export function getConfigFilePath(): string {
  const appDir = getAppDir();
  const configFilePath = path.resolve(appDir, CONFIG_FILE_NAME);
  return configFilePath;
}

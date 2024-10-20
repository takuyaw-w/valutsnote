import { Command, Option } from "@cliffy/command";
import { Secret } from "@cliffy/prompt";
import { version as vnoteVersion } from "../version.ts";
import { verifyPassword } from "../services/hasher.ts";
import { getConfigFilePath } from "../services/path.ts";
import type { Config } from "../types/config.ts";

async function add(_option: Option, key: string, value: string) {
  const configFilePath = getConfigFilePath();
  const storedPass = JSON.parse(
    await Deno.readTextFile(configFilePath),
  ) as Config;
  const password = await Secret.prompt("please input password.");

  if (
    await verifyPassword(password, storedPass.password_hash, storedPass.salt)
  ) {
    console.info("TRUE");
  }

  console.log(key, value);
  console.log(typeof key);
  console.log(typeof value);
}

export const addCommand = new Command()
  .version(vnoteVersion)
  .arguments("<key:string> <value:string>")
  .action(add);

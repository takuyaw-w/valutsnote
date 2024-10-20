import { Command, Option } from "@cliffy/command";
import { Secret } from "@cliffy/prompt";
import { version as vnoteVersion } from "../version.ts";
import { verifyPassword } from "../utils/hasher.ts";
import { getConfigFilePath } from "../utils/path.ts";
import type { Config } from "../types/config.ts";
import { errorMsg } from "../utils/message.ts";

async function add(_option: Option, key: string, value: string) {
  const configFilePath = getConfigFilePath();
  const config = JSON.parse(
    await Deno.readTextFile(configFilePath),
  ) as Config;
  const password = await Secret.prompt("please input password.");

  const verifyResult = await verifyPassword(
    password,
    config.password_hash,
    config.salt,
  );
  if (!verifyResult) {
    errorMsg("パスワードが一致しませんでした。");
    Deno.exit(1);
  }

  console.log(key, value);
  console.log(typeof key);
  console.log(typeof value);
}

export const addCommand = new Command()
  .version(vnoteVersion)
  .arguments("<key:string> <value:string>")
  .action(add);

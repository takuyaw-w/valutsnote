import { Command } from "@cliffy/command";
import type { CommandOptions } from "@cliffy/command";
import { Secret } from "@cliffy/prompt";
import { version as vnoteVersion } from "../version.ts";
import { verifyPassword } from "../utils/hasher.ts";
import { getConfigFilePath, getMemoFilePath } from "../utils/path.ts";
import type { Config } from "../types/config.ts";
import type { SecureMemo } from "../types/secureMemo.ts";
import { errorMsg, successMsg } from "../utils/message.ts";
import { decryptoMemo } from "../utils/encryptor.ts";
import { exists } from "@std/fs";
import { textEncoder } from "../utils/encoder.ts";

async function view(_option: CommandOptions, key: string) {
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
    errorMsg("The password you entered is incorrect. Please try again.");
    Deno.exit(1);
  }

  const memoFilePath = getMemoFilePath();

  if (!await exists(memoFilePath)) {
    await Deno.writeFile(
      memoFilePath,
      textEncoder.encode(JSON.stringify([], null, 2)),
    );
  }

  const memo = JSON.parse(
    await Deno.readTextFile(memoFilePath),
  ) as SecureMemo[];

  const findMemo = memo.find((m) => m.key === key);
  if (findMemo) {
    const decryptedMemo = await decryptoMemo(config.password_hash, findMemo);
    successMsg(`${key}: ${decryptedMemo}`);
  }
}

export const viewCommand = new Command()
  .version(vnoteVersion)
  .arguments("<key:string>")
  .description("View an existing memo by providing its key, after verifying with your master password.")
  .action(view);

import { Command } from "@cliffy/command";
import type { CommandOptions } from "@cliffy/command";
import { Confirm, Secret } from "@cliffy/prompt";
import { version as vnoteVersion } from "../version.ts";
import { verifyPassword } from "../utils/hasher.ts";
import { getConfigFilePath, getMemoFilePath } from "../utils/path.ts";
import type { Config } from "../types/config.ts";
import type { SecureMemo } from "../types/secureMemo.ts";
import { errorMsg, successMsg } from "../utils/message.ts";
import { encryptoMemo } from "../utils/encryptor.ts";
import { exists } from "@std/fs";
import { textEncoder } from "../utils/encoder.ts";

async function add(_option: CommandOptions, key: string, value: string) {
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

  const existIndex = memo.findIndex((m) => m.key === key);
  const encryptedMemo = await encryptoMemo(key, config.password_hash, value);

  if (existIndex !== -1) {
    const confirm = await Confirm.prompt(
      `A memo with the key '${key}' already exists. Do you want to overwrite it?`,
    );
    if (!confirm) {
      Deno.exit(0);
    }

    const updateMemo = {
      ...memo[existIndex],
      ...encryptedMemo,
      createdAt: memo[existIndex].createdAt,
      updatedAt: encryptedMemo.updatedAt,
    };

    memo.splice(existIndex, 1, updateMemo);
  } else {
    memo.push(encryptedMemo);
  }

  await Deno.writeFile(
    memoFilePath,
    textEncoder.encode(JSON.stringify(memo, null, 2)),
  );
  successMsg(`Your memo with the key '${key}' has been saved successfully.`);
}

export const addCommand = new Command()
  .version(vnoteVersion)
  .arguments("<key:string> <value:string>")
  .description(
    "Add a new secure memo or update an existing one using your master password for encryption.",
  )
  .action(add);

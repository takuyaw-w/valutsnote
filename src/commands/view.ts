import { Command } from "@cliffy/command";
import type { CommandOptions } from "@cliffy/command";
import { version as vnoteVersion } from "../version.ts";
import { errorMsg, successMsg } from "../utils/message.ts";
import { decryptoMemo } from "../utils/encryptor.ts";
import {
  loadConfig,
  loadOrCreateMemo,
  promptAndVerifyPassword,
} from "../utils/memo.ts";

async function view(_option: CommandOptions, key: string) {
  try {
    const config = await loadConfig();
    await promptAndVerifyPassword(config);

    const memo = await loadOrCreateMemo();
    const findMemo = memo.find((m) => m.key === key);
    if (findMemo) {
      const decryptedMemo = await decryptoMemo(config.password_hash, findMemo);
      successMsg(`${key}: ${decryptedMemo}`);
    }
  } catch (e) {
    if (e instanceof Error) {
      errorMsg(`An error occurred: ${e.message}`);
    } else {
      errorMsg(`An error occurred.`);
    }
  }
}

export const viewCommand = new Command()
  .version(vnoteVersion)
  .arguments("<key:string>")
  .description(
    "View an existing memo by providing its key, after verifying with your master password.",
  )
  .action(view);

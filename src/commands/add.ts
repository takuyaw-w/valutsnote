import { Command } from "@cliffy/command";
import type { CommandOptions } from "@cliffy/command";
import { version as vnoteVersion } from "../version.ts";
import { errorMsg, successMsg } from "../utils/message.ts";
import {
  loadConfig,
  loadOrCreateMemo,
  promptAndVerifyPassword,
  saveOrUpdateMemo,
} from "../utils/memo.ts";
import { encryptoMemo } from "../utils/encryptor.ts";

async function add(_option: CommandOptions, key: string, value: string) {
  try {
    const config = await loadConfig();
    await promptAndVerifyPassword(config);

    const memo = await loadOrCreateMemo();
    const encryptedMemo = await encryptoMemo(key, config.password_hash, value);
    await saveOrUpdateMemo(memo, key, encryptedMemo);

    successMsg(`Your memo with the key '${key}' has been saved successfully.`);
  } catch (e) {
    if (e instanceof Error) {
      errorMsg(`An error occurred: ${e.message}`);
    } else {
      errorMsg(`An error occurred.`);
    }
  }
}

export const addCommand = new Command()
  .version(vnoteVersion)
  .arguments("<key:string> <value:string>")
  .description(
    "Add a new secure memo or update an existing one using your master password for encryption.",
  )
  .action(add);

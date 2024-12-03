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
import { Select } from "@cliffy/prompt";

async function view(_option: CommandOptions) {
  try {
    const config = await loadConfig();
    await promptAndVerifyPassword(config);

    const memo = await loadOrCreateMemo();
    const selectedKey = await Select.prompt({
      message: "please select key.",
      options: memo.map((v) => v.key),
    });
    const findMemo = memo.find((m) => m.key === selectedKey);
    if (findMemo) {
      const decryptedMemo = await decryptoMemo(config.password_hash, findMemo);
      successMsg(`${selectedKey}: ${decryptedMemo}`);
    } else {
      errorMsg(`No memo found with the key '${selectedKey}'.`);
      Deno.exit(1);
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
  .description(
    "View an existing memo by providing its key, after verifying with your master password.",
  )
  .action(view);

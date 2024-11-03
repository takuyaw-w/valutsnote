import { Command } from "@cliffy/command";
import type { CommandOptions } from "@cliffy/command";
import { version as vnoteVersion } from "../version.ts";
import { errorMsg, successMsg } from "../utils/message.ts";
import {
  loadConfig,
  loadOrCreateMemo,
  promptAndVerifyPassword,
  saveMemoToFile,
} from "../utils/memo.ts";

async function remove(_option: CommandOptions, key: string) {
  try {
    const config = await loadConfig();
    await promptAndVerifyPassword(config);

    const memo = await loadOrCreateMemo();
    const memoIndex = memo.findIndex((m) => m.key === key);
    if (memoIndex === -1) {
      errorMsg(`No memo found with the key '${key}'.`);
      return;
    }

    memo.splice(memoIndex, 1);
    await saveMemoToFile(memo);
    successMsg(`The memo with the key '${key}' has been deleted successfully.`);
  } catch (error) {
    if (error instanceof Error) {
      errorMsg(`An error occurred: ${error.message}`);
    } else {
      errorMsg("An unexpected error occurred.");
    }
  }
}

export const deleteCommand = new Command()
  .version(vnoteVersion)
  .arguments("<key:string>")
  .description(
    "Delete an existing memo by providing its key, after verifying with your master password.",
  )
  .action(remove);

import { Command } from "@cliffy/command";
import type { CommandOptions } from "@cliffy/command";
import { version as vnoteVersion } from "../version.ts";
import { errorMsg, successMsg } from "../utils/message.ts";
import {
  loadConfig,
  loadOrCreateMemo,
  promptAndVerifyPassword,
} from "../utils/memo.ts";
import { formatDate } from '../utils/date.ts'

async function list(_option: CommandOptions, simple: boolean) {
  try {
    const config = await loadConfig();
    await promptAndVerifyPassword(config);

    const memo = await loadOrCreateMemo();
    if (memo.length === 0) {
      errorMsg("No memos found.");
      return;
    }

    if (simple) {
      successMsg("List of Memo Keys:");
      for (const m of memo) {
        successMsg(`- ${m.key}`);
      }
    } else {
      successMsg("List of Secure Memos:");
      for (const m of memo) {
        const createdAt = formatDate(m.createdAt);
        const updatedAt = formatDate(m.updatedAt);
        successMsg(`Key: ${m.key}\n  Created At: ${createdAt}\n  Updated At: ${updatedAt}`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      errorMsg(`An error occurred: ${error.message}`);
    } else {
      errorMsg("An unexpected error occurred.");
    }
  }
}

export const listCommand = new Command()
  .version(vnoteVersion)
  .description(
    "List all secure memos after verifying with your master password."
  )
  .option("-s, --simple", "Display only the memo keys in a simple list format.")
  .action((options: CommandOptions) => {
    list(options, options.simple);
  });


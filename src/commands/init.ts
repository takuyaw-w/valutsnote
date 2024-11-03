import { Command } from "@cliffy/command";
import { version as vnoteVersion } from "../version.ts";
import { errorMsg, successMsg } from "../utils/message.ts";
import { getAppDir, getConfigFilePath } from "../utils/path.ts";
import { hashPassword } from "../utils/hasher.ts";
import {
  confirmOverwriteIfExists,
  promptForPassword,
  saveConfigFile,
} from "../utils/init.ts";

async function init() {
  try {
    const appDir = getAppDir();
    await confirmOverwriteIfExists(appDir);

    const recivedPassword = await promptForPassword();
    const writePassword = await hashPassword(recivedPassword);
    await saveConfigFile(getConfigFilePath(), writePassword);
    successMsg("Initialization successful. Your password has been set.");
  } catch (e) {
    if (e instanceof Error) {
      errorMsg(`An error occurred: ${e.message}`);
    } else {
      errorMsg(`An error occurred.`);
    }
  }
}

export const initCommand = new Command()
  .version(vnoteVersion)
  .description(
    "Initialize VaultNote by setting up a master password to encrypt and manage your secure notes.",
  )
  .action(init);

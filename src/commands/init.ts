import { Command } from "@cliffy/command";
import { Confirm, Secret } from "@cliffy/prompt";
import { ensureDir, exists } from "@std/fs";
import { version as vnoteVersion } from "../version.ts";
import * as path from "@std/path";
import { errorMsg, successMsg } from "../utils/message.ts";
import { textEncoder } from "../utils/encoder.ts";
import { getAppDir, getConfigFilePath } from "../utils/path.ts";
import { hashPassword } from "../utils/hasher.ts";
import { Config } from "../types/config.ts";

const MIN_LENGTH = 1;

async function promptForPassword(): Promise<string> {
  const password: string = await Secret.prompt({
    message: "Enter your password.",
    minLength: MIN_LENGTH,
  });
  const confirmPassword: string = await Secret.prompt({
    message: "Enter your Confirm password.",
    minLength: MIN_LENGTH,
  });

  if (password !== confirmPassword) {
    errorMsg(`Error: Passwords do not match. Please try again.`);
    Deno.exit(1);
  }

  return password;
}

async function saveConfigFile(filePath: string, data: Config): Promise<void> {
  await ensureDir(path.dirname(filePath));
  const configData = textEncoder.encode(JSON.stringify(data, null, 2));
  await Deno.writeFile(filePath, configData);
}

async function confirmOverwriteIfExists(directoryPath: string): Promise<void> {
  if (await exists(directoryPath)) {
    const confirmed = await Confirm.prompt(
      "Warning: A directory with existing data already exists. Do you want to overwrite it? This action cannot be undone. (y/n)",
    );
    if (!confirmed) {
      Deno.exit(0);
    }
  }
}

async function init() {
  const appDir = getAppDir();

  await confirmOverwriteIfExists(appDir);

  const recivedPassword = await promptForPassword();
  const writePassword = await hashPassword(recivedPassword);
  await saveConfigFile(getConfigFilePath(), writePassword);
  successMsg("Initialization successful. Your password has been set.");
}

export const initCommand = new Command()
  .version(vnoteVersion)
  .description("Initialize VaultNote by setting up a master password to encrypt and manage your secure notes.")
  .action(init);

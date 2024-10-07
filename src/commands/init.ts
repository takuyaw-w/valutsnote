import { Command } from "@cliffy/command";
import { Confirm, Secret } from "@cliffy/prompt";
import { ensureDir, exists } from "@std/fs";
import { version as vnoteVersion } from "../version.ts";
import * as path from "@std/path";
import { bold, red } from "@std/fmt/colors";
import { encoder } from "../utils/encoder.ts";
import { getHomeDirectory } from "../utils/path.ts";
import { generatePassword } from "../utils/auth.ts";

async function promptForPassword(): Promise<string> {
  const password: string = await Secret.prompt({
    message: "Enter your password.",
  });
  const confirmPassword: string = await Secret.prompt({
    message: "Enter your Confirm password.",
  });

  if (password.length === 0 || confirmPassword.length === 0) {
    console.error(
      bold(
        red(
          `Error: Password cannot be empty. Please enter a password with at least one character.`,
        ),
      ),
    );
    Deno.exit(1);
  }

  if (password !== confirmPassword) {
    console.error(
      bold(red(`Error: Passwords do not match. Please try again.`)),
    );
    Deno.exit(1);
  }

  return password;
}

async function saveConfigFile(filePath: string, data: Config): Promise<void> {
  await ensureDir(path.dirname(filePath));
  const configData = encoder.encode(JSON.stringify(data, null, 2));
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
  const homeDir = getHomeDirectory();
  const dotFolderPath = path.resolve(homeDir, ".vaultnote");

  await confirmOverwriteIfExists(dotFolderPath);

  const password = await promptForPassword();
  const passwordData = await generatePassword(password);
  await saveConfigFile(path.join(dotFolderPath, "config.json"), passwordData);
}

export const initCommand = new Command()
  .version(vnoteVersion)
  .action(init);

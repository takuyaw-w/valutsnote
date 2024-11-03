import { Confirm, Secret } from "@cliffy/prompt";
import { ensureDir, exists } from "@std/fs";
import * as path from "@std/path";
import { errorMsg } from "./message.ts";
import { textEncoder } from "./encoder.ts";
import { Config } from "../types/config.ts";

const MIN_LENGTH = 1;

export async function promptForPassword(): Promise<string> {
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

export async function saveConfigFile(
  filePath: string,
  data: Config,
): Promise<void> {
  await ensureDir(path.dirname(filePath));
  const configData = textEncoder.encode(JSON.stringify(data, null, 2));
  await Deno.writeFile(filePath, configData);
}

export async function confirmOverwriteIfExists(
  directoryPath: string,
): Promise<void> {
  if (await exists(directoryPath)) {
    const confirmed = await Confirm.prompt(
      "Warning: A directory with existing data already exists. Do you want to overwrite it? This action cannot be undone. (y/n)",
    );
    if (!confirmed) {
      Deno.exit(0);
    }
  }
}

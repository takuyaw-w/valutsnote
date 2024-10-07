import { Command } from "@cliffy/command";
import { Confirm, Secret } from "@cliffy/prompt";
import { ensureDir, ensureFile, exists } from "@std/fs";
import { version as vnoteVersion } from "../version.ts";
import { decodeHex, encodeHex } from "@std/encoding";
import * as path from "@std/path";
import { bold, red } from "@std/fmt/colors";

const encoder = new TextEncoder()

async function init() {
  const homeDir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
  const dotFolderPath = path.resolve(homeDir as string, '.vaultnote');

  const existConfig = await exists(dotFolderPath);

  if (existConfig) {
    const confirmed: boolean = await Confirm.prompt(
      "Warning: A directory with existing data already exists. Do you want to overwrite it? This action cannot be undone. (y/n)",
    );
    if (!confirmed) {
      Deno.exit(0);
    }
  }

  const password: string = await Secret.prompt({
    message: "Enter your password.",
  });
  const confirmPassword: string = await Secret.prompt({
    message: "Enter your Confirm password.",
  });

  if (password !== confirmPassword) {
    console.error(
      bold(red(`Error: Passwords do not match. Please try again.`)),
    );
    Deno.exit(1);
  }

  const salt = await crypto.getRandomValues(new Uint8Array(16));
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 700001,
      hash: "SHA-512",
    },
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"],
    ),
    512,
  );

  const password_data = {
    password: encodeHex(bits),
    salt: encodeHex(salt),
  };

  await ensureDir(dotFolderPath);
  const data = encoder.encode(JSON.stringify(password_data, null, 2));
  const configFile = await Deno.open(path.resolve(dotFolderPath, 'config.json'), {
    truncate: true,
    read: true,
    write: true,
    create: true,
  });
  await configFile.write(data);
}

export const initCommand = new Command()
  .version(vnoteVersion)
  .action(init);

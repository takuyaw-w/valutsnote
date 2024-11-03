// utils/memoUtils.ts
import { getConfigFilePath, getMemoFilePath } from "./path.ts";
import type { Config } from "../types/config.ts";
import type { SecureMemo } from "../types/secureMemo.ts";
import { Confirm, Secret } from "@cliffy/prompt";
import { exists } from "@std/fs";
import { textEncoder } from "./encoder.ts";
import { verifyPassword } from "./hasher.ts";
import { errorMsg } from "./message.ts";

export async function loadConfig(): Promise<Config> {
  const configFilePath = getConfigFilePath();
  const configContent = await Deno.readTextFile(configFilePath);
  return JSON.parse(configContent) as Config;
}

export async function loadOrCreateMemo(): Promise<SecureMemo[]> {
  const memoFilePath = getMemoFilePath();

  if (!(await exists(memoFilePath))) {
    await Deno.writeFile(
      memoFilePath,
      textEncoder.encode(JSON.stringify([], null, 2)),
    );
  }

  const memoContent = await Deno.readTextFile(memoFilePath);
  return JSON.parse(memoContent) as SecureMemo[];
}

export async function saveOrUpdateMemo(
  memo: SecureMemo[],
  key: string,
  encryptedMemo: SecureMemo,
) {
  const memoFilePath = getMemoFilePath();
  const existIndex = memo.findIndex((m) => m.key === key);

  if (existIndex !== -1) {
    const confirm = await Confirm.prompt(
      `A memo with the key '${key}' already exists. Do you want to overwrite it?`,
    );
    if (!confirm) {
      Deno.exit(0);
    }

    memo[existIndex] = {
      ...memo[existIndex],
      ...encryptedMemo,
      createdAt: memo[existIndex].createdAt,
      updatedAt: encryptedMemo.updatedAt,
    };
  } else {
    memo.push(encryptedMemo);
  }

  await Deno.writeFile(
    memoFilePath,
    textEncoder.encode(JSON.stringify(memo, null, 2)),
  );
}

export async function promptAndVerifyPassword(config: Config): Promise<void> {
  const password = await Secret.prompt("please input password.");
  const verifyResult = await verifyPassword(
    password,
    config.password_hash,
    config.salt,
  );

  if (!verifyResult) {
    errorMsg("The password you entered is incorrect. Please try again.");
    Deno.exit(1);
  }
}

export async function saveMemoToFile(memo: SecureMemo[]): Promise<void> {
  const memoFilePath = getMemoFilePath();
  await Deno.writeFile(
    memoFilePath,
    textEncoder.encode(JSON.stringify(memo, null, 2)),
  );
}

import { encoder } from "./encoder.ts";
import { encodeHex } from "@std/encoding";
import type { Config } from "../type/types.ts";

export async function generatePassword(password: string): Promise<Config> {
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

  return {
    password: encodeHex(bits),
    salt: encodeHex(salt),
  };
}

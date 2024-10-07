import { encoder } from "./encoder.ts";
import { decodeHex, encodeHex } from "@std/encoding";
import type { Config } from "../type/types.ts";

const ITERATIONS = 700_001;

export async function hashPassword(password: string): Promise<Config> {
  const salt = await crypto.getRandomValues(new Uint8Array(16));
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-512",
    },
    passwordKey,
    512,
  );

  return {
    password_hash: encodeHex(bits),
    salt: encodeHex(salt),
  };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string,
): Promise<boolean> {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: decodeHex(salt),
      iterations: ITERATIONS,
      hash: "SHA-512",
    },
    passwordKey,
    512,
  );

  const generatedHash = encodeHex(bits);
  return generatedHash === storedHash;
}

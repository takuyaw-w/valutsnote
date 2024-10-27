import type { SecureMemo } from "../types/secureMemo.ts";
import { textDecoder, textEncoder } from "./encoder.ts";
import { decodeHex, encodeHex } from "@std/encoding";

const TAG_LENGTH = 16;

export async function encryptoMemo(
  keyString: string,
  password: string,
  memo: string,
): Promise<SecureMemo> {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt);
  const cipherTextBuff = await globalThis.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    textEncoder.encode(memo),
  );

  const cipherTextArray = new Uint8Array(cipherTextBuff);

  const cipherText = cipherTextArray.slice(
    0,
    cipherTextArray.length - TAG_LENGTH,
  );
  const tag = cipherTextArray.slice(cipherTextArray.length - TAG_LENGTH);

  return {
    key: keyString,
    cipherText: encodeHex(cipherText),
    iv: encodeHex(iv),
    tag: encodeHex(tag),
    salt: encodeHex(salt),
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  };
}

export async function decryptoMemo(
  password: string,
  secureMemo: SecureMemo,
): Promise<string> {
  const salt = decodeHex(secureMemo.salt);
  const iv = decodeHex(secureMemo.iv);
  const tag = decodeHex(secureMemo.tag);
  const cipherText = decodeHex(secureMemo.cipherText);
  const key = await deriveKey(password, salt);

  const combinedData = new Uint8Array([...cipherText, ...tag]);

  const decryptedBuff = await globalThis.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128,
    },
    key,
    combinedData,
  );

  return textDecoder.decode(decryptedBuff);
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey", "deriveBits"],
  );

  return globalThis.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

import { decryptoMemo, encryptoMemo } from "../src/utils/encryptor.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("encryptoMemo and decryptoMemo", async () => {
  const password = "test-password";
  const key = "test-key";
  const value = "This is a secret memo.";

  const encryptedMemo = await encryptoMemo(key, password, value);

  assertExists(encryptedMemo.key);
  assertExists(encryptedMemo.cipherText);
  assertExists(encryptedMemo.iv);
  assertExists(encryptedMemo.tag);
  assertExists(encryptedMemo.salt);

  const decryptedMemo = await decryptoMemo(password, encryptedMemo);

  assertEquals(decryptedMemo, value);
});

import { assertEquals } from "@std/assert";
import { hashPassword, verifyPassword } from "../src/utils/hasher.ts";

Deno.test("hashPassword and verifyPassword", async () => {
  const password = "secure-password";

  const { password_hash, salt } = await hashPassword(password);

  const isValid = await verifyPassword(password, password_hash, salt);
  assertEquals(isValid, true);

  const isInvalid = await verifyPassword("wrong-password", password_hash, salt);
  assertEquals(isInvalid, false);
});

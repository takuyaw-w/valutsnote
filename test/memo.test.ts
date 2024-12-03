import { loadOrCreateMemo, saveOrUpdateMemo } from "../src/utils/memo.ts";
import { SecureMemo } from "../src/types/secureMemo.ts";
import { getMemoFilePath } from "../src/utils/path.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("loadOrCreateMemo and saveOrUpdateMemo", async () => {
  const filePath = getMemoFilePath();

  await Deno.writeTextFile(filePath, "[]");

  const memoKey = "test-key";
  const memoData: SecureMemo = {
    key: memoKey,
    cipherText: "ciper",
    iv: "iv",
    tag: "tag",
    salt: "salt",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  let memos = await loadOrCreateMemo();
  await saveOrUpdateMemo(memos, memoKey, memoData);

  memos = await loadOrCreateMemo();
  const savedMemo = memos.find((m) => m.key === memoKey);

  assertExists(savedMemo);
  assertEquals(savedMemo?.key, memoKey);
});

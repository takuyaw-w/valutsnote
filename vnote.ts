import { Command } from "@cliffy/command";
import { initCommand } from "./src/commands/init.ts";

const vnote = new Command()
  .name("VaultsNote")
  .description("description")
  .usage("vnote <subcommand>")
  .command("init", initCommand);

try {
  const { options } = await vnote.parse(Deno.args);
} catch (err) {
  console.error(err);
}

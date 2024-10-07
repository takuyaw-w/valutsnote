import { Command } from "@cliffy/command";
import { initCommand } from "./src/commands/init.ts";
import { addCommand } from "./src/commands/add.ts";

const vnote = new Command()
  .name("vnote")
  .description("description")
  .usage("vnote <subcommand>")
  .command("init", initCommand)
  .command("add", addCommand);

try {
  const { options } = await vnote.parse(Deno.args);
} catch (err) {
  console.error(err);
}

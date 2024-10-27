import { Command } from "@cliffy/command";
import { initCommand } from "./src/commands/init.ts";
import { addCommand } from "./src/commands/add.ts";
import { viewCommand } from "./src/commands/view.ts";

new Command()
  .name("vnote")
  .description("description")
  .usage("vnote <subcommand>")
  .command("init", initCommand)
  .command("add", addCommand)
  .command("view", viewCommand)
  .parse(Deno.args)

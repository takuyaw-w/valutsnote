import { Command } from "@cliffy/command";
import { version } from "./src/version.ts";
import { initCommand } from "./src/commands/init.ts";
import { addCommand } from "./src/commands/add.ts";
import { viewCommand } from "./src/commands/view.ts";

await new Command()
  .stopEarly()
  .name("vnote")
  .version(version)
  .description(
    "A secure command-line tool for managing encrypted personal memos.",
  )
  .usage("<subcommand>")
  .arguments("<subcommand>")
  .command("init", initCommand)
  .command("add", addCommand)
  .command("view", viewCommand)
  .reset()
  .parse(Deno.args);

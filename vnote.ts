import { Command } from "@cliffy/command";
import { version } from "./src/version.ts";
import { initCommand } from "./src/commands/init.ts";
import { addCommand } from "./src/commands/add.ts";
import { viewCommand } from "./src/commands/view.ts";
import { listCommand } from "./src/commands/list.ts";

try {
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
    .command("list", listCommand)
    .reset()
    .parse(Deno.args);
} catch (e) {
  if (e instanceof Error) {
    console.error(`An unexpected error occurred: ${e.message}`);
  } else {
    console.error("An unexpected error occurred.");
  }
  Deno.exit(1);
}

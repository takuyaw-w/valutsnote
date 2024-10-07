import { Command, Option } from "@cliffy/command";
import { version as vnoteVersion } from "../version.ts";

async function add(_option: Option, key: string, value: string) {
  console.log(key, value);
  console.log(typeof key);
  console.log(typeof value);
}

export const addCommand = new Command()
  .version(vnoteVersion)
  .arguments("<key:string> <value:string>")
  .action(add);

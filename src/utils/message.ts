import { bold, green, red, yellow } from "@std/fmt/colors";

export function errorMsg(msg: string) {
  console.error(bold(red(msg)));
}

export function successMsg(msg: string) {
  console.info(bold(green(msg)));
}

export function warningMsg(msg: string) {
  console.warn(bold(yellow(msg)));
}

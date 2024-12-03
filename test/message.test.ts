import { errorMsg, successMsg, warningMsg } from '../src/utils/message.ts'
import { assertStringIncludes } from '@std/assert'

Deno.test("message functions", () => {
    const consoleError = console.error;
    const consoleInfo = console.info;
    const consoleWarn = console.warn;

    let errorOutput = "";
    let successOutput = "";
    let warningOutput = "";

    console.error = (msg: string) => (errorOutput = msg)
    console.info = (msg: string) => (successOutput = msg)
    console.warn = (msg: string) => (warningOutput = msg)

    errorMsg("Error message")
    successMsg("Success message")
    warningMsg("Warning message")

    assertStringIncludes(errorOutput, "Error message")
    assertStringIncludes(successOutput, "Success message")
    assertStringIncludes(warningOutput, "Warning message")

    console.error = consoleError
    console.info = consoleInfo
    console.warn = consoleWarn
})

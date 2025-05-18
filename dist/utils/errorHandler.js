import chalk from "chalk";
export const errorHandler = (e, ctx) => {
    const msg = e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error occured.";
    console.error(`\n${chalk.red(`ERR${ctx ? ` - ${ctx}` : ""}:`)}`);
    console.error("→", msg);
    if (e instanceof Error && e.stack) {
        console.error(`\n\n  ⤷ Stack trace (partial):\n`, `${chalk.grey(e.stack.split("\n").slice(1, 4).join("\n"))}`);
    }
};

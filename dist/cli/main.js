#!/usr/bin/env node
import { Command } from "commander";
import { routeAction } from "./commands/route.js";
import { routes } from "./commands/routes.js";
import { run } from "./commands/run.js";
import { dev } from "./commands/dev.js";
import { init } from "./commands/init.js";
const program = new Command();
program
    .name("rensa")
    .description("A CLI tool for your Rensa server.");
program.command("init")
    .option('-f, --force', "Overwrite existing config")
    .action((options) => {
    init(options.force);
});
program.command("route <method> <route>")
    .option('-f, --force', "Overwrite existing route file", false)
    .option('-t, --ts', "Whether or not using TypeScript", false)
    .action(async (method, route, options) => {
    await routeAction(method, route, options.force, options.ts);
});
program.command("routes")
    .action(async () => {
    await routes();
});
program.command("run")
    .action(async () => {
    await run();
});
program.command("dev")
    .action(async () => {
    await dev();
});
program.parse(process.argv);

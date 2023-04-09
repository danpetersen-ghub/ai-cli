#!/usr/bin/env node
console.log("hello");

import { Command } from 'commander';

const program = new Command();

program
    .name('cmd-test')
    .description('test command')
    .version('0.0.1');

program.command('test')
    .description("Prompt for the LLM API")
    .argument('<string>', 'string to Send')
    .action((str) => {
        console.log(
            `chalk.red.bold(${str})`);
    });

program.parse();

// RUN: ```node test.mjs test "test"``` 
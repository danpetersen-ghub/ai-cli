#!/usr/bin/env node

// console.log("RUNNING!")
import { Command } from 'commander';
import { logBlue, logGreen } from './utils/chalk.mjs';
import { appendToFile } from './utils/storeLogHistory.mjs'

import dotenv from 'dotenv';
dotenv.config();

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: process.env.OPENAI_API_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_API_MODEL;
const FILE_PATH = './tmp/chatHistory.md';

const openai = new OpenAIApi(configuration);

// Set up CLI program
const program = new Command();
program.version('1.0.0');

program.command('ai')
    .description("Communicate with Chat GPT from your CLI!")
    .option('-c, --context <value>', 'Choose a context for the chatbot i.e. Feature or bug')
    .option('-d, --debug')
    .option('-t, --test <value>', 'option with an explicitly passed value')
    .option('-p, --prompt <value>', `Prompt for the model ${MODEL}`)
    .action(async (commandAndOptions) => {

        // console.log("running action 1");
        // console.log(commandAndOptions);

        if (commandAndOptions.debug) {
            console.error(`Called commandAndOptions.debug`);
        }

        // Define precreated parts of the prompt
        const preCreatedContext = {
            feature: `This is a feature preset, respond in this format:
            ## Feature:
            ## Due Date:
            ## Description:
            ## Acceptance Criteria:
            `,
            bug: `This is a feature preset, respond in this format:
            ## BUG:
            ## Due Date:
            ## Steps to Reproduce:
            ## Expected Result:
            `,
        };

        let completePrompt = "";
        if (commandAndOptions.context) {
            console.log('Context exists');
            completePrompt = preCreatedContext[commandAndOptions.context] + ` Prompt: ${commandAndOptions.prompt}`;

        } else {
            console.log('No context');
            completePrompt = `Prompt: ${commandAndOptions.prompt}`;
        }
        logBlue(completePrompt);
        appendToFile(`\n\n ## ${completePrompt}`, FILE_PATH);

        try {
            const API_KEY = process.env.OPENAI_API_KEY;
            const apiUrl = `https://api.openai.com/v1/chat/completions`;

            const body = {
                "model": `${MODEL}`,
                "messages": [{ "role": "user", "content": completePrompt }]
            }

            const response = await fetch(apiUrl, {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            const data = await response.json();

            if (!data.choices[0].message) {
                console.log('data.choices[0].message is undefined');
                JSON.stringify(data);
            } else {
                const responseMessage = `Chat GPT: ${data.choices[0].message.content}`;
                logGreen(responseMessage);
                appendToFile(`${responseMessage}\n\n <hr>`, FILE_PATH);
            }

        } catch (error) {
            console.log(error);
        }
    })
// .action((commandAndOptions) => {
//     console.log("running action 2");
//     console.log(commandAndOptions.test, commandAndOptions.prompt, commandAndOptions.debug, commandAndOptions);
// });

//program.opts();
program.parse(process.argv);

// RUN: ``` node app.mjs ai -p test" ```
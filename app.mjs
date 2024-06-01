#!/usr/bin/env node

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

import dotenv from 'dotenv';
dotenv.config();

import { promises as fs } from 'fs';
import { Command } from 'commander';
import { logBlue, logGreen, logRed, logCyan } from './utils/chalk.mjs';
import { appendToFile } from './utils/storeLogHistory.mjs'
import { preCreatedContext } from './utils/preCreatedContext.mjs'

const chatHistory = require('./tmp/currentchat.json');

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
    .option('-n, --new')
    .option('-r, --reset')
    .option('-c, --context <value>', 'Choose a context for the chatbot i.e. Feature or bug')
    .option('-d, --debug')
    .option('-t, --test <value>', 'option with an explicitly passed value')
    .option('-p, --prompt <value>', `Prompt for the model ${MODEL}`)
    .action(async (commandAndOptions) => {

        //console.log(commandAndOptions);

        if (commandAndOptions.new) {
            logBlue(`Welcome to ${MODEL}, here are your options...`)
            console.table([
                ["message", "Run send a new message to Chat GPT"],
                ["reset", "Start a new conversation"],
                ["feature", "Use the preset feature template"],
            ])

            fs.writeFile('./tmp/currentchat.json', JSON.stringify({}), (err) => {
                if (err) {
                    console.error('Error writing file', err);
                } else {
                    console.log('Successfully wrote file');
                }
            });
        }

        if (commandAndOptions.debug) {
            logRed(`Called commandAndOptions.debug`);
        }

        if (commandAndOptions.reset) {
            logRed(`Chat Reset`);
        }

        if (commandAndOptions.prompt) {

            /*
             let latestMessage: {
                            "role": "user",
                            "content": userInput
                        }
            */

            let userInput = "";

            // Add Context if found

            if (commandAndOptions.context) {
                logCyan('Context exists');
                userInput = preCreatedContext[commandAndOptions.context] + ` Prompt: ${commandAndOptions.prompt}`;
            } else {
                userInput = `${commandAndOptions.prompt}`;
            }

            logCyan(`Prompt: ` + userInput);
            appendToFile(`\n\n ## ${userInput}`, FILE_PATH);

            // Send to OpenAI

            let latestMessage = {
                "role": "user",
                "content": userInput
            }
            let allMessages = chatHistory?.messages ? [...chatHistory.messages, latestMessage] : [latestMessage];

            let allmessages = {
                "model": `${MODEL}`,
                "messages": allMessages
            }

            fs.writeFile('./tmp/currentchat.json', JSON.stringify(allmessages), (err) => {
                if (err) {
                    console.error('Error writing file', err);
                } else {
                    console.log('Successfully wrote file');
                }
            });

            try {
                const API_KEY = process.env.OPENAI_API_KEY;
                const apiUrl = `https://api.openai.com/v1/chat/completions`;

                const response = await fetch(apiUrl, {
                    method: 'post',
                    body: JSON.stringify(allmessages),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    }
                });

                const data = await response.json();

                if (!data.choices[0].message) {
                    logRed('data.choices[0].message is undefined');
                    JSON.stringify(data);
                } else {
                    const responseMessage = `Chat GPT: ${data.choices[0].message.content}`;
                    logGreen(responseMessage);
                    appendToFile(`${responseMessage}\n\n <hr>`, FILE_PATH);

                    allmessages.messages.push(data.choices[0].message);

                    fs.writeFile('./tmp/currentchat.json', JSON.stringify(allmessages), (err) => {
                        if (err) {
                            console.error('Error writing file', err);
                        } else {
                            console.log('Successfully wrote file');
                        }
                    });
                }

            } catch (error) {
                logRed(error);
            }
        }




    })


program.parse(process.argv);

// RUN: ``` node app.mjs ai -p test" ```
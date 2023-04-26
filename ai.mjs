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

const openai = new OpenAIApi(configuration);

// Set up CLI program
const program = new Command();
program.version('1.0.0');

program.command('ai')
    .description("Communicate with Chat GPT from your CLI!")
    .argument('<prompt>', 'Prompt for the model gpt-3.5-turbo')
    .action(async (prompt) => {

        const API_KEY = process.env.OPENAI_API_KEY;
        const apiUrl = `https://api.openai.com/v1/chat/completions`;

        // const body = {
        //     "model": "text-davinci-003",
        //     "prompt": prompt,
        //     "max_tokens": 700,
        //     "temperature": 0

        // };
        const body = {
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": prompt }]
        }


        try {
            const response = await fetch(apiUrl, {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            const data = await response.json();

            const promptText = `Prompt is: ${prompt}`;
            const responseMessage = `Chat GPT: ${data.choices[0].message.content}`;

            console.log(
                logBlue(promptText),
                logGreen(responseMessage)
            );

            appendToFile("\n\n ## " + promptText + "\n\n" + "## " + responseMessage + "\n\n <hr>", './tmp/chatHistory.md');

            //debug API response
            // console.log(JSON.stringify(data))

        } catch (error) {
            console.log(error);
        }
    });

program.parse();

// RUN: ``` node index.mjs ai "test hello" ```
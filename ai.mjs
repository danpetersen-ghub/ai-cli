#!/usr/bin/env node

import { Command } from 'commander';
import { logBlue, logGreen } from './utils/chalk.mjs';
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

program.command('cli')
    .description("Prompt for the json placeholder API")
    .argument('<prompt>', 'Prompt for the model text-davinci-003')
    .action(async (prompt) => {



        const API_KEY = process.env.OPENAI_API_KEY;
        const apiUrl = `https://api.openai.com/v1/completions`;

        const body = {
            "model": "text-davinci-003",
            "prompt": prompt,
            "max_tokens": 700,
            "temperature": 0
        };

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
            console.log(
                logBlue(`Prompt is: ${prompt}`),
                logGreen(`Chat GPT: ${data.choices[0].text}`)
            );
        } catch (error) {
            console.log(error);
        }
    });

program.parse();
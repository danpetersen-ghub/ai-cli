import { promises as fs } from 'fs';

export async function appendToFile(text, filePath) {
    //const filePath = '../tmp/chatHistory.txt';
    const message = text || "no text provided";
    try {
        await fs.appendFile(filePath, message);
        //console.log('String appended to file!');
    } catch (err) {
        console.error(err);
    }
}

// appendToFile();

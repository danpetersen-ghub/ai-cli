import chalk from 'chalk';

export function logBlue(string) {
    if (string === undefined) {
        console.log('logBlue was called with an undefined value');
    } else {
        console.log(chalk.blue(string));
    }
}

export function logGreen(string) {
    if (string === undefined) {
        console.log('logGreen was called with an undefined value');
    } else {
        console.log(chalk.greenBright(string));
    }
}

export function logRed(string) {
    if (string === undefined) {
        console.log('logGreen was called with an undefined value');
    } else {
        console.log(chalk.redBright(string));
    }
}

export function logCyan(string) {
    if (string === undefined) {
        console.log('logGreen was called with an undefined value');
    } else {
        console.log(chalk.cyan(string));
    }
}
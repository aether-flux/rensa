#!/usr/bin/env node
// import {program} from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';
import { createNewProject } from './commands/newProject.js';

console.log(chalk.hex('#FF7043')(figlet.textSync('Rensa', {horizontalLayout: 'fitted'})));

async function init () {
  console.log(chalk.hex("#FFFFFF")("\n✨ Welcome to Rensa! ✨\n\n"));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: chalk.hex('#11CFBC')("What's your project name?"),
      default: 'rensa-app',
    },
    {
      type: 'list',
      name: 'template',
      message: chalk.hex('#11CFBC')('Choose a template:'),
      choices: ['Basic', 'Auth', 'Fullstack', 'Socket'],
      default: 'Basic',
    }
  ]);

  console.log("\n");

  const spinner = ora({
    text: chalk.hex("#FF7043")("Revving up your project..."),
    spinner: 'dots'
  }).start();

  console.log("\n");

  try {
    createNewProject(answers.projectName);
    spinner.succeed(chalk.green(`Project ${answers.projectName} created successfully!`));
  } catch (e) {
    spinner.fail(chalk.red("Failed to create project."));
  }
}

init();

// program
//   .name('revv')
//   .version('1.0.0')
//   .description('CLI Tool for RevvJS');
// 
// program
//   .command('new <project-name>')
//   .description('Create a New RevvJS Project')
//   .action((projectName) => {
//     createNewProject(projectName);
//   });
// 
// program.parse(process.argv);

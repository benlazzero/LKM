import fs from "fs";
import inquirer from "inquirer";

// generate config file from input prompts
async function initConfigFile() {
  const questions = [
    { type: "input", name: "name", message: "Project name: " },
    { type: "input", name: "description", message: "Description: " },
    { type: "input", name: "author", message: "Author: " },
    {
      type: "input",
      name: "main",
      message: "Entry: ",
      default: "index.js",
    },
  ];

  const answers = await inquirer.prompt(questions);

  fs.writeFileSync("lkmconfig.json", JSON.stringify(answers, null, 2));
}

initConfigFile();

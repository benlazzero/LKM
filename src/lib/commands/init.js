import fs from "fs";
import inquirer from "inquirer";
import { deriveConfig } from "../utils/derive_config.js";

// generate config file from input prompts
async function initConfigFile() {
  const derivePrompt = [
    {
      type: "confirm",
      name: "derive",
      message: "Derive from Package.json?: y/n",
    },
  ];
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

  // if user selects derive then call derive_config
  const { derive } = await inquirer.prompt(derivePrompt);
  if (derive) {
    console.log("gonna use existing package.json");
    deriveConfig();
    return;
  }

  // make config from answers
  const answers = await inquirer.prompt(questions);
  console.log(answers);
  fs.writeFileSync("lknconfig.json", JSON.stringify(answers, null, 2));
}

initConfigFile();

import { findConfig } from "./path_helpers.js";
import { cwd } from "node:process";
import fs from "fs";

// derive config from existing package.json
export async function deriveConfig() {
  const packageJsonPath = findConfig(cwd());
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath + "/package.json", "utf8")
  );
  // TODO: clean this code is dog shit
  const name = { name: packageJson.name };
  const description = { description: packageJson.description };
  const version = { version: packageJson.version };
  const main = { main: packageJson.main };
  const author = { author: packageJson.author };
  const license = { license: packageJson.license };
  let configFields = {
    ...name,
    ...description,
    ...version,
    ...main,
    ...author,
    ...license,
  };
  fs.writeFileSync(
    packageJsonPath + "/lknconfig.json",
    JSON.stringify(configFields, null, 2)
  );
}

import { join, dirname } from "path";
import { existsSync } from "fs";

// recursivly look for package.json, stops at 50 or root dir
function findConfig(currentDir, depth = 0) {
  if (depth > 50) {
    throw new Error("Could not find a package.json file");
  }

  // look for either lknconfig of package.json
  const packageJsonPath = join(currentDir, "package.json");
  const lknJsonPath = join(currentDir, "lknconfig.json");
  if (existsSync(lknJsonPath)) {
    const lknJsonDir = join(currentDir);
    return lknJsonDir;
  } else if (existsSync(packageJsonPath)) {
    const packageJsonDir = join(currentDir);
    return packageJsonDir;
  }

  const parentDir = dirname(currentDir);
  if (parentDir === currentDir) {
    throw new Error("Could not find a config or package.json file");
  }

  return findConfig(parentDir, depth + 1);
}

function validateCwd() {
  const cwd = process.cwd();
  const jsonPath = findConfig(cwd);
  return jsonPath;
}

export default validateCwd;

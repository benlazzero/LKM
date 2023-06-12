import { join, dirname } from "path";
import { existsSync, mkdirSync } from "fs";

// recursivly look for package.json, stops at 50 or root dir
// TODO: dont use recursion
export function findConfig(currentDir, mknode = false, depth = 0) {
  if (depth > 50) {
    throw new Error("Could not find a package.json file");
  }
  // look for lknconfig.json then for package.json then throw if neither found
  const packageJsonPath = join(currentDir, "package.json");
  const lknJsonPath = join(currentDir, "lknconfig.json");

  if (existsSync(lknJsonPath)) {
    const lknJsonDir = join(currentDir);
    if (mknode) {
      const nodeModulesPath = join(lknJsonDir, "node_modules");
      if (!existsSync(nodeModulesPath)) {
        mkdirSync(nodeModulesPath, { recursive: true });
      }
    }
    return lknJsonDir;
  } else if (existsSync(packageJsonPath)) {
    const packageJsonDir = join(currentDir);
    if (mknode) {
      const nodeModulesPath = join(packageJsonDir, "node_modules");
      if (!existsSync(nodeModulesPath)) {
        mkdirSync(nodeModulesPath, { recursive: true });
      }
    }
    return packageJsonDir;
  }

  const parentDir = dirname(currentDir);
  if (parentDir === currentDir) {
    throw new Error("Could not find a config or package.json file");
  }

  return findConfig(parentDir, depth + 1);
}

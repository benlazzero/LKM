import { scrapeRegistry } from "./registry.js";
let registryURL = "https://twitter.com/lknregistry";

export async function resolver(packageName) {
  const registry = await scrapeRegistry(registryURL);
  if (registry.hasOwnProperty(packageName)) {
    console.log("found package by name");
    return registry[packageName];
  } else {
    // will throw in future "package not found"
    console.log("did not find package by name");
    return "not found";
  }
}

export function nameClassifier(packageName) {
  if (packageName.includes("media.licdn")) {
    return 1;
  }
  return 0;
}

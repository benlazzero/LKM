import { mkdirSync, existsSync, readFileSync, renameSync } from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import JSZip from "jszip";
import { join } from "path";
import fetchPackage from "./fetch_package.js";
import validateCwd from "./lookup.js";
import writeZipToCWD from "./generate_package.js";

// file is doing [calling fetch, decoding data, data to zip object, zip object to files folders, renaming dir]
async function bufferToZip(dataBuffer) {
  const data = await pdf(dataBuffer);
  const base64String = data.text;
  const buffer = Buffer.from(base64String, "base64");
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(buffer);
  return loadedZip;
}

async function decodePackage() {
  // get data and zip it
  // pkurl will come in through cli arg
  const pkurl =
    "https://media.licdn.com/dms/document/media/D561FAQHpu5xF1-IRMQ/feedshare-document-pdf-analyzed/0/1685590104258?e=1686787200&v=beta&t=EPPDxfco0QpgCa3cNpuLf4BkEmEVUCFio17SBJpi0ug";
  const dataBuffer = await fetchPackage(pkurl);
  const dataZip = await bufferToZip(dataBuffer);

  // package.json check
  const packageJsonDirPath = validateCwd();
  const nodeModulesPath = join(packageJsonDirPath, "node_modules");

  // node_modules is found or made
  if (!existsSync(nodeModulesPath)) {
    mkdirSync(nodeModulesPath, { recursive: true });
  }

  // temp folder name for package installation because we get name from inside zip
  const tempDirPath = join(nodeModulesPath, "1337temp");

  // install to final path with temp name
  await writeZipToCWD(dataZip, tempDirPath);

  // get the name/version out
  const packageNamePath = join(tempDirPath, "package.json");
  const packageJson = JSON.parse(readFileSync(packageNamePath, "utf8"));
  const packageName = packageJson.name;

  // rename the tempdir to the name thats in the package.json
  const finalDirPath = join(nodeModulesPath, packageName);
  renameSync(tempDirPath, finalDirPath);

  // append information to config json and* generate config from exising if exists.
  // if doesnt exist npm or lkm config then throw

  console.log("Extraction and renaming done.");
}

decodePackage();

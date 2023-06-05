import { findConfig } from "../utils/path_helpers.js";
import { join } from "path";
import { readFileSync, renameSync } from "fs";
import { cwd } from "node:process";
import fetchPackage from "../utils/fetch_package.js";
import { bufferToZip } from "../utils/decode_package.js";
import extractZip from "../utils/generate_package.js";

function nameImportedPackage(packagePath, nodeModulesPath) {
  // get the name/version out of the lkn package
  // this should happen only for lknconfig, lkn build will require one so we can confirm its there
  const configPath = join(packagePath, "package.json");
  const lkmconfigJson = JSON.parse(readFileSync(configPath, "utf8"));
  const packageName = lkmconfigJson.name;
  // rename the tempdir to the name thats in the package.json
  const finalDirPath = join(nodeModulesPath, packageName);
  const tempDirPath = join(nodeModulesPath, "TempName");
  renameSync(tempDirPath, finalDirPath);
}

export async function install() {
  // throws if configs are not found before making node_modules
  const configPathDir = findConfig(cwd(), { mknode: true });
  const nodeModulesPath = join(configPathDir, "node_modules");
  // no registry yet so have to make tempnamed dir then rename after config is read
  // will prob keep because registy is gonna be a twitter account
  const packagePathUnnamed = join(nodeModulesPath, "TempName");

  // fetch package from linkedin
  // hard url for now for debug
  // gonna get args from commanderjs and will also need function to check registry if not url
  const pkurl =
    "https://media.licdn.com/dms/document/media/D561FAQHpu5xF1-IRMQ/feedshare-document-pdf-analyzed/0/1685590104258?e=1686787200&v=beta&t=EPPDxfco0QpgCa3cNpuLf4BkEmEVUCFio17SBJpi0ug";
  const rawPackageBuffer = await fetchPackage(pkurl);
  // buffer to zip to original format
  const ZippedPackage = await bufferToZip(rawPackageBuffer);
  await extractZip(ZippedPackage, packagePathUnnamed);
  nameImportedPackage(packagePathUnnamed, nodeModulesPath);
  console.log("finished package install");
}

install();

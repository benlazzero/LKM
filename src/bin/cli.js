import { program } from "commander";

program.version("0.0.1").description("LKN - the LinkedIn package manager");

// install
program
  .description("Install a package from uploaded linkedIn document CDN url")
  .command("install <packageURL>")
  .alias("i")
  .option("-g", "Save package globally")
  .option("-d", "Save package as dev dep")
  .action((packageURL, options) => {
    // if config not found will look for package.json to append some info from and generate one
    // if neither are found will throw ("requires lkmconfig.json found")
    // also if packages are in node_modules that are lkm and not in lkm config they will be removed
  });

// init
program
  .description("creates a config file from questions")
  .command("init")
  .action(() => {});

// remove
program
  .description("Remove a package")
  .command("remove <package>")
  .option("-g", "Save package globally")
  .action((packageName, options) => {});

// build package
program
  .description('Exports pdf to be uploaded to a Linkedin post for "hosting"')
  .command("build [location]")
  .action((location) => {});

// update
program
  .description("removes old package and brings in new one in place")
  .command("update <package> <updateURL>")
  .alias("up")
  .action((packageName, updateURL) => {});

// Parse arguments
program.parse(process.argv);

// check for package.json
function validate_cwd() {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("not in lpn/npm dir");
  }
}

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

async function writeZipToCWD(Zip, modulesPath) {
  // get files out of zip object
  const Promises = [];
  Zip.forEach(async (relativePath, file) => {
    const targetPath = join(modulesPath, relativePath);
    if (file.dir) {
      mkdirSync(targetPath, { recursive: true });
    } else {
      const fileProcessingPromise = file.async("nodebuffer").then((content) => {
        writeFileSync(targetPath, content);
      });
      Promises.push(fileProcessingPromise);
    }
  });
  await Promise.all(Promises);
}

export default writeZipToCWD;

import { existsSync, mkdirSync, createWriteStream, createReadStream } from "fs";
import archiver from "archiver";
import PDFDocument from "pdfkit";
import { Base64Encode } from "base64-stream";
import { join } from "path";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// check for node_modules folder if not then make it foo
let directoryPath = join(__dirname, "node_modules");
if (!existsSync(directoryPath)) {
  mkdirSync(directoryPath, { recursive: true });
}

// create a file to stream archive data to
let output = createWriteStream("output.pdf");
let archive = archiver("zip", { zlib: { level: 9 } });

// pipe archive data to the output file
archive.pipe(output);

// append files from a directory
archive.directory("express/", false);

// finalize the archive (ie we are done appending files but streams have to finish yet)
archive.finalize();

// wait for the archive to finish
output.on("close", () => {
  console.log("Archive created.");

  // create a read stream for the archive
  let readStream = createReadStream("output.pdf");

  // create a base64 encode stream
  let encodeStream = readStream.pipe(new Base64Encode());

  // create a pdf document
  let doc = new PDFDocument();

  // pipe document to a blob
  doc.pipe(createWriteStream("encoded.pdf"));

  // write the base64 data into the pdf
  encodeStream.on("data", (chunk) => {
    doc.text(chunk.toString("utf8"));
  });

  // finalize the pdf when we're done
  encodeStream.on("end", () => {
    doc.end();
    console.log("PDF created.");
  });
});

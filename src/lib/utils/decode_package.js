import pdf from "pdf-parse/lib/pdf-parse.js";
import JSZip from "jszip";

// file is doing [calling fetch, decoding data, data to zip object, zip object to files folders, renaming dir]
export async function bufferToZip(dataBuffer) {
  const data = await pdf(dataBuffer);
  const base64String = data.text;
  const buffer = Buffer.from(base64String, "base64");
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(buffer);
  return loadedZip;
}

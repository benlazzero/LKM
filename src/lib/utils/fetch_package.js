// Returns uint8 array of a document from a linkedin cdn link
// "pulls down package"

import axios from "axios";

async function fetchPackage(packageURL) {
  try {
    const response = await axios.get(packageURL, { responseType: "arraybuffer" });
    const data = new Uint8Array(response.data);
    return data;
  } catch (error) {
    throw new Error(`Failed to get or package at ${packageURL}: ${error.message}`);
  }
}

export default fetchPackage;

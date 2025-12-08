import { PinataSDK } from "pinata";
import { toHex, Hex } from "viem";
import axios from "axios";
import { createHash } from "crypto";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "gray-wonderful-wildfowl-51.mypinata.cloud"
})
// Pinata IPFS uploads
export async function uploadFileToIPFS(file: File): Promise<string> {
  try {
    const fileJSON = await pinata.upload.public.file(file) 

    return fileJSON.cid;
  } catch (error) {
    console.error("IPFS upload failed:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

// get hash from a file
export async function getFileHash(file: File): Promise<Hex> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return toHex(new Uint8Array(hashBuffer), { size: 32 });
}

// get hash from a url
export async function getHashFromUrl(url: string): Promise<Hex> {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data);
  const hash = "0x" + createHash("sha256").update(buffer).digest("hex");
  
  return hash as Hex;
}

export function getIPFSGatewayURL(ipfsHash: string): string {
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}

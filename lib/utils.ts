import { PinataSDK } from "pinata";
import { toHex, Hex } from "viem";
import axios from "axios";
import { createHash } from "crypto";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "coffee-implicit-tuna-707.mypinata.cloud"
})
// Pinata IPFS upload
export async function uploadFileToIPFS(file: File): Promise<string> {
  try {
    const urlResponse = await fetch(
      `/api/pinata/upload?fileName=${encodeURIComponent(file.name)}`
    );
    console.log("urlResponse:", urlResponse)
    if (!urlResponse.ok) {
      throw new Error('Failed to get upload URL');
    }
    
    const { url: signedUrl } = await urlResponse.json();
    console.log("Signed URL:", signedUrl);
    
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    const result = await uploadResponse.json();
    return result.cid
  } catch (error) {
    console.error("IPFS upload failed:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  const response = await pinata.upload.public.json(jsonMetadata);
  return response.cid;
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

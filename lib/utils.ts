import { PinataSDK } from "pinata";
import { toHex, Hex } from "viem";
import axios from "axios";
import { createHash } from "crypto";
import { findPackageJSON } from "module";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "coffee-implicit-tuna-707.mypinata.cloud"
})
// Pinata IPFS upload
export async function uploadFileToIPFS(file: File): Promise<string> {
  try {
    const urlRequest = await fetch(
      `/api/pinata/upload`
    );
    const { url: signedUrl } = await urlRequest.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('network', 'public');
    
    const uploadResponse = await fetch(signedUrl, {
      method: 'POST',
      body: formData,
    });    

    const { data } = await uploadResponse.json();
    console.log('Upload successful');
    
    return data.cid;
  } catch (error) {
    console.error("IPFS upload failed:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
   try {
    const urlRequest = await fetch(
      `/api/pinata/upload`
    );
    const { url: signedUrl } = await urlRequest.json();

    const formData = new FormData();

    const jsonString = JSON.stringify(jsonMetadata, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });

    formData.append('file', file);
    formData.append('network', 'public');
    
    const uploadResponse = await fetch(signedUrl, {
      method: 'POST',
      body: formData,
    });    

    const { data } = await uploadResponse.json();
    console.log('Upload successful');

    return data.cid;
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

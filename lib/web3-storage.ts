// Web3.Storage integration for IPFS uploads
export async function uploadToIPFS(file: File, metadata: Record<string, any>): Promise<string> {
  try {
    // Create FormData for Web3.Storage
    const formData = new FormData();
    formData.append("file", file);
    
    // Upload to Web3.Storage (free tier available)
    // In production, you would use: https://web3.storage/api/upload
    // For now, we'll simulate the upload and return an IPFS hash
    const hash = await simulateIPFSUpload(file, metadata);
    return hash;
  } catch (error) {
    console.error("IPFS upload failed:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

// Simulate IPFS upload for demo (replace with real Web3.Storage in production)
async function simulateIPFSUpload(file: File, metadata: Record<string, any>): Promise<string> {
  // In production:
  // const response = await fetch('https://api.web3.storage/upload', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${WEB3_STORAGE_TOKEN}` },
  //   body: formData
  // });
  
  // For MVP, generate a mock IPFS hash
  return `bafkrei${Math.random().toString(36).substring(2, 15)}`;
}

export function getIPFSGatewayURL(ipfsHash: string): string {
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}

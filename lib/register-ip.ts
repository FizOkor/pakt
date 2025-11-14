import { PILFlavor, WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";
import { toHex, parseEther } from "viem";
import { STORY_ADDRESSES } from "./story-client";

export interface RegisterIPRequest {
  title: string;
  description: string;
  category: string;
  ipfsHash: string;
  royaltyPercentage: number;
  commercialUse: boolean;
  derivatives: boolean;
  licensingEnabled: boolean;
}

export async function registerIPAsset(
  client: any,
  request: RegisterIPRequest
) {
  try {
    // Create metadata JSON
    const ipMetadata = {
      title: request.title,
      description: request.description,
      category: request.category,
      timestamp: new Date().toISOString(),
    };

    const nftMetadata = {
      name: request.title,
      description: request.description,
      image: `https://ipfs.io/ipfs/${request.ipfsHash}`,
    };

    // Create PIL terms based on configuration
    let pilTerms;
    
    if (request.commercialUse && request.derivatives) {
      // Commercial Remix flavor
      pilTerms = PILFlavor.commercialRemix({
        commercialRevShare: request.royaltyPercentage,
        defaultMintingFee: parseEther("0"), // Free for MVP
        currency: WIP_TOKEN_ADDRESS,
        royaltyPolicy: STORY_ADDRESSES.ROYALTY_POLICY_LAP,
      });
    } else if (request.commercialUse) {
      // Commercial Use flavor
      pilTerms = PILFlavor.commercialUse({
        defaultMintingFee: parseEther("0"),
        currency: WIP_TOKEN_ADDRESS,
        royaltyPolicy: STORY_ADDRESSES.ROYALTY_POLICY_LAP,
      });
    } else if (request.derivatives) {
      // Non-Commercial Social Remixing
      pilTerms = PILFlavor.nonCommercialSocialRemixing({
        currency: WIP_TOKEN_ADDRESS,
        royaltyPolicy: STORY_ADDRESSES.ROYALTY_POLICY_LAP,
      });
    } else {
      // Creative Commons Attribution
      pilTerms = PILFlavor.creativeCommonsAttribution({
        currency: WIP_TOKEN_ADDRESS,
        royaltyPolicy: STORY_ADDRESSES.ROYALTY_POLICY_LAP,
      });
    }

    // Register IP Asset with PIL terms
    const response = await client.ipAsset.registerIpAsset({
      nft: {
        type: "mint",
        spgNftContract: STORY_ADDRESSES.SPG_NFT_CONTRACT,
      },
      licenseTermsData: request.licensingEnabled ? [
        {
          terms: pilTerms,
          licensingConfig: {
            isSet: true,
            mintingFee: parseEther("0"),
            licensesPercentage: 100,
            distributor: "0x0000000000000000000000000000000000000000",
          },
        },
      ] : [],
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${request.ipfsHash}`,
        ipMetadataHash: toHex("ip-metadata-hash", { size: 32 }),
        nftMetadataURI: `https://ipfs.io/ipfs/${request.ipfsHash}`,
        nftMetadataHash: toHex("nft-metadata-hash", { size: 32 }),
      },
    });

    return response;
  } catch (error) {
    console.error("IP Asset registration failed:", error);
    throw error;
  }
}

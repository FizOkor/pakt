import { StoryClient } from "@story-protocol/core-sdk";
import { http } from "viem";

// Story Protocol testnet configuration
const STORY_RPC_URL = "https://testnet.storyrpc.io";
const STORY_CHAIN_ID = 1516;

export function createStoryClient(walletClient: any) {
  return StoryClient.newClient({
    account: walletClient.account,
    transport: http(STORY_RPC_URL),
    chainId: STORY_CHAIN_ID,
  });
}

// Export known contract addresses
export const STORY_ADDRESSES = {
  WIP_TOKEN: "0x1514000000000000000000000000000000000000",
  ROYALTY_POLICY_LAP: "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E",
  SPG_NFT_CONTRACT: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc",
};

export const PIL_FLAVORS = {
  COMMERCIAL_REMIX: "commercialRemix",
  CREATIVE_COMMONS: "creativeCommonsAttribution",
  COMMERCIAL_USE: "commercialUse",
  NON_COMMERCIAL: "nonCommercialSocialRemixing",
};

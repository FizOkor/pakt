import { http } from "viem";
import { Account, privateKeyToAccount, Address } from "viem/accounts";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";

const rawPrivateKey = process.env.WALLET_PRIVATE_KEY?.trim();

// Throw an error if the variable is missing
if (!rawPrivateKey) {
    throw new Error("Missing WALLET_PRIVATE_KEY environment variable.");
}

const prefixedPrivateKey = rawPrivateKey.startsWith("0x") ? rawPrivateKey : `0x${rawPrivateKey}`;


const privateKey: Address = prefixedPrivateKey as Address;
const account: Account = privateKeyToAccount(privateKey);

export const config: StoryConfig = {
  account: account,
  transport: http(process.env.NEXT_PUBLIC_RPC_PROVIDER_URL),
  chainId: "aeneid",
};
export const client = StoryClient.newClient(config);
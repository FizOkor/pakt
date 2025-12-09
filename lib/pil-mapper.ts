import {
  IpMetadata,
  PILFlavor,
  WIP_TOKEN_ADDRESS,
} from "@story-protocol/core-sdk";
import { client } from "../utils/utils";
import { createHash } from "crypto";
import { Address, parseEther } from "viem";


interface LicenseConfig {
  licensingEnabled: boolean
  licenseType: 'commercialRemix' | 'commercialUse' | 'nonCommercialSocialRemixing' | 'creativeCommonsAttribution'
  royaltyPercentage: number
  mintingFee: number
  commercialUse: boolean
  derivatives: boolean
  attributionRequired: boolean
}

export function configToPILTerms(config: LicenseConfig) {
  if (!config.licensingEnabled) return [];

  const baseOverride = {
    commercialAttribution: config.attributionRequired,
    derivativesAttribution: config.attributionRequired,
    derivativesAllowed: config.derivatives,
  };

  switch(config.licenseType) {
    case 'commercialRemix':
      return [{
        terms: PILFlavor.commercialRemix({
          defaultMintingFee: parseEther(config.mintingFee.toString()),
          currency: WIP_TOKEN_ADDRESS,
          commercialRevShare: config.royaltyPercentage,
          override: baseOverride,
        }),
      }];

    case 'commercialUse':
      return [{
        terms: PILFlavor.commercialUse({
          defaultMintingFee: parseEther(config.mintingFee.toString()),
          currency: WIP_TOKEN_ADDRESS,
          override: baseOverride,
        }),
      }];

    case 'nonCommercialSocialRemixing':
      return [{
        terms: PILFlavor.nonCommercialSocialRemixing({
          override: {
            derivativesAllowed: config.derivatives,
            // Non-commercial might have different attribution field
          },
        }),
      }];

    case 'creativeCommonsAttribution':
      return [{
        terms: PILFlavor.creativeCommonsAttribution({
          currency: WIP_TOKEN_ADDRESS,
          override: {
            derivativesAllowed: config.derivatives,
          },
        }),
      }];
  }
}
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
  
  if (!config.licensingEnabled) {
    console.log('Licensing disabled, returning empty array');
    return [];
  }

  // override object for attribution and derivatives
  const override = config.attributionRequired 
    ? { attribution: true, derivativesAllowed: config.derivatives }
    : { derivativesAllowed: config.derivatives };

  switch(config.licenseType) {
    case 'commercialRemix':
      return [{
        terms: PILFlavor.commercialRemix({
          commercialRevShare: config.royaltyPercentage,
          defaultMintingFee: parseEther(config.mintingFee.toString()),
          currency: WIP_TOKEN_ADDRESS,
          override,
        }),
      }];

    case 'commercialUse':
      return [{
        terms: PILFlavor.commercialUse({
          defaultMintingFee: parseEther(config.mintingFee.toString()),
          currency: WIP_TOKEN_ADDRESS,
          override,
        }),
      }];

    case 'nonCommercialSocialRemixing':
      return [{
        terms: PILFlavor.nonCommercialSocialRemixing({ override }),
      }];

    case 'creativeCommonsAttribution':
      return [{
        terms: PILFlavor.creativeCommonsAttribution({
          currency: WIP_TOKEN_ADDRESS,
          override,
        }),
      }];

    default:
      // Type safety fallback
      throw new Error(`Unsupported license type: ${config.licenseType}`);
  }
}
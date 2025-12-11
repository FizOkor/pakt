
interface ExplorerConfig {
  baseUrl: string;
  ipAssetPath: string;
}

// Define the known explorer base URLs
const EXPLORER_CONFIGS = {
  mainnet: {
    baseUrl: 'https://storyscan.io',
    ipAssetPath: 'https://explorer.story.foundation/ipa'
  },
  testnet: {
    baseUrl: 'https://aeneid.storyscan.io',
    ipAssetPath: 'https://aeneid.explorer.story.foundation/ipa'
  }
} as const;

export function getExplorerConfig(): ExplorerConfig {
  const isMainnet = process.env.NEXT_PUBLIC_STORY_MAINNET === 'true';
  return isMainnet ? EXPLORER_CONFIGS.mainnet : EXPLORER_CONFIGS.testnet;
}

/**
 * Get transaction URL
 */
export function getTransactionUrl(txHash: string): string {
  const { baseUrl } = getExplorerConfig();
  // Validate transaction hash format
//   if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
//     throw new Error(`Invalid transaction hash format: ${txHash}`);
//   }
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Get IP Asset URL
 */
export function getIPAssetUrl(ipId: string): string {
  const { ipAssetPath } = getExplorerConfig();
  // Basic validation for IP ID format
//   if (!ipId.startsWith('0x')) {
//     throw new Error(`Invalid IP ID format: ${ipId}`);
//   }
  return `${ipAssetPath}/${ipId}`;
}
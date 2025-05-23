interface TokenConfig {
    decimals: number;
    isStablecoin: boolean;
}

export const tokenConfigs: Record<string, TokenConfig> = {
    // Stablecoins (6 decimals)
    '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7': { decimals: 6, isStablecoin: true },
    '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068': { decimals: 6, isStablecoin: true },
    '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf': { decimals: 6, isStablecoin: true },
    '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c': { decimals: 6, isStablecoin: true },
    
    // Special tokens
    '0x288710173f12f677ac38b0c2b764a0fea8108cb5e32059c3dd8f650d65e2cb25::pepe::PEPE': { decimals: 2, isStablecoin: false },
};

// Default decimals for unknown tokens
export const DEFAULT_DECIMALS = 9;

export function getTokenDecimals(address: string): number {
    return tokenConfigs[address]?.decimals ?? DEFAULT_DECIMALS;
}

export function isStablecoin(address: string): boolean {
    return tokenConfigs[address]?.isStablecoin ?? false;
}

export default { tokenConfigs, getTokenDecimals, isStablecoin }; 
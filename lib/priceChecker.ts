interface TokenPrice {
    value: number;
    address: string;
}

interface CoinGeckoResponse {
    [key: string]: {
        usd: number;
    };
}

// Store only addresses of stablecoins
export const stablecoinAddresses = [
    '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7',
    '0x375f70cf2ae4c00bf37117d0c85a2c71545e6ee05c4a5c7d282cd66a4504b068',
    '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf',
    '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c',
];

export async function getTokenPrices(tokenAddresses: string[]): Promise<Map<string, TokenPrice>> {
    console.log('getting prices for ' + tokenAddresses);
    
    const priceMap = new Map<string, TokenPrice>();

    // First, handle stablecoins
    const stablecoins = tokenAddresses.filter(addr => stablecoinAddresses.includes(addr));
    const otherTokens = tokenAddresses.filter(addr => !stablecoinAddresses.includes(addr));

    // Set price 1.0 for all stablecoins
    for (const stablecoin of stablecoins) {
        priceMap.set(stablecoin, {
            value: 1.0,
            address: stablecoin
        });
    }

    // If we only had stablecoins, return early
    if (otherTokens.length === 0) {
        return priceMap;
    }

    // Handle other tokens with CoinGecko
    if (!process.env.COINGECKO_API_KEY) {
        throw new Error('COINGECKO_API_KEY environment variable is not set');
    }

    try {
        // Join addresses with comma and encode
        const addressList = otherTokens.join(',');
        const encodedAddresses = encodeURIComponent(addressList);

        console.log('fetching from CoinGecko for non-stablecoin tokens...');
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/token_price/sui?contract_addresses=${encodedAddresses}&vs_currencies=usd`,
            {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as CoinGeckoResponse;
        
        // Add CoinGecko prices to the map
        for (const [address, priceData] of Object.entries(data)) {
            priceMap.set(address, {
                value: priceData.usd,
                address: address
            });
        }

        return priceMap;
    } catch (error) {
        console.error('Error fetching token prices:', error);
        throw error;
    }
}

export default { getTokenPrices, stablecoinAddresses };

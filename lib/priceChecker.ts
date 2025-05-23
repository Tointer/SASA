import { isStablecoin } from './tokenConfig';

interface TokenPrice {
    value: number;
    address: string;
}

interface CoinGeckoResponse {
    [key: string]: {
        usd: number;
    };
}

export async function getTokenPrices(tokenAddresses: string[]): Promise<Map<string, TokenPrice>> {
    // Deduplicate token addresses
    const uniqueAddresses = [...new Set(tokenAddresses)];
    console.log('getting prices for ' + uniqueAddresses);
    
    const priceMap = new Map<string, TokenPrice>();

    // First, handle stablecoins
    const stablecoins = uniqueAddresses.filter(addr => isStablecoin(addr));
    const otherTokens = uniqueAddresses.filter(addr => !isStablecoin(addr));

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
            console.log('price for ' + address + ' is ' + priceData.usd);
        }

        return priceMap;
    } catch (error) {
        console.error('Error fetching token prices:', error);
        throw error;
    }
}

export default { getTokenPrices };

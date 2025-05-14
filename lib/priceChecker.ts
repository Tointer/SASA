interface TokenPrice {
    value: number;
    updateUnixTime: number;
    address: string;
}

interface BirdeyeResponse {
    success: boolean;
    data: {
        [key: string]: TokenPrice;
    };
}

export async function getTokenPrices(tokenAddresses: string[]): Promise<Map<string, TokenPrice>> {
    console.log('getting prices for ' + tokenAddresses);
    if (!process.env.BIRDEYE_API_KEY) {
        throw new Error('BIRDEYE_API_KEY environment variable is not set');
    }

    // Join addresses with comma and encode
    const addressList = tokenAddresses.join(',');
    const encodedAddresses = encodeURIComponent(addressList);

    try {
        console.log('fetching...');
        console.log("api key: " + process.env.BIRDEYE_API_KEY);
        const response = await fetch(
            `https://public-api.birdeye.so/defi/multi_price?list_address=${encodedAddresses}`,
            {
                method: 'GET',
                headers: {
                    'X-API-KEY': process.env.BIRDEYE_API_KEY,
                    'accept': 'application/json',
                    'x-chain': 'sui'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as BirdeyeResponse;
        
        if (!data.success) {
            throw new Error('API request was not successful');
        }

        // Convert the response data to a Map
        const priceMap = new Map<string, TokenPrice>();
        for (const [address, priceData] of Object.entries(data.data)) {
            priceMap.set(address, priceData);
        }

        return priceMap;
    } catch (error) {
        console.error('Error fetching token prices:', error);
        throw error;
    }
}

export default { getTokenPrices };

import mainnet from './mainnetContext.json' assert { type: "json" };

function checkBlacklist(tx : string): {scams: string[], compromised: string[]}{
    if (!tx) {
        return { scams: [], compromised: [] };
    }
    
    //regex that matches all addresses in transaction, starting with 0x and spanning 66 characters
    const addressRegex = /0x[a-fA-F0-9]{64}/g;  // Fixed regex to use correct hex characters
    
    // Use exec in a loop instead of matchAll for better compatibility
    const matched: string[] = [];
    let match;
    while ((match = addressRegex.exec(tx)) !== null) {
        matched.push(match[0]);
    }
    
    console.log("Matched addresses:", matched);

    if (matched.length === 0) {
        return { scams: [], compromised: [] };
    }

    const scams = matched.filter(x => mainnet.scam.includes(x));
    const compromised = matched.filter(x => mainnet.compromised.includes(x));

    console.log("Found scams:", scams);
    console.log("Found compromised:", compromised);

    return {
        scams: scams || [],
        compromised: compromised || []
    };
}

export default {checkBlacklist};
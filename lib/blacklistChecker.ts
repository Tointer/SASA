import mainnet from './mainnetContext.json' assert { type: "json" };

function checkBlacklist(tx : string): {scams: string[], compromised: string[]}{
    
    //regex that matches all addresses in transaction, starting with 0x and spanning 66 characters
    const addressRegex = /0x[a-zA-Z0-9]{64}/g;
    const matched = Array.from(tx.matchAll(addressRegex)).map(x => x[0]);
    console.log("Addresses: " + matched)

    const scams =  matched.filter(x => mainnet.scam.includes(x));
    const compromised = matched.filter(x => mainnet.compromised.includes(x));

    return {scams, compromised};
}

export default {checkBlacklist};
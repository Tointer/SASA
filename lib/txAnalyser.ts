

export async function txAnalyse(tx : string): Promise<{title: string, answer: string}>{
    return {title: "Mock Response", answer: `TX: ${tx}`};
}

export default {txAnalyse};
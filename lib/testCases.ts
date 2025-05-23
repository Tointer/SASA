import { ResponseCategory } from './types';

export interface TestCase {
    title: string;
    description: string;
    digest: string;
    response: {
        title: string;
        answer: string;
        shortSummary: string;
        cat: ResponseCategory;
    };
}

export const TEST_CASES: TestCase[] = [
    {
        title: "DEX Swap",
        description: "Swap tokens on a DEX",
        digest: "68oVn72ngKeUoUYTn9Hv2btjhvEduPKvmrRYZMXM9WJF",
        response: {
            title: "DEX Swap Analysis",
            answer: `0.007975 SUI; tokens transferred: Sent 1.007975 SUI, received 3.821233 USDC

Summary: You will swap 1.007975 SUI for 3.821233 USDC using multiple DeFi pools and DEX aggregators, with a small portion of SUI used for gas and LP fees. Transaction involves three different swap contracts (haedalpmm, flowx_clmm, obric) and oracle price verification (pyth). No suspicious or risky patterns detected; transaction uses known protocols and swaps SUI to USDC via DEEP as an intermediary.`,
            shortSummary: "Swapped 1.007975 SUI for 3.82 USDC across multiple DEX pools; standard DeFi swap, no red flags.",
            cat: ResponseCategory.regular
        }
    },
    {
        title: "Scam Alert",
        description: "Interacting with known scam",
        digest: "3KtHmU9wHn9v1q7k8p2m4n6b8v2c4x6z8m0n2b4v6c8x0z2m4n6b8v2c4x6z8",
        response: {
            title: "Scam Alert!",
            answer: "WARNING: This transaction is interacting with a known scam address 0x731c2cd8f060428e7bb520899c855b48bf4b22d981f07a69ce3d0a258f3e589a !\n\nAI Analysis:\nThe contract address in this transaction has been flagged as a known scam. It attempts to drain funds from users' wallets. DO NOT proceed with this transaction under any circumstances.",
            shortSummary: "Scam alert! Interacting with known scam address.",
            cat: ResponseCategory.alarm
        }
    },
    {
        title: "Lending Transaction",
        description: "Borrow or supply assets",
        digest: "8Jckzbo8h893Z4JZDPsAu7ZAYPZWPFKaNqNa89T7yTp1",
        response: {
            title: "Lending Transaction Analysis",
            answer: `fee: 0.004934 SUI
Transferred: -0.001359 SCALLOP_USDC, +1.432963 USDC

You will redeem 0.001359 SCALLOP_USDC (a lending/earn token), burn it, and receive 1.432963 USDC in return. The fee for this transaction is 0.004934 SUI. No abnormal contract interactions or suspicious behavior detected. This is a standard withdraw/redeem from a lending protocol, converting your position back to USDC.
`,
            shortSummary: "You will redeem 0.001359 SCALLOP_USDC and receive 1.432963 USDC. 0.004934 SUI fee. Standard lending protocol withdrawal.",
            cat: ResponseCategory.regular
        }
    },
    {
        title: "New Contract",
        description: "Interacting with new contract",
        digest: "5MtHmU9wHn9v1q7k8p2m4n6b8v2c4x6z8m0n2b4v6c8x0z2m4n6b8v2c4x6z8",
        response: {
            title: "New Contract Warning",
            answer: "You will transfer 1.910617 USDC to the contract getting 1.910617 wUSDC tokens in return, paying 0.002086 SUI fee. This contract have been deployed in less than 7 days ago, so it might be better to double check it or wait for more community verification.",
            shortSummary: "You are wrapping 1.910617 USDC to wUSDC, but the contract is pretty new, be careful!",
            cat: ResponseCategory.warning
        }
    }
]; 
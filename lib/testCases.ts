import { ResponseCategory } from './types';

export interface TestCase {
    title: string;
    description: string;
    digest: string;
    response: {
        title: string;
        answer: string;
        cat: ResponseCategory;
    };
}

export const TEST_CASES: TestCase[] = [
    {
        title: "DEX Swap",
        description: "Swap tokens on a DEX",
        digest: "2GAzgwe1yvYxw2CQTEPaCdDHuv8MoXEZPYMCKqk6cxZJ",
        response: {
            title: "DEX Swap Analysis",
            answer: "This transaction involves swapping tokens on a DEX:\n\nUser is transferring 0.002925 SUI (worth $0.01)\nUser is receiving 5.412604 USDT (worth $5.41)\n\nAI Analysis:\nThis is a standard DEX swap transaction. The user is swapping a small amount of SUI for USDT. The transaction appears safe and follows normal DEX interaction patterns. The slippage and fees are within normal ranges.",
            cat: ResponseCategory.regular
        }
    },
    {
        title: "Scam Alert",
        description: "Interacting with known scam",
        digest: "3KtHmU9wHn9v1q7k8p2m4n6b8v2c4x6z8m0n2b4v6c8x0z2m4n6b8v2c4x6z8",
        response: {
            title: "Scam Alert!",
            answer: "WARNING: This transaction is interacting with a known scam address!\n\nAI Analysis:\nThe contract address in this transaction has been flagged as a known scam. It attempts to drain funds from users' wallets. DO NOT proceed with this transaction under any circumstances.",
            cat: ResponseCategory.alarm
        }
    },
    {
        title: "Lending Transaction",
        description: "Borrow or supply assets",
        digest: "4LtHmU9wHn9v1q7k8p2m4n6b8v2c4x6z8m0n2b4v6c8x0z2m4n6b8v2c4x6z8",
        response: {
            title: "Lending Transaction Analysis",
            answer: "This transaction involves lending protocol interaction:\n\nUser is transferring 100.000000 USDC (worth $100.00)\n\nAI Analysis:\nThis is a standard lending protocol deposit. The user is supplying USDC to earn interest. The contract is well-established and the transaction parameters are normal. The interest rate and fees are within expected ranges.",
            cat: ResponseCategory.regular
        }
    },
    {
        title: "New Contract",
        description: "Interacting with new contract",
        digest: "5MtHmU9wHn9v1q7k8p2m4n6b8v2c4x6z8m0n2b4v6c8x0z2m4n6b8v2c4x6z8",
        response: {
            title: "New Contract Warning",
            answer: "This transaction interacts with a newly deployed contract:\n\nUser is transferring 50.000000 USDT (worth $50.00)\n\nAI Analysis:\nWARNING: This contract was deployed less than 7 days ago. While the transaction parameters appear normal, interacting with new contracts carries additional risk. Consider waiting for more community verification or reducing the transaction amount.",
            cat: ResponseCategory.warning
        }
    }
]; 
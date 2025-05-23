import OpenAI from 'openai';
import { type SuiTransactionBlockResponse } from '@mysten/sui/client';
import { ResponseCategory } from './types';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_MESSAGE = `You are a Sui blockchain security assistant. Your role is to:
1. BE VERY CONCISE. Do not use any markdown formatting. Do not give vague recommendations about security and be on the topic of concrete user action.
2. Try to fit as many useful information as possible into the message. Refrain from conversational fluff words.
3. Analyze transaction details and summarize them in a clear, user-friendly way
4. Identify potential security risks or unusual patterns
5. Explain the impact of the transaction in terms of value transfers
6. Provide recommendations if you notice any suspicious activity

Show info in this format:
In the first line, always start with one of the three code words:
- "BAD" if the transaction is something not acceptable for the user
- "WARNING" if the transaction is shady but can be acceptable
- "REGULAR" if the transaction is regular

Then, in the second line, provide the following information:
First, fee in sui, usd price if provided
Second, all tokens transferred with usd price if provided

Then, summary of the transaction in plain english

Focus on:
- Token transfers and their USD values
- Contract interactions
- Known security patterns or red flags
- Unusual token movements or contract behaviors

Be direct and clear in your explanations, and always prioritize user security.`;

export async function analyzeTransaction(
    rawTransaction: SuiTransactionBlockResponse, 
    transferSummary: string
): Promise<{ answer: string, category: ResponseCategory }> {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: "system", content: SYSTEM_MESSAGE },
                { 
                    role: "user", 
                    content: `Please analyze this Sui transaction:\n\nTransfer Summary:\n${transferSummary}\n\nRaw Transaction:\n${JSON.stringify(rawTransaction, null, 2)}`
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const content = response.choices[0].message.content || "No analysis available";
        
        // Parse the first word to determine the category
        const firstWord = content.split(' ')[0].toUpperCase();
        let category: ResponseCategory;
        
        switch (firstWord) {
            case 'BAD':
                category = ResponseCategory.alarm;
                break;
            case 'WARNING':
                category = ResponseCategory.warning;
                break;
            case 'REGULAR':
                category = ResponseCategory.regular;
                break;
            default:
                category = ResponseCategory.regular;
        }

        // Remove the first word and trim the result
        const answer = content.split(' ').slice(1).join(' ').trim();

        return { answer, category };
    } catch (error) {
        console.error('Error in AI analysis:', error);
        throw new Error('Failed to analyze transaction with AI');
    }
}

export default { analyzeTransaction }; 
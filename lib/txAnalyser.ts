/* eslint-disable @typescript-eslint/no-unused-vars */
import {getOnchainInfo, TransferDirection} from './onchainAnalyser';
import blacklistChecker from './blacklistChecker';
import { getTokenPrices } from './priceChecker';
import { ResponseCategory } from './types';
import { analyzeTransaction } from './aiAnalyser';
import { getTokenDecimals } from './tokenConfig';


export async function txAnalyse(tx : string): Promise<{title: string, answer: string, cat: ResponseCategory}>{
  let cat = ResponseCategory.regular;
  let answer = "TX";
  let title = "Transaction Analysis"
  
  const onchainAnalysis = await getOnchainInfo(tx);
  const {scams, compromised} = blacklistChecker.checkBlacklist(onchainAnalysis.rawTransaction);

  // Prepare transfer summary regardless of other conditions
  const tokenPrices = await getTokenPrices(onchainAnalysis.balanceChanges.map(x => x.tokenAddressRaw));
  const transferMessages = onchainAnalysis.balanceChanges.map(transfer => {
    const decimals = getTokenDecimals(transfer.tokenAddress);
    const absAmount = transfer.amount < 0n ? -transfer.amount : transfer.amount;
    const formattedAmount = (Number(absAmount) / Math.pow(10, decimals)).toFixed(6);

    const priceExists = tokenPrices.has(transfer.tokenAddress);
    const price = tokenPrices.get(transfer.tokenAddress)?.value || 0;
    const usdAmount = (Number(absAmount) / Math.pow(10, decimals)) * price;

    let response = `User is ${transfer.direction === TransferDirection.FromUser ? "transferring" : "receiving"} ${formattedAmount} ${transfer.tokenSymbol}`;

    if(priceExists){
      response += ` (worth $${usdAmount.toFixed(2)})`;
    }

    return response;
  });

  const transferSummary = transferMessages.length > 0 
    ? transferMessages.join("\n")
    : "No token transfers in this transaction.";

  if(scams.length > 0){
    cat = ResponseCategory.alarm;
    title = "Scam alert!"
    answer = `Your transaction is interacting with scam address ${scams[0]}, do NOT proceed!`;
  }
  else if(compromised.length > 0){
    cat = ResponseCategory.alarm
    title = "Compromised contract!"
    answer = `You are interacting with compromised contract ${compromised[0]}, do NOT proceed!`
  }
  else {
    // Always get AI analysis
    try {
      const aiAnalysis = await analyzeTransaction(onchainAnalysis.rawTransaction, transferSummary);
      answer = aiAnalysis.answer;
      cat = aiAnalysis.category;
    } catch (error) {
      console.error('Failed to get AI analysis:', error);
      answer = transferSummary; // Fallback to just the transfer summary if AI fails
    }
  }

  return {title, answer, cat};
}

export default {txAnalyse};
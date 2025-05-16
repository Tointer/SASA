/* eslint-disable @typescript-eslint/no-unused-vars */
import {getOnchainInfo, TransferDirection} from './onchainAnalyser';
import blacklistChecker from './blacklistChecker';
import { getTokenPrices } from './priceChecker';
import { ResponseCategory } from './types';


export async function txAnalyse(tx : string): Promise<{title: string, answer: string, cat: ResponseCategory}>{
  let cat = ResponseCategory.regular;
  let answer = "TX";
  let title = "Mock Response"
  
  const onchainAnalysis = await getOnchainInfo(tx);
  const {scams, compromised} = blacklistChecker.checkBlacklist(onchainAnalysis.rawTransaction);

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
    // Function to extract token symbol from coinType
    function getTokenSymbol(coinType: string): string {
      const parts = coinType.split('::');
      return parts.length === 3 ? parts[2] : coinType;
    }

    // Get token prices for all tokens in the transaction
    const tokenPrices = await getTokenPrices(onchainAnalysis.balanceChanges.map(x => x.tokenAddress));

    // Create transfer messages
    const transferMessages = onchainAnalysis.balanceChanges.map(transfer => {
      const decimals = 9;
      const absAmount = transfer.amount < 0n ? -transfer.amount : transfer.amount;
      const formattedAmount = (Number(absAmount) / Math.pow(10, decimals)).toFixed(6);
      const price = tokenPrices.get(transfer.tokenAddress)?.value || 0;
      const usdAmount = (Number(absAmount) / Math.pow(10, decimals)) * price;
      
      return `User is ${transfer.direction === TransferDirection.FromUser ? "transferring" : "receiving"} ${formattedAmount} ${transfer.tokenSymbol} (worth $${usdAmount.toFixed(2)})`;
    });

    if (transferMessages.length > 0) {
      title = "Transaction Summary";
      answer = transferMessages.join("\n");
    } else {
      title = "No Token Transfers";
      answer = "This transaction doesn't involve any token transfers.";
    }
  }

  return {title, answer, cat};
}

export default {txAnalyse};
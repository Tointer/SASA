"use client"
import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import DialogBox from '../DialogBox';
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ResponseCategory } from "../../../lib/types";
 

const TEST_CASES = [
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

export default function TXAsk() {
  const [resultPresented, setResultPresented] = useState(false)
  const [waitingResult, setWaitingResult] = useState(false)
  const [inputContent, setInputContent] = useState("")
  const [helperMessage, setHelperMessage] = useState("")
  const [helperTitle, setHelperTitle] = useState("")
  const [responseCategory, setResponseCategory] = useState<ResponseCategory>(ResponseCategory.none)

  async function onAsk(){
    setWaitingResult(true);
    
    // Check if this is a test transaction
    const testCase = TEST_CASES.find(tc => tc.digest === inputContent);
    
    if (testCase) {
        // Add delay so that instant response will not feel weird
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Use cached response to not waste tokens, and to give an example of the response even when RPCs is down
        setHelperMessage(testCase.response.answer);
        setHelperTitle(testCase.response.title);
        setResponseCategory(testCase.response.cat);
        setResultPresented(true);
        setWaitingResult(false);
        return;
    }

    // If not a test case, proceed with API call
    fetch('/api/tx-ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tx: inputContent})
    }).then(data => {
        console.log(JSON.stringify(data));
        data.json().then(response => {
            console.log(response);
            setHelperMessage(response.answer);
            setResultPresented(true);
            setWaitingResult(false);
            setHelperTitle(response.title);
            setResponseCategory(response.cat);
        });
    })
  }

  function onCodeChange(value: string) {
      setResultPresented(false);
      setInputContent(value);
  }

  function onTestCaseClick(digest: string) {
      setInputContent(digest);
      setResultPresented(false);
  }

  return (
      <div className='mt-10 flex flex-col text-center'>
        <h1 className="text-3xl font-bold">Paste transaction here:</h1>
        <div className='flex flex-col items-center gap-4 mb-10'>
            <CodeMirror
                className="text-left mt-4 max-w-2xl w-full'"
                minWidth='600px'
                minHeight='100px'
                value={inputContent}
                theme='dark'
                lang="javascript"
                extensions={[javascript({ jsx: true })]}
                onChange={onCodeChange}
            />
            {resultPresented ? 
                <DialogBox title={helperTitle} message={helperMessage} cat={responseCategory}/> 
                : 
                waitingResult?
                    <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Thinking
                    </Button>
                    :
                    <Button className="bg-teal-800 text-white" onClick={onAsk}>Ask</Button>
            }
        </div>

        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Or choose one of the test cases:</h2>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {TEST_CASES.map((testCase, index) => (
                    <Button
                        key={index}
                        className="h-auto py-4 px-6 bg-zinc-800 hover:bg-zinc-700 text-white flex flex-col items-center justify-center"
                        onClick={() => onTestCaseClick(testCase.digest)}
                    >
                        <span className="text-lg font-semibold">{testCase.title}</span>
                        <span className="text-sm text-gray-400">{testCase.description}</span>
                    </Button>
                ))}
            </div>
        </div>
      </div>
  )
}

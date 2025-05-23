"use client"
import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import DialogBox from '../DialogBox';
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ResponseCategory } from "../../../lib/types";
import { TEST_CASES } from '../../../lib/testCases';

export default function TXAsk() {
  const [resultPresented, setResultPresented] = useState(false)
  const [waitingResult, setWaitingResult] = useState(false)
  const [inputContent, setInputContent] = useState("")
  const [helperMessage, setHelperMessage] = useState("")
  const [shortSummary, setShortSummary] = useState("")
  const [helperTitle, setHelperTitle] = useState("")
  const [responseCategory, setResponseCategory] = useState<ResponseCategory>(ResponseCategory.none)

  async function onAsk(){
    setWaitingResult(true);
    
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
            setResponseCategory(response.category);
            setShortSummary(response.shortSummary);
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
                <div>
                    <DialogBox title={helperTitle} message={shortSummary} cat={responseCategory} showMascot={true}/> 
                    <DialogBox title="Detailed view" message={helperMessage} cat={responseCategory} showMascot={false}/> 
                </div>
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
                        className={`h-auto py-4 px-6 text-white flex flex-col items-center justify-center ${
                            inputContent === testCase.digest 
                                ? 'bg-zinc-700 hover:bg-zinc-600 border-1 border-zinc-600' 
                                : 'bg-zinc-800 hover:bg-zinc-700'
                        }`}
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

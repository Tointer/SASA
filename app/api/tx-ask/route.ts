import { NextResponse } from "next/server";
import { txAnalyse } from "@/lib/txAnalyser";

export async function POST(req: Request){
    const { tx } = await req.json();
    let result = { title: "Error", answer: "No transaction provided"};

    //debug wait 2 sec
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (tx !== ""){
        try{
            result = await txAnalyse(tx);
        } catch (err){
            result = { title: "Error", answer: JSON.stringify(err)};
        }
    }

    console.log(result);
    return NextResponse.json(result);
}
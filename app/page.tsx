import DialogBox from './interface/DialogBox'
import { ResponseCategory } from "../lib/types";
import Blob from "./animatedBlob"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-white sm:text-6xl">
            AI-powered security assistant for Sui blockchain
          </h1>
          <div className="mt-8 space-y-4">
            <p className="text-xl text-gray-300 leading-relaxed">
              SASA is making security for both humans and AI agents more reachable
            </p>
            <p className="text-xl text-gray-300 leading-relaxed">
              It will analyse onchain data, scan transaction for any suspicious activity and explain everything in human readable way
            </p>
          </div>
        </div>
      </div>

      {/* Blob Section */}
      <div className=" flex justify-center">
        <div className="w-full max-w-2xl">
          <Blob />
        </div>
      </div>

      {/* Features Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-24">
          <div className="gap-8 items-center py-8 md:grid md:grid-cols-2">
            <div className="space-y-8">
              <DialogBox title="NFT transfer" message="You are sending an NFT with ID 55 from your address to the recipient at address 0x1c87fb...a3cb0a" cat={ResponseCategory.regular}/>
              <DialogBox title="DEX Swap" message="You are swapping 100 USDC for 99.99 USDT, SUI fee is small and slippage is minimal" cat={ResponseCategory.regular}/>
            </div>
            <div className="mt-8 md:mt-0">
              <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">It will explain transaction in plain english</h2>
              <p className="mb-6 font-light md:text-lg text-gray-400">Do you have this anxiety when sending something important to another address, no matter how frequent you do it? SASA created to remove this anxiety by explaining what transactions do in simple terms. And it can do so with any transaction, thanks to GPT-4.1</p>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <div className="gap-8 items-center py-8 md:grid md:grid-cols-2">
            <div className="mt-8 md:mt-0 order-2 md:order-1">
              <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">It will warn if something is off</h2>
              <p className="mb-6 font-light md:text-lg text-gray-400">SASA have additional mechanisms to see if transaction is suspicious. There are several systems that will scan transaction</p>
            </div>
            <div className="space-y-8 order-1 md:order-2">
              <DialogBox title="Are you sure?" message="Your transaction are interacting with contract that have name of some popular contract, but with different address.
        This can be a sign of scam, or some new version of contract, please double check before proceeding" cat={ResponseCategory.warning}/>
              <DialogBox title="Contract is new" message="You are interacting with contract that was created recently, please double check if you know this contract" cat={ResponseCategory.warning}/>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <div className="gap-8 items-center py-8 md:grid md:grid-cols-2">
            <div className="space-y-8">
              <DialogBox title="Scam alert!" message="Your transaction is interacting with scam address, do NOT proceed!" cat={ResponseCategory.alarm}/>
              <DialogBox title="Compromised contract!" message="You are interacting with compromised contract, do NOT proceed!" cat={ResponseCategory.alarm}/>
            </div>
            <div className="mt-8 md:mt-0">
              <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">It will protect</h2>
              <p className="mb-6 font-light md:text-lg text-gray-400">We do not need multiple users to interact with dangerous website. If just one will report it, we can mark it and prevent users from losing funds</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold text-white mb-8">
            Want to test how it works?
          </h2>
          <a 
            href="/interface/tx-ask" 
            className="inline-block px-8 py-4 text-lg font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-500 transition-colors duration-200"
          >
            Try Web Interface
          </a>
        </div>
      </div>
    </div>
  )
}
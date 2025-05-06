
export default function Home() {
  return (
    <>
      <div className='mt-10 flex flex-col text-center'>
        <h1 className='text-4xl font-bold'>AI-powered security assistant for Sui blockchain</h1>
        <div className="m-8">
          <p className='mt-4 text-xl'>SASA is making security for both humans and AI agents more reachable</p>
          <p className='mt-2 text-xl'>It will analyse onchain data, scan transaction for any suspicious activity and explain everything in human readable way</p>
        </div>
        
        <h1 className='text-4xl font-bold m-8'>
          Want to test how it work? Here is <a href="/interface/tx-ask" className='text-blue-600  hover:underline'>web interface demonstration</a>
        </h1>
      </div>
    </>
  )
}
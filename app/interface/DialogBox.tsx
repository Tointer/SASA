

function DialogBox(props: {
    title: string
    message: string, 
}) 
{
  return ( 
    <div className="flex max-w-screen-sm bg-zinc-900 border rounded-lg shadow  border-gray-700">
      <div className={`block p-3 text-left bg-teal-800} border rounded-lg shadow  border-teal-950`}>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-200">{props.title}</h5>
        <p className="font-normal text-gray-200">{props.message}</p>
      </div>
    </div>
  )
}

export default DialogBox
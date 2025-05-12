import { ResponseCategory } from "../../lib/types";

function DialogBox(props: {
  title: string
  message: string, 
  cat: ResponseCategory
}) 
{
return ( 
  <div className="flex max-w-screen-sm bg-zinc-900 border rounded-lg shadow  border-gray-700">
    <div className={`block p-3 text-left bg-${getBgCol(props.cat)} border rounded-lg shadow  border-${getBorderCol(props.cat)}`}>
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-200">{props.title}</h5>
      <p className="font-normal text-gray-200">{props.message}</p>
    </div>
  </div>
)
}

function getBgCol(status: ResponseCategory){
  switch(status){
      case ResponseCategory.alarm:
          return "red-800"
      case ResponseCategory.warning:
          return "yellow-700"
      case ResponseCategory.regular:
          return "teal-800"
      case ResponseCategory.error:
          return "teal-800"
      case ResponseCategory.none:
          return "teal-800"
  }
}

function getBorderCol(status: ResponseCategory){
  switch(status){
      case ResponseCategory.alarm:
          return "red-950"
      case ResponseCategory.warning:
          return "yellow-950"
      case ResponseCategory.regular:
          return "teal-950"
      case ResponseCategory.error:
          return "teal-950"
      case ResponseCategory.none:
          return "teal-950"
  }
}

export default DialogBox
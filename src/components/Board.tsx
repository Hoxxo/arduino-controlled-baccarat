import Column, {Player} from "./Column.tsx";
import Box from "./Box.tsx";

type BoardProps = {
  Winners: Player[][]
}

export default function Board({ Winners }: BoardProps) {
  return (
    <>
      {Winners.map(v => {
        return <div>
          <Column WinnerColumns={v}/>
        </div>
      })}
    </>
  )
}
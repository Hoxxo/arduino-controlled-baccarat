import { useState } from 'react'
import Box from "./Box.tsx"
import Props from "./Box.tsx"

export enum Player {
  Dealer = 'X',
  Player = 'O'
}

export type ColProps = {
  WinnerColumns: Player[]
}

export default function Column({ WinnerColumns }: ColProps) {
  //let winnerCol: [Player] = [Player.Dealer, Player.Dealer];
  let [winner, setWinner] = useState(Player.Dealer);

  return (
    WinnerColumns.map(w => {
      return <div>
        <Box winner={w}/>
      </div>
    })
  )
}
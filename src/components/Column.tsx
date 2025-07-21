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
  return (
    <div className="column">
      {WinnerColumns.map((w, i) => (
        <Box key={i} winner={w}/>
      ))}
    </div>
  )
}
import {Player} from "./Column.tsx";
import {playerWin, dealerWin} from "./Winners.tsx";

export type BoxProps = {
  winner: Player
}

export default function Box(props: BoxProps) {
  return (
    <button className='box'>
      {props.winner === Player.Dealer ?
      dealerWin() :
      playerWin()}
    </button>
  )
}
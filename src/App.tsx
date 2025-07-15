import {useState} from 'react'
import Column, {Player} from './components/Column.tsx'
import Board from './components/Board.tsx'
import './App.css'

function App() {
  let [winners, setWinners] = useState<Player[]>([])
  let [mat, setMat] = useState<Player[][]>([[]])

  const handleKeypress = (e: React.KeyboardEvent) => {
    let nextWinCol: Player[] = winners.slice()
    let nextMat: Player[][] = []

    if (e.key === 'd') {
      nextWinCol.push(Player.Dealer)
      setWinners(nextWinCol)
    } else if (e.key === 'p') {
      nextWinCol.push(Player.Player)
      setWinners(nextWinCol)
    } else {
      alert("Non-valid character!")
    }

    let currGroup: Player[] = []
    for (const w of winners) {
      if (currGroup.length === 0 || w === currGroup[0]) {
        currGroup.push(w)
      } else {
        nextMat.push(currGroup)
        currGroup = [w]
      }
    }
    if (currGroup.length) {
      nextMat.push(currGroup)
    }

    setMat(nextMat)
  }

  return (
    <>
      <div>
        <input type='text' onKeyDown={handleKeypress}/>
      </div>
      <div>
        <Board Winners={mat}/>
      </div>
    </>
  )
}

export default App

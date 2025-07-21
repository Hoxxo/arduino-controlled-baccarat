import {useState} from 'react'
import Column, {Player} from './components/Column.tsx'
import Board from './components/Board.tsx'
import './App.css'

function App() {
  let [winners, setWinners] = useState<Player[]>([])
  let [mat, setMat] = useState<Player[][]>([])

  const handleKeypress = (e: React.KeyboardEvent) => {
    const nextWinCol = [...winners]

    if (e.key === 'd') {
      nextWinCol.push(Player.Dealer)
    } else if (e.key === 'p') {
      nextWinCol.push(Player.Player)
    } else {
      alert("Non-valid character!")
      return
    }

    const nextMat: Player[][] = []
    let currGroup: Player[] = []

    for (const w of nextWinCol) {
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

    setWinners(nextWinCol)
    setMat(nextMat)
    console.log(nextMat)
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

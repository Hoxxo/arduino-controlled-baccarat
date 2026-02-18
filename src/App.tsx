import { useState } from 'react';
import { Player } from './components/Constants.ts';
import Board from './components/Board.tsx';
import { InputMethods } from './components/Constants.ts';
import Controller from './components/Controller.tsx';
import './App.css';

function App() {
  const [_winners, setWinners] = useState<Player[]>([]);
  const [mat, setMat] = useState<Player[][]>([]);
  const [inputMethod, setInputMethod] = useState<InputMethods>(
    InputMethods.Text
  );

  const addWinner = (player: Player) => {
    setWinners((prev) => {
      const nextWinCol = [...prev, player];

      const nextMat: Player[][] = [];
      let currGroup: Player[] = [];
      for (const w of nextWinCol) {
        if (currGroup.length === 0 || w === currGroup[0]) {
          currGroup.push(w);
        } else {
          nextMat.push(currGroup);
          currGroup = [w];
        }
      }
      if (currGroup.length) nextMat.push(currGroup);

      setMat(nextMat);
      return nextWinCol;
    });
  };

  const handleClear = (_: React.MouseEvent<HTMLButtonElement>) => {
    setMat([]);
  };

  const handleSerialInput = (ch: string) => {
    const input = ch.toUpperCase();
    if (input === 'D') addWinner(Player.Dealer);
    if (input === 'P') addWinner(Player.Player);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Board Winners={mat} />
      </div>

      <div className="controls">
        <label htmlFor="method-select">Choose control method: </label>
        <select
          id="method-select"
          onChange={(e) =>
            setInputMethod(
              e.target.value === 'text'
                ? InputMethods.Text
                : InputMethods.Arduino
            )
          }
        >
          <option value="text">Text</option>
          <option value="ard">Arduino</option>
        </select>
        <div>
          <Controller
            selectedController={inputMethod}
            onAction={addWinner}
            onSerialInput={handleSerialInput}
          />
        </div>
      </div>
      <div>
        <button className="clear-button" onClick={handleClear}>
          Clear Board
        </button>
      </div>
    </>
  );
}

export default App;

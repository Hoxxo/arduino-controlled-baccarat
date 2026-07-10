import { useCallback, useMemo, useState } from 'react';
import { Player } from './components/Constants.ts';
import Board from './components/Board.tsx';
import { InputMethods } from './components/Constants.ts';
import Controller from './components/Controller.tsx';
import Stats from './components/Stats.tsx';
import { buildMat, computeStats } from './components/GameLogic.ts';
import './App.css';

function App() {
  const [events, setEvents] = useState<Player[]>([]);
  const [inputMethod, setInputMethod] = useState<InputMethods>(
    InputMethods.Text
  );

  const mat = useMemo(() => buildMat(events), [events]);
  const stats = useMemo(() => computeStats(events), [events]);

  const addWinner = useCallback((player: Player) => {
    setEvents((prev) => [...prev, player]);
  }, []);

  const undo = useCallback(() => {
    setEvents((prev) => (prev.length === 0 ? prev : prev.slice(0, -1)));
  }, []);

  const clear = useCallback(() => {
    setEvents([]);
  }, []);

  const handleInput = useCallback(
    (add?: Player, control?: string) => {
      if (add !== undefined) {
        addWinner(add);
        return;
      }

      if (control === 'u') {
        undo();
      } else if (control === 'c') {
        clear();
      }
    },
    [addWinner, undo, clear]
  );

  const handleSerialInput = useCallback(
    (ch: string) => {
      const input = ch.toUpperCase();
      if (input === 'D') addWinner(Player.Dealer);
      else if (input === 'P') addWinner(Player.Player);
      else if (input === 'T') addWinner(Player.Tie);
      else if (input === 'C') clear();
      else if (input === 'U') undo();
    },
    [addWinner, clear, undo]
  );

  return (
    <>
      <h1 className="scoreboard-title">Baccarat</h1>

      <div className="board-row">
        <Board Winners={mat} />
      </div>

      <div className="board-row">
        <Stats stats={stats} />
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
            onAction={handleInput}
            onSerialInput={handleSerialInput}
          />
        </div>
      </div>
      <div>
        <button className="clear-button" onClick={clear}>
          Clear Board
        </button>
      </div>
    </>
  );
}

export default App;

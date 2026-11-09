import { useCallback, useMemo, useReducer, useState } from 'react';
import {
  InputMethods,
  Player,
  type StatsWindow,
} from './components/Constants.ts';
import Board from './components/Board.tsx';
import Controller from './components/Controller.tsx';
import Stats from './components/Stats.tsx';
import { buildMat, computeStats } from './components/GameLogic.ts';
import './App.css';

type UndoEntry = { kind: 'add' } | { kind: 'clear'; clearedEvents: Player[] };

type GameState = {
  events: Player[];
  undoStack: UndoEntry[];
};

type GameAction =
  | { type: 'add'; player: Player }
  | { type: 'undo' }
  | { type: 'clear' };

const initialGameState: GameState = {
  events: [],
  undoStack: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'add') {
    return {
      events: [...state.events, action.player],
      undoStack: [...state.undoStack, { kind: 'add' }],
    };
  }

  if (action.type === 'clear') {
    if (state.events.length === 0) return state;

    return {
      events: [],
      undoStack: [
        ...state.undoStack,
        { kind: 'clear', clearedEvents: state.events },
      ],
    };
  }

  const lastEntry = state.undoStack[state.undoStack.length - 1];
  if (!lastEntry) return state;

  return {
    events:
      lastEntry.kind === 'clear'
        ? lastEntry.clearedEvents
        : state.events.slice(0, -1),
    undoStack: state.undoStack.slice(0, -1),
  };
}

function App() {
  const [{ events }, dispatch] = useReducer(gameReducer, initialGameState);
  const [inputMethod, setInputMethod] = useState<InputMethods>(
    InputMethods.Text
  );
  const [statsWindow, setStatsWindow] = useState<StatsWindow>(20);

  const mat = useMemo(() => buildMat(events), [events]);
  const stats = useMemo(
    () => computeStats(events, statsWindow),
    [events, statsWindow]
  );

  const addWinner = useCallback((player: Player) => {
    dispatch({ type: 'add', player });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'undo' });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'clear' });
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
        <Stats
          stats={stats}
          windowSize={statsWindow}
          onWindowSizeChange={setStatsWindow}
        />
      </div>

      <div className="controls">
        <label htmlFor="method-select">Choose control method: </label>
        <select
          id="method-select"
          value={inputMethod}
          onChange={(e) => setInputMethod(e.target.value as InputMethods)}
        >
          <option value={InputMethods.Text}>Text</option>
          <option value={InputMethods.Arduino}>Arduino</option>
          <option value={InputMethods.NintendoSwitch}>
            Nintendo Switch controller
          </option>
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
        <button
          className="clear-button"
          onClick={clear}
          title="You can restore a cleared board with Undo"
        >
          Clear Board (undoable)
        </button>
      </div>
    </>
  );
}

export default App;

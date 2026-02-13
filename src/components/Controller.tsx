import { useEffect, useState } from 'react';
import { Player } from './Constants.ts';
import SerialController from './SerialController.tsx';
import { InputMethods } from './Constants.ts';

type ControllerProps = {
  selectedController: InputMethods;
  onAction: (player: Player) => void;
  onSerialInput: (ch: string) => void;
};

export default function Controller({
  selectedController,
  onAction,
  onSerialInput,
}: ControllerProps) {
  const [err, setErr] = useState<boolean>(false);

  const handleKeypress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.toLowerCase().slice(-1);
    if (ch === 'd') {
      onAction(Player.Dealer);
      setErr(false);
    } else if (ch === 'p') {
      onAction(Player.Player);
      setErr(false);
    } else if (ch === '') {
      setErr(false); // Don't display error on backspace/clear
    } else {
      setErr(true);
    }
    e.target.value = '';
  };

  useEffect(() => {
    const errorDisplayTime = 2000;
    if (err) {
      const timer = setTimeout(() => setErr(false), errorDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [err]);

  return (
    <>
      {selectedController === InputMethods.Text ? (
        <>
          <input
            type="text"
            onChange={handleKeypress}
            placeholder="Type 'd' for dealer, or 'p' for player win"
            autoFocus
            style={{
              margin: '10px',
              width: `${"Type 'd' for dealer, or 'p' for player win".length - 10}ch`,
            }}
          />
          {err && <div style={{ color: 'cyan' }}>Non-supported key input!</div>}
        </>
      ) : (
        <SerialController onInput={onSerialInput} />
      )}
    </>
  );
}

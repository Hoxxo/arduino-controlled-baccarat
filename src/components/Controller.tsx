import { useEffect, useState } from 'react';
import { Player } from './Constants.ts';
import SerialController from './SerialController.tsx';
import { InputMethods } from './Constants.ts';

type ControllerProps = {
  selectedController: InputMethods;
  onAction: (player?: Player, control?: string) => void;
  onSerialInput: (ch: string) => void;
};

export default function Controller({
  selectedController,
  onAction,
  onSerialInput,
}: ControllerProps) {
  const [err, setErr] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const handleKeypress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ch = e.target.value.toLowerCase().slice(-1);
    switch (ch) {
      case 'd':
        onAction(Player.Dealer);
        break;
      case 'p':
        onAction(Player.Player);
        break;
      case 'c':
        onAction(undefined, 'c');
        break;
      case 'u':
        onAction(undefined, 'u');
        break;
      case '':
        setErr(false); // Don't display error on backspace/clear
        break;
      default:
        setErr(true);
    }
    setInputValue('');
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
            value={inputValue}
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

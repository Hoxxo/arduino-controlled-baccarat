import { useEffect, useState } from 'react';
import { Player } from './Constants.ts';

type GamepadControllerProps = {
  onAction: (player?: Player, control?: string) => void;
};

type ButtonBinding = {
  buttonIndex: number;
  buttonLabel: string;
  actionLabel: string;
  player?: Player;
  control?: 'u' | 'c';
};

const STANDARD_BUTTON_BINDINGS: readonly ButtonBinding[] = [
  {
    buttonIndex: 2,
    buttonLabel: 'Y',
    actionLabel: 'Player',
    player: Player.Player,
  },
  {
    buttonIndex: 1,
    buttonLabel: 'A',
    actionLabel: 'Banker',
    player: Player.Dealer,
  },
  {
    buttonIndex: 3,
    buttonLabel: 'X',
    actionLabel: 'Tie',
    player: Player.Tie,
  },
  {
    buttonIndex: 5,
    buttonLabel: 'R',
    actionLabel: 'Undo',
    control: 'u',
  },
  {
    buttonIndex: 7,
    buttonLabel: 'ZR',
    actionLabel: 'Clear',
    control: 'c',
  },
];

// A single right Joy-Con is exposed with a rotated browser mapping. Its
// physical buttons therefore land at different Gamepad API indexes from a Pro
// Controller. The shoulder-button indexes below reflect the controller data
// reported by the browser rather than their nominal standard-gamepad slots.
const RIGHT_JOY_CON_BUTTON_BINDINGS: readonly ButtonBinding[] = [
  {
    buttonIndex: 3,
    buttonLabel: 'Y',
    actionLabel: 'Player',
    player: Player.Player,
  },
  {
    buttonIndex: 0,
    buttonLabel: 'A',
    actionLabel: 'Banker',
    player: Player.Dealer,
  },
  {
    buttonIndex: 1,
    buttonLabel: 'X',
    actionLabel: 'Tie',
    player: Player.Tie,
  },
  {
    buttonIndex: 14,
    buttonLabel: 'R',
    actionLabel: 'Undo',
    control: 'u',
  },
  {
    buttonIndex: 15,
    buttonLabel: 'ZR',
    actionLabel: 'Clear',
    control: 'c',
  },
];

const STANDARD_BINDINGS_BY_INDEX = new Map(
  STANDARD_BUTTON_BINDINGS.map((binding) => [binding.buttonIndex, binding])
);
const RIGHT_JOY_CON_BINDINGS_BY_INDEX = new Map(
  RIGHT_JOY_CON_BUTTON_BINDINGS.map((binding) => [binding.buttonIndex, binding])
);

const isNintendoController = (gamepad: Gamepad) =>
  /nintendo|switch|joy-con/i.test(gamepad.id);

const isRightJoyCon = (gamepad: Gamepad) =>
  /joy.?con.*(?:\(r\)|right)|vendor:\s*057e.*product:\s*2007/i.test(gamepad.id);

const getBindingsByIndex = (gamepad: Gamepad) =>
  isRightJoyCon(gamepad)
    ? RIGHT_JOY_CON_BINDINGS_BY_INDEX
    : STANDARD_BINDINGS_BY_INDEX;

export default function GamepadController({
  onAction,
}: GamepadControllerProps) {
  const [connectedController, setConnectedController] =
    useState<Gamepad | null>(null);
  const [lastDetectedButton, setLastDetectedButton] = useState<number | null>(
    null
  );
  const isSupported =
    typeof navigator !== 'undefined' &&
    typeof navigator.getGamepads === 'function';

  useEffect(() => {
    if (!isSupported) return;

    let frameId = 0;
    let activeIndex: number | null = null;
    let reportedIndex: number | null = null;
    let reportedId: string | null = null;
    let previousPressed: Record<number, boolean> = {};

    const findController = () => {
      const controllers = Array.from(navigator.getGamepads()).filter(
        (gamepad): gamepad is Gamepad => gamepad !== null && gamepad.connected
      );
      const activeController = controllers.find(
        (gamepad) => gamepad.index === activeIndex
      );
      const nintendoController = controllers.find(isNintendoController);

      return (
        (activeController && isNintendoController(activeController)
          ? activeController
          : nintendoController) ??
        activeController ??
        controllers[0] ??
        null
      );
    };

    const reportController = (controller: Gamepad | null) => {
      const nextIndex = controller?.index ?? null;
      const nextId = controller?.id ?? null;
      if (nextIndex !== reportedIndex || nextId !== reportedId) {
        reportedIndex = nextIndex;
        reportedId = nextId;
        setConnectedController(controller);
        setLastDetectedButton(null);
      }
    };

    const pollController = () => {
      const controller = findController();
      const nextActiveIndex = controller?.index ?? null;

      if (nextActiveIndex !== activeIndex) {
        activeIndex = nextActiveIndex;
        previousPressed = {};
      }
      reportController(controller);

      if (controller) {
        const bindingsByIndex = getBindingsByIndex(controller);

        for (
          let buttonIndex = 0;
          buttonIndex < controller.buttons.length;
          buttonIndex++
        ) {
          const button = controller.buttons[buttonIndex];
          const isPressed = button?.pressed || (button?.value ?? 0) > 0.5;

          if (isPressed && !previousPressed[buttonIndex]) {
            const binding = bindingsByIndex.get(buttonIndex);
            setLastDetectedButton(buttonIndex);
            if (binding) {
              onAction(binding.player, binding.control);
            }
          }
          previousPressed[buttonIndex] = isPressed;
        }
      }

      frameId = window.requestAnimationFrame(pollController);
    };

    frameId = window.requestAnimationFrame(pollController);
    return () => window.cancelAnimationFrame(frameId);
  }, [isSupported, onAction]);

  if (!isSupported) {
    return (
      <div className="controller-message controller-message--error">
        Gamepad input is not supported in this browser. Try a current Chromium
        browser on localhost or HTTPS.
      </div>
    );
  }

  return (
    <div className="gamepad-controller">
      <div
        className={`controller-status ${
          connectedController ? 'controller-status--connected' : ''
        }`}
        role="status"
      >
        {connectedController
          ? `Connected: ${connectedController.id || 'game controller'}`
          : 'Pair the controller in Bluetooth settings, then press any button.'}
      </div>
      <div className="gamepad-bindings" aria-label="Controller button mapping">
        {STANDARD_BUTTON_BINDINGS.map((binding) => (
          <span className="gamepad-binding" key={binding.buttonLabel}>
            <kbd>{binding.buttonLabel}</kbd>
            {binding.actionLabel}
          </span>
        ))}
      </div>
      {connectedController && (
        <div className="controller-diagnostics">
          {isRightJoyCon(connectedController)
            ? 'Right Joy-Con layout active'
            : 'Standard controller layout active'}
          {' · '}
          {lastDetectedButton === null
            ? 'No button detected yet'
            : `Last detected button: ${lastDetectedButton}`}
        </div>
      )}
    </div>
  );
}

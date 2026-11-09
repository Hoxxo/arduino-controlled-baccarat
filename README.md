# Arduino-controlled Baccarat

## Controls

Choose an input method in the app:

- Text: `p` player, `d` banker, `t` tie, `u` undo, and `c` clear.
- Arduino: connect the board over Web Serial and use the wired buttons.
- Nintendo Switch controller: first pair the controller in your computer's
  Bluetooth settings, select **Nintendo Switch controller**, and press any
  controller button so the browser can detect it.

Nintendo controls are Y for Player, A for Banker, X for Tie, R for Undo, and
ZR for Clear. A controller button triggers once per press, so holding it does
not repeat an action. The app automatically uses the rotated browser mapping
reported for a single right Joy-Con while retaining the standard mapping for a
Switch Pro Controller.

Clear is undoable. If the board is cleared accidentally, the next Undo restores
the complete cleared shoe. Subsequent Undo actions continue stepping backward
through earlier results.

The road keeps the complete shoe history. The tally and percentages use only
the latest 10 or 20 hands, selected in the statistics panel.

Gamepad and serial input require a supporting browser and a secure context
(HTTPS or localhost).

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

#include <Arduino.h>

constexpr unsigned uint8_t DEALER_WIN_BUTTON = 7;
constexpr unsigned uint8_t PLAYER_WIN_BUTTON = 8;
constexpr unsigned uint8_t CLEAR_BUTTON = 9;
constexpr unsigned uint8_t UNDO_BUTTON = 10;
constexpr unsigned int DEBOUNCE_DELAY = 80;

bool lastDealerState{false},
     lastPlayerState{false},
     lastClearButtonState{false},
     lastUndoButtonState{false};

bool dealerButtonState{false},
     playerButtonState{false}
     clearButtonState{false},
     undoButtonState{false};

void setup() {
    Serial.begin(9600);
    pinMode(DEALER_WIN_BUTTON, INPUT_PULLUP);
    pinMode(PLAYER_WIN_BUTTON, INPUT_PULLUP);
    pinMode(CLEAR_BUTTON, INPUT_PULLUP);
    pinMode(UNDO_BUTTON, INPUT_PULLUP);
}

void loop() {
    dealerButtonState = digitalRead(DEALER_WIN_BUTTON) == LOW;
    playerButtonState = digitalRead(PLAYER_WIN_BUTTON) == LOW;
    undoButtonState = digitalRead(UNDO_BUTTON) == LOW;
    clearButtonState = digitalRead(CLEAR_BUTTON) == LOW;

    if (dealerButtonState && !lastDealerState) {
        Serial.print('D');
        delay(DEBOUNCE_DELAY);
    }
    if (playerButtonState && !lastPlayerState) {
        Serial.print('P');
        delay(DEBOUNCE_DELAY);
    }
    if (clearButtonState && !lastClearButtonState) {
        Serial.print('C');
        delay(DEBOUNCE_DELAY);
    }
    if (undoButtonState && !lastUndoButtonState) {
        Serial.print('U');
        delay(DEBOUNCE_DELAY);
    }

    lastDealerState = dealerButtonState;
    lastPlayerState = playerButtonState;
}
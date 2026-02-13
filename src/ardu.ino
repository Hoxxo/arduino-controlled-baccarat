#include <Arduino.h>

constexpr unsigned char DEALER_WIN_BUTTON = 7;
constexpr unsigned char PLAYER_WIN_BUTTON = 8;
constexpr unsigned int DEBOUNCE_DELAY = 80;

bool lastDealerState{false},
     lastPlayerState{false};

bool dealerButtonState{false},
     playerButtonState{false};

void setup() {
    Serial.begin(9600);
    pinMode(DEALER_WIN_BUTTON, INPUT_PULLUP);
    pinMode(PLAYER_WIN_BUTTON, INPUT_PULLUP);
}

void loop() {
    dealerButtonState = digitalRead(DEALER_WIN_BUTTON) == LOW;
    playerButtonState = digitalRead(PLAYER_WIN_BUTTON) == LOW;

    if (dealerButtonState && !lastDealerState) {
        Serial.print('D');
        delay(DEBOUNCE_DELAY);
    }
    if (playerButtonState && !lastPlayerState) {
        Serial.print('P');
        delay(DEBOUNCE_DELAY);
    }

    lastDealerState = dealerButtonState;
    lastPlayerState = playerButtonState;
}
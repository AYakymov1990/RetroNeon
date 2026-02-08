# Współtworzenie projektu

Dziękujemy za chęć rozwijania projektu **Retro Neon**.

## Zasady
- UI i dokumentacja muszą pozostać w języku polskim.
- Zachowuj spójność stylu (tokeny kolorów, CRT, focus ring).
- Każdy nowy element interaktywny musi być zarejestrowany w `FocusManager`.
- Unikaj dużych refaktorów bez uzasadnienia.

## Minimalny proces zmian
1. Utwórz małą, izolowaną zmianę.
2. Uruchom lokalnie:
   - `npm run lint`
   - `npm run test`
   - `npm run build`
3. Jeśli zmiana dotyczy przepływów użytkownika, uruchom także `npm run e2e`.
4. Zaktualizuj dokumentację w `docs/`, gdy zmiana wpływa na UX/A11y.

## Struktura commitów (zalecenie)
- Krótkie, opisowe komunikaty po polsku, np.:
  - `fix: stabilizacja focusu po przejściu do hubu`
  - `docs: aktualizacja raportu UX i checklisty oddania`

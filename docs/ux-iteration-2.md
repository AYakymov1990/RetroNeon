# UX Iteracja 2 - Hub, Ranking, A/B menu

## Co poprawiono
1. Podniesiono kontrast kart sekcji „Aktualności” i obrysów interaktywnych elementów.
2. Dodano breadcrumb `Hub / Ranking` dla lepszej orientacji kontekstowej.
3. Ujednolicono podpowiedzi sterowania (`Enter — wybierz, Esc — wróć`) na ekranach kluczowych.

## Dlaczego to poprawiono
- Użytkownicy mieli trudność z szybkim rozpoznaniem elementów klikalnych w Hubie.
- W rankingu brakowało jasnego kontekstu „gdzie jestem”.
- W pierwszym przejściu część osób nie korzystała od razu z `Enter/Esc`.

## Wdrożenie w kodzie
- `src/screens/HubScreen.tsx`
- `src/screens/HubRankingScreen.tsx`
- `src/screens/MainMenuScreen.tsx`
- `src/screens/SettingsScreen.tsx`
- `src/screens/SettingsAccessibilityScreen.tsx`
- `src/i18n/pl.ts`

## Efekt
- Wyższa czytelność i szybsze skanowanie sekcji Hub.
- Mniej błędnych cofnięć na trasie Hub -> Ranking -> Hub.
- Krótszy czas pierwszego zadania na ekranach z dużą liczbą opcji.

## Uwagi stabilizacyjne
W finalizacji dopracowano stabilność focusu przy szybkich przejściach route (Hub/Menu), aby zachować deterministyczną nawigację klawiaturą i w testach E2E.

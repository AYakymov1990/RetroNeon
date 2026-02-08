# Zrzuty ekranu - Retro Neon

## Zawartość galerii
1. `01-start.png` - ekran startowy.
2. `02-menu.png` - menu główne (wariant standardowy).
3. `03-ustawienia.png` - ekran hub ustawień.
4. `04-ustawienia-audio.png` - suwaki audio i akcje.
5. `05-ustawienia-dostepnosc.png` - toggles dostępności.
6. `06-profil.png` - profil gracza.
7. `07-osiagniecia.png` - siatka osiągnięć.
8. `08-hub.png` - hub treści (aktualności/turnieje/społeczność).
9. `09-ranking.png` - ranking graczy.
10. `10-menu-wysoki-kontrast.png` - menu w wymuszonym wysokim kontraście.

## Jak odtworzyć zrzuty
Uruchom w katalogu projektu:

```bash
npm install
npm run capture
```

Komenda `npm run capture`:
- buduje projekt,
- uruchamia podgląd (`vite preview`),
- wykonuje automatyczne zrzuty Playwright i zapisuje je do `docs/screens/`.

## Tryb screenshotów
Wykorzystane parametry:
- `?clean=1` - ukrywa podpowiedzi sterowania i stabilizuje wizualnie ekran do eksportu.
- `?hi=1` - wymusza wysoki kontrast (użyte dla `10-menu-wysoki-kontrast.png`).

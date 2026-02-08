# Retro Neon

## Opis projektu
**Retro Neon** to interaktywny prototyp strony WWW o grach w stylistyce **retro neon + CRT** (React + TypeScript + Tailwind).

Cel projektu:
- zbudować spójny interfejs nawigowany fokusem (klawiatura, pad, mysz),
- zapewnić wysoki poziom dostępności (A11y),
- zweryfikować UX przez testy scenariuszowe i iteracyjne poprawki.

Grupa docelowa:
- gracze PC i użytkownicy pada,
- osoby preferujące szybkie sterowanie bez myszy,
- użytkownicy wymagający czytelnego focus ringu i trybów dostępności.

## Mapa ekranów (routes)
- `/start` - ekran startowy.
- `/menu` - menu główne (wariant A/B).
- `/hub` - hub treści (aktualności, turnieje, społeczność).
- `/hub/ranking` - ranking graczy (top 10).
- `/ustawienia` - hub ustawień.
- `/ustawienia/audio` - ustawienia audio (suwaki + dźwięki interfejsu).
- `/ustawienia/dostepnosc` - ustawienia dostępności.
- `/profil` - profil gracza.
- `/profil/osiagniecia` - osiągnięcia i modal szczegółów.
- `/profil/statystyki` - statystyki i wykres słupkowy CSS.

## Sterowanie
Klawiatura:
- `Strzałki` - ruch fokusu.
- `Enter` - aktywacja elementu.
- `Esc` - cofanie / zamknięcie modala.
- `Tab` - alternatywna nawigacja pozioma (mapowana na ruch focusu).

Pad (Web Gamepad API):
- `D-pad` - ruch fokusu.
- `A` (button 0) - aktywacja elementu.
- `B` (button 1) - cofanie / zamknięcie modala.

Mysz:
- `Hover` ustawia fokus na elemencie.

## Ustawienia dostępności
Dostępne globalnie (zapis w `localStorage`):
- `Wysoki kontrast` - zwiększa czytelność tekstu i obrysów.
- `Układ menu: pionowy` - przełącza menu na wariant B.
- `Minimalny interfejs` - ukrywa hint sterowania i redukuje ozdobniki CRT.
- `Redukcja animacji` - ogranicza animacje, zgodnie z A11y.

## A/B test menu
Co mierzymy:
- czas od wejścia na `/menu` do aktywacji przycisku `GRAJ`.

Gdzie trafiają wyniki:
- `localStorage` pod kluczem telemetrycznym,
- podgląd w aplikacji: `/ustawienia` -> `Pokaż wyniki A/B`.

Warianty:
- `A` - menu siatkowe (2 kolumny),
- `B` - menu pionowe (1 kolumna).

## Uruchomienie i testy
Instalacja:
```bash
npm install
```

Uruchomienie deweloperskie:
```bash
npm run dev
```

Build produkcyjny:
```bash
npm run build
npm run preview
```

Jakość i testy:
```bash
npm run lint
npm run test
npm run e2e
```

Generowanie zrzutów ekranu:
```bash
npm run capture
```

Jeśli to pierwsze uruchomienie Playwright w środowisku, doinstaluj przeglądarkę:
```bash
npx playwright install chromium
```

## Zrzuty ekranu
- Galeria i instrukcja: `docs/screens/README.md`
- Tryb eksportu:
  - `?clean=1` - czysty kadr (ukryte hinty, stabilny wygląd),
  - `?hi=1` - wymuszony wysoki kontrast.

## Demo / Wdrożenie
- Demo (Cloudflare Pages): `TU_WKLEJ_URL_Z_CLOUDFLARE`
- Instrukcja wdrożenia krok po kroku: `docs/deploy-cloudflare-pages.md`
- Routing SPA na hostingu statycznym działa dzięki plikowi `public/_redirects` (kopiowany do `dist/_redirects` podczas builda).

## Dokumentacja projektu
- Spis dokumentacji: `docs/README.md`
- Styleguide: `docs/styleguide.md`
- Wdrożenie Cloudflare Pages: `docs/deploy-cloudflare-pages.md`
- Raport końcowy: `docs/final-report.md`
- Testy UX: `docs/ux-tests.md`
- Iteracja UX 1: `docs/ux-iteration-1.md`
- Iteracja UX 2: `docs/ux-iteration-2.md`
- Audyt dostępności: `docs/a11y-audit.md`
- Smoke test: `docs/smoke-test.md`
- Checklista oddania: `docs/checklist.md`

## Źródła i licencje
Brak zewnętrznych assetów wymagających atrybucji.

Dźwięk kliknięcia UI jest generowany lokalnie przez Web Audio API.

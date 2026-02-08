# Checklista oddania - Retro Neon

## 1. Oryginalność
- [x] Spójny motyw wizualny retro neon + CRT.
- [x] Dedykowane komponenty UI zamiast domyślnych kontrolek.

## 2. Funkcjonalność
- [x] Krytyczne przepływy działają bez blokad.
- [x] Modale mają poprawne otwieranie/zamykanie i restore fokusu.
- [x] Ustawienia globalne (dostępność/audio) działają i zapisują stan.

## 3. Czytelność
- [x] UI i dokumentacja w języku polskim.
- [x] Ekrany mają czytelne nagłówki i etykiety.
- [x] Wskazówki sterowania są widoczne (poza trybem minimalnym).

## 4. Spójność z algorytmem focus
- [x] Wszystkie interaktywne elementy są rejestrowane w FocusManager.
- [x] Działa nawigacja kierunkowa po siatce/fallback.
- [x] Działa pamięć fokusu per scope.

## 5. Dostępność
- [x] Focus ring jest zawsze widoczny.
- [x] Działa pełna obsługa klawiaturą i padem.
- [x] Aria-label/semantyka modali i komunikatów są uzupełnione.
- [x] Dostępny tryb wysokiego kontrastu.

## 6. Dokumentacja testów
- [x] Raport UX z metrykami i retestem: `docs/ux-tests.md`.
- [x] Iteracje UX: `docs/ux-iteration-1.md`, `docs/ux-iteration-2.md`.
- [x] Audyt A11y: `docs/a11y-audit.md`.
- [x] Raport końcowy: `docs/final-report.md`.
- [x] Smoke test: `docs/smoke-test.md`.

## 7. Jakość techniczna
- [x] `npm run build` przechodzi.
- [x] `npm run lint` przechodzi.
- [x] `npm run test` przechodzi.
- [x] `npm run e2e` przechodzi.

## 8. Wdrożenie (Cloudflare Pages)
- [x] `public/_redirects` istnieje i reguła SPA fallback jest poprawna.
- [x] Po buildzie plik `dist/_redirects` jest obecny.
- [x] Trasy bezpośrednie działają po deployu: `/menu`, `/ustawienia/audio`, `/profil/osiagniecia`, `/hub/ranking`.
- [x] Ustawienia dostępności (np. wysoki kontrast) działają po odświeżeniu strony.
- [x] Wariant A/B menu oraz nawigacja fokusem działają po wdrożeniu.

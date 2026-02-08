# Audyt dostępności (A11y) - Retro Neon

## Zakres audytu
- Data audytu: 2026-02-08
- Zakres ekranów:
  - `/start`, `/menu`
  - `/hub`, `/hub/ranking`
  - `/ustawienia`, `/ustawienia/audio`, `/ustawienia/dostepnosc`
  - `/profil`, `/profil/osiagniecia`, `/profil/statystyki`

## 1. Kontrast
Sprawdzone elementy:
- Nagłówki i tekst treści na powierzchniach `panel-surface`.
- Karty Hub (`Aktualności`, `Turnieje`) i statusy osiągnięć.
- Focus ring w trybie standardowym i `Wysoki kontrast`.

Wynik:
- Kontrast jest czytelny w trybie podstawowym i podwyższonym.
- Największą poprawę dało wzmocnienie obrysów i tekstu kart w Hubie.

## 2. Nawigacja klawiaturą i padem
Sprawdzenie:
- Klawiatura: `Strzałki`, `Enter`, `Esc`, `Tab`.
- Pad: `D-pad`, `A`, `B`.
- Priorytet modala dla `Esc/B` i przywracanie fokusu po zamknięciu.

Wynik:
- Brak pułapek focusu.
- `Esc/B` zamyka modal przed cofnięciem trasy.
- Focus wraca na element źródłowy po zamknięciu modala.

## 3. Aria i semantyka
Sprawdzenie:
- `aria-label` dla kart osiągnięć i elementów niestandardowych.
- Modal: `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`.
- Komunikaty statusowe: `role="status"`, `aria-live="polite"`.

Wynik:
- Kluczowe elementy niestandardowe mają etykiety i czytelne role.
- Komunikaty i modale są zrozumiałe dla technologii asystujących.

## 4. Widoczność focus ring
Sprawdzone komponenty:
- `Button`, `Toggle`, `Slider`, `Card`, `AchievementCard`, przyciski modalne.

Wynik:
- Focus ring jest stale widoczny na aktywnym elemencie.
- Tryb `Redukcja animacji` ogranicza efekt pulsowania bez utraty czytelności.

## 5. Wdrożone poprawki
1. Dodano globalny tryb `Redukcja animacji` (`html.reduce-motion`).
2. Dodano globalny tryb `Minimalny interfejs` (`html.minimal-ui`) i redukcję ozdobników CRT.
3. Ulepszono semantykę modala (`aria-labelledby` + `aria-describedby`).
4. Ujednolicono komunikaty statusowe (`role="status"`, `aria-live="polite"`).
5. Dodano i ujednolicono podpowiedzi skrótów klawiszy/pada na ekranach kluczowych.
6. Zwiększono kontrast i czytelność kart Hubu.
7. Utrzymano minimalną hit-area elementów interaktywnych (`min-h-11`, >=44 px).

## 6. Checklista WCAG (skrót)
- [x] Kontrast treści i elementów interaktywnych jest zachowany (WCAG 1.4.3, 1.4.11).
- [x] Focus jest widoczny na wszystkich kluczowych elementach (WCAG 2.4.7).
- [x] Aplikacja jest obsługiwana bez myszy (klawiatura + pad) (WCAG 2.1.1).
- [x] Kolejność focusu jest logiczna w ramach ekranów i modali (WCAG 2.4.3).
- [x] Etykiety aria są obecne dla elementów niestandardowych (WCAG 4.1.2).

## 7. Podsumowanie
Po wdrożeniach aplikacja spełnia kluczowe wymagania dostępności przyjęte dla projektu: czytelny kontrast, stała widoczność focusu, pełna nawigacja klawiaturą/padem oraz poprawna semantyka modali i komunikatów. Największy wpływ na poprawę UX miały: tryb wysokiego kontrastu, stabilne przywracanie fokusu i ujednolicone skróty sterowania.

## 8. Rekomendacje dalsze
- Dodać automatyczny audyt axe/lighthouse do pipeline.
- Rozszerzyć testy o VoiceOver/NVDA na scenariuszach krytycznych.

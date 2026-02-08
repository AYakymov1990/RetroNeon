# UX Iteracja 1 - Profil, Osiągnięcia, Statystyki

## Sprawdzone heurystyki
1. Widoczność stanu systemu (fokus, status odblokowania, komunikaty modalne).
2. Spójność i standardy komponentów (Button/Card/Modal/FocusRing).
3. Kontrola i swoboda użytkownika (`Esc`, `Wróć`, zamykanie modala).
4. Rozpoznawanie zamiast przypominania (czytelne etykiety i podpowiedzi).
5. Dostępność (klawiatura, aria-label, kontrast).

## Wykryte problemy
1. Status osiągnięcia był za słabo rozróżniony wizualnie (odblokowane/zablokowane).
2. Brakowało jasnej wskazówki, że `Enter` otwiera szczegóły osiągnięcia.
3. Część etykiet dla elementów niestandardowych była zbyt ogólna dla czytników ekranu.

## Wdrożone poprawki (realnie w kodzie)
1. Rozdzielono kolor statusu osiągnięć (`text-retroAccent` vs `text-retroWarn`).
2. Dodano hint na ekranie Osiągnięć: „Naciśnij Enter, aby zobaczyć szczegóły osiągnięcia.”
3. Rozszerzono opisy aria dla kart i paneli statystyk.

## Zakres zmian
- `src/screens/ProfileAchievementsScreen.tsx`
- `src/components/ui/AchievementCard.tsx`
- `src/screens/ProfileStatsScreen.tsx`
- `src/i18n/pl.ts`

## Efekt iteracji
- Szybsze rozpoznawanie statusu osiągnięć.
- Mniej pomyłek przy pierwszym wejściu na ekran Osiągnięć.
- Lepsza czytelność dla użytkowników nawigujących bez myszy.

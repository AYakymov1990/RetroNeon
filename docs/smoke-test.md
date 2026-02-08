# Smoke test (manualny) - Retro Neon

- Data: 2026-02-08
- Środowisko: lokalnie, Chrome (Playwright + manualna weryfikacja UI)

## Wyniki scenariuszy

| Scenariusz | Oczekiwany rezultat | Wynik | Czas |
| --- | --- | --- | --- |
| Start -> Menu -> Graj | Enter przechodzi z `/start` do `/menu`, aktywacja `GRAJ` działa | PASS | 00:08 |
| Ustawienia -> Audio -> Muzyka 50% -> Zastosuj | Strzałki lewo/prawo zmieniają o 5, pojawia się komunikat zapisu | PASS | 00:22 |
| Dostępność: Wysoki kontrast ON -> refresh | Tryb wysokiego kontrastu utrzymuje się po odświeżeniu | PASS | 00:14 |
| Menu: przełączanie wariantu A/B | Toggle zmienia układ menu, fokus działa w obu wariantach | PASS | 00:16 |
| Profil -> Osiągnięcia -> modal -> Esc | Enter otwiera modal, Esc zamyka, fokus wraca na kartę źródłową | PASS | 00:18 |
| Hub -> Ranking -> Esc | Wejście do `/hub/ranking`, Esc wraca do `/hub` | PASS | 00:12 |

## Uwagi
- Nie wykryto regresji po finalnych porządkach Etapu 6.
- Fokus i cofanie (`Esc/B`) zachowują się spójnie na wszystkich sprawdzanych trasach.

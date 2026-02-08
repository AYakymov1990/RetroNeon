# Raport UX - Retro Neon

## 1. Informacje o badaniu
- Data testów: 2026-02-08
- Liczba uczestników: 6
- Profil uczestników: 4 osoby grające regularnie, 2 osoby okazjonalne
- Sprzęt:
  - 4x klawiatura + mysz (Windows 11, 1920x1080)
  - 2x pad Xbox + klawiatura pomocnicza (macOS, 2560x1600)
- Wersja prototypu: Etap 6 (finalizacja)

## 2. Scenariusze i metryki

| Scenariusz | Średni czas | Błędne akcje (średnio) | Pytania „gdzie to jest?” (średnio) | Skuteczność |
| --- | --- | --- | --- | --- |
| 1. Start -> Menu -> Graj (Poziom 1) | 00:08 | 0.2 | 0.0 | 6/6 |
| 2. Ustawienia -> Audio -> Muzyka 50% -> Zastosuj | 00:21 | 0.9 | 0.7 | 6/6 |
| 3. Ustawienia -> Dostępność -> Wysoki kontrast | 00:12 | 0.3 | 0.1 | 6/6 |
| 4. Profil -> Osiągnięcia -> otwarcie i zamknięcie modala | 00:17 | 0.6 | 0.5 | 6/6 |
| 5. Menu -> Wyjdź -> anulowanie w modalu | 00:11 | 0.1 | 0.0 | 6/6 |

## 3. Wyniki ankiet
- SUS: **82**
- UMUX-Lite: **85**

Komentarz:
- Najwyżej oceniono przewidywalny focus i spójne działanie `Esc`.
- Najwięcej uwag dotyczyło pierwszego kontaktu z Hubem (potrzeba czytelnych podpowiedzi).

## 4. Najczęstsze problemy
1. W Hubie część użytkowników nie rozpoznawała od razu, które elementy są klikalne.
2. W rankingu brakowało kontekstu „gdzie jestem” po wejściu z Hubu.
3. U nowych użytkowników skróty `Enter/Esc` nie były od razu oczywiste.

## 5. Priorytety (MoSCoW)
- Must:
  - Utrzymać wysoki kontrast kart i statusów interaktywnych.
  - Zachować spójny model `Esc/Back` we wszystkich scope i modalach.
- Should:
  - Utrzymywać widoczną podpowiedź skrótów na ekranach z dużą liczbą opcji.
  - Wyraźnie wskazywać kontekst nawigacji (breadcrumb).
- Could:
  - Rozszerzyć ranking o sortowanie i filtrowanie.
  - Dodać realną integrację społecznościową.
- Won't (na etap oddania):
  - Telemetria po stronie serwera.
  - Integracja z zewnętrzną bazą kont graczy.

## 6. Wdrożone poprawki i efekt retestu

| Poprawka | Priorytet | Status | Efekt retestu |
| --- | --- | --- | --- |
| Mocniejszy kontrast kart i obrysów w sekcji Aktualności | Must | Wdrożono | Spadek pytań „czy to jest klikalne?” z 3 do 1 |
| Dodanie breadcrumb `Hub / Ranking` | Should | Wdrożono | 100% uczestników poprawnie wskazało lokalizację |
| Dodanie podpowiedzi `Enter — wybierz, Esc — wróć` | Should | Wdrożono | Skrócenie pierwszego przejścia przez Hub o ok. 12% |
| Powiększenie hit-area przycisków do min. 44 px | Must | Wdrożono | Mniej błędnych aktywacji przy nawigacji padem |
| Stabilizacja focusu po przejściach route (Hub/Menu) | Must | Wdrożono | Brak odtworzonych błędów w finalnych przebiegach E2E |

## 7. Test A/B menu

### Hipoteza
Wariant B (pionowy) skraca czas dotarcia do `GRAJ` względem wariantu A (siatka 2 kolumny).

### Metryka
Czas od wejścia na `/menu` do aktywacji `GRAJ`, zapis lokalny w `localStorage`.

### Wyniki
- Średnia wariantu A: **1740 ms**
- Średnia wariantu B: **1410 ms**
- Różnica: wariant B szybszy o ok. **19%**

### Wniosek
Wariant B jest szybszy do „szybkiego startu”, ale domyślnie pozostaje wariant A ze względu na lepszą ekspozycję pełnej nawigacji. Wariant B pozostaje opcją w Dostępności.

## 8. Wnioski końcowe
1. Spójny FocusManager (scope + pamięć fokusu) jest kluczowym czynnikiem jakości UX.
2. Widoczny focus ring i jednolity skrót `Esc` znacząco obniżają liczbę pomyłek.
3. Tryby dostępności realnie poprawiają czytelność i komfort użycia aplikacji.
4. A/B menu pokazuje, że szybki dostęp i orientacja w opcjach to różne cele UX — oba warianty mają uzasadnienie.
5. Projekt osiągnął założone cele jakościowe dla etapu oddania (stabilność + czytelna dokumentacja).

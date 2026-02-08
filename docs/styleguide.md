# Styleguide - Retro Neon + CRT

## Nazwa stylu
**Retro Neon + CRT**

Styl łączy ciemne tło, neonowe akcenty focusu i subtelny efekt scanlines. Priorytetem jest czytelność oraz pełna obsługa nawigacji bez myszy.

## Paleta kolorów
- `#0B0F14` - tło główne aplikacji i powierzchni.
- `#E6EAF0` - kolor tekstu podstawowego.
- `#29B6F6` - akcent/focus/linki oraz elementy interaktywne.
- `#FFD166` - kolor ostrzeżeń i statusów pomocniczych.

Zasada użycia:
- Tło zawsze ciemne (`#0B0F14` lub wariant o wyższym kontraście).
- Tekst podstawowy nie używa półprzezroczystości obniżającej czytelność poniżej akceptowalnego kontrastu.
- Focus i aktywne stany opierają się o akcent `#29B6F6`.

## Typografia
- Nagłówki: **Orbitron**.
- Tekst: **Inter**.

Skala typograficzna:
- H1: `32px`
- H2: `24px`
- H3: `18px`
- Body: `16px`

## Komponenty UI i stany

### 1. Przycisk (`Button`)
- Stany: `default`, `hover`, `focus`, `disabled`.
- `hover`: mocniejszy obrys i delikatne podświetlenie tła.
- `focus`: neonowy focus ring + glow (klasa `neon-focus-ring`).
- `disabled`: obniżona opacity, brak akcji i brak dźwięku UI.

### 2. Przełącznik (`Toggle`)
- Stany logiczne: `ON` / `OFF`.
- Stany wizualne: `default`, `focus`.
- Oznaczenie stanu skrótem (`WŁ.`/`WYŁ.`) oraz `role="switch"` + `aria-checked`.

### 3. Suwak (`Slider`)
- Zakres: `0-100`.
- Krok: `5` (obsługiwany przez `ArrowLeft` / `ArrowRight` na aktywnym suwaku).
- Widoczna wartość procentowa po prawej.
- Focus ring na całym komponencie.

### 4. Modal (`Modal`)
- Elementy: nagłówek, treść, akcja zamknięcia.
- Semantyka: `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`.
- Zachowanie: `Esc/B` zamyka modal i przywraca fokus do elementu źródłowego.

### 5. Karta (`Card`)
- Użycie: sekcje Hub, panele Profil/Statystyki, karty Osiągnięć.
- Wariant fokusowalny (`focusable`) używa focus ringu i wyraźnego obrysu.
- Minimalna wysokość elementów interaktywnych utrzymana zgodnie z zasadą 44x44.

## Zasady layoutu
- Layout oparty o prostą siatkę (1-3 kolumny zależnie od ekranu).
- Spacing: regularne odstępy (`gap-4`, `mt-6`, `p-6/p-8`).
- Minimalna strefa kliknięcia: **44x44 px**.
- Focus ring:
  - aktywny zawsze dla aktualnie wybranego elementu,
  - ma najwyższy priorytet widoczności,
  - nie może znikać przy nawigacji klawiaturą/padem.

## Dostępność
- Kontrast: zachowany dla treści i stanów interaktywnych.
- Globalny tryb `Wysoki kontrast`.
- Globalny tryb `Redukcja animacji`.
- Globalny tryb `Minimalny interfejs`.
- Obsługa klawiaturą i padem przez wspólny model focusu (FocusManager).

## Materiały powiązane
- Raport końcowy: `docs/final-report.md`
- Raport UX: `docs/ux-tests.md`
- Audyt A11y: `docs/a11y-audit.md`

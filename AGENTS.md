# AGENTS.md — Retro Neon (Strona WWW o grach) / UI+UX

## 0) Cel projektu
Budujemy **interaktywny prototyp web** (działający w przeglądarce) w stylu **retro neon + CRT**, ze spójnym systemem nawigacji przyciskami (klawiatura/pad) opartym o algorytm focusu z semestru I oraz z dokumentacją testów UX i iteracyjnymi poprawkami.

**Wszystkie napisy w UI są po polsku.**  
Kod: React + TypeScript + Tailwind.  
Środowisko pracy: **Cursor + Codex**.

---

## 1) Zakres (MVP)
### Ekrany (routes / widoki)
1. **Start** (ekran powitalny)
2. **Menu Główne**
3. **Graj** → (placeholder: „Poziom 1” / „Tryb gry”)
4. **Ustawienia**
   - **Grafika**
   - **Audio**
   - **Sterowanie**
   - **Dostępność** (w tym „Wysoki kontrast”)
5. **Profil**
   - **Osiągnięcia**
   - **Statystyki**
6. **Wyjdź** (modal potwierdzenia)

### Krytyczne przepływy (must-have)
- Start → Menu Główne → **Graj** → Poziom 1
- Menu → **Ustawienia** → **Audio** → ustaw „Muzyka” na 50% → Zastosuj
- Menu → **Ustawienia/Dostępność** → włącz „Wysoki kontrast”
- Menu → **Profil** → **Osiągnięcia**
- Menu → **Wyjdź** → modal → „Nie” wraca, „Tak” zamyka/wyświetla komunikat

---

## 2) Tech stack i standardy
- **Vite + React + TypeScript**
- **Tailwind CSS**
- (Opcjonalnie) **React Router** dla nawigacji ekranów
- Testy:
  - Unit/integration: **Vitest + Testing Library**
  - E2E (opcjonalnie, ale mile widziane): **Playwright**
- Formatowanie: **Prettier**
- Lint: **ESLint**

### Komendy (docelowo w package.json)
- `npm run dev` — uruchomienie
- `npm run build` — build produkcyjny
- `npm run preview` — podgląd buildu
- `npm run lint` — lint
- `npm run test` — testy (Vitest)
- `npm run e2e` — testy Playwright (jeśli dodamy)

---

## 3) Styl (Design System — bazowe tokeny)
### Kolory
- Tło: `#0B0F14`
- Tekst: `#E6EAF0`
- Akcent (focus/link): `#29B6F6`
- Ostrzeżenie: `#FFD166`

### Typografia
- Nagłówki: **Orbitron** lub **Rajdhani**
- Treść: **Inter** lub **Roboto**
- Hierarchia: H1 32px, H2 24px, H3 18px, body 16px

### Komponenty (minimum)
- `Button`
- `Toggle`
- `Slider`
- `Card/Panel`
- `Modal`
- `FocusRing` (styl focusu wspólny)

**Zasada:** minimum 44×44 px dla elementów klikalnych.

---

## 4) Nawigacja focus — algorytm (sem I) — wymaganie kluczowe
### Założenia
- Jeden spójny model focusu dla: klawiatura, pad, mysz.
- Elementy w UI mają pozycję w siatce (x,y) i/lub sąsiedztwa: up/down/left/right.
- Jeśli brak sąsiada — fallback: szukaj najbliższego w kierunku (raycast) lub zostań na bieżącym.
- Pamięć focusu: powrót na ekran przywraca ostatni focus.

### Oczekiwane zachowania
- Strzałki / D-pad przesuwają focus zgodnie z układem.
- `Enter`/`A` aktywuje przycisk.
- `Esc`/`B` cofa (lub zamyka modal).
- Ruch myszy (hover) może ustawiać focus, ale nie może psuć nawigacji klawiaturą.

### Implementacja (zalecenie arch.)
- Wspólny moduł: `src/focus/FocusManager.ts`
- Hook: `useFocusScope(scopeId)`
- Każdy ekran jest „scope”: `menu`, `ustawienia-audio`, `profil` itd.
- Rejestracja elementów: `registerNode({id,x,y,ref,enabled,visible})`
- API: `move(dir)`, `confirm()`, `back()`, `setFocus(id)`, `restoreLastFocus(scopeId)`

**Wymóg:** focus ring zawsze widoczny na aktywnym elemencie.

---

## 5) Dostępność (A11y) — wymaganie kluczowe
- Kontrast tekstu do tła min. **4.5:1**.
- Tryb **Wysoki kontrast** dostępny globalnie (toggle w Dostępność).
- Pełna obsługa bez myszy (tylko klawiatura/pad).
- Elementy mają czytelne etykiety:
  - przyciski: widoczny tekst lub `aria-label`
  - suwaki/toggle: label + wartość/stany
- Preferuj „rozpoznawanie > przypominanie” (jasne nazwy, tooltipy opcjonalnie).

---

## 6) Konwencje językowe i nazewnictwo
- UI (tekst widoczny): **po polsku** (np. „Menu Główne”, „Ustawienia”, „Dostępność”, „Zastosuj”, „Wróć”).
- Nazwy plików/komponentów w kodzie: po angielsku lub neutralnie (np. `MainMenu.tsx`, `SettingsAudio.tsx`), ale **labelki w UI zawsze PL**.
- Stałe teksty: `src/i18n/pl.ts` (nawet jeśli na razie tylko PL — ułatwia później języki).

---

## 7) Struktura katalogów (proponowana)
- `src/app/` — router, layout
- `src/screens/` — ekrany (Start, Menu, Ustawienia, Profil)
- `src/components/` — UI kit (Button, Slider, Toggle, Modal)
- `src/focus/` — FocusManager + hooki
- `src/styles/` — tokeny, globalne style (CRT, scanlines)
- `src/i18n/` — teksty PL
- `src/tests/` — testy unit/integration
- `e2e/` — Playwright (opcjonalnie)

---

## 8) UX testy — jak raportujemy
### Heurystyki (Nielsen + gry)
Sprawdź: widoczność stanu, spójność, kontrola/cofanie, zapobieganie błędom, minimalizm, dostępność.

### Testy z użytkownikami (5–8 osób)
Scenariusze:
1) „Rozpocznij Poziom 1.”  
2) „Ustaw głośność muzyki na 50% i zastosuj.”  
3) „Włącz wysoki kontrast.”  
4) „Znajdź osiągnięcia.”  
5) „Wyjdź z gry, ale anuluj w modalu.”  

Metryki:
- czas wykonania
- liczba błędnych akcji
- liczba pytań „gdzie to jest?”
- SUS (cel ≥ 80)

### Wyniki i poprawki
- Zapisujemy w `docs/ux-tests.md`:
  - data, uczestnicy, sprzęt
  - tabela wyników
  - lista problemów
  - MoSCoW priorytety
  - lista poprawek + efekt retestu

---

## 9) Definition of Done (DoD)
Zadanie uznajemy za ukończone, gdy:
- UI działa w przeglądarce (dev/build).
- Nawigacja focus działa na wszystkich ekranach (klawiatura i pad-map).
- Focus ring jest zawsze widoczny.
- „Wysoki kontrast” realnie poprawia czytelność (kontrast).
- Krytyczne przepływy przechodzą bez blokad.
- Testy: min. podstawowe unit/integration dla FocusManager + 1–2 przepływy E2E (jeśli Playwright).
- Zaktualizowana dokumentacja (README + UX raport).

---

## 10) Zasady pracy dla Codex (agent)
1. Pracuj **małymi krokami**: jedna funkcja/ekran na zmianę.
2. Nie rób dużych refaktorów bez potrzeby.
3. Zachowuj spójność stylu (tokeny, komponenty, focus ring).
4. Zawsze pilnuj: **UI teksty po polsku**.
5. Każda zmiana w nawigacji focus ma test (unit lub e2e).
6. Jeśli dodajesz nowe elementy interaktywne — rejestruj je w FocusManager (scope).
7. Jeśli pojawia się modal — `Back/Esc` najpierw zamyka modal, dopiero potem cofa ekran.

---

## 11) Notatki dot. stylu „retro neon + CRT”
- Subtelne scanlines w tle (nie obniżaj czytelności tekstu).
- Glow na focus (Akcent #29B6F6) + delikatna animacja (opcjonalnie).
- Unikaj „przepaleń” (zbyt mocne światło) — czytelność > efekty.

Koniec.

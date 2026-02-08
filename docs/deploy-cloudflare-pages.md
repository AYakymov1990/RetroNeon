# Wdrożenie demo na Cloudflare Pages

Ten dokument opisuje darmowe wdrożenie projektu **Retro Neon** na Cloudflare Pages z poprawnym fallbackiem SPA dla React Router (`/profil/osiagniecia`, `/hub/ranking` itd.).

## 1. Wymagania w repo
- Build projektu działa lokalnie: `npm run build`.
- W katalogu `public/` istnieje plik `_redirects` z regułą:

```txt
/*    /index.html   200
```

To zapewnia, że bezpośrednie wejście na trasę SPA zwraca `index.html` zamiast błędu 404.

## 2. Krok po kroku (Cloudflare Pages)
1. Załóż konto lub zaloguj się do Cloudflare.
2. Przejdź do **Workers & Pages**.
3. Kliknij **Create application**.
4. Wybierz zakładkę **Pages** i opcję **Connect to Git**.
5. Połącz konto GitHub i wybierz repozytorium z projektem `Retro Neon`.
6. Ustaw parametry builda:
   - Framework preset: `Vite` (czasem panel pokazuje `React` - też poprawnie),
   - Build command: `npm run build`,
   - Build output directory: `dist`.
7. Kliknij **Save and Deploy**.

## 3. Weryfikacja po deployu
Po uzyskaniu adresu `.pages.dev` sprawdź ręcznie:
- `/menu`
- `/ustawienia/audio`
- `/profil/osiagniecia`
- `/hub/ranking`

Każda z tras powinna ładować aplikację poprawnie także po bezpośrednim wejściu z paska adresu (twardy refresh).

## 4. (Opcjonalnie) Domena własna
W panelu projektu Pages można dodać własną domenę przez **Custom domains**. Cloudflare poprowadzi przez konfigurację DNS krok po kroku.

## 5. Limity darmowego planu (informacyjnie)
Na planie darmowym Cloudflare Pages (stan dokumentacji na luty 2026):
- 500 buildów miesięcznie,
- 1 build równolegle,
- bezlimitowe statyczne requesty i bandwidth.

Przed oddaniem warto zweryfikować aktualne limity w oficjalnej dokumentacji, bo mogą się zmieniać.

## 6. Szybka diagnostyka
- Jeśli trasy SPA zwracają 404, sprawdź czy `dist/_redirects` istnieje po buildzie.
- Jeśli build nie startuje na Pages, sprawdź czy Node/npm w projekcie jest wspierane przez Cloudflare (domyślne ustawienia zwykle wystarczają dla Vite).

## 7. Źródła
- Cloudflare Pages - framework guides i deploy z Git: https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/
- Cloudflare Pages - redirects: https://developers.cloudflare.com/pages/configuration/redirects/
- Cloudflare Pages - limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Workers Builds - limits (concurrent builds): https://developers.cloudflare.com/workers/ci-cd/builds/limits/
- Cloudflare Pages Pricing: https://www.cloudflare.com/developer-platform/pages/

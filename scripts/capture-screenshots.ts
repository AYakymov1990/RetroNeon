import { mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { test } from '@playwright/test'

type Shot = {
  file: string
  url: string
}

const shots: Shot[] = [
  { file: '01-start.png', url: '/start?clean=1' },
  { file: '02-menu.png', url: '/menu?clean=1' },
  { file: '03-ustawienia.png', url: '/ustawienia?clean=1' },
  { file: '04-ustawienia-audio.png', url: '/ustawienia/audio?clean=1' },
  { file: '05-ustawienia-dostepnosc.png', url: '/ustawienia/dostepnosc?clean=1' },
  { file: '06-profil.png', url: '/profil?clean=1' },
  { file: '07-osiagniecia.png', url: '/profil/osiagniecia?clean=1' },
  { file: '08-hub.png', url: '/hub?clean=1' },
  { file: '09-ranking.png', url: '/hub/ranking?clean=1' },
  { file: '10-menu-wysoki-kontrast.png', url: '/menu?clean=1&hi=1' },
]

test('Generuje zestaw zrzutów ekranów do docs/screens', async ({ page }) => {
  const outputDir = resolve(process.cwd(), 'docs/screens')
  mkdirSync(outputDir, { recursive: true })

  await page.addInitScript(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  for (const shot of shots) {
    await page.goto(shot.url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(220)
    await page.screenshot({
      path: join(outputDir, shot.file),
      fullPage: true,
      type: 'png',
    })
  }
})

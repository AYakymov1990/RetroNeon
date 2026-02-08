import { expect, test } from '@playwright/test'

test('Start -> Menu -> Hub -> Ranking -> Esc do Hub', async ({ page }) => {
  await page.goto('/start')

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/menu$/)
  await expect(page.getByRole('button', { name: 'GRAJ' })).toHaveAttribute('data-focused', 'true')

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/hub$/)
  await expect(page.getByRole('button', { name: 'Czytaj więcej' }).first()).toHaveAttribute(
    'data-focused',
    'true',
  )

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')

  const discordButton = page.getByRole('button', { name: 'Dołącz do Discorda' })
  await expect(discordButton).toHaveAttribute('data-focused', 'true')

  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')

  const rankingButton = page.getByRole('button', { name: 'Ranking graczy' })
  await expect(rankingButton).toHaveAttribute('data-focused', 'true')

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/hub\/ranking$/)

  const rankingBackButton = page.getByRole('button', { name: 'Wróć' })
  await expect(rankingBackButton).toHaveAttribute('data-focused', 'true')

  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/\/hub$/)
})

test('Dostępność: Wysoki kontrast i układ pionowy wpływają na menu', async ({ page }) => {
  await page.goto('/ustawienia/dostepnosc')

  await page.keyboard.press('Enter')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')

  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/\/ustawienia$/)
  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/\/menu$/)

  const html = page.locator('html')
  await expect(html).toHaveClass(/high-contrast/)

  const menuGrid = page.getByTestId('main-menu-grid')
  await expect(menuGrid).toHaveAttribute('data-menu-variant', 'B')

  const playButton = page.getByRole('button', { name: 'GRAJ' })
  const settingsButton = page.getByRole('button', { name: 'USTAWIENIA' })

  await expect(playButton).toHaveAttribute('data-focused', 'true')

  await page.keyboard.press('ArrowDown')
  await expect(settingsButton).toHaveAttribute('data-focused', 'true')
})

test('Osiągnięcia: Enter otwiera modal, Esc zamyka i przywraca fokus', async ({ page }) => {
  await page.goto('/profil')

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/profil\/osiagniecia$/)

  const firstCard = page.getByRole('button', { name: /Pierwszy krok, Odblokowane/ })
  await expect(firstCard).toHaveAttribute('data-focused', 'true')

  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog', { name: 'Pierwszy krok' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(firstCard).toHaveAttribute('data-focused', 'true')
})

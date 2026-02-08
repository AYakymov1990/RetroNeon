import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SettingsProvider } from '../../app/SettingsProvider'
import { focusManager } from '../../focus/FocusManager'
import { useGlobalFocusNavigation } from '../../focus/useGlobalFocusNavigation'
import { ProfileAchievementsScreen } from '../../screens/ProfileAchievementsScreen'
import { ProfileScreen } from '../../screens/ProfileScreen'
import { ProfileStatsScreen } from '../../screens/ProfileStatsScreen'

function AppTestRoutes() {
  useGlobalFocusNavigation()

  return (
    <Routes>
      <Route path="/menu" element={<div>Menu</div>} />
      <Route path="/profil" element={<ProfileScreen />} />
      <Route path="/profil/osiagniecia" element={<ProfileAchievementsScreen />} />
      <Route path="/profil/statystyki" element={<ProfileStatsScreen />} />
    </Routes>
  )
}

function renderProfileRoutes(initialPath = '/profil') {
  return render(
    <SettingsProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <AppTestRoutes />
      </MemoryRouter>
    </SettingsProvider>,
  )
}

describe('Przepływ Profil i Osiągnięcia', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    window.localStorage.clear()
    focusManager.reset()
  })

  it('Enter na kafelku Osiągnięcia przechodzi z /profil do /profil/osiagniecia', async () => {
    renderProfileRoutes('/profil')

    await screen.findByRole('heading', { name: 'Profil gracza' })

    fireEvent.keyDown(window, { key: 'Enter' })

    expect(await screen.findByRole('heading', { name: 'Osiągnięcia' })).toBeTruthy()
  })

  it('Enter otwiera modal osiągnięcia, Esc zamyka modal i przywraca fokus na kartę', async () => {
    renderProfileRoutes('/profil/osiagniecia')

    await screen.findByRole('heading', { name: 'Osiągnięcia' })

    const firstCardLabel = 'Pierwszy krok, Odblokowane'
    const firstCard = await screen.findByRole('button', { name: firstCardLabel })

    expect(firstCard.getAttribute('data-focused')).toBe('true')

    fireEvent.keyDown(window, { key: 'Enter' })

    expect(await screen.findByRole('dialog', { name: 'Pierwszy krok' })).toBeTruthy()

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(screen.queryByRole('dialog')).toBeNull()

    const firstCardAfterClose = await screen.findByRole('button', { name: firstCardLabel })
    expect(firstCardAfterClose.getAttribute('data-focused')).toBe('true')
  })
})

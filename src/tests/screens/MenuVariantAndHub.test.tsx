import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { SettingsProvider } from '../../app/SettingsProvider'
import { focusManager } from '../../focus/FocusManager'
import { useGlobalFocusNavigation } from '../../focus/useGlobalFocusNavigation'
import { HubRankingScreen } from '../../screens/HubRankingScreen'
import { HubScreen } from '../../screens/HubScreen'
import { MainMenuScreen } from '../../screens/MainMenuScreen'

function AppTestRoutes() {
  useGlobalFocusNavigation()

  return (
    <Routes>
      <Route path="/start" element={<div>Start</div>} />
      <Route path="/menu" element={<MainMenuScreen />} />
      <Route path="/hub" element={<HubScreen />} />
      <Route path="/hub/ranking" element={<HubRankingScreen />} />
    </Routes>
  )
}

function renderRoutes(initialPath: string) {
  return render(
    <SettingsProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <AppTestRoutes />
      </MemoryRouter>
    </SettingsProvider>,
  )
}

describe('Wariant menu i przepływ Hub', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    window.localStorage.clear()
    focusManager.reset()
  })

  it('renderuje pionowy wariant menu z nawigacją góra/dół po ustawieniu w localStorage', async () => {
    window.localStorage.setItem(
      'retro-neon-accessibility',
      JSON.stringify({ highContrast: false, menuLayoutVertical: true }),
    )

    renderRoutes('/menu')

    const menuGrid = await screen.findByTestId('main-menu-grid')
    expect(menuGrid.getAttribute('data-menu-variant')).toBe('B')

    const playButton = screen.getByRole('button', { name: 'GRAJ' })
    const settingsButton = screen.getByRole('button', { name: 'USTAWIENIA' })

    expect(playButton.getAttribute('data-focused')).toBe('true')

    fireEvent.keyDown(window, { key: 'ArrowDown' })

    expect(settingsButton.getAttribute('data-focused')).toBe('true')

    fireEvent.keyDown(window, { key: 'ArrowRight' })

    expect(settingsButton.getAttribute('data-focused')).toBe('true')
  })

  it('na Hub Enter na Ranking graczy przechodzi do rankingu, a Esc wraca', async () => {
    renderRoutes('/hub')

    await screen.findByRole('heading', { name: 'Hub gier' })

    fireEvent.keyDown(window, { key: 'ArrowDown' })
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'Enter' })

    expect(await screen.findByRole('heading', { name: 'Ranking graczy' })).toBeTruthy()

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(await screen.findByRole('heading', { name: 'Hub gier' })).toBeTruthy()
  })
})

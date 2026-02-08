import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { SettingsProvider } from '../../app/SettingsProvider'
import { focusManager } from '../../focus/FocusManager'
import { useGlobalFocusNavigation } from '../../focus/useGlobalFocusNavigation'
import { SettingsAudioScreen } from '../../screens/SettingsAudioScreen'

function AppTestRoutes() {
  useGlobalFocusNavigation()

  return (
    <Routes>
      <Route path="/ustawienia" element={<div>Ustawienia</div>} />
      <Route path="/ustawienia/audio" element={<SettingsAudioScreen />} />
    </Routes>
  )
}

function renderAudioScreen() {
  return render(
    <SettingsProvider>
      <MemoryRouter initialEntries={['/ustawienia/audio']}>
        <AppTestRoutes />
      </MemoryRouter>
    </SettingsProvider>,
  )
}

describe('SettingsAudioScreen', () => {
  beforeEach(() => {
    window.localStorage.clear()
    focusManager.reset()
  })

  it('zwiększa wartość suwaka Muzyka o 5 i pokazuje komunikat po Zastosuj', async () => {
    renderAudioScreen()

    const musicSlider = await screen.findByRole('slider', { name: 'Muzyka' })
    expect(musicSlider.getAttribute('aria-valuenow')).toBe('60')

    fireEvent.keyDown(window, { key: 'ArrowDown' })
    fireEvent.keyDown(window, { key: 'ArrowRight' })

    expect(musicSlider.getAttribute('aria-valuenow')).toBe('65')

    fireEvent.keyDown(window, { key: 'ArrowDown' })
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    fireEvent.keyDown(window, { key: 'Enter' })

    expect(screen.getByText('Zapisano ustawienia audio.')).toBeTruthy()
  })
})

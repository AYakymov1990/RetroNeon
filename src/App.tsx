import { useEffect, useMemo } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useSettings } from './app/SettingsProvider'
import { useGlobalFocusNavigation } from './focus/useGlobalFocusNavigation'
import { pl } from './i18n/pl'
import { useGamepadInput } from './input/gamepad'
import { HubRankingScreen } from './screens/HubRankingScreen'
import { HubScreen } from './screens/HubScreen'
import { MainMenuScreen } from './screens/MainMenuScreen'
import { ProfileAchievementsScreen } from './screens/ProfileAchievementsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ProfileStatsScreen } from './screens/ProfileStatsScreen'
import { SettingsAccessibilityScreen } from './screens/SettingsAccessibilityScreen'
import { SettingsAudioScreen } from './screens/SettingsAudioScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { StartScreen } from './screens/StartScreen'

function App() {
  const location = useLocation()
  const { accessibility } = useSettings()

  const { isCleanMode, isHighContrastForced } = useMemo(() => {
    const query = new URLSearchParams(location.search)

    return {
      isCleanMode: query.get('clean') === '1',
      isHighContrastForced: query.get('hi') === '1',
    }
  }, [location.search])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement
    root.classList.toggle('capture-clean', isCleanMode)
    root.classList.toggle('capture-force-high-contrast', isHighContrastForced)
  }, [isCleanMode, isHighContrastForced])

  useGlobalFocusNavigation()
  useGamepadInput()

  return (
    <div className="app-shell bg-retroBg text-retroText">
      <div className="scanlines" aria-hidden="true" />
      <a href="#main-content" className="sr-only focus:not-sr-only">
        {pl.app.skipToContent}
      </a>
      <div id="main-content" aria-label={pl.app.title}>
        <Routes>
          <Route path="/" element={<Navigate to="/start" replace />} />
          <Route path="/start" element={<StartScreen />} />
          <Route path="/menu" element={<MainMenuScreen />} />
          <Route path="/hub" element={<HubScreen />} />
          <Route path="/hub/ranking" element={<HubRankingScreen />} />
          <Route path="/profil" element={<ProfileScreen />} />
          <Route path="/profil/osiagniecia" element={<ProfileAchievementsScreen />} />
          <Route path="/profil/statystyki" element={<ProfileStatsScreen />} />
          <Route path="/ustawienia" element={<SettingsScreen />} />
          <Route path="/ustawienia/audio" element={<SettingsAudioScreen />} />
          <Route path="/ustawienia/dostepnosc" element={<SettingsAccessibilityScreen />} />
          <Route path="*" element={<Navigate to="/start" replace />} />
        </Routes>
      </div>

      {!accessibility.minimalInterface && !isCleanMode ? (
        <p
          className="fixed bottom-4 right-4 z-30 max-w-sm rounded-md border border-retroAccent/45 bg-retroBg/85 px-3 py-2 text-xs text-retroText/90"
          aria-label={pl.app.controlsHintAriaLabel}
        >
          {pl.app.gamepadHint}
        </p>
      ) : null}
    </div>
  )
}

export default App

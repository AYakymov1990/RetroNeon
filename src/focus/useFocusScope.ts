import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react'
import { focusManager, type Direction, type FocusNode } from './FocusManager'

type UseFocusScopeOptions = {
  onBack?: () => void
  isActive?: boolean
}

export function useFocusScope(scopeId: string, options: UseFocusScopeOptions = {}) {
  const { onBack, isActive = true } = options

  useLayoutEffect(() => {
    if (!isActive) {
      return
    }

    focusManager.setScope(scopeId, { onBack })
    focusManager.restoreLastFocus(scopeId)
  }, [scopeId, onBack, isActive])

  const activeId = useSyncExternalStore(
    focusManager.subscribe,
    () => focusManager.getActiveId(scopeId),
    () => focusManager.getActiveId(scopeId),
  )

  const registerNode = useCallback(
    (node: FocusNode) => {
      return focusManager.registerNode(scopeId, node)
    },
    [scopeId],
  )

  const setFocus = useCallback(
    (nodeId: string) => {
      focusManager.setFocus(scopeId, nodeId)
    },
    [scopeId],
  )

  const move = useCallback((direction: Direction) => {
    focusManager.move(direction)
  }, [])

  const confirm = useCallback(() => {
    focusManager.confirm()
  }, [])

  const back = useCallback(() => {
    focusManager.back()
  }, [])

  return {
    activeId,
    registerNode,
    setFocus,
    move,
    confirm,
    back,
  }
}

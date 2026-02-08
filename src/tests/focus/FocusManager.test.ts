import type { RefObject } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { FocusManager } from '../../focus/FocusManager'

function createNodeRef() {
  const focus = vi.fn()
  const click = vi.fn()
  const element = { focus, click } as unknown as HTMLElement
  const ref = { current: element } as RefObject<HTMLElement | null>

  return { ref, focus, click }
}

describe('FocusManager', () => {
  it('w wariancie pionowym menu porusza się góra/dół, a lewo/prawo zostaje na miejscu', () => {
    const manager = new FocusManager()

    const nodePlay = createNodeRef()
    const nodeSettings = createNodeRef()
    const nodeProfile = createNodeRef()

    manager.setScope('menu')

    manager.registerNode('menu', { id: 'play', x: 0, y: 0, ref: nodePlay.ref })
    manager.registerNode('menu', { id: 'settings', x: 0, y: 1, ref: nodeSettings.ref })
    manager.registerNode('menu', { id: 'profile', x: 0, y: 2, ref: nodeProfile.ref })

    manager.setFocus('menu', 'play')
    manager.move('down')
    expect(manager.getActiveId('menu')).toBe('settings')

    manager.move('right')
    expect(manager.getActiveId('menu')).toBe('settings')

    manager.move('up')
    expect(manager.getActiveId('menu')).toBe('play')

    manager.move('left')
    expect(manager.getActiveId('menu')).toBe('play')
  })

  it('obsługuje nawigację po siatce 3xN dla kart osiągnięć', () => {
    const manager = new FocusManager()

    manager.setScope('achievements')

    const refs = Array.from({ length: 8 }, () => createNodeRef())

    refs.forEach((nodeRef, index) => {
      manager.registerNode('achievements', {
        id: `a-${index}`,
        x: index % 3,
        y: Math.floor(index / 3),
        ref: nodeRef.ref,
      })
    })

    manager.setFocus('achievements', 'a-0')

    manager.move('right')
    expect(manager.getActiveId('achievements')).toBe('a-1')

    manager.move('right')
    expect(manager.getActiveId('achievements')).toBe('a-2')

    manager.move('down')
    expect(manager.getActiveId('achievements')).toBe('a-5')

    manager.move('left')
    expect(manager.getActiveId('achievements')).toBe('a-4')

    manager.move('down')
    expect(manager.getActiveId('achievements')).toBe('a-7')
  })

  it('porusza fokusem po siatce w kierunkach prawo/lewo/góra/dół', () => {
    const manager = new FocusManager()

    const nodeA = createNodeRef()
    const nodeB = createNodeRef()
    const nodeC = createNodeRef()
    const nodeD = createNodeRef()

    manager.setScope('menu')

    manager.registerNode('menu', { id: 'a', x: 0, y: 0, ref: nodeA.ref })
    manager.registerNode('menu', { id: 'b', x: 1, y: 0, ref: nodeB.ref })
    manager.registerNode('menu', { id: 'c', x: 0, y: 1, ref: nodeC.ref })
    manager.registerNode('menu', { id: 'd', x: 1, y: 1, ref: nodeD.ref })

    manager.setFocus('menu', 'a')
    manager.move('right')
    expect(manager.getActiveId('menu')).toBe('b')

    manager.move('down')
    expect(manager.getActiveId('menu')).toBe('d')

    manager.move('left')
    expect(manager.getActiveId('menu')).toBe('c')

    manager.move('up')
    expect(manager.getActiveId('menu')).toBe('a')
  })

  it('zostaje na bieżącym elemencie, gdy w danym kierunku nie ma sąsiada', () => {
    const manager = new FocusManager()

    const nodeA = createNodeRef()
    const nodeB = createNodeRef()

    manager.setScope('menu')

    manager.registerNode('menu', { id: 'a', x: 0, y: 0, ref: nodeA.ref })
    manager.registerNode('menu', { id: 'b', x: 0, y: 1, ref: nodeB.ref })

    manager.setFocus('menu', 'b')

    manager.move('right')
    expect(manager.getActiveId('menu')).toBe('b')

    manager.move('down')
    expect(manager.getActiveId('menu')).toBe('b')

    manager.move('up')
    expect(manager.getActiveId('menu')).toBe('a')
  })

  it('restoreLastFocus przywraca zapamiętany fokus dla scope', () => {
    const manager = new FocusManager()

    const nodeA = createNodeRef()
    const nodeB = createNodeRef()

    manager.setScope('settings-audio')

    const unregisterA = manager.registerNode('settings-audio', {
      id: 'master',
      x: 0,
      y: 0,
      ref: nodeA.ref,
    })
    const unregisterB = manager.registerNode('settings-audio', {
      id: 'music',
      x: 0,
      y: 1,
      ref: nodeB.ref,
    })

    manager.setFocus('settings-audio', 'music')

    unregisterA()
    unregisterB()

    const nodeA2 = createNodeRef()
    const nodeB2 = createNodeRef()

    manager.registerNode('settings-audio', { id: 'master', x: 0, y: 0, ref: nodeA2.ref })
    manager.registerNode('settings-audio', { id: 'music', x: 0, y: 1, ref: nodeB2.ref })

    manager.restoreLastFocus('settings-audio')

    expect(manager.getActiveId('settings-audio')).toBe('music')
  })

  it('confirm i back wywołują odpowiednie akcje', () => {
    const manager = new FocusManager()
    const onConfirm = vi.fn()
    const onBack = vi.fn()
    const node = createNodeRef()

    manager.setScope('menu', { onBack })
    manager.registerNode('menu', {
      id: 'apply',
      x: 0,
      y: 0,
      ref: node.ref,
      onConfirm,
    })

    manager.setFocus('menu', 'apply')
    manager.confirm()
    manager.back()

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})

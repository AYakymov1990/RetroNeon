import type { RefObject } from 'react'
import { playUiClick } from '../input/uiSound'

export type Direction = 'up' | 'down' | 'left' | 'right'

export type FocusNode = {
  id: string
  x: number
  y: number
  ref: RefObject<HTMLElement | null>
  enabled?: boolean
  visible?: boolean
  onConfirm?: () => void
  onDirection?: (direction: Direction) => boolean | void
}

type ScopeState = {
  nodes: Map<string, FocusNode>
  activeId: string | null
  lastFocusedId: string | null
  onBack?: () => void
}

type ScopeHandlers = {
  onBack?: () => void
}

export class FocusManager {
  private scopes = new Map<string, ScopeState>()
  private activeScopeId: string | null = null
  private listeners = new Set<() => void>()
  private pendingDirections: Array<{ direction: Direction; createdAt: number }> = []
  private pendingFlushHandle: number | null = null
  private readonly pendingDirectionTtlMs = 300

  reset() {
    this.clearPendingDirections()
    this.scopes.clear()
    this.activeScopeId = null
    this.notify()
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  setScope(scopeId: string, handlers?: ScopeHandlers) {
    const scope = this.ensureScope(scopeId)
    scope.onBack = handlers?.onBack
    this.activeScopeId = scopeId

    if (scope.activeId) {
      this.focusNode(scope, scope.activeId)
    }

    this.notify()
    this.schedulePendingDirectionsFlush()
  }

  getActiveId(scopeId: string): string | null {
    return this.ensureScope(scopeId).activeId
  }

  registerNode(scopeId: string, node: FocusNode): () => void {
    const scope = this.ensureScope(scopeId)
    scope.nodes.set(node.id, node)

    if (!scope.activeId) {
      if (scope.lastFocusedId) {
        if (scope.lastFocusedId === node.id && this.isFocusable(node)) {
          this.setFocus(scopeId, node.id)
        }
      } else if (this.isFocusable(node)) {
        this.setFocus(scopeId, node.id)
      }
    }

    if (this.activeScopeId === scopeId) {
      this.schedulePendingDirectionsFlush()
    }

    return () => {
      const currentScope = this.scopes.get(scopeId)
      if (!currentScope) {
        return
      }

      currentScope.nodes.delete(node.id)

      if (currentScope.activeId === node.id) {
        currentScope.activeId = null
      }

      this.notify()
    }
  }

  restoreLastFocus(scopeId: string) {
    const scope = this.ensureScope(scopeId)

    if (scope.lastFocusedId) {
      const lastNode = scope.nodes.get(scope.lastFocusedId)
      if (lastNode && this.isFocusable(lastNode)) {
        this.setFocus(scopeId, lastNode.id)
        return
      }
    }

    const firstNode = this.getFirstFocusableNode(scope)
    if (firstNode) {
      this.setFocus(scopeId, firstNode.id)
    }
  }

  setFocus(scopeId: string, nodeId: string) {
    const scope = this.ensureScope(scopeId)
    const node = scope.nodes.get(nodeId)

    if (!node || !this.isFocusable(node)) {
      return
    }

    scope.activeId = nodeId
    scope.lastFocusedId = nodeId

    if (this.activeScopeId === scopeId) {
      this.focusNode(scope, nodeId)
    }

    this.notify()
  }

  move(direction: Direction) {
    if (!this.activeScopeId) {
      return
    }

    const scope = this.ensureScope(this.activeScopeId)
    let currentNode = scope.activeId ? scope.nodes.get(scope.activeId) : null

    if (!currentNode || !this.isFocusable(currentNode)) {
      this.restoreLastFocus(this.activeScopeId)
      currentNode = scope.activeId ? scope.nodes.get(scope.activeId) : null
      if (!currentNode || !this.isFocusable(currentNode)) {
        this.enqueuePendingDirection(direction)
        return
      }
    }

    const directionHandled = currentNode.onDirection?.(direction) === true
    if (directionHandled) {
      return
    }

    const focusableNodes = this.getFocusableNodes(scope)
    const nextNode = this.getDirectionalNode(currentNode, focusableNodes, direction)

    if (!nextNode) {
      return
    }

    this.setFocus(this.activeScopeId, nextNode.id)
  }

  confirm() {
    if (!this.activeScopeId) {
      return
    }

    const scope = this.ensureScope(this.activeScopeId)
    const activeNode = scope.activeId ? scope.nodes.get(scope.activeId) : null

    if (!activeNode || !this.isFocusable(activeNode)) {
      return
    }

    if (activeNode.onConfirm) {
      playUiClick()
      activeNode.onConfirm()
      return
    }

    activeNode.ref.current?.click()
  }

  back() {
    if (!this.activeScopeId) {
      return
    }

    const scope = this.ensureScope(this.activeScopeId)
    scope.onBack?.()
  }

  private ensureScope(scopeId: string): ScopeState {
    const scope = this.scopes.get(scopeId)

    if (scope) {
      return scope
    }

    const newScope: ScopeState = {
      nodes: new Map<string, FocusNode>(),
      activeId: null,
      lastFocusedId: null,
    }

    this.scopes.set(scopeId, newScope)
    return newScope
  }

  private enqueuePendingDirection(direction: Direction) {
    this.pendingDirections.push({
      direction,
      createdAt: this.getNow(),
    })

    if (this.pendingDirections.length > 6) {
      this.pendingDirections = this.pendingDirections.slice(-6)
    }

    this.schedulePendingDirectionsFlush()
  }

  private schedulePendingDirectionsFlush() {
    if (this.pendingFlushHandle !== null) {
      return
    }

    if (typeof window === 'undefined') {
      this.flushPendingDirections()
      return
    }

    this.pendingFlushHandle = window.requestAnimationFrame(() => {
      this.pendingFlushHandle = null
      this.flushPendingDirections()
    })
  }

  private flushPendingDirections() {
    if (!this.activeScopeId || this.pendingDirections.length === 0) {
      return
    }

    const now = this.getNow()
    const directions = this.pendingDirections
      .filter((item) => now - item.createdAt <= this.pendingDirectionTtlMs)
      .map((item) => item.direction)

    this.pendingDirections = []

    for (const direction of directions) {
      this.move(direction)
    }
  }

  private clearPendingDirections() {
    this.pendingDirections = []

    if (this.pendingFlushHandle !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.pendingFlushHandle)
    }

    this.pendingFlushHandle = null
  }

  private getNow() {
    if (typeof performance !== 'undefined') {
      return performance.now()
    }

    return Date.now()
  }

  private notify() {
    for (const listener of this.listeners) {
      listener()
    }
  }

  private isFocusable(node: FocusNode): boolean {
    if (node.enabled === false || node.visible === false) {
      return false
    }

    return Boolean(node.ref.current)
  }

  private getFocusableNodes(scope: ScopeState): FocusNode[] {
    return Array.from(scope.nodes.values()).filter((node) => this.isFocusable(node))
  }

  private getFirstFocusableNode(scope: ScopeState): FocusNode | null {
    const ordered = this.getFocusableNodes(scope).sort((a, b) => {
      if (a.y === b.y) {
        return a.x - b.x
      }

      return a.y - b.y
    })

    return ordered[0] ?? null
  }

  private focusNode(scope: ScopeState, nodeId: string) {
    const node = scope.nodes.get(nodeId)
    if (!node || !this.isFocusable(node)) {
      return
    }

    node.ref.current?.focus({ preventScroll: true })
  }

  private getDirectionalNode(
    current: FocusNode,
    nodes: FocusNode[],
    direction: Direction,
  ): FocusNode | null {
    const targetX =
      direction === 'left' ? current.x - 1 : direction === 'right' ? current.x + 1 : current.x
    const targetY = direction === 'up' ? current.y - 1 : direction === 'down' ? current.y + 1 : current.y

    return nodes.find((node) => node.x === targetX && node.y === targetY) ?? current
  }
}

export const focusManager = new FocusManager()

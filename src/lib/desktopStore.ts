'use client'

import { create } from 'zustand'

export type DesktopWindowId =
  | 'welcome'
  | 'about'
  | 'this-computer'
  | 'articles'
  | 'search'
  | 'resume'
  | 'skills'
  | 'credits'
  | 'notes'
  | 'projects'
  | 'terminal'

export type ExplorerFolderId = 'root' | 'articles' | 'dreams' | 'about'

export type DesktopPoint = {
  x: number
  y: number
}

export type DesktopWindowState = {
  id: DesktopWindowId
  minimized: boolean
  position: DesktopPoint | null
  title: string
  zIndex: number
}

type DesktopSession = 'boot' | 'login' | 'desktop'
type BootDestination = 'login' | 'desktop'

type DesktopStore = {
  bootDestination: BootDestination
  bootGeneration: number
  closeShutdown: () => void
  closeStartMenu: () => void
  closeWindow: (id: DesktopWindowId) => void
  completeBoot: () => void
  enterDesktop: () => void
  explorerFolder: ExplorerFolderId
  focusWindow: (id: DesktopWindowId) => void
  focusedWindowId: DesktopWindowId | null
  logOff: () => void
  minimizeWindow: (id: DesktopWindowId) => void
  nextZIndex: number
  openExplorer: (folder: ExplorerFolderId) => void
  openShutdown: () => void
  openWindow: (id: DesktopWindowId, title: string) => void
  restart: () => void
  restoreWindow: (id: DesktopWindowId) => void
  session: DesktopSession
  setExplorerFolder: (folder: ExplorerFolderId) => void
  setWindowPosition: (id: DesktopWindowId, position: DesktopPoint) => void
  setWindowTitle: (id: DesktopWindowId, title: string) => void
  shutdownOpen: boolean
  startMenuOpen: boolean
  toggleStartMenu: () => void
  windows: DesktopWindowState[]
}

const WELCOME_TITLE = 'Welcome — custardsquare.exe'
const EXPLORER_WINDOW_ID: DesktopWindowId = 'this-computer'

export function explorerWindowTitle(folder: ExplorerFolderId): string {
  if (folder === 'articles') {
    return 'Exploring — C:\\SECOND_BRAIN\\Articles'
  }

  if (folder === 'dreams') {
    return 'Exploring — C:\\SECOND_BRAIN\\Dreams'
  }

  if (folder === 'about') {
    return 'Exploring — C:\\SECOND_BRAIN\\About'
  }

  return 'Exploring — C:\\SECOND_BRAIN'
}

function bumpZ(windows: DesktopWindowState[], id: DesktopWindowId, nextZIndex: number) {
  return {
    focusedWindowId: id,
    nextZIndex: nextZIndex + 1,
    windows: windows.map((windowState) =>
      windowState.id === id ? { ...windowState, zIndex: nextZIndex } : windowState,
    ),
  }
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  bootDestination: 'login',
  bootGeneration: 0,
  explorerFolder: 'root',
  focusedWindowId: null,
  nextZIndex: 2,
  session: 'boot',
  shutdownOpen: false,
  startMenuOpen: false,
  windows: [],

  completeBoot: () => {
    const destination = get().bootDestination
    if (destination === 'desktop') {
      get().enterDesktop()
      return
    }

    set({
      session: 'login',
      shutdownOpen: false,
      startMenuOpen: false,
    })
  },

  enterDesktop: () => {
    set({
      explorerFolder: 'root',
      focusedWindowId: 'welcome',
      nextZIndex: 3,
      session: 'desktop',
      shutdownOpen: false,
      startMenuOpen: false,
      windows: [
        {
          id: 'welcome',
          minimized: false,
          position: null,
          title: WELCOME_TITLE,
          zIndex: 2,
        },
      ],
    })
  },

  logOff: () => {
    set({
      bootDestination: 'login',
      explorerFolder: 'root',
      focusedWindowId: null,
      nextZIndex: 2,
      session: 'login',
      shutdownOpen: false,
      startMenuOpen: false,
      windows: [],
    })
  },

  restart: () => {
    set({
      bootDestination: 'desktop',
      bootGeneration: get().bootGeneration + 1,
      explorerFolder: 'root',
      focusedWindowId: null,
      nextZIndex: 2,
      session: 'boot',
      shutdownOpen: false,
      startMenuOpen: false,
      windows: [],
    })
  },

  openExplorer: (folder) => {
    const { nextZIndex, windows } = get()
    const title = explorerWindowTitle(folder)
    const existing = windows.find((windowState) => windowState.id === EXPLORER_WINDOW_ID)

    if (existing) {
      set({
        ...bumpZ(
          windows.map((windowState) =>
            windowState.id === EXPLORER_WINDOW_ID
              ? { ...windowState, minimized: false, title }
              : windowState,
          ),
          EXPLORER_WINDOW_ID,
          nextZIndex,
        ),
        explorerFolder: folder,
        startMenuOpen: false,
      })
      return
    }

    set({
      explorerFolder: folder,
      focusedWindowId: EXPLORER_WINDOW_ID,
      nextZIndex: nextZIndex + 1,
      startMenuOpen: false,
      windows: [
        ...windows,
        {
          id: EXPLORER_WINDOW_ID,
          minimized: false,
          position: null,
          title,
          zIndex: nextZIndex,
        },
      ],
    })
  },

  setExplorerFolder: (folder) => {
    set({
      explorerFolder: folder,
      windows: get().windows.map((windowState) =>
        windowState.id === EXPLORER_WINDOW_ID
          ? { ...windowState, title: explorerWindowTitle(folder) }
          : windowState,
      ),
    })
  },

  setWindowTitle: (id, title) => {
    set({
      windows: get().windows.map((windowState) =>
        windowState.id === id ? { ...windowState, title } : windowState,
      ),
    })
  },

  openWindow: (id, title) => {
    const { nextZIndex, windows } = get()
    const existing = windows.find((windowState) => windowState.id === id)

    if (existing) {
      set({
        ...bumpZ(
          windows.map((windowState) =>
            windowState.id === id
              ? { ...windowState, minimized: false, title }
              : windowState,
          ),
          id,
          nextZIndex,
        ),
        startMenuOpen: false,
      })
      return
    }

    set({
      focusedWindowId: id,
      nextZIndex: nextZIndex + 1,
      startMenuOpen: false,
      windows: [
        ...windows,
        {
          id,
          minimized: false,
          position: null,
          title,
          zIndex: nextZIndex,
        },
      ],
    })
  },

  closeWindow: (id) => {
    const { focusedWindowId, windows } = get()
    const remaining = windows.filter((windowState) => windowState.id !== id)
    const nextFocused =
      focusedWindowId === id
        ? [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
        : focusedWindowId

    set({
      focusedWindowId: nextFocused,
      windows: remaining,
    })
  },

  minimizeWindow: (id) => {
    const { focusedWindowId, windows } = get()
    const nextWindows = windows.map((windowState) =>
      windowState.id === id ? { ...windowState, minimized: true } : windowState,
    )
    const visible = [...nextWindows]
      .filter((windowState) => !windowState.minimized)
      .sort((a, b) => b.zIndex - a.zIndex)

    set({
      focusedWindowId: focusedWindowId === id ? (visible[0]?.id ?? null) : focusedWindowId,
      windows: nextWindows,
    })
  },

  restoreWindow: (id) => {
    const { nextZIndex, windows } = get()
    set({
      ...bumpZ(
        windows.map((windowState) =>
          windowState.id === id ? { ...windowState, minimized: false } : windowState,
        ),
        id,
        nextZIndex,
      ),
      startMenuOpen: false,
    })
  },

  focusWindow: (id) => {
    const { nextZIndex, windows } = get()
    const target = windows.find((windowState) => windowState.id === id)
    if (!target) {
      return
    }

    set({
      ...bumpZ(
        windows.map((windowState) =>
          windowState.id === id ? { ...windowState, minimized: false } : windowState,
        ),
        id,
        nextZIndex,
      ),
      startMenuOpen: false,
    })
  },

  setWindowPosition: (id, position) => {
    set({
      windows: get().windows.map((windowState) =>
        windowState.id === id ? { ...windowState, position } : windowState,
      ),
    })
  },

  toggleStartMenu: () => {
    set((state) => ({
      shutdownOpen: false,
      startMenuOpen: !state.startMenuOpen,
    }))
  },

  closeStartMenu: () => set({ startMenuOpen: false }),

  openShutdown: () => set({ shutdownOpen: true, startMenuOpen: false }),

  closeShutdown: () => set({ shutdownOpen: false }),
}))

export function getOpenWindows(windows: DesktopWindowState[]) {
  return [...windows].sort((a, b) => a.zIndex - b.zIndex)
}
